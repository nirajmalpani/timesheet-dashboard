"use client";

import { MoreHorizontal } from "lucide-react";
import { Dropdown, DropdownItem } from "@/components/ui/Dropdown";
import type { TimesheetEntry } from "@/types";

interface EntryRowProps {
  entry: TimesheetEntry;
  onEdit: (entry: TimesheetEntry) => void;
  onDelete: (entry: TimesheetEntry) => void;
}

export function EntryRow({ entry, onEdit, onDelete }: EntryRowProps) {
  return (
    <div className="flex items-center justify-between gap-3 py-2.5 px-3 rounded-md hover:bg-gray-50 group">
      <p className="flex-1 text-sm text-gray-800 truncate" title={entry.description}>
        {entry.description}
      </p>
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        <span className="text-xs text-gray-500 tabular-nums">{entry.hours} hrs</span>
        <span className="hidden sm:inline-flex items-center rounded bg-brand-50 px-2 py-0.5 text-xs font-medium text-brand-700">
          {entry.project}
        </span>
        <Dropdown
          trigger={
            <span className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
              <MoreHorizontal className="h-4 w-4" />
            </span>
          }
        >
          {(close) => (
            <>
              <DropdownItem
                onClick={() => {
                  close();
                  onEdit(entry);
                }}
              >
                Edit
              </DropdownItem>
              <DropdownItem
                destructive
                onClick={() => {
                  close();
                  onDelete(entry);
                }}
              >
                Delete
              </DropdownItem>
            </>
          )}
        </Dropdown>
      </div>
    </div>
  );
}
