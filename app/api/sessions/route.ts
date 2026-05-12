import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { isScenarioKey, parseObjectId, toSessionApi } from '@/lib/mongoSerializers';

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

export async function POST(req: NextRequest) {
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

  const studentId = body.studentId;
  const scenario = body.scenario;

  if (typeof studentId !== 'string' || !studentId.trim()) {
    return NextResponse.json({ error: 'studentId is required' }, { status: 400 });
  }
  if (!isScenarioKey(scenario)) {
    return NextResponse.json({ error: 'scenario is required and must be valid' }, { status: 400 });
  }

  const oid = parseObjectId(studentId.trim());
  if (!oid) {
    return NextResponse.json({ error: 'Invalid studentId' }, { status: 400 });
  }

  try {
    const db = await getDb();
    const students = db.collection('students');
    const student = await students.findOne({ _id: oid });
    if (!student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    const now = new Date();
    const inserted = await db.collection('chat_sessions').insertOne({
      student_id: oid.toString(),
      scenario,
      started_at: now,
      message_count: 0,
      score_earned: 0,
    });

    const doc = await db.collection('chat_sessions').findOne({ _id: inserted.insertedId });
    return NextResponse.json(toSessionApi(doc!), { status: 201 });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    if (msg.includes('MONGODB_URI')) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
    }
    console.error('POST /api/sessions:', msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
