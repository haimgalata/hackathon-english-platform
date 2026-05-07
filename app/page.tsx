import UsernameForm from '@/components/auth/UsernameForm';

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-[#0f1117] p-4 relative overflow-hidden">
      {/* Background glow accents */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-[#00d4ff]/[0.04] blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-[#e040fb]/[0.04] blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Logo / hero */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 mb-6">
            <svg viewBox="0 0 80 80" width="80" height="80" fill="none">
              <polygon
                points="40,4 73,22 73,58 40,76 7,58 7,22"
                stroke="#00d4ff"
                strokeWidth="1.5"
                opacity="0.7"
              />
              <polygon
                points="40,12 65,26 65,54 40,68 15,54 15,26"
                stroke="#00d4ff"
                strokeWidth="0.75"
                opacity="0.3"
              />
              <line x1="40" y1="22" x2="40" y2="58" stroke="#00d4ff" strokeWidth="1.2" opacity="0.4" />
              <line x1="22" y1="40" x2="58" y2="40" stroke="#00d4ff" strokeWidth="1.2" opacity="0.4" />
              <circle cx="40" cy="40" r="9" fill="#00d4ff" opacity="0.12" />
              <circle cx="40" cy="40" r="4" fill="#00d4ff" opacity="0.7" />
              <circle cx="40" cy="22" r="2.5" fill="#00d4ff" opacity="0.5" />
              <circle cx="40" cy="58" r="2.5" fill="#00d4ff" opacity="0.5" />
              <circle cx="22" cy="40" r="2.5" fill="#00d4ff" opacity="0.5" />
              <circle cx="58" cy="40" r="2.5" fill="#00d4ff" opacity="0.5" />
            </svg>
          </div>
          <h1 className="text-5xl font-extrabold text-white tracking-tight">
            Speak<span className="text-[#00d4ff]">Tech</span>
          </h1>
          <p className="mt-3 text-white/40 text-sm tracking-wide">
            AI-powered English learning platform
          </p>
        </div>

        {/* Form card */}
        <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-8 backdrop-blur-sm">
          <p className="text-xs font-semibold text-white/40 mb-6 text-center tracking-widest uppercase">
            Enter your details to begin
          </p>
          <UsernameForm />
        </div>

        <p className="mt-6 text-center text-xs text-white/25">
          Teacher?{' '}
          <a href="/teacher?pin=1234" className="text-[#00d4ff]/60 hover:text-[#00d4ff] transition-colors">
            Access Dashboard
          </a>
        </p>
      </div>
    </main>
  );
}
