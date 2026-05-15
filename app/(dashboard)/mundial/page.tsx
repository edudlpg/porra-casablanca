import Link from "next/link";

import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent } from "@/components/ui/card";

export default function WorldCupPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Mundial"
        title="Mundial 2026"
        description="Consulta la clasificación de grupos e información sobre los equipos"
      />

      <div className="space-y-3">
        <Link href="/mundial/clasificacion-grupos" className="block">
          <Card className="transition hover:-translate-y-0.5">
            <CardContent className="space-y-1 p-5">
              <p className="font-bold text-slate-950">Clasificación grupos</p>
              <p className="text-sm text-slate-500">
                Tabla actualizada de cada grupo
              </p>
            </CardContent>
          </Card>
        </Link>

        <Card className="border-dashed border-slate-300 bg-slate-50/80">
          <CardContent className="space-y-1 p-5">
            <p className="font-bold text-slate-950">Guía Equipos</p>
            <p className="text-sm text-slate-500">
              ¡Próximamente!
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
