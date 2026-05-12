import OpenAI from 'openai';

/** OpenAI client used only for TTS (`/api/tts`). Chat uses Groq (`lib/groq.ts`). */
let _openai: OpenAI | null = null;

/** Lazy singleton so `next build` does not require OPENAI_API_KEY at module load. */
export function getOpenAI(): OpenAI {
  if (_openai) return _openai;
  const apiKey = process.env.OPENAI_API_KEY?.trim();
  if (!apiKey) {
    throw new Error('Missing OPENAI_API_KEY');
  }
  _openai = new OpenAI({ apiKey });
  return _openai;
}
