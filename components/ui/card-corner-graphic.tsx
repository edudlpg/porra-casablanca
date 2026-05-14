import { cn } from "@/lib/utils";

type CardCornerGraphicProps = {
  className?: string;
  variant?: "ranking" | "match";
};

export function CardCornerGraphic({
  className,
  variant = "ranking",
}: CardCornerGraphicProps) {
  const isMatch = variant === "match";
  const matchMaskImage =
    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' preserveAspectRatio='none'%3E%3Cdefs%3E%3Cfilter id='blur' x='-30%25' y='-30%25' width='160%25' height='160%25'%3E%3CfeGaussianBlur stdDeviation='4.5'/%3E%3C/filter%3E%3C/defs%3E%3Cpolygon points='-8,-8 112,-8 35,108 -8,108' fill='white' filter='url(%23blur)'/%3E%3C/svg%3E\")";

  return (
    <div aria-hidden="true" className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}>
      <div
        className={cn(
          "absolute opacity-[0.13]",
          isMatch ? "left-0 top-0 h-full w-full" : "-left-4 -top-4 h-44 w-48",
        )}
        style={{
          backgroundImage: "url('/images/background-card.jpg')",
          backgroundPosition: "top left",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          clipPath: isMatch
            ? undefined
            : "polygon(0 0, 100% 0, 72% 100%, 0 100%)",
          maskImage: isMatch
            ? matchMaskImage
            : undefined,
          WebkitMaskImage: isMatch
            ? matchMaskImage
            : undefined,
          maskRepeat: isMatch ? "no-repeat" : undefined,
          WebkitMaskRepeat: isMatch ? "no-repeat" : undefined,
          maskSize: isMatch ? "100% 100%" : undefined,
          WebkitMaskSize: isMatch ? "100% 100%" : undefined,
        }}
      />
      {isMatch ? null : (
        <div className="absolute left-0 top-0 h-24 w-24 rounded-br-[34px] bg-emerald-400/8" />
      )}
    </div>
  );
}
