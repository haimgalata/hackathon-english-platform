import Link from "next/link";
import { MessageCircle, BookOpen, BarChart3, Zap, ArrowRight } from "lucide-react";
import { TechyAvatar } from "@/components/ui/Avatar";

const features = [
  {
    href: "/scenarios",
    icon: MessageCircle,
    label: "Start Conversation",
    description: "Practice real tech scenarios — job interviews, project pitches, debugging chats.",
    accent: "from-brand-primary/20 to-brand-secondary/10",
    border: "border-brand-primary/25",
    iconColor: "text-brand-secondary",
    ctaColor: "text-brand-secondary hover:text-white",
  },
  {
    href: "/game/vocabulary",
    icon: BookOpen,
    label: "Vocabulary Match",
    description: "Match tech words to their meanings. Build your toolkit one term at a time.",
    accent: "from-brand-success/15 to-emerald-400/5",
    border: "border-brand-success/25",
    iconColor: "text-brand-success",
    ctaColor: "text-brand-success hover:text-white",
  },
  {
    href: "/progress",
    icon: BarChart3,
    label: "Your Progress",
    description: "See how far you've come — sessions completed, vocabulary learned, and more.",
    accent: "from-purple-500/15 to-violet-400/5",
    border: "border-purple-500/25",
    iconColor: "text-purple-400",
    ctaColor: "text-purple-400 hover:text-white",
  },
];

export default function HomePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      {/* Hero section */}
      <section className="flex flex-col md:flex-row items-center gap-8 mb-12">
        <div className="flex-shrink-0">
          <TechyAvatar size="xl" />
        </div>
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Zap size={16} className="text-brand-warning" aria-hidden="true" />
            <span className="text-sm font-medium text-brand-warning">AI-Powered English Practice</span>
          </div>
          <h1 className="text-4xl font-extrabold leading-tight mb-3">
            Hey there! I&apos;m{" "}
            <span className="text-gradient">Techy</span>.
          </h1>
          <p className="text-slate-300 text-lg leading-relaxed max-w-lg">
            I&apos;ll help you practice English in real tech situations — from job interviews to
            debugging sessions. Ready to level up?
          </p>
          <Link
            href="/scenarios"
            className="inline-flex items-center gap-2 mt-5 btn-primary text-sm"
          >
            Start practicing
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </section>

      {/* Feature cards */}
      <section>
        <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-4">
          What do you want to do?
        </h2>
        <div className="grid gap-4 md:grid-cols-3">
          {features.map(({ href, icon: Icon, label, description, accent, border, iconColor, ctaColor }) => (
            <Link
              key={href}
              href={href}
              className={`group relative flex flex-col gap-3 p-5 rounded-2xl bg-gradient-to-br ${accent} border ${border} glass-card hover:border-opacity-60 hover:shadow-card transition-all duration-200 cursor-pointer`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-white/5 ${iconColor}`}>
                <Icon size={20} aria-hidden="true" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-white mb-1">{label}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{description}</p>
              </div>
              <span className={`flex items-center gap-1 text-xs font-semibold ${ctaColor} transition-colors duration-200`}>
                Get started
                <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform duration-200" aria-hidden="true" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="mt-12 glass-card rounded-2xl p-6">
        <h2 className="font-bold text-white mb-4">How it works</h2>
        <ol className="space-y-3">
          {[
            { step: "1", text: "Pick a tech scenario — job interview, project pitch, or debugging." },
            { step: "2", text: "Chat with me in English. I'll keep it friendly and real." },
            { step: "3", text: "Get instant feedback on grammar and tech vocabulary." },
            { step: "4", text: "Play the vocab game to lock in new words." },
          ].map(({ step, text }) => (
            <li key={step} className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-brand-primary/20 border border-brand-primary/30 flex items-center justify-center text-xs font-bold text-brand-secondary">
                {step}
              </span>
              <p className="text-sm text-slate-300 leading-relaxed">{text}</p>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
