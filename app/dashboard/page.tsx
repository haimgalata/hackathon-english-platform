import StudentHeader from '@/components/dashboard/StudentHeader';
import NavCircleButton from '@/components/dashboard/NavCircleButton';

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50 flex flex-col items-center p-6 pt-10">
      {/* App name */}
      <div className="mb-6 text-center">
        <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">
          Speak<span className="text-indigo-600">Tech</span>
        </h1>
        <p className="text-slate-400 text-sm mt-0.5">Your AI English + Tech coach</p>
      </div>

      {/* Student info card */}
      <StudentHeader />

      {/* Navigation */}
      <div className="mt-10 flex flex-col items-center gap-2">
        <p className="text-slate-500 text-sm font-medium mb-2">What would you like to do?</p>
        <div className="flex items-start gap-10 flex-wrap justify-center">
          <NavCircleButton
            href="/tech"
            label="TECH"
            icon="🤖"
            color="from-indigo-500 to-purple-600"
            description="Talk with Techy and learn tech English"
          />
          <NavCircleButton
            href="/practice"
            label="PRACTICE"
            icon="🎮"
            color="from-emerald-400 to-teal-500"
            description="Vocabulary games coming soon"
          />
        </div>
      </div>

      {/* Recent activity placeholder */}
      <div className="mt-10 w-full max-w-sm">
        <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-3">Quick tip</p>
        <div className="bg-white rounded-2xl shadow-sm p-4 flex items-start gap-3">
          <span className="text-2xl mt-0.5">💡</span>
          <p className="text-sm text-slate-600 leading-relaxed">
            Tap <strong className="text-indigo-600">TECH</strong> to start a conversation with Techy.
            Speak English, learn tech words, and earn points!
          </p>
        </div>
      </div>
    </main>
  );
}
