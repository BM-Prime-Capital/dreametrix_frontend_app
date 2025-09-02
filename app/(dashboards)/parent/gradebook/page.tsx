"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ParentGradebookTable } from "@/components/parents/gradebook/parent-gradebook-table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RefreshCw, Loader2, AlertCircle, BookOpen, Users, TrendingUp, Award, Star, GraduationCap, FileText, Printer } from "lucide-react"
import { useRequestInfo } from "@/hooks/useRequestInfo"
import { useParentGradebook } from "@/hooks/useParentGradebook"
import { menuImages } from "@/constants/images"
import Image from "next/image"
import { useLoading } from "@/lib/LoadingContext"

export default function ParentGradebookPage() {
  const { accessToken } = useRequestInfo()
  const { stopLoading } = useLoading()
  const [selectedStudent, setSelectedStudent] = useState<string>("all-students")
  const [selectedClass, setSelectedClass] = useState<string>("all-classes")
  const [isReportModalOpen, setIsReportModalOpen] = useState(false)
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false)

  const {
    children,
    gradebookData,
    classData,
    loading,
    error,
    refreshData,
    currentPage,
    totalPages,
    itemsPerPage,
    setCurrentPage
  } = useParentGradebook({ accessToken: accessToken || '' })

  // Arrêter le chargement dès qu'on reçoit une réponse (succès ou erreur)
  useEffect(() => {
    if (!loading) {
      stopLoading()
    }
  }, [loading, stopLoading])

  const handleRefresh = () => {
    refreshData()
  }

  // Calculer les statistiques globales
  const totalStudents = children.length
  const totalClasses = classData.length
  const totalCourses = children.reduce((sum, child) => sum + child.courses.length, 0)
  const averageGrade = children.length > 0 ? 
    children.reduce((sum, child) => sum + (child.courses.length * 85), 0) / totalCourses : 0 // Valeur par défaut

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="relative">
          <Loader2 className="h-12 w-12 animate-spin text-[#25AAE1] mb-6" />
          <div className="absolute inset-0 w-12 h-12 border-4 border-[#25AAE1]/20 rounded-full"></div>
        </div>
        <p className="text-gray-600 font-medium text-lg">Loading gradebook data...</p>
        <p className="text-gray-500 text-sm mt-2">Analyzing academic performance and grades</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="bg-red-50 border border-red-200 rounded-2xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="h-8 w-8 text-red-600" />
          </div>
          <h3 className="text-xl font-bold text-red-800 mb-2">Connection Error</h3>
          <p className="text-red-600 font-medium text-center mb-6">{error}</p>
          <Button
            onClick={handleRefresh}
            className="bg-gradient-to-r from-[#25AAE1] to-[#1D8CB3] text-white px-8 py-3 rounded-xl hover:shadow-lg transition-all duration-300"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
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
                src={menuImages.gradebook} 
                alt="Gradebook" 
                width={32} 
                height={32} 
                className="w-8 h-8 brightness-0 invert"
              />
              Gradebook Dashboard
            </h1>
            <p className="text-blue-100 text-base">Track your children's academic performance and grades</p>
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
              <Printer className="h-3 w-3 mr-1" />
              Print
            </Button>
          </div>
        </div>

        {/* Filters and Stats */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
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
                <BookOpen className="h-4 w-4 text-blue-200" />
                <span className="text-blue-200 text-xs">Classes</span>
              </div>
              <h3 className="text-lg font-bold">{totalClasses}</h3>
              <p className="text-blue-100 text-sm">Total Classes</p>
            </div>
            
            <div className="bg-white/10 p-3 rounded-xl backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-4 w-4 text-blue-200" />
                <span className="text-blue-200 text-xs">Average</span>
              </div>
              <h3 className="text-lg font-bold">{averageGrade}%</h3>
              <p className="text-blue-100 text-sm">Average Grade</p>
            </div>
          </div>

          <div className="flex gap-2">
            <Select value={selectedStudent} onValueChange={setSelectedStudent}>
              <SelectTrigger className="w-[180px] bg-white/20 border-white/30 text-white placeholder:text-blue-100">
                <SelectValue placeholder="All Students" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-students">All Students</SelectItem>
                {children.map((child) => (
                  <SelectItem key={child.user_id} value={child.user_id.toString()}>
                    {child.full_name}
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
                {classData.map((classItem) => (
                  <SelectItem key={classItem.id} value={classItem.id.toString()}>
                    {classItem.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Gradebook Table */}
      <Card className="bg-white rounded-2xl shadow-xl border-0 overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-gray-100">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            <Image 
              src={menuImages.gradebook} 
              alt="Gradebook" 
              width={20} 
              height={20} 
              className="w-5 h-5"
            />
            Gradebook Overview
          </h2>
          <p className="text-gray-600 text-sm mt-1">Detailed view of your children's academic performance and grades</p>
        </div>
        <ParentGradebookTable
          selectedStudent={selectedStudent}
          selectedClass={selectedClass}
          children={children}
          gradebookData={gradebookData}
          classData={classData}
          loading={loading}
          error={error}
          currentPage={currentPage}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
          setCurrentPage={setCurrentPage}
          accessToken={accessToken || ''}
        />
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-center gap-4">
        <Button
          onClick={handleRefresh}
          disabled={loading}
          className="bg-gradient-to-r from-[#25AAE1] to-[#1D8CB3] text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-300"
        >
          {loading ? (
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