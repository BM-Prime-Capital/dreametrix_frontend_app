"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AssignmentsTable } from "../../../../components/student/assignments/assignments-table";

import { Calendar, ArrowLeft } from "lucide-react";
import { DatePickerDialog } from "../../../../components/student/assignments/date-picker-dialog";

export default function AssignmentsPage() {
  const [selectedClass, setSelectedClass] = useState<string>("all-classes");
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [selectedDates, setSelectedDates] = useState<number[]>([]);
  const [dateFilter, setDateFilter] = useState<string>("all-days");

  const handleDateSelection = (dates: number[]) => {
    setSelectedDates(dates);
    setDateFilter(dates.length > 0 ? "custom" : "all-days");
  };

  return (
    <div className="flex flex-col gap-6 w-full min-h-screen">
      {/* Header avec gradient moderne */}
      <div className="bg-gradient-to-r from-[#25AAE1] via-[#25AAE1] to-[#1D8CB3] p-8 rounded-2xl shadow-xl">
        <div className="flex items-center gap-4 text-white">
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/20 p-3 rounded-full transition-all duration-200"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-white tracking-wide mb-1">
              ASSIGNMENTS
            </h1>
            <p className="text-white/80 text-sm">Manage and track your assignments</p>
          </div>
        </div>
      </div>

      <section className="flex flex-col gap-6 w-full mx-auto p-6 bg-gradient-to-br from-blue-50 via-white to-blue-100 min-h-screen rounded-2xl">
        {/* Header Section avec design moderne */}
        <div className="flex items-center justify-between bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="text-gray-700 font-semibold text-lg">Filter Assignments</div>
            {(selectedClass !== "all-classes" || dateFilter !== "all-days") && (
              <button
                onClick={() => {
                  setSelectedClass("all-classes");
                  setSelectedDates([]);
                  setDateFilter("all-days");
                }}
                className="text-sm text-[#25AAE1] hover:text-[#1D8CB3] font-medium bg-blue-50 px-3 py-1 rounded-full transition-all duration-200"
              >
                Clear Filters
              </button>
            )}
          </div>
          <div className="flex gap-3">
            <button
              className="bg-white border-2 border-[#25AAE1] rounded-xl px-6 py-3 flex items-center gap-3 hover:bg-[#25AAE1] hover:text-white transition-all duration-300 shadow-md"
              onClick={() => setIsDatePickerOpen(true)}
            >
              <span className="text-[#25AAE1] font-semibold hover:text-white transition-colors">
                {dateFilter === "custom" && selectedDates.length > 0
                  ? `${selectedDates.length} day${
                      selectedDates.length > 1 ? "s" : ""
                    } selected`
                  : "All Days"}
              </span>
              <Calendar className="h-5 w-5 text-[#25AAE1] hover:text-white transition-colors" />
            </button>
          </div>
        </div>

        {/* Table avec design moderne */}
        <Card className="rounded-2xl shadow-xl p-0 overflow-hidden border-0 bg-white">
          <div className="bg-gradient-to-r from-[#25AAE1] to-[#1D8CB3] p-4">
            <h2 className="text-white font-bold text-lg">Your Assignments</h2>
          </div>
          <AssignmentsTable
            selectedClass={selectedClass}
            selectedDates={selectedDates}
            dateFilter={dateFilter}
          />
        </Card>

        <DatePickerDialog
          isOpen={isDatePickerOpen}
          onClose={() => setIsDatePickerOpen(false)}
          onApply={handleDateSelection}
        />
      </section>
    </div>
  );
}
