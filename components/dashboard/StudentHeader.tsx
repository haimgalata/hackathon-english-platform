'use client';

import { useEffect, useState } from 'react';
import { getStudentSession } from '@/lib/session';
import { xpProgressPercent } from '@/lib/session';
import type { Student } from '@/types';
import ProgressRing from './ProgressRing';

export default function StudentHeader() {
  const [student, setStudent] = useState<Student | null>(null);

  useEffect(() => {
    const local = getStudentSession();
    if (!local) return;
    setStudent(local);

    fetch(`/api/students/${local.id}`)
      .then((r) => r.json())
      .then((fresh: Student) => setStudent(fresh))
      .catch(() => {});
  }, []);

  if (!student) return null;

  const percent = xpProgressPercent(student.xp);

  return (
    <div className="flex items-center gap-5 rounded-2xl p-5 w-full" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
      <ProgressRing percent={percent} level={student.level} />
      <div className="flex-1 min-w-0">
        <h2 className="text-xl font-extrabold text-white truncate">{student.display_name}</h2>
        <div className="flex items-center gap-2 mt-1.5">
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#00d4ff]/[0.1] text-[#00d4ff] border border-[#00d4ff]/20">
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <polygon points="5,1 6.2,3.8 9.5,4.1 7.2,6.2 7.9,9.5 5,7.8 2.1,9.5 2.8,6.2 0.5,4.1 3.8,3.8" fill="#00d4ff" opacity="0.9"/>
            </svg>
            {student.score} pts
          </span>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#e040fb]/[0.1] text-[#e040fb] border border-[#e040fb]/20">
            LEVEL {student.level}
          </span>
        </div>
      </div>
    </div>
  );
}
