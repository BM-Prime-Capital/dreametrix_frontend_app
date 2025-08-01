"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { GradebookTable } from "../../../../components/student/gradebook/gradebook-table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileText, Printer, ArrowLeft } from "lucide-react"
import { ReportDialog } from "../../../../components/student/gradebook/report-dialog"
import { PrintDialog } from "../../../../components/student/gradebook/print-dialog"
import { Button } from "@/components/ui/button"

export default function GradebookPage() {
  const [selectedClass, setSelectedClass] = useState<string>("all-classes")
  const [isReportModalOpen, setIsReportModalOpen] = useState(false)
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false)

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
              GRADEBOOK
            </h1>
            <p className="text-white/80 text-sm">View your academic performance</p>
          </div>
        </div>
      </div>

      <section className="flex flex-col gap-6 w-full mx-auto p-6 bg-gradient-to-br from-blue-50 via-white to-blue-100 min-h-screen rounded-2xl">
        {/* Header Section avec design moderne */}
        <div className="flex items-center justify-between bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-r from-[#25AAE1] to-[#1D8CB3] rounded-xl flex items-center justify-center">
              <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#25AAE1]">Academic Performance</h2>
              <p className="text-gray-600 text-sm">Track your grades and progress</p>
            </div>
          </div>
          
          <div className="flex gap-4">
            <Select value={selectedClass} onValueChange={setSelectedClass}>
              <SelectTrigger className="w-[200px] bg-white border-2 border-[#25AAE1] rounded-xl shadow-md">
                <SelectValue placeholder="All Classes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-classes">All Classes</SelectItem>
                <SelectItem value="class-5-math">Class 5 - Math</SelectItem>
                <SelectItem value="class-5-sci">Class 5 - Science</SelectItem>
                <SelectItem value="class-5-eng">Class 5 - English</SelectItem>
                <SelectItem value="class-5-his">Class 5 - History</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Action buttons avec design moderne */}
        <div className="flex gap-4">
          <button
            className="bg-gradient-to-r from-[#25AAE1] to-[#1D8CB3] text-white px-8 py-4 rounded-xl flex items-center gap-3 hover:shadow-lg hover:scale-105 transition-all duration-300 shadow-md"
            onClick={() => setIsReportModalOpen(true)}
          >
            <FileText className="h-6 w-6" />
            <span className="font-semibold">Generate Report</span>
          </button>
          
          <button 
            className="bg-gradient-to-r from-[#25AAE1] to-[#1D8CB3] text-white px-6 py-4 rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300 shadow-md" 
            onClick={() => setIsPrintModalOpen(true)}
            title="Print"
          >
            <Printer className="h-6 w-6" />
          </button>
        </div>

        {/* Table avec design moderne */}
        <Card className="rounded-2xl shadow-xl p-0 overflow-hidden border-0 bg-white">
          <div className="bg-gradient-to-r from-[#25AAE1] to-[#1D8CB3] p-4">
            <h2 className="text-white font-bold text-lg">Academic Performance</h2>
          </div>
          <GradebookTable />
        </Card>

        <ReportDialog isOpen={isReportModalOpen} onClose={() => setIsReportModalOpen(false)} />

        <PrintDialog isOpen={isPrintModalOpen} onClose={() => setIsPrintModalOpen(false)} />
      </section>
    </div>
  )
}

