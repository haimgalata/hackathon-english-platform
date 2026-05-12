import Groq from 'groq-sdk';

/** Groq chat client. Throws if `GROQ_API_KEY` is missing (call from route try/catch). */
export function createGroqClient(): Groq {
  const apiKey = process.env.GROQ_API_KEY?.trim();
  if (!apiKey) {
    throw new Error('Missing GROQ_API_KEY');
  }
  return new Groq({ apiKey, timeout: 60_000 });
}

export const GROQ_CHAT_MODEL = 'llama-3.3-70b-versatile';
