"use client";

import { EntryRow } from "@/components/timesheets/EntryRow";
import { AddTaskInline } from "@/components/timesheets/AddTaskInline";
import { formatDayLabel } from "@/lib/week-utils";
import type { TimesheetEntry } from "@/types";

interface DayRowProps {
  date: string;
  entries: TimesheetEntry[];
  onAdd: (date: string) => void;
  onEdit: (entry: TimesheetEntry) => void;
  onDelete: (entry: TimesheetEntry) => void;
}

export function DayRow({ date, entries, onAdd, onEdit, onDelete }: DayRowProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-[80px_1fr] gap-3 py-3">
      <p className="text-sm font-medium text-gray-700">{formatDayLabel(date)}</p>
      <div className="space-y-1.5">
        {entries.map((e) => (
          <EntryRow key={e.id} entry={e} onEdit={onEdit} onDelete={onDelete} />
        ))}
        <AddTaskInline onClick={() => onAdd(date)} />
      </div>
    </div>
  );
}
