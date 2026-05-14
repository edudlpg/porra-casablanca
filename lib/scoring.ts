import { ScoreType } from "@prisma/client";

import { getMatchSign } from "@/lib/utils";

type ScoreResult = {
  points: number;
  scoreType: Exclude<ScoreType, "PENDING">;
};

const POINTS_BY_SCORE_TYPE: Record<Exclude<ScoreType, "PENDING">, number> = {
  EXACT: 5,
  GOAL_DIFFERENCE: 3,
  FINAL_RESULT: 1,
  FAILED: 0,
};

export function calculatePredictionScore(
  predictedHomeScore: number,
  predictedAwayScore: number,
  actualHomeScore: number,
  actualAwayScore: number,
): ScoreResult {
  if (
    predictedHomeScore === actualHomeScore &&
    predictedAwayScore === actualAwayScore
  ) {
    return {
      points: POINTS_BY_SCORE_TYPE.EXACT,
      scoreType: "EXACT",
    };
  }

  const predictedDifference = predictedHomeScore - predictedAwayScore;
  const actualDifference = actualHomeScore - actualAwayScore;

  if (predictedDifference === actualDifference) {
    return {
      points: POINTS_BY_SCORE_TYPE.GOAL_DIFFERENCE,
      scoreType: "GOAL_DIFFERENCE",
    };
  }

  if (
    getMatchSign(predictedHomeScore, predictedAwayScore) ===
    getMatchSign(actualHomeScore, actualAwayScore)
  ) {
    return {
      points: POINTS_BY_SCORE_TYPE.FINAL_RESULT,
      scoreType: "FINAL_RESULT",
    };
  }

  return {
    points: POINTS_BY_SCORE_TYPE.FAILED,
    scoreType: "FAILED",
  };
}

export function getPendingPredictionScore() {
  return {
    points: 0,
    scoreType: "PENDING" as const,
  };
}
