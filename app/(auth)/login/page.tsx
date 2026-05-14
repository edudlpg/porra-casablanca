import Link from "next/link";

import { FeedbackBanner } from "@/components/layout/feedback-banner";
import { SubmitButton } from "@/components/layout/submit-button";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginAction } from "@/app/(auth)/actions";

type SearchParams = Promise<{
  error?: string;
  success?: string;
}>;

export default async function LoginPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--brand)]">
          Porra Casablanca
        </p>
        <h1 className="font-display text-4xl font-bold tracking-tight text-slate-950">
          Accede o crea tu cuenta
        </h1>
      </div>

      {params.error ? <FeedbackBanner type="error" message={params.error} /> : null}
      {params.success ? <FeedbackBanner type="success" message={params.success} /> : null}

      <Card>
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>Usuario y contraseña para entrar a la porra</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={loginAction} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Usuario</Label>
              <Input id="username" name="username" placeholder="tuusuario" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input id="password" name="password" type="password" placeholder="******" />
            </div>
            <SubmitButton className="w-full" size="lg" pendingLabel="Entrando...">
              Iniciar sesión
            </SubmitButton>
          </form>
        </CardContent>
      </Card>

      <p className="text-center text-sm font-medium text-slate-500">¿Aún no tienes cuenta?</p>

      <Button asChild variant="secondary" size="lg" className="w-full">
        <Link href="/register">Crear cuenta</Link>
      </Button>
    </div>
  );
}
