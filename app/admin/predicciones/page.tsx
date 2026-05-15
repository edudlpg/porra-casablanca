import { BackLink } from "@/components/layout/back-link";
import { EmptyState } from "@/components/layout/empty-state";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";

function getDisplayName(user: {
  name: string;
  username: string | null;
  teamName: string | null;
}) {
  return user.teamName ?? user.username ?? user.name;
}

function getProgressTone(percentage: number) {
  if (percentage >= 100) {
    return {
      badge: "success" as const,
      bar: "bg-emerald-500",
      text: "text-emerald-700",
    };
  }

  if (percentage >= 50) {
    return {
      badge: "warning" as const,
      bar: "bg-amber-500",
      text: "text-amber-700",
    };
  }

  return {
    badge: "secondary" as const,
    bar: "bg-slate-500",
    text: "text-slate-600",
  };
}

async function getAdminPredictionsRound(now: Date) {
  const activeRound = await prisma.round.findFirst({
    where: {
      unlockAt: { lte: now },
      endDate: { gte: now },
    },
    orderBy: {
      startDate: "asc",
    },
  });

  if (activeRound) {
    return activeRound;
  }

  const nextRound = await prisma.round.findFirst({
    where: {
      endDate: { gte: now },
    },
    orderBy: {
      startDate: "asc",
    },
  });

  if (nextRound) {
    return nextRound;
  }

  return prisma.round.findFirst({
    orderBy: {
      endDate: "desc",
    },
  });
}

export default async function AdminPredictionsPage() {
  const now = new Date();
  const round = await getAdminPredictionsRound(now);

  if (!round) {
    return (
      <div className="space-y-6">
        <PageHeader
          eyebrow="Admin"
          title="📊 Predicciones"
          description="Revisa cuántas porras ha guardado cada usuario en la fase activa."
          action={<BackLink href="/admin" />}
        />
        <EmptyState
          title="Sin fases disponibles"
          description="Crea una jornada antes de revisar el progreso de predicciones."
        />
      </div>
    );
  }

  const [totalMatches, users] = await Promise.all([
    prisma.match.count({
      where: {
        roundId: round.id,
      },
    }),
    prisma.user.findMany({
      where: {
        role: "USER",
      },
      select: {
        id: true,
        name: true,
        username: true,
        teamName: true,
        predictions: {
          where: {
            match: {
              roundId: round.id,
            },
          },
          select: {
            id: true,
          },
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    }),
  ]);

  const rows = users
    .map((user) => {
      const savedPredictions = user.predictions.length;
      const percentage = totalMatches > 0 ? Math.round((savedPredictions / totalMatches) * 100) : 0;

      return {
        id: user.id,
        displayName: getDisplayName(user),
        savedPredictions,
        percentage,
      };
    })
    .sort((left, right) => {
      return left.percentage - right.percentage || left.displayName.localeCompare(right.displayName);
    });

  const completedUsers = rows.filter((row) => row.savedPredictions === totalMatches && totalMatches > 0).length;
  const roundIsOpen = round.unlockAt <= now && round.endDate >= now;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Admin"
        title="📊 Predicciones"
        description="Progreso de predicciones guardadas por usuario en la fase seleccionada automáticamente."
        action={<BackLink href="/admin" />}
      />

      <Card>
        <CardContent className="flex items-center justify-between gap-4 p-5">
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
              Fase revisada
            </p>
            <h2 className="mt-1 truncate font-display text-2xl font-bold text-slate-950">
              {round.name}
            </h2>
            <p className="mt-1 text-sm font-semibold text-slate-500">
              {completedUsers}/{rows.length} usuarios completos
            </p>
          </div>
          <Badge variant={roundIsOpen ? "success" : "secondary"}>
            {roundIsOpen ? "Activa" : "Referencia"}
          </Badge>
        </CardContent>
      </Card>

      {rows.length && totalMatches > 0 ? (
        <div className="space-y-3">
          {rows.map((row) => {
            const tone = getProgressTone(row.percentage);

            return (
              <Card key={row.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <CardTitle className="truncate text-base font-bold">
                        {row.displayName}
                      </CardTitle>
                      <p className={`mt-1 text-xs font-bold uppercase tracking-[0.16em] ${tone.text}`}>
                        {row.savedPredictions}/{totalMatches} guardadas
                      </p>
                    </div>
                    <Badge variant={tone.badge}>{row.percentage}%</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="h-2 overflow-hidden rounded-full bg-slate-200">
                    <div
                      className={`h-full rounded-full ${tone.bar}`}
                      style={{ width: `${row.percentage}%` }}
                    />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <EmptyState
          title="Sin datos suficientes"
          description="No hay usuarios o partidos en la fase seleccionada."
        />
      )}
    </div>
  );
}
