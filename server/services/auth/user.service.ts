import { prisma } from "@/server/lib/prisma";

export async function requireAppUser() {
  // Temporary dev fallback to unblock local MVP execution without Clerk middleware issues.
  const userId = "dev-user";
  const email = "dev-user@speaktech.local";
  const name = "Dev Student";

  const user = await prisma.user.upsert({
    where: { clerkId: userId },
    update: { email, name },
    create: {
      clerkId: userId,
      email,
      name,
      progressSnapshot: { create: {} },
    },
  });

  return user;
}
