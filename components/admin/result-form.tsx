"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, CheckCircle2 } from "lucide-react";

import { BroadcastSwitch } from "@/components/admin/broadcast-switch";
import type { MatchWithRelations } from "@/types";
import { SubmitButton } from "@/components/layout/submit-button";
import { TeamBadge } from "@/components/teams/team-badge";
import { ScoreStepper } from "@/components/ui/score-stepper";
import { initialResultActionState, type ResultActionState } from "@/lib/result-action-state";
import { cn } from "@/lib/utils";

type ResultFormProps = {
  action: (
    previousState: ResultActionState,
    formData: FormData,
  ) => Promise<ResultActionState>;
  match: MatchWithRelations;
};

export function ResultForm({ action, match }: ResultFormProps) {
  const router = useRouter();
  const [state, formAction] = useActionState(action, initialResultActionState);
  const isKnockoutMatch = match.round.name !== "Fase de grupos";
  const defaultWinnerTeamId =
    match.winnerTeamId ??
    (match.homeScore !== null && match.awayScore !== null
      ? match.homeScore > match.awayScore
        ? match.homeTeamId
        : match.homeScore < match.awayScore
          ? match.awayTeamId
          : null
      : null);

  useEffect(() => {
    if (state.type === "success") {
      router.refresh();
    }
  }, [router, state.submittedAt, state.type]);

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="matchId" value={match.id} />

      {state.type !== "idle" ? (
        <div
          key={state.submittedAt}
          className="pointer-events-none fixed inset-x-0 top-4 z-50 flex justify-center px-4"
        >
          <div
            className={cn(
              "prediction-feedback-toast flex w-full max-w-sm items-center gap-3 rounded-2xl border px-4 py-3 text-sm font-bold shadow-[0_18px_50px_-24px_rgba(15,23,42,0.45)] backdrop-blur-md",
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
        </div>
      ) : null}

      <div className="py-1 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
          Marcador final
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:gap-3">
        <div className="space-y-2">
          <div className="flex justify-center">
            <TeamBadge team={match.homeTeam} layout="stacked" />
          </div>
          <ScoreStepper
            id={`result-home-${match.id}`}
            name="homeScore"
            label={match.homeTeam.name}
            initialValue={match.homeScore}
            hideLabel
          />
        </div>
        <div className="space-y-2">
          <div className="flex justify-center">
            <TeamBadge team={match.awayTeam} layout="stacked" />
          </div>
          <ScoreStepper
            id={`result-away-${match.id}`}
            name="awayScore"
            label={match.awayTeam.name}
            initialValue={match.awayScore}
            hideLabel
          />
        </div>
      </div>

      <BroadcastSwitch
        idPrefix={`result-broadcast-${match.id}`}
        defaultValue={match.broadcast}
      />

      {isKnockoutMatch ? (
        <fieldset className="space-y-3 rounded-2xl bg-slate-50 px-4 py-4">
          <div>
            <p className="text-sm font-semibold text-slate-900">Equipo que avanza</p>
            <p className="text-xs text-slate-500">
              Si el marcador acaba en empate, marca aquí quién pasa de ronda.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-700">
              <input
                type="radio"
                name="winnerTeamId"
                value={match.homeTeamId}
                defaultChecked={defaultWinnerTeamId === match.homeTeamId}
                className="size-4 border-slate-300"
              />
              <span className="font-medium text-slate-900">{match.homeTeam.name}</span>
            </label>
            <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-700">
              <input
                type="radio"
                name="winnerTeamId"
                value={match.awayTeamId}
                defaultChecked={defaultWinnerTeamId === match.awayTeamId}
                className="size-4 border-slate-300"
              />
              <span className="font-medium text-slate-900">{match.awayTeam.name}</span>
            </label>
          </div>
        </fieldset>
      ) : null}

      <label className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-700">
        <input
          type="checkbox"
          name="isLocked"
          defaultChecked={match.isLocked}
          className="size-4 rounded border-slate-300"
        />
        Bloquear partido tras guardar
      </label>

      <SubmitButton size="sm" pendingLabel="Guardando...">
        Guardar resultado
      </SubmitButton>
    </form>
  );
}
