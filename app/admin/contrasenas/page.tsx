import { Trash2 } from "lucide-react";

import { deleteUserAction, resetUserPasswordAction } from "@/app/admin/actions";
import { PasswordResetForm } from "@/components/admin/password-reset-form";
import { BackLink } from "@/components/layout/back-link";
import { FeedbackBanner } from "@/components/layout/feedback-banner";
import { PageHeader } from "@/components/layout/page-header";
import { SubmitButton } from "@/components/layout/submit-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";

type SearchParams = Promise<{ error?: string; success?: string }>;

export default async function AdminPasswordsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const query = await searchParams;
  const users = await prisma.user.findMany({
    where: {
      role: "USER",
    },
    orderBy: {
      username: "asc",
    },
    select: {
      id: true,
      username: true,
      name: true,
    },
  });

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Admin"
        title="Usuarios"
        description="Gestiona usuarios: cambia contraseñas o elimina cuentas si es necesario."
        action={<BackLink href="/admin" />}
      />

      {query.error ? <FeedbackBanner type="error" message={query.error} /> : null}
      {query.success ? <FeedbackBanner type="success" message={query.success} /> : null}

      <Card>
        <CardHeader>
          <CardTitle>Listado de usuarios</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {users.map((user) => (
            <div key={user.id} className="space-y-2 rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-950">
                    {user.username ?? user.name}
                  </p>
                  <p className="text-xs text-slate-500">{user.name}</p>
                </div>
                <form action={deleteUserAction}>
                  <input type="hidden" name="userId" value={user.id} />
                  <SubmitButton
                    type="submit"
                    variant="ghost"
                    size="icon"
                    pendingLabel="..."
                    className="size-9 rounded-xl text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                    aria-label={`Eliminar usuario ${user.username ?? user.name}`}
                  >
                    <Trash2 className="size-4" />
                  </SubmitButton>
                </form>
              </div>
              <PasswordResetForm action={resetUserPasswordAction} userId={user.id} />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
