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

  if (loading) return <p className="text-slate-400 text-center py-10">Loading students…</p>;
  if (error) return <p className="text-red-500 text-center py-10">{error}</p>;
  if (students.length === 0)
    return (
      <div className="text-center py-10">
        <p className="text-slate-400 text-sm">No students yet.</p>
        <p className="text-slate-300 text-xs mt-1">Students appear here after they log in.</p>
      </div>
    );

  return (
    <div>
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <input
          type="text"
          placeholder="Search students…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 flex-1 min-w-[160px]"
        />
        <div className="flex gap-1">
          {(['score', 'level', 'name'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setSortBy(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                sortBy === s
                  ? 'bg-indigo-500 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-sm bg-white">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Student</th>
              <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Level</th>
              <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Score</th>
              <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">XP Progress</th>
              <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Last Active</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((student) => (
              <StudentRow key={student.id} student={student} />
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-slate-400 mt-3 text-right">{filtered.length} student{filtered.length !== 1 ? 's' : ''}</p>
    </div>
  );
}
