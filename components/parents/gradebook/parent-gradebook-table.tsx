"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ParentChild, GradebookData, ClassData } from "@/services/ParentGradebookService"
import { Loader2, AlertCircle, ChevronLeft, ChevronRight, Eye, User, BookOpen, GraduationCap } from "lucide-react"
import { GradebookDetailsDialog } from "./gradebook-details-dialog"

interface ParentGradebookTableProps {
  selectedStudent: string
  selectedClass: string
  children: ParentChild[]
  gradebookData: GradebookData[]
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
  classData,
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
      <Card className="p-8">
        <div className="flex flex-col items-center justify-center py-12">
          <div className="relative">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            <div className="absolute inset-0 rounded-full border-2 border-blue-200 animate-pulse"></div>
                </div>
          <span className="mt-4 text-gray-600 font-medium">Loading gradebook data...</span>
                </div>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="p-8">
        <div className="flex flex-col items-center justify-center py-12">
          <div className="bg-red-100 p-4 rounded-full mb-4">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
          <span className="text-red-600 font-medium">Error: {error}</span>
        </div>
      </Card>
    )
  }

  if (filteredData.length === 0) {
    return (
      <Card className="p-8">
        <div className="flex flex-col items-center justify-center py-12">
          <div className="bg-gray-100 p-4 rounded-full mb-4">
            <BookOpen className="w-8 h-8 text-gray-400" />
          </div>
          <span className="text-gray-500 font-medium">No gradebook data available</span>
          <span className="text-gray-400 text-sm mt-2">Try adjusting your filters</span>
        </div>
      </Card>
    )
  }

  return (
    <>
      <Card className="overflow-hidden border-0 shadow-lg">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50 hover:bg-gray-50 border-b-2 border-gray-200">
                <TableHead className="font-bold text-gray-700 py-4 px-6">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-blue-500" />
                    STUDENT
                  </div>
                </TableHead>
                <TableHead className="font-bold text-gray-700 py-4 px-6">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-green-500" />
                    CLASS
                  </div>
                </TableHead>
                <TableHead className="font-bold text-gray-700 py-4 px-6 text-center">
                  ACTION
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.map((item, index) => (
                <TableRow 
                  key={`${item.student_id}-${item.class_id}`} 
                  className={`
                    hover:bg-blue-50 transition-colors duration-200 border-b border-gray-100
                    ${index % 2 === 0 ? "bg-white" : "bg-gray-50/30"}
                  `}
                >
                  <TableCell className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-100 p-2 rounded-full">
                        <User className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200 font-medium">
                          {item.student_name}
                        </Badge>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="bg-green-100 p-2 rounded-full">
                        <BookOpen className="w-4 h-4 text-green-600" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-semibold text-gray-800">{item.class_name}</span>
                        <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full inline-block w-fit">
                          {item.subject}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="py-4 px-6 text-center">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewDetails(item.student_id, item.class_id, item.student_name, item.class_name)}
                      className="
                        flex items-center gap-2 text-blue-600 hover:text-blue-700 
                        border-blue-200 hover:border-blue-300 hover:bg-blue-50
                        transition-all duration-200 font-medium
                      "
                    >
                      <Eye className="h-4 w-4" />
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination améliorée */}
        {totalPages > 1 && (
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Showing <span className="font-medium">{startIndex + 1}</span> to{" "}
                <span className="font-medium">{Math.min(endIndex, filteredData.length)}</span> of{" "}
                <span className="font-medium">{filteredData.length}</span> result{filteredData.length > 1 ? 's' : ''}
              </div>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="flex items-center gap-2 hover:bg-blue-50 hover:border-blue-300"
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
                      className={`
                        w-8 h-8 p-0 text-sm
                        ${currentPage === page 
                          ? "bg-blue-600 text-white hover:bg-blue-700" 
                          : "hover:bg-blue-50 hover:border-blue-300"
                        }
                      `}
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
                  className="flex items-center gap-2 hover:bg-blue-50 hover:border-blue-300"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* Modale de détails */}
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
    </>
  )
}