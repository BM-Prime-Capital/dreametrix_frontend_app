"use client";

import PageTitleH1 from "@/components/ui/page-title-h1";
import TeachFiltersPopUp from "./TeachFiltersPopUp";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import PlanGeneralView from "./PlanGeneralView";
import { ChevronLeft } from "lucide-react";
import { FullScreenCalendar } from "./FullScreenCalendar";
import { AddTeachDialog } from "./AddTeachDialog";
import { PrintTeachDialog } from "./PrintTeachDialog";

export default function Teach() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  const handleBackToCalendar = () => {
    setSelectedDate(null);
  };

  return (
 
    <section className="flex flex-col gap-2 w-full">
      <div className="flex justify-between items-center bg-[#3e81d4] custom-calendar-primary px-6 py-4 rounded-md shadow-md">

        <PageTitleH1 title="Teach" className="text-white" />
        <div className="flex items-center gap-6">

          <TeachFiltersPopUp />
        </div>
      </div>

      <div className="flex-1 p-6 min-h-0">
        {selectedDate ? (
          <div className="h-full flex flex-col bg-white rounded-xl shadow-md p-6">
            <Button 
              onClick={handleBackToCalendar}
              variant="ghost"
              className="w-fit mb-6 px-4 py-2 bg-gray-100 hover:bg-gray-200"
            >
              <ChevronLeft className="mr-2 h-5 w-5" />
              <span className="text-lg">Back to Calendar</span>
            </Button>
            <PlanGeneralView 
              changeView={() => {}} 
              selectedDate={selectedDate}
            />
          </div>
        ) : (
          <FullScreenCalendar onDateSelect={handleDateSelect} />
        )}
      </div>

    </section>
  );
}