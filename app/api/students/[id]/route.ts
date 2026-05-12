import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { parseObjectId, toStudentApi } from '@/lib/mongoSerializers';
import { xpToLevel } from '@/lib/session';

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

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const oid = parseObjectId(params.id);
  if (!oid) {
    return NextResponse.json({ error: 'Student not found' }, { status: 404 });
  }

  try {
    const db = await getDb();
    const rows = await db
      .collection('students')
      .aggregate([
        { $match: { _id: oid } },
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

    const doc = rows[0];
    if (!doc) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    return NextResponse.json(toStudentApi(doc));
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    if (msg.includes('MONGODB_URI')) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
    }
    console.error('GET /api/students/[id]:', msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const oid = parseObjectId(params.id);
  if (!oid) {
    return NextResponse.json({ error: 'Student not found' }, { status: 404 });
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

  const { xpDelta, ...rest } = body as { xpDelta?: unknown; [key: string]: unknown };

  try {
    const db = await getDb();
    const coll = db.collection('students');
    const now = new Date();

    let updatePayload: Record<string, unknown> = {
      ...rest,
      last_active_at: now,
    };

    if (xpDelta !== undefined) {
      if (typeof xpDelta !== 'number' || !Number.isFinite(xpDelta)) {
        return NextResponse.json({ error: 'xpDelta must be a finite number' }, { status: 400 });
      }

      const current = await coll.findOne({ _id: oid }, { projection: { xp: 1, score: 1 } });
      if (!current) {
        return NextResponse.json({ error: 'Student not found' }, { status: 404 });
      }

      const curXp = typeof current.xp === 'number' ? current.xp : 0;
      const curScore = typeof current.score === 'number' ? current.score : 0;
      const newXp = curXp + xpDelta;
      updatePayload = {
        ...updatePayload,
        xp: newXp,
        score: curScore + xpDelta,
        level: xpToLevel(newXp),
      };
    }

    const upd = await coll.updateOne({ _id: oid }, { $set: updatePayload });
    if (upd.matchedCount === 0) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    const updated = await coll.findOne({ _id: oid });
    if (!updated) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    return NextResponse.json(toStudentApi(updated));
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    if (msg.includes('MONGODB_URI')) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
    }
    console.error('PATCH /api/students/[id]:', msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
