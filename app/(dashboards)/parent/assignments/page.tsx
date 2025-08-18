"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ParentAssignmentsTable } from "@/components/parents/assignments/parent-assignments-table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RefreshCw, Loader2, AlertCircle, FileText, Calendar, Users, TrendingUp } from 'lucide-react'
import { useRequestInfo } from "@/hooks/useRequestInfo"
import { getParentAssignments, ParentAssignment } from "@/services/ParentAssignmentService"
import { getParentClasses, ParentClass } from "@/services/ParentClassService"
import { menuImages } from "@/constants/images"
import Image from "next/image"
import { useLoading } from "@/lib/LoadingContext"

export default function ParentAssignmentsPage() {
  const { accessToken, refreshToken } = useRequestInfo()
  const { stopLoading } = useLoading()
  const [selectedClass, setSelectedClass] = useState<string>("all-classes")
  const [selectedStudent, setSelectedStudent] = useState<string>("all-students")
  const [selectedType, setSelectedType] = useState<string>("all-types")
  const [refreshKey, setRefreshKey] = useState(0)
  const [assignments, setAssignments] = useState<ParentAssignment[]>([])
  const [classes, setClasses] = useState<ParentClass[]>([])
  const [filtersLoading, setFiltersLoading] = useState(true)
  const [filtersError, setFiltersError] = useState<string | null>(null)

  // Fetch assignments and classes data
  const fetchData = async () => {
    if (!accessToken) return
    
    setFiltersLoading(true)
    setFiltersError(null)
    
    try {
      const [assignmentsData, classesData] = await Promise.all([
        getParentAssignments(accessToken, refreshToken),
        getParentClasses(accessToken, refreshToken)
      ])
      
      // Combine assignments with student information
      const assignmentsWithStudents = assignmentsData.map((assignment: ParentAssignment) => {
        // Find which students are in this class
        const studentsInClass = classesData.flatMap((classItem: ParentClass) => 
          classItem.students.filter(student => classItem.id === assignment.course.id)
            .map(student => ({
              id: student.id,
              name: `${student.first_name} ${student.last_name}`
            }))
        )
        
        return {
          ...assignment,
          students: studentsInClass
        }
      })
      
      setAssignments(assignmentsWithStudents)
      setClasses(classesData)
      // Arrêter le chargement dès qu'on reçoit une réponse (succès)
      stopLoading()
    } catch (error) {
      setFiltersError(error instanceof Error ? error.message : "Error loading data")
      // Arrêter le chargement même en cas d'erreur
      stopLoading()
    } finally {
      setFiltersLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [accessToken, refreshToken])

  // Supprimer le useEffect de sécurité car on gère maintenant dans le try/catch

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1)
    fetchData()
  }

  // Extract unique classes from assignments
  const uniqueClasses = assignments.map(assignment => ({
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

  // Calculer les statistiques globales
  const totalAssignments = assignments.length
  const totalStudents = classes.reduce((total, classItem) => total + classItem.students.length, 0)
  const totalClasses = uniqueClasses.length
  const publishedAssignments = assignments.filter(assignment => assignment.published).length
  const pendingAssignments = totalAssignments - publishedAssignments

  if (filtersLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="relative">
          <Loader2 className="h-12 w-12 animate-spin text-[#25AAE1] mb-6" />
          <div className="absolute inset-0 w-12 h-12 border-4 border-[#25AAE1]/20 rounded-full"></div>
        </div>
        <p className="text-gray-600 font-medium text-lg">Loading assignments data...</p>
        <p className="text-gray-500 text-sm mt-2">Analyzing homework and projects</p>
      </div>
    )
  }

  if (filtersError) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="bg-gradient-to-br from-red-50 to-rose-50 p-8 rounded-3xl border border-red-200 shadow-lg max-w-md w-full">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
            <h3 className="text-xl font-bold text-red-800 mb-2">Connection Error</h3>
            <p className="text-red-600 font-medium text-center mb-6">{filtersError}</p>
            <Button
              onClick={fetchData}
              className="bg-gradient-to-r from-[#25AAE1] to-[#1D8CB3] text-white px-8 py-3 rounded-xl hover:shadow-lg transition-all duration-300"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full space-y-6">
      {/* Header Section */}
      <div className="bg-gradient-to-br from-[#25AAE1] via-[#1D8CB3] to-[#1453B8] p-6 rounded-2xl text-white shadow-xl">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-3xl font-bold mb-1 flex items-center gap-3">
              <Image 
                src={menuImages.assignments} 
                alt="Assignments" 
                width={32} 
                height={32} 
                className="w-8 h-8 brightness-0 invert"
              />
              Assignments Dashboard
            </h1>
            <p className="text-blue-100 text-base">Monitor your children's homework and project deadlines</p>
          </div>
          <div className="flex gap-2">
            <Button 
              className="bg-white/20 hover:bg-white/30 text-white border-white/30 text-sm px-3 py-2"
            >
              <FileText className="h-3 w-3 mr-1" />
              Report
            </Button>
            <Button 
              className="bg-white/20 hover:bg-white/30 text-white border-white/30 text-sm px-3 py-2"
            >
              <Calendar className="h-3 w-3 mr-1" />
              Calendar
            </Button>
          </div>
        </div>

        {/* Filters and Stats */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-white/10 p-3 rounded-xl backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="h-4 w-4 text-blue-200" />
                <span className="text-blue-200 text-xs">Assignments</span>
              </div>
              <h3 className="text-lg font-bold">{totalAssignments}</h3>
              <p className="text-blue-100 text-sm">Total Tasks</p>
            </div>
            
            <div className="bg-white/10 p-3 rounded-xl backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-2">
                <Users className="h-4 w-4 text-blue-200" />
                <span className="text-blue-200 text-xs">Students</span>
              </div>
              <h3 className="text-lg font-bold">{totalStudents}</h3>
              <p className="text-blue-100 text-sm">Total Children</p>
            </div>
            
            <div className="bg-white/10 p-3 rounded-xl backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-4 w-4 text-blue-200" />
                <span className="text-blue-200 text-xs">Published</span>
              </div>
              <h3 className="text-lg font-bold">{publishedAssignments}</h3>
              <p className="text-blue-100 text-sm">Active Tasks</p>
            </div>
          </div>

          <div className="flex gap-2">
            <Select value={selectedStudent} onValueChange={setSelectedStudent}>
              <SelectTrigger className="w-[180px] bg-white/20 border-white/30 text-white placeholder:text-blue-100">
                <SelectValue placeholder="All Students" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-students">All Students ({totalStudents})</SelectItem>
                {classes.flatMap(classItem => classItem.students).map((student) => (
                  <SelectItem key={student.id} value={student.id.toString()}>
                    {`${student.first_name} ${student.last_name}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedClass} onValueChange={setSelectedClass}>
              <SelectTrigger className="w-[180px] bg-white/20 border-white/30 text-white placeholder:text-blue-100">
                <SelectValue placeholder="All Classes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-classes">All Classes</SelectItem>
                {uniqueClasses.map((cls) => (
                  <SelectItem key={cls.id} value={cls.id.toString()}>
                    {cls.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-[180px] bg-white/20 border-white/30 text-white placeholder:text-blue-100">
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
          </div>
        </div>
      </div>

      {/* Assignments Table */}
      <Card className="bg-white rounded-2xl shadow-xl border-0 overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-gray-100">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            <Image 
              src={menuImages.assignments} 
              alt="Assignments" 
              width={20} 
              height={20} 
              className="w-5 h-5"
            />
            Assignments Overview
          </h2>
          <p className="text-gray-600 text-sm mt-1">Detailed view of your children's homework and project assignments</p>
        </div>
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

      {/* Action Buttons */}
      <div className="flex justify-center gap-4">
        <Button
          onClick={handleRefresh}
          disabled={filtersLoading}
          className="bg-gradient-to-r from-[#25AAE1] to-[#1D8CB3] text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-300"
        >
          {filtersLoading ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4 mr-2" />
          )}
          Refresh Data
        </Button>
      </div>
    </div>
  )
}
