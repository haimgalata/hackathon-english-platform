import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { parseObjectId, toSessionApi } from '@/lib/mongoSerializers';

async function readJsonObject(req: NextRequest): Promise<Record<string, unknown>> {
  const text = await req.text();
  if (!text.trim()) {
    throw new Error('EMPTY_BODY');
  }
  try {
    const v = JSON.parse(text) as unknown;
    if (typeof v !== 'object' || v === null || Array.isArray(v)) {
      throw new Error('INVALID_BODY');
    }
    return v as Record<string, unknown>;
  } catch {
    throw new Error('INVALID_JSON');
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const sid = parseObjectId(params.id);
  if (!sid) {
    return NextResponse.json({ error: 'Session not found' }, { status: 404 });
  }

  let body: Record<string, unknown>;
  try {
    body = await readJsonObject(req);
  } catch (e) {
    const code = e instanceof Error ? e.message : '';
    if (code === 'EMPTY_BODY') {
      return NextResponse.json({ error: 'Request body is required' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  try {
    const db = await getDb();
    const coll = db.collection('chat_sessions');
    const updatePayload = { ...body, ended_at: new Date().toISOString() };

    const upd = await coll.updateOne({ _id: sid }, { $set: updatePayload });
    if (upd.matchedCount === 0) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    const doc = await coll.findOne({ _id: sid });
    if (!doc) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    return NextResponse.json(toSessionApi(doc));
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    if (msg.includes('MONGODB_URI')) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
    }
    console.error('PATCH /api/sessions/[id]:', msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
