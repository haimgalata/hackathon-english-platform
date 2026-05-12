"use client";

import { useCallback, useRef, useState } from "react";

type Options = {
  onTranscript: (text: string, isFinal: boolean) => void;
  onError: (message: string) => void;
};

// SpeechRecognition is not yet in all TS lib.dom.d.ts versions
declare global {
  interface Window {
    webkitSpeechRecognition?: typeof SpeechRecognition;
  }
}

export function useMicCapture({ onTranscript, onError }: Options) {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState<boolean | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const start = useCallback(async () => {
    const SR = (typeof window !== "undefined")
      ? (window.SpeechRecognition ?? window.webkitSpeechRecognition)
      : undefined;

    if (!SR) {
      setIsSupported(false);
      onError("Speech recognition is not supported in this browser. Use Chrome or Edge, or type your reply.");
      return;
    }
    setIsSupported(true);

    // Request mic permission explicitly so we get a clear error if denied
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      // Immediately release the stream — SpeechRecognition manages its own
      stream.getTracks().forEach((t) => t.stop());
    } catch {
      onError("Microphone access was denied. Please allow microphone access in your browser settings.");
      return;
    }

    const recognition = new SR();
    recognition.continuous = false;  // Single utterance — stops automatically when student pauses
    recognition.interimResults = true;
    recognition.lang = "en-US";
    recognition.maxAlternatives = 1;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interim = "";
      let finalText = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const text = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalText += text;
        } else {
          interim += text;
        }
      }
      if (finalText) {
        onTranscript(finalText, true);
      } else if (interim) {
        onTranscript(interim, false);
      }
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      setIsListening(false);
      recognitionRef.current = null;
      if (event.error === "not-allowed" || event.error === "service-not-allowed") {
        onError("Microphone access was denied.");
      } else if (event.error !== "no-speech" && event.error !== "aborted") {
        onError(`Mic error: ${event.error}. Please try again.`);
      }
    };

    recognition.onend = () => {
      setIsListening(false);
      recognitionRef.current = null;
    };

    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  }, [onTranscript, onError]);

  const stop = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setIsListening(false);
  }, []);

  return { isListening, isSupported, start, stop };
}
