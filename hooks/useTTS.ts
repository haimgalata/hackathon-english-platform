'use client';

import { useCallback, useRef } from 'react';

interface UseTTSReturn {
  speak: (text: string, onEnd?: () => void) => void;
  stop: () => void;
}

export function useTTS(): UseTTSReturn {
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const speak = useCallback((text: string, onEnd?: () => void) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      onEnd?.();
      return;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.95;
    utterance.pitch = 1.05;

    // Pick a natural-sounding English voice
    const voices = window.speechSynthesis.getVoices();
    const preferred = voices.find(
      (v) =>
        v.lang.startsWith('en') &&
        (v.name.includes('Samantha') ||
          v.name.includes('Google US English') ||
          v.name.includes('Karen') ||
          v.name.includes('Zira'))
    );
    if (preferred) utterance.voice = preferred;

    utterance.onend = () => onEnd?.();
    utterance.onerror = () => onEnd?.();

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, []);

  const stop = useCallback(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  }, []);

  return { speak, stop };
}
