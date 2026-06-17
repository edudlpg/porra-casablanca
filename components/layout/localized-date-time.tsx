"use client";

import { useSyncExternalStore } from "react";

import { formatDateTime } from "@/lib/utils";

type LocalizedDateTimeProps = {
  value: Date | string;
  className?: string;
};

function subscribeToTimeZoneChanges() {
  return () => {};
}

export function LocalizedDateTime({ value, className }: LocalizedDateTimeProps) {
  const dateTime = new Date(value).toISOString();
  const formattedValue = useSyncExternalStore(
    subscribeToTimeZoneChanges,
    () => formatDateTime(value),
    () => formatDateTime(value, "Atlantic/Canary"),
  );

  return (
    <time dateTime={dateTime} className={className}>
      {formattedValue}
    </time>
  );
}
