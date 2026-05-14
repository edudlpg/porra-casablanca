import { FeedbackBanner } from "@/components/layout/feedback-banner";
import { BackLink } from "@/components/layout/back-link";
import { PageHeader } from "@/components/layout/page-header";
import { RoundForm } from "@/components/admin/round-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { saveRoundAction } from "@/app/admin/actions";

type SearchParams = Promise<{ error?: string; success?: string }>;

export default async function AdminRoundsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const query = await searchParams;
  const rounds = await prisma.round.findMany({
    orderBy: {
      startDate: "asc",
    },
  });

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Admin"
        title="🗓️ Jornadas"
        description="Crea o edita jornadas con un flujo rápido pensado para móvil."
        action={<BackLink href="/admin" />}
      />

      {query.error ? <FeedbackBanner type="error" message={query.error} /> : null}
      {query.success ? <FeedbackBanner type="success" message={query.success} /> : null}

      <Card>
        <CardHeader>
          <CardTitle>Nueva jornada</CardTitle>
        </CardHeader>
        <CardContent>
          <RoundForm action={saveRoundAction} />
        </CardContent>
      </Card>

      <div className="space-y-4">
        {rounds.map((round) => (
          <Card key={round.id}>
            <CardHeader>
              <CardTitle>{round.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <RoundForm
                action={saveRoundAction}
                defaultValues={{
                  id: round.id,
                  name: round.name,
                  unlockAt: round.unlockAt,
                  startDate: round.startDate,
                  endDate: round.endDate,
                }}
              />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
