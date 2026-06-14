"use client";

import { useState } from "react";
import { Lock } from "lucide-react";

import { CardCornerGraphic } from "@/components/ui/card-corner-graphic";
import { BroadcastBadge } from "@/components/matches/broadcast-badge";
import { LocalizedDateTime } from "@/components/layout/localized-date-time";
import { TeamBadge } from "@/components/teams/team-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { MatchPredictionResultGroup, MatchWithRelations } from "@/types";

type MatchCardProps = {
  match: MatchWithRelations;
  children?: React.ReactNode;
  scoreLabel?: string;
  hasSavedPrediction?: boolean;
  subtitle?: string;
  mediaLoading?: "eager" | "lazy";
  predictionResultGroups?: MatchPredictionResultGroup[];
};

function getPredictionResultStyle(
  score: string,
  homeScore: number | null,
  awayScore: number | null,
) {
  if (homeScore === null || awayScore === null) {
    return {
      cardClassName: "bg-slate-50",
      label: null,
      badgeClassName: "",
    };
  }

  const [predictedHomeScore, predictedAwayScore] = score.split("-").map(Number);

  if (Number.isNaN(predictedHomeScore) || Number.isNaN(predictedAwayScore)) {
    return {
      cardClassName: "bg-slate-50",
      label: null,
      badgeClassName: "",
    };
  }

  if (predictedHomeScore === homeScore && predictedAwayScore === awayScore) {
    return {
      cardClassName:
        "border-amber-300 bg-amber-50 shadow-[0_12px_28px_-22px_rgba(180,83,9,0.8)]",
      label: "Pleno",
      badgeClassName: "border-amber-300 bg-amber-100 text-amber-800",
    };
  }

  const actualDiff = homeScore - awayScore;
  const predictedDiff = predictedHomeScore - predictedAwayScore;

  if (actualDiff === predictedDiff) {
    return {
      cardClassName:
        "border-slate-300 bg-slate-100 shadow-[0_12px_28px_-22px_rgba(71,85,105,0.65)]",
      label: "Diferencia",
      badgeClassName: "border-slate-300 bg-slate-200 text-slate-700",
    };
  }

  const actualSign = Math.sign(actualDiff);
  const predictedSign = Math.sign(predictedDiff);

  if (actualSign === predictedSign) {
    return {
      cardClassName:
        "border-orange-300 bg-orange-50 shadow-[0_12px_28px_-22px_rgba(154,52,18,0.7)]",
      label: "Simple",
      badgeClassName: "border-orange-300 bg-orange-100 text-orange-800",
    };
  }

  return {
    cardClassName: "border-rose-200 bg-rose-50",
    label: "Fallo",
    badgeClassName: "border-rose-200 bg-rose-100 text-rose-700",
  };
}

export function MatchCard({
  match,
  children,
  scoreLabel,
  hasSavedPrediction = false,
  subtitle,
  mediaLoading = "lazy",
  predictionResultGroups,
}: MatchCardProps) {
  const [showPredictionResults, setShowPredictionResults] = useState(false);
  const hasResult = match.homeScore !== null && match.awayScore !== null;
  const canShowPredictionResults = match.isLocked && predictionResultGroups !== undefined;
  const hasPredictionResultGroups = Boolean(predictionResultGroups?.length);

  const cardClassName = cn(
    "overflow-hidden transition-colors",
    hasSavedPrediction && "border-emerald-200/80",
  );

  const frontCard = (
    <Card
      className={cn(
        cardClassName,
        canShowPredictionResults && "[backface-visibility:hidden]",
      )}
    >
      <CardCornerGraphic variant="match" />
      <CardContent className="relative z-10 space-y-4 p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              <LocalizedDateTime value={match.startsAt} />
            </p>
            <p className="mt-1 text-sm text-slate-500">{subtitle ?? match.round.name}</p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <BroadcastBadge broadcast={match.broadcast} imageLoading={mediaLoading} />
            <div className="flex items-center gap-2">
              {match.isLocked && !hasResult ? (
                <Badge variant="warning">
                  <Lock className="mr-1 size-3" />
                  Bloqueado
                </Badge>
              ) : null}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 text-center">
          <div className="rounded-[22px] border border-white/70 bg-white/70 px-3 py-4 shadow-[0_10px_26px_-18px_rgba(15,23,42,0.45)] backdrop-blur-[2px]">
            <TeamBadge team={match.homeTeam} layout="stacked" imageLoading={mediaLoading} />
          </div>
          <div className="min-w-[6.5rem] space-y-1">
            <p className="text-center font-display text-2xl font-bold text-slate-950">
              {hasResult ? `${match.homeScore} - ${match.awayScore}` : "vs"}
            </p>
            {scoreLabel ? <p className="text-center text-xs font-medium text-slate-500">{scoreLabel}</p> : null}
          </div>
          <div className="rounded-[22px] border border-white/70 bg-white/70 px-3 py-4 shadow-[0_10px_26px_-18px_rgba(15,23,42,0.45)] backdrop-blur-[2px]">
            <TeamBadge team={match.awayTeam} layout="stacked" imageLoading={mediaLoading} />
          </div>
        </div>

        <div className="relative">
          {children}

          {canShowPredictionResults ? (
            <div className="absolute bottom-0 right-0 z-10">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                className="h-auto rounded-full px-4 py-1.5 text-xs leading-4"
                onClick={() => setShowPredictionResults(true)}
              >
                Ver resultados
              </Button>
            </div>
          ) : null}
        </div>

      </CardContent>
    </Card>
  );

  if (!canShowPredictionResults) {
    return frontCard;
  }

  return (
    <div className="relative [perspective:1200px]">
      <div
        className={cn(
          "relative transition-transform duration-500 [transform-style:preserve-3d]",
          showPredictionResults && "[transform:rotateY(180deg)]",
        )}
      >
        {frontCard}

        <Card
          className={cn(
            cardClassName,
            "absolute inset-0 h-full [backface-visibility:hidden] [transform:rotateY(180deg)]",
          )}
        >
          <CardCornerGraphic variant="match" />
          <CardContent className="relative z-10 flex h-full flex-col p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                  Porra del partido
                </p>
                <p className="mt-1 text-sm font-semibold text-slate-950">
                  {match.homeTeam.name} vs {match.awayTeam.name}
                </p>
              </div>
              <Badge variant={hasPredictionResultGroups ? "secondary" : "warning"}>
                {predictionResultGroups?.reduce(
                  (total, group) => total + group.participantNames.length,
                  0,
                ) ?? 0}{" "}
                porras
              </Badge>
            </div>

            {hasPredictionResultGroups ? (
              <div className="mt-4 min-h-0 flex-1 space-y-3 overflow-y-auto pr-1">
                {predictionResultGroups?.map((group) => {
                  const resultStyle = getPredictionResultStyle(
                    group.score,
                    match.homeScore,
                    match.awayScore,
                  );

                  return (
                    <div
                      key={group.score}
                      className={cn(
                        "rounded-2xl border border-transparent p-3",
                        resultStyle.cardClassName,
                      )}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-display text-xl font-bold text-slate-950">
                            {group.score}
                          </p>
                          {resultStyle.label ? (
                            <span
                              className={cn(
                                "rounded-full border px-2 py-0.5 text-[0.66rem] font-bold uppercase tracking-[0.13em]",
                                resultStyle.badgeClassName,
                              )}
                            >
                              {resultStyle.label}
                            </span>
                          ) : null}
                        </div>
                        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
                          {group.participantNames.length}
                        </p>
                      </div>
                      <p className="mt-2 text-sm font-medium leading-relaxed text-slate-600">
                        {group.participantNames.join(", ")}
                      </p>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="mt-4 rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-500">
                Nadie guardó porra para este partido.
              </div>
            )}

            <div className="mt-4 flex justify-end">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => setShowPredictionResults(false)}
              >
                Volver al partido
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
