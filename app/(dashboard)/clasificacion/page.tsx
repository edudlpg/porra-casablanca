import { EmptyState } from "@/components/layout/empty-state";
import { PageHeader } from "@/components/layout/page-header";
import { RankingList } from "@/components/ranking/ranking-list";
import { prisma } from "@/lib/prisma";
import { getCachedAppConfig } from "@/lib/data-cache";
import { buildRankingEntries } from "@/lib/ranking";
import type { RankingEntry } from "@/types";

export default async function RankingPage() {
  const users = await prisma.user.findMany({
    where: {
      role: "USER",
    },
    select: {
      id: true,
      name: true,
      username: true,
      email: true,
      teamName: true,
      avatarUrl: true,
      predictions: {
        select: {
          points: true,
          scoreType: true,
        },
      },
    },
    orderBy: {
      createdAt: "asc",
    },
  });
  const config = await getCachedAppConfig();

  const entries: RankingEntry[] = buildRankingEntries(users, config?.entryFee ?? 0);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Clasificación"
        title="Clasificación general"
      />

      {entries.length ? (
        <RankingList entries={entries} />
      ) : (
        <EmptyState
          title="Aún no hay clasificación"
          description="La tabla aparecerá en cuanto existan usuarios y predicciones registradas."
        />
      )}
    </div>
  );
}
