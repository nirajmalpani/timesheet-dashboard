/**
 * In-memory mock database. Seeded once from JSON on first import.
 * State persists for the lifetime of the dev server process.
 *
 * NOTE: components must NEVER import this directly. Always go through
 * the /api/* routes (and the typed `apiClient`).
 */
import timesheetsSeed from "@/data/timesheets.json";
import entriesSeed from "@/data/entries.json";
import type { Timesheet, TimesheetEntry } from "@/types";

type Store = {
  timesheets: Timesheet[];
  entries: TimesheetEntry[];
  nextEntryId: number;
};

declare global {
  // eslint-disable-next-line no-var
  var __TS_STORE__: Store | undefined;
}

function createStore(): Store {
  const timesheets = (timesheetsSeed as Timesheet[]).map((t) => ({ ...t }));
  const entries = (entriesSeed as TimesheetEntry[]).map((e) => ({ ...e }));
  // figure out next entry id from "e_<n>" pattern
  const maxId = entries.reduce((m, e) => {
    const n = Number(e.id.replace(/^e_/, ""));
    return Number.isFinite(n) && n > m ? n : m;
  }, 0);
  return { timesheets, entries, nextEntryId: maxId + 1 };
}

const store: Store = globalThis.__TS_STORE__ ?? createStore();
if (process.env.NODE_ENV !== "production") {
  globalThis.__TS_STORE__ = store;
}

export const db = {
  listTimesheets(): Timesheet[] {
    return store.timesheets;
  },
  getTimesheet(id: string): Timesheet | undefined {
    return store.timesheets.find((t) => t.id === id);
  },
  listEntriesByTimesheet(id: string): TimesheetEntry[] {
    return store.entries.filter((e) => e.timesheetId === id);
  },
  getEntry(id: string): TimesheetEntry | undefined {
    return store.entries.find((e) => e.id === id);
  },
  createEntry(input: Omit<TimesheetEntry, "id">): TimesheetEntry {
    const entry: TimesheetEntry = { id: `e_${store.nextEntryId++}`, ...input };
    store.entries.push(entry);
    return entry;
  },
  updateEntry(id: string, patch: Partial<Omit<TimesheetEntry, "id" | "timesheetId">>): TimesheetEntry | undefined {
    const idx = store.entries.findIndex((e) => e.id === id);
    if (idx === -1) return undefined;
    store.entries[idx] = { ...store.entries[idx], ...patch };
    return store.entries[idx];
  },
  deleteEntry(id: string): boolean {
    const idx = store.entries.findIndex((e) => e.id === id);
    if (idx === -1) return false;
    store.entries.splice(idx, 1);
    return true;
  },
};
