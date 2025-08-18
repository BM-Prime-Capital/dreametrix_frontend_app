"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { AttendanceTable } from "../../../../components/student/attendance/attendance-table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileText, Printer, Calendar, ArrowLeft, TrendingUp, CheckCircle, Clock, AlertCircle } from "lucide-react"
import { DatePickerDialog } from "../../../../components/student/attendance/date-picker-dialog"
import { ReportDialog } from "../../../../components/student/attendance/report-dialog"
import { PrintDialog } from "../../../../components/student/attendance/print-dialog"
import { Button } from "@/components/ui/button"
import { getStudentAttendanceView, StudentAttendanceData } from "@/services/AttendanceService"
import { useRequestInfo } from "@/hooks/useRequestInfo"

// Composant pour afficher les statistiques d'attendance
function AttendanceStats({ attendanceData }: { attendanceData: StudentAttendanceData | null }) {
  if (!attendanceData) return null

  const { statistics, summary } = attendanceData
  const attendanceRate = summary.attendance_rate || 0

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
      <Card className="p-6 bg-gradient-to-r from-green-500 to-green-600 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 rounded-2xl border-0">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white/20 rounded-xl">
            <TrendingUp className="h-8 w-8" />
          </div>
          <div>
            <p className="text-white/90 text-sm font-medium">Attendance Rate</p>
            <p className="text-3xl font-bold">{attendanceRate.toFixed(1)}%</p>
            <p className="text-white/70 text-xs">Over {statistics.total_days} days</p>
          </div>
        </div>
      </Card>

      <Card className="p-6 bg-gradient-to-r from-[#25AAE1] to-[#1D8CB3] text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 rounded-2xl border-0">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white/20 rounded-xl">
            <CheckCircle className="h-8 w-8" />
          </div>
          <div>
            <p className="text-white/90 text-sm font-medium">Present Days</p>
            <p className="text-3xl font-bold">{statistics.present_days}</p>
            <p className="text-white/70 text-xs">Total present</p>
          </div>
        </div>
      </Card>

      <Card className="p-6 bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 rounded-2xl border-0">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white/20 rounded-xl">
            <Clock className="h-8 w-8" />
          </div>
          <div>
            <p className="text-white/90 text-sm font-medium">Late Days</p>
            <p className="text-3xl font-bold">{statistics.late_days}</p>
            <p className="text-white/70 text-xs">Days late</p>
          </div>
        </div>
      </Card>

      <Card className="p-6 bg-gradient-to-r from-red-500 to-red-600 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 rounded-2xl border-0">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white/20 rounded-xl">
            <AlertCircle className="h-8 w-8" />
          </div>
          <div>
            <p className="text-white/90 text-sm font-medium">Absent Days</p>
            <p className="text-3xl font-bold">{statistics.absent_days}</p>
            <p className="text-white/70 text-xs">Days absent</p>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default function AttendancePage() {
  const [selectedClass, setSelectedClass] = useState<string>("all-classes")
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false)
  const [isReportModalOpen, setIsReportModalOpen] = useState(false)
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false)
  const [, setSelectedDate] = useState<number>(0)
  const [attendanceData, setAttendanceData] = useState<StudentAttendanceData | null>(null)
  const { accessToken } = useRequestInfo()

  const fetchAttendanceData = async () => {
    if (!accessToken) return
    
    try {
      const data = await getStudentAttendanceView(accessToken)
      setAttendanceData(data)
    } catch (error) {
      console.error("Error fetching attendance data:", error)
    }
  }

  useEffect(() => {
    fetchAttendanceData()
  }, [accessToken])

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
        {/* Statistiques d'attendance */}
        <AttendanceStats attendanceData={attendanceData} />

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

