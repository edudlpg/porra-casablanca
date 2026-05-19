"use client";

import { useEffect, useState } from "react";

import { Input } from "@/components/ui/input";
import { formatDateForInput } from "@/lib/utils";

type LocalDateTimeInputProps = {
  id: string;
  name: string;
  defaultValue?: string;
};

function toIsoString(value: string) {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  return Number.isNaN(date.getTime()) ? "" : date.toISOString();
}

export function LocalDateTimeInput({ id, name, defaultValue }: LocalDateTimeInputProps) {
  const [localValue, setLocalValue] = useState("");
  const [submittedValue, setSubmittedValue] = useState(defaultValue ?? "");

  useEffect(() => {
    if (!defaultValue) {
      return;
    }

    const frame = window.requestAnimationFrame(() => {
      setLocalValue(formatDateForInput(defaultValue));
      setSubmittedValue(defaultValue);
    });

    return () => window.cancelAnimationFrame(frame);
  }, [defaultValue]);

  return (
    <>
      <input type="hidden" name={name} value={submittedValue} />
      <Input
        id={id}
        type="datetime-local"
        value={localValue}
        className="min-w-0 max-w-full"
        onChange={(event) => {
          const nextValue = event.target.value;

          setLocalValue(nextValue);
          setSubmittedValue(toIsoString(nextValue));
        }}
      />
    </>
  );
}
