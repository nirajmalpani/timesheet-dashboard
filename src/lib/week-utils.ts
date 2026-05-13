import { format, parseISO } from "date-fns";
import type { TimesheetEntry, WeekStatus } from "@/types";

export const WEEK_TARGET_HOURS = 40;

export function deriveStatus(totalHours: number): WeekStatus {
  if (totalHours <= 0) return "missing";
  if (totalHours >= WEEK_TARGET_HOURS) return "completed";
  return "incomplete";
}

export function sumHours(entries: TimesheetEntry[]): number {
  return entries.reduce((acc, e) => acc + e.hours, 0);
}

/**
 * "22 - 26 January, 2024" or "29 January - 2 February, 2024" if month differs.
 */
export function formatWeekRange(weekStart: string, weekEnd: string): string {
  const start = parseISO(weekStart);
  const end = parseISO(weekEnd);
  const sameMonth = start.getUTCMonth() === end.getUTCMonth();
  const sameYear = start.getUTCFullYear() === end.getUTCFullYear();

  if (sameMonth && sameYear) {
    return `${format(start, "d")} - ${format(end, "d MMMM, yyyy")}`;
  }
  if (sameYear) {
    return `${format(start, "d MMMM")} - ${format(end, "d MMMM, yyyy")}`;
  }
  return `${format(start, "d MMM yyyy")} - ${format(end, "d MMM yyyy")}`;
}

export function formatDayLabel(iso: string): string {
  return format(parseISO(iso), "MMM d");
}

/**
 * Returns the list of ISO dates from start to end inclusive.
 */
export function eachDayInRange(weekStart: string, weekEnd: string): string[] {
  const start = parseISO(weekStart);
  const end = parseISO(weekEnd);
  const dates: string[] = [];
  const cursor = new Date(start);
  while (cursor <= end) {
    dates.push(cursor.toISOString().slice(0, 10));
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }
  return dates;
}

export function actionLabelForStatus(status: WeekStatus): "View" | "Update" | "Create" {
  if (status === "completed") return "View";
  if (status === "incomplete") return "Update";
  return "Create";
}
