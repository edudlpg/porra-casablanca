import type { BroadcastPartner } from "@prisma/client";

import { cn } from "@/lib/utils";

type BroadcastSwitchProps = {
  defaultValue?: BroadcastPartner;
  idPrefix: string;
  label?: string;
  name?: string;
};

const options: Array<{ label: string; value: BroadcastPartner }> = [
  { label: "DAZN", value: "DAZN" },
  { label: "RTVE", value: "RTVE" },
];

export function BroadcastSwitch({
  defaultValue = "DAZN",
  idPrefix,
  label = "Retransmisión",
  name = "broadcast",
}: BroadcastSwitchProps) {
  return (
    <fieldset className="space-y-2">
      <legend className="text-sm font-medium text-slate-900">{label}</legend>
      <div className="inline-flex rounded-2xl bg-slate-100 p-1">
        {options.map((option) => {
          const optionId = `${idPrefix}-${option.value.toLowerCase()}`;

          return (
            <label key={option.value} htmlFor={optionId} className="cursor-pointer">
              <input
                id={optionId}
                type="radio"
                name={name}
                value={option.value}
                defaultChecked={defaultValue === option.value}
                className="peer sr-only"
              />
              <span
                className={cn(
                  "block rounded-xl px-4 py-2 text-sm font-semibold text-slate-500 transition",
                  "peer-checked:bg-white peer-checked:text-slate-950 peer-checked:shadow-sm",
                )}
              >
                {option.label}
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
