import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/mock-db";
import { deriveStatus, sumHours } from "@/lib/week-utils";
import { requireSession } from "@/lib/api-helpers";
import type { TimesheetWithStatus, WeekStatus } from "@/types";

export async function GET(req: NextRequest) {
  const { response } = await requireSession();
  if (response) return response;

  const { searchParams } = new URL(req.url);
  const from = searchParams.get("from"); // ISO date
  const to = searchParams.get("to");
  const statusFilter = searchParams.get("status") as WeekStatus | null;
  const page = Math.max(1, Number(searchParams.get("page") ?? "1"));
  const pageSize = Math.max(1, Math.min(50, Number(searchParams.get("pageSize") ?? "5")));

  const all: TimesheetWithStatus[] = db.listTimesheets().map((t) => {
    const entries = db.listEntriesByTimesheet(t.id);
    const totalHours = sumHours(entries);
    return { ...t, totalHours, status: deriveStatus(totalHours) };
  });

  // If filter range covers any part of a week, include that week.
  const filtered = all.filter((w) => {
    if (from && w.weekEnd < from) return false;
    if (to && w.weekStart > to) return false;
    if (statusFilter && w.status !== statusFilter) return false;
    return true;
  });

  // Newest weeks first
  filtered.sort((a, b) => (a.weekStart < b.weekStart ? 1 : -1));

  const total = filtered.length;
  const start = (page - 1) * pageSize;
  const items = filtered.slice(start, start + pageSize);

  return NextResponse.json({ items, total, page, pageSize });
}
