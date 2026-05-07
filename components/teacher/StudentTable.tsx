'use client';

import { useState, useEffect } from 'react';
import type { Student } from '@/types';
import StudentRow from './StudentRow';

export default function StudentTable() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'score' | 'level' | 'name'>('score');
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/students')
      .then((r) => r.json())
      .then((data: Student[]) => setStudents(data))
      .catch(() => setError('Failed to load students.'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = students
    .filter(
      (s) =>
        s.username.includes(search.toLowerCase()) ||
        s.display_name.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'score') return b.score - a.score;
      if (sortBy === 'level') return b.level - a.level;
      return a.display_name.localeCompare(b.display_name);
    });

  if (loading) return <p className="text-white/30 text-center py-10 tracking-wide">Loading students…</p>;
  if (error) return <p className="text-red-400 text-center py-10">{error}</p>;
  if (students.length === 0)
    return (
      <div className="text-center py-10">
        <p className="text-white/30 text-sm">No students yet.</p>
        <p className="text-white/20 text-xs mt-1">Students appear here after they log in.</p>
      </div>
    );

  return (
    <div className="p-4">
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <input
          type="text"
          placeholder="Search students…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-3 py-2 rounded-xl text-sm flex-1 min-w-[160px] text-white placeholder:text-white/25 focus:outline-none focus:border-[#00d4ff]/40 transition-all"
          style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
        />
        <div className="flex gap-1.5">
          {(['score', 'level', 'name'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setSortBy(s)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors tracking-wide"
              style={
                sortBy === s
                  ? { background: 'rgba(0,212,255,0.15)', color: '#00d4ff', border: '1px solid rgba(0,212,255,0.3)' }
                  : { background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.45)', border: '1px solid rgba(255,255,255,0.08)' }
              }
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl" style={{ border: '1px solid rgba(255,255,255,0.07)' }}>
        <table className="w-full text-left">
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.03)' }}>
              {['Student', 'Level', 'Score', 'XP Progress', 'Last Active'].map((h) => (
                <th key={h} className="px-4 py-3 text-[10px] font-semibold text-white/35 uppercase tracking-widest">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((student) => (
              <StudentRow key={student.id} student={student} />
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-white/25 mt-3 text-right tracking-wide">
        {filtered.length} student{filtered.length !== 1 ? 's' : ''}
      </p>
    </div>
  );
}
