import { NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';

export async function GET() {
  try {
    const db = await getDb();
    const result = await db.collection('test_runs').insertOne({
      at: new Date(),
      source: 'speaktech-test-db',
    });
    return NextResponse.json({
      ok: true,
      insertedId: result.insertedId.toString(),
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
