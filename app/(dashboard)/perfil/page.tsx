import { FeedbackBanner } from "@/components/layout/feedback-banner";
import { AvatarUploadForm } from "@/components/profile/avatar-upload-form";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/layout/page-header";
import { SubmitButton } from "@/components/layout/submit-button";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { logoutAction } from "@/app/(auth)/actions";
import { saveProfileAvatarAction } from "@/app/(dashboard)/perfil/actions";

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
  });

  if (!user) {
    return null;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Perfil"
        title="Configuración"
        description="Gestiona tu usuario y la foto que aparecerá en la clasificación."
      />

      {params.error ? <FeedbackBanner type="error" message={params.error} /> : null}
      {params.success ? <FeedbackBanner type="success" message={params.success} /> : null}

      <Card>
        <CardHeader className="flex-row items-start justify-between gap-4">
          <CardTitle>Cuenta</CardTitle>
          <Avatar className="size-16 rounded-full">
            {user.avatarUrl ? (
              <AvatarImage src={user.avatarUrl} alt={`Foto de ${user.username ?? user.name}`} />
            ) : null}
            <AvatarFallback className="rounded-full">
              {(user.username ?? user.name).slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Usuario</p>
            <p className="text-sm font-semibold text-slate-950">{user.username ?? user.name}</p>
          </div>
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
