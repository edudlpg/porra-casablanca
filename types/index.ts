import type { Match, Prediction, Role, Round, ScoreType, Team, User } from "@prisma/client";

export type AppRole = Role;
export type AppScoreType = ScoreType;

export type MatchTeam = Pick<Team, "id" | "name" | "flagUrl" | "groupCode">;
export type MatchRound = Pick<Round, "id" | "name" | "unlockAt" | "startDate" | "endDate" | "createdAt">;

export type MatchWithRelations = Match & {
  round: MatchRound;
  homeTeam: MatchTeam;
  awayTeam: MatchTeam;
  predictions?: Prediction[];
};

export type RankingEntry = {
  position: number;
  user: Pick<User, "id" | "name" | "username" | "email" | "teamName" | "avatarUrl">;
  totalPoints: number;
  exactHits: number;
  goalDifferenceHits: number;
  finalResultHits: number;
  prizeAmount: number;
};
