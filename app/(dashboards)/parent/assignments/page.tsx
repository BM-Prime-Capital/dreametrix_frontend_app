"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { ParentAssignmentsTable } from "@/components/parents/assignments/parent-assignments-table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from 'lucide-react'
import { DatePickerDialog } from "@/components/student/assignments/date-picker-dialog"
import { localStorageKey } from "@/constants/global"

export default function ParentAssignmentsPage() {
  const [selectedClass, setSelectedClass] = useState<string>("all-classes")
  const [selectedStudent, setSelectedStudent] = useState<string>("all-students")
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false)
  const [, setSelectedDates] = useState<number[]>([])
  const [accessToken, setAccessToken] = useState<string>("")
  const [refreshToken, setRefreshToken] = useState<string>("")

  useEffect(() => {
    // Get tokens from localStorage
    const access_token = localStorage.getItem(localStorageKey.ACCESS_TOKEN)
    const refresh_token = localStorage.getItem(localStorageKey.REFRESH_TOKEN)

    if (access_token && refresh_token)  {
      console.log("USER Tokens ===>", {access_token, refresh_token})
      setAccessToken(access_token || "")
      setRefreshToken(refresh_token || "")
    }
  }, [])

  const handleDateSelection = (dates: number[]) => {
    setSelectedDates(dates)
  }

  // Sample children data
  const children = [
    { id: "john", name: "John Smith" },
    { id: "mia", name: "Mia Smith" },
  ]

  return (
    <section className="flex flex-col gap-4 w-full mx-auto p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-[#25AAE1] text-xl font-bold">ASSIGNMENTS</h1>
        <div className="flex gap-4">
          <button
            className="bg-white border rounded-md px-4 py-2 flex items-center justify-center"
            onClick={() => setIsDatePickerOpen(true)}
          >
            <span>All Days</span>
            <Calendar className="ml-2 h-5 w-5 text-gray-500" />
          </button>

          <Select value={selectedStudent} onValueChange={setSelectedStudent}>
            <SelectTrigger className="w-[180px] bg-white">
              <SelectValue placeholder="All Students" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-students">All Students</SelectItem>
              {children.map((child) => (
                <SelectItem key={child.id} value={child.id}>
                  {child.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedClass} onValueChange={setSelectedClass}>
            <SelectTrigger className="w-[180px] bg-white">
              <SelectValue placeholder="All Classes" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-classes">All Classes</SelectItem>
              <SelectItem value="class-5-math">Class 5 - Math</SelectItem>
              <SelectItem value="class-5-sci">Class 5 - Sci</SelectItem>
              <SelectItem value="class-5-bio">Class 5 - Bio</SelectItem>
              <SelectItem value="class-5-lit">Class 5 - Lit</SelectItem>
              <SelectItem value="class-5-che">Class 5 - Che</SelectItem>
              <SelectItem value="class-5-spa">Class 5 - Spa</SelectItem>
              <SelectItem value="class-5-phy">Class 5 - Phy</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card className="rounded-lg shadow-sm p-0 overflow-hidden border-0">
        <ParentAssignmentsTable
          selectedStudent={selectedStudent}
          selectedClass={selectedClass}
          accessToken={accessToken}
          refreshToken={refreshToken}
        />
      </Card>

      <DatePickerDialog
        isOpen={isDatePickerOpen}
        onClose={() => setIsDatePickerOpen(false)}
        onApply={handleDateSelection}
      />
    </section>
  )
}
