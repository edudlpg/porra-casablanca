"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { calculatePredictionScore, getPendingPredictionScore } from "@/lib/scoring";
import { formDataToObject, predictionSchema } from "@/lib/validations";
import { isMatchEditable } from "@/lib/utils";

export async function savePredictionAction(formData: FormData) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const roundId = String(formData.get("roundId") ?? "");
  const parsed = predictionSchema.safeParse(formDataToObject(formData));

  if (!parsed.success) {
    redirect(`/jornadas/${roundId}?error=${encodeURIComponent(parsed.error.issues[0]?.message ?? "Predicción inválida.")}`);
  }

  const match = await prisma.match.findUnique({
    where: { id: parsed.data.matchId },
    include: {
      round: true,
    },
  });

  if (!match) {
    redirect(`/jornadas/${roundId}?error=No se encontró el partido.`);
  }

  if (!isMatchEditable(match.startsAt, match.isLocked, match.round.unlockAt)) {
    redirect(`/jornadas/${roundId}?error=La fase o el partido ya no admiten cambios.`);
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
  redirect(`/jornadas/${roundId}?success=Predicción guardada.`);
}
