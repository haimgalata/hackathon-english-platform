import OpenAI from "openai";
import { techySystemPrompt } from "./prompts/techy.system";
import { scenarioInstructions } from "./prompts/scenario.prompts";

const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

export type HistoryTurn = {
  speaker: "STUDENT" | "TECHY";
  transcript: string;
};

type TechyInput = {
  scenarioSlug: string;
  scenarioTitle: string;
  studentMessage: string;
  history: HistoryTurn[];
};

export async function getTechyReply(input: TechyInput): Promise<string> {
  const scenarioContext =
    scenarioInstructions[input.scenarioSlug] ??
    `Help the student practice English in the "${input.scenarioTitle}" scenario.`;

  if (!openai) {
    return `Great effort! Can you tell me one more detail about that?`;
  }

  const systemContent = `${techySystemPrompt}\n\nScenario context: ${scenarioContext}`;

  const historyMessages = input.history.map((turn) => ({
    role: turn.speaker === "STUDENT" ? ("user" as const) : ("assistant" as const),
    content: turn.transcript,
  }));

  const result = await openai.responses.create({
    model: "gpt-4o-mini",
    input: [
      { role: "system", content: systemContent },
      ...historyMessages,
      { role: "user", content: input.studentMessage },
    ],
    max_output_tokens: 120,
  });

  return result.output_text?.trim() || "Nice answer! Can you explain it one more way?";
}
