"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { AttendanceTable } from "../../../../components/student/attendance/attendance-table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileText, Printer, Calendar, ArrowLeft } from "lucide-react"
import { DatePickerDialog } from "../../../../components/student/attendance/date-picker-dialog"
import { ReportDialog } from "../../../../components/student/attendance/report-dialog"
import { PrintDialog } from "../../../../components/student/attendance/print-dialog"
import { Button } from "@/components/ui/button"

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
              ATTENDANCE
            </h1>
            <p className="text-white/80 text-sm">Track your daily attendance</p>
          </div>
        </div>
      </div>

      <section className="flex flex-col gap-6 w-full mx-auto p-6 bg-gradient-to-br from-blue-50 via-white to-blue-100 min-h-screen rounded-2xl">
        {/* Header Section avec design moderne */}
        <div className="flex items-center justify-between bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-r from-[#25AAE1] to-[#1D8CB3] rounded-xl flex items-center justify-center">
              <Calendar className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#25AAE1]">Attendance Records</h2>
              <p className="text-gray-600 text-sm">Manage your attendance data</p>
            </div>
          </div>
          
          <div className="flex gap-4">
            <button
              className="bg-white border-2 border-[#25AAE1] rounded-xl px-6 py-3 flex items-center gap-3 hover:bg-[#25AAE1] hover:text-white transition-all duration-300 shadow-md"
              onClick={() => setIsDatePickerOpen(true)}
            >
              <span className="text-[#25AAE1] font-semibold hover:text-white transition-colors">TODAY</span>
              <Calendar className="h-5 w-5 text-[#25AAE1] hover:text-white transition-colors" />
            </button>

            <Select value={selectedClass} onValueChange={setSelectedClass}>
              <SelectTrigger className="w-[200px] bg-white border-2 border-[#25AAE1] rounded-xl shadow-md">
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

        {/* Action buttons avec design moderne */}
        <div className="flex gap-4">
          <button
            className="bg-gradient-to-r from-[#25AAE1] to-[#1D8CB3] text-white px-8 py-4 rounded-xl flex items-center gap-3 hover:shadow-lg hover:scale-105 transition-all duration-300 shadow-md"
            onClick={() => setIsReportModalOpen(true)}
          >
            <FileText className="h-6 w-6" />
            <span className="font-semibold">Generate Report</span>
          </button>
          
          <button 
            className="bg-gradient-to-r from-[#25AAE1] to-[#1D8CB3] text-white px-6 py-4 rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300 shadow-md" 
            onClick={() => setIsPrintModalOpen(true)}
            title="Print"
          >
            <Printer className="h-6 w-6" />
          </button>
        </div>

        {/* Table avec design moderne */}
        <Card className="rounded-2xl shadow-xl p-0 overflow-hidden border-0 bg-white">
          <div className="bg-gradient-to-r from-[#25AAE1] to-[#1D8CB3] p-4">
            <h2 className="text-white font-bold text-lg">Attendance Records</h2>
          </div>
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
    </div>
  )
}

