"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { GradebookTable } from "../../../../components/student/gradebook/gradebook-table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileText, Printer } from "lucide-react"
import { ReportDialog } from "../../../../components/student/gradebook/report-dialog"
import { PrintDialog } from "../../../../components/student/gradebook/print-dialog"

export default function GradebookPage() {
  const [selectedClass, setSelectedClass] = useState<string>("all-classes")
  const [isReportModalOpen, setIsReportModalOpen] = useState(false)
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false)

  return (
    <section className="flex flex-col gap-4 w-full mx-auto p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-secondary text-xl font-bold">GRADEBOOK</h1>
        <div className="flex gap-4">
          <Select value={selectedClass} onValueChange={setSelectedClass}>
            <SelectTrigger className="w-[180px] bg-card border-border">
              <SelectValue placeholder="All Classes" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-classes">All Classes</SelectItem>
              <SelectItem value="class-5-math">Class 5 - Math</SelectItem>
              <SelectItem value="class-n-1">Class N</SelectItem>
              <SelectItem value="class-n-2">Class N</SelectItem>
              <SelectItem value="class-n-3">Class N</SelectItem>
              <SelectItem value="class-n-4">Class N</SelectItem>
              <SelectItem value="class-n-5">Class N</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex gap-4">
        <button
          className="bg-secondary text-white px-6 py-3 rounded-md flex items-center gap-2 hover:bg-secondary-hover transition-colors"
          onClick={() => setIsReportModalOpen(true)}
        >
          <FileText className="h-5 w-5" />
          <span>Report</span>
        </button>
        <button 
          className="bg-primary text-white px-4 py-3 rounded-md hover:bg-primary-hover transition-colors" 
          onClick={() => setIsPrintModalOpen(true)}
          title="Print"
        >
          <Printer className="h-5 w-5" />
        </button>
      </div>

      <Card className="rounded-lg shadow-sm p-0 overflow-hidden border">
        <GradebookTable />
      </Card>

      <ReportDialog isOpen={isReportModalOpen} onClose={() => setIsReportModalOpen(false)} />

      <PrintDialog isOpen={isPrintModalOpen} onClose={() => setIsPrintModalOpen(false)} />
    </section>
  )
}

