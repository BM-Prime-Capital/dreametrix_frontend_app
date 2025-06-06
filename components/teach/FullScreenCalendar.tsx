"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  isSameMonth, 
  isSameDay, 
  addDays, 
  isToday 
} from "date-fns";

export function FullScreenCalendar({ 
  onDateSelect, 
  selectedDate: externalSelectedDate 
}: { 
  onDateSelect: (date: Date) => void;
  selectedDate: Date | null;
}) {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [internalSelectedDate, setInternalSelectedDate] = useState<Date | null>(null);

  // Synchronize with external selected date
  useEffect(() => {
    if (externalSelectedDate) {
      setInternalSelectedDate(externalSelectedDate);
      setCurrentDate(externalSelectedDate);
    } else {
      setInternalSelectedDate(null);
    }
  }, [externalSelectedDate]);

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  const handleDateClick = (day: Date) => {
    setInternalSelectedDate(day);
    onDateSelect(day);
  };

  const renderHeader = () => {
    return (
      <div className="flex items-center justify-between mb-6">
        <Button variant="outline" size="icon" onClick={prevMonth}>
          <ChevronLeft className="h-6 w-6" />
        </Button>
        
        <h2 className="text-2xl font-bold text-gray-800">
          {format(currentDate, "MMMM yyyy")}
        </h2>
        
        <Button variant="outline" size="icon" onClick={nextMonth}>
          <ChevronRight className="h-6 w-6" />
        </Button>
      </div>
    );
  };

  const renderDays = () => {
    const days = [];
    const date = startOfWeek(currentDate);
    
    for (let i = 0; i < 7; i++) {
      days.push(
        <div key={i} className="text-center font-semibold text-gray-600 py-3 border-b border-gray-200">
          {format(addDays(date, i), "EEE")}
        </div>
      );
    }

    return <div className="grid grid-cols-7 gap-0 border-t border-gray-200">{days}</div>;
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const rows = [];
    let days = [];
    let day = startDate;

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const cloneDay = day;
        const isCurrentMonth = isSameMonth(day, monthStart);
        const isSelected = internalSelectedDate && isSameDay(day, internalSelectedDate);
        const isTodayDate = isToday(day);
        
        days.push(
          <div
            key={day.toString()}
            className={`flex items-center justify-center rounded-lg transition-all
              border border-gray-200
              ${!isCurrentMonth ? "bg-gray-50 text-gray-400" : "bg-white text-gray-800"}
              ${isSelected ? "!bg-blue-600 !text-white !border-blue-700" : ""}
              ${isTodayDate ? "!bg-blue-100 !text-blue-800 font-bold border-2 border-blue-500" : ""}
              h-full min-h-[80px] aspect-square cursor-pointer
              hover:bg-gray-100`}
            onClick={() => handleDateClick(cloneDay)}
          >
            {format(day, "d")}
          </div>
        );
        day = addDays(day, 1);
      }
      
      rows.push(
        <div key={day.toString()} className="grid grid-cols-7 gap-0">
          {days}
        </div>
      );
      days = [];
    }

    return <div className="space-y-0 border-l border-gray-200">{rows}</div>;
  };

  return (
    <Card className="w-full h-full p-8 bg-white shadow-lg rounded-xl">
      <div className="h-full flex flex-col">
        {renderHeader()}
        {renderDays()}
        <div className="flex-1 overflow-auto py-4 border-t border-gray-200">
          {renderCells()}
        </div>
      </div>
    </Card>
  );
}