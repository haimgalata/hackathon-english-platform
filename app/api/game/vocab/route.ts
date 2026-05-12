import { NextResponse } from "next/server";
import { prisma } from "@/server/lib/prisma";
import { ok } from "@/server/lib/response";

export async function GET() {
  const terms = await prisma.vocabularyTerm.findMany({
    where: { isActive: true },
    take: 8,
  });
  return NextResponse.json(ok(terms));
}
