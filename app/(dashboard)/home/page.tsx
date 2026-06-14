import Link from "next/link";

import { Countdown } from "@/components/layout/countdown";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/layout/empty-state";
import { MatchCard } from "@/components/matches/match-card";
import { auth } from "@/lib/auth";
import { getCachedAppConfig } from "@/lib/data-cache";
import { buildRankingEntries } from "@/lib/ranking";
import { prisma } from "@/lib/prisma";
import type { RankingEntry } from "@/types";

function formatPotAmount(amount: number) {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export default async function HomePage() {
  const session = await auth();
  const now = new Date();
  const initialCountdownNow = now.getTime();

  if (!session?.user) {
    return null;
  }

  const upcomingMatchesWhere = {
    startsAt: { gt: now },
  } as const;

  const [nextRound, totalRounds] = await Promise.all([
    prisma.round.findFirst({
      where: {
        unlockAt: {
          lte: now,
        },
        startDate: {
          gt: now,
        },
      },
      orderBy: {
        startDate: "asc",
      },
      select: {
        id: true,
        name: true,
        startDate: true,
      },
    }),
    prisma.round.count(),
  ]);

  const upcomingMatches = await prisma.match.findMany({
    where: upcomingMatchesWhere,
    select: {
      id: true,
      roundId: true,
      homeTeamId: true,
      awayTeamId: true,
      winnerTeamId: true,
      homeSlotLabel: true,
      awaySlotLabel: true,
      venueName: true,
      venueCity: true,
      startsAt: true,
      homeScore: true,
      awayScore: true,
      broadcast: true,
      isLocked: true,
      createdAt: true,
      round: {
        select: {
          id: true,
          name: true,
          unlockAt: true,
          startDate: true,
          endDate: true,
          createdAt: true,
        },
      },
      homeTeam: {
        select: {
          id: true,
          name: true,
          flagUrl: true,
          groupCode: true,
        },
      },
      awayTeam: {
        select: {
          id: true,
          name: true,
          flagUrl: true,
          groupCode: true,
        },
      },
    },
    orderBy: {
      startsAt: "asc",
    },
    take: 3,
  });

  const users = await prisma.user.findMany({
    where: {
      role: "USER",
    },
    select: {
      id: true,
      name: true,
      username: true,
      email: true,
      teamName: true,
      avatarUrl: true,
      predictions: {
        select: {
          points: true,
          scoreType: true,
        },
      },
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  const config = await getCachedAppConfig();

  const pendingMatchesCount = nextRound
    ? await prisma.match.count({
        where: {
          roundId: nextRound.id,
          startsAt: { gt: now },
          isLocked: false,
          predictions: {
            none: {
              userId: session.user.id,
            },
          },
        },
      })
    : 0;

  const rankingEntries: RankingEntry[] = buildRankingEntries(users, config?.entryFee ?? 0);

  const currentUserEntry = rankingEntries.find((entry) => entry.user.id === session.user.id);
  const accumulatedPot = rankingEntries.length * (config?.entryFee ?? 0);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Dashboard"
        title={`Hola, ${session.user.name}`}
      />

      <section className="grid grid-cols-2 gap-3">
        <Link href="/clasificacion" className="block h-full">
          <Card className="h-full border-emerald-200/80 bg-emerald-50/82 text-emerald-950 transition hover:border-emerald-300 hover:bg-emerald-100/76">
            <CardContent className="space-y-2 p-5">
              <p className="text-xs uppercase tracking-[0.18em] text-emerald-700">Tu posición</p>
              <p className="font-display text-3xl font-bold leading-none">
                {currentUserEntry
                  ? `${currentUserEntry.position}º`
                  : "Sin datos"}
              </p>
              {currentUserEntry ? (
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-800">
                  {currentUserEntry.totalPoints} PTS
                </p>
              ) : null}
            </CardContent>
          </Card>
        </Link>
        <Link href="/jornadas" className="block h-full">
          <Card className="h-full border-emerald-200/80 bg-emerald-50/82 text-emerald-950 transition hover:border-emerald-300 hover:bg-emerald-100/76">
            <CardContent className="space-y-2 p-5">
              <p className="text-xs uppercase tracking-[0.18em] text-emerald-700">
                Partidos pendientes
              </p>
              <p className="font-display text-3xl font-bold leading-none text-emerald-950">
                {pendingMatchesCount}
              </p>
            </CardContent>
          </Card>
        </Link>
      </section>

      <Card className="border-amber-200/80 bg-[linear-gradient(135deg,rgba(254,243,199,0.95),rgba(240,253,250,0.9))] text-slate-950">
        <CardContent className="flex items-center justify-between gap-4 px-5 py-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-700">
              Bote acumulado
            </p>
            <p className="mt-0.5 text-xs font-semibold text-slate-600">
              {rankingEntries.length} participantes
            </p>
          </div>
          <p className="font-display text-2xl font-bold text-amber-700">
            {formatPotAmount(accumulatedPot)}
          </p>
        </CardContent>
      </Card>

      <Card className="bg-[linear-gradient(135deg,rgba(3,105,161,0.94),rgba(15,118,110,0.96))] text-white">
        <CardContent className="space-y-4 p-5">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-cyan-100">Próxima jornada</p>
            <h2 className="mt-2 font-display text-2xl font-bold">
              {nextRound?.name ??
                (totalRounds > 0 ? "No hay jornadas abiertas" : "Aún no hay jornadas creadas")}
            </h2>
          </div>
          {nextRound ? <Countdown target={nextRound.startDate} initialNow={initialCountdownNow} /> : null}
        </CardContent>
      </Card>

      <section className="space-y-3">
        <div>
          <h2 className="font-display text-xl font-bold text-slate-950">Próximos partidos</h2>
        </div>
        {upcomingMatches.length ? (
          upcomingMatches.map((match, index) => (
            <MatchCard
              key={match.id}
              match={match}
              mediaLoading={index === 0 ? "eager" : "lazy"}
            />
          ))
        ) : (
          <EmptyState
            title="Sin próximos partidos"
            description="No hay partidos futuros programados ahora mismo."
          />
        )}
      </section>
    </div>
  );
}
