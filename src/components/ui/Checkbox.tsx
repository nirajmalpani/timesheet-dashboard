import * as React from "react";
import { cn } from "@/lib/cn";

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  function Checkbox({ className, label, id, ...props }, ref) {
    const reactId = React.useId();
    const inputId = id ?? reactId;
    return (
      <label
        htmlFor={inputId}
        className="inline-flex items-center gap-2 cursor-pointer select-none text-sm text-gray-700"
      >
        <input
          id={inputId}
          ref={ref}
          type="checkbox"
          className={cn(
            "h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500",
            className
          )}
          {...props}
        />
        {label && <span>{label}</span>}
      </label>
    );
  }
);
