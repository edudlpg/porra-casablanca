import type { PrismaClient } from "@prisma/client";

import { getWorldCup2026FixtureVenue, worldCup2026Fixtures } from "@/prisma/world-cup-2026";

type ScheduleSyncClient = Pick<PrismaClient, "match">;

function buildFixtureKey(roundName: string, homeSlotLabel: string, awaySlotLabel: string) {
  return `${roundName}|||${homeSlotLabel}|||${awaySlotLabel}`;
}

const WORLD_CUP_FIXTURES_BY_KEY = new Map(
  worldCup2026Fixtures.map((fixture) => [
    buildFixtureKey(fixture.roundName, fixture.homeTeam, fixture.awayTeam),
    fixture,
  ]),
);

export async function synchronizeWorldCupFixtureSchedule(client: ScheduleSyncClient) {
  const matches = await client.match.findMany({
    select: {
      id: true,
      homeSlotLabel: true,
      awaySlotLabel: true,
      startsAt: true,
      venueName: true,
      venueCity: true,
      round: {
        select: {
          name: true,
        },
      },
    },
  });

  for (const match of matches) {
    if (!match.homeSlotLabel || !match.awaySlotLabel) {
      continue;
    }

    const fixture = WORLD_CUP_FIXTURES_BY_KEY.get(
      buildFixtureKey(match.round.name, match.homeSlotLabel, match.awaySlotLabel),
    );

    if (!fixture) {
      continue;
    }

    const venue = getWorldCup2026FixtureVenue(fixture.homeTeam, fixture.awayTeam);

    if (
      match.startsAt.getTime() === fixture.startsAt.getTime() &&
      match.venueName === venue.venueName &&
      match.venueCity === venue.venueCity
    ) {
      continue;
    }

    await client.match.update({
      where: {
        id: match.id,
      },
      data: {
        startsAt: fixture.startsAt,
        venueName: venue.venueName,
        venueCity: venue.venueCity,
      },
    });
  }
}
