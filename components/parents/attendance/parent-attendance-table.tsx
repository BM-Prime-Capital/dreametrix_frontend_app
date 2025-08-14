"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AttendanceDetailsDialog } from "./attendance-details-dialog"
import { ParentAttendanceData } from "@/services/AttendanceService"
import { Loader2, AlertCircle, ChevronLeft, ChevronRight } from "lucide-react"

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
      <div className="w-full flex items-center justify-center py-8">
        <div className="flex items-center gap-2 text-gray-500">
          <Loader2 className="w-4 h-4 animate-spin" />
          Loading attendance data...
        </div>
      </div>
    )
  }

  // Show error state
  if (error) {
    return (
      <div className="w-full flex items-center justify-center py-8">
        <div className="text-red-500">Error: {error}</div>
      </div>
    )
  }

  return (
    <div className="w-full relative">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent border-b bg-gray-50">
            <TableHead className="font-bold text-gray-700 py-4 text-sm uppercase tracking-wide">STUDENT</TableHead>
            <TableHead className="font-bold text-gray-700 py-4 text-sm uppercase tracking-wide">CLASS</TableHead>
            <TableHead className="font-bold text-gray-700 py-4 text-sm uppercase tracking-wide">DATE</TableHead>
            <TableHead className="font-bold text-gray-700 py-4 text-sm uppercase tracking-wide">STATUS</TableHead>
            <TableHead className="font-bold text-gray-700 py-4 text-sm uppercase tracking-wide">TEACHER</TableHead>
            <TableHead className="font-bold text-gray-700 py-4 text-sm uppercase tracking-wide">ACTIONS</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredData.map((item, index) => (
            <TableRow key={item.id} className={`hover:bg-gray-50 transition-colors ${index % 2 === 0 ? "bg-white" : "bg-gray-50"}`}>
              <TableCell className="py-4">
                <div className="font-semibold text-gray-800">{item.student}</div>
              </TableCell>
              <TableCell className="py-4">
                <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                  {item.class}
                </Badge>
              </TableCell>
              <TableCell className="py-4">
                <span className="text-gray-600">{item.day}</span>
              </TableCell>
              <TableCell className="py-4">
                <Badge className={getStatusStyles(item.status)}>
                  {item.status}
                </Badge>
              </TableCell>
              <TableCell className="py-4">
                <span className="text-gray-600">{item.teacher}</span>
              </TableCell>
              <TableCell className="py-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleAttendanceClick(item)}
                  className="text-blue-600 hover:text-blue-700 border-blue-200 hover:border-blue-300 hover:bg-blue-50"
                >
                  View Details
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {filteredData.length === 0 && !loading && (
        <div className="text-center py-8 text-gray-500">
          <AlertCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p>No attendance records found for the selected filters</p>
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

function getStatusStyles(status: string) {
  switch (status) {
    case "Present":
      return "bg-green-100 text-green-700 border-green-200"
    case "Late":
      return "bg-yellow-100 text-yellow-700 border-yellow-200"
    case "Absent":
      return "bg-red-100 text-red-700 border-red-200"
    default:
      return "bg-gray-100 text-gray-700 border-gray-200"
  }
}
