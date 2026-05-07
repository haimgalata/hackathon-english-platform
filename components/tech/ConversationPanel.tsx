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

function TechyBadge() {
  return (
    <div
      className="w-7 h-7 rounded-full flex items-center justify-center text-xs mr-2 mt-1 flex-shrink-0 font-bold"
      style={{ background: 'linear-gradient(135deg, #00d4ff22, #e040fb22)', border: '1px solid rgba(0,212,255,0.3)', color: '#00d4ff' }}
    >
      T
    </div>
  );
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
          <p className="text-white/30 text-sm">Tap the mic button to start talking with Techy</p>
          <p className="text-white/20 text-xs mt-1 tracking-wide">Speak in English and earn points</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 scrollbar-hide">
      <AnimatePresence initial={false}>
        {messages.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.role === 'assistant' && <TechyBadge />}
            <div
              className={`max-w-[78%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'text-white rounded-br-sm'
                  : 'text-white/85 rounded-bl-sm'
              }`}
              style={
                msg.role === 'user'
                  ? { background: 'rgba(0,212,255,0.18)', border: '1px solid rgba(0,212,255,0.2)' }
                  : { background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }
              }
            >
              {msg.content}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Interim / live transcript */}
      {interimText && (
        <div className="flex justify-end">
          <div
            className="max-w-[78%] px-4 py-2.5 rounded-2xl rounded-br-sm text-sm text-[#00d4ff]/70 italic"
            style={{ background: 'rgba(0,212,255,0.06)', border: '1px solid rgba(0,212,255,0.15)' }}
          >
            {interimText}
          </div>
        </div>
      )}

      {/* Loading dots while AI thinks */}
      {isLoading && (
        <div className="flex justify-start items-center">
          <TechyBadge />
          <div
            className="rounded-2xl rounded-bl-sm"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            <LoadingDots />
          </div>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
}
