import UsernameForm from '@/components/auth/UsernameForm';

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50 p-4">
      <div className="w-full max-w-md">
        {/* Logo / hero */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg mb-4">
            <span className="text-4xl">🤖</span>
          </div>
          <h1 className="text-4xl font-extrabold text-slate-800 tracking-tight">
            Speak<span className="text-indigo-600">Tech</span>
          </h1>
          <p className="mt-2 text-slate-500 text-base">
            Learn English and tech vocabulary with your AI friend Techy.
          </p>
        </div>

        {/* Form card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-lg font-semibold text-slate-700 mb-5 text-center">
            Enter your username to start
          </h2>
          <UsernameForm />
        </div>

        <p className="mt-6 text-center text-xs text-slate-400">
          Are you a teacher?{' '}
          <a href="/teacher?pin=1234" className="text-indigo-500 underline">
            Teacher Dashboard
          </a>
        </p>
      </div>
    </main>
  );
}
