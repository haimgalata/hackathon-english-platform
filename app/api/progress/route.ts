import { NextResponse } from "next/server";
import { prisma } from "@/server/lib/prisma";
import { ok } from "@/server/lib/response";
import { requireAppUser } from "@/server/services/auth/user.service";

export async function GET() {
  const user = await requireAppUser();

  const [snapshot, recentSessions] = await Promise.all([
    prisma.progressSnapshot.findUnique({ where: { userId: user.id } }),
    prisma.session.findMany({
      where: { userId: user.id, status: "COMPLETED" },
      include: { scenario: true },
      orderBy: { endedAt: "desc" },
      take: 5,
    }),
  ]);

  return NextResponse.json(
    ok({
      completedSessions: snapshot?.completedSessions ?? 0,
      mistakesCount: snapshot?.mistakesCount ?? 0,
      learnedVocabulary: snapshot?.learnedVocabulary ?? 0,
      gamesCompleted: snapshot?.gamesCompleted ?? 0,
      recentSessions,
    }),
  );
}
