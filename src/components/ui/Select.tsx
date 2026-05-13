import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/cn";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  placeholder?: string;
  children: React.ReactNode;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  function Select(
    { className, label, error, placeholder, children, id, ...props },
    ref
  ) {
    const reactId = React.useId();
    const selectId = id ?? reactId;
    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={selectId}
            className="mb-1.5 block text-sm font-medium text-gray-800"
          >
            {label}
          </label>
        )}
        <div className="relative">
          <select
            id={selectId}
            ref={ref}
            className={cn(
              "block w-full h-10 appearance-none rounded-md border border-gray-200 bg-white pl-3 pr-9 text-sm",
              "focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent",
              error && "border-red-400 focus:ring-red-400",
              className
            )}
            {...props}
          >
            {placeholder !== undefined && (
              <option value="">{placeholder}</option>
            )}
            {children}
          </select>
          <ChevronDown
            className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500"
            aria-hidden
          />
        </div>
        {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
      </div>
    );
  }
);
