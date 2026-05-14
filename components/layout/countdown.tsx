"use client";

import { useEffect, useState } from "react";

function getRemainingParts(target: string, now: number) {
  const diff = new Date(target).getTime() - now;

  if (diff <= 0) {
    return null;
  }

  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return { days, hours, minutes, seconds };
}

type CountdownProps = {
  target: Date | string;
  initialNow?: number;
};

export function Countdown({ target, initialNow }: CountdownProps) {
  const targetValue = new Date(target).toISOString();
  const [now, setNow] = useState(() => initialNow ?? Date.now());
  const remaining = getRemainingParts(targetValue, now);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => window.clearInterval(interval);
  }, []);

  if (!remaining) {
    return <p className="text-sm font-medium text-emerald-100">La jornada ya está cerrada.</p>;
  }

  const segments = [
    remaining.days > 0 ? `${remaining.days}d` : null,
    `${remaining.hours.toString().padStart(2, "0")}h`,
    `${remaining.minutes.toString().padStart(2, "0")}m`,
    `${remaining.seconds.toString().padStart(2, "0")}s`,
  ].filter(Boolean);

  return (
    <div className="space-y-1">
      <p className="text-xs uppercase tracking-[0.18em] text-emerald-100">Cierre en</p>
      <p className="font-display text-2xl font-bold">{segments.join(" · ")}</p>
    </div>
  );
}
