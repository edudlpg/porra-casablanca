import { FeedbackBanner } from "@/components/layout/feedback-banner";
import { AvatarUploadForm } from "@/components/profile/avatar-upload-form";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageHeader } from "@/components/layout/page-header";
import { SubmitButton } from "@/components/layout/submit-button";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { logoutAction } from "@/app/(auth)/actions";
import { saveProfileAvatarAction, saveProfileTeamNameAction } from "@/app/(dashboard)/perfil/actions";

type SearchParams = Promise<{
  error?: string;
  success?: string;
}>;

export default async function ProfilePage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const session = await auth();

  if (!session?.user) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    select: {
      id: true,
      name: true,
      username: true,
      teamName: true,
      avatarUrl: true,
    },
  });

  if (!user) {
    return null;
  }

  const displayName = user.teamName ?? user.username ?? user.name;
  const accountName = user.username ?? user.name;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Perfil"
        title="Configuración"
        description="Gestiona tu usuario y la foto que aparecerá en la clasificación."
      />

      {params.error ? <FeedbackBanner type="error" message={params.error} /> : null}
      {params.success ? <FeedbackBanner type="success" message={params.success} /> : null}

      <Card className="relative overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 scale-110 bg-[url('/images/General-Graphic-3840-x-2160-8.avif')] bg-cover bg-center opacity-15 blur-xl"
        />
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-white/82" />
        <CardHeader className="relative z-10 pb-0">
        </CardHeader>
        <CardContent className="relative z-10 space-y-5">
          <div className="flex min-h-20 items-center gap-4">
            <Avatar className="size-20 rounded-full border-4 border-white shadow-[0_14px_34px_-18px_rgba(15,23,42,0.65)]">
              {user.avatarUrl ? (
                <AvatarImage
                  src={user.avatarUrl}
                  alt={`Foto de ${displayName}`}
                  loading="eager"
                  decoding="async"
                />
              ) : null}
              <AvatarFallback className="rounded-full text-lg font-bold">
                {displayName.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex min-h-20 min-w-0 flex-1 flex-col justify-center">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Usuario</p>
              <p className="truncate text-xl font-bold text-slate-950">{accountName}</p>
            </div>
          </div>

          <div className="h-px bg-slate-200/90" />

          <form action={saveProfileTeamNameAction} className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="teamName" className="font-bold uppercase tracking-[0.14em] text-slate-500">
                Nombre de equipo
              </Label>
              <Input
                id="teamName"
                name="teamName"
                defaultValue={displayName}
                maxLength={40}
                placeholder="Nombre que aparece en la clasificación"
                className="bg-white/90 font-semibold"
              />
            </div>
            <SubmitButton size="sm" pendingLabel="Guardando...">
              Guardar nombre
            </SubmitButton>
          </form>

          <div className="h-px bg-slate-200/90" />

          <AvatarUploadForm action={saveProfileAvatarAction} />
        </CardContent>
      </Card>

      <form action={logoutAction}>
        <SubmitButton variant="destructive" className="w-full" size="lg" pendingLabel="Saliendo...">
          Cerrar sesión
        </SubmitButton>
      </form>
    </div>
  );
}
