import type { Match, Prediction, Role, Round, ScoreType, Team, User } from "@prisma/client";

export type AppRole = Role;
export type AppScoreType = ScoreType;

export type MatchWithRelations = Match & {
  round: Round;
  homeTeam: Team;
  awayTeam: Team;
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
