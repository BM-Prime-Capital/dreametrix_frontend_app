"use client";

import PageTitleH1 from "@/components/ui/page-title-h1";
import TeachFiltersPopUp from "./TeachFiltersPopUp";
import { useState } from "react";
import { FullScreenCalendar } from "./FullScreenCalendar";
import { TeachMaterialsPopup } from "./TeachMaterialsPopup";

export default function Teach() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showMaterialsPopup, setShowMaterialsPopup] = useState(false);

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setShowMaterialsPopup(true);
  };

  const handlePopupClose = (open: boolean) => {
    setShowMaterialsPopup(open);
    if (!open) {
      // Reset only the popup visibility, not the selected date
      // so the calendar keeps the selection
    }
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
        <FullScreenCalendar 
          onDateSelect={handleDateSelect} 
          selectedDate={selectedDate} 
        />
      </div>

      {selectedDate && (
        <TeachMaterialsPopup
          date={selectedDate}
          open={showMaterialsPopup}
          onOpenChange={handlePopupClose}
        />
      )}
    </section>
  );
}