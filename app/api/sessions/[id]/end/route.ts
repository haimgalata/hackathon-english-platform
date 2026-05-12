import { NextResponse } from "next/server";
import { fail, ok } from "@/server/lib/response";
import { prisma } from "@/server/lib/prisma";
import { requireAppUser } from "@/server/services/auth/user.service";

export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireAppUser();
    const { id } = await params;

    const session = await prisma.session.findFirst({
      where: { id, userId: user.id },
    });
    if (!session) return NextResponse.json(fail("Session not found"), { status: 404 });

    const completed = await prisma.session.update({
      where: { id },
      data: { status: "COMPLETED", endedAt: new Date() },
    });

    await prisma.progressSnapshot.upsert({
      where: { userId: user.id },
      update: {
        completedSessions: { increment: 1 },
        mistakesCount: { increment: completed.mistakes },
      },
      create: {
        userId: user.id,
        completedSessions: 1,
        mistakesCount: completed.mistakes,
      },
    });

    return NextResponse.json(ok(completed));
  } catch (error) {
    return NextResponse.json(fail("Unable to end session", String(error)), { status: 500 });
  }
}
