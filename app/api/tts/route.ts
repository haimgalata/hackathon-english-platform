import { NextRequest, NextResponse } from 'next/server';
import { getOpenAI } from '@/lib/openai';

export async function POST(req: NextRequest) {
  let text: string;
  try {
    const body = await req.json();
    text = typeof body?.text === 'string' ? body.text : '';
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  if (!text) return NextResponse.json({ error: 'text is required' }, { status: 400 });

  let openai;
  try {
    openai = getOpenAI();
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error('TTS config:', msg);
    return NextResponse.json(
      { error: 'TTS is not configured (missing OPENAI_API_KEY).' },
      { status: 503 }
    );
  }

  try {
    const mp3 = await openai.audio.speech.create({
      model: 'tts-1',
      voice: 'nova',
      input: text.slice(0, 500), // safety limit
    });

    const buffer = Buffer.from(await mp3.arrayBuffer());

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': buffer.length.toString(),
      },
    });
  } catch (err) {
    console.error('TTS error:', err);
    return NextResponse.json({ error: 'TTS unavailable' }, { status: 503 });
  }
}
