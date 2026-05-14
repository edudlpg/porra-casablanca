import { prisma } from "@/lib/prisma";
import { getWorldCup2026FixtureVenue } from "@/prisma/world-cup-2026";

async function main() {
  const matches = await prisma.match.findMany({
    include: {
      homeTeam: true,
      awayTeam: true,
    },
  });

  for (const match of matches) {
    const venue = getWorldCup2026FixtureVenue(match.homeTeam.name, match.awayTeam.name);

    await prisma.match.update({
      where: { id: match.id },
      data: venue,
    });
  }
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
