import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/server/lib/prisma";
import { requireAppUser } from "@/server/services/auth/user.service";
import { ConversationRoom } from "@/components/conversation/ConversationRoom";
import { TechyAvatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { CheckCircle, ArrowLeft } from "lucide-react";

export default async function ConversationPage({
  params,
}: {
  params: Promise<{ sessionId: string }>;
}) {
  const user = await requireAppUser();
  const { sessionId } = await params;

  const session = await prisma.session.findFirst({
    where: { id: sessionId, userId: user.id },
    include: { scenario: true },
  });
  if (!session) redirect("/scenarios");

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {/* Scenario context header */}
      <div className="glass-card rounded-2xl p-4 mb-5 flex items-center gap-4">
        <TechyAvatar size="md" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <Badge variant="primary">Scenario</Badge>
          </div>
          <h1 className="font-bold text-white text-base truncate">{session.scenario.title}</h1>
          <p className="text-xs text-slate-400 leading-relaxed">{session.scenario.description}</p>
        </div>
        <form action={`/api/sessions/${session.id}/end`} method="post">
          <button
            type="submit"
            className="flex items-center gap-1.5 btn-success text-xs px-3 py-2 flex-shrink-0"
          >
            <CheckCircle size={13} aria-hidden="true" />
            Finish
          </button>
        </form>
      </div>

      {/* Conversation room */}
      <ConversationRoom sessionId={session.id} starterText={session.scenario.starter} />

      {/* Bottom nav */}
      <div className="mt-5">
        <Link
          href="/scenarios"
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-300 transition-colors duration-200"
        >
          <ArrowLeft size={14} aria-hidden="true" />
          Change scenario
        </Link>
      </div>
    </div>
  );
}
