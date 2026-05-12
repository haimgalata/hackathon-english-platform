import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.scenario.createMany({
    data: [
      {
        slug: "job-interview",
        title: "Job Interview",
        description: "Introduce yourself and discuss your coding strengths.",
        starter: "Hi! I am Techy. Tell me your name and your favorite programming language.",
      },
      {
        slug: "project-presentation",
        title: "Present Your Project",
        description: "Explain your project idea and what problem it solves.",
        starter: "Awesome! Tell me about a project you built and why it matters.",
      },
      {
        slug: "debugging-conversation",
        title: "Debugging Conversation",
        description: "Talk through a bug and how you would fix it.",
        starter: "Let's debug together. Describe a bug and your first step to solve it.",
      },
    ],
    skipDuplicates: true,
  });

  await prisma.vocabularyTerm.createMany({
    data: [
      { term: "Bug", meaning: "An error in software", difficulty: 1 },
      { term: "API", meaning: "A way apps talk to each other", difficulty: 1 },
      { term: "Deploy", meaning: "Release code to users", difficulty: 1 },
      { term: "Frontend", meaning: "The part users see and click", difficulty: 1 },
      { term: "Backend", meaning: "The server-side logic of an app", difficulty: 1 },
      { term: "Database", meaning: "Where app data is stored", difficulty: 1 },
    ],
    skipDuplicates: true,
  });
}

main()
  .then(async () => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
