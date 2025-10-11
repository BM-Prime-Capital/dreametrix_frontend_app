"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  getStudentClassesForParent,
  getStudentClassGradebookForParent,
  formatClassData,
  calculateClassStats,
  StudentClass,
  StudentGradebookDetail
} from "@/services/ParentGradebookService"
import {
  BookOpen,
  AlertCircle,
  Loader2,
  CheckCircle,
  Clock,
  ChevronLeft,
  ChevronRight
} from "lucide-react"
import { StudentAudioPlayer } from "../../student/gradebook/StudentAudioPlayer"

interface ParentGradebookTableV2Props {
  studentId: number
  accessToken: string
}

export function ParentGradebookTableV2({ studentId, accessToken }: ParentGradebookTableV2Props) {
  const [classes, setClasses] = useState<StudentClass[]>([])
  const [selectedClass, setSelectedClass] = useState<StudentClass | null>(null)
  const [classDetails, setClassDetails] = useState<StudentGradebookDetail[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)

  useEffect(() => {
    fetchClasses()
  }, [studentId, accessToken])

  const fetchClasses = async () => {
    if (!accessToken || !studentId) {
      setError("Authentication required")
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)
      const data = await getStudentClassesForParent(studentId, accessToken)
      setClasses(data)
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch classes"
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleClassSelect = async (classData: StudentClass) => {
    if (!accessToken || !studentId) return

    try {
      setSelectedClass(classData)

      // Récupérer les détails de la classe
      const details = await getStudentClassGradebookForParent(
        studentId,
        classData.course_id,
        accessToken
      )

      setClassDetails(details)
    } catch (err: unknown) {
      console.error("Error fetching class details:", err)
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch class details"
      setError(errorMessage)
    }
  }

  const handleBackToClasses = () => {
    setSelectedClass(null)
    setClassDetails(null)
    setCurrentPage(1)
  }

  // Fonctions de pagination
  const getCurrentSubmissions = () => {
    if (!classDetails || classDetails.length === 0) return []
    const detail = classDetails[0]
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return detail.submissions.slice(startIndex, endIndex)
  }

  const totalPages = () => {
    if (!classDetails || classDetails.length === 0) return 0
    const detail = classDetails[0]
    return Math.ceil(detail.submissions.length / itemsPerPage)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const getSubmissionStatus = (submission: StudentGradebookDetail['submissions'][0]) => {
    if (submission.marked) {
      return { icon: <CheckCircle className="h-4 w-4 text-green-600" />, text: "Marked", color: "text-green-600" }
    } else if (submission.score > 0) {
      return { icon: <Clock className="h-4 w-4 text-yellow-600" />, text: "Submitted", color: "text-yellow-600" }
    } else {
      return { icon: <Clock className="h-4 w-4 text-gray-400" />, text: "Not submitted", color: "text-gray-400" }
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-[#25AAE1] mb-4" />
        <p className="text-gray-600 font-medium">Loading classes...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <AlertCircle className="h-8 w-8 text-red-500 mb-4" />
        <p className="text-red-600 font-medium text-center">{error}</p>
        <button
          onClick={fetchClasses}
          className="mt-4 px-4 py-2 bg-[#25AAE1] text-white rounded-lg hover:bg-[#1D8CB3] transition-colors"
        >
          Try Again
        </button>
      </div>
    )
  }

  if (selectedClass && classDetails) {
    const stats = calculateClassStats(classDetails)
    const detail = classDetails[0]

    return (
      <div className="space-y-6 p-6">
        {/* Header avec bouton retour */}
        <div className="flex items-center justify-between">
          <button
            onClick={handleBackToClasses}
            className="flex items-center gap-2 text-[#25AAE1] hover:text-[#1D8CB3] transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Classes
          </button>
          <div className="text-right">
            <h3 className="font-bold text-gray-900">{selectedClass.course}</h3>
            <p className="text-sm text-gray-600">Performance Details</p>
          </div>
        </div>

        {/* Résumé de performance */}
        <Card className="p-6 bg-gradient-to-r from-[#25AAE1]/10 to-[#1D8CB3]/10 border-[#25AAE1]/20">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-[#25AAE1] mb-2">
                {stats.studentAverage.toFixed(1)}%
              </div>
              <p className="text-gray-600 text-sm">Student Average</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {stats.averageScore.toFixed(1)}%
              </div>
              <p className="text-gray-600 text-sm">Average Score</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {stats.markedSubmissions}
              </div>
              <p className="text-gray-600 text-sm">Marked Submissions</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-700 mb-2">
                {detail.submissions.length}
              </div>
              <p className="text-gray-600 text-sm">Total Submissions</p>
            </div>
          </div>
        </Card>

        {/* Table des submissions */}
        <Card className="overflow-hidden">
          <div className="bg-gradient-to-r from-[#25AAE1] to-[#1D8CB3] p-4">
            <h3 className="text-white font-bold">Submission Details</h3>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="font-bold text-gray-700">Assessment</TableHead>
                  <TableHead className="font-bold text-gray-700">Type</TableHead>
                  <TableHead className="font-bold text-gray-700">Score</TableHead>
                  <TableHead className="font-bold text-gray-700">Status</TableHead>
                  <TableHead className="font-bold text-gray-700">Voice Note</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {getCurrentSubmissions().map((submission, index) => {
                  const status = getSubmissionStatus(submission)
                  return (
                    <TableRow key={submission.submission_id} className={index % 2 === 0 ? "bg-gray-50" : ""}>
                      <TableCell className="font-medium text-gray-800">
                        {submission.assessment_name}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {submission.assessment_type}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-600">
                        {submission.score > 0 ? `${submission.score}%` : "N/A"}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {status.icon}
                          <span className={`text-sm font-medium ${status.color}`}>
                            {status.text}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <StudentAudioPlayer audioPath={submission.voice_note} />
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
          {totalPages() > 1 && (
            <div className="flex justify-between items-center py-4 px-6 border-t border-gray-100">
              <div className="text-sm text-gray-600">
                Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, detail.submissions.length)} of {detail.submissions.length} submissions
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="flex items-center gap-1"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages() }, (_, i) => i + 1).map((page) => (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => handlePageChange(page)}
                      className="w-8 h-8 p-0"
                    >
                      {page}
                    </Button>
                  ))}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages()}
                  className="flex items-center gap-1"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>
    )
  }

  // Vue d'ensemble des classes
  return (
    <div className="space-y-6 p-6">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Student Classes</h3>
        <p className="text-gray-600">Click on a class to view detailed performance</p>
      </div>

      {classes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classes.map((classData) => {
            const formattedData = formatClassData(classData)

            return (
              <Card
                key={classData.course_id}
                className="cursor-pointer hover:shadow-lg transition-all duration-300 overflow-hidden group"
                onClick={() => handleClassSelect(classData)}
              >
                <div className="p-6 text-white bg-gradient-to-r from-[#25AAE1] to-[#1D8CB3]">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-bold text-lg mb-1 line-clamp-2">{classData.course}</h3>
                      <p className="text-white/80 text-sm">Average: {formattedData.average}</p>
                    </div>
                    <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                      <BookOpen className="w-5 h-5" />
                    </div>
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-blue-50 rounded-lg p-3 text-center">
                      <p className="text-2xl font-bold text-blue-600">{formattedData.noOfExams}</p>
                      <p className="text-xs text-blue-600 font-medium">Tests</p>
                    </div>
                    <div className="bg-green-50 rounded-lg p-3 text-center">
                      <p className="text-2xl font-bold text-green-600">{formattedData.noOfHomeworks}</p>
                      <p className="text-xs text-green-600 font-medium">Homework</p>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-3 text-center">
                      <p className="text-2xl font-bold text-purple-600">{formattedData.noOfTests}</p>
                      <p className="text-xs text-purple-600 font-medium">Quizzes</p>
                    </div>
                    <div className="bg-orange-50 rounded-lg p-3 text-center">
                      <p className="text-2xl font-bold text-orange-600">{formattedData.noOfParticipation}</p>
                      <p className="text-xs text-orange-600 font-medium">Participation</p>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700">Total Assessments</span>
                      <span className="text-xl font-bold text-gray-900">{formattedData.totalWork}</span>
                    </div>
                    <div className="mt-2 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-[#25AAE1] to-[#1D8CB3] h-2 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min((formattedData.totalWork / 20) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-100 p-4">
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>Click to view details</span>
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="mx-auto h-24 w-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <BookOpen className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No classes found</h3>
          <p className="text-gray-500">This student has no classes enrolled</p>
        </div>
      )}
    </div>
  )
}
