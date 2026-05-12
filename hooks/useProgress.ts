"use client";

import { useEffect, useState } from "react";

export type ProgressData = {
  completedSessions: number;
  mistakesCount: number;
  learnedVocabulary: number;
  gamesCompleted: number;
};

export function useProgress() {
  const [data, setData] = useState<ProgressData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/progress")
      .then((res) => res.json())
      .then((payload) => {
        setData(payload.data);
        setLoading(false);
      });
  }, []);

  return { data, loading };
}
