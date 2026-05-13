import { NextResponse } from "next/server";
import { db } from "@/lib/mock-db";
import { deriveStatus, sumHours } from "@/lib/week-utils";
import { notFound, requireSession } from "@/lib/api-helpers";

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ weekId: string }> }
) {
  const { response } = await requireSession();
  if (response) return response;

  const { weekId } = await ctx.params;
  const timesheet = db.getTimesheet(weekId);
  if (!timesheet) return notFound("Timesheet not found");

  const entries = db.listEntriesByTimesheet(weekId);
  const totalHours = sumHours(entries);

  return NextResponse.json({
    timesheet: { ...timesheet, totalHours, status: deriveStatus(totalHours) },
    entries: entries.sort((a, b) => (a.date < b.date ? -1 : 1)),
  });
}
