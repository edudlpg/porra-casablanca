import type { Team } from "@prisma/client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getDisplayFlagUrl, getFlagEmoji } from "@/lib/flags";
import { cn } from "@/lib/utils";

type TeamLike = Pick<Team, "name" | "flagUrl">;

type TeamBadgeProps = {
  team: TeamLike;
  layout?: "inline" | "stacked";
  className?: string;
};

function getFallback(name: string) {
  const chunks = name
    .split(/[\s/-]+/)
    .map((part) => part.replace(/[^\p{L}\p{N}]/gu, ""))
    .filter(Boolean);

  return (chunks[0]?.[0] ?? "?") + (chunks[1]?.[0] ?? "");
}

export function TeamBadge({ team, layout = "inline", className }: TeamBadgeProps) {
  const displayFlagUrl = getDisplayFlagUrl(team.flagUrl, layout === "inline" ? 80 : 160);
  const flagEmoji = getFlagEmoji(team.flagUrl);
  const fallbackLabel = flagEmoji ?? getFallback(team.name);
  const avatarSizeClass = layout === "inline" ? "size-8 rounded-xl" : "size-12 rounded-2xl";
  const emojiFallbackClass =
    layout === "inline"
      ? "bg-transparent text-[1.8rem] text-slate-900"
      : "bg-transparent text-[2.6rem] text-slate-900";

  return (
    <div
      className={cn(
        "flex min-w-0 gap-3",
        layout === "inline" ? "items-center" : "flex-col items-center text-center",
        className,
      )}
    >
      <Avatar className={avatarSizeClass}>
        {displayFlagUrl ? <AvatarImage src={displayFlagUrl} alt={`Bandera de ${team.name}`} /> : null}
        <AvatarFallback
          className={cn(
            flagEmoji && [
              "leading-none font-normal shadow-none tracking-normal",
              emojiFallbackClass,
            ],
          )}
          style={
            flagEmoji
              ? {
                  fontFamily: '"Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif',
                }
              : undefined
          }
        >
          {fallbackLabel}
        </AvatarFallback>
      </Avatar>
      <span className="min-w-0 text-sm font-semibold text-slate-900">{team.name}</span>
    </div>
  );
}
