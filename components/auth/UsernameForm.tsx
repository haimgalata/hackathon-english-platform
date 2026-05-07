'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { saveStudentSession } from '@/lib/session';

export default function UsernameForm() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');

    const trimmed = username.trim();
    if (trimmed.length < 3 || trimmed.length > 20) {
      setError('Username must be 3–20 characters.');
      return;
    }
    if (!/^[a-zA-Z0-9_]+$/.test(trimmed)) {
      setError('Only letters, numbers, and underscores allowed.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: trimmed, display_name: displayName.trim() || trimmed }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? 'Something went wrong.');
        return;
      }
      const student = await res.json();
      saveStudentSession(student);
      router.push('/dashboard');
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    'w-full px-4 py-3 rounded-xl bg-white/[0.06] border border-white/[0.12] text-white placeholder:text-white/25 text-base focus:outline-none focus:border-[#00d4ff]/50 focus:bg-white/[0.08] transition-all';

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 w-full">
      <div>
        <label className="block text-xs font-semibold text-white/50 mb-2 tracking-wide uppercase">
          Your name
        </label>
        <input
          type="text"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          placeholder="e.g. Alex"
          className={inputClass}
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-white/50 mb-2 tracking-wide uppercase">
          Username{' '}
          <span className="text-white/25 normal-case font-normal">(3–20 chars, letters / numbers / _)</span>
        </label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="e.g. alex_coder"
          required
          className={inputClass}
        />
      </div>

      {error && (
        <p className="text-red-400 text-sm text-center">{error}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#00d4ff] to-[#0099cc] text-[#0f1117] font-bold text-base tracking-wide shadow-lg hover:shadow-[0_0_20px_rgba(0,212,255,0.4)] transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-1"
      >
        {loading ? 'Joining…' : 'Start Learning'}
      </button>
    </form>
  );
}
