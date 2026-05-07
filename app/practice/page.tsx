import Link from 'next/link';

export default function PracticePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-emerald-50 via-teal-50 to-green-50 p-6 text-center">
      <div className="text-7xl mb-6">🎮</div>
      <h1 className="text-3xl font-extrabold text-slate-800 mb-2">Vocabulary Game</h1>
      <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-1.5 rounded-full text-sm font-semibold mb-4">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse inline-block" />
        Coming Soon
      </div>
      <p className="text-slate-500 max-w-xs text-base leading-relaxed mb-8">
        The vocabulary game is being built by another team. Check back soon for an awesome word challenge!
      </p>

      <div className="bg-white rounded-2xl shadow-md p-6 max-w-xs w-full mb-6">
        <p className="text-sm font-semibold text-slate-600 mb-3">While you wait…</p>
        <ul className="text-sm text-slate-500 space-y-2 text-left">
          <li>🤖 Practice speaking with Techy</li>
          <li>💬 Try the Tech Job Interview</li>
          <li>⭐ Earn points and level up</li>
        </ul>
      </div>

      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold shadow-md hover:shadow-lg transition-shadow"
      >
        ← Back to Dashboard
      </Link>
    </main>
  );
}
