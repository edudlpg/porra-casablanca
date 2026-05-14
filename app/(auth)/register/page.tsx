import Link from "next/link";

import { FeedbackBanner } from "@/components/layout/feedback-banner";
import { SubmitButton } from "@/components/layout/submit-button";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { registerAction } from "@/app/(auth)/actions";

type SearchParams = Promise<{
  error?: string;
}>;

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--brand)]">
          Registro
        </p>
        <h1 className="font-display text-4xl font-bold tracking-tight text-slate-950">
          Crea tu cuenta y a por el bote
        </h1>
      </div>

      {params.error ? <FeedbackBanner type="error" message={params.error} /> : null}

      <Card>
        <CardHeader>
          <CardTitle>Registro</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={registerAction} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Usuario</Label>
              <Input id="username" name="username" placeholder="maria" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input id="password" name="password" type="password" placeholder="Mínimo 6 caracteres" />
            </div>
            <SubmitButton className="w-full" size="lg" pendingLabel="Creando cuenta...">
              Crear cuenta
            </SubmitButton>
          </form>
        </CardContent>
      </Card>

      <Button asChild variant="secondary" size="lg" className="w-full">
        <Link href="/login">Ya tengo cuenta</Link>
      </Button>
    </div>
  );
}
