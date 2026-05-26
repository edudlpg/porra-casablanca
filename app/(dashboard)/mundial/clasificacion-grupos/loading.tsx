import { LoadingList } from "@/components/layout/loading-list";

export default function WorldCupGroupStandingsLoading() {
  return <LoadingList eyebrow="Mundial" title="Clasificación grupos" rows={5} />;
}
