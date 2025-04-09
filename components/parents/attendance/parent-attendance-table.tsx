"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { AttendanceDetailsDialog } from "./attendance-details-dialog"

// Define proper types for our data
interface AttendanceRecord {
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

// Sample attendance data
const attendanceData: AttendanceRecord[] = [
  {
    id: 1,
    class: "Class 5 - Sci",
    student: "John Smith",
    day: "TODAY",
    status: "Present",
    statistics: {
      present: 45,
      absent: 3,
      late: 20,
    },
    teacher: "Eva Parker",
  },
  {
    id: 2,
    class: "Class 5 - Math",
    student: "John Smith",
    day: "TODAY",
    status: "Present",
    statistics: {
      present: 45,
      absent: 3,
      late: 20,
    },
    teacher: "Eva Parker",
  },
  {
    id: 3,
    class: "Class 5 - Bio",
    student: "John Smith",
    day: "TODAY",
    status: "Late",
    statistics: {
      present: 45,
      absent: 3,
      late: 20,
    },
    teacher: "Sam Burke",
  },
  {
    id: 4,
    class: "Class 5 - Lit",
    student: "Emma Smith",
    day: "TODAY",
    status: "Present",
    statistics: {
      present: 45,
      absent: 3,
      late: 20,
    },
    teacher: "Anna Blake",
  },
  {
    id: 5,
    class: "Class 5 - Che",
    student: "Emma Smith",
    day: "TODAY",
    status: "Present",
    statistics: {
      present: 45,
      absent: 3,
      late: 20,
    },
    teacher: "Sam Burke",
  },
  {
    id: 6,
    class: "Class 5 - Spa",
    student: "Emma Smith",
    day: "TODAY",
    status: "Absent",
    statistics: {
      present: 45,
      absent: 3,
      late: 20,
    },
    teacher: "Anna Blake",
  },
  {
    id: 7,
    class: "Class 5 - Phy",
    student: "John Smith",
    day: "TODAY",
    status: "Absent",
    statistics: {
      present: 45,
      absent: 3,
      late: 20,
    },
    teacher: "Eva Parker",
  },
]

interface ParentAttendanceTableProps {
  selectedStudent: string
  selectedClass: string
  selectedDate: string
}

export function ParentAttendanceTable({ selectedStudent, selectedClass, selectedDate }: ParentAttendanceTableProps) {
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  const [selectedAttendance, setSelectedAttendance] = useState<AttendanceRecord | null>(null)

  const handleAttendanceClick = (attendance: AttendanceRecord) => {
    setSelectedAttendance(attendance)
    setIsDetailsModalOpen(true)
  }

  // Filter attendance data based on selected student, class, and date
  const filteredData = attendanceData.filter((item) => {
    const studentMatch =
      selectedStudent === "all-students" ||
      (selectedStudent === "john" && item.student === "John Smith") ||
      (selectedStudent === "emma" && item.student === "Emma Smith")

    const classMatch = selectedClass === "all-classes" || item.class.toLowerCase().replace(/\s/g, "-") === selectedClass

    const dateMatch = selectedDate === "TODAY" || item.day === selectedDate

    return studentMatch && classMatch && dateMatch
  })

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
          {filteredData.map((attendance, index) => (
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
                  {attendance.teacher} <MessageIcon />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

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

function MessageIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="text-[#25AAE1] ml-2"
    >
      <path d="M22 2L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path
        d="M22 2L15 22L11 13L2 9L22 2Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
