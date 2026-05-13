import type {
  PaginatedResponse,
  TimesheetEntry,
  TimesheetWithStatus,
  WeekStatus,
} from "@/types";
import type { EntryInput } from "@/lib/validators";

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });
  if (!res.ok) {
    let message = `Request failed (${res.status})`;
    try {
      const body = await res.json();
      if (body?.error) message = body.error;
    } catch {
      /* ignore */
    }
    throw new Error(message);
  }
  // Some routes return 204
  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

export interface ListTimesheetsParams {
  from?: string;
  to?: string;
  status?: WeekStatus | "all";
  page?: number;
  pageSize?: number;
}

export const apiClient = {
  listTimesheets(params: ListTimesheetsParams = {}): Promise<PaginatedResponse<TimesheetWithStatus>> {
    const qs = new URLSearchParams();
    if (params.from) qs.set("from", params.from);
    if (params.to) qs.set("to", params.to);
    if (params.status && params.status !== "all") qs.set("status", params.status);
    if (params.page) qs.set("page", String(params.page));
    if (params.pageSize) qs.set("pageSize", String(params.pageSize));
    const q = qs.toString();
    return request<PaginatedResponse<TimesheetWithStatus>>(
      `/api/timesheets${q ? `?${q}` : ""}`
    );
  },
  getTimesheet(weekId: string): Promise<{
    timesheet: TimesheetWithStatus;
    entries: TimesheetEntry[];
  }> {
    return request(`/api/timesheets/${weekId}`);
  },
  createEntry(weekId: string, input: EntryInput): Promise<TimesheetEntry> {
    return request(`/api/timesheets/${weekId}/entries`, {
      method: "POST",
      body: JSON.stringify(input),
    });
  },
  updateEntry(weekId: string, entryId: string, input: EntryInput): Promise<TimesheetEntry> {
    return request(`/api/timesheets/${weekId}/entries/${entryId}`, {
      method: "PATCH",
      body: JSON.stringify(input),
    });
  },
  deleteEntry(weekId: string, entryId: string): Promise<void> {
    return request(`/api/timesheets/${weekId}/entries/${entryId}`, {
      method: "DELETE",
    });
  },
};
