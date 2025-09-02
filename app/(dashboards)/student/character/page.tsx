"use client"

import { useState } from "react"
import { FileText, Printer, ArrowLeft } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { CharacterTable } from "../../../../components/student/character/character-table"

export default function CharacterPage() {
  const [selectedClass, setSelectedClass] = useState<string>("all-classes")

  // Modal states
  const [isReportOpen, setIsReportOpen] = useState(false)
  const [isPrintOpen, setIsPrintOpen] = useState(false)

  const handleOpenReport = () => {
    setIsReportOpen(true)
  }

  const handleOpenPrint = () => {
    setIsPrintOpen(true)
  }

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
              CHARACTER
            </h1>
            <p className="text-white/80 text-sm">Track your character development</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-6 w-full mx-auto p-6 bg-gradient-to-br from-blue-50 via-white to-blue-100 min-h-screen rounded-2xl">
        {/* Header Section avec design moderne */}
        <div className="flex items-center justify-between bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-r from-[#25AAE1] to-[#1D8CB3] rounded-xl flex items-center justify-center">
              <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#25AAE1]">Character Assessment</h2>
              <p className="text-gray-600 text-sm">View your character scores and feedback</p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <Button
              className="bg-gradient-to-r from-[#25AAE1] to-[#1D8CB3] hover:shadow-lg hover:scale-105 text-white flex items-center gap-2 px-6 py-3 rounded-xl transition-all duration-300 shadow-md"
              onClick={handleOpenReport}
            >
              <FileText size={18} />
              <span>Report</span>
            </Button>
            <Button
              variant="outline"
              className="bg-gradient-to-r from-[#25AAE1] to-[#1D8CB3] hover:shadow-lg hover:scale-105 text-white border-none px-4 py-3 rounded-xl transition-all duration-300 shadow-md"
              onClick={handleOpenPrint}
            >
              <Printer size={18} />
            </Button>
            <div className="relative">
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger className="w-[200px] bg-white border-2 border-[#25AAE1] rounded-xl shadow-md">
                  <SelectValue placeholder="All Classes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-classes">All Classes</SelectItem>
                  <SelectItem value="class-5-math">Class 5 - Math</SelectItem>
                  <SelectItem value="class-5-sci">Class 5 - Sci</SelectItem>
                  <SelectItem value="class-n">Class N</SelectItem>
                  <SelectItem value="class-n-1">Class N</SelectItem>
                  <SelectItem value="class-n-2">Class N</SelectItem>
                  <SelectItem value="class-n-3">Class N</SelectItem>
                  <SelectItem value="class-n-4">Class N</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Table avec design moderne */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          <div className="bg-gradient-to-r from-[#25AAE1] to-[#1D8CB3] p-4">
            <h2 className="text-white font-bold text-lg">Character Assessment</h2>
          </div>
          <CharacterTable />
        </div>

        {/* Report Modal */}
        <Dialog open={isReportOpen} onOpenChange={setIsReportOpen}>
          <DialogContent className="sm:max-w-[400px] p-0">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-medium text-gray-700">Report</h2>
                <button onClick={() => setIsReportOpen(false)} className="text-gray-500 hover:text-gray-700" title="Close">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="border-t mb-6"></div>

              <div className="space-y-4">
                <Select defaultValue="class-5-math">
                  <SelectTrigger className="w-full rounded-xl">
                    <SelectValue placeholder="Class 5 - Math" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="class-5-math">Class 5 - Math</SelectItem>
                    <SelectItem value="class-5-sci">Class 5 - Sci</SelectItem>
                    <SelectItem value="class-5-bio">Class 5 - Bio</SelectItem>
                    <SelectItem value="class-5-lit">Class 5 - Lit</SelectItem>
                  </SelectContent>
                </Select>

                <Button className="w-full bg-gradient-to-r from-[#25AAE1] to-[#1D8CB3] hover:shadow-lg text-white rounded-xl flex items-center justify-center gap-2 py-3">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>SAVE REPORT</span>
                </Button>

                <div className="text-center mt-2">
                  <button onClick={() => setIsReportOpen(false)} className="text-gray-500 hover:text-gray-700">
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Print Modal */}
        <Dialog open={isPrintOpen} onOpenChange={setIsPrintOpen}>
          <DialogContent className="sm:max-w-[400px] p-0">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-medium text-gray-700">Print</h2>
                <button onClick={() => setIsPrintOpen(false)} className="text-gray-500 hover:text-gray-700" title="Close">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="border-t mb-6"></div>

              <div className="space-y-4">
                <Select defaultValue="class-5-math">
                  <SelectTrigger className="w-full rounded-xl">
                    <SelectValue placeholder="Class 5 - Math" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="class-5-math">Class 5 - Math</SelectItem>
                    <SelectItem value="class-5-sci">Class 5 - Sci</SelectItem>
                    <SelectItem value="class-5-bio">Class 5 - Bio</SelectItem>
                    <SelectItem value="class-5-lit">Class 5 - Lit</SelectItem>
                  </SelectContent>
                </Select>

                <Button className="w-full bg-gradient-to-r from-[#25AAE1] to-[#1D8CB3] hover:shadow-lg text-white rounded-xl">PRINT</Button>

                <div className="text-center mt-2">
                  <button onClick={() => setIsPrintOpen(false)} className="text-gray-500 hover:text-gray-700">
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

