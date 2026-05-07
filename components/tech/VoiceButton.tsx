'use client';

import { motion } from 'framer-motion';

interface VoiceButtonProps {
  state: 'idle' | 'recording' | 'processing';
  onPress: () => void;
  disabled?: boolean;
}

function MicIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
      <rect x="9" y="2" width="8" height="14" rx="4" fill="currentColor" opacity="0.9" />
      <path d="M5 12a8 8 0 0 0 16 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" fill="none" opacity="0.9" />
      <line x1="13" y1="20" x2="13" y2="24" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" opacity="0.9" />
      <line x1="9" y1="24" x2="17" y2="24" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" opacity="0.9" />
    </svg>
  );
}

function StopIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <rect x="5" y="5" width="12" height="12" rx="2.5" fill="currentColor" opacity="0.9" />
    </svg>
  );
}

function SpinnerIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" strokeDasharray="20 40" strokeLinecap="round" opacity="0.6">
        <animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="1s" repeatCount="indefinite" />
      </circle>
    </svg>
  );
}

const BUTTON_CONFIG = {
  idle: {
    label: 'Tap to speak',
    bg: 'rgba(0,212,255,0.12)',
    border: 'rgba(0,212,255,0.4)',
    color: '#00d4ff',
    glow: '0 0 24px rgba(0,212,255,0.35), 0 0 48px rgba(0,212,255,0.12)',
  },
  recording: {
    label: 'Tap to stop',
    bg: 'rgba(239,68,68,0.12)',
    border: 'rgba(239,68,68,0.5)',
    color: '#f87171',
    glow: '0 0 24px rgba(239,68,68,0.4), 0 0 48px rgba(239,68,68,0.12)',
  },
  processing: {
    label: 'Processing…',
    bg: 'rgba(251,191,36,0.08)',
    border: 'rgba(251,191,36,0.3)',
    color: '#fbbf24',
    glow: 'none',
  },
};

export default function VoiceButton({ state, onPress, disabled }: VoiceButtonProps) {
  const cfg = BUTTON_CONFIG[state];

  return (
    <div className="flex flex-col items-center gap-2.5">
      <div className="relative">
        {/* Pulsing outer ring when recording */}
        {state === 'recording' && (
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)' }}
            animate={{ scale: [1, 1.6, 1], opacity: [0.7, 0, 0.7] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
          />
        )}

        <motion.button
          onClick={onPress}
          disabled={disabled || state === 'processing'}
          whileHover={state !== 'processing' ? { scale: 1.08 } : {}}
          whileTap={state !== 'processing' ? { scale: 0.93 } : {}}
          className="relative w-[68px] h-[68px] rounded-full flex items-center justify-center transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          style={{
            background: cfg.bg,
            border: `1.5px solid ${cfg.border}`,
            color: cfg.color,
            boxShadow: cfg.glow,
          }}
        >
          {state === 'idle' && <MicIcon />}
          {state === 'recording' && <StopIcon />}
          {state === 'processing' && <SpinnerIcon />}
        </motion.button>
      </div>

      <span className="text-xs text-white/35 font-medium tracking-wide">{cfg.label}</span>
    </div>
  );
}
