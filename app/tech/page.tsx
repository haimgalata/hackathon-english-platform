'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useStudentSession } from '@/hooks/useStudentSession';
import { useVoiceInput } from '@/hooks/useVoiceInput';
import { useTTS } from '@/hooks/useTTS';
import TechyAvatar from '@/components/tech/TechyAvatar';
import ConversationPanel from '@/components/tech/ConversationPanel';
import VoiceButton from '@/components/tech/VoiceButton';
import FeedbackBubble from '@/components/tech/FeedbackBubble';
import ScenarioSelector from '@/components/tech/ScenarioSelector';
import type { AvatarState, ConversationMessage, Feedback, ScenarioKey } from '@/types';

type ButtonState = 'idle' | 'recording' | 'processing';

export default function TechPage() {
  const { student, updateStudent } = useStudentSession(true);
  const { isRecording, interimText, isSupported, startRecording, stopRecording } = useVoiceInput();
  const { speak, stop: stopTTS } = useTTS();

  const [avatarState, setAvatarState] = useState<AvatarState>('idle');
  const [buttonState, setButtonState] = useState<ButtonState>('idle');
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentFeedback, setCurrentFeedback] = useState<Feedback | null>(null);
  const [lastScore, setLastScore] = useState<number | undefined>(undefined);
  const [scenario, setScenario] = useState<ScenarioKey>('interview');
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [showBrowserWarning, setShowBrowserWarning] = useState(false);

  // Check browser compatibility
  useEffect(() => {
    const isFirefox = typeof navigator !== 'undefined' && navigator.userAgent.includes('Firefox');
    if (isFirefox || (!isSupported && typeof window !== 'undefined')) {
      setShowBrowserWarning(true);
    }
  }, [isSupported]);

  // Mirror recording state to avatar
  useEffect(() => {
    if (isRecording) setAvatarState('listening');
  }, [isRecording]);

  // Start a session when student is ready
  useEffect(() => {
    if (!student) return;
    async function startSession() {
      try {
        const res = await fetch('/api/sessions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ studentId: student!.id, scenario }),
        });
        if (res.ok) {
          const s = await res.json();
          setSessionId(s.id);
        }
      } catch {
        // non-critical — demo continues without session ID
      }
    }
    startSession();
  }, [student, scenario]);

  const handleScenarioChange = useCallback((key: ScenarioKey) => {
    setScenario(key);
    setMessages([]);
    setSessionId(null);
    setAvatarState('idle');
    stopTTS();
  }, [stopTTS]);

  const handleVoicePress = useCallback(async () => {
    if (!isSupported) {
      setShowBrowserWarning(true);
      return;
    }

    if (buttonState === 'idle') {
      startRecording();
      setButtonState('recording');
      setAvatarState('listening');
      return;
    }

    if (buttonState === 'recording') {
      setButtonState('processing');
      setAvatarState('thinking');

      const transcript = await stopRecording();

      if (!transcript) {
        setAvatarState('idle');
        setButtonState('idle');
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: "I didn't catch that — could you try again? 😊" },
        ]);
        return;
      }

      // Add user message
      setMessages((prev) => [...prev, { role: 'user', content: transcript }]);
      setIsLoading(true);

      try {
        const history = messages
          .filter((m) => !m.isInterim)
          .slice(-10)
          .map(({ role, content }) => ({ role, content }));

        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            studentId: student?.id ?? '',
            sessionId: sessionId ?? '',
            message: transcript,
            scenario,
            history,
          }),
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          const detail = (errData as { detail?: string }).detail ?? '';
          if (detail.includes('quota') || detail.includes('429')) {
            throw new Error('QUOTA');
          }
          throw new Error('API error');
        }

        const { reply, feedback } = await res.json();

        setMessages((prev) => [...prev, { role: 'assistant', content: reply, feedback }]);
        setCurrentFeedback(feedback);
        setLastScore(feedback?.scoreEarned);
        setIsLoading(false);
        setAvatarState('speaking');

        // Award XP and update local state
        if (student && feedback?.scoreEarned > 0) {
          fetch(`/api/students/${student.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ xpDelta: feedback.scoreEarned }),
          })
            .then((r) => r.json())
            .then((updated) => updateStudent(updated))
            .catch(() => {});
        }

        // Speak the reply
        speak(reply, () => setAvatarState('idle'));
      } catch (err) {
        setIsLoading(false);
        setAvatarState('idle');
        const isQuota = err instanceof Error && err.message === 'QUOTA';
        const errorMsg = isQuota
          ? "⚠️ OpenAI quota exceeded. Please add credits at platform.openai.com/billing and try again."
          : "Oops, something went wrong. Let's try again!";
        setMessages((prev) => [...prev, { role: 'assistant', content: errorMsg }]);
      } finally {
        setButtonState('idle');
      }
    }
  }, [
    buttonState, isSupported, messages, scenario, sessionId,
    speak, startRecording, stopRecording, student, updateStudent,
  ]);

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50 max-w-lg mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/60 bg-white/50 backdrop-blur-sm">
        <Link href="/dashboard" className="text-indigo-500 text-sm font-medium flex items-center gap-1">
          ← Dashboard
        </Link>
        <h1 className="text-base font-bold text-slate-700">Techy — AI Tutor</h1>
        {student && (
          <span className="text-xs text-slate-500 font-medium">⭐ {student.score}</span>
        )}
      </div>

      {/* Browser warning */}
      {showBrowserWarning && (
        <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 flex items-center justify-between">
          <p className="text-xs text-amber-700">For voice input, use Chrome or Edge.</p>
          <button onClick={() => setShowBrowserWarning(false)} className="text-amber-500 text-xs ml-2">✕</button>
        </div>
      )}

      {/* Scenario selector */}
      <div className="px-4 pt-3 pb-2">
        <ScenarioSelector selected={scenario} onSelect={handleScenarioChange} />
      </div>

      {/* Avatar */}
      <div className="flex justify-center py-3">
        <TechyAvatar state={avatarState} />
      </div>

      {/* Conversation */}
      <div className="flex-1 flex flex-col overflow-hidden bg-slate-50/70 rounded-t-3xl mx-2 shadow-inner">
        <ConversationPanel
          messages={messages}
          isLoading={isLoading}
          interimText={interimText}
        />

        {/* Feedback bubble */}
        <FeedbackBubble
          feedback={currentFeedback}
          scoreEarned={lastScore}
          onDismiss={() => { setCurrentFeedback(null); setLastScore(undefined); }}
        />

        {/* Voice input */}
        <div className="flex justify-center py-5 border-t border-slate-200/70 bg-white/60">
          <VoiceButton
            state={buttonState}
            onPress={handleVoicePress}
            disabled={isLoading}
          />
        </div>
      </div>
    </div>
  );
}
