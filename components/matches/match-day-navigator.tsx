import Link from "next/link";
import type { Route } from "next";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { addDaysToDateParam, formatDateParamLabel } from "@/lib/utils";

type MatchDayNavigatorProps = {
  basePath: Route | `/jornadas/${string}`;
  selectedDate: string;
};

function dayHref(basePath: string, date: string) {
  return `${basePath}?date=${date}` as Route;
}

export function MatchDayNavigator({ basePath, selectedDate }: MatchDayNavigatorProps) {
  const previousDate = addDaysToDateParam(selectedDate, -1);
  const nextDate = addDaysToDateParam(selectedDate, 1);

  return (
    <section className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3">
      <Button
        asChild
        variant="secondary"
        size="icon"
        aria-label="Ver día anterior"
        className="size-14 rounded-2xl bg-white shadow-[0_14px_36px_-24px_rgba(15,23,42,0.45)]"
      >
        <Link href={dayHref(basePath, previousDate)}>
          <ChevronLeft className="size-5" />
        </Link>
      </Button>

      <div className="flex h-14 min-w-0 items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 text-center shadow-[0_14px_36px_-24px_rgba(15,23,42,0.45)]">
        <p className="truncate font-display text-lg font-bold text-slate-950 sm:text-xl">
          {formatDateParamLabel(selectedDate)}
        </p>
      </div>

      <Button
        asChild
        variant="secondary"
        size="icon"
        aria-label="Ver día siguiente"
        className="size-14 rounded-2xl bg-white shadow-[0_14px_36px_-24px_rgba(15,23,42,0.45)]"
      >
        <Link href={dayHref(basePath, nextDate)}>
          <ChevronRight className="size-5" />
        </Link>
      </Button>
    </section>
  );
}
