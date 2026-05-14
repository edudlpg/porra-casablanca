import { SubmitButton } from "@/components/layout/submit-button";
import { Input } from "@/components/ui/input";

type PasswordResetFormProps = {
  action: (formData: FormData) => void;
  userId: string;
};

export function PasswordResetForm({ action, userId }: PasswordResetFormProps) {
  return (
    <form action={action} className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <input type="hidden" name="userId" value={userId} />
      <Input
        name="password"
        type="password"
        placeholder="Nueva contraseña"
        className="sm:flex-1"
      />
      <SubmitButton size="sm" pendingLabel="Guardando...">
        Cambiar
      </SubmitButton>
    </form>
  );
}
