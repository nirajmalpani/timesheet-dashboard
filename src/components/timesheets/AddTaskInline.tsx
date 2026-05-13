"use client";

import { Plus } from "lucide-react";

interface AddTaskInlineProps {
  onClick: () => void;
}

export function AddTaskInline({ onClick }: AddTaskInlineProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full flex items-center justify-center gap-2 rounded-md border border-dashed border-brand-300 bg-brand-50/40 py-2 text-sm font-medium text-brand-700 hover:bg-brand-50"
    >
      <Plus className="h-4 w-4" /> Add new task
    </button>
  );
}
