"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Minus, Plus } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import {
  PROJECT_OPTIONS,
  WORK_TYPE_OPTIONS,
  entrySchema,
  type EntryInput,
} from "@/lib/validators";
import type { TimesheetEntry } from "@/types";

interface AddEntryModalProps {
  open: boolean;
  onClose: () => void;
  /** Defaults to today's-day-in-the-week if creating */
  defaultDate: string;
  /** Pass an existing entry to edit */
  initial?: TimesheetEntry;
  onSubmit: (values: EntryInput) => Promise<void> | void;
}

export function AddEntryModal({
  open,
  onClose,
  defaultDate,
  initial,
  onSubmit,
}: AddEntryModalProps) {
  const isEdit = Boolean(initial);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<EntryInput>({
    resolver: zodResolver(entrySchema),
    defaultValues: {
      date: defaultDate,
      project: undefined as unknown as EntryInput["project"],
      typeOfWork: undefined as unknown as EntryInput["typeOfWork"],
      description: "",
      hours: 1,
    },
  });

  // Reset form whenever the modal opens or the target entry changes
  useEffect(() => {
    if (!open) return;
    reset({
      date: initial?.date ?? defaultDate,
      project: initial?.project ?? (undefined as unknown as EntryInput["project"]),
      typeOfWork:
        initial?.typeOfWork ?? (undefined as unknown as EntryInput["typeOfWork"]),
      description: initial?.description ?? "",
      hours: initial?.hours ?? 1,
    });
  }, [open, initial, defaultDate, reset]);

  const hours = watch("hours");

  async function submit(values: EntryInput) {
    await onSubmit(values);
    onClose();
  }

  return (
    <Modal open={open} onClose={onClose} title={isEdit ? "Edit Entry" : "Add New Entry"}>
      <form onSubmit={handleSubmit(submit)} noValidate className="space-y-4" aria-label="Entry form">
        <Select
          label="Select Project *"
          placeholder="Project Name"
          error={errors.project?.message}
          {...register("project")}
        >
          {PROJECT_OPTIONS.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </Select>

        <Select
          label="Type of Work *"
          placeholder="Select…"
          error={errors.typeOfWork?.message}
          {...register("typeOfWork")}
        >
          {WORK_TYPE_OPTIONS.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </Select>

        <Textarea
          label="Task description *"
          placeholder="Write text here ..."
          hint="A note for extra info"
          error={errors.description?.message}
          {...register("description")}
        />

        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-800">
            Hours *
          </label>
          <div className="inline-flex items-center rounded-md border border-gray-200">
            <button
              type="button"
              onClick={() => setValue("hours", Math.max(1, (hours ?? 1) - 1), { shouldValidate: true })}
              className="h-9 w-9 flex items-center justify-center text-gray-600 hover:bg-gray-50"
              aria-label="Decrease hours"
            >
              <Minus className="h-4 w-4" />
            </button>
            <input
              type="number"
              min={1}
              max={24}
              step={1}
              {...register("hours", { valueAsNumber: true })}
              className="h-9 w-14 text-center text-sm border-x border-gray-200 focus:outline-none"
            />
            <button
              type="button"
              onClick={() => setValue("hours", Math.min(24, (hours ?? 1) + 1), { shouldValidate: true })}
              className="h-9 w-9 flex items-center justify-center text-gray-600 hover:bg-gray-50"
              aria-label="Increase hours"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
          {errors.hours && (
            <p className="mt-1 text-xs text-red-600">{errors.hours.message}</p>
          )}
        </div>

        <input type="hidden" {...register("date")} />

        <div className="flex items-center gap-3 pt-2">
          <Button type="submit" isLoading={isSubmitting} className="flex-1">
            {isEdit ? "Save changes" : "Add entry"}
          </Button>
          <Button type="button" variant="secondary" onClick={onClose} className="flex-1">
            Cancel
          </Button>
        </div>
      </form>
    </Modal>
  );
}
