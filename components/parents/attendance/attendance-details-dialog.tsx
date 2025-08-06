"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, User, BookOpen, TrendingUp, MessageCircle, History } from "lucide-react"
import { Progress } from "@/components/ui/progress"

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

interface AttendanceDetailsDialogProps {
  isOpen: boolean
  onClose: () => void
  attendance: AttendanceRecord
}

export function AttendanceDetailsDialog({ isOpen, onClose, attendance }: AttendanceDetailsDialogProps) {
  // Calculate total attendance records
  const totalAttendance = attendance.statistics.present + attendance.statistics.absent + attendance.statistics.late

  // Calculate percentages
  const presentPercentage = totalAttendance > 0 ? Math.round((attendance.statistics.present / totalAttendance) * 100) : 0
  const absentPercentage = totalAttendance > 0 ? Math.round((attendance.statistics.absent / totalAttendance) * 100) : 0
  const latePercentage = totalAttendance > 0 ? Math.round((attendance.statistics.late / totalAttendance) * 100) : 0

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden bg-gradient-to-br from-sky-50 to-blue-50">
        <DialogHeader className="bg-gradient-to-r from-sky-400 to-blue-500 text-white p-6">
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Attendance Details
          </DialogTitle>
        </DialogHeader>

        <div className="p-6 space-y-6">
          {/* Student Information Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-sky-100 rounded-lg">
                  <User className="h-5 w-5 text-sky-600" />
                </div>
                <div>
                  <div className="text-sm text-gray-500 font-medium">Student</div>
                  <div className="font-semibold text-gray-900">{attendance.student}</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <BookOpen className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <div className="text-sm text-gray-500 font-medium">Class</div>
                  <div className="font-semibold text-gray-900">{attendance.class}</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Calendar className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <div className="text-sm text-gray-500 font-medium">Date</div>
                  <div className="font-semibold text-gray-900">{attendance.day}</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Clock className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <div className="text-sm text-gray-500 font-medium">Status</div>
                  <Badge className={`mt-1 ${getStatusStyles(attendance.status)}`}>
                    {attendance.status}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Attendance Statistics */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-sky-100 rounded-lg">
                <History className="h-5 w-5 text-sky-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Attendance History</h3>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm font-medium text-gray-700">Present ({attendance.statistics.present})</span>
                  </div>
                  <span className="text-sm font-semibold text-green-600">{presentPercentage}%</span>
                </div>
                <Progress 
                  value={presentPercentage} 
                  className="h-2 bg-gray-100" 
                  style={{ 
                    '--progress-background': '#10B981',
                    '--progress-foreground': '#10B981'
                  } as React.CSSProperties}
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span className="text-sm font-medium text-gray-700">Absent ({attendance.statistics.absent})</span>
                  </div>
                  <span className="text-sm font-semibold text-red-600">{absentPercentage}%</span>
                </div>
                <Progress 
                  value={absentPercentage} 
                  className="h-2 bg-gray-100"
                  style={{ 
                    '--progress-background': '#EF4444',
                    '--progress-foreground': '#EF4444'
                  } as React.CSSProperties}
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <span className="text-sm font-medium text-gray-700">Late ({attendance.statistics.late})</span>
                  </div>
                  <span className="text-sm font-semibold text-yellow-600">{latePercentage}%</span>
                </div>
                <Progress 
                  value={latePercentage} 
                  className="h-2 bg-gray-100"
                  style={{ 
                    '--progress-background': '#F59E0B',
                    '--progress-foreground': '#F59E0B'
                  } as React.CSSProperties}
                />
              </div>
            </div>

            {/* Summary Card */}
            <div className="mt-4 p-3 bg-gradient-to-r from-sky-50 to-blue-50 rounded-lg border border-sky-200">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">Total Attendance</span>
                <span className="text-sm font-bold text-sky-600">{totalAttendance} days</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <Button 
              variant="outline" 
              className="flex-1 bg-white border-gray-200 hover:bg-gray-50 text-gray-700"
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Contact Teacher
            </Button>
            <Button 
              className="flex-1 bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-500 hover:to-blue-600 text-white shadow-lg"
            >
              <History className="h-4 w-4 mr-2" />
              View Full History
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
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
