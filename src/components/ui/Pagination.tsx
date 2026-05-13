"use client";

import { cn } from "@/lib/cn";

interface PaginationProps {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  pageSizeOptions?: number[];
}

function buildPages(current: number, last: number): (number | "…")[] {
  if (last <= 8) return Array.from({ length: last }, (_, i) => i + 1);
  const pages: (number | "…")[] = [];
  pages.push(1);
  if (current > 3) pages.push("…");
  const start = Math.max(2, current - 1);
  const end = Math.min(last - 1, current + 1);
  for (let i = start; i <= end; i++) pages.push(i);
  if (current < last - 2) pages.push("…");
  pages.push(last);
  return pages;
}

export function Pagination({
  page,
  pageSize,
  total,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [5, 10, 20],
}: PaginationProps) {
  const last = Math.max(1, Math.ceil(total / pageSize));
  const pages = buildPages(page, last);

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      {onPageSizeChange && (
        <div className="text-sm">
          <label className="inline-flex items-center gap-2">
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="h-8 rounded-md border border-gray-200 bg-white px-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              aria-label="Items per page"
            >
              {pageSizeOptions.map((n) => (
                <option key={n} value={n}>
                  {n} per page
                </option>
              ))}
            </select>
          </label>
        </div>
      )}

      <nav className="flex items-center gap-1" aria-label="Pagination">
        <button
          type="button"
          onClick={() => onPageChange(Math.max(1, page - 1))}
          disabled={page <= 1}
          className="h-8 px-2 rounded-md text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        {pages.map((p, i) =>
          p === "…" ? (
            <span key={`gap-${i}`} className="px-2 text-gray-500 text-sm">
              …
            </span>
          ) : (
            <button
              key={p}
              type="button"
              onClick={() => onPageChange(p)}
              className={cn(
                "h-8 min-w-8 px-2 rounded-md text-sm",
                p === page
                  ? "bg-brand-50 text-brand-700 font-semibold"
                  : "text-gray-700 hover:bg-gray-100"
              )}
              aria-current={p === page ? "page" : undefined}
            >
              {p}
            </button>
          )
        )}
        <button
          type="button"
          onClick={() => onPageChange(Math.min(last, page + 1))}
          disabled={page >= last}
          className="h-8 px-2 rounded-md text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </nav>
    </div>
  );
}
