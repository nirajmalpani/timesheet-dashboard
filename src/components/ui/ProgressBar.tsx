import { cn } from "@/lib/cn";

interface ProgressBarProps {
  value: number;
  max: number;
  className?: string;
}

export function ProgressBar({ value, max, className }: ProgressBarProps) {
  const pct = max <= 0 ? 0 : Math.min(100, Math.round((value / max) * 100));
  // color shifts as the user fills the week
  const fill =
    pct >= 100 ? "bg-emerald-500" : pct >= 50 ? "bg-orange-400" : "bg-orange-300";
  return (
    <div
      className={cn("h-2 w-full rounded-full bg-gray-100 overflow-hidden", className)}
      role="progressbar"
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className={cn("h-full transition-all", fill)}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
