import type { Prediction, User } from "@prisma/client";

import type { RankingEntry } from "@/types";

type UserWithPredictions = Pick<User, "id" | "name" | "username" | "email" | "avatarUrl"> & {
  predictions: Pick<Prediction, "points" | "scoreType">[];
};

function getPrizeAmount(position: number, participantCount: number, entryFee: number) {
  const totalPot = participantCount * entryFee;
  const secondPrize = participantCount >= 2 ? entryFee * 2 : 0;
  const thirdPrize = participantCount >= 3 ? entryFee : 0;

  if (position === 1) {
    return Math.max(totalPot - secondPrize - thirdPrize, 0);
  }

  if (position === 2) {
    return secondPrize;
  }

  if (position === 3) {
    return thirdPrize;
  }

  return 0;
}

export function buildRankingEntries(users: UserWithPredictions[], entryFee = 0): RankingEntry[] {
  return users
    .map((user) => ({
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
        avatarUrl: user.avatarUrl,
      },
      totalPoints: user.predictions.reduce((sum, item) => sum + item.points, 0),
      exactHits: user.predictions.filter((item) => item.scoreType === "EXACT").length,
      goalDifferenceHits: user.predictions.filter(
        (item) => item.scoreType === "GOAL_DIFFERENCE",
      ).length,
      finalResultHits: user.predictions.filter((item) => item.scoreType === "FINAL_RESULT").length,
      position: 0,
      prizeAmount: 0,
    }))
    .sort((left, right) => {
      return (
        right.totalPoints - left.totalPoints ||
        right.exactHits - left.exactHits ||
        right.goalDifferenceHits - left.goalDifferenceHits ||
        right.finalResultHits - left.finalResultHits ||
        left.user.name.localeCompare(right.user.name)
      );
    })
    .map((entry, index, entries) => ({
      ...entry,
      position: index + 1,
      prizeAmount: getPrizeAmount(index + 1, entries.length, entryFee),
    }));
}
