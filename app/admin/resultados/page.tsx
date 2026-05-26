import { ResultForm } from "@/components/admin/result-form";
import { BackLink } from "@/components/layout/back-link";
import { FeedbackBanner } from "@/components/layout/feedback-banner";
import { LocalizedDateTime } from "@/components/layout/localized-date-time";
import { PageHeader } from "@/components/layout/page-header";
import { SubmitButton } from "@/components/layout/submit-button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { recalculateScoresAction, saveResultAction } from "@/app/admin/actions";

type SearchParams = Promise<{ error?: string; success?: string }>;

export default async function AdminResultsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const query = await searchParams;
  const matches = await prisma.match.findMany({
    include: {
      round: true,
      homeTeam: true,
      awayTeam: true,
      predictions: true,
    },
    orderBy: {
      startsAt: "asc",
    },
  });

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Admin"
        title="Resultados"
        description="Introduce marcadores reales, bloquea partidos y recalcula puntos cuando lo necesites."
        action={
          <div className="flex flex-wrap justify-end gap-2">
            <BackLink href="/admin" />
            <form action={recalculateScoresAction}>
              <SubmitButton size="sm" pendingLabel="Recalculando...">
                Recalcular
              </SubmitButton>
            </form>
          </div>
        }
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
                <Badge variant={match.homeScore !== null ? "success" : "secondary"}>
                  {match.predictions.length} porras
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <ResultForm action={saveResultAction} match={match} />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
