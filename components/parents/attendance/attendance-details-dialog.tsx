"use client"

import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { X, Calendar, Clock, User, BookOpen } from "lucide-react"
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
  const presentPercentage = Math.round((attendance.statistics.present / totalAttendance) * 100)
  const absentPercentage = Math.round((attendance.statistics.absent / totalAttendance) * 100)
  const latePercentage = Math.round((attendance.statistics.late / totalAttendance) * 100)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="text-lg font-medium">Attendance Details</div>
            <Button variant="ghost" size="icon" onClick={onClose} className="h-6 w-6">
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="border-t pt-4 mb-4" />

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="flex items-center">
              <User className="h-5 w-5 text-gray-500 mr-2" />
              <div>
                <div className="text-sm text-gray-600">Student</div>
                <div className="font-medium">{attendance.student}</div>
              </div>
            </div>

            <div className="flex items-center">
              <BookOpen className="h-5 w-5 text-gray-500 mr-2" />
              <div>
                <div className="text-sm text-gray-600">Class</div>
                <div className="font-medium">{attendance.class}</div>
              </div>
            </div>

            <div className="flex items-center">
              <Calendar className="h-5 w-5 text-gray-500 mr-2" />
              <div>
                <div className="text-sm text-gray-600">Date</div>
                <div className="font-medium">{attendance.day}</div>
              </div>
            </div>

            <div className="flex items-center">
              <Clock className="h-5 w-5 text-gray-500 mr-2" />
              <div>
                <div className="text-sm text-gray-600">Status</div>
                <div
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusStyles(
                    attendance.status,
                  )}`}
                >
                  {attendance.status}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <div className="font-medium mb-4">Attendance History</div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <div className="text-sm text-gray-600">Present ({attendance.statistics.present})</div>
                  <div className="text-sm font-medium">{presentPercentage}%</div>
                </div>
                <Progress value={presentPercentage} className="h-2 bg-gray-200" />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <div className="text-sm text-gray-600">Absent ({attendance.statistics.absent})</div>
                  <div className="text-sm font-medium">{absentPercentage}%</div>
                </div>
                <Progress value={absentPercentage} className="h-2 bg-gray-200"  />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <div className="text-sm text-gray-600">Late ({attendance.statistics.late})</div>
                  <div className="text-sm font-medium">{latePercentage}%</div>
                </div>
                <Progress value={latePercentage} className="h-2 bg-gray-200"  />
              </div>
            </div>
          </div>

          <div className="flex justify-between">
            <Button variant="outline" className="bg-white">
              Contact Teacher
            </Button>
            <Button className="bg-[#25AAE1] hover:bg-[#1D8CB3] text-white">View Full History</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function getStatusStyles(status: string) {
  switch (status) {
    case "Present":
      return "bg-green-100 text-green-800"
    case "Late":
      return "bg-yellow-100 text-yellow-800"
    case "Absent":
      return "bg-red-100 text-red-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}
