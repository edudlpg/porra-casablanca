import { unstable_cache } from "next/cache";

import { prisma } from "@/lib/prisma";

export const CACHE_TAGS = {
  appConfig: "app-config",
  matches: "matches",
  rounds: "rounds",
  teams: "teams",
} as const;

export const getCachedAppConfig = unstable_cache(
  () =>
    prisma.appConfig.findUnique({
      where: { id: "singleton" },
    }),
  ["app-config"],
  { revalidate: 3600, tags: [CACHE_TAGS.appConfig] },
);

export const getCachedWorldCupTeams = unstable_cache(
  () =>
    prisma.team.findMany({
      where: {
        groupCode: {
          not: null,
        },
      },
      select: {
        id: true,
        name: true,
        flagUrl: true,
        groupCode: true,
      },
      orderBy: [
        { groupCode: "asc" },
        { name: "asc" },
      ],
    }),
  ["world-cup-teams"],
  { revalidate: 3600, tags: [CACHE_TAGS.teams] },
);

export const getCachedGroupStageMatches = unstable_cache(
  () =>
    prisma.match.findMany({
      where: {
        round: {
          name: "Fase de grupos",
        },
      },
      select: {
        id: true,
        homeTeamId: true,
        awayTeamId: true,
        startsAt: true,
        homeScore: true,
        awayScore: true,
        homeTeam: {
          select: {
            id: true,
            name: true,
            flagUrl: true,
            groupCode: true,
          },
        },
        awayTeam: {
          select: {
            id: true,
            name: true,
            flagUrl: true,
            groupCode: true,
          },
        },
      },
      orderBy: {
        startsAt: "asc",
      },
    }),
  ["group-stage-matches"],
  { revalidate: 300, tags: [CACHE_TAGS.matches, CACHE_TAGS.teams] },
);

export const getCachedRoundsWithMatchStatus = unstable_cache(
  () =>
    prisma.round.findMany({
      select: {
        id: true,
        name: true,
        unlockAt: true,
        startDate: true,
        endDate: true,
        matches: {
          select: {
            id: true,
            startsAt: true,
            isLocked: true,
          },
          orderBy: {
            startsAt: "asc",
          },
        },
      },
      orderBy: {
        startDate: "asc",
      },
    }),
  ["rounds-with-match-status"],
  { revalidate: 300, tags: [CACHE_TAGS.rounds, CACHE_TAGS.matches] },
);
