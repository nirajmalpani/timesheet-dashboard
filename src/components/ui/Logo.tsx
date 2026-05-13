import { cn } from "@/lib/cn";

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("text-lg font-bold tracking-tight text-gray-900", className)}>
      ticktock
    </span>
  );
}
