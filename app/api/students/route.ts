import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  const { data, error } = await supabase
    .from('students')
    .select('*')
    .order('score', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { username, display_name } = body as { username: string; display_name?: string };

  if (!username) {
    return NextResponse.json({ error: 'username is required' }, { status: 400 });
  }

  // Try to find existing student
  const { data: existing } = await supabase
    .from('students')
    .select('*')
    .eq('username', username.toLowerCase())
    .single();

  if (existing) {
    // Update last_active_at and return
    await supabase
      .from('students')
      .update({ last_active_at: new Date().toISOString() })
      .eq('id', existing.id);
    return NextResponse.json({ ...existing, last_active_at: new Date().toISOString() });
  }

  // Create new student
  const { data: created, error } = await supabase
    .from('students')
    .insert({
      username: username.toLowerCase(),
      display_name: display_name || username,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(created, { status: 201 });
}
