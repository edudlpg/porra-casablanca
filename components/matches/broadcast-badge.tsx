import Image from "next/image";
import type { BroadcastPartner } from "@prisma/client";

import { broadcastLogoByPartner } from "@/lib/broadcasts";

type BroadcastBadgeProps = {
  broadcast: BroadcastPartner;
  imageLoading?: "eager" | "lazy";
};

export function BroadcastBadge({ broadcast, imageLoading = "lazy" }: BroadcastBadgeProps) {
  const logo = broadcastLogoByPartner[broadcast];

  return (
    <div className="flex h-8 min-w-14 items-center justify-center rounded-xl border border-slate-200 bg-white px-2 py-1 shadow-sm">
      <Image
        src={logo.src}
        alt={logo.alt}
        width={48}
        height={18}
        loading={imageLoading}
        className="h-4 w-auto object-contain"
      />
    </div>
  );
}
