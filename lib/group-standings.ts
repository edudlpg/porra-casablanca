import type { GroupCode, Team } from "@prisma/client";

import {
  WORLD_CUP_2026_FIFA_RANKINGS,
  WORLD_CUP_2026_TEAM_CONDUCT_SCORES,
} from "@/lib/world-cup-tiebreakers";

export type GroupStandingRow = {
  team: Pick<Team, "id" | "name" | "flagUrl" | "groupCode">;
  played: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
};

export type GroupStanding = {
  groupCode: GroupCode;
  rows: GroupStandingRow[];
};

export type BestThirdPlaceRow = GroupStandingRow & {
  groupCode: GroupCode;
};

type MatchWithTeams = {
  homeTeamId: string;
  awayTeamId: string;
  homeScore: number | null;
  awayScore: number | null;
  homeTeam: Pick<Team, "id" | "name" | "flagUrl" | "groupCode">;
  awayTeam: Pick<Team, "id" | "name" | "flagUrl" | "groupCode">;
};

type StandingTieBreakers = {
  fifaRankingByTeamName?: ReadonlyMap<string, number>;
  teamConductScoreByTeamName?: ReadonlyMap<string, number>;
};

const defaultStandingTieBreakers: Required<StandingTieBreakers> = {
  fifaRankingByTeamName: WORLD_CUP_2026_FIFA_RANKINGS,
  teamConductScoreByTeamName: WORLD_CUP_2026_TEAM_CONDUCT_SCORES,
};

export function compareStandingRows(
  left: Pick<GroupStandingRow, "goalDifference" | "goalsFor" | "points" | "team">,
  right: Pick<GroupStandingRow, "goalDifference" | "goalsFor" | "points" | "team">,
  tieBreakers: StandingTieBreakers = defaultStandingTieBreakers,
) {
  const teamConductScoreByTeamName =
    tieBreakers.teamConductScoreByTeamName ?? defaultStandingTieBreakers.teamConductScoreByTeamName;
  const fifaRankingByTeamName =
    tieBreakers.fifaRankingByTeamName ?? defaultStandingTieBreakers.fifaRankingByTeamName;
  const leftConductScore = teamConductScoreByTeamName.get(left.team.name) ?? Number.NEGATIVE_INFINITY;
  const rightConductScore = teamConductScoreByTeamName.get(right.team.name) ?? Number.NEGATIVE_INFINITY;
  const leftFifaRanking = fifaRankingByTeamName.get(left.team.name) ?? Number.POSITIVE_INFINITY;
  const rightFifaRanking = fifaRankingByTeamName.get(right.team.name) ?? Number.POSITIVE_INFINITY;

  return (
    right.points - left.points ||
    right.goalDifference - left.goalDifference ||
    right.goalsFor - left.goalsFor ||
    rightConductScore - leftConductScore ||
    leftFifaRanking - rightFifaRanking ||
    left.team.name.localeCompare(right.team.name)
  );
}

export function buildGroupStandings(
  teams: Array<Pick<Team, "id" | "name" | "flagUrl" | "groupCode">>,
  matches: MatchWithTeams[],
): GroupStanding[] {
  const groupedTeams = new Map<GroupCode, GroupStandingRow[]>();

  for (const team of teams) {
    if (!team.groupCode) {
      continue;
    }

    const rows = groupedTeams.get(team.groupCode) ?? [];
    rows.push({
      team,
      played: 0,
      wins: 0,
      draws: 0,
      losses: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      goalDifference: 0,
      points: 0,
    });
    groupedTeams.set(team.groupCode, rows);
  }

  const rowByTeamId = new Map(
    Array.from(groupedTeams.values()).flat().map((row) => [row.team.id, row]),
  );

  for (const match of matches) {
    if (match.homeScore === null || match.awayScore === null) {
      continue;
    }

    const homeRow = rowByTeamId.get(match.homeTeamId);
    const awayRow = rowByTeamId.get(match.awayTeamId);

    if (!homeRow || !awayRow) {
      continue;
    }

    homeRow.played += 1;
    awayRow.played += 1;
    homeRow.goalsFor += match.homeScore;
    homeRow.goalsAgainst += match.awayScore;
    awayRow.goalsFor += match.awayScore;
    awayRow.goalsAgainst += match.homeScore;

    if (match.homeScore > match.awayScore) {
      homeRow.wins += 1;
      awayRow.losses += 1;
      homeRow.points += 3;
    } else if (match.homeScore < match.awayScore) {
      awayRow.wins += 1;
      homeRow.losses += 1;
      awayRow.points += 3;
    } else {
      homeRow.draws += 1;
      awayRow.draws += 1;
      homeRow.points += 1;
      awayRow.points += 1;
    }
  }

  return Array.from(groupedTeams.entries())
    .sort(([leftGroup], [rightGroup]) => leftGroup.localeCompare(rightGroup))
    .map(([groupCode, rows]) => ({
      groupCode,
      rows: rows
        .map((row) => ({
          ...row,
          goalDifference: row.goalsFor - row.goalsAgainst,
        }))
        .sort(compareStandingRows),
    }));
}

export function buildBestThirdPlaceRows(standings: GroupStanding[]): BestThirdPlaceRow[] {
  return standings
    .map((group) => {
      const thirdPlace = group.rows[2];

      if (!thirdPlace) {
        return null;
      }

      return {
        ...thirdPlace,
        groupCode: group.groupCode,
      };
    })
    .filter((row): row is BestThirdPlaceRow => Boolean(row))
    .sort(compareStandingRows);
}
