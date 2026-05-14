import { resetUserPasswordAction } from "@/app/admin/actions";
import { PasswordResetForm } from "@/components/admin/password-reset-form";
import { BackLink } from "@/components/layout/back-link";
import { FeedbackBanner } from "@/components/layout/feedback-banner";
import { PageHeader } from "@/components/layout/page-header";
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
        title="🔐 Contraseñas"
        description="Reasigna claves a los usuarios cuando la necesiten."
        action={<BackLink href="/admin" />}
      />

      {query.error ? <FeedbackBanner type="error" message={query.error} /> : null}
      {query.success ? <FeedbackBanner type="success" message={query.success} /> : null}

      <Card>
        <CardHeader>
          <CardTitle>👤 Usuarios</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {users.map((user) => (
            <div key={user.id} className="space-y-2 rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
              <div>
                <p className="text-sm font-semibold text-slate-950">{user.username ?? user.name}</p>
                <p className="text-xs text-slate-500">{user.name}</p>
              </div>
              <PasswordResetForm action={resetUserPasswordAction} userId={user.id} />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
