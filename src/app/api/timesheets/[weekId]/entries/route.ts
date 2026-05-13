import { NextResponse } from "next/server";
import { db } from "@/lib/mock-db";
import { entrySchema } from "@/lib/validators";
import { badRequest, notFound, requireSession } from "@/lib/api-helpers";

export async function POST(
  req: Request,
  ctx: { params: Promise<{ weekId: string }> }
) {
  const { response } = await requireSession();
  if (response) return response;

  const { weekId } = await ctx.params;
  const week = db.getTimesheet(weekId);
  if (!week) return notFound("Timesheet not found");

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return badRequest("Invalid JSON");
  }
  const parsed = entrySchema.safeParse(body);
  if (!parsed.success) {
    return badRequest(parsed.error.issues[0]?.message ?? "Invalid input");
  }

  // Date must fall within week range
  if (parsed.data.date < week.weekStart || parsed.data.date > week.weekEnd) {
    return badRequest("Date is outside the timesheet week");
  }

  const entry = db.createEntry({
    timesheetId: weekId,
    ...parsed.data,
  });
  return NextResponse.json(entry, { status: 201 });
}
