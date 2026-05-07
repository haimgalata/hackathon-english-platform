import type { Student } from '@/types';

export const LEVEL_THRESHOLDS = [0, 100, 250, 500, 900, 1400];

export function xpToLevel(xp: number): number {
  return LEVEL_THRESHOLDS.filter((t) => xp >= t).length;
}

export function xpForNextLevel(xp: number): number {
  const level = xpToLevel(xp);
  return LEVEL_THRESHOLDS[level] ?? LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1];
}

export function xpProgressPercent(xp: number): number {
  const level = xpToLevel(xp);
  const currentThreshold = LEVEL_THRESHOLDS[level - 1] ?? 0;
  const nextThreshold = LEVEL_THRESHOLDS[level] ?? LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1];
  if (nextThreshold === currentThreshold) return 100;
  return Math.round(((xp - currentThreshold) / (nextThreshold - currentThreshold)) * 100);
}

const SESSION_KEY = 'speaktech_student';

export function saveStudentSession(student: Student): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(SESSION_KEY, JSON.stringify(student));
  }
}

export function getStudentSession(): Student | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem(SESSION_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as Student;
  } catch {
    return null;
  }
}

export function clearStudentSession(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(SESSION_KEY);
  }
}
