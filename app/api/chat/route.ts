import { NextRequest, NextResponse } from 'next/server';
import { createGroqClient, GROQ_CHAT_MODEL } from '@/lib/groq';
import { getDb } from '@/lib/mongodb';
import { isScenarioKey } from '@/lib/mongoSerializers';
import { buildSystemPrompt, buildOpeningSystemPrompt } from '@/lib/scenarios';
import type { ScenarioKey, Feedback } from '@/types';

const OPENING_USER_STUB =
  '[Session start — the student has not spoken. Send your opening JSON now.]';

interface ChatRequestBody {
  studentId: string;
  sessionId: string;
  message?: string;
  scenario: ScenarioKey;
  history: Array<{ role: 'user' | 'assistant'; content: string }>;
  opening?: boolean;
}

async function readJsonBody(req: NextRequest): Promise<ChatRequestBody | null> {
  const text = await req.text();
  if (!text.trim()) return null;
  try {
    return JSON.parse(text) as ChatRequestBody;
  } catch {
    return null;
  }
}

export async function POST(req: NextRequest) {
  const body = await readJsonBody(req);
  if (!body || typeof body !== 'object') {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { studentId, sessionId, message, scenario, opening } = body;
  const history = Array.isArray(body.history) ? body.history : [];

  if (!isScenarioKey(scenario)) {
    return NextResponse.json({ error: 'scenario is required' }, { status: 400 });
  }

  if (!opening && !message?.trim()) {
    return NextResponse.json({ error: 'message and scenario are required' }, { status: 400 });
  }

  const messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = opening
    ? [
        { role: 'system', content: buildOpeningSystemPrompt(scenario) },
        { role: 'user', content: OPENING_USER_STUB },
      ]
    : [
        { role: 'system', content: buildSystemPrompt(scenario) },
        ...history.slice(-10),
        { role: 'user', content: message!.trim() },
      ];

  let groq;
  try {
    groq = createGroqClient();
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error('Groq config error:', msg);
    return NextResponse.json(
      { error: 'AI service is not configured.', detail: msg },
      { status: 503 }
    );
  }

  try {
    const completion = await groq.chat.completions.create({
      model: GROQ_CHAT_MODEL,
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

    if (studentId && sessionId) {
      void getDb()
        .then(async (db) => {
          const coll = db.collection('messages');
          const created_at = new Date();
          if (opening) {
            await coll.insertOne({
              session_id: sessionId,
              role: 'assistant',
              content: reply,
              feedback,
              created_at,
            });
          } else {
            await coll.insertMany([
              {
                session_id: sessionId,
                role: 'user',
                content: message!.trim(),
                created_at,
              },
              {
                session_id: sessionId,
                role: 'assistant',
                content: reply,
                feedback,
                created_at,
              },
            ]);
          }
        })
        .catch(() => {});
    }

    return NextResponse.json({ reply, feedback });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('Groq chat error:', msg);
    const lower = msg.toLowerCase();
    const isInvalidKey =
      lower.includes('401') &&
      (lower.includes('invalid api key') ||
        lower.includes('invalid_api_key') ||
        lower.includes('"code":"invalid_api_key"'));
    if (isInvalidKey) {
      return NextResponse.json(
        {
          error:
            'Groq API key is missing or invalid. Create a key at console.groq.com/keys and set GROQ_API_KEY in .env (no quotes or spaces). Restart the dev server after saving.',
          detail: msg,
        },
        { status: 401 }
      );
    }
    const isTimeout =
      lower.includes('timeout') || lower.includes('timed out') || lower.includes('etimedout');
    const status = isTimeout ? 504 : 503;
    return NextResponse.json(
      {
        error: isTimeout
          ? 'AI request timed out. Please try again.'
          : 'AI service unavailable. Please try again.',
        detail: msg,
      },
      { status }
    );
  }
}
