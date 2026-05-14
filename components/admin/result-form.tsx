import { BroadcastSwitch } from "@/components/admin/broadcast-switch";
import type { MatchWithRelations } from "@/types";
import { SubmitButton } from "@/components/layout/submit-button";
import { TeamBadge } from "@/components/teams/team-badge";
import { ScoreStepper } from "@/components/ui/score-stepper";

type ResultFormProps = {
  action: (formData: FormData) => void;
  match: MatchWithRelations;
};

export function ResultForm({ action, match }: ResultFormProps) {
  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="matchId" value={match.id} />

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
