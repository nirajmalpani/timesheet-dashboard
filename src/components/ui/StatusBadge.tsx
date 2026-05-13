import { cn } from "@/lib/cn";
import type { WeekStatus } from "@/types";

const styles: Record<WeekStatus, string> = {
  completed: "bg-status-completed-bg text-status-completed-fg",
  incomplete: "bg-status-incomplete-bg text-status-incomplete-fg",
  missing: "bg-status-missing-bg text-status-missing-fg",
};

const labels: Record<WeekStatus, string> = {
  completed: "COMPLETED",
  incomplete: "INCOMPLETE",
  missing: "MISSING",
};

interface Props {
  status: WeekStatus;
  className?: string;
}

export function StatusBadge({ status, className }: Props) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium",
        styles[status],
        className
      )}
      aria-label={`Status: ${labels[status]}`}
    >
      {labels[status]}
    </span>
  );
}
