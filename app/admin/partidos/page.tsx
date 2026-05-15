import { FeedbackBanner } from "@/components/layout/feedback-banner";
import { BackLink } from "@/components/layout/back-link";
import { LocalizedDateTime } from "@/components/layout/localized-date-time";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { MatchForm } from "@/components/admin/match-form";
import { saveMatchAction } from "@/app/admin/actions";

type SearchParams = Promise<{ error?: string; success?: string }>;

export default async function AdminMatchesPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const query = await searchParams;
  const [rounds, teams, matches] = await Promise.all([
    prisma.round.findMany({ orderBy: { startDate: "asc" } }),
    prisma.team.findMany({ orderBy: { name: "asc" } }),
    prisma.match.findMany({
      include: {
        round: true,
        homeTeam: true,
        awayTeam: true,
      },
      orderBy: { startsAt: "asc" },
    }),
  ]);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Admin"
        title="⚽ Partidos"
        description="Edita los partidos ya cargados desde una única pantalla simple."
        action={<BackLink href="/admin" />}
      />

      {query.error ? <FeedbackBanner type="error" message={query.error} /> : null}
      {query.success ? <FeedbackBanner type="success" message={query.success} /> : null}

      <div className="space-y-4">
        {matches.map((match) => (
          <Card key={match.id}>
            <CardHeader>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <CardTitle>
                    {match.homeTeam.name} vs {match.awayTeam.name}
                  </CardTitle>
                  <p className="mt-1 text-sm text-slate-500">
                    {match.round.name} · <LocalizedDateTime value={match.startsAt} />
                  </p>
                </div>
                <Badge variant={match.isLocked ? "warning" : "secondary"}>
                  {match.isLocked ? "Bloqueado" : "Abierto"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <MatchForm
                action={saveMatchAction}
                rounds={rounds}
                teams={teams}
                defaultValues={{
                  id: match.id,
                  roundId: match.roundId,
                  homeTeamId: match.homeTeamId,
                  awayTeamId: match.awayTeamId,
                  venueName: match.venueName,
                  venueCity: match.venueCity,
                  startsAt: match.startsAt,
                  broadcast: match.broadcast,
                  isLocked: match.isLocked,
                }}
              />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
