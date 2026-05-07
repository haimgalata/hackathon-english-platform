'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Feedback } from '@/types';

interface FeedbackBubbleProps {
  feedback: Feedback | null;
  scoreEarned?: number;
  onDismiss: () => void;
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
          className="bg-white rounded-2xl shadow-lg p-4 mx-4 border border-slate-100"
          onClick={onDismiss}
        >
          {/* Score earned */}
          {scoreEarned !== undefined && scoreEarned > 0 && (
            <div className="flex items-center gap-2 mb-2">
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, delay: 0.1 }}
                className="text-xl"
              >
                ⭐
              </motion.span>
              <span className="text-sm font-bold text-amber-600">+{scoreEarned} points!</span>
            </div>
          )}

          {/* Corrections */}
          {feedback?.corrections.map((c, i) => (
            <div key={i} className="flex items-start gap-2 mb-1.5">
              <span className="text-amber-500 text-xs mt-0.5 flex-shrink-0">✏️</span>
              <div className="text-xs">
                <span className="line-through text-slate-400">{c.original}</span>
                {' → '}
                <span className="font-semibold text-slate-700">{c.corrected}</span>
                {c.reason && <span className="text-slate-400 ml-1">({c.reason})</span>}
              </div>
            </div>
          ))}

          {/* Suggestions */}
          {feedback?.suggestions.map((s, i) => (
            <div key={i} className="flex items-start gap-2">
              <span className="text-purple-500 text-xs mt-0.5 flex-shrink-0">💡</span>
              <p className="text-xs text-slate-600">{s.text}</p>
            </div>
          ))}

          <p className="text-xs text-slate-300 mt-2 text-right">tap to dismiss</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
