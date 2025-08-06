"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { ParentAttendanceTable } from "@/components/parents/attendance/parent-attendance-table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileText, Printer, Calendar, RefreshCw, Loader2, AlertCircle } from "lucide-react"
import { DatePickerDialog } from "@/components/parents/attendance/date-picker-dialog"
import { ReportDialog } from "@/components/parents/attendance/report-dialog"
import { PrintDialog } from "@/components/parents/attendance/print-dialog"
import { useParentAttendance } from "@/hooks/useParentAttendance"
import { useRequestInfo } from "@/hooks/useRequestInfo"

export default function ParentAttendancePage() {
  const { accessToken } = useRequestInfo()
  const [selectedClass, setSelectedClass] = useState<string>("all-classes")
  const [selectedStudent, setSelectedStudent] = useState<string>("all-students")
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false)
  const [isReportModalOpen, setIsReportModalOpen] = useState(false)
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState<string>("TODAY")

  const {
    children,
    attendanceData,
    classData,
    loading,
    error,
    refreshData,
    currentPage,
    totalPages,
    itemsPerPage,
    setCurrentPage
  } = useParentAttendance({ accessToken: accessToken || '' })

  const handleDateSelection = (date: number) => {
    // Convert timestamp to readable date or use "TODAY"
    const newDate = date === 0 ? "TODAY" : new Date(date).toLocaleDateString()
    setSelectedDate(newDate)
  }

  const handleRefresh = () => {
    refreshData()
  }

  return (
    <section className="flex flex-col gap-4 w-full mx-auto p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-[#25AAE1] text-xl font-bold">ATTENDANCE</h1>
        <div className="flex gap-4">
          <button
            className="bg-white border rounded-md px-4 py-2 flex items-center justify-center"
            onClick={() => setIsDatePickerOpen(true)}
          >
            <span>{selectedDate}</span>
            <Calendar className="ml-2 h-5 w-5 text-gray-500" />
          </button>

          <Select value={selectedStudent} onValueChange={setSelectedStudent}>
            <SelectTrigger className="w-[180px] bg-white">
              <SelectValue placeholder="All Students" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-students">All Students</SelectItem>
              {children.map((child) => (
                <SelectItem key={child.student_id} value={child.student_id.toString()}>
                  {child.full_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedClass} onValueChange={setSelectedClass}>
            <SelectTrigger className="w-[180px] bg-white">
              <SelectValue placeholder="All Classes" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-classes">All Classes</SelectItem>
              {classData.map((classItem) => (
                <SelectItem key={classItem.id} value={classItem.id.toString()}>
                  {classItem.name}
                </SelectItem>
              ))}
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
        <button
          className="bg-green-600 text-white px-4 py-3 rounded-md flex items-center gap-2"
          onClick={handleRefresh}
          disabled={loading}
        >
          {loading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <RefreshCw className="h-5 w-5" />
          )}
        </button>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
          <span className="ml-2">Loading attendance data...</span>
        </div>
      )}

      {error && (
        <div className="flex items-center justify-center py-8 text-red-500">
          <AlertCircle className="w-6 h-6 mr-2" />
          <span>Error: {error}</span>
        </div>
      )}

      {!loading && !error && (
        <Card className="rounded-lg shadow-sm p-0 overflow-hidden border-0">
          <ParentAttendanceTable
            selectedStudent={selectedStudent}
            selectedClass={selectedClass}
            selectedDate={selectedDate}
            children={children}
            attendanceData={attendanceData}
            classData={classData}
            loading={loading}
            error={error}
            currentPage={currentPage}
            totalPages={totalPages}
            itemsPerPage={itemsPerPage}
            setCurrentPage={setCurrentPage}
          />
        </Card>
      )}

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
