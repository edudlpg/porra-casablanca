import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SubmitButton } from "@/components/layout/submit-button";
import { formatDateForInput } from "@/lib/utils";

type RoundFormProps = {
  action: (formData: FormData) => void;
  defaultValues?: {
    id: string;
    name: string;
    unlockAt: Date;
    startDate: Date;
    endDate: Date;
  };
};

export function RoundForm({ action, defaultValues }: RoundFormProps) {
  return (
    <form action={action} className="space-y-3">
      <input type="hidden" name="id" value={defaultValues?.id ?? ""} />
      <div className="space-y-2">
        <Label htmlFor={`round-name-${defaultValues?.id ?? "new"}`}>Nombre</Label>
        <Input
          id={`round-name-${defaultValues?.id ?? "new"}`}
          name="name"
          defaultValue={defaultValues?.name ?? ""}
          placeholder="Jornada 1"
        />
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor={`round-unlock-${defaultValues?.id ?? "new"}`}>Apertura</Label>
          <Input
            id={`round-unlock-${defaultValues?.id ?? "new"}`}
            name="unlockAt"
            type="datetime-local"
            defaultValue={defaultValues?.unlockAt ? formatDateForInput(defaultValues.unlockAt) : ""}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`round-start-${defaultValues?.id ?? "new"}`}>Inicio</Label>
          <Input
            id={`round-start-${defaultValues?.id ?? "new"}`}
            name="startDate"
            type="datetime-local"
            defaultValue={
              defaultValues?.startDate ? formatDateForInput(defaultValues.startDate) : ""
            }
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`round-end-${defaultValues?.id ?? "new"}`}>Fin</Label>
          <Input
            id={`round-end-${defaultValues?.id ?? "new"}`}
            name="endDate"
            type="datetime-local"
            defaultValue={defaultValues?.endDate ? formatDateForInput(defaultValues.endDate) : ""}
          />
        </div>
      </div>
      <SubmitButton size="sm" pendingLabel="Guardando...">
        {defaultValues ? "Actualizar jornada" : "Crear jornada"}
      </SubmitButton>
    </form>
  );
}
