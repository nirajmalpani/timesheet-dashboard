"use client";

import { useEffect, useState } from "react";
import { Filters, type StatusFilter } from "@/components/timesheets/Filters";
import { TimesheetsTable } from "@/components/timesheets/TimesheetsTable";
import { Pagination } from "@/components/ui/Pagination";
import { apiClient } from "@/lib/api-client";
import type { PaginatedResponse, TimesheetWithStatus } from "@/types";

export default function DashboardPage() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [data, setData] = useState<PaginatedResponse<TimesheetWithStatus> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setIsLoading(true);
      setError(null);
      try {
        const res = await apiClient.listTimesheets({
          from: from || undefined,
          to: to || undefined,
          status,
          page,
          pageSize,
        });
        if (!cancelled) setData(res);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Failed to load");
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [from, to, status, page, pageSize]);

  return (
    <div className="bg-white rounded-lg shadow-card border border-gray-100">
      <div className="px-5 py-5 border-b border-gray-100">
        <h1 className="text-xl font-bold text-gray-900">Your Timesheets</h1>
      </div>

      <div className="px-5 py-4 border-b border-gray-100">
        <Filters
          from={from}
          to={to}
          status={status}
          onChange={(next) => {
            setFrom(next.from);
            setTo(next.to);
            setStatus(next.status);
            setPage(1);
          }}
        />
      </div>

      <div className="px-2 sm:px-2 pt-2 pb-3">
        {error ? (
          <div className="py-10 text-center text-sm text-red-600">{error}</div>
        ) : (
          <TimesheetsTable items={data?.items ?? []} isLoading={isLoading} />
        )}
      </div>

      {data && data.total > 0 && (
        <div className="px-5 py-4 border-t border-gray-100">
          <Pagination
            page={page}
            pageSize={pageSize}
            total={data.total}
            onPageChange={setPage}
            onPageSizeChange={(n) => {
              setPageSize(n);
              setPage(1);
            }}
          />
        </div>
      )}
    </div>
  );
}
