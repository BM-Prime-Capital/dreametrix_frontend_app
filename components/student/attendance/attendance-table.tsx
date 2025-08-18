"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { getStudentAttendanceView, StudentAttendanceData } from "@/services/AttendanceService"
import { useRequestInfo } from "@/hooks/useRequestInfo"
import { Loader2, AlertCircle, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"

interface AttendanceRecord {
  id: number
  class: string
  day: string
  status: string
  historical: { present: number; absent: number; total: number }
  teacher: string
}

export function AttendanceTable() {
  const [attendanceData, setAttendanceData] = useState<StudentAttendanceData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { accessToken } = useRequestInfo()

  const fetchAttendanceData = async () => {
    if (!accessToken) {
      setError("Authentication required")
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)
      const data = await getStudentAttendanceView(accessToken)
      console.log("Student attendance data received:", data)
      setAttendanceData(data)
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Error loading attendance data"
      console.error("Error fetching attendance data:", err)
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAttendanceData()
  }, [accessToken])

  const transformAttendanceData = (): AttendanceRecord[] => {
    if (!attendanceData?.attendances) return []

    return attendanceData.attendances.map((attendance) => {
      // Parse the date correctly (YYYY-MM-DD format)
      const dateParts = attendance.date.split('-')
      const year = parseInt(dateParts[0])
      const month = parseInt(dateParts[1]) - 1 // JavaScript months are 0-indexed
      const day = parseInt(dateParts[2])
      
      const date = new Date(year, month, day)
      
      return {
        id: attendance.id,
        class: attendance.course.name,
        day: date.toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }),
        status: attendance.status.charAt(0).toUpperCase() + attendance.status.slice(1),
        historical: {
          present: attendanceData.statistics.present_days,
          absent: attendanceData.statistics.absent_days,
          total: attendanceData.statistics.total_days
        },
        teacher: attendance.teacher.name
      }
    })
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'present':
        return 'text-[#25AAE1]'
      case 'late':
        return 'text-orange-400'
      case 'absent':
        return 'text-red-500'
      default:
        return 'text-gray-500'
    }
  }

  const getStatusBadgeStyle = (status: string) => {
    switch (status.toLowerCase()) {
      case 'present':
        return 'bg-green-50 text-green-700 border border-green-200'
      case 'late':
        return 'bg-orange-50 text-orange-700 border border-orange-200'
      case 'absent':
        return 'bg-red-50 text-red-700 border border-red-200'
      default:
        return 'bg-gray-50 text-gray-700 border border-gray-200'
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-[#25AAE1] mb-4" />
        <p className="text-gray-600 font-medium">Loading your attendance...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <AlertCircle className="h-8 w-8 text-red-500 mb-4" />
        <p className="text-red-600 font-medium text-center mb-4">{error}</p>
        <Button
          onClick={fetchAttendanceData}
          className="bg-[#25AAE1] hover:bg-[#1D8CB3] text-white"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Try Again
        </Button>
      </div>
    )
  }

  const transformedData = transformAttendanceData()

  if (transformedData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <AlertCircle className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No attendance data</h3>
        <p className="text-gray-500 text-center">Your attendance data will appear here once available</p>
      </div>
    )
  }

  return (
    <div className="w-full">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent border-b border-gray-200">
            <TableHead className="font-semibold text-gray-700 py-4">CLASS</TableHead>
            <TableHead className="font-semibold text-gray-700 py-4">DATE</TableHead>
            <TableHead className="font-semibold text-gray-700 py-4">STATUS</TableHead>
            <TableHead className="font-semibold text-gray-700 py-4">HISTORICAL STATISTICS</TableHead>
            <TableHead className="font-semibold text-gray-700 py-4">TEACHER</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transformedData.map((record, index) => (
            <TableRow key={record.id} className="hover:bg-gray-50 transition-colors">
              <TableCell className="font-medium text-gray-900 py-4">
                {record.class}
              </TableCell>
              <TableCell className="text-gray-600 py-4">
                {record.day}
              </TableCell>
              <TableCell className="py-4">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeStyle(record.status)}`}>
                  {record.status}
                </span>
              </TableCell>
              <TableCell className="py-4">
                <div className="flex items-center space-x-4 text-sm">
                  <div className="flex items-center space-x-1">
                    <span className="text-green-600 font-medium">Present:</span>
                    <span className="font-semibold">{record.historical.present}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span className="text-red-600 font-medium">Absent:</span>
                    <span className="font-semibold">{record.historical.absent}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span className="text-gray-600 font-medium">Total:</span>
                    <span className="font-semibold">{record.historical.total}</span>
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-gray-600 py-4">
                <div className="flex items-center space-x-2">
                  <span>{record.teacher}</span>
                  <MessageIcon />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

function MessageIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="text-gray-400"
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

