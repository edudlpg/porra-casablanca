import { LoadingList } from "@/components/layout/loading-list";

export default function HomeLoading() {
  return <LoadingList eyebrow="Dashboard" title="Cargando" rows={3} />;
}
