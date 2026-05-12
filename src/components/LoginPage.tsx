import { type FormEvent, useState } from 'react'

type LoginPageProps = {
  onContinue: (username: string) => void
}

export function LoginPage({ onContinue }: LoginPageProps) {
  const [username, setUsername] = useState('')

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const t = username.trim()
    if (!t) return
    onContinue(t)
  }

  return (
    <div className="relative flex min-h-full flex-col items-center justify-center overflow-hidden px-4 py-12">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-500/20 via-transparent to-transparent" />
      <div className="pointer-events-none absolute -left-32 top-1/3 h-72 w-72 rounded-full bg-violet-600/25 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-sky-500/20 blur-3xl" />

      <div className="relative z-10 w-full max-w-md">
        <div className="rounded-3xl border border-white/10 bg-[var(--surface-glass)] p-8 shadow-2xl shadow-black/50 backdrop-blur-xl">
          <div className="text-center">
            <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-400 to-violet-500 text-lg font-bold text-zinc-950 shadow-lg shadow-sky-500/30">
              TL
            </div>
            <h1 className="bg-gradient-to-r from-white via-zinc-100 to-zinc-400 bg-clip-text text-3xl font-semibold tracking-tight text-transparent">
              TechLingo AI
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-zinc-400">
              Practice English and professional tech jargon with AI
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label htmlFor="username" className="sr-only">
                Username
              </label>
              <input
                id="username"
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                className="w-full rounded-xl border border-white/10 bg-zinc-900/60 px-4 py-3.5 text-sm text-white placeholder:text-zinc-500 shadow-inner transition focus:border-sky-500/50 focus:outline-none focus:ring-2 focus:ring-sky-500/30"
              />
            </div>
            <button
              type="submit"
              disabled={!username.trim()}
              className="w-full rounded-xl bg-gradient-to-r from-sky-400 to-violet-500 py-3.5 text-sm font-semibold text-zinc-950 shadow-lg shadow-sky-500/25 transition hover:brightness-110 active:scale-[0.99] disabled:pointer-events-none disabled:opacity-40"
            >
              Continue
            </button>
          </form>
        </div>
        <p className="mt-6 text-center text-xs text-zinc-600">No account required — this is a demo experience.</p>
      </div>
    </div>
  )
}
