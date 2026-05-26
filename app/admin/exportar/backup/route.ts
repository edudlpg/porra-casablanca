import { Role } from "@prisma/client";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const CSV_HEADERS = [
  "tipo",
  "userId",
  "usuario",
  "nombre",
  "nombreEquipo",
  "rol",
  "matchId",
  "ronda",
  "fechaPartido",
  "equipoLocal",
  "equipoVisitante",
  "resultadoLocal",
  "resultadoVisitante",
  "prediccionLocal",
  "prediccionVisitante",
  "puntos",
  "tipoAcierto",
  "creadoEn",
  "actualizadoEn",
] as const;

type CsvRow = Partial<Record<(typeof CSV_HEADERS)[number], string | number | null | undefined>>;

function escapeCsvValue(value: string | number | null | undefined) {
  if (value === null || value === undefined) {
    return "";
  }

  const text = String(value);

  if (/[",\n\r]/.test(text)) {
    return `"${text.replaceAll('"', '""')}"`;
  }

  return text;
}

function buildCsv(rows: CsvRow[]) {
  return [
    CSV_HEADERS.join(","),
    ...rows.map((row) => CSV_HEADERS.map((header) => escapeCsvValue(row[header])).join(",")),
  ].join("\n");
}

function buildBackupFilename() {
  return `porra-casablanca-backup-${new Date().toISOString().slice(0, 10)}.csv`;
}

export async function GET() {
  const session = await auth();

  if (!session?.user) {
    return new Response("No autorizado", { status: 401 });
  }

  if (session.user.role !== Role.ADMIN) {
    return new Response("Prohibido", { status: 403 });
  }

  const users = await prisma.user.findMany({
    select: {
      id: true,
      username: true,
      name: true,
      teamName: true,
      role: true,
      createdAt: true,
    },
    orderBy: [{ role: "asc" }, { username: "asc" }, { name: "asc" }],
  });
  const matches = await prisma.match.findMany({
    select: {
      id: true,
      startsAt: true,
      homeScore: true,
      awayScore: true,
      createdAt: true,
      round: { select: { name: true } },
      homeTeam: { select: { name: true } },
      awayTeam: { select: { name: true } },
      winnerTeam: { select: { name: true } },
    },
    orderBy: [{ startsAt: "asc" }],
  });
  const predictions = await prisma.prediction.findMany({
    select: {
      userId: true,
      matchId: true,
      predictedHomeScore: true,
      predictedAwayScore: true,
      points: true,
      scoreType: true,
      createdAt: true,
      updatedAt: true,
      user: {
        select: {
          username: true,
          name: true,
          teamName: true,
          role: true,
        },
      },
      match: {
        select: {
          startsAt: true,
          homeScore: true,
          awayScore: true,
          round: { select: { name: true } },
          homeTeam: { select: { name: true } },
          awayTeam: { select: { name: true } },
        },
      },
    },
    orderBy: [{ match: { startsAt: "asc" } }, { user: { username: "asc" } }],
  });

  const rows: CsvRow[] = [
    ...users.map((user) => ({
      tipo: "USER",
      userId: user.id,
      usuario: user.username,
      nombre: user.name,
      nombreEquipo: user.teamName,
      rol: user.role,
      creadoEn: user.createdAt.toISOString(),
    })),
    ...matches.map((match) => ({
      tipo: "MATCH",
      matchId: match.id,
      ronda: match.round.name,
      fechaPartido: match.startsAt.toISOString(),
      equipoLocal: match.homeTeam.name,
      equipoVisitante: match.awayTeam.name,
      resultadoLocal: match.homeScore,
      resultadoVisitante: match.awayScore,
      tipoAcierto: match.winnerTeam ? `Pasa ${match.winnerTeam.name}` : undefined,
      creadoEn: match.createdAt.toISOString(),
    })),
    ...predictions.map((prediction) => ({
      tipo: "PREDICTION",
      userId: prediction.userId,
      usuario: prediction.user.username,
      nombre: prediction.user.name,
      nombreEquipo: prediction.user.teamName,
      rol: prediction.user.role,
      matchId: prediction.matchId,
      ronda: prediction.match.round.name,
      fechaPartido: prediction.match.startsAt.toISOString(),
      equipoLocal: prediction.match.homeTeam.name,
      equipoVisitante: prediction.match.awayTeam.name,
      resultadoLocal: prediction.match.homeScore,
      resultadoVisitante: prediction.match.awayScore,
      prediccionLocal: prediction.predictedHomeScore,
      prediccionVisitante: prediction.predictedAwayScore,
      puntos: prediction.points,
      tipoAcierto: prediction.scoreType,
      creadoEn: prediction.createdAt.toISOString(),
      actualizadoEn: prediction.updatedAt.toISOString(),
    })),
  ];

  const csv = buildCsv(rows);

  return new Response(csv, {
    headers: {
      "Content-Disposition": `attachment; filename="${buildBackupFilename()}"`,
      "Content-Type": "text/csv; charset=utf-8",
    },
  });
}
