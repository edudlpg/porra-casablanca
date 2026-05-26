import Link from "next/link";

import { BackLink } from "@/components/layout/back-link";
import { EmptyState } from "@/components/layout/empty-state";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getDisplayFlagUrl, getFlagEmoji } from "@/lib/flags";
import { prisma } from "@/lib/prisma";
import { TEAM_GUIDE_BY_NAME, getTeamGuideSlug } from "@/lib/world-cup-team-guide";

export default async function WorldCupTeamsGuidePage() {
  const teams = await prisma.team.findMany({
    where: {
      groupCode: {
        not: null,
      },
    },
    orderBy: [
      { groupCode: "asc" },
      { name: "asc" },
    ],
  });

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Mundial"
        title="Guía de equipos"
        description="Un vistazo rápido a las 48 selecciones, sus grupos, figuras y expectativas."
        action={<BackLink href="/mundial" />}
      />

      {teams.length ? (
        <div className="grid gap-3 sm:grid-cols-2">
          {teams.map((team) => {
            const guide = TEAM_GUIDE_BY_NAME.get(team.name);
            const colors = guide?.colors ?? ["#0f172a", "#ffffff", "#64748b"];
            const displayFlagUrl = getDisplayFlagUrl(team.flagUrl, 80);
            const flagEmoji = getFlagEmoji(team.flagUrl);

            return (
              <Link
                key={team.id}
                href={`/mundial/equipos/${getTeamGuideSlug(team.name)}`}
                className="block"
              >
                <Card
                  className="relative min-h-36 overflow-hidden border-white/80 text-white transition hover:-translate-y-0.5"
                  style={{
                    background: `linear-gradient(135deg, ${colors[0]} 0%, ${colors[1]} 54%, ${colors[2]} 100%)`,
                  }}
                >
                  <div className="absolute inset-0 bg-slate-950/24" />
                  <div className="absolute -right-10 -top-10 size-32 rounded-full bg-white/18" />
                  <div className="absolute -bottom-16 left-8 size-36 rounded-full bg-black/12" />
                  <CardContent className="relative h-full p-5 pr-20">
                    <Badge className="absolute left-5 top-5 w-fit border-white/30 bg-white/18 text-white">
                      Grupo {team.groupCode}
                    </Badge>
                    <div className="absolute right-5 top-5 flex size-12 items-center justify-center rounded-2xl bg-white/90 p-2 shadow-lg">
                      {displayFlagUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={displayFlagUrl}
                          alt={`Bandera de ${team.name}`}
                          className="size-full object-contain"
                        />
                      ) : (
                        <span className="text-3xl leading-none">{flagEmoji ?? "?"}</span>
                      )}
                    </div>
                    <div className="flex min-h-28 items-center pt-8">
                      <h2 className="text-wrap font-display text-xl font-bold leading-tight sm:text-2xl">
                        {team.name}
                      </h2>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      ) : (
        <EmptyState
          title="Sin equipos disponibles"
          description="Todavía no hay selecciones cargadas para generar la guía."
        />
      )}
    </div>
  );
}
