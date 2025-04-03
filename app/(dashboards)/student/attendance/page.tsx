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
    <section className="flex flex-col gap-4 w-full  mx-auto p-4 ">
      <div className="flex items-center justify-between">
        <h1 className="text-[#25AAE1] text-xl font-bold">ATTENDENCE</h1>
        <div className="flex gap-4">
          <button
            className="bg-white border rounded-md px-4 py-2 flex items-center justify-center"
            onClick={() => setIsDatePickerOpen(true)}
          >
            <span>TODAY</span>
            <Calendar className="ml-2 h-5 w-5 text-gray-500" />
          </button>

          <Select value={selectedClass} onValueChange={setSelectedClass}>
            <SelectTrigger className="w-[180px] bg-white">
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
          className="bg-[#B066F2] text-white px-6 py-3 rounded-md flex items-center gap-2"
          onClick={() => setIsReportModalOpen(true)}
        >
          <FileText className="h-5 w-5" />
          <span>Report</span>
        </button>
        <button className="bg-[#25AAE1] text-white px-4 py-3 rounded-md" onClick={() => setIsPrintModalOpen(true)}>
          <Printer className="h-5 w-5" />
        </button>
      </div>

      <Card className="rounded-lg shadow-sm p-0 overflow-hidden border-0">
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

