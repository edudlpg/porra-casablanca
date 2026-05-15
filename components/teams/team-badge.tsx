"use client";

import { useState } from "react";
import type { Team } from "@prisma/client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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

type FlagAvatarProps = {
  team: TeamLike;
  avatarSizeClass: string;
  displayFlagUrl: string | null;
  flagEmoji: string | null;
  emojiFallbackClass: string;
  fallbackLabel: string;
};

function FlagAvatar({
  team,
  avatarSizeClass,
  displayFlagUrl,
  flagEmoji,
  emojiFallbackClass,
  fallbackLabel,
}: FlagAvatarProps) {
  const primaryFlagUrl = team.flagUrl ?? displayFlagUrl;
  const [activeFlagUrl, setActiveFlagUrl] = useState<string | null>(primaryFlagUrl);

  return (
    <Avatar className={avatarSizeClass}>
      {activeFlagUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={activeFlagUrl}
          alt={`Bandera de ${team.name}`}
          className="aspect-square size-full object-contain bg-white p-0.5"
          onError={() => {
            if (activeFlagUrl !== displayFlagUrl && displayFlagUrl) {
              setActiveFlagUrl(displayFlagUrl);
              return;
            }

            setActiveFlagUrl(null);
          }}
        />
      ) : null}
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
  );
}

export function TeamBadge({ team, layout = "inline", className }: TeamBadgeProps) {
  const displayFlagUrl = getDisplayFlagUrl(team.flagUrl, layout === "inline" ? 80 : 160);
  const primaryFlagUrl = team.flagUrl ?? displayFlagUrl;
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
      <FlagAvatar
        key={`${team.name}-${primaryFlagUrl ?? "no-flag"}-${layout}`}
        team={team}
        avatarSizeClass={avatarSizeClass}
        displayFlagUrl={displayFlagUrl}
        flagEmoji={flagEmoji}
        emojiFallbackClass={emojiFallbackClass}
        fallbackLabel={fallbackLabel}
      />
      <span className="min-w-0 text-sm font-semibold text-slate-900">{team.name}</span>
    </div>
  );
}
