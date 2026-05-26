import { notFound } from "next/navigation";
import { Shirt } from "lucide-react";

import { BackLink } from "@/components/layout/back-link";
import { FlagImage } from "@/components/teams/flag-image";
import { LocalizedDateTime } from "@/components/layout/localized-date-time";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { TEAM_GUIDE_BY_SLUG, getStarPlayerNumber } from "@/lib/world-cup-team-guide";

type Params = Promise<{ teamSlug: string }>;

type TeamFlagProps = {
  team: {
    name: string;
    flagUrl: string | null;
  };
};

function TeamFlagName({ team }: TeamFlagProps) {
  return (
    <span className="inline-flex min-w-0 items-center gap-2">
      <FlagImage flagUrl={team.flagUrl} teamName={team.name} size="md" />
      <span className="min-w-0 truncate">{team.name}</span>
    </span>
  );
}

function ColorfulCard({
  colors,
  children,
}: {
  colors: [string, string, string];
  children: React.ReactNode;
}) {
  return (
    <Card
      className="relative overflow-hidden border-white/80 text-white"
      style={{
        background: `linear-gradient(135deg, ${colors[0]} 0%, ${colors[1]} 54%, ${colors[2]} 100%)`,
      }}
    >
      <div className="absolute inset-0 bg-slate-950/30" />
      <div className="absolute -right-10 -top-10 size-32 rounded-full bg-white/16" />
      <div className="relative">{children}</div>
    </Card>
  );
}

export default async function TeamGuideDetailPage({ params }: { params: Params }) {
  const { teamSlug } = await params;
  const guide = TEAM_GUIDE_BY_SLUG.get(teamSlug);

  if (!guide) {
    notFound();
  }

  const team = await prisma.team.findUnique({
    where: {
      name: guide.name,
    },
    select: {
      id: true,
      name: true,
      flagUrl: true,
      groupCode: true,
    },
  });

  if (!team?.groupCode) {
    notFound();
  }

  const groupTeams = await prisma.team.findMany({
    where: {
      groupCode: team.groupCode,
    },
    select: {
      id: true,
      name: true,
      flagUrl: true,
      groupCode: true,
    },
    orderBy: {
      name: "asc",
    },
  });
  const matches = await prisma.match.findMany({
    where: {
      round: {
        name: "Fase de grupos",
      },
      OR: [{ homeTeamId: team.id }, { awayTeamId: team.id }],
    },
    select: {
      id: true,
      homeTeamId: true,
      awayTeamId: true,
      startsAt: true,
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
  });
  const matchesByRivalId = new Map(
    matches.map((match) => {
      const rival = match.homeTeamId === team.id ? match.awayTeam : match.homeTeam;

      return [rival.id, { rival, match }] as const;
    }),
  );
  const rivals = groupTeams
    .filter((rival) => rival.id !== team.id)
    .map((rival) => matchesByRivalId.get(rival.id))
    .filter((entry): entry is NonNullable<typeof entry> => Boolean(entry));
  const starNumber = getStarPlayerNumber(team.name);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={`Grupo ${team.groupCode}`}
        title={team.name}
        description={`${guide.confederation} · Guía rápida de selección`}
        action={<BackLink href="/mundial/equipos" />}
      />

      <ColorfulCard colors={guide.colors}>
        <CardContent className="relative space-y-5 p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <Badge className="border-white/30 bg-white/18 text-white">Jugador a seguir</Badge>
              <h2 className="mt-3 font-display text-3xl font-bold">{guide.starPlayer}</h2>
            </div>
            <div className="relative flex size-20 shrink-0 items-center justify-center rounded-3xl bg-white/18 shadow-xl backdrop-blur">
              <Shirt
                className="size-16"
                strokeWidth={1.7}
                style={{
                  color: guide.colors[1],
                  fill: guide.colors[0],
                }}
              />
              <span className="absolute mt-2 text-lg font-black text-white drop-shadow">
                {starNumber}
              </span>
            </div>
          </div>
        </CardContent>
      </ColorfulCard>

      <ColorfulCard colors={guide.colors}>
        <CardContent className="space-y-3 p-6">
          <Badge className="border-white/30 bg-white/18 text-white">Objetivo</Badge>
          <p className="text-sm font-semibold text-white/88">{guide.expectation}</p>
        </CardContent>
      </ColorfulCard>

      <div className="grid gap-3 sm:grid-cols-2">
        <ColorfulCard colors={guide.colors}>
          <CardContent className="space-y-3 p-6 text-sm font-semibold text-white/88">
            <Badge className="border-white/30 bg-white/18 text-white">Cómo juega</Badge>
            <p>{guide.style}</p>
            <p className="text-white">{guide.watchFor}</p>
          </CardContent>
        </ColorfulCard>

        <ColorfulCard colors={guide.colors}>
          <CardContent className="space-y-3 p-6">
            <Badge className="border-white/30 bg-white/18 text-white">Rivales</Badge>
            {rivals.map(({ rival, match }) => (
              <div
                key={rival.id}
                className="min-w-0 rounded-2xl border border-white/24 bg-white/18 px-3 py-3 text-sm font-bold text-white backdrop-blur"
              >
                <div className="flex min-w-0 items-center justify-between gap-3">
                  <TeamFlagName team={rival} />
                  <span className="shrink-0 text-xs font-semibold text-white/78">
                    <LocalizedDateTime value={match.startsAt} />
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </ColorfulCard>
      </div>
    </div>
  );
}
