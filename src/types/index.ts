export type WeekStatus = "completed" | "incomplete" | "missing";

export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
}

export interface Timesheet {
  id: string;
  weekNumber: number;
  weekStart: string; // ISO date "2024-01-01"
  weekEnd: string; // ISO date "2024-01-05"
}

export type ProjectName =
  | "Homepage Development"
  | "Mobile App"
  | "Internal Tools"
  | "Marketing Site";

export type WorkType =
  | "Bug fixes"
  | "Feature"
  | "Documentation"
  | "Meeting"
  | "Review";

export interface TimesheetEntry {
  id: string;
  timesheetId: string;
  date: string; // ISO date "2024-01-21"
  project: ProjectName;
  typeOfWork: WorkType;
  description: string;
  hours: number;
}

export interface TimesheetWithStatus extends Timesheet {
  totalHours: number;
  status: WeekStatus;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}
