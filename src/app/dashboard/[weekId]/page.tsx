"use client";

import { use, useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { DayRow } from "@/components/timesheets/DayRow";
import { AddEntryModal } from "@/components/timesheets/AddEntryModal";
import { apiClient } from "@/lib/api-client";
import {
  WEEK_TARGET_HOURS,
  eachDayInRange,
  formatWeekRange,
} from "@/lib/week-utils";
import type { TimesheetEntry, TimesheetWithStatus } from "@/types";
import type { EntryInput } from "@/lib/validators";

interface PageProps {
  params: Promise<{ weekId: string }>;
}

export default function WeeklyTimesheetPage({ params }: PageProps) {
  const { weekId } = use(params);

  const [timesheet, setTimesheet] = useState<TimesheetWithStatus | null>(null);
  const [entries, setEntries] = useState<TimesheetEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalDate, setModalDate] = useState<string>("");
  const [editing, setEditing] = useState<TimesheetEntry | undefined>();

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await apiClient.getTimesheet(weekId);
      setTimesheet(res.timesheet);
      setEntries(res.entries);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load");
    } finally {
      setIsLoading(false);
    }
  }, [weekId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const days = useMemo(
    () => (timesheet ? eachDayInRange(timesheet.weekStart, timesheet.weekEnd) : []),
    [timesheet]
  );

  const entriesByDate = useMemo(() => {
    const map: Record<string, TimesheetEntry[]> = {};
    for (const e of entries) {
      (map[e.date] ??= []).push(e);
    }
    return map;
  }, [entries]);

  function openCreate(date: string) {
    setEditing(undefined);
    setModalDate(date);
    setModalOpen(true);
  }
  function openEdit(entry: TimesheetEntry) {
    setEditing(entry);
    setModalDate(entry.date);
    setModalOpen(true);
  }

  async function handleSubmit(values: EntryInput) {
    if (editing) {
      await apiClient.updateEntry(weekId, editing.id, values);
    } else {
      await apiClient.createEntry(weekId, values);
    }
    await refresh();
  }

  async function handleDelete(entry: TimesheetEntry) {
    if (!confirm("Delete this entry?")) return;
    await apiClient.deleteEntry(weekId, entry.id);
    await refresh();
  }

  if (isLoading && !timesheet) {
    return <div className="text-sm text-gray-500 py-10 text-center">Loading…</div>;
  }
  if (error) {
    return <div className="text-sm text-red-600 py-10 text-center">{error}</div>;
  }
  if (!timesheet) return null;

  return (
    <div className="bg-white rounded-lg shadow-card border border-gray-100 p-5 sm:p-6">
      <div className="mb-4">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
        >
          <ChevronLeft className="h-4 w-4" /> Back to timesheets
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">This week&apos;s timesheet</h1>
          <p className="mt-1 text-sm text-gray-500">
            {formatWeekRange(timesheet.weekStart, timesheet.weekEnd)}
          </p>
        </div>
        <div className="w-full sm:w-64">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-gray-700">
              {timesheet.totalHours}/{WEEK_TARGET_HOURS} hrs
            </span>
            <span className="text-gray-500">
              {Math.min(100, Math.round((timesheet.totalHours / WEEK_TARGET_HOURS) * 100))}%
            </span>
          </div>
          <ProgressBar value={timesheet.totalHours} max={WEEK_TARGET_HOURS} className="mt-1.5" />
        </div>
      </div>

      <div className="mt-6 divide-y divide-gray-100">
        {days.map((d) => (
          <DayRow
            key={d}
            date={d}
            entries={entriesByDate[d] ?? []}
            onAdd={openCreate}
            onEdit={openEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>

      <AddEntryModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        defaultDate={modalDate || timesheet.weekStart}
        initial={editing}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
