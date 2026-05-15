import { BackLink } from "@/components/layout/back-link";
import { EmptyState } from "@/components/layout/empty-state";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CardCornerGraphic } from "@/components/ui/card-corner-graphic";
import { getDisplayFlagUrl, getFlagEmoji } from "@/lib/flags";
import { buildBestThirdPlaceRows, buildGroupStandings } from "@/lib/group-standings";
import { prisma } from "@/lib/prisma";

function getGroupStatusMap(
  matches: Array<{
    homeTeam: { groupCode: string | null };
    awayTeam: { groupCode: string | null };
    homeScore: number | null;
    awayScore: number | null;
  }>,
) {
  const statusByGroup = new Map<string, { total: number; completed: number }>();

  for (const match of matches) {
    if (!match.homeTeam.groupCode || match.homeTeam.groupCode !== match.awayTeam.groupCode) {
      continue;
    }

    const current = statusByGroup.get(match.homeTeam.groupCode) ?? { total: 0, completed: 0 };
    current.total += 1;

    if (match.homeScore !== null && match.awayScore !== null) {
      current.completed += 1;
    }

    statusByGroup.set(match.homeTeam.groupCode, current);
  }

  return statusByGroup;
}

function getGroupRowClass(index: number) {
  if (index < 2) {
    return "rounded-2xl bg-emerald-50 text-sm text-emerald-950";
  }

  if (index === 2) {
    return "rounded-2xl bg-amber-50 text-sm text-amber-950";
  }

  return "rounded-2xl bg-slate-50 text-sm text-slate-900";
}

function getTeamCode(name: string) {
  const chunks = name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .split(/[\s/-]+/)
    .map((part) => part.replace(/[^A-Za-z0-9]/g, ""))
    .filter(Boolean);

  if (chunks.length >= 3) {
    return chunks.slice(0, 3).map((chunk) => chunk[0]).join("").toUpperCase();
  }

  if (chunks.length === 2) {
    const combined = `${chunks[0][0]}${chunks[1].slice(0, 2)}`;
    return combined.toUpperCase();
  }

  return (chunks[0] ?? name).slice(0, 3).toUpperCase();
}

function CompactTeamCell({
  team,
}: {
  team: {
    name: string;
    flagUrl: string | null;
  };
}) {
  const displayFlagUrl = team.flagUrl ?? getDisplayFlagUrl(team.flagUrl, 40);
  const flagEmoji = getFlagEmoji(team.flagUrl);

  return (
    <div className="flex min-w-0 items-center gap-1.5">
      {displayFlagUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={displayFlagUrl}
          alt={`Bandera de ${team.name}`}
          className="size-4 shrink-0 rounded-[5px] bg-white object-contain p-0.5"
        />
      ) : (
        <span className="flex size-4 shrink-0 items-center justify-center text-sm leading-none">
          {flagEmoji ?? "?"}
        </span>
      )}
      <span className="truncate text-xs font-bold">{getTeamCode(team.name)}</span>
    </div>
  );
}

export default async function WorldCupGroupStandingsPage() {
  const [teams, matches] = await Promise.all([
    prisma.team.findMany({
      where: {
        groupCode: {
          not: null,
        },
      },
      orderBy: [
        { groupCode: "asc" },
        { name: "asc" },
      ],
    }),
    prisma.match.findMany({
      where: {
        round: {
          name: "Fase de grupos",
        },
      },
      include: {
        homeTeam: true,
        awayTeam: true,
      },
      orderBy: {
        startsAt: "asc",
      },
    }),
  ]);

  const standings = buildGroupStandings(teams, matches);
  const bestThirdPlaceRows = buildBestThirdPlaceRows(standings);
  const groupStatusMap = getGroupStatusMap(matches);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Mundial"
        title="Clasificación grupos"
        description="Tabla actualizada a partir de los resultados reales ya guardados en la fase de grupos."
        action={<BackLink href="/mundial" />}
      />

      {standings.length ? (
        <div className="space-y-4">
          {standings.map((group) => {
            const groupStatus = groupStatusMap.get(group.groupCode);
            const isFinalized = Boolean(groupStatus && groupStatus.total > 0 && groupStatus.total === groupStatus.completed);
            const completedMatches = groupStatus?.completed ?? 0;
            const totalMatches = groupStatus?.total ?? 0;
            const progressPercentage = totalMatches > 0 ? (completedMatches / totalMatches) * 100 : 0;

            return (
              <Card key={group.groupCode} className="relative overflow-hidden">
                <CardCornerGraphic variant="match" className="blur-[1.5px] opacity-80" />
                <CardHeader className="relative z-10 pb-3">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-3">
                      <CardTitle className="font-bold">Grupo {group.groupCode}</CardTitle>
                      <Badge variant={isFinalized ? "success" : "secondary"} className="font-bold">
                        {isFinalized ? "Cerrado" : "En juego"}
                      </Badge>
                    </div>
                    <div className="h-1 overflow-hidden rounded-full bg-slate-200/80">
                      <div
                        className="h-full rounded-full bg-emerald-500 transition-all"
                        style={{ width: `${progressPercentage}%` }}
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="relative z-10">
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[20.5rem] table-fixed border-separate border-spacing-y-1.5">
                      <thead>
                        <tr className="text-left text-[10px] font-bold uppercase text-slate-600">
                          <th className="w-[4.45rem] px-1.5 py-1">Eq.</th>
                          <th className="w-6 px-0 py-1 text-center">V</th>
                          <th className="w-6 px-0 py-1 text-center">E</th>
                          <th className="w-6 px-0 py-1 text-center">D</th>
                          <th className="w-7 px-0 py-1 text-center">GF</th>
                          <th className="w-7 px-0 py-1 text-center">GC</th>
                          <th className="w-7 px-0 py-1 text-center">PT</th>
                        </tr>
                      </thead>
                      <tbody>
                        {group.rows.map((row, index) => (
                          <tr key={row.team.id} className={getGroupRowClass(index)}>
                            <td className="max-w-0 rounded-l-2xl px-1.5 py-2">
                              <CompactTeamCell team={row.team} />
                            </td>
                            <td className="px-0 py-2 text-center text-xs font-bold">{row.wins}</td>
                            <td className="px-0 py-2 text-center text-xs font-bold">{row.draws}</td>
                            <td className="px-0 py-2 text-center text-xs font-bold">{row.losses}</td>
                            <td className="px-0 py-2 text-center text-xs font-bold">{row.goalsFor}</td>
                            <td className="px-0 py-2 text-center text-xs font-bold">{row.goalsAgainst}</td>
                            <td className="rounded-r-2xl px-0 py-2 text-center text-xs font-bold">{row.points}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            );
          })}

          <Card className="relative overflow-hidden">
            <CardCornerGraphic variant="match" className="blur-[1.5px] opacity-80" />
            <CardHeader className="relative z-10 pb-3">
              <div className="flex items-center justify-between gap-3">
                <CardTitle className="font-bold">Mejores terceros</CardTitle>
                <Badge variant="secondary">Pasan 8</Badge>
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[20.5rem] table-fixed border-separate border-spacing-y-1.5">
                  <thead>
                    <tr className="text-left text-[10px] font-bold uppercase text-slate-600">
                      <th className="w-[4.45rem] px-1.5 py-1">Eq.</th>
                      <th className="w-6 px-0 py-1 text-center">V</th>
                      <th className="w-6 px-0 py-1 text-center">E</th>
                      <th className="w-6 px-0 py-1 text-center">D</th>
                      <th className="w-7 px-0 py-1 text-center">GF</th>
                      <th className="w-7 px-0 py-1 text-center">GC</th>
                      <th className="w-7 px-0 py-1 text-center">PT</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bestThirdPlaceRows.map((row, index) => {
                      const qualifies = index < 8;

                      return (
                        <tr
                          key={row.team.id}
                          className={
                            qualifies
                              ? "rounded-2xl bg-emerald-50 text-sm text-emerald-950"
                              : "rounded-2xl bg-slate-50 text-sm text-slate-900"
                          }
                        >
                          <td className="max-w-0 rounded-l-2xl px-1.5 py-2">
                            <CompactTeamCell team={row.team} />
                          </td>
                          <td className="px-0 py-2 text-center text-xs font-bold">{row.wins}</td>
                          <td className="px-0 py-2 text-center text-xs font-bold">{row.draws}</td>
                          <td className="px-0 py-2 text-center text-xs font-bold">{row.losses}</td>
                          <td className="px-0 py-2 text-center text-xs font-bold">{row.goalsFor}</td>
                          <td className="px-0 py-2 text-center text-xs font-bold">{row.goalsAgainst}</td>
                          <td className="rounded-r-2xl px-0 py-2 text-center text-xs font-bold">{row.points}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <EmptyState
          title="Sin grupos disponibles"
          description="Todavía no hay datos de grupos suficientes para mostrar la clasificación."
        />
      )}
    </div>
  );
}
