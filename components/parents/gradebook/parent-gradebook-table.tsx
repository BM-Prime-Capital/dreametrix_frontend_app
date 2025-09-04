/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
//import { Card } from "@/components/ui/card"
import { ParentChild, ClassData } from "@/services/ParentGradebookService"
import { Loader2, AlertCircle, ChevronLeft, ChevronRight, Eye, BookOpen, RefreshCw, Star, TrendingUp } from "lucide-react"
import { GradebookDetailsDialog } from "./gradebook-details-dialog"

interface ParentGradebookTableProps {
  selectedStudent: string
  selectedClass: string
  children: ParentChild[]
  gradebookData: any
  classData: ClassData[]
  loading: boolean
  error: string | null
  currentPage: number
  totalPages: number
  itemsPerPage: number
  setCurrentPage: (page: number) => void
  accessToken: string
}

export function ParentGradebookTable({ 
  selectedStudent, 
  selectedClass,
  children,
  gradebookData,
  //classData,
  loading,
  error,
  currentPage,
  totalPages,
  itemsPerPage,
  setCurrentPage,
  accessToken
}: ParentGradebookTableProps) {
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  const [selectedDetails, setSelectedDetails] = useState<{
    studentId: number
    classId: number
    studentName: string
    className: string
  } | null>(null)

  const handleViewDetails = (studentId: number, classId: number, studentName: string, className: string) => {
    setSelectedDetails({
      studentId,
      classId,
      studentName,
      className
    })
    setIsDetailsModalOpen(true)
  }

  // Créer les données du tableau à partir des enfants et leurs cours
  const tableData = children.flatMap(child => 
    child.courses.map(course => ({
      student_id: child.owner_id, // Utiliser owner_id pour l'endpoint
      user_id: child.user_id, // Garder user_id pour l'affichage
      student_name: child.full_name,
      class_id: course.course_id,
      class_name: course.course_name,
      subject: course.subject
    }))
  )

  // Filtrer les données
  const filteredData = tableData.filter((item) => {
    const studentMatch = 
      selectedStudent === "all-students" || 
      item.user_id.toString() === selectedStudent // Utiliser user_id pour le filtrage
    
    const classMatch = 
      selectedClass === "all-classes" || 
      item.class_id.toString() === selectedClass
    
    return studentMatch && classMatch
  })

  // Pagination
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedData = filteredData.slice(startIndex, endIndex)

  if (loading) {
    return (
      <div className="w-full flex items-center justify-center py-16">
        <div className="text-center">
          <div className="relative">
            <Loader2 className="h-12 w-12 animate-spin text-[#25AAE1] mx-auto mb-4" />
            <div className="absolute inset-0 w-12 h-12 border-4 border-[#25AAE1]/20 rounded-full mx-auto"></div>
          </div>
          <p className="text-gray-600 font-medium text-lg">Loading gradebook data...</p>
          <p className="text-gray-500 text-sm mt-2">Analyzing academic performance and grades</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="w-full flex items-center justify-center py-16">
        <div className="bg-gradient-to-br from-red-50 to-rose-50 p-8 rounded-3xl border border-red-200 shadow-lg max-w-md w-full">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
            <h3 className="text-xl font-bold text-red-800 mb-2">Connection Error</h3>
            <p className="text-red-600 font-medium text-center mb-6">{error}</p>
            <Button
              onClick={() => window.location.reload()}
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

  const getGradeColor = (grade: number) => {
    if (grade >= 90) return 'text-green-600 bg-green-100 border-green-200'
    if (grade >= 80) return 'text-blue-600 bg-blue-100 border-blue-200'
    if (grade >= 70) return 'text-yellow-600 bg-yellow-100 border-yellow-200'
    if (grade >= 60) return 'text-orange-600 bg-orange-100 border-orange-200'
    return 'text-red-600 bg-red-100 border-red-200'
  }

  const getGradeLetter = (grade: number) => {
    if (grade >= 90) return 'A'
    if (grade >= 80) return 'B'
    if (grade >= 70) return 'C'
    if (grade >= 60) return 'D'
    return 'F'
  }

  return (
    <div className="w-full relative">
      <div className="overflow-x-auto">
        <Table className="w-full">
          <TableHeader>
            <TableRow className="hover:bg-transparent border-b border-gray-200">
              <TableHead className="font-bold text-gray-700 py-4 text-sm uppercase tracking-wide pl-6">STUDENT</TableHead>
              <TableHead className="font-bold text-gray-700 py-4 text-sm uppercase tracking-wide text-center">CLASS</TableHead>
              <TableHead className="font-bold text-gray-700 py-4 text-sm uppercase tracking-wide text-center">SUBJECT</TableHead>
              <TableHead className="font-bold text-gray-700 py-4 text-sm uppercase tracking-wide text-center">GRADE</TableHead>
              <TableHead className="font-bold text-gray-700 py-4 text-sm uppercase tracking-wide text-center">PERFORMANCE</TableHead>
              <TableHead className="font-bold text-gray-700 py-4 text-sm uppercase tracking-wide text-center">ACTIONS</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.map((item, index) => {
              // Trouver les données de gradebook correspondantes
              const gradebookItem = gradebookData.find((gb: { student_id: number; class_id: number }) => 
                gb.student_id === item.student_id && gb.class_id === item.class_id
              )
              const averageScore = gradebookItem?.average_score || 0
              const gradeLetter = getGradeLetter(averageScore)

              return (
                <TableRow 
                  key={`${item.student_id}-${item.class_id}`} 
                  className={`hover:bg-blue-50/50 transition-all duration-200 cursor-pointer ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50/30"
                  }`}
                  onClick={() => handleViewDetails(item.student_id, item.class_id, item.student_name, item.class_name)}
                >
                  <TableCell className="py-4 pl-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-[#25AAE1] to-[#1D8CB3] rounded-full flex items-center justify-center text-white font-semibold text-sm">
                        {item.student_name.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-800">{item.student_name}</div>
                        <div className="text-gray-500 text-sm">ID: {item.user_id}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="py-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full flex items-center justify-center">
                        <BookOpen className="h-4 w-4 text-white" />
                      </div>
                      <span className="font-medium text-gray-700">{item.class_name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="py-4 text-center">
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs">
                      {item.subject}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-8 h-8 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full flex items-center justify-center">
                        <Star className="h-4 w-4 text-white" />
                      </div>
                      <div className="text-center">
                        <div className={`font-bold text-lg ${getGradeColor(averageScore).split(' ')[0]}`}>
                          {gradeLetter}
                        </div>
                        <div className="text-sm text-gray-500">{averageScore}%</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="py-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <div className="flex items-center gap-1">
                        <TrendingUp className="h-4 w-4 text-green-500" />
                        <span className="text-sm font-semibold text-green-600">
                          {averageScore >= 90 ? 'Excellent' : 
                           averageScore >= 80 ? 'Good' : 
                           averageScore >= 70 ? 'Average' : 
                           averageScore >= 60 ? 'Below Average' : 'Needs Improvement'}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="py-4 text-center">
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-gradient-to-r from-[#25AAE1] to-[#1D8CB3] text-white border-0 hover:from-[#1D8CB3] hover:to-[#1453B8] transition-all duration-300"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
          <div className="text-sm text-gray-600">
            Showing {startIndex + 1} to {Math.min(endIndex, filteredData.length)} of {filteredData.length} results
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="bg-white border-gray-300 hover:bg-gray-50"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(page)}
                  className={currentPage === page ? 
                    "bg-[#25AAE1] text-white" : 
                    "bg-white border-gray-300 hover:bg-gray-50"
                  }
                >
                  {page}
                </Button>
              ))}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="bg-white border-gray-300 hover:bg-gray-50"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {filteredData.length === 0 && !loading && (
        <div className="text-center py-16">
          <div className="bg-gradient-to-br from-gray-50 to-slate-50 p-8 rounded-3xl border border-gray-200 shadow-lg max-w-md mx-auto">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">No Gradebook Data</h3>
            <p className="text-gray-600 text-center">No gradebook records found for the selected filters</p>
          </div>
        </div>
      )}

      {/* Gradebook Details Dialog */}
      {selectedDetails && (
        <GradebookDetailsDialog
          isOpen={isDetailsModalOpen}
          onClose={() => {
            setIsDetailsModalOpen(false)
            setSelectedDetails(null)
          }}
          studentId={selectedDetails.studentId}
          classId={selectedDetails.classId}
          studentName={selectedDetails.studentName}
          className={selectedDetails.className}
          accessToken={accessToken}
        />
      )}
    </div>
  )
}