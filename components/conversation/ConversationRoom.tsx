"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { useRealtimeConversation } from "@/hooks/useRealtimeConversation";
import { useMicCapture } from "@/hooks/useMicCapture";
import { ChatBubble, TypingIndicator } from "@/components/ui/ChatBubble";
import { TechyAvatar } from "@/components/ui/Avatar";
import { Send, AlertTriangle, CheckCircle, Mic, MicOff, XCircle } from "lucide-react";

type Props = {
  sessionId: string;
  starterText: string;
};

export function ConversationRoom({ sessionId, starterText }: Props) {
  const { messages, feedback, loading, sendTurn } = useRealtimeConversation(sessionId, starterText);
  const [text, setText] = useState("");
  const [isTechySpeaking, setIsTechySpeaking] = useState(false);
  const [micError, setMicError] = useState<string | null>(null);
  const [sendError, setSendError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  // Tracks whether the text box is currently showing interim (unconfirmed) mic speech
  const isInterimRef = useRef(false);

  const { isListening, isSupported, start: startMic, stop: stopMic } = useMicCapture({
    onTranscript: (transcript, isFinal) => {
      setText(transcript);
      isInterimRef.current = !isFinal;
      // When we get a final transcript the student can review it, then press Send/Enter
    },
    onError: (msg) => {
      setMicError(msg);
    },
  });

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  async function handleSend(value: string) {
    if (!value.trim() || loading) return;
    setSendError(null);
    isInterimRef.current = false;
    setText("");

    try {
      const reply = await sendTurn(value);

      if (reply) {
        setIsTechySpeaking(true);
        try {
          const tts = await fetch("/api/tts", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: reply }),
          }).then((res) => res.json());

          if (tts?.data?.audioBase64) {
            const audio = new Audio(`data:audio/mpeg;base64,${tts.data.audioBase64}`);
            audio.onended = () => setIsTechySpeaking(false);
            audio.onerror = () => setIsTechySpeaking(false);
            await audio.play().catch(() => setIsTechySpeaking(false));
          } else {
            setIsTechySpeaking(false);
          }
        } catch {
          setIsTechySpeaking(false);
        }
      }
    } catch {
      // Restore text so the student can retry
      setText(value);
      setSendError("Could not reach Techy. Check your connection and try again.");
    }
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    handleSend(text);
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend(text);
    }
  }

  function handleMicClick() {
    setMicError(null);
    if (isListening) {
      stopMic();
    } else {
      startMic();
    }
  }

  function handleInterrupt() {
    stopMic();
    setIsTechySpeaking(false);
  }

  const micUnsupported = isSupported === false;

  return (
    <div className="flex flex-col gap-4">
      {/* Message area */}
      <div
        ref={scrollRef}
        className="flex flex-col gap-4 h-[480px] overflow-y-auto rounded-2xl glass-card p-4 scroll-smooth"
        aria-live="polite"
        aria-label="Conversation with Techy"
      >
        {messages.map((message, index) => (
          <ChatBubble
            key={`${message.speaker}-${index}`}
            speaker={message.speaker}
            text={message.text}
            speaking={message.speaker === "TECHY" && isTechySpeaking && index === messages.length - 1}
          />
        ))}
        {loading && <TypingIndicator />}
      </div>

      {/* Feedback panel */}
      {feedback && (
        <div className="rounded-2xl border border-brand-warning/30 bg-brand-warning/10 p-4 animate-slide_up">
          <div className="flex items-start gap-3">
            <TechyAvatar size="sm" />
            <div className="flex-1">
              <p className="text-xs font-semibold text-brand-warning mb-2 flex items-center gap-1.5">
                <AlertTriangle size={12} aria-hidden="true" />
                Quick tip from Techy
              </p>
              <div className="space-y-1.5 text-sm">
                <div className="flex items-start gap-2">
                  <span className="text-brand-error font-medium flex-shrink-0">Instead of:</span>
                  <span className="text-slate-300 line-through">{feedback.wrong}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-brand-success font-medium flex-shrink-0 flex items-center gap-1">
                    <CheckCircle size={11} aria-hidden="true" /> Try:
                  </span>
                  <span className="text-slate-100 font-medium">&ldquo;{feedback.better}&rdquo;</span>
                </div>
                <p className="text-slate-400 text-xs pt-1 border-t border-white/5 mt-2">{feedback.why}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Status indicator */}
      <div className="flex items-center gap-2">
        <span
          className={`w-2 h-2 rounded-full flex-shrink-0 ${
            isListening
              ? "bg-brand-success animate-pulse"
              : isTechySpeaking
              ? "bg-brand-primary animate-pulse"
              : "bg-slate-600"
          }`}
          aria-hidden="true"
        />
        <p className="text-xs text-slate-500">
          {isListening
            ? isInterimRef.current
              ? "Listening… speak clearly"
              : "Done — review your words, then press Send"
            : isTechySpeaking
            ? "Techy is speaking…"
            : "Your turn to reply"}
        </p>
      </div>

      {/* Send error */}
      {sendError && (
        <p className="text-xs text-brand-error flex items-center gap-1.5" role="alert">
          <XCircle size={12} aria-hidden="true" />
          {sendError}
        </p>
      )}

      {/* Mic error */}
      {micError && (
        <p className="text-xs text-brand-warning flex items-center gap-1.5" role="alert">
          <AlertTriangle size={12} aria-hidden="true" />
          {micError}
        </p>
      )}

      {/* Input form */}
      <form onSubmit={onSubmit} className="flex gap-2 items-end">
        <textarea
          value={text}
          onChange={(e) => { setText(e.target.value); isInterimRef.current = false; }}
          onKeyDown={onKeyDown}
          rows={2}
          className={`input-field resize-none flex-1 ${isInterimRef.current ? "text-slate-400 italic" : ""}`}
          placeholder="Type your reply… (Enter to send, Shift+Enter for new line)"
          disabled={loading}
          aria-label="Your message to Techy"
        />
        <button
          type="submit"
          disabled={loading || !text.trim()}
          className="btn-primary flex items-center gap-2 h-[60px] px-4 flex-shrink-0"
          aria-label="Send message"
        >
          <Send size={16} aria-hidden="true" />
          <span className="hidden sm:inline">{loading ? "Thinking…" : "Send"}</span>
        </button>
      </form>

      {/* Mic controls */}
      <div className="flex gap-2 flex-wrap">
        {micUnsupported ? (
          <p className="text-xs text-slate-500 flex items-center gap-1.5">
            <MicOff size={12} aria-hidden="true" />
            Voice input not available in this browser — type your reply instead.
          </p>
        ) : (
          <button
            type="button"
            onClick={handleMicClick}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer ${
              isListening
                ? "bg-brand-success/20 border border-brand-success/40 text-brand-success"
                : "bg-white/5 border border-white/10 text-slate-400 hover:text-slate-200 hover:bg-white/10"
            }`}
            aria-label={isListening ? "Stop listening" : "Start microphone"}
          >
            {isListening ? (
              <><MicOff size={14} aria-hidden="true" /> Stop mic</>
            ) : (
              <><Mic size={14} aria-hidden="true" /> Speak your reply</>
            )}
          </button>
        )}

        {isTechySpeaking && (
          <button
            type="button"
            onClick={handleInterrupt}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-brand-error/15 border border-brand-error/30 text-brand-error hover:bg-brand-error/25 transition-all duration-200 cursor-pointer"
          >
            Interrupt Techy
          </button>
        )}
      </div>
    </div>
  );
}
