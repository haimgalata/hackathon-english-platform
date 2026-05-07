'use client';

import { useEffect, useState } from 'react';
import { getStudentSession } from '@/lib/session';
import { xpProgressPercent } from '@/lib/session';
import type { Student } from '@/types';
import ProgressRing from './ProgressRing';
import Badge from '@/components/ui/Badge';

export default function StudentHeader() {
  const [student, setStudent] = useState<Student | null>(null);

  useEffect(() => {
    const local = getStudentSession();
    if (!local) return;
    setStudent(local);

    // Fetch fresh data from DB
    fetch(`/api/students/${local.id}`)
      .then((r) => r.json())
      .then((fresh: Student) => setStudent(fresh))
      .catch(() => {});
  }, []);

  if (!student) return null;

  const percent = xpProgressPercent(student.xp);

  return (
    <div className="flex items-center gap-5 bg-white rounded-2xl shadow-md p-5 w-full max-w-sm">
      <ProgressRing percent={percent} level={student.level} />
      <div className="flex-1 min-w-0">
        <p className="text-xs text-slate-400 font-medium">Welcome back,</p>
        <h2 className="text-xl font-extrabold text-slate-800 truncate">{student.display_name}</h2>
        <div className="flex items-center gap-2 mt-1.5">
          <Badge variant="score">⭐ {student.score} pts</Badge>
          <Badge variant="level">Level {student.level}</Badge>
        </div>
      </div>
    </div>
  );
}
