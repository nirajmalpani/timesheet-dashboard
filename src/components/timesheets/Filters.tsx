"use client";

import { Select } from "@/components/ui/Select";
import { Input } from "@/components/ui/Input";
import type { WeekStatus } from "@/types";

export type StatusFilter = WeekStatus | "all";

interface FiltersProps {
  from: string;
  to: string;
  status: StatusFilter;
  onChange: (next: { from: string; to: string; status: StatusFilter }) => void;
}

export function Filters({ from, to, status, onChange }: FiltersProps) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:max-w-2xl">
      <Input
        type="date"
        label="From"
        value={from}
        onChange={(e) => onChange({ from: e.target.value, to, status })}
      />
      <Input
        type="date"
        label="To"
        value={to}
        onChange={(e) => onChange({ from, to: e.target.value, status })}
      />
      <Select
        label="Status"
        value={status}
        onChange={(e) =>
          onChange({ from, to, status: e.target.value as StatusFilter })
        }
      >
        <option value="all">All</option>
        <option value="completed">Completed</option>
        <option value="incomplete">Incomplete</option>
        <option value="missing">Missing</option>
      </Select>
    </div>
  );
}
