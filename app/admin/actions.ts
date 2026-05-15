"use server";

import bcrypt from "bcryptjs";
import { Role } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { calculatePredictionScore } from "@/lib/scoring";
import { synchronizeTournamentProgression } from "@/lib/tournament-progression";
import {
  adminPasswordResetSchema,
  adminUserDeleteSchema,
  appConfigSchema,
  formDataToObject,
  matchSchema,
  resultSchema,
  roundSchema,
  teamSchema,
} from "@/lib/validations";

async function requireAdmin() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  if (session.user.role !== Role.ADMIN) {
    redirect("/home");
  }

  return session.user;
}

function refreshAdminScreens() {
  revalidatePath("/admin");
  revalidatePath("/admin/ajustes");
  revalidatePath("/admin/contrasenas");
  revalidatePath("/admin/predicciones");
  revalidatePath("/home");
  revalidatePath("/jornadas");
  revalidatePath("/clasificacion");
  revalidatePath("/mundial");
  revalidatePath("/mundial/clasificacion-grupos");
  revalidatePath("/admin/jornadas");
  revalidatePath("/admin/partidos");
  revalidatePath("/admin/resultados");
}

export async function saveAppConfigAction(formData: FormData) {
  await requireAdmin();

  const parsed = appConfigSchema.safeParse(formDataToObject(formData));

  if (!parsed.success) {
    redirect(`/admin/ajustes?error=${encodeURIComponent(parsed.error.issues[0]?.message ?? "Configuración inválida.")}`);
  }

  await prisma.appConfig.upsert({
    where: { id: "singleton" },
    update: {
      entryFee: parsed.data.entryFee,
    },
    create: {
      id: "singleton",
      entryFee: parsed.data.entryFee,
    },
  });

  refreshAdminScreens();
  redirect("/admin/ajustes?success=Participación guardada.");
}

export async function resetUserPasswordAction(formData: FormData) {
  await requireAdmin();

  const parsed = adminPasswordResetSchema.safeParse(formDataToObject(formData));

  if (!parsed.success) {
    redirect(`/admin/contrasenas?error=${encodeURIComponent(parsed.error.issues[0]?.message ?? "Contraseña inválida.")}`);
  }

  const passwordHash = await bcrypt.hash(parsed.data.password, 10);

  await prisma.user.update({
    where: { id: parsed.data.userId },
    data: {
      passwordHash,
    },
  });

  refreshAdminScreens();
  redirect("/admin/contrasenas?success=Contraseña actualizada.");
}

export async function deleteUserAction(formData: FormData) {
  await requireAdmin();

  const parsed = adminUserDeleteSchema.safeParse(formDataToObject(formData));

  if (!parsed.success) {
    redirect(`/admin/contrasenas?error=${encodeURIComponent(parsed.error.issues[0]?.message ?? "Usuario inválido.")}`);
  }

  const user = await prisma.user.findUnique({
    where: { id: parsed.data.userId },
    select: {
      role: true,
    },
  });

  if (!user) {
    redirect("/admin/contrasenas?error=No se encontró el usuario.");
  }

  if (user.role === Role.ADMIN) {
    redirect("/admin/contrasenas?error=No se puede eliminar un administrador.");
  }

  await prisma.user.delete({
    where: { id: parsed.data.userId },
  });

  refreshAdminScreens();
  redirect("/admin/contrasenas?success=Usuario eliminado.");
}

export async function saveRoundAction(formData: FormData) {
  await requireAdmin();

  const parsed = roundSchema.safeParse(formDataToObject(formData));

  if (!parsed.success) {
    redirect(`/admin/jornadas?error=${encodeURIComponent(parsed.error.issues[0]?.message ?? "Jornada inválida.")}`);
  }

  if (parsed.data.id) {
    await prisma.round.update({
      where: { id: parsed.data.id },
      data: parsed.data,
    });
  } else {
    await prisma.round.create({
      data: parsed.data,
    });
  }

  refreshAdminScreens();
  redirect("/admin/jornadas?success=Jornada guardada.");
}

export async function saveTeamAction(formData: FormData) {
  await requireAdmin();

  const parsed = teamSchema.safeParse(formDataToObject(formData));

  if (!parsed.success) {
    redirect(`/admin/partidos?error=${encodeURIComponent(parsed.error.issues[0]?.message ?? "Equipo inválido.")}`);
  }

  await prisma.team.create({
    data: {
      name: parsed.data.name,
      flagUrl: parsed.data.flagUrl || null,
    },
  });

  refreshAdminScreens();
  redirect("/admin/partidos?success=Equipo creado.");
}

export async function saveMatchAction(formData: FormData) {
  await requireAdmin();

  const parsed = matchSchema.safeParse(formDataToObject(formData));

  if (!parsed.success) {
    redirect(`/admin/partidos?error=${encodeURIComponent(parsed.error.issues[0]?.message ?? "Partido inválido.")}`);
  }

  if (parsed.data.homeTeamId === parsed.data.awayTeamId) {
    redirect("/admin/partidos?error=Un partido no puede tener el mismo equipo dos veces.");
  }

  const matchData = {
    ...parsed.data,
    venueName: parsed.data.venueName || null,
    venueCity: parsed.data.venueCity || null,
  };

  if (parsed.data.id) {
    await prisma.match.update({
      where: { id: parsed.data.id },
      data: matchData,
    });
  } else {
    await prisma.match.create({
      data: matchData,
    });
  }

  refreshAdminScreens();
  redirect("/admin/partidos?success=Partido guardado.");
}

export async function saveResultAction(formData: FormData) {
  await requireAdmin();

  const parsed = resultSchema.safeParse(formDataToObject(formData));

  if (!parsed.success) {
    redirect(`/admin/resultados?error=${encodeURIComponent(parsed.error.issues[0]?.message ?? "Resultado inválido.")}`);
  }

  const currentMatch = await prisma.match.findUnique({
    where: {
      id: parsed.data.matchId,
    },
    include: {
      round: true,
    },
  });

  if (!currentMatch) {
    redirect("/admin/resultados?error=No se encontró el partido.");
  }

  const isKnockoutMatch = currentMatch.round.name !== "Fase de grupos";
  const isDraw = parsed.data.homeScore === parsed.data.awayScore;

  if (
    parsed.data.winnerTeamId &&
    parsed.data.winnerTeamId !== currentMatch.homeTeamId &&
    parsed.data.winnerTeamId !== currentMatch.awayTeamId
  ) {
    redirect("/admin/resultados?error=El equipo que avanza no coincide con los participantes del partido.");
  }

  if (isKnockoutMatch && isDraw && !parsed.data.winnerTeamId) {
    redirect("/admin/resultados?error=En eliminatorias, si hay empate debes indicar qué equipo pasa de ronda.");
  }

  const winnerTeamId = isKnockoutMatch
    ? parsed.data.homeScore > parsed.data.awayScore
      ? currentMatch.homeTeamId
      : parsed.data.homeScore < parsed.data.awayScore
        ? currentMatch.awayTeamId
        : parsed.data.winnerTeamId
    : null;

  await prisma.$transaction(
    async (tx) => {
      await tx.match.update({
        where: { id: parsed.data.matchId },
        data: {
          homeScore: parsed.data.homeScore,
          awayScore: parsed.data.awayScore,
          winnerTeamId,
          broadcast: parsed.data.broadcast,
          isLocked: parsed.data.isLocked,
        },
      });

      const predictions = await tx.prediction.findMany({
        where: {
          matchId: parsed.data.matchId,
        },
      });

      await Promise.all(
        predictions.map((prediction) => {
          const scored = calculatePredictionScore(
            prediction.predictedHomeScore,
            prediction.predictedAwayScore,
            parsed.data.homeScore,
            parsed.data.awayScore,
          );

          return tx.prediction.update({
            where: { id: prediction.id },
            data: scored,
          });
        }),
      );

      await synchronizeTournamentProgression(tx);
    },
  );

  refreshAdminScreens();
  redirect("/admin/resultados?success=Resultado guardado, puntuaciones actualizadas y cruces sincronizados.");
}

export async function recalculateScoresAction() {
  await requireAdmin();

  const predictions = await prisma.prediction.findMany({
    include: {
      match: true,
    },
  });

  await prisma.$transaction(
    predictions
      .filter((prediction) => prediction.match.homeScore !== null && prediction.match.awayScore !== null)
      .map((prediction) => {
        const scored = calculatePredictionScore(
          prediction.predictedHomeScore,
          prediction.predictedAwayScore,
          prediction.match.homeScore ?? 0,
          prediction.match.awayScore ?? 0,
        );

        return prisma.prediction.update({
          where: { id: prediction.id },
          data: scored,
        });
      }),
  );

  refreshAdminScreens();
  redirect("/admin/resultados?success=Puntuaciones recalculadas.");
}
