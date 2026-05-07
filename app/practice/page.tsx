import Link from 'next/link';
import dynamic from 'next/dynamic';

const PhaserGameCanvas = dynamic(
  () => import('@/features/speaktech-phaser/src/components/GameCanvas'),
  { ssr: false }
);

export default function PracticePage() {
  return (
    <main className="min-h-screen bg-[#050810] p-4 md:p-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h1 className="text-lg md:text-2xl font-extrabold text-white tracking-tight">
            SpeakTech Galaxy
          </h1>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition-all"
            style={{
              background: 'rgba(0,212,255,0.1)',
              border: '1px solid rgba(0,212,255,0.25)',
              color: '#00d4ff',
            }}
          >
            ← Back to Dashboard
          </Link>
        </div>

        <div
          className="w-full overflow-hidden rounded-2xl"
          style={{
            border: '1px solid rgba(0,212,255,0.2)',
            boxShadow: '0 0 40px rgba(0, 170, 255, 0.2)',
          }}
        >
          <div className="relative mx-auto aspect-[4/3] w-full max-w-[960px] bg-black">
            <PhaserGameCanvas />
          </div>
        </div>
      </div>
    </main>
  );
}
