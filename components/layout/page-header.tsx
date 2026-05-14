import type { ReactNode } from "react";

type PageHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
};

export function PageHeader({ eyebrow, title, description, action }: PageHeaderProps) {
  return (
    <div className="space-y-4">
      {eyebrow ? (
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--brand)]">
          {eyebrow}
        </p>
      ) : null}
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <h1 className="font-display text-3xl font-bold tracking-tight text-slate-950">
            {title}
          </h1>
          {description ? (
            <p className="max-w-xl text-sm leading-6 text-slate-600">{description}</p>
          ) : null}
        </div>
        {action}
      </div>
    </div>
  );
}
