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
      // Also update current month view if needed
      if (!isSameMonth(currentDate, externalSelectedDate)) {
        setCurrentDate(externalSelectedDate);
      }
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
      <div className="flex items-center justify-between mb-8">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={prevMonth}
          className="rounded-xl border-gray-300 hover:bg-blue-50 hover:border-blue-300"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          {format(currentDate, "MMMM yyyy")}
        </h2>
        
        <Button 
          variant="outline" 
          size="icon" 
          onClick={nextMonth}
          className="rounded-xl border-gray-300 hover:bg-blue-50 hover:border-blue-300"
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>
    );
  };

  const renderDays = () => {
    const days = [];
    const date = startOfWeek(currentDate);
    
    for (let i = 0; i < 7; i++) {
      days.push(
        <div key={i} className="text-center font-bold text-gray-700 py-4 bg-gradient-to-b from-gray-50 to-gray-100 border-b border-gray-200">
          {format(addDays(date, i), "EEEE")}
        </div>
      );
    }

    return <div className="grid grid-cols-7 gap-0 rounded-t-xl overflow-hidden border border-gray-200">{days}</div>;
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
            className={`flex flex-col items-center justify-center transition-all duration-200
              border border-gray-200 relative group
              ${!isCurrentMonth ? "bg-gray-50/50 text-gray-400" : "bg-white text-gray-800"}
              ${isSelected ? "!bg-gradient-to-br !from-blue-500 !to-indigo-600 !text-white !border-blue-600 shadow-lg scale-105" : ""}
              ${isTodayDate && !isSelected ? "!bg-gradient-to-br !from-blue-100 !to-indigo-100 !text-blue-800 font-bold border-2 border-blue-400" : ""}
              h-full min-h-[100px] cursor-pointer
              hover:bg-gradient-to-br hover:from-blue-50 hover:to-indigo-50 hover:border-blue-300 hover:shadow-md hover:scale-102`}
            onClick={() => handleDateClick(cloneDay)}
          >
            <span className={`text-lg font-semibold mb-1 ${isSelected ? 'text-white' : ''}`}>
              {format(day, "d")}
            </span>
            {isCurrentMonth && (
              <div className="flex flex-col items-center space-y-1">
                <div className={`w-2 h-2 rounded-full ${Math.random() > 0.7 ? 'bg-green-400' : 'bg-transparent'}`}></div>
                <div className={`w-2 h-2 rounded-full ${Math.random() > 0.8 ? 'bg-orange-400' : 'bg-transparent'}`}></div>
              </div>
            )}
            {isSelected && (
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-lg"></div>
            )}
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

    return <div className="space-y-0 border-l border-r border-b border-gray-200 rounded-b-xl overflow-hidden">{rows}</div>;
  };

  return (
    <Card className="w-full h-full p-8 bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl border border-gray-100">
      <div className="h-full flex flex-col">
        {renderHeader()}
        {renderDays()}
        <div className="flex-1 overflow-auto py-4">
          {renderCells()}
        </div>
      </div>
    </Card>
  );
}