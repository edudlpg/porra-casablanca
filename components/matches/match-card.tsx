import { Lock } from "lucide-react";

import { CardCornerGraphic } from "@/components/ui/card-corner-graphic";
import { BroadcastBadge } from "@/components/matches/broadcast-badge";
import { LocalizedDateTime } from "@/components/layout/localized-date-time";
import { TeamBadge } from "@/components/teams/team-badge";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { formatDateTime } from "@/lib/utils";
import type { MatchWithRelations } from "@/types";

type MatchCardProps = {
  match: MatchWithRelations;
  children?: React.ReactNode;
  scoreLabel?: string;
  hasSavedPrediction?: boolean;
  subtitle?: string;
  mediaLoading?: "eager" | "lazy";
};

export function MatchCard({
  match,
  children,
  scoreLabel,
  hasSavedPrediction = false,
  subtitle,
  mediaLoading = "lazy",
}: MatchCardProps) {
  const hasResult = match.homeScore !== null && match.awayScore !== null;

  return (
    <Card
      className={cn(
        "overflow-hidden transition-colors",
        hasSavedPrediction && "border-emerald-200/80",
      )}
    >
      <CardCornerGraphic variant="match" />
      <CardContent className="relative z-10 space-y-4 p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              <LocalizedDateTime value={match.startsAt} />
            </p>
            <p className="mt-1 text-sm text-slate-500">{subtitle ?? match.round.name}</p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <BroadcastBadge broadcast={match.broadcast} imageLoading={mediaLoading} />
            <div className="flex items-center gap-2">
              {match.isLocked && !hasResult ? (
                <Badge variant="warning">
                  <Lock className="mr-1 size-3" />
                  Bloqueado
                </Badge>
              ) : null}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 text-center">
          <div className="rounded-[22px] border border-white/70 bg-white/70 px-3 py-4 shadow-[0_10px_26px_-18px_rgba(15,23,42,0.45)] backdrop-blur-[2px]">
            <TeamBadge team={match.homeTeam} layout="stacked" imageLoading={mediaLoading} />
          </div>
          <div className="min-w-[6.5rem] space-y-1">
            <p className="text-center font-display text-2xl font-bold text-slate-950">
              {hasResult ? `${match.homeScore} - ${match.awayScore}` : "vs"}
            </p>
            {scoreLabel ? <p className="text-center text-xs font-medium text-slate-500">{scoreLabel}</p> : null}
          </div>
          <div className="rounded-[22px] border border-white/70 bg-white/70 px-3 py-4 shadow-[0_10px_26px_-18px_rgba(15,23,42,0.45)] backdrop-blur-[2px]">
            <TeamBadge team={match.awayTeam} layout="stacked" imageLoading={mediaLoading} />
          </div>
        </div>

        {children}
      </CardContent>
    </Card>
  );
}
