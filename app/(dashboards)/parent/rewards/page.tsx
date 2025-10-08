"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ParentRewardsTable } from "@/components/parents/rewards/parent-rewards-table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileText, Printer, RefreshCw, Loader2, AlertCircle, Award, Download, User, School, Calendar } from "lucide-react"
import { ReportDialog } from "@/components/parents/rewards/report-dialog"
import { PrintDialog } from "@/components/parents/rewards/print-dialog"
import { getParentRewardsView, ParentRewardsData } from "@/services/RewardsService"
import { useRequestInfo } from "@/hooks/useRequestInfo"
import { menuImages } from "@/constants/images"
import Image from "next/image"
import { useLoading } from "@/lib/LoadingContext"

export default function ParentRewardsPage() {
  const { accessToken } = useRequestInfo()
  const { stopLoading } = useLoading()
  const [selectedStudent, setSelectedStudent] = useState<string>("all-students")
  const [isReportModalOpen, setIsReportModalOpen] = useState(false)
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false)
  const [rewardsData, setRewardsData] = useState<ParentRewardsData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Safety: ensure loading stops when component unmounts
  useEffect(() => {
    return () => {
      stopLoading()
    }
  }, [stopLoading])

  // Fetch rewards data
  const fetchRewardsData = async () => {
    if (!accessToken) {
      stopLoading()
      return
    }

    setLoading(true)
    setError(null)

    try {
      const data = await getParentRewardsView(accessToken)
      setRewardsData(data)
    } catch (error) {
      setError(error instanceof Error ? error.message : "Error loading rewards data")
    } finally {
      setLoading(false)
      stopLoading() // Always stop global loading
    }
  }

  useEffect(() => {
    fetchRewardsData()
  }, [accessToken])

  const handleRefresh = () => {
    fetchRewardsData()
  }

  // Calculer les statistiques globales
  const totalPoints = rewardsData.reduce((sum, student) => sum + student.report.totalPoints, 0)
  const totalStudents = rewardsData.length
  const averagePoints = totalStudents > 0 ? Math.round(totalPoints / totalStudents) : 0

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="relative">
          <Loader2 className="h-12 w-12 animate-spin text-[#25AAE1] mb-6" />
          <div className="absolute inset-0 w-12 h-12 border-4 border-[#25AAE1]/20 rounded-full"></div>
        </div>
        <p className="text-gray-600 font-medium text-lg">Loading rewards data...</p>
        <p className="text-gray-500 text-sm mt-2">Analyzing achievements and points</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="bg-gradient-to-br from-red-50 to-rose-50 p-8 rounded-3xl border border-red-200 shadow-lg max-w-md w-full">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
            <h3 className="text-xl font-bold text-red-800 mb-2">Connection Error</h3>
            <p className="text-red-600 font-medium text-center mb-6">{error}</p>
            <Button
              onClick={fetchRewardsData}
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
                src={menuImages.rewards} 
                alt="Rewards" 
                width={32} 
                height={32} 
                className="w-8 h-8 brightness-0 invert"
              />
              Rewards Dashboard
            </h1>
            <p className="text-blue-100 text-base">Track your children's achievements and reward points</p>
          </div>
          <div className="flex gap-2">
            <Button 
              className="bg-white/20 hover:bg-white/30 text-white border-white/30 text-sm px-3 py-2"
              onClick={() => setIsReportModalOpen(true)}
            >
              <FileText className="h-3 w-3 mr-1" />
              Report
            </Button>
            <Button 
              className="bg-white/20 hover:bg-white/30 text-white border-white/30 text-sm px-3 py-2"
              onClick={() => setIsPrintModalOpen(true)}
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
                <User className="h-4 w-4 text-blue-200" />
                <span className="text-blue-200 text-xs">Students</span>
              </div>
              <h3 className="text-lg font-bold">{totalStudents}</h3>
              <p className="text-blue-100 text-sm">Total Children</p>
            </div>
            
            <div className="bg-white/10 p-3 rounded-xl backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-2">
                <Award className="h-4 w-4 text-blue-200" />
                <span className="text-blue-200 text-xs">Points</span>
              </div>
              <h3 className="text-lg font-bold">{totalPoints}</h3>
              <p className="text-blue-100 text-sm">Total Points</p>
            </div>
            
            <div className="bg-white/10 p-3 rounded-xl backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-2">
                <School className="h-4 w-4 text-blue-200" />
                <span className="text-blue-200 text-xs">Average</span>
              </div>
              <h3 className="text-lg font-bold">{averagePoints}</h3>
              <p className="text-blue-100 text-sm">Average Points</p>
            </div>
          </div>

          <div className="flex gap-2">
            <Select value={selectedStudent} onValueChange={setSelectedStudent}>
              <SelectTrigger className="w-[180px] bg-white/20 border-white/30 text-white placeholder:text-blue-100">
                <SelectValue placeholder="All Students" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-students">All Students ({rewardsData.length})</SelectItem>
                {rewardsData.map((student) => (
                  <SelectItem key={student.student_id} value={student.student_id.toString()}>
                    {student.full_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Rewards Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Points */}
        <Card className="p-4 bg-gradient-to-br from-[#25AAE1] to-[#1D8CB3] text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border-0">
          <div className="flex items-center justify-between mb-3">
            <Award className="h-6 w-6 text-blue-200" />
            <Badge className="bg-white/20 text-white border-white/30 text-xs">Total</Badge>
          </div>
          <div className="text-3xl font-bold mb-1">{totalPoints}</div>
          <p className="text-blue-100 font-medium text-sm">Total Points</p>
          <div className="mt-2 flex items-center gap-2 text-xs text-blue-200">
            <Award className="h-3 w-3" />
            <span>All Achievements</span>
          </div>
        </Card>

        {/* Students Count */}
        <Card className="p-4 bg-gradient-to-br from-[#10B981] to-[#059669] text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border-0">
          <div className="flex items-center justify-between mb-3">
            <User className="h-6 w-6 text-green-200" />
            <Badge className="bg-white/20 text-white border-white/30 text-xs">Students</Badge>
          </div>
          <div className="text-3xl font-bold mb-1">{totalStudents}</div>
          <p className="text-green-100 font-medium text-sm">Students Count</p>
          <div className="mt-2 flex items-center gap-2 text-xs text-green-200">
            <School className="h-3 w-3" />
            <span>Active Children</span>
          </div>
        </Card>

        {/* Average Points */}
        <Card className="p-4 bg-gradient-to-br from-[#B066F2] to-[#8B5CF6] text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border-0">
          <div className="flex items-center justify-between mb-3">
            <Download className="h-6 w-6 text-purple-200" />
            <Badge className="bg-white/20 text-white border-white/30 text-xs">Average</Badge>
          </div>
          <div className="text-3xl font-bold mb-1">{averagePoints}</div>
          <p className="text-purple-100 font-medium text-sm">Average Points</p>
          <div className="mt-2 flex items-center gap-2 text-xs text-purple-200">
            <Calendar className="h-3 w-3" />
            <span>Per Student</span>
          </div>
        </Card>

        {/* Performance Rating */}
        <Card className="p-4 bg-gradient-to-br from-[#F59E0B] to-[#D97706] text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border-0">
          <div className="flex items-center justify-between mb-3">
            <Award className="h-6 w-6 text-yellow-200" />
            <Badge className="bg-white/20 text-white border-white/30 text-xs">Rating</Badge>
          </div>
          <div className="text-3xl font-bold mb-1">
            {averagePoints >= 100 ? "Excellent" : averagePoints >= 50 ? "Good" : "Average"}
          </div>
          <p className="text-yellow-100 font-medium text-sm">Performance</p>
          <div className="mt-2 flex items-center gap-2 text-xs text-yellow-200">
            <Award className="h-3 w-3" />
            <span>Overall Rating</span>
          </div>
        </Card>
      </div>

      {/* Rewards Table */}
      <Card className="bg-white rounded-2xl shadow-xl border-0 overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-gray-100">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            <Image 
              src={menuImages.rewards} 
              alt="Rewards" 
              width={20} 
              height={20} 
              className="w-5 h-5"
            />
            Rewards Overview
          </h2>
          <p className="text-gray-600 text-sm mt-1">Detailed view of your children's achievements and reward points</p>
        </div>
        <ParentRewardsTable
          selectedStudent={selectedStudent}
          rewardsData={rewardsData}
          loading={loading}
          error={error}
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

      {/* Modals */}
      <ReportDialog
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
      />

      <PrintDialog
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
      />
    </div>
  )
} 