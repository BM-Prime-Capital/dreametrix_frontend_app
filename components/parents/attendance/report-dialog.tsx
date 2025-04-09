"use client"

import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { X, Calendar, Download } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"

interface ReportDialogProps {
  isOpen: boolean
  onClose: () => void
}

export function ReportDialog({ isOpen, onClose }: ReportDialogProps) {
  const [startDate, setStartDate] = useState<string>(new Date().toISOString().split("T")[0])
  const [endDate, setEndDate] = useState<string>(new Date().toISOString().split("T")[0])

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px] p-6 overflow-hidden gap-0">
        <div className="flex items-center justify-between mb-4">
          <div className="text-lg font-medium">Attendance Report</div>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-6 w-6">
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="border-t pt-4" />

        <div className="space-y-4 mt-4">
          <Select defaultValue="all-students">
            <SelectTrigger className="w-full rounded-full">
              <SelectValue placeholder="All Students" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-students">All Students</SelectItem>
              <SelectItem value="john-smith">John Smith</SelectItem>
              <SelectItem value="emma-smith">Emma Smith</SelectItem>
            </SelectContent>
          </Select>

          <Select defaultValue="all-classes">
            <SelectTrigger className="w-full rounded-full">
              <SelectValue placeholder="All Classes" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-classes">All Classes</SelectItem>
              <SelectItem value="class-5-sci">Class 5 - Sci</SelectItem>
              <SelectItem value="class-5-math">Class 5 - Math</SelectItem>
              <SelectItem value="class-5-bio">Class 5 - Bio</SelectItem>
              <SelectItem value="class-5-lit">Class 5 - Lit</SelectItem>
              <SelectItem value="class-5-che">Class 5 - Che</SelectItem>
              <SelectItem value="class-5-spa">Class 5 - Spa</SelectItem>
              <SelectItem value="class-5-phy">Class 5 - Phy</SelectItem>
            </SelectContent>
          </Select>

          <div className="space-y-3">
            <div className="text-sm font-medium flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              <span>Time-Frame</span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs text-gray-500">From</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full p-2 border rounded-md text-sm"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-gray-500">To</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full p-2 border rounded-md text-sm"
                />
              </div>
            </div>
          </div>

          <Button className="w-full bg-[#B066F2] hover:bg-[#9A4DD9] text-white rounded-full">
            <Download className="h-4 w-4 mr-2" />
            SAVE REPORT
          </Button>

          <div className="text-center">
            <Button variant="ghost" onClick={onClose} className="text-gray-500">
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
