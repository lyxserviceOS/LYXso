// components/StatCard.tsx
import type { ReactNode } from "react";

type TrendDirection = "up" | "down" | "neutral";

type StatCardProps = {
  label: string;
  value: string;
  subtitle?: string;
  trendLabel?: string;
  trendDirection?: TrendDirection;
  icon?: ReactNode;
};

function getTrendClasses(direction: TrendDirection | undefined) {
  if (direction === "up") {
    return "text-emerald-400";
  }
  if (direction === "down") {
    return "text-danger";
  }
  return "text-shellTextMuted";
}

export default function StatCard({
  label,
  value,
  subtitle,
  trendLabel,
  trendDirection = "neutral",
  icon,
}: StatCardProps) {
  return (
    <div className="group rounded-xl border border-shellBorder bg-cardBg/90 px-4 py-3 shadow-sm ring-1 ring-black/0 transition-all hover:border-primary/60 hover:ring-1 hover:ring-primary/40">
      <div className="flex items-center justify-between gap-3">
        <div className="flex flex-col gap-1">
          <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-shellTextMuted">
            {label}
          </p>
          <div className="flex items-baseline gap-2">
            <p className="text-lg font-semibold text-shellText">{value}</p>
            {trendLabel && (
              <span
                className={`text-[11px] font-medium ${getTrendClasses(
                  trendDirection
                )}`}
              >
                {trendLabel}
              </span>
            )}
          </div>
          {subtitle && (
            <p className="text-[11px] text-shellTextMuted">{subtitle}</p>
          )}
        </div>

        {icon && (
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-shellBg/70 text-primary group-hover:bg-primary/10">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
