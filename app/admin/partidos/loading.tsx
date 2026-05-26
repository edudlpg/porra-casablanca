import { LoadingList } from "@/components/layout/loading-list";

export default function AdminMatchesLoading() {
  return <LoadingList eyebrow="Admin" title="Partidos" rows={4} />;
}
