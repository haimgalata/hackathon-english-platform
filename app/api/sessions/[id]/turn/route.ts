import { NextResponse } from "next/server";
import { fail, ok } from "@/server/lib/response";
import { prisma } from "@/server/lib/prisma";
import { sessionTurnSchema } from "@/server/validators/session";
import { requireAppUser } from "@/server/services/auth/user.service";
import { generateBasicFeedback } from "@/server/services/feedback/feedback.service";
import { getTechyReply } from "@/server/services/ai/conversation.service";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireAppUser();
    const { id } = await params;
    const parsed = sessionTurnSchema.safeParse(await req.json());
    if (!parsed.success) return NextResponse.json(fail("Invalid body", parsed.error.flatten()), { status: 400 });

    const session = await prisma.session.findFirst({
      where: { id, userId: user.id },
      include: { scenario: true },
    });
    if (!session) return NextResponse.json(fail("Session not found"), { status: 404 });

    // Load conversation history before saving the new student turn
    const previousTurns = await prisma.sessionTurn.findMany({
      where: { sessionId: id },
      orderBy: { createdAt: "asc" },
      take: 20,
      select: { speaker: true, transcript: true },
    });

    // Save the student's turn
    await prisma.sessionTurn.create({
      data: { sessionId: id, speaker: "STUDENT", transcript: parsed.data.transcript },
    });

    const feedback = generateBasicFeedback(parsed.data.transcript);
    if (feedback) {
      await prisma.feedbackItem.create({
        data: { sessionId: id, ...feedback },
      });
      await prisma.session.update({ where: { id }, data: { mistakes: { increment: 1 } } });
    }

    const reply = await getTechyReply({
      scenarioSlug: session.scenario.slug,
      scenarioTitle: session.scenario.title,
      studentMessage: parsed.data.transcript,
      history: previousTurns,
    });

    await prisma.sessionTurn.create({
      data: { sessionId: id, speaker: "TECHY", transcript: reply },
    });

    return NextResponse.json(ok({ reply, feedback }));
  } catch (error) {
    return NextResponse.json(fail("Unable to process turn", String(error)), { status: 500 });
  }
}
