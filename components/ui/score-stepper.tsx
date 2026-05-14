"use client";

import { Minus, Plus } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";

type ScoreStepperProps = {
  id: string;
  name: string;
  label: string;
  initialValue?: number | null;
  min?: number;
  max?: number;
  disabled?: boolean;
  hideLabel?: boolean;
  onValueChange?: (value: number) => void;
};

export function ScoreStepper({
  id,
  name,
  label,
  initialValue,
  min = 0,
  max = 20,
  disabled = false,
  hideLabel = false,
  onValueChange,
}: ScoreStepperProps) {
  const [value, setValue] = useState(initialValue ?? 0);

  const decrement = () => {
    const nextValue = Math.max(min, value - 1);
    setValue(nextValue);
    onValueChange?.(nextValue);
  };

  const increment = () => {
    const nextValue = Math.min(max, value + 1);
    setValue(nextValue);
    onValueChange?.(nextValue);
  };

  return (
    <div className="space-y-2 rounded-[20px] border border-slate-200 bg-white p-3 shadow-sm sm:space-y-3 sm:rounded-[24px] sm:p-4">
      <input type="hidden" id={id} name={name} value={value} />
      <div className={hideLabel ? "sr-only" : "text-sm font-semibold text-slate-900"}>{label}</div>
      <div className="flex items-center justify-between gap-3">
        <Button
          type="button"
          variant="secondary"
          size="icon"
          className="size-8 rounded-full sm:size-10"
          onClick={decrement}
          disabled={disabled || value <= min}
          aria-label={`Restar un gol a ${label}`}
        >
          <Minus className="size-3.5 sm:size-4" />
        </Button>
        <div
          aria-live="polite"
          className="min-w-10 text-center font-display text-2xl font-bold text-slate-950 sm:min-w-14 sm:text-3xl"
        >
          {value}
        </div>
        <Button
          type="button"
          variant="secondary"
          size="icon"
          className="size-8 rounded-full sm:size-10"
          onClick={increment}
          disabled={disabled || value >= max}
          aria-label={`Sumar un gol a ${label}`}
        >
          <Plus className="size-3.5 sm:size-4" />
        </Button>
      </div>
    </div>
  );
}
