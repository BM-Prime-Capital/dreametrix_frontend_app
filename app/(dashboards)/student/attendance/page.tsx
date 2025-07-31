"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { AttendanceTable } from "../../../../components/student/attendance/attendance-table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileText, Printer, Calendar } from "lucide-react"
import { DatePickerDialog } from "../../../../components/student/attendance/date-picker-dialog"
import { ReportDialog } from "../../../../components/student/attendance/report-dialog"
import { PrintDialog } from "../../../../components/student/attendance/print-dialog"

export default function AttendancePage() {
  const [selectedClass, setSelectedClass] = useState<string>("all-classes")
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false)
  const [isReportModalOpen, setIsReportModalOpen] = useState(false)
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false)
  const [, setSelectedDate] = useState<number>(0)

  const handleDateSelection = (date: number) => {
    setSelectedDate(date)
  }

  return (
    <section className="flex flex-col gap-4 w-full mx-auto p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-primary text-xl font-bold">ATTENDANCE</h1>
        <div className="flex gap-4">
          <button
            className="bg-card border border-border rounded-md px-4 py-2 flex items-center justify-center hover:bg-accent/5 transition-colors"
            onClick={() => setIsDatePickerOpen(true)}
          >
            <span className="text-foreground">TODAY</span>
            <Calendar className="ml-2 h-5 w-5 text-muted-foreground" />
          </button>

          <Select value={selectedClass} onValueChange={setSelectedClass}>
            <SelectTrigger className="w-[180px] bg-card border-border">
              <SelectValue placeholder="All Classes" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-classes">All Classes</SelectItem>
              <SelectItem value="class-5-math">Class 5 - Math</SelectItem>
              <SelectItem value="class-n-1">Class N</SelectItem>
              <SelectItem value="class-n-2">Class N</SelectItem>
              <SelectItem value="class-n-3">Class N</SelectItem>
              <SelectItem value="class-n-4">Class N</SelectItem>
              <SelectItem value="class-n-5">Class N</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex gap-4">
        <button
          className="bg-secondary text-white px-6 py-3 rounded-md flex items-center gap-2 hover:bg-secondary-hover transition-colors"
          onClick={() => setIsReportModalOpen(true)}
        >
          <FileText className="h-5 w-5" />
          <span>Report</span>
        </button>
        <button 
          className="bg-primary text-white px-4 py-3 rounded-md hover:bg-primary-hover transition-colors" 
          onClick={() => setIsPrintModalOpen(true)}
          title="Print"
        >
          <Printer className="h-5 w-5" />
        </button>
      </div>

      <Card className="rounded-lg shadow-sm p-0 overflow-hidden border">
        <AttendanceTable />
      </Card>

      <DatePickerDialog
        isOpen={isDatePickerOpen}
        onClose={() => setIsDatePickerOpen(false)}
        onApply={handleDateSelection}
      />

      <ReportDialog isOpen={isReportModalOpen} onClose={() => setIsReportModalOpen(false)} />

      <PrintDialog isOpen={isPrintModalOpen} onClose={() => setIsPrintModalOpen(false)} />
    </section>
  )
}

