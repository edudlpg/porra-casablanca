import { prisma } from "@/lib/prisma";
import { worldCup2026Teams } from "@/prisma/world-cup-2026";

async function main() {
  for (const team of worldCup2026Teams) {
    await prisma.team.updateMany({
      where: {
        name: team.name,
      },
      data: {
        groupCode: team.groupCode,
      },
    });
  }

  console.log(`Updated group codes for ${worldCup2026Teams.length} teams.`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
