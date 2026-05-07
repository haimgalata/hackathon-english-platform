'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { AvatarState } from '@/types';

interface TechyAvatarProps {
  state: AvatarState;
}

const STATE_GLOW: Record<AvatarState, { ring: string; bg: string }> = {
  idle:      { ring: '#818CF8', bg: 'rgba(129,140,248,0.13)' },
  listening: { ring: '#34D399', bg: 'rgba(52,211,153,0.13)'  },
  thinking:  { ring: '#FBBF24', bg: 'rgba(251,191,36,0.13)'  },
  speaking:  { ring: '#60A5FA', bg: 'rgba(96,165,250,0.13)'  },
};

const STATE_LABELS: Record<AvatarState, string> = {
  idle:      'Ready',
  listening: 'Listening…',
  thinking:  'Thinking…',
  speaking:  'Speaking…',
};

// Lip-sync frames for speaking state (same path structure: M x y Q cx cy ex ey)
const MOUTH_FRAMES = [
  'M 85 134 Q 100 139 115 134',
  'M 82 132 Q 100 148 118 132',
  'M 85 133 Q 100 144 115 133',
  'M 86 133 Q 100 137 114 133',
] as const;

// Static mouth paths for non-speaking states
const STATIC_MOUTH: Record<Exclude<AvatarState, 'speaking'>, string> = {
  idle:      'M 85 133 Q 100 141 115 133',
  listening: 'M 87 134 Q 100 134 113 134',
  thinking:  'M 86 135 Q 93 130 100 134 Q 107 138 114 134',
};

// Eyebrow vertical shift per state (negative = raised)
const BROW_Y: Record<AvatarState, number> = {
  idle:      0,
  listening: -2.5,
  thinking:  1.5,
  speaking:  -1,
};

export default function TechyAvatar({ state }: TechyAvatarProps) {
  const [isBlinking, setIsBlinking] = useState(false);
  const [mouthFrame, setMouthFrame] = useState(0);
  const glow = STATE_GLOW[state];

  // Blink at a natural irregular interval
  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;
    function scheduleBlink() {
      timeoutId = setTimeout(() => {
        setIsBlinking(true);
        setTimeout(() => {
          setIsBlinking(false);
          scheduleBlink();
        }, 140);
      }, 3500 + Math.random() * 2000);
    }
    scheduleBlink();
    return () => clearTimeout(timeoutId);
  }, []);

  // Fake lip-sync: cycle mouth frames while speaking
  useEffect(() => {
    if (state !== 'speaking') {
      setMouthFrame(0);
      return;
    }
    const interval = setInterval(() => {
      setMouthFrame((prev) => (prev + 1) % 4);
    }, 110);
    return () => clearInterval(interval);
  }, [state]);

  const mouthPath =
    state === 'speaking'
      ? MOUTH_FRAMES[mouthFrame]
      : STATIC_MOUTH[state as Exclude<AvatarState, 'speaking'>];

  const browY = BROW_Y[state];

  return (
    <div className="flex flex-col items-center gap-3">
      <div className={`avatar-${state}`}>
        <svg viewBox="0 0 200 245" width="200" height="245" aria-label="Techy AI tutor avatar">
          {/* ── AMBIENT GLOW ── */}
          <circle cx="100" cy="116" r="90" fill={glow.bg} />

          {/* ── STATE RING ── */}
          <motion.circle
            cx="100" cy="116" r="92"
            fill="none"
            stroke={glow.ring}
            strokeWidth="2.5"
            animate={{
              opacity: state === 'listening' ? [0.35, 0.85, 0.35] : 0.5,
            }}
            transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }}
          />

          {/* ── DROP SHADOW ── */}
          <ellipse cx="100" cy="240" rx="42" ry="6" fill="rgba(0,0,0,0.06)" />

          {/* ── BODY / OUTFIT ── */}
          <path
            d="M 20 245 Q 22 196 58 182 Q 76 174 100 170 Q 124 174 142 182 Q 178 196 180 245 Z"
            fill="#6366F1"
          />
          {/* Outfit collar / neckline */}
          <path
            d="M 82 174 Q 100 186 118 174 Q 111 195 100 197 Q 89 195 82 174 Z"
            fill="#4F46E5"
          />
          {/* Subtle shirt texture */}
          <line x1="78" y1="208" x2="96" y2="208" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" />
          <line x1="104" y1="208" x2="122" y2="208" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" />

          {/* ── NECK ── */}
          <rect x="88" y="155" width="24" height="21" rx="9" fill="#E8A87C" />
          {/* Neck shadow */}
          <rect x="88" y="168" width="24" height="8" rx="4" fill="rgba(180,100,50,0.18)" />

          {/* ── HAIR BACK LAYER ── */}
          <path
            d="M 44 104 C 40 57 66 34 100 32 C 134 34 160 57 156 104 C 162 155 138 176 100 177 C 62 176 38 155 44 104 Z"
            fill="#2C1A0D"
          />

          {/* ── HEAD ── */}
          <ellipse cx="100" cy="106" rx="52" ry="57" fill="url(#skinGrad)" />

          {/* ── EARS ── */}
          <ellipse cx="48" cy="110" rx="7" ry="10" fill="#DFA06E" />
          <ellipse cx="152" cy="110" rx="7" ry="10" fill="#DFA06E" />
          <ellipse cx="48" cy="110" rx="4" ry="6" fill="rgba(180,90,40,0.3)" />
          <ellipse cx="152" cy="110" rx="4" ry="6" fill="rgba(180,90,40,0.3)" />
          {/* Earring studs */}
          <circle cx="47" cy="121" r="3" fill="#818CF8" />
          <circle cx="153" cy="121" r="3" fill="#818CF8" />

          {/* ── HAIR FRONT (over forehead, behind face features) ── */}
          <path
            d="M 50 97 C 48 59 70 36 100 34 C 130 36 152 59 150 97 C 144 73 122 60 100 58 C 78 60 56 73 50 97 Z"
            fill="#3D2314"
          />
          {/* Hair highlight sheen */}
          <path
            d="M 87 42 C 92 35 100 33 108 37 C 100 40 92 47 87 54 Z"
            fill="#5C3317"
            opacity="0.5"
          />
          <path
            d="M 106 37 C 114 36 120 40 124 46 C 117 44 110 43 106 45 Z"
            fill="#5C3317"
            opacity="0.3"
          />

          {/* ── EYEBROWS ── */}
          <motion.path
            d="M 67 89 Q 77 84 87 87"
            stroke="#2C1A0D"
            strokeWidth="2.8"
            strokeLinecap="round"
            fill="none"
            animate={{ y: browY }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
          />
          <motion.path
            d="M 113 87 Q 123 84 133 89"
            stroke="#2C1A0D"
            strokeWidth="2.8"
            strokeLinecap="round"
            fill="none"
            animate={{ y: browY }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
          />

          {/* ── EYES ── */}
          {/* Left eye */}
          <motion.g
            animate={{ scaleY: isBlinking ? 0.04 : 1 }}
            transition={{ duration: 0.1 }}
            style={{ transformOrigin: '80px 102px' }}
          >
            <ellipse cx="80" cy="102" rx="13" ry="11.5" fill="white" />
            <circle cx="80" cy="103" r="8.5" fill="url(#irisGrad)" />
            <circle cx="80" cy="103" r="4.5" fill="#180A00" />
            <circle cx="75" cy="98.5" r="3.2" fill="white" opacity="0.92" />
            <circle cx="84" cy="107" r="1.5" fill="white" opacity="0.4" />
          </motion.g>
          {/* Right eye */}
          <motion.g
            animate={{ scaleY: isBlinking ? 0.04 : 1 }}
            transition={{ duration: 0.1 }}
            style={{ transformOrigin: '120px 102px' }}
          >
            <ellipse cx="120" cy="102" rx="13" ry="11.5" fill="white" />
            <circle cx="120" cy="103" r="8.5" fill="url(#irisGrad)" />
            <circle cx="120" cy="103" r="4.5" fill="#180A00" />
            <circle cx="115" cy="98.5" r="3.2" fill="white" opacity="0.92" />
            <circle cx="124" cy="107" r="1.5" fill="white" opacity="0.4" />
          </motion.g>

          {/* Upper eyelashes */}
          <path d="M 66 95 Q 80 87 94 95"
            stroke="#180A00" strokeWidth="2.8" fill="none" strokeLinecap="round" />
          <path d="M 106 95 Q 120 87 134 95"
            stroke="#180A00" strokeWidth="2.8" fill="none" strokeLinecap="round" />

          {/* ── NOSE (subtle) ── */}
          <path
            d="M 96 117 Q 94 123 97 125 Q 100 126 103 125 Q 106 123 104 117"
            stroke="#C8885A"
            strokeWidth="1.5"
            fill="none"
            strokeLinecap="round"
            opacity="0.5"
          />

          {/* ── CHEEK BLUSH ── */}
          <ellipse cx="67" cy="120" rx="15" ry="10" fill="#FFB4A0" opacity="0.2" />
          <ellipse cx="133" cy="120" rx="15" ry="10" fill="#FFB4A0" opacity="0.2" />

          {/* ── MOUTH ── */}
          <motion.path
            d={mouthPath}
            stroke="#CC6644"
            strokeWidth="2.3"
            strokeLinecap="round"
            fill="none"
            animate={{ d: mouthPath }}
            transition={{ duration: 0.09, ease: 'easeOut' }}
          />
          {/* Subtle lip fill */}
          <motion.path
            d={`${mouthPath} Z`}
            fill="rgba(220,100,80,0.07)"
            animate={{ d: `${mouthPath} Z` }}
            transition={{ duration: 0.09 }}
          />

          {/* ── THINKING SPINNER ── */}
          {state === 'thinking' && (
            <motion.circle
              cx="100" cy="106"
              r="70"
              fill="none"
              stroke="#FBBF24"
              strokeWidth="3"
              strokeDasharray="28 210"
              opacity="0.75"
              animate={{ rotate: 360 }}
              transition={{ duration: 1.3, repeat: Infinity, ease: 'linear' }}
              style={{ transformOrigin: '100px 106px' }}
            />
          )}

          {/* ── LISTENING WAVEFORM ── */}
          {state === 'listening' && (
            <>
              {[0, 1, 2, 3, 4].map((i) => (
                <motion.rect
                  key={i}
                  x={65 + i * 14}
                  y={163}
                  width={8}
                  height={9}
                  rx={4}
                  fill="#34D399"
                  opacity="0.85"
                  animate={{ scaleY: [0.4, 1.6, 0.4] }}
                  transition={{
                    duration: 0.48,
                    repeat: Infinity,
                    delay: i * 0.1,
                    ease: 'easeInOut',
                  }}
                  style={{ transformOrigin: `${65 + i * 14 + 4}px 167px` }}
                />
              ))}
            </>
          )}

          {/* ── DEFS ── */}
          <defs>
            <linearGradient id="skinGrad" x1="0.2" y1="0" x2="0.8" y2="1">
              <stop offset="0%" stopColor="#F5C8A4" />
              <stop offset="100%" stopColor="#DF9A6A" />
            </linearGradient>
            <radialGradient id="irisGrad" cx="0.38" cy="0.33" r="0.65">
              <stop offset="0%"   stopColor="#A07040" />
              <stop offset="55%"  stopColor="#6B3F2A" />
              <stop offset="100%" stopColor="#3A1E0C" />
            </radialGradient>
          </defs>
        </svg>
      </div>

      {/* State label */}
      <AnimatePresence mode="wait">
        <motion.div
          key={state}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.2 }}
          className="flex items-center gap-1.5"
        >
          <motion.div
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: glow.ring }}
            animate={{ scale: state === 'speaking' ? [1, 1.4, 1] : 1 }}
            transition={{ duration: 0.4, repeat: Infinity }}
          />
          <span className="text-sm font-medium text-slate-500">{STATE_LABELS[state]}</span>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
