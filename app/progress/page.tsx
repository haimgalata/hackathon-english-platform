import Link from "next/link";
import { ProgressSummary } from "@/components/progress/ProgressSummary";
import { ArrowLeft } from "lucide-react";

export default function ProgressPage() {
  return (
    <div className="max-w-xl mx-auto px-4 py-10">
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-white mb-1">Your Progress</h1>
        <p className="text-slate-400 text-sm">Here&apos;s how you&apos;re doing across all activities.</p>
      </div>
      <ProgressSummary />
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 mt-8 text-sm text-slate-500 hover:text-slate-300 transition-colors duration-200"
      >
        <ArrowLeft size={14} aria-hidden="true" />
        Back home
      </Link>
    </div>
  );
}
