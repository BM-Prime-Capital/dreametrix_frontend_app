"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AttendanceDetailsDialog } from "./attendance-details-dialog"
import { ParentAttendanceData } from "@/services/AttendanceService"
import { Loader2, AlertCircle, ChevronLeft, ChevronRight, CheckCircle, Clock, XCircle, RefreshCw, Calendar, User } from "lucide-react"

// Interface pour les données transformées
interface TransformedAttendanceData {
  id: number
  class: string
  classId: number
  student: string
  studentId: number
  day: string
  status: "Present" | "Late" | "Absent"
  statistics: {
    present: number
    absent: number
    late: number
  }
  teacher: string
}

interface ParentAttendanceTableProps {
  selectedStudent: string
  selectedClass: string
  attendanceData: ParentAttendanceData | null
  loading: boolean
  error: string | null
}

export function ParentAttendanceTable({ 
  selectedStudent, 
  selectedClass, 
  attendanceData,
  loading,
  error
}: ParentAttendanceTableProps) {
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  const [selectedAttendance, setSelectedAttendance] = useState<TransformedAttendanceData | null>(null)

  // Fonction pour transformer les données API en format d'affichage
  const transformAttendanceData = (): TransformedAttendanceData[] => {
    if (!attendanceData?.children_attendance) return []
    
    return attendanceData.children_attendance.flatMap(child => 
      child.attendances.map((attendance, index) => {
        // Déterminer le statut basé sur les statistiques
        let status: "Present" | "Late" | "Absent" = "Present"
        if (child.statistics.absent_days > 0) {
          status = "Absent"
        } else if (child.statistics.late_days > 0) {
          status = "Late"
        }

        return {
          id: attendance.id,
          class: attendance.course.name,
          classId: attendance.course.id,
          student: child.full_name,
          studentId: child.student_id,
          day: attendance.date,
          status,
          statistics: {
            present: child.statistics.present_days,
            absent: child.statistics.absent_days,
            late: child.statistics.late_days
          },
          teacher: attendance.teacher.name
        }
      })
    )
  }

  const handleAttendanceClick = (attendance: TransformedAttendanceData) => {
    setSelectedAttendance(attendance)
    setIsDetailsModalOpen(true)
  }

  // Filtrer les données transformées
  const transformedData = transformAttendanceData()
  const filteredData = transformedData.filter((item) => {
    // Filtre par étudiant
    const studentMatch = 
      selectedStudent === "all-students" || 
      item.studentId.toString() === selectedStudent
    
    // Filtre par classe
    const classMatch = 
      selectedClass === "all-classes" || 
      item.classId.toString() === selectedClass
    
    return studentMatch && classMatch
  })

  // Show loading state
  if (loading) {
    return (
      <div className="w-full flex items-center justify-center py-16">
        <div className="text-center">
          <div className="relative">
            <Loader2 className="h-12 w-12 animate-spin text-[#25AAE1] mx-auto mb-4" />
            <div className="absolute inset-0 w-12 h-12 border-4 border-[#25AAE1]/20 rounded-full mx-auto"></div>
          </div>
          <p className="text-gray-600 font-medium text-lg">Loading attendance data...</p>
          <p className="text-gray-500 text-sm mt-2">Analyzing attendance patterns and trends</p>
        </div>
      </div>
    )
  }

  // Show error state
  if (error) {
    return (
      <div className="w-full flex items-center justify-center py-16">
        <div className="bg-gradient-to-br from-red-50 to-rose-50 p-8 rounded-3xl border border-red-200 shadow-lg max-w-md w-full">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
            <h3 className="text-xl font-bold text-red-800 mb-2">Connection Error</h3>
            <p className="text-red-600 font-medium text-center mb-6">{error}</p>
            <Button
              onClick={() => window.location.reload()}
              className="bg-gradient-to-r from-[#25AAE1] to-[#1D8CB3] text-white px-8 py-3 rounded-xl hover:shadow-lg transition-all duration-300"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const getStatusBadge = (status: "Present" | "Late" | "Absent") => {
    switch (status) {
      case "Present":
        return (
          <Badge className="bg-green-100 text-green-700 border-green-200 text-xs">
            <CheckCircle className="h-3 w-3 mr-1" />
            Present
          </Badge>
        )
      case "Late":
        return (
          <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200 text-xs">
            <Clock className="h-3 w-3 mr-1" />
            Late
          </Badge>
        )
      case "Absent":
        return (
          <Badge className="bg-red-100 text-red-700 border-red-200 text-xs">
            <XCircle className="h-3 w-3 mr-1" />
            Absent
          </Badge>
        )
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <div className="w-full relative">
      <div className="overflow-x-auto">
        <Table className="w-full">
          <TableHeader>
            <TableRow className="hover:bg-transparent border-b border-gray-200">
              <TableHead className="font-bold text-gray-700 py-4 text-sm uppercase tracking-wide pl-6">STUDENT</TableHead>
              <TableHead className="font-bold text-gray-700 py-4 text-sm uppercase tracking-wide text-center">CLASS</TableHead>
              <TableHead className="font-bold text-gray-700 py-4 text-sm uppercase tracking-wide text-center">DATE</TableHead>
              <TableHead className="font-bold text-gray-700 py-4 text-sm uppercase tracking-wide text-center">STATUS</TableHead>
              <TableHead className="font-bold text-gray-700 py-4 text-sm uppercase tracking-wide text-center">ATTENDANCE SUMMARY</TableHead>
              <TableHead className="font-bold text-gray-700 py-4 text-sm uppercase tracking-wide text-center">TEACHER</TableHead>
              <TableHead className="font-bold text-gray-700 py-4 text-sm uppercase tracking-wide text-center">ACTIONS</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map((item, index) => (
              <TableRow 
                key={item.id} 
                className={`hover:bg-blue-50/50 transition-all duration-200 cursor-pointer ${
                  index % 2 === 0 ? "bg-white" : "bg-gray-50/30"
                }`}
                onClick={() => handleAttendanceClick(item)}
              >
                <TableCell className="py-4 pl-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-[#25AAE1] to-[#1D8CB3] rounded-full flex items-center justify-center text-white font-semibold text-sm">
                      {item.student.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-800">{item.student}</div>
                      <div className="text-gray-500 text-sm">ID: {item.studentId}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="py-4 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full flex items-center justify-center">
                      <Calendar className="h-4 w-4 text-white" />
                    </div>
                    <span className="font-medium text-gray-700">{item.class}</span>
                  </div>
                </TableCell>
                <TableCell className="py-4 text-center">
                  <div className="text-sm font-medium text-gray-700">
                    {formatDate(item.day)}
                  </div>
                </TableCell>
                <TableCell className="py-4 text-center">
                  {getStatusBadge(item.status)}
                </TableCell>
                <TableCell className="py-4 text-center">
                  <div className="flex items-center justify-center space-x-3">
                    <div className="flex flex-col items-center gap-1">
                      <div className="flex items-center gap-1">
                        <CheckCircle className="h-3 w-3 text-green-500" />
                        <span className="text-xs font-semibold text-green-600">{item.statistics.present}</span>
                      </div>
                      <span className="text-xs text-gray-500">Present</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <div className="flex items-center gap-1">
                        <XCircle className="h-3 w-3 text-red-500" />
                        <span className="text-xs font-semibold text-red-600">{item.statistics.absent}</span>
                      </div>
                      <span className="text-xs text-gray-500">Absent</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3 text-yellow-500" />
                        <span className="text-xs font-semibold text-yellow-600">{item.statistics.late}</span>
                      </div>
                      <span className="text-xs text-gray-500">Late</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="py-4 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">{item.teacher}</span>
                  </div>
                </TableCell>
                <TableCell className="py-4 text-center">
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-gradient-to-r from-[#25AAE1] to-[#1D8CB3] text-white border-0 hover:from-[#1D8CB3] hover:to-[#1453B8] transition-all duration-300"
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    View Details
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {filteredData.length === 0 && !loading && (
        <div className="text-center py-16">
          <div className="bg-gradient-to-br from-gray-50 to-slate-50 p-8 rounded-3xl border border-gray-200 shadow-lg max-w-md mx-auto">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">No Attendance Data</h3>
            <p className="text-gray-600 text-center">No attendance records found for the selected filters</p>
          </div>
        </div>
      )}

      {/* Attendance Details Dialog */}
      {selectedAttendance && (
        <AttendanceDetailsDialog
          isOpen={isDetailsModalOpen}
          onClose={() => {
            setIsDetailsModalOpen(false)
            setSelectedAttendance(null)
          }}
          attendance={selectedAttendance}
        />
      )}
    </div>
  )
}
