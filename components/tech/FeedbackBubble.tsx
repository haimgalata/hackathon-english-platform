'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Feedback } from '@/types';

interface FeedbackBubbleProps {
  feedback: Feedback | null;
  scoreEarned?: number;
  onDismiss: () => void;
}

function StarIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <polygon points="7,1 8.8,5.2 13.5,5.6 10,8.8 11.1,13.5 7,11 2.9,13.5 4,8.8 0.5,5.6 5.2,5.2" fill="#fbbf24" />
    </svg>
  );
}

function PencilIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
      <path d="M7.5 1.5L9.5 3.5L3.5 9.5L1 10L1.5 7.5L7.5 1.5Z" stroke="#fbbf24" strokeWidth="1.2" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

function BulbIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
      <path d="M5.5 1.5C3.6 1.5 2 3.1 2 5c0 1.2.7 2.3 1.7 2.9V8.5h3.6V7.9C8.3 7.3 9 6.2 9 5c0-1.9-1.6-3.5-3.5-3.5Z" stroke="#a78bfa" strokeWidth="1.1" fill="none"/>
      <line x1="4" y1="9.5" x2="7" y2="9.5" stroke="#a78bfa" strokeWidth="1.1" strokeLinecap="round"/>
    </svg>
  );
}

export default function FeedbackBubble({ feedback, scoreEarned, onDismiss }: FeedbackBubbleProps) {
  const hasContent =
    feedback && (feedback.corrections.length > 0 || feedback.suggestions.length > 0);

  useEffect(() => {
    if (!hasContent && !scoreEarned) return;
    const timer = setTimeout(onDismiss, 4500);
    return () => clearTimeout(timer);
  }, [feedback, hasContent, scoreEarned, onDismiss]);

  return (
    <AnimatePresence>
      {(hasContent || (scoreEarned !== undefined && scoreEarned > 0)) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.3 }}
          className="rounded-2xl p-4 mx-4 cursor-pointer"
          style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
          onClick={onDismiss}
        >
          {/* Score earned */}
          {scoreEarned !== undefined && scoreEarned > 0 && (
            <div className="flex items-center gap-2 mb-2">
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, delay: 0.1 }}
              >
                <StarIcon />
              </motion.span>
              <span className="text-sm font-bold text-amber-400">+{scoreEarned} points</span>
            </div>
          )}

          {/* Corrections */}
          {feedback?.corrections.map((c, i) => (
            <div key={i} className="flex items-start gap-2 mb-1.5">
              <span className="mt-0.5 flex-shrink-0"><PencilIcon /></span>
              <div className="text-xs">
                <span className="line-through text-white/30">{c.original}</span>
                <span className="text-white/50"> → </span>
                <span className="font-semibold text-white/80">{c.corrected}</span>
                {c.reason && <span className="text-white/35 ml-1">({c.reason})</span>}
              </div>
            </div>
          ))}

          {/* Suggestions */}
          {feedback?.suggestions.map((s, i) => (
            <div key={i} className="flex items-start gap-2">
              <span className="mt-0.5 flex-shrink-0"><BulbIcon /></span>
              <p className="text-xs text-white/55">{s.text}</p>
            </div>
          ))}

          <p className="text-[10px] text-white/20 mt-2 text-right tracking-wide">tap to dismiss</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
