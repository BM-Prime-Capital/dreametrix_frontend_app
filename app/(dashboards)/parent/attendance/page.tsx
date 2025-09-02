"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ParentAttendanceTable } from "@/components/parents/attendance/parent-attendance-table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileText, Printer, RefreshCw, Loader2, AlertCircle, Calendar, Users, CheckCircle, Clock, XCircle, TrendingUp, Award } from "lucide-react"
import { ReportDialog } from "@/components/parents/attendance/report-dialog"
import { PrintDialog } from "@/components/parents/attendance/print-dialog"
import { getParentAttendanceView, ParentAttendanceData } from "@/services/AttendanceService"
import { useRequestInfo } from "@/hooks/useRequestInfo"
import { menuImages } from "@/constants/images"
import Image from "next/image"
import { useLoading } from "@/lib/LoadingContext"

export default function ParentAttendancePage() {
  const { accessToken } = useRequestInfo()
  const { stopLoading } = useLoading()
  const [selectedStudent, setSelectedStudent] = useState<string>("all-students")
  const [isReportModalOpen, setIsReportModalOpen] = useState(false)
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false)
  const [attendanceData, setAttendanceData] = useState<ParentAttendanceData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch attendance data
  const fetchAttendanceData = async () => {
    if (!accessToken) return
    
    setLoading(true)
    setError(null)
    
    try {
      const data = await getParentAttendanceView(accessToken)
      setAttendanceData(data)
      // Arrêter le chargement dès qu'on reçoit une réponse (succès)
      stopLoading()
    } catch (error) {
      setError(error instanceof Error ? error.message : "Error loading attendance data")
      // Arrêter le chargement même en cas d'erreur
      stopLoading()
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAttendanceData()
  }, [accessToken])

  // Supprimer le useEffect de sécurité car on gère maintenant dans le try/catch

  const handleRefresh = () => {
    fetchAttendanceData()
  }

  // Calculer les statistiques globales
  const children = attendanceData?.children_attendance || []
  const totalStudents = children.length
  const totalPresent = children.reduce((sum, student) => sum + student.statistics.present_days, 0)
  const totalAbsent = children.reduce((sum, student) => sum + student.statistics.absent_days, 0)
  const totalLate = children.reduce((sum, student) => sum + student.statistics.late_days, 0)
  const attendanceRate = totalStudents > 0 ? Math.round((totalPresent / (totalPresent + totalAbsent + totalLate)) * 100) : 0

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="relative">
          <Loader2 className="h-12 w-12 animate-spin text-[#25AAE1] mb-6" />
          <div className="absolute inset-0 w-12 h-12 border-4 border-[#25AAE1]/20 rounded-full"></div>
        </div>
        <p className="text-gray-600 font-medium text-lg">Loading attendance data...</p>
        <p className="text-gray-500 text-sm mt-2">Analyzing attendance patterns and records</p>
      </div>
    )
  }

  return (
    <div className="w-full space-y-6">
      {/* Header Section */}
      <div className="bg-gradient-to-br from-[#25AAE1] via-[#1D8CB3] to-[#1453B8] p-6 rounded-2xl text-white shadow-xl">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-3xl font-bold mb-1 flex items-center gap-3">
              <Image 
                src={menuImages.attendance} 
                alt="Attendance" 
                width={32} 
                height={32} 
                className="w-8 h-8 brightness-0 invert"
              />
              Attendance Dashboard
            </h1>
            <p className="text-blue-100 text-base">Monitor your children's attendance and punctuality</p>
          </div>
          <div className="flex gap-2">
            <Button 
              className="bg-white/20 hover:bg-white/30 text-white border-white/30 text-sm px-3 py-2"
              onClick={() => setIsReportModalOpen(true)}
            >
              <FileText className="h-3 w-3 mr-1" />
              Report
            </Button>
            <Button 
              className="bg-white/20 hover:bg-white/30 text-white border-white/30 text-sm px-3 py-2"
              onClick={() => setIsPrintModalOpen(true)}
            >
              <Printer className="h-3 w-3 mr-1" />
              Print
            </Button>
          </div>
        </div>

        {/* Filters and Stats */}
      <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-white/10 p-3 rounded-xl backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-2">
                <Users className="h-4 w-4 text-blue-200" />
                <span className="text-blue-200 text-xs">Students</span>
              </div>
              <h3 className="text-lg font-bold">{totalStudents}</h3>
              <p className="text-blue-100 text-sm">Total Children</p>
            </div>
            
            <div className="bg-white/10 p-3 rounded-xl backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="h-4 w-4 text-blue-200" />
                <span className="text-blue-200 text-xs">Present</span>
              </div>
              <h3 className="text-lg font-bold">{totalPresent}</h3>
              <p className="text-blue-100 text-sm">Total Present</p>
            </div>
            
            <div className="bg-white/10 p-3 rounded-xl backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-4 w-4 text-blue-200" />
                <span className="text-blue-200 text-xs">Rate</span>
              </div>
              <h3 className="text-lg font-bold">{attendanceRate}%</h3>
              <p className="text-blue-100 text-sm">Attendance Rate</p>
            </div>
          </div>

          <div className="flex gap-2">
              <Select value={selectedStudent} onValueChange={setSelectedStudent}>
              <SelectTrigger className="w-[180px] bg-white/20 border-white/30 text-white placeholder:text-blue-100">
                  <SelectValue placeholder="All Students" />
                </SelectTrigger>
                <SelectContent>
                <SelectItem value="all-students">All Students ({children.length})</SelectItem>
                {children.map((student) => (
                  <SelectItem key={student.student_id} value={student.student_id.toString()}>
                    {student.full_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
          </div>
        </div>
      </div>

      {/* Attendance Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Present Days */}
        <Card className="p-4 bg-gradient-to-br from-[#25AAE1] to-[#1D8CB3] text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border-0">
          <div className="flex items-center justify-between mb-3">
            <CheckCircle className="h-6 w-6 text-blue-200" />
            <Badge className="bg-white/20 text-white border-white/30 text-xs">Present</Badge>
          </div>
          <div className="text-3xl font-bold mb-1">{totalPresent}</div>
          <p className="text-blue-100 font-medium text-sm">Total Present Days</p>
          <div className="mt-2 flex items-center gap-2 text-xs text-blue-200">
            <Calendar className="h-3 w-3" />
            <span>Days Attended</span>
          </div>
        </Card>

        {/* Total Absent Days */}
        <Card className="p-4 bg-gradient-to-br from-[#EF4444] to-[#DC2626] text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border-0">
          <div className="flex items-center justify-between mb-3">
            <XCircle className="h-6 w-6 text-red-200" />
            <Badge className="bg-white/20 text-white border-white/30 text-xs">Absent</Badge>
          </div>
          <div className="text-3xl font-bold mb-1">{totalAbsent}</div>
          <p className="text-red-100 font-medium text-sm">Total Absent Days</p>
          <div className="mt-2 flex items-center gap-2 text-xs text-red-200">
            <XCircle className="h-3 w-3" />
            <span>Days Missed</span>
          </div>
        </Card>

        {/* Total Late Days */}
        <Card className="p-4 bg-gradient-to-br from-[#F59E0B] to-[#D97706] text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border-0">
          <div className="flex items-center justify-between mb-3">
            <Clock className="h-6 w-6 text-yellow-200" />
            <Badge className="bg-white/20 text-white border-white/30 text-xs">Late</Badge>
          </div>
          <div className="text-3xl font-bold mb-1">{totalLate}</div>
          <p className="text-yellow-100 font-medium text-sm">Total Late Days</p>
          <div className="mt-2 flex items-center gap-2 text-xs text-yellow-200">
            <Clock className="h-3 w-3" />
            <span>Days Late</span>
          </div>
        </Card>

        {/* Attendance Rate */}
        <Card className="p-4 bg-gradient-to-br from-[#10B981] to-[#059669] text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border-0">
          <div className="flex items-center justify-between mb-3">
            <TrendingUp className="h-6 w-6 text-green-200" />
            <Badge className="bg-white/20 text-white border-white/30 text-xs">Rate</Badge>
          </div>
          <div className="text-3xl font-bold mb-1">{attendanceRate}%</div>
          <p className="text-green-100 font-medium text-sm">Attendance Rate</p>
          <div className="mt-2 flex items-center gap-2 text-xs text-green-200">
            <Award className="h-3 w-3" />
            <span>Overall Performance</span>
          </div>
        </Card>
      </div>

      {/* Attendance Table */}
      <Card className="bg-white rounded-2xl shadow-xl border-0 overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-gray-100">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            <Image 
              src={menuImages.attendance} 
              alt="Attendance" 
              width={20} 
              height={20} 
              className="w-5 h-5"
            />
            Attendance Overview
          </h2>
          <p className="text-gray-600 text-sm mt-1">Detailed view of your children's attendance records and patterns</p>
        </div>
        <ParentAttendanceTable
          selectedStudent={selectedStudent}
          selectedClass="all-classes"
          attendanceData={attendanceData}
          loading={loading}
          error={error}
        />
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-center gap-4">
        <Button
          onClick={handleRefresh}
          disabled={loading}
          className="bg-gradient-to-r from-[#25AAE1] to-[#1D8CB3] text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-300"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4 mr-2" />
          )}
          Refresh Data
        </Button>
      </div>

      {/* Modals */}
      <ReportDialog
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
      />

      <PrintDialog
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
      />
    </div>
  )
}
