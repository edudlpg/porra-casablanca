import Image from "next/image";

import { getDisplayFlagUrl, getFlagEmoji, getLocalFlagUrl } from "@/lib/flags";
import { cn } from "@/lib/utils";

type FlagImageProps = {
  flagUrl?: string | null;
  teamName: string;
  size: "sm" | "md" | "lg";
  className?: string;
  loading?: "eager" | "lazy";
};

const sizeClassBySize = {
  sm: "size-4 rounded-[5px] p-0.5 text-sm",
  md: "size-6 rounded-lg p-0.5 text-lg",
  lg: "size-12 rounded-2xl p-2 text-3xl",
} as const;

const remoteWidthBySize = {
  sm: 40,
  md: 80,
  lg: 160,
} as const;

const imageSizeBySize = {
  sm: 16,
  md: 24,
  lg: 48,
} as const;

export function FlagImage({
  flagUrl,
  teamName,
  size,
  className,
  loading = "lazy",
}: FlagImageProps) {
  const src = getLocalFlagUrl(flagUrl) ?? getDisplayFlagUrl(flagUrl, remoteWidthBySize[size]);
  const flagEmoji = getFlagEmoji(flagUrl);
  const baseClass = cn(
    "shrink-0 bg-white object-contain",
    sizeClassBySize[size],
    className,
  );

  if (!src) {
    return (
      <span
        className={cn("flex items-center justify-center leading-none", baseClass)}
        style={{
          fontFamily: '"Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif',
        }}
      >
        {flagEmoji ?? "?"}
      </span>
    );
  }

  return (
    <Image
      src={src}
      alt={`Bandera de ${teamName}`}
      width={imageSizeBySize[size]}
      height={imageSizeBySize[size]}
      className={baseClass}
      loading={loading}
    />
  );
}
