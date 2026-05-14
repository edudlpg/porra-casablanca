"use server";

import bcrypt from "bcryptjs";
import { Role } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { calculatePredictionScore } from "@/lib/scoring";
import {
  adminPasswordResetSchema,
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
  revalidatePath("/home");
  revalidatePath("/jornadas");
  revalidatePath("/clasificacion");
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

  await prisma.match.update({
    where: { id: parsed.data.matchId },
    data: {
      homeScore: parsed.data.homeScore,
      awayScore: parsed.data.awayScore,
      broadcast: parsed.data.broadcast,
      isLocked: parsed.data.isLocked,
    },
  });

  const predictions = await prisma.prediction.findMany({
    where: {
      matchId: parsed.data.matchId,
    },
  });

  await prisma.$transaction(
    predictions.map((prediction) => {
      const scored = calculatePredictionScore(
        prediction.predictedHomeScore,
        prediction.predictedAwayScore,
        parsed.data.homeScore,
        parsed.data.awayScore,
      );

      return prisma.prediction.update({
        where: { id: prediction.id },
        data: scored,
      });
    }),
  );

  refreshAdminScreens();
  redirect("/admin/resultados?success=Resultado guardado y puntuaciones actualizadas.");
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
