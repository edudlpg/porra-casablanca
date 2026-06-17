import { notFound } from "next/navigation";

import { BackLink } from "@/components/layout/back-link";
import { FeedbackBanner } from "@/components/layout/feedback-banner";
import { LocalizedDateTime } from "@/components/layout/localized-date-time";
import { EmptyState } from "@/components/layout/empty-state";
import { PageHeader } from "@/components/layout/page-header";
import { MatchDayNavigator } from "@/components/matches/match-day-navigator";
import { MatchCard } from "@/components/matches/match-card";
import { PredictionForm } from "@/components/predictions/prediction-form";
import { Badge } from "@/components/ui/badge";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatMatchVenue } from "@/lib/venues";
import {
  cn,
  formatDateParam,
  getDateParamRange,
  isRoundPredictionWindow,
  isMatchEditable,
  normalizeDateParam,
} from "@/lib/utils";
import { savePredictionAction } from "@/app/(dashboard)/jornadas/actions";
import type { MatchPredictionResultGroup } from "@/types";

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
type SearchParams = Promise<{ date?: string; error?: string; success?: string }>;

type PredictionForResultGroup = {
  predictedHomeScore: number;
  predictedAwayScore: number;
  user: {
    name: string;
    username: string | null;
    teamName: string | null;
  };
};

function getParticipantName(prediction: PredictionForResultGroup) {
  return prediction.user.teamName ?? prediction.user.username ?? prediction.user.name;
}

function buildPredictionResultGroups(
  predictions: PredictionForResultGroup[],
): MatchPredictionResultGroup[] {
  const groups = new Map<
    string,
    {
      homeScore: number;
      awayScore: number;
      participantNames: string[];
    }
  >();

  for (const prediction of predictions) {
    const score = `${prediction.predictedHomeScore}-${prediction.predictedAwayScore}`;
    const existingGroup = groups.get(score);

    if (existingGroup) {
      existingGroup.participantNames.push(getParticipantName(prediction));
      continue;
    }

    groups.set(score, {
      homeScore: prediction.predictedHomeScore,
      awayScore: prediction.predictedAwayScore,
      participantNames: [getParticipantName(prediction)],
    });
  }

  return Array.from(groups.entries())
    .map(([score, group]) => ({
      score,
      participantNames: group.participantNames.sort((firstName, secondName) =>
        firstName.localeCompare(secondName, "es"),
      ),
      homeScore: group.homeScore,
      awayScore: group.awayScore,
    }))
    .sort((firstGroup, secondGroup) => {
      const getOutcomeRank = (homeScore: number, awayScore: number) => {
        if (homeScore > awayScore) {
          return 0;
        }

        if (homeScore === awayScore) {
          return 1;
        }

        return 2;
      };

      const firstOutcomeRank = getOutcomeRank(firstGroup.homeScore, firstGroup.awayScore);
      const secondOutcomeRank = getOutcomeRank(secondGroup.homeScore, secondGroup.awayScore);

      if (firstOutcomeRank !== secondOutcomeRank) {
        return firstOutcomeRank - secondOutcomeRank;
      }

      if (firstOutcomeRank === 0) {
        return (
          secondGroup.homeScore - secondGroup.awayScore -
          (firstGroup.homeScore - firstGroup.awayScore)
        );
      }

      if (firstOutcomeRank === 1) {
        return secondGroup.homeScore - firstGroup.homeScore;
      }

      return (
        firstGroup.awayScore - firstGroup.homeScore -
        (secondGroup.awayScore - secondGroup.homeScore)
      );
    })
    .map(({ score, participantNames }) => ({
      score,
      participantNames,
    }));
}

function PredictionSummary({
  currentPrediction,
  hasResult,
  unlockAt,
  reserveResultButtonSpace = false,
}: {
  currentPrediction?: {
    predictedHomeScore: number;
    predictedAwayScore: number;
    points: number;
    scoreType: string;
  };
  hasResult: boolean;
  unlockAt: Date;
  reserveResultButtonSpace?: boolean;
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
      <div className={cn("flex flex-wrap gap-2", reserveResultButtonSpace && "pr-36")}>
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

  const firstRoundMatch = await prisma.match.findFirst({
    where: { roundId },
    select: {
      startsAt: true,
    },
    orderBy: {
      startsAt: "asc",
    },
  });
  const todayDate = formatDateParam();
  const firstRoundMatchDate = firstRoundMatch
    ? formatDateParam(firstRoundMatch.startsAt)
    : null;
  const defaultSelectedDate =
    firstRoundMatchDate && todayDate < firstRoundMatchDate ? firstRoundMatchDate : todayDate;
  const selectedDate = query.date ?? defaultSelectedDate;
  const selectedDateRange = getDateParamRange(normalizeDateParam(selectedDate));

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
        where: {
          startsAt: {
            gte: selectedDateRange.start,
            lt: selectedDateRange.end,
          },
        },
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
              user: {
                select: {
                  name: true,
                  username: true,
                  teamName: true,
                },
              },
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

  const now = new Date();
  const currentRound = await prisma.round.findFirst({
    where: {
      unlockAt: {
        lte: now,
      },
      startDate: {
        gt: now,
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

      <MatchDayNavigator
        basePath={`/jornadas/${round.id}`}
        selectedDate={normalizeDateParam(selectedDate)}
      />

      {round.matches.length > 0 ? (
        <div className="space-y-4">
          {round.matches.map((match, index) => {
            const effectiveMatch = isCurrentRound ? match : { ...match, isLocked: true };
            const currentPrediction = match.predictions.find(
              (prediction) => prediction.userId === session.user.id,
            );
            const hasResult = match.homeScore !== null && match.awayScore !== null;
            const canRevealPredictionResults =
              effectiveMatch.isLocked && (match.round.startDate <= now || hasResult);
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
                hasSavedPrediction={Boolean(currentPrediction)}
                subtitle={formatMatchVenue(match)}
                mediaLoading={index === 0 ? "eager" : "lazy"}
                predictionResultGroups={
                  canRevealPredictionResults
                    ? buildPredictionResultGroups(match.predictions)
                    : undefined
                }
                scoreLabel={
                  currentPrediction && editable
                    ? `Tu porra: ${currentPrediction.predictedHomeScore}-${currentPrediction.predictedAwayScore}`
                    : undefined
                }
              >
                {editable ? (
                  <PredictionForm
                    action={savePredictionAction}
                    match={effectiveMatch}
                    roundId={round.id}
                    currentPrediction={currentPrediction}
                  />
                ) : (
                  <PredictionSummary
                    currentPrediction={currentPrediction}
                    hasResult={hasResult}
                    unlockAt={match.round.unlockAt}
                    reserveResultButtonSpace={canRevealPredictionResults}
                  />
                )}
              </MatchCard>
            );
          })}
        </div>
      ) : (
        <EmptyState
          title="No hay partidos este día"
          description="Usa las flechas de fecha para moverte al día anterior o siguiente de esta fase."
        />
      )}
    </div>
  );
}
