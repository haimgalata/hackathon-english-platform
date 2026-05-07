'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { getStudentSession, xpProgressPercent } from '@/lib/session';
import type { Student } from '@/types';
import TechyAvatar from '@/components/tech/TechyAvatar';
import ProgressRing from '@/components/dashboard/ProgressRing';

/* ── helpers ── */
const RANK_TITLES = ['Newcomer', 'Explorer', 'Tech Cadet', 'Developer', 'Engineer', 'Tech Master'];
const getRank = (level: number) => RANK_TITLES[Math.min(level, RANK_TITLES.length - 1)];
const getSessions = (score: number) => Math.max(0, Math.floor(score / 6));

/* ── fade-up animation preset ── */
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 22 } as const,
  animate: { opacity: 1, y: 0 } as const,
  transition: { duration: 0.5, delay },
});

/* ────────────────────────────────────────────
   BACKGROUND EFFECTS
───────────────────────────────────────────── */
function BackgroundEffects() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none" aria-hidden>
      {/* Cyan orb — top-left */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 800,
          height: 800,
          top: '-20%',
          left: '-20%',
          background: 'radial-gradient(circle, rgba(0,212,255,0.07) 0%, transparent 60%)',
        }}
        animate={{ x: [0, 50, 0], y: [0, 30, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
      />
      {/* Magenta orb — bottom-right */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 700,
          height: 700,
          bottom: '-15%',
          right: '-15%',
          background: 'radial-gradient(circle, rgba(224,64,251,0.06) 0%, transparent 60%)',
        }}
        animate={{ x: [0, -40, 0], y: [0, -25, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
      />
      {/* Small warm orb — centre */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 400,
          height: 400,
          top: '40%',
          left: '45%',
          background: 'radial-gradient(circle, rgba(0,212,255,0.03) 0%, transparent 60%)',
        }}
        animate={{ scale: [1, 1.3, 1], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />
      {/* Cyber grid */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,212,255,0.018) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,212,255,0.018) 1px, transparent 1px)
          `,
          backgroundSize: '72px 72px',
          maskImage: 'linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)',
        }}
      />
    </div>
  );
}

/* ────────────────────────────────────────────
   GLASS CARD WRAPPER
───────────────────────────────────────────── */
function GlassCard({
  children,
  className = '',
  style = {},
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={`rounded-3xl p-6 ${className}`}
      style={{
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.08)',
        backdropFilter: 'blur(20px)',
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/* ────────────────────────────────────────────
   SECTION TITLE
───────────────────────────────────────────── */
function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] font-bold text-white/30 tracking-[0.2em] uppercase mb-4">
      {children}
    </p>
  );
}

/* ────────────────────────────────────────────
   PROFILE CARD
───────────────────────────────────────────── */
function ProfileCard({
  student,
  percent,
  sessions,
}: {
  student: Student;
  percent: number;
  sessions: number;
}) {
  const rank = getRank(student.level);

  return (
    <motion.div {...fadeUp(0.1)}>
      <GlassCard>
        {/* Identity row */}
        <div className="flex items-center gap-4 mb-5">
          <ProgressRing percent={percent} level={student.level} size={88} />
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-extrabold text-white truncate leading-tight">
              {student.display_name}
            </h2>
            <p className="text-white/30 text-xs mt-0.5">@{student.username}</p>
            <span
              className="inline-block mt-2 text-[9px] font-bold px-2.5 py-1 rounded-full tracking-[0.15em] uppercase"
              style={{ background: 'rgba(0,212,255,0.1)', color: '#00d4ff', border: '1px solid rgba(0,212,255,0.2)' }}
            >
              {rank}
            </span>
          </div>
        </div>

        {/* XP bar */}
        <div className="mb-5">
          <div className="flex justify-between text-[11px] mb-2">
            <span className="text-white/35">XP to next level</span>
            <span className="font-bold" style={{ color: '#00d4ff' }}>{percent}%</span>
          </div>
          <div
            className="h-2 rounded-full overflow-hidden"
            style={{ background: 'rgba(255,255,255,0.07)' }}
          >
            <motion.div
              className="h-full rounded-full"
              style={{ background: 'linear-gradient(90deg, #00d4ff, #e040fb)' }}
              initial={{ width: 0 }}
              animate={{ width: `${percent}%` }}
              transition={{ duration: 1.1, delay: 0.4, ease: 'easeOut' }}
            />
          </div>
        </div>

        {/* Mini stats */}
        <div
          className="grid grid-cols-3 gap-3 pt-4"
          style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
        >
          {[
            { label: 'Sessions', value: sessions },
            { label: 'Points', value: student.score },
            { label: 'Level', value: student.level },
          ].map(({ label, value }) => (
            <div key={label} className="text-center">
              <p className="text-2xl font-extrabold text-white leading-none">{value}</p>
              <p className="text-[10px] text-white/30 tracking-widest uppercase mt-1">{label}</p>
            </div>
          ))}
        </div>
      </GlassCard>
    </motion.div>
  );
}

/* ────────────────────────────────────────────
   DAILY GOALS
───────────────────────────────────────────── */
function DailyGoalsCard({ student, sessions }: { student: Student; sessions: number }) {
  const goalXP = 30;
  const earnedToday = Math.min(student.score, goalXP);
  const progressPct = Math.min(100, Math.round((earnedToday / goalXP) * 100));

  const goals = [
    { label: 'Start a conversation', done: sessions >= 1 },
    { label: 'Earn 30 XP', done: student.score >= 30 },
    { label: 'Use 3 tech terms correctly', done: student.score >= 20 },
  ];

  const completedCount = goals.filter((g) => g.done).length;
  const motivations = [
    'Every session makes you sharper.',
    "You're building real skills — keep going!",
    "Talk with Techy to unlock your next level.",
    'Consistency beats perfection. Show up!',
  ];
  const msg = motivations[student.level % motivations.length];

  return (
    <motion.div {...fadeUp(0.2)}>
      <GlassCard>
        <div className="flex items-center justify-between mb-4">
          <SectionTitle>Daily Goals</SectionTitle>
          <span
            className="text-[10px] font-bold px-2.5 py-1 rounded-full -mt-4"
            style={
              completedCount === goals.length
                ? { background: 'rgba(52,211,153,0.15)', color: '#34d399', border: '1px solid rgba(52,211,153,0.25)' }
                : { background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.35)', border: '1px solid rgba(255,255,255,0.08)' }
            }
          >
            {completedCount}/{goals.length} done
          </span>
        </div>

        {/* XP bar */}
        <div className="mb-4">
          <div className="flex justify-between text-[11px] mb-1.5">
            <span className="text-white/35">XP earned</span>
            <span className="text-white/50">
              {earnedToday} / {goalXP}
            </span>
          </div>
          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.07)' }}>
            <motion.div
              className="h-full rounded-full"
              style={{ background: 'linear-gradient(90deg, #34d399, #00d4ff)' }}
              initial={{ width: 0 }}
              animate={{ width: `${progressPct}%` }}
              transition={{ duration: 0.9, delay: 0.5 }}
            />
          </div>
        </div>

        {/* Checklist */}
        <div className="space-y-2.5">
          {goals.map(({ label, done }) => (
            <div key={label} className="flex items-center gap-3">
              <div
                className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 transition-all"
                style={{
                  background: done ? 'rgba(52,211,153,0.2)' : 'rgba(255,255,255,0.05)',
                  border: `1px solid ${done ? 'rgba(52,211,153,0.5)' : 'rgba(255,255,255,0.1)'}`,
                }}
              >
                {done && (
                  <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                    <path d="M1.5 4L3 5.5L6.5 2" stroke="#34d399" strokeWidth="1.3" strokeLinecap="round" />
                  </svg>
                )}
              </div>
              <span
                className="text-xs transition-all"
                style={{ color: done ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.4)', textDecoration: done ? 'line-through' : 'none' }}
              >
                {label}
              </span>
            </div>
          ))}
        </div>

        <p className="text-[11px] mt-4 italic" style={{ color: 'rgba(0,212,255,0.5)' }}>
          {msg}
        </p>
      </GlassCard>
    </motion.div>
  );
}

/* ────────────────────────────────────────────
   ACHIEVEMENTS
───────────────────────────────────────────── */
const ACHIEVEMENTS = [
  { label: 'First Steps', desc: 'First session', check: (s: Student) => s.score > 0, color: '#00d4ff' },
  { label: 'Tech Talker', desc: 'Level 2', check: (s: Student) => s.level >= 2, color: '#e040fb' },
  { label: 'Centurion', desc: '100 pts', check: (s: Student) => s.score >= 100, color: '#fbbf24' },
  { label: 'Tech Pro', desc: 'Level 3', check: (s: Student) => s.level >= 3, color: '#34d399' },
  { label: 'Word Wizard', desc: '300 pts', check: (s: Student) => s.score >= 300, color: '#a78bfa' },
  { label: 'Master', desc: 'Level 5', check: (s: Student) => s.level >= 5, color: '#ff6b6b' },
];

function AchievementsCard({ student }: { student: Student }) {
  return (
    <motion.div {...fadeUp(0.3)}>
      <GlassCard>
        <SectionTitle>Achievements</SectionTitle>
        <div className="grid grid-cols-3 gap-2.5">
          {ACHIEVEMENTS.map(({ label, desc, check, color }) => {
            const unlocked = check(student);
            return (
              <motion.div
                key={label}
                whileHover={{ scale: 1.06, y: -2 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                className="flex flex-col items-center text-center p-3 rounded-2xl cursor-default"
                style={{
                  background: unlocked ? color + '12' : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${unlocked ? color + '30' : 'rgba(255,255,255,0.06)'}`,
                  opacity: unlocked ? 1 : 0.45,
                }}
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center mb-2"
                  style={{
                    background: unlocked ? color + '20' : 'rgba(255,255,255,0.05)',
                    border: `1px solid ${unlocked ? color + '40' : 'rgba(255,255,255,0.08)'}`,
                    boxShadow: unlocked ? `0 0 12px ${color}30` : 'none',
                  }}
                >
                  {unlocked ? (
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                      <polygon
                        points="9,1 11.5,6.5 17.5,7 13,11 14.5,17 9,13.5 3.5,17 5,11 0.5,7 6.5,6.5"
                        fill={color}
                        opacity="0.9"
                      />
                    </svg>
                  ) : (
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <rect x="3" y="6" width="8" height="7" rx="1.5" stroke="rgba(255,255,255,0.2)" strokeWidth="1.2" />
                      <path d="M5 6V4.5a2 2 0 0 1 4 0V6" stroke="rgba(255,255,255,0.2)" strokeWidth="1.2" strokeLinecap="round" />
                    </svg>
                  )}
                </div>
                <p
                  className="text-[10px] font-bold leading-tight"
                  style={{ color: unlocked ? color : 'rgba(255,255,255,0.25)' }}
                >
                  {label}
                </p>
                <p className="text-[9px] leading-tight mt-0.5 text-white/20">{desc}</p>
              </motion.div>
            );
          })}
        </div>
      </GlassCard>
    </motion.div>
  );
}

/* ────────────────────────────────────────────
   TECHY AI CARD
───────────────────────────────────────────── */
function TechyCard() {
  return (
    <motion.div {...fadeUp(0.15)}>
      <GlassCard
        className="text-center relative overflow-hidden"
        style={{
          background: 'linear-gradient(160deg, rgba(0,212,255,0.06) 0%, rgba(224,64,251,0.04) 100%)',
          border: '1px solid rgba(0,212,255,0.12)',
        }}
      >
        {/* Radial background glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at 50% 20%, rgba(0,212,255,0.12) 0%, transparent 65%)',
          }}
        />

        {/* Online badge */}
        <div className="flex items-center justify-center gap-1.5 mb-3 relative z-10">
          <motion.div
            className="w-2 h-2 rounded-full"
            style={{ background: '#34d399' }}
            animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
            transition={{ duration: 2.2, repeat: Infinity }}
          />
          <span
            className="text-[10px] font-bold tracking-[0.2em] uppercase"
            style={{ color: '#34d399' }}
          >
            Online
          </span>
        </div>

        {/* Avatar + animated glow ring */}
        <div className="relative inline-flex items-center justify-center mb-2 z-10">
          <motion.div
            className="absolute rounded-full"
            style={{
              width: 240,
              height: 240,
              background: 'radial-gradient(circle, rgba(0,212,255,0.18) 0%, transparent 70%)',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
            }}
            animate={{ scale: [1, 1.15, 1], opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
          />
          <TechyAvatar state="idle" hideLabel />
        </div>

        {/* Speech bubble */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="relative z-10 rounded-2xl px-5 py-3.5 mb-5 mx-2 text-sm text-white/70 italic"
          style={{
            background: 'rgba(0,212,255,0.07)',
            border: '1px solid rgba(0,212,255,0.15)',
          }}
        >
          &ldquo;Ready for today&apos;s mission?&rdquo;
        </motion.div>

        {/* CTA button */}
        <Link href="/tech" className="block relative z-10">
          <motion.div
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            className="py-4 rounded-2xl font-extrabold tracking-[0.15em] text-[#0f1117] text-sm cursor-pointer select-none"
            style={{
              background: 'linear-gradient(90deg, #00d4ff, #0099cc)',
              boxShadow: '0 0 32px rgba(0,212,255,0.35), 0 4px 20px rgba(0,212,255,0.2)',
            }}
          >
            START SESSION
          </motion.div>
        </Link>
      </GlassCard>
    </motion.div>
  );
}

/* ────────────────────────────────────────────
   RECENT ACTIVITY
───────────────────────────────────────────── */
function RecentActivityCard({ student }: { student: Student }) {
  const items: { text: string; xp: string; color: string }[] = [];

  if (student.score >= 300) items.push({ text: 'Earned 300+ total points', xp: '+bonus', color: '#a78bfa' });
  if (student.level >= 3) items.push({ text: 'Promoted to Tech Pro rank', xp: '+20 XP', color: '#34d399' });
  if (student.score >= 100) items.push({ text: 'Century Club milestone', xp: '+15 XP', color: '#fbbf24' });
  if (student.level >= 2) items.push({ text: 'Reached Explorer rank', xp: '+10 XP', color: '#e040fb' });
  if (student.score > 0) items.push({ text: 'First conversation completed', xp: '+5 XP', color: '#00d4ff' });

  return (
    <motion.div {...fadeUp(0.25)}>
      <GlassCard>
        <SectionTitle>Recent Activity</SectionTitle>

        {items.length === 0 ? (
          <div className="text-center py-6">
            <div
              className="w-10 h-10 rounded-full mx-auto mb-3 flex items-center justify-center"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <circle cx="9" cy="9" r="7" stroke="rgba(255,255,255,0.15)" strokeWidth="1.2" />
                <path d="M9 5.5V9l2.5 2.5" stroke="rgba(255,255,255,0.15)" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
            </div>
            <p className="text-white/25 text-sm">No activity yet</p>
            <p className="text-white/15 text-xs mt-1">Your milestones will appear here</p>
          </div>
        ) : (
          <div className="space-y-3.5">
            {items.slice(0, 5).map(({ text, xp, color }, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.07 }}
                className="flex items-center gap-3"
              >
                <div
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ background: color, boxShadow: `0 0 8px ${color}` }}
                />
                <p className="text-xs text-white/50 flex-1 leading-tight">{text}</p>
                <span className="text-[10px] font-bold flex-shrink-0" style={{ color }}>
                  {xp}
                </span>
              </motion.div>
            ))}
          </div>
        )}
      </GlassCard>
    </motion.div>
  );
}

/* ────────────────────────────────────────────
   MODE CARD
───────────────────────────────────────────── */
function ModeCard({
  href,
  label,
  description,
  accentColor,
  recommended,
}: {
  href: string;
  label: string;
  description: string;
  accentColor: string;
  recommended?: boolean;
}) {
  const isTech = label === 'TECH';

  return (
    <motion.div
      {...fadeUp(0.45)}
      whileHover={{ scale: 1.02, y: -3 }}
      whileTap={{ scale: 0.99 }}
      transition={{ type: 'spring', stiffness: 350, damping: 25 }}
    >
      <Link
        href={href}
        className="block rounded-3xl p-6 relative overflow-hidden group"
        style={{
          background: `linear-gradient(135deg, ${accentColor}10, ${accentColor}04)`,
          border: `1px solid ${accentColor}20`,
          transition: 'border-color 0.25s, box-shadow 0.25s',
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.borderColor = accentColor + '45';
          (e.currentTarget as HTMLElement).style.boxShadow = `0 0 40px ${accentColor}15`;
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.borderColor = accentColor + '20';
          (e.currentTarget as HTMLElement).style.boxShadow = 'none';
        }}
      >
        {/* Radial hover glow */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400 rounded-3xl pointer-events-none"
          style={{ background: `radial-gradient(ellipse at 25% 50%, ${accentColor}0d, transparent 65%)` }}
        />

        {/* Recommended badge */}
        {recommended && (
          <div
            className="absolute top-4 right-4 text-[9px] font-extrabold px-3 py-1 rounded-full tracking-widest uppercase"
            style={{ background: accentColor + '1a', color: accentColor, border: `1px solid ${accentColor}35` }}
          >
            Recommended
          </div>
        )}

        {/* Icon */}
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4 relative z-10"
          style={{ background: accentColor + '12', border: `1px solid ${accentColor}22` }}
        >
          {isTech ? (
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <circle cx="14" cy="14" r="4" fill={accentColor} opacity="0.85" />
              <circle cx="14" cy="14" r="9" stroke={accentColor} strokeWidth="1.2" opacity="0.35" />
              <line x1="14" y1="2" x2="14" y2="8" stroke={accentColor} strokeWidth="1.8" strokeLinecap="round" opacity="0.6" />
              <line x1="14" y1="20" x2="14" y2="26" stroke={accentColor} strokeWidth="1.8" strokeLinecap="round" opacity="0.6" />
              <line x1="2" y1="14" x2="8" y2="14" stroke={accentColor} strokeWidth="1.8" strokeLinecap="round" opacity="0.6" />
              <line x1="20" y1="14" x2="26" y2="14" stroke={accentColor} strokeWidth="1.8" strokeLinecap="round" opacity="0.6" />
            </svg>
          ) : (
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <rect x="4" y="9" width="20" height="14" rx="3.5" stroke={accentColor} strokeWidth="1.4" opacity="0.8" />
              <circle cx="10.5" cy="16" r="3" stroke={accentColor} strokeWidth="1.3" opacity="0.65" />
              <line x1="17" y1="13" x2="22" y2="13" stroke={accentColor} strokeWidth="1.3" strokeLinecap="round" opacity="0.5" />
              <line x1="17" y1="17.5" x2="20" y2="17.5" stroke={accentColor} strokeWidth="1.3" strokeLinecap="round" opacity="0.5" />
              <line x1="11" y1="6" x2="17" y2="6" stroke={accentColor} strokeWidth="1.8" strokeLinecap="round" opacity="0.4" />
            </svg>
          )}
        </div>

        <h3
          className="text-2xl font-extrabold tracking-[0.12em] mb-1.5 relative z-10"
          style={{ color: accentColor }}
        >
          {label}
        </h3>
        <p className="text-white/40 text-sm relative z-10 mb-4">{description}</p>

        {/* Footer row */}
        <div className="flex items-center justify-between relative z-10">
          <span className="text-xs font-semibold" style={{ color: accentColor + '90' }}>
            {isTech ? 'Continue learning →' : 'Coming soon →'}
          </span>
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{ background: accentColor + '15', border: `1px solid ${accentColor}25` }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M3 7h8M7 3l4 4-4 4" stroke={accentColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.8" />
            </svg>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

/* ────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────── */
export default function DashboardPage() {
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

  const percent = student ? xpProgressPercent(student.xp) : 0;
  const sessions = student ? getSessions(student.score) : 0;

  return (
    <div className="min-h-screen bg-[#0f1117] relative overflow-x-hidden">
      <BackgroundEffects />

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
        {/* ── Hero Header ── */}
        <motion.header
          initial={{ opacity: 0, y: -24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl sm:text-6xl font-extrabold text-white tracking-tight leading-none">
            Speak<span className="text-[#00d4ff]">Tech</span>
          </h1>
          <p className="text-white/35 text-sm mt-3 tracking-[0.1em]">
            Level up your tech English with AI
          </p>
        </motion.header>

        {/* ── Main 2-column grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
          {/* Left column */}
          <div className="flex flex-col gap-5">
            {student ? (
              <>
                <ProfileCard student={student} percent={percent} sessions={sessions} />
                <DailyGoalsCard student={student} sessions={sessions} />
                <AchievementsCard student={student} />
              </>
            ) : (
              /* Skeleton while loading */
              <>
                {[88, 160, 200].map((h) => (
                  <div
                    key={h}
                    className="rounded-3xl animate-pulse"
                    style={{ height: h, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
                  />
                ))}
              </>
            )}
          </div>

          {/* Right column */}
          <div className="flex flex-col gap-5">
            <TechyCard />
            {student && <RecentActivityCard student={student} />}
          </div>
        </div>

        {/* ── Mode Cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <ModeCard
            href="/tech"
            label="TECH"
            description="AI conversation practice with Techy — improve your tech English in real time"
            accentColor="#00d4ff"
            recommended
          />
          <ModeCard
            href="/practice"
            label="PRACTICE"
            description="Vocabulary games and word challenges — coming soon"
            accentColor="#e040fb"
          />
        </div>
      </div>
    </div>
  );
}
