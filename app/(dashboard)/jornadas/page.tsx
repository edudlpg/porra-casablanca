import Link from "next/link";

import { EmptyState } from "@/components/layout/empty-state";
import { LocalizedDateTime } from "@/components/layout/localized-date-time";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { isMatchEditable, isRoundInWindow, isRoundOpen } from "@/lib/utils";

export default async function RoundsPage() {
  const rounds = await prisma.round.findMany({
    include: {
      matches: {
        orderBy: {
          startsAt: "asc",
        },
      },
    },
    orderBy: {
      startDate: "asc",
    },
  });
  const currentRound = rounds.find((round) => isRoundInWindow(round.unlockAt, round.endDate));

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Calendario"
        title="Jornadas"
        description="Revisa todas las jornadas abiertas y entra en cada una para subir o editar tus pronósticos."
      />

      {rounds.length ? (
        <div className="space-y-3">
          {rounds.map((round) => {
            const openMatches = round.matches.filter((match) =>
              currentRound?.id === round.id &&
              isMatchEditable(match.startsAt, match.isLocked, round.unlockAt, round.endDate),
            ).length;
            const blockedMatches = round.matches.length - openMatches;
            const roundOpen = isRoundOpen(round.unlockAt);

            return (
              <Link key={round.id} href={`/jornadas/${round.id}`} className="block">
                <Card className="transition hover:-translate-y-0.5">
                  <CardContent className="space-y-4 p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h2 className="font-display text-xl font-bold text-slate-950">{round.name}</h2>
                        <p className="mt-1 text-sm text-slate-500">
                          <LocalizedDateTime value={round.startDate} /> - <LocalizedDateTime value={round.endDate} />
                        </p>
                        {!roundOpen ? (
                          <p className="mt-2 text-sm font-medium text-amber-700">
                            Se abrirá el <LocalizedDateTime value={round.unlockAt} />
                          </p>
                        ) : null}
                      </div>
                      <div
                        className="mt-1 flex items-center gap-2"
                        aria-label={openMatches > 0 ? "Fase con partidos abiertos" : "Fase bloqueada"}
                        title={openMatches > 0 ? "Fase con partidos abiertos" : "Fase bloqueada"}
                      >
                        <span
                          className={
                            openMatches > 0
                              ? "block size-3 rounded-full bg-emerald-500 animate-pulse"
                              : "block size-3 rounded-full bg-rose-500"
                          }
                          style={openMatches > 0 ? { animationDuration: "1s" } : undefined}
                        />
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="success">{openMatches} abiertos</Badge>
                      <Badge variant="warning">{blockedMatches} bloqueados</Badge>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      ) : (
        <EmptyState
          title="Todavía no hay jornadas"
          description="Cuando el admin cree las jornadas aparecerán aquí para que puedas empezar con tus predicciones."
        />
      )}
    </div>
  );
}
