"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { StudentGradebookTable } from "../../../../components/student/gradebook/student-gradebook-table"
import { FileText, Printer, ArrowLeft, TrendingUp, Award, BookOpen } from "lucide-react"
import { ReportDialog } from "../../../../components/student/gradebook/report-dialog"
import { PrintDialog } from "../../../../components/student/gradebook/print-dialog"
import { Button } from "@/components/ui/button"

export default function GradebookPage() {
  const [isReportModalOpen, setIsReportModalOpen] = useState(false)
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false)
  const [stats, setStats] = useState({
    overallAverage: 0,
    totalClasses: 0,
    bestSubject: { name: "", average: 0 },
    totalAssessments: 0
  })

  const handleStatsUpdate = (newStats: {
    overallAverage: number;
    totalClasses: number;
    bestSubject: { name: string; average: number } | null;
    totalAssessments: number;
  }) => {
    setStats({
      overallAverage: newStats.overallAverage,
      totalClasses: newStats.totalClasses,
      bestSubject: newStats.bestSubject || { name: "", average: 0 },
      totalAssessments: newStats.totalAssessments
    });
  };

  return (
    <div className="flex flex-col gap-6 w-full min-h-screen">
      {/* Header avec gradient moderne */}
      <div className="bg-gradient-to-r from-[#25AAE1] via-[#25AAE1] to-[#1D8CB3] p-8 rounded-2xl shadow-xl">
        <div className="flex items-center gap-4 text-white">
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/20 p-3 rounded-full transition-all duration-200"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-white tracking-wide mb-1">
              MY GRADEBOOK
            </h1>
            <p className="text-white/80 text-sm">Track your academic performance</p>
          </div>
        </div>
      </div>

      <section className="flex flex-col gap-6 w-full mx-auto p-6 bg-gradient-to-br from-blue-50 via-white to-blue-100 min-h-screen rounded-2xl">
        {/* Header Section avec design moderne */}
        <div className="flex items-center justify-between bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-r from-[#25AAE1] to-[#1D8CB3] rounded-xl flex items-center justify-center">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#25AAE1]">Academic Performance</h2>
              <p className="text-gray-600 text-sm">View your grades and track your progress</p>
            </div>
          </div>
          
          <div className="flex gap-4">
            {/* <Button
              className="bg-gradient-to-r from-[#25AAE1] to-[#1D8CB3] hover:from-[#1D8CB3] hover:to-[#25AAE1] text-white px-6 py-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
              onClick={() => setIsReportModalOpen(true)}
            >
              <FileText className="h-5 w-5 mr-2" />
              Generate Report
            </Button> */}
            
            {/* <Button 
              className="bg-gradient-to-r from-[#25AAE1] to-[#1D8CB3] hover:from-[#1D8CB3] hover:to-[#25AAE1] text-white p-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-300" 
              onClick={() => setIsPrintModalOpen(true)}
              title="Print"
            >
              <Printer className="h-5 w-5" />
            </Button> */}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 bg-gradient-to-r from-green-500 to-green-600 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 rounded-2xl border-0">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 rounded-xl">
                <TrendingUp className="h-8 w-8" />
              </div>
              <div>
                <p className="text-white/90 text-sm font-medium">Overall Average</p>
                <p className="text-3xl font-bold">{stats.overallAverage.toFixed(1)}%</p>
                <p className="text-white/70 text-xs">Across all classes</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-r from-[#25AAE1] to-[#1D8CB3] text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 rounded-2xl border-0">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 rounded-xl">
                <Award className="h-8 w-8" />
              </div>
              <div>
                <p className="text-white/90 text-sm font-medium">Best Subject</p>
                <p className="text-3xl font-bold">{stats.bestSubject.name || "N/A"}</p>
                <p className="text-white/70 text-xs">{stats.bestSubject.average.toFixed(1)}% average</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 rounded-2xl border-0">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 rounded-xl">
                <BookOpen className="h-8 w-8" />
              </div>
              <div>
                <p className="text-white/90 text-sm font-medium">Total Classes</p>
                <p className="text-3xl font-bold">{stats.totalClasses}</p>
                <p className="text-white/70 text-xs">{stats.totalAssessments} assessments</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Gradebook Table avec design moderne */}
        <Card className="rounded-2xl shadow-xl p-0 overflow-hidden border-0 bg-white">
          <div className="bg-gradient-to-r from-[#25AAE1] to-[#1D8CB3] p-4">
            <h2 className="text-white font-bold text-lg">Your Academic Performance</h2>
          </div>
          <div className="p-6">
            <StudentGradebookTable onStatsUpdate={handleStatsUpdate} />
          </div>
        </Card>

        <ReportDialog isOpen={isReportModalOpen} onClose={() => setIsReportModalOpen(false)} />
        <PrintDialog isOpen={isPrintModalOpen} onClose={() => setIsPrintModalOpen(false)} />
      </section>
    </div>
  )
}

