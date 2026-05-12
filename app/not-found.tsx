import Link from "next/link";
import { TechyAvatar } from "@/components/ui/Avatar";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-5 px-4 text-center">
      <TechyAvatar size="lg" />
      <div>
        <p className="text-brand-secondary text-sm font-semibold mb-1">404</p>
        <h1 className="text-2xl font-extrabold text-white mb-2">Page not found</h1>
        <p className="text-slate-400 text-sm">That page doesn&apos;t exist in SpeakTech.</p>
      </div>
      <Link href="/" className="btn-primary text-sm flex items-center gap-2">
        <ArrowLeft size={14} aria-hidden="true" />
        Back home
      </Link>
    </div>
  );
}
