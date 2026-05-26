import { describe, expect, it } from "vitest";

import { synchronizeTournamentProgression } from "@/lib/tournament-progression";
import { worldCup2026Fixtures } from "@/prisma/world-cup-2026";

function team(id: string, name: string) {
  return {
    id,
    name,
    flagUrl: null,
    groupCode: null,
  };
}

function match({
  id,
  roundName,
  homeTeam,
  awayTeam,
  startsAt,
  homeSlotLabel,
  awaySlotLabel,
  homeScore = null,
  awayScore = null,
  winnerTeamId = null,
}: {
  id: string;
  roundName: string;
  homeTeam: ReturnType<typeof team>;
  awayTeam: ReturnType<typeof team>;
  startsAt: Date;
  homeSlotLabel?: string;
  awaySlotLabel?: string;
  homeScore?: number | null;
  awayScore?: number | null;
  winnerTeamId?: string | null;
}) {
  return {
    id,
    roundId: `${roundName}-id`,
    homeTeamId: homeTeam.id,
    awayTeamId: awayTeam.id,
    winnerTeamId,
    homeSlotLabel: homeSlotLabel ?? homeTeam.name,
    awaySlotLabel: awaySlotLabel ?? awayTeam.name,
    venueName: null,
    venueCity: null,
    startsAt,
    homeScore,
    awayScore,
    broadcast: "DAZN",
    isLocked: false,
    createdAt: new Date("2026-01-01T00:00:00.000Z"),
    round: {
      id: `${roundName}-id`,
      name: roundName,
      unlockAt: new Date("2026-01-01T00:00:00.000Z"),
      startDate: new Date("2026-01-01T00:00:00.000Z"),
      endDate: new Date("2026-01-02T00:00:00.000Z"),
      createdAt: new Date("2026-01-01T00:00:00.000Z"),
    },
    homeTeam,
    awayTeam,
  };
}

describe("synchronizeTournamentProgression", () => {
  it("sincroniza referencias de ganador usando la numeración oficial del Mundial", async () => {
    const spain = team("spain", "España");
    const france = team("france", "Francia");
    const argentina = team("argentina", "Argentina");
    const placeholder = team("winner-74", "Ganador Partido 74");
    const fixture74 = worldCup2026Fixtures[73];
    const octavosTarget = worldCup2026Fixtures[88];
    const matches = [
      match({
        id: "match-74",
        roundName: fixture74.roundName,
        homeTeam: spain,
        awayTeam: france,
        homeSlotLabel: fixture74.homeTeam,
        awaySlotLabel: fixture74.awayTeam,
        startsAt: fixture74.startsAt,
        homeScore: 2,
        awayScore: 0,
      }),
      match({
        id: "match-89",
        roundName: octavosTarget.roundName,
        homeTeam: placeholder,
        awayTeam: argentina,
        homeSlotLabel: "Ganador Partido 74",
        awaySlotLabel: "Argentina",
        startsAt: octavosTarget.startsAt,
      }),
    ];
    const updates: unknown[] = [];
    const client = {
      team: {
        findMany: async () => [spain, france, argentina, placeholder],
      },
      match: {
        findMany: async () => matches,
        update: (args: unknown) => {
          updates.push(args);
          return Promise.resolve(args);
        },
      },
      prediction: {
        updateMany: async () => ({ count: 0 }),
      },
    };

    await synchronizeTournamentProgression(
      client as unknown as Parameters<typeof synchronizeTournamentProgression>[0],
    );

    expect(updates).toEqual([
      {
        where: {
          id: "match-89",
        },
        data: {
          homeTeamId: "spain",
          awayTeamId: "argentina",
          homeScore: null,
          awayScore: null,
          winnerTeamId: null,
        },
      },
    ]);
  });
});
