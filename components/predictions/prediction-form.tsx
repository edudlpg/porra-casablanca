"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, CheckCircle2 } from "lucide-react";

import { LocalizedDateTime } from "@/components/layout/localized-date-time";
import { Badge } from "@/components/ui/badge";
import { SubmitButton } from "@/components/layout/submit-button";
import { ScoreStepper } from "@/components/ui/score-stepper";
import {
  initialPredictionActionState,
  type PredictionActionState,
} from "@/lib/prediction-action-state";
import { cn } from "@/lib/utils";
import { isMatchEditable, isRoundOpen } from "@/lib/utils";
import type { MatchWithRelations } from "@/types";

const SCORE_TYPE_LABELS = {
  EXACT: "PLENO",
  GOAL_DIFFERENCE: "DIFERENCIA",
  FINAL_RESULT: "SIMPLE",
  FAILED: "FALLO",
} as const;

const SCORE_TYPE_STYLES = {
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

type PredictionFormProps = {
  action: (
    previousState: PredictionActionState,
    formData: FormData,
  ) => Promise<PredictionActionState>;
  match: MatchWithRelations;
  roundId: string;
  currentPrediction?: {
    predictedHomeScore: number;
    predictedAwayScore: number;
    points: number;
    scoreType: string;
  };
};

export function PredictionForm({
  action,
  match,
  roundId,
  currentPrediction,
}: PredictionFormProps) {
  const router = useRouter();
  const [state, formAction] = useActionState(action, initialPredictionActionState);
  const editable = isMatchEditable(match.startsAt, match.isLocked, match.round.unlockAt);
  const roundOpen = isRoundOpen(match.round.unlockAt);
  const hasResult = match.homeScore !== null && match.awayScore !== null;
  const [homeScore, setHomeScore] = useState(currentPrediction?.predictedHomeScore ?? 0);
  const [awayScore, setAwayScore] = useState(currentPrediction?.predictedAwayScore ?? 0);
  const matchesSavedPrediction =
    currentPrediction !== undefined &&
    homeScore === currentPrediction.predictedHomeScore &&
    awayScore === currentPrediction.predictedAwayScore;
  const resolvedScoreType =
    currentPrediction?.scoreType && currentPrediction.scoreType !== "PENDING"
      ? SCORE_TYPE_LABELS[currentPrediction.scoreType as keyof typeof SCORE_TYPE_LABELS]
      : null;
  const resolvedScoreTypeStyle =
    currentPrediction?.scoreType && currentPrediction.scoreType !== "PENDING"
      ? SCORE_TYPE_STYLES[currentPrediction.scoreType as keyof typeof SCORE_TYPE_STYLES]
      : null;
  const showPastPredictionSummary = !editable;

  useEffect(() => {
    if (state.type === "success") {
      router.refresh();
    }
  }, [router, state.submittedAt, state.type]);

  if (!editable && !currentPrediction && !roundOpen) {
    return (
      <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-500">
        Esta fase se abrirá el <LocalizedDateTime value={match.round.unlockAt} />.
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="matchId" value={match.id} />
      <input type="hidden" name="roundId" value={roundId} />

      {state.type !== "idle" ? (
        <div
          key={state.submittedAt}
          className={cn(
            "prediction-feedback-toast pointer-events-none fixed left-1/2 top-4 z-50 flex w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 items-center gap-3 rounded-2xl border px-4 py-3 text-sm font-bold shadow-[0_18px_50px_-24px_rgba(15,23,42,0.45)] backdrop-blur-md",
            state.type === "success"
              ? "border-emerald-200 bg-emerald-50/95 text-emerald-800"
              : "border-rose-200 bg-rose-50/95 text-rose-800",
          )}
          role="status"
          aria-live="polite"
        >
          {state.type === "success" ? (
            <CheckCircle2 className="size-4 shrink-0" />
          ) : (
            <AlertCircle className="size-4 shrink-0" />
          )}
          <span>{state.message}</span>
        </div>
      ) : null}

      {showPastPredictionSummary ? (
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
      ) : (
        <div className="grid grid-cols-2 gap-2 sm:gap-3">
          <ScoreStepper
            id={`home-${match.id}`}
            name="predictedHomeScore"
            label={match.homeTeam.name}
            initialValue={currentPrediction?.predictedHomeScore}
            disabled={!editable}
            hideLabel
            onValueChange={setHomeScore}
          />
          <ScoreStepper
            id={`away-${match.id}`}
            name="predictedAwayScore"
            label={match.awayTeam.name}
            initialValue={currentPrediction?.predictedAwayScore}
            disabled={!editable}
            hideLabel
            onValueChange={setAwayScore}
          />
        </div>
      )}

      <div className="flex items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {editable ? (
            currentPrediction ? (
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-emerald-700">
                <span className="size-1.5 rounded-full bg-emerald-500" aria-hidden="true" />
                Guardada
              </div>
            ) : (
              <Badge variant="secondary">Sin guardar</Badge>
            )
          ) : (
            <>
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
            </>
          )}
        </div>
        {editable ? (
          <SubmitButton
            size="sm"
            pendingLabel="Guardando..."
            disabled={matchesSavedPrediction}
            className={cn(
              matchesSavedPrediction &&
                "bg-slate-200 text-slate-500 shadow-none hover:bg-slate-200",
            )}
          >
            Guardar
          </SubmitButton>
        ) : null}
      </div>
    </form>
  );
}
