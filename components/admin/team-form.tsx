import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SubmitButton } from "@/components/layout/submit-button";

type TeamFormProps = {
  action: (formData: FormData) => void;
};

export function TeamForm({ action }: TeamFormProps) {
  return (
    <form action={action} className="space-y-3">
      <div className="space-y-2">
        <Label htmlFor="team-name">Equipo</Label>
        <Input id="team-name" name="name" placeholder="España" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="team-flag">Bandera URL opcional</Label>
        <Input id="team-flag" name="flagUrl" placeholder="https://..." />
      </div>
      <SubmitButton size="sm" pendingLabel="Creando...">
        Crear equipo
      </SubmitButton>
    </form>
  );
}
