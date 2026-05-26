import type { GroupCode, Match, Prediction, PrismaClient, ScoreType, Team } from "@prisma/client";

import { buildGroupStandings } from "@/lib/group-standings";
import {
  THIRD_PLACE_OPTION_ASSIGNMENTS,
  THIRD_PLACE_OPTION_BY_GROUP_KEY,
  THIRD_PLACE_SLOT_CODES,
} from "@/lib/third-place-options";
import { worldCup2026Fixtures } from "@/prisma/world-cup-2026";

type TeamSummary = Pick<Team, "id" | "name" | "flagUrl" | "groupCode">;
type MatchSummary = Match & {
  round: {
    name: string;
  };
  homeTeam: TeamSummary;
  awayTeam: TeamSummary;
};

type SyncClient = Pick<PrismaClient, "match" | "team" | "prediction">;

const GROUP_STAGE_ROUND_NAME = "Fase de grupos";
const THIRD_PLACE_SLOT_CODE_BY_LABEL: Record<string, (typeof THIRD_PLACE_SLOT_CODES)[number]> = {
  "3º Grupo A/B/C/D/F": "1E",
  "3º Grupo B/E/F/I/J": "1D",
  "3º Grupo C/D/F/G/H": "1I",
  "3º Grupo C/E/F/H/I": "1A",
  "3º Grupo D/E/I/J/L": "1K",
  "3º Grupo E/F/G/I/J": "1B",
  "3º Grupo E/H/I/J/K": "1L",
  "3º Grupo A/E/H/I/J": "1G",
};

const predictionResetData: Pick<Prediction, "points" | "scoreType"> = {
  points: 0,
  scoreType: "PENDING" satisfies ScoreType,
};

function buildFixtureSignature(roundName: string, startsAt: Date, homeSlotLabel: string, awaySlotLabel: string) {
  return `${roundName}|||${startsAt.toISOString()}|||${homeSlotLabel}|||${awaySlotLabel}`;
}

const WORLD_CUP_MATCH_NUMBER_BY_SIGNATURE = new Map(
  worldCup2026Fixtures.map((fixture, index) => [
    buildFixtureSignature(fixture.roundName, fixture.startsAt, fixture.homeTeam, fixture.awayTeam),
    index + 1,
  ]),
);

function compareStandings(left: StandingLike, right: StandingLike) {
  return (
    right.points - left.points ||
    right.goalDifference - left.goalDifference ||
    right.goalsFor - left.goalsFor ||
    left.team.name.localeCompare(right.team.name)
  );
}

type StandingLike = {
  team: TeamSummary;
  points: number;
  goalDifference: number;
  goalsFor: number;
};

function parseGroupPositionLabel(label: string) {
  const matched = label.match(/^([12])º Grupo ([A-L])$/);

  if (!matched) {
    return null;
  }

  return {
    position: Number(matched[1]) as 1 | 2,
    groupCode: matched[2] as GroupCode,
  };
}

function parseWinnerReference(label: string) {
  const matched = label.match(/^(Ganador|Perdedor) Partido (\d{1,3})$/);

  if (!matched) {
    return null;
  }

  return {
    type: matched[1] as "Ganador" | "Perdedor",
    matchNumber: Number(matched[2]),
  };
}

function getCompletedGroupCodes(groupMatches: MatchSummary[]) {
  const counts = new Map<GroupCode, { total: number; completed: number }>();

  for (const match of groupMatches) {
    if (!match.homeTeam.groupCode || match.homeTeam.groupCode !== match.awayTeam.groupCode) {
      continue;
    }

    const current = counts.get(match.homeTeam.groupCode) ?? { total: 0, completed: 0 };
    current.total += 1;

    if (match.homeScore !== null && match.awayScore !== null) {
      current.completed += 1;
    }

    counts.set(match.homeTeam.groupCode, current);
  }

  return new Set(
    Array.from(counts.entries())
      .filter(([, count]) => count.total > 0 && count.total === count.completed)
      .map(([groupCode]) => groupCode),
  );
}

function getBestThirdPlaceTeams(standings: ReturnType<typeof buildGroupStandings>, completedGroupCodes: Set<GroupCode>) {
  if (completedGroupCodes.size !== 12) {
    return null;
  }

  return standings
    .map((group) => group.rows[2])
    .filter(Boolean)
    .sort(compareStandings)
    .slice(0, 8);
}

function getStoredWinnerTeamId(match: MatchSummary) {
  if (match.round.name === GROUP_STAGE_ROUND_NAME) {
    return null;
  }

  if (match.homeScore === null || match.awayScore === null) {
    return null;
  }

  if (match.homeScore > match.awayScore) {
    return match.homeTeamId;
  }

  if (match.homeScore < match.awayScore) {
    return match.awayTeamId;
  }

  if (match.winnerTeamId === match.homeTeamId || match.winnerTeamId === match.awayTeamId) {
    return match.winnerTeamId;
  }

  return null;
}

function resolveAdvancingTeamId(
  slotLabel: string,
  teamByName: Map<string, TeamSummary>,
  groupRowsByCode: Map<GroupCode, ReturnType<typeof buildGroupStandings>[number]["rows"]>,
  completedGroupCodes: Set<GroupCode>,
  bestThirdPlaceTeams: ReturnType<typeof getBestThirdPlaceTeams>,
  matchByNumber: Map<number, MatchSummary>,
) {
  const directTeam = teamByName.get(slotLabel);
  const groupPosition = parseGroupPositionLabel(slotLabel);
  const winnerReference = parseWinnerReference(slotLabel);

  if (groupPosition) {
    if (!completedGroupCodes.has(groupPosition.groupCode)) {
      return directTeam?.id ?? null;
    }

    return groupRowsByCode.get(groupPosition.groupCode)?.[groupPosition.position - 1]?.team.id ?? directTeam?.id ?? null;
  }

  if (THIRD_PLACE_SLOT_CODE_BY_LABEL[slotLabel]) {
    if (!bestThirdPlaceTeams) {
      return directTeam?.id ?? null;
    }

    const groupKey = bestThirdPlaceTeams
      .map((row) => row.team.groupCode)
      .filter((groupCode): groupCode is GroupCode => Boolean(groupCode))
      .sort()
      .join("");
    const optionNumber = THIRD_PLACE_OPTION_BY_GROUP_KEY.get(groupKey);

    if (!optionNumber) {
      return directTeam?.id ?? null;
    }

    const columnCode = THIRD_PLACE_SLOT_CODE_BY_LABEL[slotLabel];
    const columnIndex = THIRD_PLACE_SLOT_CODES.indexOf(columnCode);
    const groupCode = THIRD_PLACE_OPTION_ASSIGNMENTS[optionNumber - 1]?.[columnIndex];

    if (!groupCode) {
      return directTeam?.id ?? null;
    }

    return groupRowsByCode.get(groupCode)?.[2]?.team.id ?? directTeam?.id ?? null;
  }

  if (winnerReference) {
    const referencedMatch = matchByNumber.get(winnerReference.matchNumber);

    if (!referencedMatch) {
      return directTeam?.id ?? null;
    }

    const winnerTeamId = getStoredWinnerTeamId(referencedMatch);

    if (!winnerTeamId) {
      return directTeam?.id ?? null;
    }

    if (winnerReference.type === "Ganador") {
      return winnerTeamId;
    }

    return winnerTeamId === referencedMatch.homeTeamId
      ? referencedMatch.awayTeamId
      : referencedMatch.homeTeamId;
  }

  return directTeam?.id ?? null;
}

export async function synchronizeTournamentProgression(client: SyncClient) {
  const [teams, matches] = await Promise.all([
    client.team.findMany({
      orderBy: {
        name: "asc",
      },
    }),
    client.match.findMany({
      include: {
        round: true,
        homeTeam: true,
        awayTeam: true,
      },
      orderBy: {
        startsAt: "asc",
      },
    }),
  ]);

  const mutableMatches: MatchSummary[] = matches.map((match) => ({
    ...match,
    round: {
      name: match.round.name,
    },
  }));

  const teamById = new Map(teams.map((team) => [team.id, team]));
  const teamByName = new Map(teams.map((team) => [team.name, team]));
  const groupMatches = mutableMatches.filter((match) => match.round.name === GROUP_STAGE_ROUND_NAME);
  const completedGroupCodes = getCompletedGroupCodes(groupMatches);
  const standings = buildGroupStandings(teams, groupMatches);
  const groupRowsByCode = new Map<GroupCode, ReturnType<typeof buildGroupStandings>[number]["rows"]>(
    standings.map((group) => [group.groupCode, group.rows]),
  );
  const bestThirdPlaceTeams = getBestThirdPlaceTeams(standings, completedGroupCodes);
  const matchByNumber = new Map<number, MatchSummary>();

  for (const match of mutableMatches) {
    const homeSlotLabel = match.homeSlotLabel ?? match.homeTeam.name;
    const awaySlotLabel = match.awaySlotLabel ?? match.awayTeam.name;
    const matchNumber = WORLD_CUP_MATCH_NUMBER_BY_SIGNATURE.get(
      buildFixtureSignature(match.round.name, match.startsAt, homeSlotLabel, awaySlotLabel),
    );

    if (matchNumber) {
      matchByNumber.set(matchNumber, match);
    }

  }

  const updates: Array<ReturnType<SyncClient["match"]["update"]>> = [];
  const predictionResets: Array<ReturnType<SyncClient["prediction"]["updateMany"]>> = [];

  for (const match of mutableMatches) {
    if (!match.homeSlotLabel || !match.awaySlotLabel) {
      continue;
    }

    const nextHomeTeamId = resolveAdvancingTeamId(
      match.homeSlotLabel,
      teamByName,
      groupRowsByCode,
      completedGroupCodes,
      bestThirdPlaceTeams,
      matchByNumber,
    );
    const nextAwayTeamId = resolveAdvancingTeamId(
      match.awaySlotLabel,
      teamByName,
      groupRowsByCode,
      completedGroupCodes,
      bestThirdPlaceTeams,
      matchByNumber,
    );

    if (!nextHomeTeamId || !nextAwayTeamId) {
      continue;
    }

    const previousWinnerTeamId = match.winnerTeamId;
    const previousHomeScore = match.homeScore;
    const previousAwayScore = match.awayScore;
    const participantsChanged = nextHomeTeamId !== match.homeTeamId || nextAwayTeamId !== match.awayTeamId;

    if (participantsChanged && (match.homeScore !== null || match.awayScore !== null)) {
      match.homeScore = null;
      match.awayScore = null;
      predictionResets.push(
        client.prediction.updateMany({
          where: {
            matchId: match.id,
          },
          data: predictionResetData,
        }),
      );
    }

    match.homeTeamId = nextHomeTeamId;
    match.awayTeamId = nextAwayTeamId;
    match.homeTeam = teamById.get(nextHomeTeamId) ?? match.homeTeam;
    match.awayTeam = teamById.get(nextAwayTeamId) ?? match.awayTeam;
    const nextWinnerTeamId = getStoredWinnerTeamId(match);
    match.winnerTeamId = nextWinnerTeamId;

    if (
      participantsChanged ||
      previousWinnerTeamId !== nextWinnerTeamId ||
      previousHomeScore !== match.homeScore ||
      previousAwayScore !== match.awayScore
    ) {
      updates.push(
        client.match.update({
          where: {
            id: match.id,
          },
          data: {
            homeTeamId: nextHomeTeamId,
            awayTeamId: nextAwayTeamId,
            homeScore: match.homeScore,
            awayScore: match.awayScore,
            winnerTeamId: nextWinnerTeamId,
          },
        }),
      );
    }
  }

  if (updates.length) {
    await Promise.all(updates);
  }

  if (predictionResets.length) {
    await Promise.all(predictionResets);
  }
}
