import { formatDateTime } from "@/lib/utils";

type LocalizedDateTimeProps = {
  value: Date | string;
  className?: string;
};

export function LocalizedDateTime({ value, className }: LocalizedDateTimeProps) {
  return (
    <time dateTime={new Date(value).toISOString()} className={className}>
      {formatDateTime(value)}
    </time>
  );
}
