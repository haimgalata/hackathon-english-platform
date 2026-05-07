'use client'

import dynamic from 'next/dynamic'
import Link from 'next/link'

const GameCanvas = dynamic(() => import('@/components/game/GameCanvas'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center w-full h-full">
      <span className="text-[#00d4ff] font-mono tracking-widest animate-pulse">LOADING...</span>
    </div>
  ),
})

export default function GamePage() {
  return (
    <main className="min-h-screen bg-[#0f1117] flex flex-col items-center justify-center">
      {/* Back button */}
      <div className="w-full max-w-[860px] px-4 py-3 flex items-center">
        <Link
          href="/dashboard"
          className="text-xs font-mono text-white/40 hover:text-[#00d4ff] transition-colors tracking-widest flex items-center gap-2"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          BACK TO DASHBOARD
        </Link>
      </div>

      {/* Game container */}
      <div
        className="w-full max-w-[860px] px-4"
        style={{ aspectRatio: '800/600' }}
      >
        <div className="w-full h-full rounded-xl overflow-hidden"
          style={{
            border: '1px solid rgba(0,212,255,0.15)',
            boxShadow: '0 0 40px rgba(0,212,255,0.08), inset 0 0 40px rgba(0,0,0,0.4)',
          }}
        >
          <GameCanvas />
        </div>
      </div>
    </main>
  )
}
