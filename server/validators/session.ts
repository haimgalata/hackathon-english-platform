import { z } from "zod";

export const startSessionSchema = z.object({
  scenarioId: z.string().min(1),
});

export const sessionTurnSchema = z.object({
  transcript: z.string().min(1),
});

export const endSessionSchema = z.object({
  sessionId: z.string().min(1),
});

export const ttsSchema = z.object({
  text: z.string().min(1).max(600),
});

export const gameSubmitSchema = z.object({
  answers: z.array(
    z.object({
      termId: z.string(),
      correct: z.boolean(),
    }),
  ),
});
