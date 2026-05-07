'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import StudentTable from '@/components/teacher/StudentTable';
import { Suspense } from 'react';

function TeacherDashboardContent() {
  const searchParams = useSearchParams();
  const pin = searchParams.get('pin');
  const [authorized, setAuthorized] = useState(false);
  const [enteredPin, setEnteredPin] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const correctPin = process.env.NEXT_PUBLIC_TEACHER_PIN ?? '1234';
    if (pin === correctPin) setAuthorized(true);
  }, [pin]);

  function handlePinSubmit(e: React.FormEvent) {
    e.preventDefault();
    const correctPin = process.env.NEXT_PUBLIC_TEACHER_PIN ?? '1234';
    if (enteredPin === correctPin) {
      setAuthorized(true);
    } else {
      setError('Incorrect PIN. Try again.');
    }
  }

  if (!authorized) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-indigo-50 p-6">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-sm text-center">
          <div className="text-4xl mb-4">🔐</div>
          <h1 className="text-xl font-bold text-slate-800 mb-2">Teacher Dashboard</h1>
          <p className="text-slate-500 text-sm mb-6">Enter your PIN to continue</p>
          <form onSubmit={handlePinSubmit} className="flex flex-col gap-3">
            <input
              type="password"
              inputMode="numeric"
              value={enteredPin}
              onChange={(e) => setEnteredPin(e.target.value)}
              placeholder="PIN"
              className="px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-center text-lg tracking-widest"
            />
            {error && <p className="text-red-500 text-xs">{error}</p>}
            <button
              type="submit"
              className="py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold"
            >
              Access Dashboard
            </button>
          </form>
          <Link href="/" className="block mt-4 text-xs text-indigo-400 underline">
            Back to student login
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-800">
              Speak<span className="text-indigo-600">Tech</span> — Teacher View
            </h1>
            <p className="text-slate-500 text-sm mt-0.5">Student progress overview</p>
          </div>
          <Link
            href="/"
            className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 transition-colors shadow-sm"
          >
            Student Login
          </Link>
        </div>

        {/* Stats summary */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { label: 'Total Students', icon: '👥', stat: 'See table below' },
            { label: 'Highest Level', icon: '🏆', stat: 'Check leaderboard' },
            { label: 'Active Today', icon: '⚡', stat: 'See last active' },
          ].map((item) => (
            <div key={item.label} className="bg-white rounded-2xl shadow-sm p-4 text-center">
              <div className="text-2xl mb-1">{item.icon}</div>
              <p className="text-xs text-slate-500 font-medium">{item.label}</p>
            </div>
          ))}
        </div>

        {/* Student table */}
        <div className="bg-white/50 rounded-2xl p-1">
          <StudentTable />
        </div>
      </div>
    </main>
  );
}

export default function TeacherPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><p className="text-slate-400">Loading…</p></div>}>
      <TeacherDashboardContent />
    </Suspense>
  );
}
