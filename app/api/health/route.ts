import { NextResponse } from "next/server";
import { ok } from "@/server/lib/response";

export async function GET() {
  return NextResponse.json(ok({ status: "ok" }));
}
