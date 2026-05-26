import { notFound } from "next/navigation";

import { BackLink } from "@/components/layout/back-link";
import { FeedbackBanner } from "@/components/layout/feedback-banner";
import { LocalizedDateTime } from "@/components/layout/localized-date-time";
import { PageHeader } from "@/components/layout/page-header";
import { MatchCard } from "@/components/matches/match-card";
import { PredictionForm } from "@/components/predictions/prediction-form";
import { Badge } from "@/components/ui/badge";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatMatchVenue } from "@/lib/venues";
import { isRoundPredictionWindow, isMatchEditable } from "@/lib/utils";
import { savePredictionAction } from "@/app/(dashboard)/jornadas/actions";

const SCORE_TYPE_LABELS = {
  EXACT: "PLENO",
  GOAL_DIFFERENCE: "DIFERENCIA",
  FINAL_RESULT: "SIMPLE",
  FAILED: "FALLO",
} as const;

const SCORE_TYPE_BADGES = {
  EXACT: {
    variant: "success" as const,
    className: undefined,
  },
  GOAL_DIFFERENCE: {
    variant: "warning" as const,
    className: "border-orange-200 bg-orange-50 text-orange-700",
  },
  FINAL_RESULT: {
    variant: "warning" as const,
    className: undefined,
  },
  FAILED: {
    variant: "danger" as const,
    className: undefined,
  },
} as const;

type Params = Promise<{ roundId: string }>;
type SearchParams = Promise<{ error?: string; success?: string }>;

function PredictionSummary({
  currentPrediction,
  hasResult,
  unlockAt,
}: {
  currentPrediction?: {
    predictedHomeScore: number;
    predictedAwayScore: number;
    points: number;
    scoreType: string;
  };
  hasResult: boolean;
  unlockAt: Date;
}) {
  const resolvedScoreType =
    currentPrediction?.scoreType && currentPrediction.scoreType !== "PENDING"
      ? SCORE_TYPE_LABELS[currentPrediction.scoreType as keyof typeof SCORE_TYPE_LABELS]
      : null;
  const resolvedScoreTypeStyle =
    currentPrediction?.scoreType && currentPrediction.scoreType !== "PENDING"
      ? SCORE_TYPE_BADGES[currentPrediction.scoreType as keyof typeof SCORE_TYPE_BADGES]
      : null;

  if (!currentPrediction && !hasResult) {
    return (
      <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-500">
        Esta fase se abrirá el <LocalizedDateTime value={unlockAt} />.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="py-1 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
          Tu porra
        </p>
        <p className="mt-1 font-display text-2xl font-bold text-slate-950">
          {currentPrediction
            ? `${currentPrediction.predictedHomeScore} - ${currentPrediction.predictedAwayScore}`
            : "Sin porra"}
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        {currentPrediction ? (
          <>
            <Badge variant="secondary">{currentPrediction.points} PTS</Badge>
            {resolvedScoreType && resolvedScoreTypeStyle ? (
              <Badge
                variant={resolvedScoreTypeStyle.variant}
                className={resolvedScoreTypeStyle.className}
              >
                {resolvedScoreType}
              </Badge>
            ) : null}
          </>
        ) : hasResult ? (
          <Badge variant="danger">FALLO</Badge>
        ) : (
          <>
            <Badge variant="secondary">Sin guardar</Badge>
            <Badge variant="warning">Cerrado</Badge>
          </>
        )}
      </div>
    </div>
  );
}

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
    select: {
      id: true,
      name: true,
      unlockAt: true,
      startDate: true,
      endDate: true,
      createdAt: true,
      matches: {
        select: {
          id: true,
          roundId: true,
          homeTeamId: true,
          awayTeamId: true,
          winnerTeamId: true,
          homeSlotLabel: true,
          awaySlotLabel: true,
          venueName: true,
          venueCity: true,
          startsAt: true,
          homeScore: true,
          awayScore: true,
          broadcast: true,
          isLocked: true,
          createdAt: true,
          round: {
            select: {
              id: true,
              name: true,
              unlockAt: true,
              startDate: true,
              endDate: true,
              createdAt: true,
            },
          },
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
          predictions: {
            where: {
              userId: session.user.id,
            },
            select: {
              id: true,
              userId: true,
              matchId: true,
              predictedHomeScore: true,
              predictedAwayScore: true,
              points: true,
              scoreType: true,
              createdAt: true,
              updatedAt: true,
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
      startDate: {
        gt: new Date(),
      },
    },
    orderBy: {
      startDate: "asc",
    },
  });
  const isCurrentRound =
    currentRound?.id === round.id && isRoundPredictionWindow(round.unlockAt, round.startDate);

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
        {round.matches.map((match, index) => {
          const effectiveMatch = isCurrentRound ? match : { ...match, isLocked: true };
          const editable = isMatchEditable(
            match.startsAt,
            effectiveMatch.isLocked,
            match.round.unlockAt,
            match.round.startDate,
          );

          return (
            <MatchCard
              key={match.id}
              match={effectiveMatch}
              hasSavedPrediction={Boolean(match.predictions[0])}
              subtitle={formatMatchVenue(match)}
              mediaLoading={index === 0 ? "eager" : "lazy"}
              scoreLabel={
                match.predictions[0] && editable
                  ? `Tu porra: ${match.predictions[0].predictedHomeScore}-${match.predictions[0].predictedAwayScore}`
                  : undefined
              }
            >
              {editable ? (
                <PredictionForm
                  action={savePredictionAction}
                  match={effectiveMatch}
                  roundId={round.id}
                  currentPrediction={match.predictions[0]}
                />
              ) : (
                <PredictionSummary
                  currentPrediction={match.predictions[0]}
                  hasResult={match.homeScore !== null && match.awayScore !== null}
                  unlockAt={match.round.unlockAt}
                />
              )}
            </MatchCard>
          );
        })}
      </div>
    </div>
  );
}
