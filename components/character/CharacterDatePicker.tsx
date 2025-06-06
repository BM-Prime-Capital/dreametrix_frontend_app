"use client";

import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { format, addDays, subDays } from "date-fns";
import { cn } from "@/utils/tailwind";

interface CharacterDatePickerProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  disabled?: boolean;
}

export function CharacterDatePicker({
  selectedDate,
  onDateChange,
  disabled = false,
}: CharacterDatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handlePreviousDay = () => {
    onDateChange(subDays(selectedDate, 1));
  };

  const handleNextDay = () => {
    const nextDay = addDays(selectedDate, 1);
    // Prevent navigation to future dates
    if (nextDay <= new Date()) {
      onDateChange(nextDay);
    }
  };

  const handleToday = () => {
    onDateChange(new Date());
  };

  const isToday =
    format(selectedDate, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd");
  const isFuture = selectedDate > new Date();
  const canGoNext = addDays(selectedDate, 1) <= new Date();

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="icon"
        onClick={handlePreviousDay}
        disabled={disabled}
        className="h-9 w-9"
        title="Previous day"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "justify-start text-left font-normal min-w-[200px]",
              !selectedDate && "text-muted-foreground"
            )}
            disabled={disabled}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {selectedDate ? (
              <div className="flex items-center gap-2">
                <span>{format(selectedDate, "PPP")}</span>
                {isToday && (
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                    Today
                  </span>
                )}
                {/* Removed future indicator since future dates are now disabled */}
              </div>
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <div className="p-3 border-b">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Select Date</h4>
              {!isToday && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleToday}
                  className="text-blue-600 hover:text-blue-800"
                >
                  Today
                </Button>
              )}
            </div>
          </div>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => {
              if (date && date <= new Date()) {
                onDateChange(date);
                setIsOpen(false);
              }
            }}
            disabled={(date) => date > new Date()}
            initialFocus
          />
        </PopoverContent>
      </Popover>

      <Button
        variant="outline"
        size="icon"
        onClick={handleNextDay}
        disabled={disabled || !canGoNext}
        className="h-9 w-9"
        title={canGoNext ? "Next day" : "Cannot navigate to future dates"}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
