import { NextResponse } from "next/server";
import { db } from "@/lib/mock-db";
import { entrySchema } from "@/lib/validators";
import { badRequest, notFound, requireSession } from "@/lib/api-helpers";

export async function PATCH(
  req: Request,
  ctx: { params: Promise<{ weekId: string; entryId: string }> }
) {
  const { response } = await requireSession();
  if (response) return response;

  const { weekId, entryId } = await ctx.params;
  const week = db.getTimesheet(weekId);
  if (!week) return notFound("Timesheet not found");

  const existing = db.getEntry(entryId);
  if (!existing || existing.timesheetId !== weekId) {
    return notFound("Entry not found");
  }

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
  if (parsed.data.date < week.weekStart || parsed.data.date > week.weekEnd) {
    return badRequest("Date is outside the timesheet week");
  }

  const updated = db.updateEntry(entryId, parsed.data);
  if (!updated) return notFound("Entry not found");
  return NextResponse.json(updated);
}

export async function DELETE(
  _req: Request,
  ctx: { params: Promise<{ weekId: string; entryId: string }> }
) {
  const { response } = await requireSession();
  if (response) return response;

  const { weekId, entryId } = await ctx.params;
  const existing = db.getEntry(entryId);
  if (!existing || existing.timesheetId !== weekId) {
    return notFound("Entry not found");
  }
  db.deleteEntry(entryId);
  return new NextResponse(null, { status: 204 });
}
