"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RefreshCw, Loader2, Heart, Star, Users, TrendingUp, Award, Smile, Frown, AlertCircle } from "lucide-react"
import { useRequestInfo } from "@/hooks/useRequestInfo"
import { useParentDashboard } from "@/hooks/useParentDashboard"
import { menuImages } from "@/constants/images"
import Image from "next/image"
import { useLoading } from "@/lib/LoadingContext"

export default function ParentCharactersPage() {
  const { accessToken } = useRequestInfo()
  const { stopLoading } = useLoading()
  const [selectedStudent, setSelectedStudent] = useState<string>("all-students")

  // Use central dashboard hook
  const {
    studentsSummary,
    loading,
    error,
    refreshData,
    isMockMode
  } = useParentDashboard(accessToken)

  useEffect(() => {
    if (!loading) {
      stopLoading()
    }
  }, [loading, stopLoading])

  const handleRefresh = () => {
    refreshData()
  }

  // Filter students based on selection
  const filteredStudents = selectedStudent === "all-students"
    ? studentsSummary
    : studentsSummary.filter(s => s.student_id.toString() === selectedStudent)

  // Calculate global statistics
  const totalStudents = studentsSummary.length
  const totalGoodCharacter = studentsSummary.reduce((sum, s) => sum + s.character.good_character_count, 0)
  const totalBadCharacter = studentsSummary.reduce((sum, s) => sum + s.character.bad_character_count, 0)
  const averageCharacterScore = studentsSummary.length > 0
    ? studentsSummary.reduce((sum, s) => sum + s.character.character_score, 0) / studentsSummary.length
    : 0

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="relative">
          <Loader2 className="h-12 w-12 animate-spin text-[#25AAE1] mb-6" />
          <div className="absolute inset-0 w-12 h-12 border-4 border-[#25AAE1]/20 rounded-full"></div>
        </div>
        <p className="text-gray-600 font-medium text-lg">Loading character data...</p>
        <p className="text-gray-500 text-sm mt-2">Analyzing character development and behavior</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
        <p className="text-gray-800 font-medium text-lg mb-2">Error Loading Data</p>
        <p className="text-gray-600 text-sm mb-4">{error}</p>
        <Button onClick={handleRefresh} className="bg-[#25AAE1] hover:bg-[#1D8CB3]">
          <RefreshCw className="h-4 w-4 mr-2" />
          Try Again
        </Button>
      </div>
    )
  }

  return (
    <div className="w-full space-y-6">
      {/* Mock Data Warning */}
      {isMockMode && (
        <Card className="bg-amber-50 border-amber-200 p-4">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-amber-600" />
            <div>
              <p className="text-amber-900 font-medium">Using Mock Data</p>
              <p className="text-amber-700 text-sm">Backend API not yet implemented. Displaying sample data.</p>
            </div>
          </div>
        </Card>
      )}

      {/* Header Section */}
      <div className="bg-gradient-to-br from-[#25AAE1] via-[#1D8CB3] to-[#1453B8] p-6 rounded-2xl text-white shadow-xl">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-3xl font-bold mb-1 flex items-center gap-3">
              <Image
                src={menuImages.character}
                alt="Character"
                width={32}
                height={32}
                className="w-8 h-8 brightness-0 invert"
              />
              Character Development
            </h1>
            <p className="text-blue-100 text-base">Monitor your children's character development and behavior</p>
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
                <Smile className="h-4 w-4 text-blue-200" />
                <span className="text-blue-200 text-xs">Good</span>
              </div>
              <h3 className="text-lg font-bold">{totalGoodCharacter}</h3>
              <p className="text-blue-100 text-sm">Good Behaviors</p>
            </div>

            <div className="bg-white/10 p-3 rounded-xl backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-4 w-4 text-blue-200" />
                <span className="text-blue-200 text-xs">Score</span>
              </div>
              <h3 className="text-lg font-bold">{averageCharacterScore.toFixed(1)}%</h3>
              <p className="text-blue-100 text-sm">Avg Character</p>
            </div>
          </div>

          <div className="flex gap-2">
            <Select value={selectedStudent} onValueChange={setSelectedStudent}>
              <SelectTrigger className="w-[180px] bg-white/20 border-white/30 text-white placeholder:text-blue-100">
                <SelectValue placeholder="All Students" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-students">All Students ({studentsSummary.length})</SelectItem>
                {studentsSummary.map((student) => (
                  <SelectItem key={student.student_id} value={student.student_id.toString()}>
                    {student.full_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Student Character Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredStudents.map((student) => (
          <Card key={student.student_id} className="bg-white rounded-2xl shadow-lg border-0 overflow-hidden hover:shadow-xl transition-all">
            {/* Student Header */}
            <div className="bg-gradient-to-r from-[#25AAE1] to-[#1D8CB3] p-6 text-white">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-2xl font-bold">
                    {student.full_name.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">{student.full_name}</h3>
                    <p className="text-blue-100 text-sm">{student.grade_level}</p>
                  </div>
                </div>
                <Badge
                  className={`${
                    student.character.trending === "up"
                      ? "bg-green-500"
                      : student.character.trending === "down"
                      ? "bg-red-500"
                      : "bg-gray-500"
                  } text-white border-0`}
                >
                  {student.character.trending === "up" ? "↑" : student.character.trending === "down" ? "↓" : "→"} {student.character.trending}
                </Badge>
              </div>
            </div>

            {/* Character Stats */}
            <div className="p-6">
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center p-4 bg-green-50 rounded-xl">
                  <Smile className="h-6 w-6 text-green-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-green-700">{student.character.good_character_count}</div>
                  <p className="text-green-600 text-xs mt-1">Good Behaviors</p>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-xl">
                  <Frown className="h-6 w-6 text-red-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-red-700">{student.character.bad_character_count}</div>
                  <p className="text-red-600 text-xs mt-1">Bad Behaviors</p>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-xl">
                  <Award className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-blue-700">{student.character.character_score.toFixed(1)}%</div>
                  <p className="text-blue-600 text-xs mt-1">Character Score</p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Character Development</span>
                  <span className="text-sm font-bold text-[#25AAE1]">{student.character.character_score.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div
                    className={`h-3 rounded-full transition-all ${
                      student.character.character_score >= 90
                        ? "bg-green-500"
                        : student.character.character_score >= 75
                        ? "bg-blue-500"
                        : student.character.character_score >= 60
                        ? "bg-yellow-500"
                        : "bg-red-500"
                    }`}
                    style={{ width: `${student.character.character_score}%` }}
                  />
                </div>
              </div>

              {/* Character Breakdown */}
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-gray-600">Good: {student.character.good_character_count}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <span className="text-gray-600">Bad: {student.character.bad_character_count}</span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Summary Statistics */}
      <Card className="bg-white rounded-2xl shadow-xl border-0 overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-gray-100">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            <Image
              src={menuImages.character}
              alt="Character"
              width={20}
              height={20}
              className="w-5 h-5"
            />
            Overall Statistics
          </h2>
          <p className="text-gray-600 text-sm mt-1">Aggregated character development metrics across all students</p>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-xl">
              <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <div className="text-3xl font-bold text-blue-700">{totalStudents}</div>
              <p className="text-blue-600 text-sm mt-1">Total Students</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-xl">
              <Smile className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <div className="text-3xl font-bold text-green-700">{totalGoodCharacter}</div>
              <p className="text-green-600 text-sm mt-1">Total Good Behaviors</p>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-xl">
              <Frown className="h-8 w-8 text-red-600 mx-auto mb-2" />
              <div className="text-3xl font-bold text-red-700">{totalBadCharacter}</div>
              <p className="text-red-600 text-sm mt-1">Total Bad Behaviors</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-xl">
              <Award className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <div className="text-3xl font-bold text-purple-700">{averageCharacterScore.toFixed(1)}%</div>
              <p className="text-purple-600 text-sm mt-1">Average Score</p>
            </div>
          </div>
        </div>
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