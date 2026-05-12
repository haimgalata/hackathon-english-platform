"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MessageCircle, BookOpen, BarChart3 } from "lucide-react";

const navItems = [
  { href: "/scenarios", label: "Practice", icon: MessageCircle },
  { href: "/game/vocabulary", label: "Vocab", icon: BookOpen },
  { href: "/progress", label: "Progress", icon: BarChart3 },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 inset-x-0 z-50 flex items-center justify-between px-4 py-3 glass-card-strong border-b border-surface-border">
      <Link href="/" className="flex items-center gap-2.5 group">
        <TechyMiniAvatar />
        <span className="font-bold text-lg tracking-tight text-white group-hover:text-brand-secondary transition-colors duration-200">
          SpeakTech
        </span>
      </Link>

      <div className="flex items-center gap-1">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = !!pathname?.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer ${
                active
                  ? "bg-brand-primary/20 text-brand-secondary"
                  : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
              }`}
            >
              <Icon size={16} aria-hidden="true" />
              <span className="hidden sm:inline">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

function TechyMiniAvatar() {
  return (
    <div className="relative w-8 h-8 flex-shrink-0">
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-primary to-brand-secondary flex items-center justify-center shadow-glow-sm">
        <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" aria-hidden="true">
          <circle cx="12" cy="8" r="4" fill="white" fillOpacity="0.9" />
          <rect x="6" y="13" width="12" height="2" rx="1" fill="white" fillOpacity="0.7" />
          <rect x="8" y="16" width="8" height="2" rx="1" fill="white" fillOpacity="0.5" />
          <rect x="10" y="19" width="4" height="2" rx="1" fill="white" fillOpacity="0.35" />
        </svg>
      </div>
    </div>
  );
}
