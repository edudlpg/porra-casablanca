import { notFound } from "next/navigation";

import { BackLink } from "@/components/layout/back-link";
import { FeedbackBanner } from "@/components/layout/feedback-banner";
import { PageHeader } from "@/components/layout/page-header";
import { MatchCard } from "@/components/matches/match-card";
import { PredictionForm } from "@/components/predictions/prediction-form";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatMatchVenue } from "@/lib/venues";
import { isRoundInWindow, isMatchEditable } from "@/lib/utils";
import { savePredictionAction } from "@/app/(dashboard)/jornadas/actions";

type Params = Promise<{ roundId: string }>;
type SearchParams = Promise<{ error?: string; success?: string }>;

export default async function RoundDetailPage({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: SearchParams;
}) {
  const { roundId } = await params;
  const query = await searchParams;
  const session = await auth();

  if (!session?.user) {
    return null;
  }

  const round = await prisma.round.findUnique({
    where: { id: roundId },
    include: {
      matches: {
        include: {
          round: true,
          homeTeam: true,
          awayTeam: true,
          predictions: {
            where: {
              userId: session.user.id,
            },
          },
        },
        orderBy: {
          startsAt: "asc",
        },
      },
    },
  });

  if (!round) {
    notFound();
  }

  const currentRound = await prisma.round.findFirst({
    where: {
      unlockAt: {
        lte: new Date(),
      },
      endDate: {
        gte: new Date(),
      },
    },
    orderBy: {
      startDate: "asc",
    },
  });
  const isCurrentRound = currentRound?.id === round.id && isRoundInWindow(round.unlockAt, round.endDate);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Predicciones"
        title={round.name}
        description="Introduce tus marcadores antes del cierre de cada partido. Podrás editar el resultado hasta el inicio de cada fase. Después se bloquearán."
        action={<BackLink href="/jornadas" />}
      />

      {query.error ? <FeedbackBanner type="error" message={query.error} /> : null}
      {query.success ? <FeedbackBanner type="success" message={query.success} /> : null}

      <div className="space-y-4">
        {round.matches.map((match) => (
          <MatchCard
            key={match.id}
            match={isCurrentRound ? match : { ...match, isLocked: true }}
            hasSavedPrediction={Boolean(match.predictions[0])}
            subtitle={formatMatchVenue(match)}
            scoreLabel={
              match.predictions[0] &&
              isCurrentRound &&
              isMatchEditable(match.startsAt, match.isLocked, match.round.unlockAt, match.round.endDate)
                ? `Tu porra: ${match.predictions[0].predictedHomeScore}-${match.predictions[0].predictedAwayScore}`
                : undefined
            }
          >
            <PredictionForm
              action={savePredictionAction}
              match={isCurrentRound ? match : { ...match, isLocked: true }}
              roundId={round.id}
              currentPrediction={match.predictions[0]}
            />
          </MatchCard>
        ))}
      </div>
    </div>
  );
}
