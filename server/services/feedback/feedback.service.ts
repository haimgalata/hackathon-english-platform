import { FeedbackType } from "@prisma/client";

export type FeedbackCandidate = {
  wrong: string;
  better: string;
  why: string;
  type: FeedbackType;
};

export function generateBasicFeedback(transcript: string): FeedbackCandidate | null {
  if (transcript.toLowerCase().includes("i am agree")) {
    return {
      wrong: transcript,
      better: transcript.replace(/i am agree/gi, "I agree"),
      why: "In English, we say 'I agree' and not 'I am agree'.",
      type: FeedbackType.GRAMMAR,
    };
  }

  if (transcript.toLowerCase().includes("bag in code")) {
    return {
      wrong: transcript,
      better: transcript.replace(/bag/gi, "bug"),
      why: "In software, we use 'bug' for an error in code.",
      type: FeedbackType.TERMINOLOGY,
    };
  }

  return null;
}
