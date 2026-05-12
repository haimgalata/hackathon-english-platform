import { NextResponse } from "next/server";
import { fail, ok } from "@/server/lib/response";

export async function POST() {
  const apiKey = process.env.OPENAI_API_KEY;
  const model = process.env.OPENAI_REALTIME_MODEL ?? "gpt-4o-realtime-preview";
  if (!apiKey) {
    return NextResponse.json(ok({ mode: "mock", model }));
  }

  try {
    const response = await fetch("https://api.openai.com/v1/realtime/sessions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        voice: "alloy",
        modalities: ["text", "audio"],
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      return NextResponse.json(fail("Failed to create realtime session", data), { status: 500 });
    }
    return NextResponse.json(ok(data));
  } catch (error) {
    return NextResponse.json(fail("Realtime token error", String(error)), { status: 500 });
  }
}
