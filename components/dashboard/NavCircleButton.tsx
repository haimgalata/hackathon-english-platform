'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

interface NavCircleButtonProps {
  href: string;
  label: string;
  icon: string;
  color: string;
  description?: string;
}

function TechIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="3" fill="#00d4ff" opacity="0.8" />
      <circle cx="12" cy="12" r="7" stroke="#00d4ff" strokeWidth="1" opacity="0.4" />
      <line x1="12" y1="2" x2="12" y2="6" stroke="#00d4ff" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
      <line x1="12" y1="18" x2="12" y2="22" stroke="#00d4ff" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
      <line x1="2" y1="12" x2="6" y2="12" stroke="#00d4ff" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
      <line x1="18" y1="12" x2="22" y2="12" stroke="#00d4ff" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
    </svg>
  );
}

function PracticeIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="7" width="18" height="12" rx="3" stroke="#e040fb" strokeWidth="1.2" opacity="0.7" />
      <circle cx="8" cy="13" r="2" stroke="#e040fb" strokeWidth="1.2" opacity="0.6" />
      <line x1="14" y1="11" x2="18" y2="11" stroke="#e040fb" strokeWidth="1.2" strokeLinecap="round" opacity="0.5" />
      <line x1="14" y1="14" x2="16" y2="14" stroke="#e040fb" strokeWidth="1.2" strokeLinecap="round" opacity="0.5" />
      <line x1="10" y1="5" x2="14" y2="5" stroke="#e040fb" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
    </svg>
  );
}

export default function NavCircleButton({ href, label, description }: NavCircleButtonProps) {
  const isTech = label === 'TECH';
  const accentColor = isTech ? '#00d4ff' : '#e040fb';
  const glowColor = isTech ? 'rgba(0,212,255,0.12)' : 'rgba(224,64,251,0.12)';
  const borderHoverColor = isTech ? 'rgba(0,212,255,0.35)' : 'rgba(224,64,251,0.35)';

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="w-full"
    >
      <Link
        href={href}
        className="flex items-center gap-4 p-5 rounded-2xl w-full transition-all group"
        style={{
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.08)',
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.background = glowColor;
          (e.currentTarget as HTMLElement).style.borderColor = borderHoverColor;
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)';
          (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.08)';
        }}
      >
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-all"
          style={{
            background: `rgba(${isTech ? '0,212,255' : '224,64,251'},0.08)`,
            border: `1px solid rgba(${isTech ? '0,212,255' : '224,64,251'},0.2)`,
          }}
        >
          {isTech ? <TechIcon /> : <PracticeIcon />}
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-white font-bold text-base tracking-widest" style={{ color: accentColor }}>
            {label}
          </p>
          {description && (
            <p className="text-white/40 text-xs mt-0.5 truncate">{description}</p>
          )}
        </div>

        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" opacity="0.4">
          <path
            d="M6 3l5 5-5 5"
            stroke={accentColor}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </Link>
    </motion.div>
  );
}
