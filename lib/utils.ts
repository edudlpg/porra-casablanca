import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

const DATE_PARAM_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const APP_TIME_ZONE = "Atlantic/Canary";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDateTime(value: Date | string, timeZone?: string) {
  return new Intl.DateTimeFormat("es-ES", {
    dateStyle: "medium",
    timeZone,
    timeStyle: "short",
  }).format(new Date(value));
}

export function formatDateForInput(value: Date | string) {
  const date = new Date(value);
  const offset = date.getTimezoneOffset();
  const localDate = new Date(date.getTime() - offset * 60 * 1000);

  return localDate.toISOString().slice(0, 16);
}

function getDatePartsInTimeZone(value: Date, timeZone = APP_TIME_ZONE) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "2-digit",
    timeZone,
    year: "numeric",
  }).formatToParts(value);

  return {
    day: parts.find((part) => part.type === "day")?.value ?? "01",
    month: parts.find((part) => part.type === "month")?.value ?? "01",
    year: parts.find((part) => part.type === "year")?.value ?? "1970",
  };
}

function getTimeZoneOffsetMs(value: Date, timeZone = APP_TIME_ZONE) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    hour: "2-digit",
    hourCycle: "h23",
    minute: "2-digit",
    month: "2-digit",
    second: "2-digit",
    timeZone,
    year: "numeric",
  }).formatToParts(value);
  const findPart = (type: Intl.DateTimeFormatPartTypes) =>
    Number(parts.find((part) => part.type === type)?.value ?? 0);
  const zonedAsUtc = Date.UTC(
    findPart("year"),
    findPart("month") - 1,
    findPart("day"),
    findPart("hour"),
    findPart("minute"),
    findPart("second"),
  );

  return zonedAsUtc - value.getTime();
}

function zonedDateTimeToUtc(
  year: number,
  monthIndex: number,
  day: number,
  hour = 0,
  minute = 0,
  second = 0,
  timeZone = APP_TIME_ZONE,
) {
  const utcGuess = new Date(Date.UTC(year, monthIndex, day, hour, minute, second));
  const firstPass = new Date(utcGuess.getTime() - getTimeZoneOffsetMs(utcGuess, timeZone));

  return new Date(utcGuess.getTime() - getTimeZoneOffsetMs(firstPass, timeZone));
}

export function formatDateParam(value: Date = new Date(), timeZone = APP_TIME_ZONE) {
  const parts = getDatePartsInTimeZone(value, timeZone);

  return `${parts.year}-${parts.month}-${parts.day}`;
}

export function normalizeDateParam(value?: string, fallback = new Date()) {
  if (!value || !DATE_PARAM_PATTERN.test(value)) {
    return formatDateParam(fallback);
  }

  const [year, month, day] = value.split("-").map(Number);
  const utcDate = new Date(Date.UTC(year, month - 1, day));

  if (
    utcDate.getUTCFullYear() !== year ||
    utcDate.getUTCMonth() !== month - 1 ||
    utcDate.getUTCDate() !== day
  ) {
    return formatDateParam(fallback);
  }

  return value;
}

export function addDaysToDateParam(value: string, days: number) {
  const [year, month, day] = normalizeDateParam(value).split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day + days));

  return date.toISOString().slice(0, 10);
}

export function getDateParamRange(value: string) {
  const [year, month, day] = normalizeDateParam(value).split("-").map(Number);
  const start = zonedDateTimeToUtc(year, month - 1, day);
  const endDateParam = addDaysToDateParam(`${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`, 1);
  const [endYear, endMonth, endDay] = endDateParam.split("-").map(Number);

  return {
    end: zonedDateTimeToUtc(endYear, endMonth - 1, endDay),
    start,
  };
}

export function formatDateParamLabel(value: string) {
  const { start } = getDateParamRange(value);
  const midday = new Date(start.getTime() + 12 * 60 * 60 * 1000);

  return new Intl.DateTimeFormat("es-ES", {
    day: "numeric",
    month: "long",
    timeZone: APP_TIME_ZONE,
  }).format(midday);
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
