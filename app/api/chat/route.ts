import { NextRequest, NextResponse } from 'next/server';
import { openai } from '@/lib/openai';
import { supabase } from '@/lib/supabase';
import { buildSystemPrompt } from '@/lib/scenarios';
import type { ScenarioKey, Feedback } from '@/types';

interface ChatRequestBody {
  studentId: string;
  sessionId: string;
  message: string;
  scenario: ScenarioKey;
  history: Array<{ role: 'user' | 'assistant'; content: string }>;
}

export async function POST(req: NextRequest) {
  const body: ChatRequestBody = await req.json();
  const { studentId, sessionId, message, scenario, history } = body;

  if (!message || !scenario) {
    return NextResponse.json({ error: 'message and scenario are required' }, { status: 400 });
  }

  const systemPrompt = buildSystemPrompt(scenario);

  // Build messages array for GPT
  const messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
    { role: 'system', content: systemPrompt },
    ...history.slice(-10), // keep last 10 turns for context
    { role: 'user', content: message },
  ];

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages,
      response_format: { type: 'json_object' },
      temperature: 0.7,
      max_tokens: 400,
    });

    const rawContent = completion.choices[0]?.message?.content ?? '{}';
    let parsed: { reply: string; feedback: Feedback };

    try {
      parsed = JSON.parse(rawContent);
    } catch {
      parsed = {
        reply: "Sorry, I had a little glitch! Can you say that again?",
        feedback: { corrections: [], suggestions: [], scoreEarned: 0 },
      };
    }

    const { reply, feedback } = parsed;

    // Persist messages to DB (non-blocking — don't await)
    if (studentId && sessionId) {
      Promise.all([
        supabase.from('messages').insert({
          session_id: sessionId,
          role: 'user',
          content: message,
        }),
        supabase.from('messages').insert({
          session_id: sessionId,
          role: 'assistant',
          content: reply,
          feedback,
        }),
      ]).catch(() => {}); // silently ignore DB errors during demo
    }

    return NextResponse.json({ reply, feedback });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('OpenAI error:', msg);
    return NextResponse.json(
      { error: 'AI service unavailable. Please try again.', detail: msg },
      { status: 503 }
    );
  }
}
