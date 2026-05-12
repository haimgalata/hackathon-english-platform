import { NextResponse } from "next/server";
import { fail, ok } from "@/server/lib/response";
import { requireAppUser } from "@/server/services/auth/user.service";
import { gameSubmitSchema } from "@/server/validators/session";
import { prisma } from "@/server/lib/prisma";

export async function POST(req: Request) {
  try {
    const user = await requireAppUser();
    const parsed = gameSubmitSchema.safeParse(await req.json());
    if (!parsed.success) return NextResponse.json(fail("Invalid body", parsed.error.flatten()), { status: 400 });

    const score = parsed.data.answers.filter((answer) => answer.correct).length;

    const game = await prisma.gameSession.create({
      data: {
        userId: user.id,
        score,
        answers: {
          createMany: {
            data: parsed.data.answers.map((answer) => ({
              termId: answer.termId,
              correct: answer.correct,
            })),
          },
        },
      },
    });

    await prisma.progressSnapshot.upsert({
      where: { userId: user.id },
      update: {
        gamesCompleted: { increment: 1 },
        learnedVocabulary: { increment: score },
      },
      create: {
        userId: user.id,
        gamesCompleted: 1,
        learnedVocabulary: score,
      },
    });

    return NextResponse.json(ok({ gameId: game.id, score }));
  } catch (error) {
    return NextResponse.json(fail("Unable to submit game", String(error)), { status: 500 });
  }
}
