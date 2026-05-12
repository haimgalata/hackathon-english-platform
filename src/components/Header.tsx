type HeaderProps = {
  onMenuClick?: () => void
  showMenu?: boolean
}

export function Header({ onMenuClick, showMenu = true }: HeaderProps) {
  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-white/5 bg-zinc-950/80 px-4 backdrop-blur-md md:px-5">
      <div className="flex items-center gap-3">
        {showMenu ? (
          <button
            type="button"
            onClick={onMenuClick}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-zinc-300 transition hover:bg-white/5 hover:text-white md:hidden"
            aria-label="Open menu"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" />
            </svg>
          </button>
        ) : null}
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-sky-400 to-violet-500 text-xs font-bold text-zinc-950 shadow-lg shadow-sky-500/20">
            TL
          </span>
          <span className="text-sm font-semibold tracking-tight text-white">TechLingo AI</span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className="hidden rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs font-medium text-zinc-400 sm:inline">
          Pro
        </span>
      </div>
    </header>
  )
}
