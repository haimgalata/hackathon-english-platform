'use client';

import { motion } from 'framer-motion';

interface VoiceButtonProps {
  state: 'idle' | 'recording' | 'processing';
  onPress: () => void;
  disabled?: boolean;
}

const BUTTON_STYLES = {
  idle:       'bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg hover:shadow-xl',
  recording:  'bg-gradient-to-br from-red-500 to-rose-600 shadow-lg',
  processing: 'bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg opacity-80',
};

const BUTTON_ICONS = {
  idle:       '🎤',
  recording:  '⏹',
  processing: '⏳',
};

const BUTTON_LABELS = {
  idle:       'Tap to speak',
  recording:  'Tap to stop',
  processing: 'Processing…',
};

export default function VoiceButton({ state, onPress, disabled }: VoiceButtonProps) {
  return (
    <div className="flex flex-col items-center gap-2">
      <motion.button
        onClick={onPress}
        disabled={disabled || state === 'processing'}
        whileHover={state !== 'processing' ? { scale: 1.06 } : {}}
        whileTap={state !== 'processing' ? { scale: 0.94 } : {}}
        className={`w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl transition-all ${BUTTON_STYLES[state]} disabled:opacity-50`}
      >
        {/* Pulsing ring when recording */}
        {state === 'recording' && (
          <motion.span
            className="absolute w-16 h-16 rounded-full bg-red-400"
            animate={{ scale: [1, 1.5, 1], opacity: [0.6, 0, 0.6] }}
            transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
          />
        )}
        <span className="relative z-10">{BUTTON_ICONS[state]}</span>
      </motion.button>
      <span className="text-xs text-slate-400 font-medium">{BUTTON_LABELS[state]}</span>
    </div>
  );
}
