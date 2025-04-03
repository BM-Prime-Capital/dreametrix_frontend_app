"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { AssignmentsTable } from "../../../../components/student/assignments/assignments-table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "lucide-react"
import { DatePickerDialog } from "../../../../components/student/assignments/date-picker-dialog"

export default function AssignmentsPage() {
  const [selectedClass, setSelectedClass] = useState<string>("all-classes")
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false)
  const [, setSelectedDates] = useState<number[]>([])

  const handleDateSelection = (dates: number[]) => {
    setSelectedDates(dates)
  }

  return (
    <section className="flex flex-col gap-4 w-full  mx-auto p-4 ">
      <div className="flex items-center justify-between">
        <h1 className="text-[#4CAF50] text-xl font-bold">ASSIGNMENTS</h1>
        <div className="flex gap-4">
          <button
            className="bg-white border rounded-md px-4 py-2 flex items-center justify-center"
            onClick={() => setIsDatePickerOpen(true)}
          >
            <span>All Days</span>
            <Calendar className="ml-2 h-5 w-5 text-gray-500" />
          </button>

          <Select value={selectedClass} onValueChange={setSelectedClass}>
            <SelectTrigger className="w-[180px] bg-white">
              <SelectValue placeholder="All Classes" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-classes">All Classes</SelectItem>
              <SelectItem value="class-5-math">Class 5 - Math</SelectItem>
              <SelectItem value="class-n-1">Class N</SelectItem>
              <SelectItem value="class-n-2">Class N</SelectItem>
              <SelectItem value="class-n-3">Class N</SelectItem>
              <SelectItem value="class-n-4">Class N</SelectItem>
              <SelectItem value="class-n-5">Class N</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card className="rounded-lg shadow-sm p-0 overflow-hidden border-0">
        <AssignmentsTable />
      </Card>

      <DatePickerDialog
        isOpen={isDatePickerOpen}
        onClose={() => setIsDatePickerOpen(false)}
        onApply={handleDateSelection}
      />
    </section>
  )
}

