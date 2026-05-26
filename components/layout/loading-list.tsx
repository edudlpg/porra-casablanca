import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent } from "@/components/ui/card";

type LoadingListProps = {
  eyebrow: string;
  title: string;
  rows?: number;
};

export function LoadingList({ eyebrow, title, rows = 5 }: LoadingListProps) {
  return (
    <div className="space-y-6">
      <PageHeader eyebrow={eyebrow} title={title} />
      <div className="space-y-3">
        {Array.from({ length: rows }, (_, index) => (
          <Card key={index}>
            <CardContent className="space-y-4 p-5">
              <div className="h-4 w-2/3 animate-pulse rounded-full bg-slate-200" />
              <div className="h-3 w-1/2 animate-pulse rounded-full bg-slate-100" />
              <div className="grid grid-cols-3 gap-3">
                <div className="h-16 animate-pulse rounded-2xl bg-slate-100" />
                <div className="h-16 animate-pulse rounded-2xl bg-slate-100" />
                <div className="h-16 animate-pulse rounded-2xl bg-slate-100" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
