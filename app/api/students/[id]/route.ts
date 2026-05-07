import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { xpToLevel } from '@/lib/session';

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const { data, error } = await supabase
    .from('students')
    .select('*, sessions(count)')
    .eq('id', params.id)
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 404 });

  const student = {
    ...data,
    session_count: Array.isArray(data.sessions) && data.sessions.length > 0
      ? (data.sessions[0] as { count: number }).count
      : 0,
    sessions: undefined,
  };

  return NextResponse.json(student);
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json();
  const { xpDelta, ...rest } = body as { xpDelta?: number; [key: string]: unknown };

  let updatePayload: Record<string, unknown> = {
    ...rest,
    last_active_at: new Date().toISOString(),
  };

  if (xpDelta !== undefined) {
    // Fetch current xp to compute new level
    const { data: current } = await supabase
      .from('students')
      .select('xp, score')
      .eq('id', params.id)
      .single();

    if (current) {
      const newXp = (current.xp as number) + xpDelta;
      updatePayload = {
        ...updatePayload,
        xp: newXp,
        score: (current.score as number) + xpDelta,
        level: xpToLevel(newXp),
      };
    }
  }

  const { data, error } = await supabase
    .from('students')
    .update(updatePayload)
    .eq('id', params.id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
