import Link from "next/link";
import { prisma } from "@/server/lib/prisma";
import { TechyAvatar } from "@/components/ui/Avatar";
import { ArrowRight, Briefcase, Monitor, Bug } from "lucide-react";

const scenarioIcons: Record<string, React.ElementType> = {
  "job-interview": Briefcase,
  "project-presentation": Monitor,
  "debugging-conversation": Bug,
};

const scenarioColors: Record<string, { bg: string; border: string; icon: string; glow: string }> = {
  "job-interview": {
    bg: "from-brand-primary/15 to-brand-secondary/5",
    border: "border-brand-primary/25 hover:border-brand-primary/50",
    icon: "text-brand-secondary bg-brand-primary/20",
    glow: "hover:shadow-glow",
  },
  "project-presentation": {
    bg: "from-brand-success/12 to-emerald-400/5",
    border: "border-brand-success/25 hover:border-brand-success/50",
    icon: "text-brand-success bg-brand-success/15",
    glow: "hover:shadow-glow-success",
  },
  "debugging-conversation": {
    bg: "from-brand-warning/12 to-amber-400/5",
    border: "border-brand-warning/25 hover:border-brand-warning/50",
    icon: "text-brand-warning bg-brand-warning/15",
    glow: "hover:shadow-glow-warning",
  },
};

export default async function ScenariosPage() {
  const scenarios = await prisma.scenario.findMany({ orderBy: { title: "asc" } });

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      {/* Header with Techy */}
      <div className="flex items-start gap-4 mb-8">
        <TechyAvatar size="md" />
        <div>
          <h1 className="text-2xl font-extrabold text-white mb-1">Pick a scenario</h1>
          <p className="text-slate-400 text-sm leading-relaxed">
            I&apos;ll guide you through the conversation. Choose what you want to practice today.
          </p>
        </div>
      </div>

      {/* Scenario cards */}
      <div className="space-y-3">
        {scenarios.map((scenario) => {
          const Icon = scenarioIcons[scenario.slug] ?? Monitor;
          const colors = scenarioColors[scenario.slug] ?? scenarioColors["job-interview"];

          return (
            <form key={scenario.id} action={`/conversation/new?scenarioId=${scenario.id}`} method="get">
              <button
                type="submit"
                className={`group w-full text-left flex items-center gap-4 p-5 rounded-2xl
                  bg-gradient-to-br ${colors.bg} border ${colors.border} glass-card ${colors.glow}
                  transition-all duration-200 cursor-pointer`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${colors.icon}`}>
                  <Icon size={22} aria-hidden="true" />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="font-bold text-white mb-0.5">{scenario.title}</h2>
                  <p className="text-sm text-slate-400 leading-relaxed">{scenario.description}</p>
                  <p className="text-xs text-slate-500 mt-1.5">~5 min conversation</p>
                </div>
                <ArrowRight
                  size={18}
                  className="flex-shrink-0 text-slate-500 group-hover:text-slate-300 group-hover:translate-x-0.5 transition-all duration-200"
                  aria-hidden="true"
                />
              </button>
            </form>
          );
        })}
      </div>

      <Link href="/" className="inline-flex items-center gap-1.5 mt-8 text-sm text-slate-500 hover:text-slate-300 transition-colors duration-200">
        Back home
      </Link>
    </div>
  );
}
