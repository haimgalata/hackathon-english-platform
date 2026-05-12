"use client";

import { TechyAvatar } from "@/components/ui/Avatar";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-5 px-4 text-center">
      <TechyAvatar size="lg" />
      <div>
        <h1 className="text-2xl font-extrabold text-white mb-2">Something went wrong</h1>
        <p className="text-slate-400 text-sm max-w-sm">{error.message || "An unexpected error occurred."}</p>
      </div>
      <button className="btn-primary text-sm" onClick={() => reset()}>
        Try again
      </button>
    </div>
  );
}
