import type { Team } from "@prisma/client";

import { FlagImage } from "@/components/teams/flag-image";
import { cn } from "@/lib/utils";

type TeamLike = Pick<Team, "name" | "flagUrl">;

type TeamBadgeProps = {
  team: TeamLike;
  layout?: "inline" | "stacked";
  className?: string;
  imageLoading?: "eager" | "lazy";
};

export function TeamBadge({
  team,
  layout = "inline",
  className,
  imageLoading = "lazy",
}: TeamBadgeProps) {
  return (
    <div
      className={cn(
        "flex min-w-0 gap-3",
        layout === "inline" ? "items-center" : "flex-col items-center text-center",
        className,
      )}
    >
      <FlagImage
        flagUrl={team.flagUrl}
        teamName={team.name}
        size={layout === "inline" ? "md" : "lg"}
        className={layout === "inline" ? "size-8 rounded-xl" : "size-12 rounded-2xl"}
        loading={imageLoading}
      />
      <span className="min-w-0 text-sm font-semibold text-slate-900">{team.name}</span>
    </div>
  );
}
