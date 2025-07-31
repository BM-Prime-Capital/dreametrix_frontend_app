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
      <div className="bg-gradient-to-r from-primary via-secondary to-accent p-6 rounded-lg shadow-lg">
        <div className="flex items-center gap-4 text-white">
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/20 p-2"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold text-white tracking-wide">
            ASSIGNMENTS
          </h1>
        </div>
      </div>
      <section className="flex flex-col gap-6 w-full mx-auto p-6 bg-muted/30 min-h-screen">
        {/* Header Section */}

        <div className="flex items-center justify-between bg-card p-4 rounded-lg shadow-sm border">
          <div className="flex items-center gap-4">
            <div className="text-muted-foreground font-medium">Filter Assignments</div>
            {(selectedClass !== "all-classes" || dateFilter !== "all-days") && (
              <button
                onClick={() => {
                  setSelectedClass("all-classes");
                  setSelectedDates([]);
                  setDateFilter("all-days");
                }}
                className="text-sm text-primary hover:text-primary-hover font-medium"
              >
                Clear Filters
              </button>
            )}
          </div>
          <div className="flex gap-3">
            <button
              className="bg-card border border-border rounded-lg px-4 py-2 flex items-center gap-2 hover:bg-accent/5 transition-colors shadow-sm"
              onClick={() => setIsDatePickerOpen(true)}
            >
              <span className="text-foreground font-medium">
                {dateFilter === "custom" && selectedDates.length > 0
                  ? `${selectedDates.length} day${
                      selectedDates.length > 1 ? "s" : ""
                    } selected`
                  : "All Days"}
              </span>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </button>

            {/* <Select value={selectedClass} onValueChange={setSelectedClass}>
              <SelectTrigger className="w-[200px] bg-white border-gray-300 shadow-sm">
                <SelectValue placeholder="All Classes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-classes">All Classes</SelectItem>
                <SelectItem value="class-8-ela">Class 8 - ELA</SelectItem>
                <SelectItem value="class-8-math">Class 8 - Math</SelectItem>
              </SelectContent>
            </Select> */}
          </div>
        </div>

        <Card className="rounded-2xl shadow-sm p-0 overflow-hidden border bg-card">
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
