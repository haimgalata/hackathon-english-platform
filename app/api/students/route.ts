import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { studentDefaults, toStudentApi } from '@/lib/mongoSerializers';

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

export async function GET() {
  try {
    const db = await getDb();
    const rows = await db
      .collection('students')
      .aggregate([
        { $sort: { score: -1 } },
        {
          $lookup: {
            from: 'chat_sessions',
            let: { sid: { $toString: '$_id' } },
            pipeline: [
              { $match: { $expr: { $eq: ['$student_id', '$$sid'] } } },
              { $count: 'c' },
            ],
            as: '_sc',
          },
        },
        {
          $set: {
            session_count: {
              $ifNull: [{ $arrayElemAt: ['$_sc.c', 0] }, 0],
            },
          },
        },
        { $project: { _sc: 0 } },
      ])
      .toArray();

    const students = rows
      .map((doc) => toStudentApi(doc))
      .filter((s): s is NonNullable<typeof s> => s != null);

    return NextResponse.json(students);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    if (msg.includes('MONGODB_URI')) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
    }
    console.error('GET /api/students:', msg);
    return NextResponse.json({ error: msg }, { status: 500 });
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

  const usernameRaw = body.username;
  if (typeof usernameRaw !== 'string' || !usernameRaw.trim()) {
    return NextResponse.json({ error: 'username is required' }, { status: 400 });
  }

  const username = usernameRaw.trim().toLowerCase();
  const display_name =
    typeof body.display_name === 'string' && body.display_name.trim()
      ? body.display_name.trim()
      : usernameRaw.trim();

  try {
    const db = await getDb();
    const coll = db.collection('students');
    const now = new Date();

    const existing = await coll.findOne({ username });
    if (existing) {
      await coll.updateOne({ _id: existing._id }, { $set: { last_active_at: now } });
      const updated = await coll.findOne({ _id: existing._id });
      return NextResponse.json(toStudentApi(updated!));
    }

    const inserted = await coll.insertOne({
      username,
      display_name,
      ...studentDefaults(),
    });
    const created = await coll.findOne({ _id: inserted.insertedId });
    return NextResponse.json(toStudentApi(created!), { status: 201 });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    if (msg.includes('MONGODB_URI')) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
    }
    console.error('POST /api/students:', msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
