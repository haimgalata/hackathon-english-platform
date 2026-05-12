import { redirect } from "next/navigation";
import { requireAppUser } from "@/server/services/auth/user.service";
import { prisma } from "@/server/lib/prisma";

export default async function NewConversationPage({
  searchParams,
}: {
  searchParams: Promise<{ scenarioId?: string }>;
}) {
  const params = await searchParams;
  const scenarioId = params.scenarioId;
  if (!scenarioId) redirect("/scenarios");

  const user = await requireAppUser();
  const session = await prisma.session.create({
    data: { userId: user.id, scenarioId },
  });

  redirect(`/conversation/${session.id}`);
}
