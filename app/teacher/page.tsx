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
      <main className="min-h-screen flex items-center justify-center bg-[#0f1117] p-6 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-[#00d4ff]/[0.03] blur-3xl pointer-events-none" />
        <div className="rounded-2xl p-8 w-full max-w-sm text-center relative z-10" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <div className="w-12 h-12 mx-auto mb-4 rounded-xl flex items-center justify-center" style={{ background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.2)' }}>
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <rect x="4" y="10" width="14" height="10" rx="2.5" stroke="#00d4ff" strokeWidth="1.4" opacity="0.8" />
              <path d="M7 10V7a4 4 0 0 1 8 0v3" stroke="#00d4ff" strokeWidth="1.4" strokeLinecap="round" opacity="0.8" />
              <circle cx="11" cy="15" r="1.5" fill="#00d4ff" opacity="0.7" />
            </svg>
          </div>
          <h1 className="text-lg font-bold text-white mb-1.5 tracking-wide">Teacher Dashboard</h1>
          <p className="text-white/40 text-sm mb-6">Enter your PIN to continue</p>
          <form onSubmit={handlePinSubmit} className="flex flex-col gap-3">
            <input
              type="password"
              inputMode="numeric"
              value={enteredPin}
              onChange={(e) => setEnteredPin(e.target.value)}
              placeholder="PIN"
              className="px-4 py-3 rounded-xl text-center text-lg tracking-widest text-white placeholder:text-white/20 focus:outline-none focus:border-[#00d4ff]/50 transition-all"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
            />
            {error && <p className="text-red-400 text-xs">{error}</p>}
            <button
              type="submit"
              className="py-3 rounded-xl font-bold text-[#0f1117] tracking-wide"
              style={{ background: 'linear-gradient(90deg, #00d4ff, #0099cc)' }}
            >
              Access Dashboard
            </button>
          </form>
          <Link href="/" className="block mt-4 text-xs text-[#00d4ff]/50 hover:text-[#00d4ff] transition-colors">
            Back to student login
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0f1117] p-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-[#00d4ff]/[0.03] blur-3xl pointer-events-none" />
      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              Speak<span className="text-[#00d4ff]">Tech</span>
              <span className="text-white/40 font-medium ml-2 text-lg">— Teacher View</span>
            </h1>
            <p className="text-white/35 text-sm mt-0.5 tracking-wide">Student progress overview</p>
          </div>
          <Link
            href="/"
            className="px-4 py-2 rounded-xl text-white/60 text-sm font-medium hover:text-white transition-colors"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            Student Login
          </Link>
        </div>

        {/* Stats summary */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            {
              label: 'Total Students',
              icon: (
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                  <circle cx="8" cy="7" r="3.5" stroke="#00d4ff" strokeWidth="1.3" opacity="0.7" />
                  <circle cx="15" cy="8" r="2.5" stroke="#00d4ff" strokeWidth="1.3" opacity="0.4" />
                  <path d="M2 18c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke="#00d4ff" strokeWidth="1.3" strokeLinecap="round" opacity="0.7" />
                  <path d="M15 12c2.2 0 4 1.8 4 4" stroke="#00d4ff" strokeWidth="1.3" strokeLinecap="round" opacity="0.4" />
                </svg>
              ),
            },
            {
              label: 'Highest Level',
              icon: (
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                  <polygon points="11,2 13.5,8 20,8.5 15.5,13 17,19.5 11,16.5 5,19.5 6.5,13 2,8.5 8.5,8" stroke="#e040fb" strokeWidth="1.3" fill="none" opacity="0.8" />
                </svg>
              ),
            },
            {
              label: 'Active Today',
              icon: (
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                  <path d="M11 3v4M11 15v4M3 11h4M15 11h4" stroke="#fbbf24" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
                  <circle cx="11" cy="11" r="4" stroke="#fbbf24" strokeWidth="1.3" opacity="0.8" />
                </svg>
              ),
            },
          ].map((item) => (
            <div key={item.label} className="rounded-2xl p-4 text-center" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <div className="flex justify-center mb-2">{item.icon}</div>
              <p className="text-xs text-white/40 font-medium tracking-wide">{item.label}</p>
            </div>
          ))}
        </div>

        {/* Student table */}
        <div className="rounded-2xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
          <StudentTable />
        </div>
      </div>
    </main>
  );
}

export default function TeacherPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#0f1117]">
        <p className="text-white/30 tracking-wide">Loading…</p>
      </div>
    }>
      <TeacherDashboardContent />
    </Suspense>
  );
}
