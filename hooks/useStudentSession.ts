'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getStudentSession, saveStudentSession } from '@/lib/session';
import type { Student } from '@/types';

export function useStudentSession(redirectIfMissing = true) {
  const router = useRouter();
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const s = getStudentSession();
    if (!s && redirectIfMissing) {
      router.replace('/');
      return;
    }
    setStudent(s);
    setLoading(false);
  }, [router, redirectIfMissing]);

  function updateStudent(updates: Partial<Student>) {
    if (!student) return;
    const updated = { ...student, ...updates };
    setStudent(updated);
    saveStudentSession(updated);
  }

  return { student, loading, updateStudent };
}
