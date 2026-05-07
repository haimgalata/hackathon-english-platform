import StudentHeader from '@/components/dashboard/StudentHeader';
import NavCircleButton from '@/components/dashboard/NavCircleButton';

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-[#0f1117] flex flex-col items-center p-6 pt-10 relative overflow-hidden">
      {/* Background glow accents */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-64 rounded-full bg-[#00d4ff]/[0.03] blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-[#e040fb]/[0.03] blur-3xl pointer-events-none" />

      <div className="w-full max-w-sm relative z-10">
        {/* App name */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Speak<span className="text-[#00d4ff]">Tech</span>
          </h1>
        </div>

        {/* Student info card */}
        <StudentHeader />

        {/* Navigation */}
        <div className="mt-8 flex flex-col gap-3">
          <p className="text-xs font-semibold text-white/30 tracking-widest uppercase mb-1">
            Choose mode
          </p>
          <NavCircleButton
            href="/tech"
            label="TECH"
            icon="tech"
            color=""
            description="Talk with Techy — learn tech English"
          />
          <NavCircleButton
            href="/practice"
            label="PRACTICE"
            icon="practice"
            color=""
            description="Vocabulary games — coming soon"
          />
        </div>
      </div>
    </main>
  );
}
