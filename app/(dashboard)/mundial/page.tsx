import Link from "next/link";

import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent } from "@/components/ui/card";

export default function WorldCupPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Mundial"
        title="Mundial"
        description="Consulta la clasificación de grupos y, más adelante, la guía completa de selecciones."
      />

      <div className="space-y-3">
        <Link href="/mundial/clasificacion-grupos" className="block">
          <Card className="transition hover:-translate-y-0.5">
            <CardContent className="space-y-1 p-5">
              <p className="font-semibold text-slate-950">Clasificación grupos</p>
              <p className="text-sm text-slate-500">
                Tabla actualizada de cada grupo con victorias, empates, derrotas, goles y puntos.
              </p>
            </CardContent>
          </Card>
        </Link>

        <Card className="border-dashed border-slate-300 bg-slate-50/80">
          <CardContent className="space-y-1 p-5">
            <p className="font-semibold text-slate-950">Guía Equipos</p>
            <p className="text-sm text-slate-500">
              Próximamente añadiremos fichas y referencia rápida de todas las selecciones.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
