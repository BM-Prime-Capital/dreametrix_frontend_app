"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AttendanceDetailsDialog } from "./attendance-details-dialog"
import { ParentChild, AttendanceData, ClassData } from "@/services/ParentAttendanceService"
import { Loader2, AlertCircle, ChevronLeft, ChevronRight } from "lucide-react"

// Interface pour les données transformées
interface TransformedAttendanceData {
  id: number
  class: string
  student: string
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
  selectedDate: string
  children: ParentChild[]
  attendanceData: AttendanceData[]
  classData: ClassData[]
  loading: boolean
  error: string | null
  currentPage: number
  totalPages: number
  itemsPerPage: number
  setCurrentPage: (page: number) => void
}

export function ParentAttendanceTable({ 
  selectedStudent, 
  selectedClass, 
  selectedDate,
  children,
  attendanceData,
  classData,
  loading,
  error,
  currentPage,
  totalPages,
  itemsPerPage,
  setCurrentPage
}: ParentAttendanceTableProps) {
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  const [selectedAttendance, setSelectedAttendance] = useState<TransformedAttendanceData | null>(null)

  // Fonction pour transformer les données API en format d'affichage
  const transformAttendanceData = (): TransformedAttendanceData[] => {
    return attendanceData.map((item, index) => {
      // Déterminer le statut basé sur les statistiques
      let status: "Present" | "Late" | "Absent" = "Present"
      if (item.statistics.absent_days > 0) {
        status = "Absent"
      } else if (item.statistics.late_days > 0) {
        status = "Late"
      }

      return {
        id: index + 1,
        class: item.class_name,
        student: item.full_name,
        day: selectedDate,
        status,
        statistics: {
          present: item.statistics.present_days,
          absent: item.statistics.absent_days,
          late: item.statistics.late_days
        },
        teacher: "N/A" // En attendant l'API complète
      }
    })
  }

  const handleAttendanceClick = (attendance: TransformedAttendanceData) => {
    setSelectedAttendance(attendance)
    setIsDetailsModalOpen(true)
  }

  // Filtrer les données transformées
  const transformedData = transformAttendanceData()
  const filteredData = transformedData.filter((item) => {
    const studentMatch = 
      selectedStudent === "all-students" || 
      children.find(child => child.student_id.toString() === selectedStudent)?.full_name === item.student
    
    const classMatch = 
      selectedClass === "all-classes" || 
      classData.find(cls => cls.id.toString() === selectedClass)?.name === item.class
    
    const dateMatch = selectedDate === "TODAY" || item.day === selectedDate
    
    return studentMatch && classMatch && dateMatch
  })

  // Pagination
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedData = filteredData.slice(startIndex, endIndex)

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
        <span className="ml-2">Loading attendance data...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-8 text-red-500">
        <AlertCircle className="w-6 h-6 mr-2" />
        <span>Error: {error}</span>
      </div>
    )
  }

  if (filteredData.length === 0) {
    return (
      <div className="flex items-center justify-center py-8 text-gray-500">
        <span>No attendance data available</span>
      </div>
    )
  }

  return (
    <div className="w-full relative">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent border-b">
            <TableHead className="font-bold text-gray-700 py-4">STUDENT</TableHead>
            <TableHead className="font-bold text-gray-700 py-4">CLASS</TableHead>
            <TableHead className="font-bold text-gray-700 py-4">DAY</TableHead>
            <TableHead className="font-bold text-gray-700 py-4">ATTENDANCE</TableHead>
            <TableHead className="font-bold text-gray-700 py-4">HISTORICAL STATISTICS</TableHead>
            <TableHead className="font-bold text-gray-700 py-4">TEACHER</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedData.map((attendance, index) => (
            <TableRow key={attendance.id} className={index % 2 === 0 ? "bg-[#EDF6FA]" : ""}>
              <TableCell className="font-medium text-gray-500">
                <Badge variant="outline" className="bg-blue-50 text-blue-700 hover:bg-blue-100">
                  {attendance.student}
                </Badge>
              </TableCell>
              <TableCell className="font-medium text-gray-500">{attendance.class}</TableCell>
              <TableCell className="text-gray-500">{attendance.day}</TableCell>
              <TableCell>
                <div
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium cursor-pointer ${getStatusStyles(
                    attendance.status,
                  )}`}
                  onClick={() => handleAttendanceClick(attendance)}
                >
                  {attendance.status}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                    <span className="text-sm text-gray-600 underline">{attendance.statistics.present}</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-red-500 rounded-full mr-1"></div>
                    <span className="text-sm text-gray-600 underline">{attendance.statistics.absent}</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mr-1"></div>
                    <span className="text-sm text-gray-600 underline">{attendance.statistics.late}</span>
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-gray-500">
                <div className="flex items-center">
                  {attendance.teacher}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 bg-white border-t">
          <div className="text-sm text-gray-700">
            Showing {startIndex + 1} to {Math.min(endIndex, filteredData.length)} of {filteredData.length} results
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <span className="text-sm text-gray-700">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {selectedAttendance && (
        <AttendanceDetailsDialog
          isOpen={isDetailsModalOpen}
          onClose={() => setIsDetailsModalOpen(false)}
          attendance={selectedAttendance}
        />
      )}

      {isDetailsModalOpen && <div className="absolute inset-0 bg-white/50 backdrop-blur-sm" />}
    </div>
  )
}

function getStatusStyles(status: string) {
  switch (status) {
    case "Present":
      return "bg-green-100 text-green-800 hover:bg-green-200"
    case "Late":
      return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
    case "Absent":
      return "bg-red-100 text-red-800 hover:bg-red-200"
    default:
      return "bg-gray-100 text-gray-800 hover:bg-gray-200"
  }
}
