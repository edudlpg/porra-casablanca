import { AlertCircle, CheckCircle2 } from "lucide-react";

import { cn } from "@/lib/utils";

type FeedbackBannerProps = {
  type: "error" | "success";
  message: string;
};

export function FeedbackBanner({ type, message }: FeedbackBannerProps) {
  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-2xl border px-4 py-3 text-sm",
        type === "success"
          ? "border-emerald-200 bg-emerald-50 text-emerald-800"
          : "border-rose-200 bg-rose-50 text-rose-800",
      )}
    >
      {type === "success" ? (
        <CheckCircle2 className="mt-0.5 size-4 shrink-0" />
      ) : (
        <AlertCircle className="mt-0.5 size-4 shrink-0" />
      )}
      <p>{message}</p>
    </div>
  );
}
