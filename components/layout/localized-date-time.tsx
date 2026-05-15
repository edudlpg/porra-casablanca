"use client";

import { formatDateTime } from "@/lib/utils";

type LocalizedDateTimeProps = {
  value: Date | string;
  className?: string;
};

function formatInBrowserTimeZone(value: Date | string) {
  return new Intl.DateTimeFormat("es-ES", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function LocalizedDateTime({ value, className }: LocalizedDateTimeProps) {
  const formattedValue =
    typeof window === "undefined" ? formatDateTime(value) : formatInBrowserTimeZone(value);

  return (
    <time dateTime={new Date(value).toISOString()} className={className} suppressHydrationWarning>
      {formattedValue}
    </time>
  );
}
