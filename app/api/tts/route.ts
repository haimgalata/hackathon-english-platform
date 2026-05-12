import { NextResponse } from "next/server";
import { fail, ok } from "@/server/lib/response";
import { ttsSchema } from "@/server/validators/session";
import { synthesizeTechyVoice } from "@/server/services/tts/elevenlabs.service";

export async function POST(req: Request) {
  try {
    const parsed = ttsSchema.safeParse(await req.json());
    if (!parsed.success) return NextResponse.json(fail("Invalid body", parsed.error.flatten()), { status: 400 });

    const result = await synthesizeTechyVoice(parsed.data.text);
    return NextResponse.json(ok(result));
  } catch (error) {
    return NextResponse.json(fail("TTS error", String(error)), { status: 500 });
  }
}
