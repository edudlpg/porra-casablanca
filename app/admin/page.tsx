import Link from "next/link";

import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent } from "@/components/ui/card";

const ADMIN_LINKS = [
  {
    href: "/admin/jornadas",
    title: "🗓️ Jornadas",
    description: "Apertura, inicio y cierre de cada fase.",
  },
  {
    href: "/admin/partidos",
    title: "⚽ Partidos",
    description: "Equipos, horarios y sedes de los encuentros.",
  },
  {
    href: "/admin/resultados",
    title: "🏁 Resultados",
    description: "Marcadores finales y recálculo de puntos.",
  },
  {
    href: "/admin/contrasenas",
    title: "🔐 Contraseñas",
    description: "Reasigna claves cuando alguien pierda la suya.",
  },
  {
    href: "/admin/ajustes",
    title: "⚙️ Ajustes",
    description: "Configuración general de la porra y del bote.",
  },
];

export default function AdminHomePage() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Admin"
        title="🛠️ Panel de control"
        description="Entra en cada sección para gestionar la porra sin mezclar tareas."
      />

      <div className="space-y-4">
        {ADMIN_LINKS.map((item) => (
          <Link key={item.href} href={item.href} className="block">
            <Card className="transition hover:border-slate-300 hover:bg-slate-50/70">
              <CardContent className="space-y-1 p-5">
                <p className="font-semibold text-slate-950">{item.title}</p>
                <p className="text-sm text-slate-500">{item.description}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
