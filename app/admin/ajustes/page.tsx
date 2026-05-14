import { saveAppConfigAction } from "@/app/admin/actions";
import { AppConfigForm } from "@/components/admin/app-config-form";
import { BackLink } from "@/components/layout/back-link";
import { FeedbackBanner } from "@/components/layout/feedback-banner";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";

type SearchParams = Promise<{ error?: string; success?: string }>;

export default async function AdminSettingsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const query = await searchParams;
  const config = await prisma.appConfig.findUnique({
    where: { id: "singleton" },
  });

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Admin"
        title="⚙️ Ajustes"
        description="Configuración general de la porra."
        action={<BackLink href="/admin" />}
      />

      {query.error ? <FeedbackBanner type="error" message={query.error} /> : null}
      {query.success ? <FeedbackBanner type="success" message={query.success} /> : null}

      <Card>
        <CardHeader>
          <CardTitle>💰 Bote</CardTitle>
        </CardHeader>
        <CardContent>
          <AppConfigForm action={saveAppConfigAction} defaultEntryFee={config?.entryFee ?? 0} />
        </CardContent>
      </Card>
    </div>
  );
}
