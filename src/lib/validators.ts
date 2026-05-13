import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  remember: z.boolean().optional(),
});
export type LoginInput = z.infer<typeof loginSchema>;

export const PROJECT_OPTIONS = [
  "Homepage Development",
  "Mobile App",
  "Internal Tools",
  "Marketing Site",
] as const;

export const WORK_TYPE_OPTIONS = [
  "Bug fixes",
  "Feature",
  "Documentation",
  "Meeting",
  "Review",
] as const;

export const entrySchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date"),
  project: z.enum(PROJECT_OPTIONS, {
    errorMap: () => ({ message: "Select a project" }),
  }),
  typeOfWork: z.enum(WORK_TYPE_OPTIONS, {
    errorMap: () => ({ message: "Select a type of work" }),
  }),
  description: z
    .string()
    .min(3, "Description must be at least 3 characters")
    .max(500, "Description is too long"),
  hours: z
    .number({ invalid_type_error: "Hours is required" })
    .min(1, "At least 1 hour")
    .max(24, "Cannot exceed 24 hours"),
});
export type EntryInput = z.infer<typeof entrySchema>;
