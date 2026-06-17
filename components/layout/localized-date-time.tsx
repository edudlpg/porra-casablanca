"use client";

import { formatDateTime } from "@/lib/utils";

type LocalizedDateTimeProps = {
  value: Date | string;
  className?: string;
};

export function LocalizedDateTime({ value, className }: LocalizedDateTimeProps) {
  const dateTime = new Date(value).toISOString();
  const formattedValue = formatDateTime(value, "Atlantic/Canary");

  return (
    <time dateTime={dateTime} className={className}>
      {formattedValue}
    </time>
  );
}
