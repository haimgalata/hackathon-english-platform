import Link from 'next/link';

export default function PracticePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-[#0f1117] p-6 text-center relative overflow-hidden">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-[#e040fb]/[0.04] blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-xs w-full">
        <div className="w-16 h-16 mx-auto mb-6 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(224,64,251,0.1)', border: '1px solid rgba(224,64,251,0.2)' }}>
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <rect x="4" y="10" width="24" height="16" rx="4" stroke="#e040fb" strokeWidth="1.5" opacity="0.8" />
            <circle cx="11" cy="18" r="3" stroke="#e040fb" strokeWidth="1.3" opacity="0.7" />
            <line x1="18" y1="15" x2="25" y2="15" stroke="#e040fb" strokeWidth="1.3" strokeLinecap="round" opacity="0.5" />
            <line x1="18" y1="19" x2="22" y2="19" stroke="#e040fb" strokeWidth="1.3" strokeLinecap="round" opacity="0.5" />
            <line x1="13" y1="7" x2="19" y2="7" stroke="#e040fb" strokeWidth="1.8" strokeLinecap="round" opacity="0.4" />
          </svg>
        </div>

        <h1 className="text-2xl font-extrabold text-white mb-3 tracking-tight">Vocabulary Game</h1>

        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-5" style={{ background: 'rgba(224,64,251,0.1)', border: '1px solid rgba(224,64,251,0.2)', color: '#e040fb' }}>
          <span className="w-1.5 h-1.5 rounded-full bg-[#e040fb] animate-pulse inline-block" />
          Coming Soon
        </div>

        <p className="text-white/40 text-sm leading-relaxed mb-8">
          The vocabulary game is being built by another team. Check back soon for an awesome word challenge!
        </p>

        <div className="rounded-2xl p-5 mb-6 text-left" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <p className="text-xs font-semibold text-white/50 mb-3 tracking-widest uppercase">While you wait</p>
          <ul className="text-sm text-white/40 space-y-2.5">
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00d4ff] flex-shrink-0" />
              Practice speaking with Techy
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00d4ff] flex-shrink-0" />
              Try the Tech Job Interview scenario
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00d4ff] flex-shrink-0" />
              Earn points and level up
            </li>
          </ul>
        </div>

        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm tracking-wide transition-all"
          style={{ background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.25)', color: '#00d4ff' }}
        >
          ← Back to Dashboard
        </Link>
      </div>
    </main>
  );
}
