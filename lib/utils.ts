import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDateTime(value: Date | string) {
  return new Intl.DateTimeFormat("es-ES", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function formatDateForInput(value: Date | string) {
  const date = new Date(value);
  const offset = date.getTimezoneOffset();
  const localDate = new Date(date.getTime() - offset * 60 * 1000);

  return localDate.toISOString().slice(0, 16);
}

export function isRoundOpen(unlockAt: Date | string) {
  return new Date(unlockAt).getTime() <= Date.now();
}

export function isRoundInWindow(unlockAt: Date | string, endDate: Date | string) {
  const now = Date.now();

  return new Date(unlockAt).getTime() <= now && new Date(endDate).getTime() >= now;
}

export function isRoundPredictionWindow(unlockAt: Date | string, startDate: Date | string) {
  const now = Date.now();

  return new Date(unlockAt).getTime() <= now && new Date(startDate).getTime() > now;
}

export function getMatchSign(homeScore: number, awayScore: number) {
  if (homeScore > awayScore) {
    return "HOME";
  }

  if (homeScore < awayScore) {
    return "AWAY";
  }

  return "DRAW";
}

export function isMatchEditable(
  startsAt: Date | string,
  isLocked: boolean,
  unlockAt: Date | string,
  startDate?: Date | string,
) {
  const roundOpen = startDate ? isRoundPredictionWindow(unlockAt, startDate) : isRoundOpen(unlockAt);

  return roundOpen && !isLocked && new Date(startsAt).getTime() > Date.now();
}
