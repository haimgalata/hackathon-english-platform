import { NextResponse } from "next/server";
import { prisma } from "@/server/lib/prisma";
import { ok } from "@/server/lib/response";

export async function GET() {
  const scenarios = await prisma.scenario.findMany({
    orderBy: { title: "asc" },
  });
  return NextResponse.json(ok(scenarios));
}
