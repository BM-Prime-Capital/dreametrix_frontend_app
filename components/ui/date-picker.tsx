// components/ui/date-picker.tsx
"use client";

import { Calendar as CalendarIcon } from "lucide-react";
import * as React from "react";

interface DatePickerProps {
  selected?: Date;
  onSelect?: (date: Date) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function DatePicker({ 
  selected = new Date(), 
  onSelect = () => {}, 
  placeholder = "Select date",
  disabled = false 
}: DatePickerProps) {
  return (
    <div className="relative">
      <input
        type="date"
        value={selected.toISOString().split("T")[0]}
        onChange={(e) => onSelect(new Date(e.target.value))}
        disabled={disabled}
        className={`
          flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm
          ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium
          placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2
          focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed
          disabled:opacity-50 ${disabled ? "opacity-50 cursor-not-allowed" : ""}
        `}
        placeholder={placeholder}
      />
      {!disabled && (
        <CalendarIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 opacity-70" />
      )}
    </div>
  );
}