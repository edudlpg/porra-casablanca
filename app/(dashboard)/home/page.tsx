import Link from "next/link";

import { Countdown } from "@/components/layout/countdown";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/layout/empty-state";
import { MatchCard } from "@/components/matches/match-card";
import { auth } from "@/lib/auth";
import { buildRankingEntries } from "@/lib/ranking";
import { prisma } from "@/lib/prisma";
import type { RankingEntry } from "@/types";

export default async function HomePage() {
  const session = await auth();
  const now = new Date();
  const initialCountdownNow = now.getTime();

  if (!session?.user) {
    return null;
  }

  const pendingMatchesWhere = {
    startsAt: { gt: now },
    isLocked: false,
    round: {
      unlockAt: {
        lte: now,
      },
    },
    predictions: {
      none: {
        userId: session.user.id,
      },
    },
  } as const;

  const upcomingMatchesWhere = {
    startsAt: { gt: now },
  } as const;

  const [nextRound, pendingMatchesCount, upcomingMatches, users, config] = await Promise.all([
    prisma.round.findFirst({
      where: {
        endDate: {
          gte: now,
        },
      },
      orderBy: {
        startDate: "asc",
      },
    }),
    prisma.match.count({
      where: pendingMatchesWhere,
    }),
    prisma.match.findMany({
      where: upcomingMatchesWhere,
      include: {
        round: true,
        homeTeam: true,
        awayTeam: true,
      },
      orderBy: {
        startsAt: "asc",
      },
      take: 3,
    }),
    prisma.user.findMany({
      include: {
        predictions: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    }),
    prisma.appConfig.findUnique({
      where: { id: "singleton" },
    }),
  ]);

  const rankingEntries: RankingEntry[] = buildRankingEntries(users, config?.entryFee ?? 0);

  const currentUserEntry = rankingEntries.find((entry) => entry.user.id === session.user.id);

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

      <Card className="bg-[linear-gradient(135deg,rgba(3,105,161,0.94),rgba(15,118,110,0.96))] text-white">
        <CardContent className="space-y-4 p-5">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-cyan-100">Próxima jornada</p>
            <h2 className="mt-2 font-display text-2xl font-bold">
              {nextRound?.name ?? "Aún no hay jornadas creadas"}
            </h2>
          </div>
          {nextRound ? <Countdown target={nextRound.endDate} initialNow={initialCountdownNow} /> : null}
        </CardContent>
      </Card>

      <section className="space-y-3">
        <div>
          <h2 className="font-display text-xl font-bold text-slate-950">Próximos partidos</h2>
        </div>
        {upcomingMatches.length ? (
          upcomingMatches.map((match) => <MatchCard key={match.id} match={match} />)
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
