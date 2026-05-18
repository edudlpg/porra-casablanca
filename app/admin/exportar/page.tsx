import { Download } from "lucide-react";

import { BackLink } from "@/components/layout/back-link";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminExportPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Admin"
        title="💾 Exportar CSV"
        description="Descarga un backup completo para conservar usuarios, partidos, resultados y predicciones."
        action={<BackLink href="/admin" />}
      />

      <Card>
        <CardHeader>
          <CardTitle>Backup completo</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-slate-600">
            El CSV incluye filas de tipo <strong>USER</strong>, <strong>MATCH</strong> y{" "}
            <strong>PREDICTION</strong>. Sirve para auditar el estado completo de la porra o
            reconstruir datos si hubiera un problema.
          </p>
          <Button asChild className="w-full" size="lg">
            <a href="/admin/exportar/backup">
              <Download className="size-4" />
              Descargar backup CSV
            </a>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
