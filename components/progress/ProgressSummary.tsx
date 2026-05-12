"use client";

import Link from "next/link";
import { useProgress } from "@/hooks/useProgress";
import { TechyAvatar } from "@/components/ui/Avatar";
import { MessageCircle, AlertCircle, BookOpen, Gamepad2, ArrowRight, Trophy } from "lucide-react";

const stats = [
  {
    key: "completedSessions" as const,
    label: "Sessions Completed",
    icon: MessageCircle,
    color: "text-brand-secondary",
    bg: "bg-brand-primary/15",
    border: "border-brand-primary/25",
    milestone: 10,
    unit: "session",
  },
  {
    key: "mistakesCount" as const,
    label: "Errors Corrected",
    icon: AlertCircle,
    color: "text-brand-warning",
    bg: "bg-brand-warning/15",
    border: "border-brand-warning/25",
    milestone: 50,
    unit: "error",
    positiveFrame: true,
  },
  {
    key: "learnedVocabulary" as const,
    label: "Words Learned",
    icon: BookOpen,
    color: "text-brand-success",
    bg: "bg-brand-success/15",
    border: "border-brand-success/25",
    milestone: 20,
    unit: "word",
  },
  {
    key: "gamesCompleted" as const,
    label: "Games Played",
    icon: Gamepad2,
    color: "text-purple-400",
    bg: "bg-purple-500/15",
    border: "border-purple-500/25",
    milestone: 5,
    unit: "game",
  },
];

function StatCard({
  label,
  value,
  icon: Icon,
  color,
  bg,
  border,
  milestone,
  positiveFrame,
}: {
  label: string;
  value: number;
  icon: React.ElementType;
  color: string;
  bg: string;
  border: string;
  milestone: number;
  positiveFrame?: boolean;
}) {
  const pct = Math.min(100, Math.round((value / milestone) * 100));

  return (
    <div className={`glass-card rounded-2xl p-4 border ${border}`}>
      <div className="flex items-start justify-between mb-3">
        <div className={`w-9 h-9 rounded-xl ${bg} flex items-center justify-center ${color}`}>
          <Icon size={18} aria-hidden="true" />
        </div>
        {value >= milestone && (
          <Trophy size={14} className="text-brand-warning" aria-label="Milestone reached" />
        )}
      </div>
      <p className="text-3xl font-extrabold text-white mb-0.5">{value}</p>
      <p className="text-xs text-slate-400 mb-3">
        {positiveFrame ? `errors caught — every one makes you better` : label.toLowerCase()}
      </p>
      {/* Progress bar toward milestone */}
      <div>
        <div className="flex justify-between text-[10px] text-slate-600 mb-1">
          <span>toward {milestone}</span>
          <span>{pct}%</span>
        </div>
        <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 ${color.replace("text-", "bg-")}`}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    </div>
  );
}

export function ProgressSummary() {
  const { data, loading } = useProgress();

  if (loading) {
    return (
      <div className="flex flex-col items-center gap-4 py-16">
        <TechyAvatar size="md" speaking />
        <p className="text-slate-400 text-sm">Loading your progress…</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex flex-col items-center gap-5 py-12 text-center">
        <TechyAvatar size="lg" />
        <div>
          <h2 className="font-bold text-white text-lg mb-1">No practice yet!</h2>
          <p className="text-slate-400 text-sm max-w-xs">
            Start your first conversation with me and your progress will show up here.
          </p>
        </div>
        <Link href="/scenarios" className="btn-primary text-sm flex items-center gap-2">
          Start practicing <ArrowRight size={14} aria-hidden="true" />
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Techy message */}
      <div className="flex items-start gap-3 glass-card rounded-2xl p-4 border border-brand-primary/20">
        <TechyAvatar size="sm" />
        <p className="text-sm text-slate-300 leading-relaxed">
          {data.completedSessions === 0
            ? "You haven't started yet — let's change that!"
            : data.completedSessions < 5
            ? `Great start! You've done ${data.completedSessions} session${data.completedSessions > 1 ? "s" : ""}. Keep going!`
            : `Wow, ${data.completedSessions} sessions! You're making real progress. I'm proud of you!`}
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3">
        {stats.map(({ key, label, icon, color, bg, border, milestone, positiveFrame }) => (
          <StatCard
            key={key}
            label={label}
            value={data[key]}
            icon={icon}
            color={color}
            bg={bg}
            border={border}
            milestone={milestone}
            positiveFrame={positiveFrame}
          />
        ))}
      </div>
    </div>
  );
}
