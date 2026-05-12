"use client";

import { useState } from "react";

export type ChatMessage = { speaker: "STUDENT" | "TECHY"; text: string };
export type Feedback = { wrong: string; better: string; why: string } | null;

export function useRealtimeConversation(sessionId: string, initialText: string) {
  const [messages, setMessages] = useState<ChatMessage[]>([{ speaker: "TECHY", text: initialText }]);
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [loading, setLoading] = useState(false);

  async function sendTurn(transcript: string) {
    setLoading(true);
    setMessages((prev) => [...prev, { speaker: "STUDENT", text: transcript }]);
    const response = await fetch(`/api/sessions/${sessionId}/turn`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ transcript }),
    });
    const payload = await response.json();
    if (payload?.data?.reply) {
      setMessages((prev) => [...prev, { speaker: "TECHY", text: payload.data.reply }]);
    }
    setFeedback(payload?.data?.feedback ?? null);
    setLoading(false);
    return payload?.data?.reply as string | undefined;
  }

  return { messages, feedback, loading, sendTurn };
}
