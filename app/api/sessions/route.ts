import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  const { studentId, scenario } = await req.json();

  const { data, error } = await supabase
    .from('sessions')
    .insert({ student_id: studentId, scenario })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
