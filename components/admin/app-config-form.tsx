import { SubmitButton } from "@/components/layout/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type AppConfigFormProps = {
  action: (formData: FormData) => void;
  defaultEntryFee?: number;
};

export function AppConfigForm({ action, defaultEntryFee = 0 }: AppConfigFormProps) {
  return (
    <form action={action} className="space-y-3">
      <div className="space-y-2">
        <Label htmlFor="entry-fee">Participación por jugador (€)</Label>
        <Input
          id="entry-fee"
          name="entryFee"
          type="number"
          min={0}
          step={1}
          defaultValue={defaultEntryFee}
        />
      </div>

      <SubmitButton size="sm" pendingLabel="Guardando...">
        Guardar participación
      </SubmitButton>
    </form>
  );
}
