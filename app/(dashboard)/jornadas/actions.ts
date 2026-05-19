"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { PredictionActionState } from "@/lib/prediction-action-state";
import { calculatePredictionScore, getPendingPredictionScore } from "@/lib/scoring";
import { formDataToObject, predictionSchema } from "@/lib/validations";
import { isMatchEditable } from "@/lib/utils";

function buildPredictionActionState(
  type: Exclude<PredictionActionState["type"], "idle">,
  message: string,
): PredictionActionState {
  return {
    type,
    message,
    submittedAt: Date.now(),
  };
}

export async function savePredictionAction(
  _previousState: PredictionActionState,
  formData: FormData,
): Promise<PredictionActionState> {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const roundId = String(formData.get("roundId") ?? "");
  const parsed = predictionSchema.safeParse(formDataToObject(formData));

  if (!parsed.success) {
    return buildPredictionActionState(
      "error",
      parsed.error.issues[0]?.message ?? "Predicción inválida.",
    );
  }

  const match = await prisma.match.findUnique({
    where: { id: parsed.data.matchId },
    include: {
      round: true,
    },
  });

  if (!match) {
    return buildPredictionActionState("error", "No se encontró el partido.");
  }

  const currentRound = await prisma.round.findFirst({
    where: {
      unlockAt: {
        lte: new Date(),
      },
      startDate: {
        gt: new Date(),
      },
    },
    orderBy: {
      startDate: "asc",
    },
  });

  if (
    currentRound?.id !== match.roundId ||
    !isMatchEditable(match.startsAt, match.isLocked, match.round.unlockAt, match.round.startDate)
  ) {
    return buildPredictionActionState("error", "La fase o el partido ya no admiten cambios.");
  }

  const scored =
    match.homeScore !== null && match.awayScore !== null
      ? calculatePredictionScore(
          parsed.data.predictedHomeScore,
          parsed.data.predictedAwayScore,
          match.homeScore,
          match.awayScore,
        )
      : getPendingPredictionScore();

  await prisma.prediction.upsert({
    where: {
      userId_matchId: {
        userId: session.user.id,
        matchId: parsed.data.matchId,
      },
    },
    update: {
      predictedHomeScore: parsed.data.predictedHomeScore,
      predictedAwayScore: parsed.data.predictedAwayScore,
      points: scored.points,
      scoreType: scored.scoreType,
    },
    create: {
      userId: session.user.id,
      matchId: parsed.data.matchId,
      predictedHomeScore: parsed.data.predictedHomeScore,
      predictedAwayScore: parsed.data.predictedAwayScore,
      points: scored.points,
      scoreType: scored.scoreType,
    },
  });

  revalidatePath("/home");
  revalidatePath("/jornadas");
  revalidatePath(`/jornadas/${roundId}`);
  revalidatePath("/clasificacion");
  return buildPredictionActionState("success", "Predicción guardada.");
}
