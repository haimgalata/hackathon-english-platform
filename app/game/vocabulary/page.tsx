import Link from "next/link";
import { VocabularyMatchGame } from "@/components/game/VocabularyMatchGame";
import { ArrowLeft } from "lucide-react";

export default function VocabularyGamePage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-white mb-1">Tech Vocabulary Match</h1>
        <p className="text-slate-400 text-sm">Match each tech term with its correct meaning.</p>
      </div>
      <div className="glass-card rounded-2xl p-5">
        <VocabularyMatchGame />
      </div>
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 mt-6 text-sm text-slate-500 hover:text-slate-300 transition-colors duration-200"
      >
        <ArrowLeft size={14} aria-hidden="true" />
        Back home
      </Link>
    </div>
  );
}
