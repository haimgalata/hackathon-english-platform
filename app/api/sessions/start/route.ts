import { NextResponse } from "next/server";
import { prisma } from "@/server/lib/prisma";
import { fail, ok } from "@/server/lib/response";
import { requireAppUser } from "@/server/services/auth/user.service";
import { startSessionSchema } from "@/server/validators/session";

export async function POST(req: Request) {
  try {
    const user = await requireAppUser();
    const parsed = startSessionSchema.safeParse(await req.json());
    if (!parsed.success) return NextResponse.json(fail("Invalid body", parsed.error.flatten()), { status: 400 });

    const session = await prisma.session.create({
      data: {
        userId: user.id,
        scenarioId: parsed.data.scenarioId,
      },
      include: { scenario: true },
    });

    await prisma.sessionTurn.create({
      data: {
        sessionId: session.id,
        speaker: "TECHY",
        transcript: session.scenario.starter,
      },
    });

    return NextResponse.json(ok(session), { status: 201 });
  } catch (error) {
    return NextResponse.json(fail("Unable to start session", String(error)), { status: 500 });
  }
}
