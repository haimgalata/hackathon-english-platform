"use client";

import { useEffect, useMemo, useState } from "react";
import { TechyAvatar } from "@/components/ui/Avatar";
import { CheckCircle, XCircle, Trophy, RotateCcw } from "lucide-react";

type Term = { id: string; term: string; meaning: string };
type MatchState = "correct" | "wrong";

export function VocabularyMatchGame() {
  const [terms, setTerms] = useState<Term[]>([]);
  const [selectedTermId, setSelectedTermId] = useState<string | null>(null);
  const [results, setResults] = useState<Record<string, MatchState>>({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/game/vocab")
      .then((res) => res.json())
      .then((payload) => {
        setTerms(payload.data ?? []);
        setLoading(false);
      });
  }, []);

  const shuffledMeanings = useMemo(() => [...terms].sort(() => Math.random() - 0.5), [terms]);

  const matchedIds = Object.keys(results);
  const score = Object.values(results).filter((r) => r === "correct").length;

  function handleTermClick(termId: string) {
    if (matchedIds.includes(termId)) return;
    setSelectedTermId((prev) => (prev === termId ? null : termId));
  }

  function handleMeaningClick(meaningTermId: string) {
    if (!selectedTermId || matchedIds.includes(meaningTermId)) return;
    const isCorrect = selectedTermId === meaningTermId;
    setResults((prev) => ({ ...prev, [selectedTermId]: isCorrect ? "correct" : "wrong" }));
    setSelectedTermId(null);
  }

  async function submitGame() {
    await fetch("/api/game/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        answers: Object.entries(results).map(([termId, state]) => ({
          termId,
          correct: state === "correct",
        })),
      }),
    });
    setSubmitted(true);
  }

  function resetGame() {
    setResults({});
    setSelectedTermId(null);
    setSubmitted(false);
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center gap-4 py-16">
        <TechyAvatar size="md" speaking />
        <p className="text-slate-400 text-sm">Loading vocabulary terms…</p>
      </div>
    );
  }

  if (submitted) {
    const isPerfect = score === terms.length;
    return (
      <div className="flex flex-col items-center gap-6 py-12 animate-pop_in">
        <TechyAvatar size="xl" speaking />
        <div className="text-center">
          <p className="text-brand-secondary text-sm font-semibold mb-1">
            {isPerfect ? "Perfect score!" : "Nice work!"}
          </p>
          <h2 className="text-4xl font-extrabold text-white mb-1">
            {score}
            <span className="text-slate-500 text-2xl">/{terms.length}</span>
          </h2>
          <p className="text-slate-400 text-sm">
            {isPerfect
              ? "You matched every term correctly. Techy is impressed!"
              : `You got ${score} out of ${terms.length} right. Keep practicing!`}
          </p>
        </div>
        {/* Score bar */}
        <div className="w-full max-w-xs">
          <div className="h-2 rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-full bg-brand-success rounded-full transition-all duration-700"
              style={{ width: `${(score / terms.length) * 100}%` }}
            />
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={resetGame} className="flex items-center gap-2 btn-primary text-sm">
            <RotateCcw size={14} aria-hidden="true" />
            Play again
          </button>
        </div>
      </div>
    );
  }

  const allMatched = matchedIds.length === terms.length;

  return (
    <div className="flex flex-col gap-5">
      {/* Techy intro + score tracker */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <TechyAvatar size="sm" />
          <p className="text-sm text-slate-300">
            Click a <span className="text-brand-secondary font-semibold">word</span>, then tap its meaning.
          </p>
        </div>
        <div className="flex items-center gap-1.5 glass-card rounded-xl px-3 py-1.5">
          <Trophy size={14} className="text-brand-warning" aria-hidden="true" />
          <span className="text-sm font-bold text-white">{score}</span>
          <span className="text-xs text-slate-500">/ {terms.length}</span>
        </div>
      </div>

      {/* Game columns */}
      <div className="grid grid-cols-2 gap-3">
        {/* Terms column */}
        <div className="flex flex-col gap-2">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-1">Terms</p>
          {terms.map((term) => {
            const state = results[term.id];
            const isSelected = selectedTermId === term.id;
            const isMatched = !!state;

            return (
              <button
                key={term.id}
                onClick={() => handleTermClick(term.id)}
                disabled={isMatched}
                className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer border ${
                  isMatched
                    ? state === "correct"
                      ? "bg-brand-success/15 border-brand-success/40 text-brand-success opacity-70 cursor-default"
                      : "bg-brand-error/15 border-brand-error/40 text-brand-error opacity-70 cursor-default"
                    : isSelected
                    ? "bg-brand-primary/25 border-brand-primary/60 text-white shadow-glow-sm"
                    : "glass-card border-surface-border text-slate-200 hover:border-brand-primary/40 hover:text-white"
                }`}
                aria-pressed={isSelected}
              >
                <span className="flex items-center justify-between gap-2">
                  {term.term}
                  {state === "correct" && <CheckCircle size={14} aria-label="Correct" />}
                  {state === "wrong" && <XCircle size={14} aria-label="Incorrect" />}
                </span>
              </button>
            );
          })}
        </div>

        {/* Meanings column */}
        <div className="flex flex-col gap-2">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-1">Meanings</p>
          {shuffledMeanings.map((term) => {
            const isMatchedByCorrect = results[term.id] === "correct";

            return (
              <button
                key={`${term.id}-meaning`}
                onClick={() => handleMeaningClick(term.id)}
                disabled={!selectedTermId || isMatchedByCorrect}
                className={`w-full text-left px-4 py-3 rounded-xl text-sm transition-all duration-200 cursor-pointer border ${
                  isMatchedByCorrect
                    ? "glass-card border-brand-success/25 text-slate-500 opacity-50 cursor-default"
                    : selectedTermId
                    ? "glass-card border-surface-border-strong text-slate-200 hover:border-brand-secondary/50 hover:bg-brand-primary/10"
                    : "glass-card border-surface-border text-slate-400 cursor-default"
                }`}
              >
                {term.meaning}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected indicator */}
      {selectedTermId && (
        <p className="text-xs text-center text-brand-secondary animate-slide_up">
          Now tap the correct meaning for &ldquo;{terms.find((t) => t.id === selectedTermId)?.term}&rdquo;
        </p>
      )}

      {/* Submit */}
      {allMatched && !submitted && (
        <button
          onClick={submitGame}
          className="btn-success flex items-center justify-center gap-2 animate-pop_in"
        >
          <Trophy size={16} aria-hidden="true" />
          Submit — see my score!
        </button>
      )}
    </div>
  );
}
