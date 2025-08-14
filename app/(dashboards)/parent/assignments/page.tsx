"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { ParentAssignmentsTable } from "@/components/parents/assignments/parent-assignments-table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { RefreshCw, Loader2 } from 'lucide-react'
import { localStorageKey } from "@/constants/global"
import { useRequestInfo } from "@/hooks/useRequestInfo"
import { getParentAssignments, ParentAssignment } from "@/services/ParentAssignmentService"
import { getParentChildren, ParentChild } from "@/services/ParentGradebookService"

export default function ParentAssignmentsPage() {
  const [selectedClass, setSelectedClass] = useState<string>("all-classes")
  const [selectedStudent, setSelectedStudent] = useState<string>("all-students")
  const [selectedType, setSelectedType] = useState<string>("all-types")
  const [refreshKey, setRefreshKey] = useState(0)
  const [assignments, setAssignments] = useState<ParentAssignment[]>([])
  const [children, setChildren] = useState<ParentChild[]>([])
  const [filtersLoading, setFiltersLoading] = useState(true)
  const [filtersError, setFiltersError] = useState<string | null>(null)
  
  const { accessToken, refreshToken } = useRequestInfo()

  // Fetch assignments and children data
  const fetchData = async () => {
    if (!accessToken) return
    
    setFiltersLoading(true)
    setFiltersError(null)
    
    try {
      const [assignmentsData, childrenData] = await Promise.all([
        getParentAssignments(accessToken, refreshToken),
        getParentChildren(accessToken)
      ])
      
      // Combine assignments with student information
      const assignmentsWithStudents = assignmentsData.map(assignment => {
        // Find which students are in this class
        const studentsInClass = childrenData.flatMap(child => 
          (child.courses || []).filter(course => course.course_id === assignment.course.id)
            .map(() => ({
              id: child.user_id,
              name: child.full_name
            }))
        )
        
        return {
          ...assignment,
          students: studentsInClass
        }
      })
      
      setAssignments(assignmentsWithStudents)
      setChildren(childrenData)
    } catch (error) {
      setFiltersError(error instanceof Error ? error.message : "Error loading data")
    } finally {
      setFiltersLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [accessToken, refreshToken])

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1)
    fetchData()
  }

  // Extract unique classes from assignments
  const classes = assignments.map(assignment => ({
    id: assignment.course.id,
    name: assignment.course.name
  })).filter((cls, index, self) => 
    self.findIndex(c => c.id === cls.id) === index
  )

  // Extract unique assignment types from assignments
  const assignmentTypes = assignments.map(assignment => ({
    id: assignment.kind,
    name: assignment.kind.charAt(0).toUpperCase() + assignment.kind.slice(1)
  })).filter((type, index, self) => 
    self.findIndex(t => t.id === type.id) === index
  )

  // Add "All Types" option
  const allTypes = [
    { id: "all-types", name: "All Types" },
    ...assignmentTypes
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
              <Select value={selectedStudent} onValueChange={setSelectedStudent}>
                <SelectTrigger className="w-[180px] bg-white">
                  <SelectValue placeholder="All Students" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-students">All Students ({children.length})</SelectItem>
                  {children.map((child) => (
                    <SelectItem key={child.user_id} value={child.user_id.toString()}>
                      {child.full_name}
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
                  {classes.map((cls) => (
                    <SelectItem key={cls.id} value={cls.id.toString()}>
                      {cls.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-[180px] bg-white">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  {allTypes.map((type) => (
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
          refreshKey={refreshKey}
          assignments={assignments}
          accessToken={accessToken}
          refreshToken={refreshToken}
        />
      </Card>
    </section>
  )
}
