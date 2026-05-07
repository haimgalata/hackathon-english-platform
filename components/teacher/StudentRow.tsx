import type { Student } from '@/types';

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

const LEVEL_COLORS = [
  '',
  'bg-slate-100 text-slate-600',
  'bg-blue-100 text-blue-700',
  'bg-green-100 text-green-700',
  'bg-purple-100 text-purple-700',
  'bg-amber-100 text-amber-700',
];

interface StudentRowProps {
  student: Student;
}

export default function StudentRow({ student }: StudentRowProps) {
  const levelColor = LEVEL_COLORS[student.level] ?? LEVEL_COLORS[LEVEL_COLORS.length - 1];

  return (
    <tr className="border-b border-slate-100 hover:bg-indigo-50/40 transition-colors">
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
            {student.display_name.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-semibold text-slate-700 text-sm">{student.display_name}</p>
            <p className="text-xs text-slate-400">@{student.username}</p>
          </div>
        </div>
      </td>
      <td className="px-4 py-3">
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${levelColor}`}>
          Level {student.level}
        </span>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-1">
          <span className="text-amber-500">⭐</span>
          <span className="text-sm font-bold text-slate-700">{student.score}</span>
        </div>
      </td>
      <td className="px-4 py-3">
        <div className="w-full bg-slate-100 rounded-full h-1.5 max-w-[80px]">
          <div
            className="bg-gradient-to-r from-indigo-400 to-purple-500 h-1.5 rounded-full"
            style={{ width: `${Math.min((student.xp % 100), 100)}%` }}
          />
        </div>
        <p className="text-xs text-slate-400 mt-0.5">{student.xp} XP</p>
      </td>
      <td className="px-4 py-3 text-xs text-slate-400">
        {timeAgo(student.last_active_at)}
      </td>
    </tr>
  );
}
