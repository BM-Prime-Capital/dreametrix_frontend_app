"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ParentGradebookTableV2 } from "@/components/parents/gradebook/parent-gradebook-table-v2"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RefreshCw, Loader2, AlertCircle, BookOpen, TrendingUp, Award } from "lucide-react"
import { useRequestInfo } from "@/hooks/useRequestInfo"
import { getLinkedStudents, LinkedStudent, calculateStudentStats, getStudentClassesForParent } from "@/services/ParentGradebookService"
import { menuImages } from "@/constants/images"
import Image from "next/image"
import { useLoading } from "@/lib/LoadingContext"

export default function ParentGradebookPage() {
  const { accessToken } = useRequestInfo()
  const { stopLoading } = useLoading()
  const [linkedStudents, setLinkedStudents] = useState<LinkedStudent[]>([])
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState({
    overallAverage: 0,
    totalClasses: 0,
    bestSubject: { name: "", average: 0 },
    totalAssessments: 0
  })

  // Safety: ensure loading stops when component unmounts
  useEffect(() => {
    return () => {
      stopLoading()
    }
  }, [stopLoading])

  // Fetch linked students on mount
  useEffect(() => {
    fetchLinkedStudents()
  }, [accessToken])

  const fetchLinkedStudents = async () => {
    if (!accessToken) {
      stopLoading()
      return
    }

    try {
      setLoading(true)
      setError(null)
      const students = await getLinkedStudents(accessToken)
      setLinkedStudents(students)

      // Sélectionner le premier étudiant par défaut
      if (students.length > 0 && !selectedStudentId) {
        setSelectedStudentId(students[0].id)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch linked students")
    } finally {
      setLoading(false)
      stopLoading() // Always stop global loading
    }
  }

  // Fetch student classes when student selection changes
  useEffect(() => {
    if (selectedStudentId && accessToken) {
      fetchStudentStats()
    }
  }, [selectedStudentId, accessToken])

  const fetchStudentStats = async () => {
    if (!selectedStudentId || !accessToken) return

    try {
      const classes = await getStudentClassesForParent(selectedStudentId, accessToken)
      const calculatedStats = calculateStudentStats(classes)
      setStats(calculatedStats)
    } catch (err) {
      console.error("Error fetching student stats:", err)
    }
  }

  const handleRefresh = () => {
    fetchLinkedStudents()
    if (selectedStudentId) {
      fetchStudentStats()
    }
  }

  const handleStudentChange = (value: string) => {
    setSelectedStudentId(Number(value))
  }

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

  const selectedStudent = linkedStudents.find(s => s.id === selectedStudentId)

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
            <p className="text-blue-100 text-base">Track your children&apos;s academic performance and grades</p>
          </div>
        </div>

        {/* Student Selection and Stats */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-white/10 p-3 rounded-xl backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-4 w-4 text-blue-200" />
                <span className="text-blue-200 text-xs">Average</span>
              </div>
              <h3 className="text-lg font-bold">{stats.overallAverage.toFixed(1)}%</h3>
              <p className="text-blue-100 text-sm">Overall Average</p>
            </div>

            <div className="bg-white/10 p-3 rounded-xl backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-2">
                <BookOpen className="h-4 w-4 text-blue-200" />
                <span className="text-blue-200 text-xs">Classes</span>
              </div>
              <h3 className="text-lg font-bold">{stats.totalClasses}</h3>
              <p className="text-blue-100 text-sm">Total Classes</p>
            </div>

            <div className="bg-white/10 p-3 rounded-xl backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-2">
                <Award className="h-4 w-4 text-blue-200" />
                <span className="text-blue-200 text-xs">Best Subject</span>
              </div>
              <h3 className="text-lg font-bold">{stats.bestSubject.name || "N/A"}</h3>
              <p className="text-blue-100 text-sm">{stats.bestSubject.average.toFixed(1)}%</p>
            </div>
          </div>

          <div className="flex gap-2">
            <Select
              value={selectedStudentId?.toString() || ""}
              onValueChange={handleStudentChange}
            >
              <SelectTrigger className="w-[220px] bg-white/20 border-white/30 text-white placeholder:text-blue-100">
                <SelectValue placeholder="Select Student" />
              </SelectTrigger>
              <SelectContent>
                {linkedStudents.map((student) => (
                  <SelectItem key={student.id} value={student.id.toString()}>
                    {student.full_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {selectedStudent && (
          <div className="mt-4 bg-white/10 p-3 rounded-xl backdrop-blur-sm">
            <p className="text-blue-200 text-sm">Viewing gradebook for:</p>
            <p className="text-white font-semibold text-lg">{selectedStudent.full_name}</p>
          </div>
        )}
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
            Academic Performance
          </h2>
          <p className="text-gray-600 text-sm mt-1">Click on a class to view detailed grades and submissions</p>
        </div>
        {selectedStudentId && (
          <ParentGradebookTableV2
            studentId={selectedStudentId}
            accessToken={accessToken || ''}
          />
        )}
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