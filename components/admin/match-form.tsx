import type { BroadcastPartner, Round, Team } from "@prisma/client";

import { BroadcastSwitch } from "@/components/admin/broadcast-switch";
import { LocalDateTimeInput } from "@/components/admin/local-date-time-input";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SubmitButton } from "@/components/layout/submit-button";

type MatchFormProps = {
  action: (formData: FormData) => void;
  rounds: Round[];
  teams: Team[];
  defaultValues?: {
    id: string;
    roundId: string;
    homeTeamId: string;
    awayTeamId: string;
    venueName?: string | null;
    venueCity?: string | null;
    startsAt: Date;
    broadcast: BroadcastPartner;
    isLocked: boolean;
  };
};

export function MatchForm({ action, rounds, teams, defaultValues }: MatchFormProps) {
  return (
    <form action={action} className="space-y-3">
      <input type="hidden" name="id" value={defaultValues?.id ?? ""} />
      <div className="space-y-2">
        <Label htmlFor={`match-round-${defaultValues?.id ?? "new"}`}>Jornada</Label>
        <select
          id={`match-round-${defaultValues?.id ?? "new"}`}
          name="roundId"
          defaultValue={defaultValues?.roundId ?? ""}
          className="flex h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900"
        >
          <option value="">Selecciona jornada</option>
          {rounds.map((round) => (
            <option key={round.id} value={round.id}>
              {round.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor={`match-home-${defaultValues?.id ?? "new"}`}>Local</Label>
          <select
            id={`match-home-${defaultValues?.id ?? "new"}`}
            name="homeTeamId"
            defaultValue={defaultValues?.homeTeamId ?? ""}
            className="flex h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900"
          >
            <option value="">Selecciona equipo</option>
            {teams.map((team) => (
              <option key={team.id} value={team.id}>
                {team.name}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor={`match-away-${defaultValues?.id ?? "new"}`}>Visitante</Label>
          <select
            id={`match-away-${defaultValues?.id ?? "new"}`}
            name="awayTeamId"
            defaultValue={defaultValues?.awayTeamId ?? ""}
            className="flex h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900"
          >
            <option value="">Selecciona equipo</option>
            {teams.map((team) => (
              <option key={team.id} value={team.id}>
                {team.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="min-w-0 space-y-2">
        <Label htmlFor={`match-start-${defaultValues?.id ?? "new"}`}>Fecha y hora</Label>
        <LocalDateTimeInput
          id={`match-start-${defaultValues?.id ?? "new"}`}
          name="startsAt"
          defaultValue={defaultValues?.startsAt?.toISOString()}
        />
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor={`match-venue-name-${defaultValues?.id ?? "new"}`}>Estadio</Label>
          <Input
            id={`match-venue-name-${defaultValues?.id ?? "new"}`}
            name="venueName"
            defaultValue={defaultValues?.venueName ?? ""}
            placeholder="Boston Stadium"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`match-venue-city-${defaultValues?.id ?? "new"}`}>Ciudad</Label>
          <Input
            id={`match-venue-city-${defaultValues?.id ?? "new"}`}
            name="venueCity"
            defaultValue={defaultValues?.venueCity ?? ""}
            placeholder="Boston"
          />
        </div>
      </div>

      <BroadcastSwitch
        idPrefix={`match-broadcast-${defaultValues?.id ?? "new"}`}
        defaultValue={defaultValues?.broadcast ?? "DAZN"}
      />

      <label className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-700">
        <input
          type="checkbox"
          name="isLocked"
          defaultChecked={defaultValues?.isLocked ?? false}
          className="size-4 rounded border-slate-300"
        />
        Bloquear partido
      </label>

      <SubmitButton size="sm" pendingLabel="Guardando...">
        {defaultValues ? "Actualizar partido" : "Crear partido"}
      </SubmitButton>
    </form>
  );
}
