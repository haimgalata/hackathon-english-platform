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

interface StudentRowProps {
  student: Student;
}

export default function StudentRow({ student }: StudentRowProps) {
  return (
    <tr
      className="transition-colors"
      style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(0,212,255,0.04)'; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
    >
      <td className="px-4 py-3">
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#00d4ff] text-xs font-bold flex-shrink-0"
            style={{ background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.2)' }}
          >
            {student.display_name.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-semibold text-white/85 text-sm">{student.display_name}</p>
            <p className="text-xs text-white/35">@{student.username}</p>
          </div>
        </div>
      </td>
      <td className="px-4 py-3">
        <span
          className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold"
          style={{ background: 'rgba(224,64,251,0.1)', color: '#e040fb', border: '1px solid rgba(224,64,251,0.2)' }}
        >
          Level {student.level}
        </span>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-1.5">
          <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
            <polygon points="5.5,0.5 6.8,4 11,4.3 7.9,7.1 8.9,11.3 5.5,9.2 2.1,11.3 3.1,7.1 0,4.3 4.2,4" fill="#fbbf24" />
          </svg>
          <span className="text-sm font-bold text-white/80">{student.score}</span>
        </div>
      </td>
      <td className="px-4 py-3">
        <div className="w-full rounded-full h-1.5 max-w-[80px]" style={{ background: 'rgba(255,255,255,0.08)' }}>
          <div
            className="h-1.5 rounded-full"
            style={{
              width: `${Math.min((student.xp % 100), 100)}%`,
              background: 'linear-gradient(90deg, #00d4ff, #e040fb)',
            }}
          />
        </div>
        <p className="text-[10px] text-white/30 mt-0.5">{student.xp} XP</p>
      </td>
      <td className="px-4 py-3 text-xs text-white/30">
        {timeAgo(student.last_active_at)}
      </td>
    </tr>
  );
}
