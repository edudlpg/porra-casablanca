import { prisma } from "@/lib/prisma";
import { synchronizeTournamentProgression } from "@/lib/tournament-progression";
import { getWorldCup2026FixtureVenue, worldCup2026Fixtures } from "@/prisma/world-cup-2026";

function buildFixtureKey(roundName: string, startsAt: Date, venueName: string | null, venueCity: string | null) {
  return `${roundName}|||${startsAt.toISOString()}|||${venueName ?? ""}|||${venueCity ?? ""}`;
}

async function main() {
  const matches = await prisma.match.findMany({
    include: {
      round: true,
    },
  });

  const fixtureByKey = new Map(
    worldCup2026Fixtures.map((fixture) => {
      const venue = getWorldCup2026FixtureVenue(fixture.homeTeam, fixture.awayTeam);

      return [
        buildFixtureKey(fixture.roundName, fixture.startsAt, venue.venueName, venue.venueCity),
        fixture,
      ];
    }),
  );

  let updatedMatches = 0;

  for (const match of matches) {
    const fixture = fixtureByKey.get(buildFixtureKey(match.round.name, match.startsAt, match.venueName, match.venueCity));

    if (!fixture) {
      continue;
    }

    const winnerTeamId =
      match.homeScore === null || match.awayScore === null
        ? null
        : match.homeScore > match.awayScore
          ? match.homeTeamId
          : match.homeScore < match.awayScore
            ? match.awayTeamId
            : null;

    await prisma.match.update({
      where: {
        id: match.id,
      },
      data: {
        homeSlotLabel: fixture.homeTeam,
        awaySlotLabel: fixture.awayTeam,
        winnerTeamId,
      },
    });

    updatedMatches += 1;
  }

  await synchronizeTournamentProgression(prisma);

  console.log(`Updated slot labels for ${updatedMatches} matches.`);
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
