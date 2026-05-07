'use client';

import { useRef, useState, useCallback } from 'react';

interface UseVoiceInputReturn {
  isRecording: boolean;
  interimText: string;
  isSupported: boolean;
  startRecording: () => void;
  stopRecording: () => Promise<string>;
}

export function useVoiceInput(): UseVoiceInputReturn {
  const [isRecording, setIsRecording] = useState(false);
  const [interimText, setInterimText] = useState('');
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const resolveRef = useRef<((transcript: string) => void) | null>(null);
  const finalTranscriptRef = useRef('');

  const isSupported =
    typeof window !== 'undefined' &&
    ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);

  const startRecording = useCallback(() => {
    if (!isSupported) return;

    const SpeechRec =
      (window as typeof window & { webkitSpeechRecognition?: typeof SpeechRecognition }).webkitSpeechRecognition ??
      window.SpeechRecognition;

    const recognition = new SpeechRec();
    recognition.lang = 'en-US';
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;
    recognition.continuous = false;

    finalTranscriptRef.current = '';
    setInterimText('');
    setIsRecording(true);

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interim = '';
      let final = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          final += result[0].transcript;
        } else {
          interim += result[0].transcript;
        }
      }
      if (final) finalTranscriptRef.current += final;
      setInterimText(finalTranscriptRef.current + interim);
    };

    recognition.onend = () => {
      setIsRecording(false);
      setInterimText('');
      const transcript = finalTranscriptRef.current.trim();
      resolveRef.current?.(transcript);
      resolveRef.current = null;
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.warn('Speech recognition error:', event.error);
      setIsRecording(false);
      setInterimText('');
      resolveRef.current?.('');
      resolveRef.current = null;
    };

    recognitionRef.current = recognition;
    recognition.start();
  }, [isSupported]);

  const stopRecording = useCallback((): Promise<string> => {
    return new Promise((resolve) => {
      resolveRef.current = resolve;
      if (recognitionRef.current && isRecording) {
        recognitionRef.current.stop();
      } else {
        resolve(finalTranscriptRef.current.trim());
      }
    });
  }, [isRecording]);

  return { isRecording, interimText, isSupported, startRecording, stopRecording };
}
