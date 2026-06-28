"use client";

import { type CSSProperties, useState } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CardCornerGraphic } from "@/components/ui/card-corner-graphic";
import { badgeVariants } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { RankingEntry } from "@/types";

type RankingListProps = {
  entries: RankingEntry[];
  currentUserId?: string;
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

function getNoPrizeLabel(position: number, totalEntries: number) {
  if (position === 4) {
    return "Bizcocho de pera";
  }

  if (position === 5) {
    return "Copazo en la CB";
  }

  if (position === 6) {
    return "Domingo sin recoger";
  }

  if (position === totalEntries) {
    return "Por determinar";
  }

  return "Aplauso";
}

function getPrizeSymbol(position: number, prizeAmount: number, noPrizeLabel: string) {
  if (prizeAmount > 0) {
    if (position === 1) {
      return "🥇";
    }

    if (position === 2) {
      return "🥈";
    }

    return "🥉";
  }

  if (noPrizeLabel === "Bizcocho de pera") {
    return "🍐";
  }

  if (noPrizeLabel === "Copazo en la CB") {
    return "🥃";
  }

  if (noPrizeLabel === "Domingo sin recoger") {
    return "😴";
  }

  return "👏";
}

const celebrationParticles = [
  { x: "-46px", y: "-82px", rotate: "-22deg", delay: "0ms" },
  { x: "-24px", y: "-106px", rotate: "18deg", delay: "30ms" },
  { x: "0px", y: "-92px", rotate: "-8deg", delay: "60ms" },
  { x: "25px", y: "-112px", rotate: "24deg", delay: "90ms" },
  { x: "48px", y: "-78px", rotate: "-16deg", delay: "120ms" },
  { x: "-12px", y: "-132px", rotate: "10deg", delay: "150ms" },
] as const;

function PrizeCelebration({ symbol }: { symbol: string }) {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute bottom-8 right-6 z-20">
      {celebrationParticles.map((particle, index) => (
        <span
          key={`${symbol}-${index}`}
          className="ranking-prize-spark absolute text-xl drop-shadow-sm"
          style={{
            "--spark-x": particle.x,
            "--spark-y": particle.y,
            "--spark-rotate": particle.rotate,
            animationDelay: particle.delay,
          } as CSSProperties}
        >
          {symbol}
        </span>
      ))}
    </div>
  );
}

export function RankingList({ entries, currentUserId }: RankingListProps) {
  const showPrizeBadges = entries.length >= 5;
  const [celebrationKey, setCelebrationKey] = useState<string | null>(null);

  return (
    <div className="space-y-3">
      {entries.map((entry) => {
        const styles = getPositionStyles(entry.position);
        const displayName = entry.user.teamName ?? entry.user.username ?? entry.user.name;
        const noPrizeLabel = getNoPrizeLabel(entry.position, entries.length);
        const badgeLabel =
          entry.prizeAmount > 0 ? `Premio ${formatPrizeAmount(entry.prizeAmount)}` : noPrizeLabel;
        const isCurrentUser = entry.user.id === currentUserId;
        const prizeSymbol = getPrizeSymbol(entry.position, entry.prizeAmount, noPrizeLabel);

        return (
          <Card
            key={entry.user.id}
            className={cn(
              "relative overflow-hidden",
              styles.cardClass,
              isCurrentUser &&
                "border-emerald-300/90 bg-emerald-50/85 shadow-[0_18px_50px_-24px_rgba(5,150,105,0.45)]",
            )}
          >
            <CardCornerGraphic className="opacity-90" />
            {celebrationKey === entry.user.id ? (
              <PrizeCelebration key={`${entry.user.id}-${prizeSymbol}`} symbol={prizeSymbol} />
            ) : null}
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
                        alt={`Foto de ${displayName}`}
                        loading="lazy"
                        decoding="async"
                      />
                    ) : null}
                    <AvatarFallback>{displayName.slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex min-w-0 items-center gap-2">
                    <p className="truncate text-sm font-semibold text-slate-950">
                      {displayName}
                    </p>
                    {isCurrentUser ? (
                      <span className="shrink-0 rounded-full border border-emerald-200 bg-emerald-100 px-2 py-0.5 text-[0.65rem] font-bold uppercase tracking-[0.14em] text-emerald-800">
                        Tú
                      </span>
                    ) : null}
                  </div>
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
                {showPrizeBadges && badgeLabel ? (
                  <button
                    type="button"
                    className={cn(
                      badgeVariants({ variant: "secondary" }),
                      "relative transition active:scale-95",
                      styles.prizeClass,
                    )}
                    onClick={() => {
                      setCelebrationKey(null);
                      window.setTimeout(() => setCelebrationKey(entry.user.id), 0);
                    }}
                    aria-label={`Celebrar ${badgeLabel} de ${displayName}`}
                  >
                    {badgeLabel}
                  </button>
                ) : null}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
