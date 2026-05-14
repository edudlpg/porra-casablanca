import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CardCornerGraphic } from "@/components/ui/card-corner-graphic";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { RankingEntry } from "@/types";

type RankingListProps = {
  entries: RankingEntry[];
};

function getPositionStyles(position: number) {
  if (position === 1) {
    return {
      cardClass: "border-amber-200/90 shadow-[0_18px_50px_-28px_rgba(217,119,6,0.35)]",
      positionClass: "bg-amber-300 text-amber-950",
      prizeClass: "border-amber-200 bg-amber-50 text-amber-800",
    };
  }

  if (position === 2) {
    return {
      cardClass: "border-slate-300/90 shadow-[0_18px_50px_-28px_rgba(100,116,139,0.32)]",
      positionClass: "bg-slate-300 text-slate-950",
      prizeClass: "border-slate-300 bg-slate-100 text-slate-800",
    };
  }

  if (position === 3) {
    return {
      cardClass: "border-orange-200/90 shadow-[0_18px_50px_-28px_rgba(194,65,12,0.28)]",
      positionClass: "bg-orange-300 text-orange-950",
      prizeClass: "border-orange-200 bg-orange-50 text-orange-800",
    };
  }

  return {
    cardClass: "",
    positionClass: "bg-slate-950 text-white",
    prizeClass: "border-slate-200 bg-slate-100 text-slate-700",
  };
}

function formatPrizeAmount(amount: number) {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function RankingList({ entries }: RankingListProps) {
  const showPrizeBadges = entries.length >= 5;

  return (
    <div className="space-y-3">
      {entries.map((entry) => {
        const styles = getPositionStyles(entry.position);

        return (
          <Card key={entry.user.id} className={cn("relative overflow-hidden", styles.cardClass)}>
            <CardCornerGraphic className="opacity-90" />
            <CardContent className="relative z-10 space-y-3 p-5">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "flex size-10 items-center justify-center rounded-2xl text-sm font-bold",
                      styles.positionClass,
                    )}
                  >
                    {entry.position}
                  </div>
                  <Avatar>
                    {entry.user.avatarUrl ? (
                      <AvatarImage
                        src={entry.user.avatarUrl}
                        alt={`Foto de ${entry.user.username ?? entry.user.name}`}
                      />
                    ) : null}
                    <AvatarFallback>{entry.user.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-slate-950">
                    {entry.user.username ?? entry.user.name}
                  </p>
                  <p className="mt-1 text-xs uppercase tracking-[0.14em] text-slate-500">
                    P {entry.exactHits} · D {entry.goalDifferenceHits} · S {entry.finalResultHits}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-display text-2xl font-bold text-slate-950">
                    {entry.totalPoints}
                  </p>
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-500">puntos</p>
                </div>
              </div>

              <div className="flex justify-end">
                {showPrizeBadges ? (
                  <Badge variant="secondary" className={styles.prizeClass}>
                    {entry.prizeAmount > 0
                      ? `Premio ${formatPrizeAmount(entry.prizeAmount)}`
                      : "Aplauso"}
                  </Badge>
                ) : null}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
