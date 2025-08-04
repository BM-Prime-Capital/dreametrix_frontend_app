"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { ParentAssignmentsTable } from "@/components/parents/assignments/parent-assignments-table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Calendar, RefreshCw, Loader2 } from 'lucide-react'
import { DatePickerDialog } from "@/components/student/assignments/date-picker-dialog"
import { localStorageKey } from "@/constants/global"
import { useRequestInfo } from "@/hooks/useRequestInfo"
import { useParentFilters } from "@/hooks/useParentFilters"

export default function ParentAssignmentsPage() {
  const [selectedClass, setSelectedClass] = useState<string>("all-classes")
  const [selectedStudent, setSelectedStudent] = useState<string>("all-students")
  const [selectedType, setSelectedType] = useState<string>("all-types")
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false)
  const [selectedDates, setSelectedDates] = useState<number[]>([])
  const [refreshKey, setRefreshKey] = useState(0)
  
  const { accessToken, refreshToken } = useRequestInfo()

  // Get filter data from API
  const { children, subjects, levels, loading: filtersLoading, error: filtersError, refreshFilters } = useParentFilters({
    accessToken,
    refreshToken
  })

  const handleDateSelection = (dates: number[]) => {
    setSelectedDates(dates)
  }

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1)
    refreshFilters()
  }

  // Assignment types based on API data
  const assignmentTypes = [
    { id: "all-types", name: "All Types" },
    { id: "test", name: "Test" },
    { id: "quiz", name: "Quiz" },
    { id: "homework", name: "Homework" },
    { id: "project", name: "Project" },
    { id: "exam", name: "Exam" }
  ]

  return (
    <section className="flex flex-col gap-4 w-full mx-auto p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-[#25AAE1] text-xl font-bold">ASSIGNMENTS</h1>
        <div className="flex gap-4">
          {filtersLoading ? (
            <div className="flex items-center gap-2 text-gray-500">
              <Loader2 className="w-4 h-4 animate-spin" />
              Loading filters...
            </div>
          ) : filtersError ? (
            <div className="text-red-500 text-sm">
              Error loading filters: {filtersError}
            </div>
          ) : (
            <>
              <Button
                variant="outline"
                className="bg-white border-gray-300 hover:bg-gray-50"
                onClick={() => setIsDatePickerOpen(true)}
              >
                <Calendar className="mr-2 h-4 w-4" />
                All Days
              </Button>

              <Select value={selectedStudent} onValueChange={setSelectedStudent}>
                <SelectTrigger className="w-[180px] bg-white">
                  <SelectValue placeholder="All Students" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-students">All Students ({children.length})</SelectItem>
                  {children.map((child) => (
                    <SelectItem key={child.id} value={child.id.toString()}>
                      {child.first_name} {child.last_name}
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
                  {subjects.map((subject) => (
                    <SelectItem key={subject.id} value={subject.id}>
                      {subject.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-[180px] bg-white">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  {assignmentTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                className="bg-white border-gray-300 hover:bg-gray-50"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh
              </Button>
            </>
          )}
        </div>
      </div>

      <Card className="rounded-lg shadow-sm p-0 overflow-hidden border-0">
        <ParentAssignmentsTable
          selectedStudent={selectedStudent}
          selectedClass={selectedClass}
          selectedType={selectedType}
          selectedDates={selectedDates}
          refreshKey={refreshKey}
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
