"use client";

import Link from "next/link";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { actionLabelForStatus, formatWeekRange } from "@/lib/week-utils";
import type { TimesheetWithStatus } from "@/types";

interface Props {
  items: TimesheetWithStatus[];
  isLoading?: boolean;
}

export function TimesheetsTable({ items, isLoading }: Props) {
  if (isLoading) {
    return (
      <div className="py-10 text-center text-sm text-gray-500" role="status">
        Loading timesheets…
      </div>
    );
  }
  if (items.length === 0) {
    return (
      <div className="py-10 text-center text-sm text-gray-500">
        No timesheets match your filters.
      </div>
    );
  }

  return (
    <>
      {/* Desktop table */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
              <th className="px-4 py-3 text-left font-medium">Week #</th>
              <th className="px-4 py-3 text-left font-medium">Date</th>
              <th className="px-4 py-3 text-left font-medium">Status</th>
              <th className="px-4 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {items.map((t) => (
              <tr key={t.id} className="hover:bg-gray-50/60">
                <td className="px-4 py-3 text-gray-700">{t.weekNumber}</td>
                <td className="px-4 py-3 text-gray-700">
                  {formatWeekRange(t.weekStart, t.weekEnd)}
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={t.status} />
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/dashboard/${t.id}`}
                    className="text-brand-600 hover:underline font-medium"
                  >
                    {actionLabelForStatus(t.status)}
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <ul className="sm:hidden divide-y divide-gray-100">
        {items.map((t) => (
          <li key={t.id} className="px-2 py-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  Week {t.weekNumber}
                </p>
                <p className="text-xs text-gray-500">
                  {formatWeekRange(t.weekStart, t.weekEnd)}
                </p>
              </div>
              <StatusBadge status={t.status} />
            </div>
            <div className="mt-2">
              <Link
                href={`/dashboard/${t.id}`}
                className="text-sm text-brand-600 font-medium hover:underline"
              >
                {actionLabelForStatus(t.status)}
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
