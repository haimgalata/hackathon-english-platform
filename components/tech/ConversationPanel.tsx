'use client';

import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { ConversationMessage } from '@/types';
import LoadingDots from '@/components/ui/LoadingDots';

interface ConversationPanelProps {
  messages: ConversationMessage[];
  isLoading: boolean;
  interimText?: string;
}

export default function ConversationPanel({ messages, isLoading, interimText }: ConversationPanelProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading, interimText]);

  if (messages.length === 0 && !isLoading && !interimText) {
    return (
      <div className="flex-1 flex items-center justify-center text-center p-6">
        <div>
          <p className="text-slate-400 text-sm">Tap the mic button below to start talking with Techy!</p>
          <p className="text-slate-300 text-xs mt-1">Speak in English and earn points 🎯</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
      <AnimatePresence initial={false}>
        {messages.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.role === 'assistant' && (
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-xs mr-2 mt-1 flex-shrink-0">
                🤖
              </div>
            )}
            <div
              className={`max-w-[78%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-indigo-500 text-white rounded-br-sm'
                  : 'bg-white shadow-sm text-slate-700 rounded-bl-sm'
              }`}
            >
              {msg.content}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Interim / live transcript */}
      {interimText && (
        <div className="flex justify-end">
          <div className="max-w-[78%] px-4 py-2.5 rounded-2xl rounded-br-sm text-sm bg-indigo-200 text-indigo-700 italic">
            {interimText}
          </div>
        </div>
      )}

      {/* Loading dots while AI thinks */}
      {isLoading && (
        <div className="flex justify-start items-center">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-xs mr-2 flex-shrink-0">
            🤖
          </div>
          <div className="bg-white shadow-sm rounded-2xl rounded-bl-sm">
            <LoadingDots />
          </div>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
}
