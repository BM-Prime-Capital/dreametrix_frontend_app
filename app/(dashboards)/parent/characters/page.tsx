"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { ParentCharactersTable } from "@/components/parents/characters/parent-characters-table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileText, Printer, RefreshCw, Loader2, AlertCircle, Heart, Star } from "lucide-react"
import { ReportDialog } from "@/components/parents/characters/report-dialog"
import { PrintDialog } from "@/components/parents/characters/print-dialog"
import { getParentCharacterView, ParentCharacterData } from "@/services/CharacterService"
import { useRequestInfo } from "@/hooks/useRequestInfo"

export default function ParentCharactersPage() {
  const { accessToken } = useRequestInfo()
  const [selectedStudent, setSelectedStudent] = useState<string>("all-students")
  const [isReportModalOpen, setIsReportModalOpen] = useState(false)
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false)
  const [charactersData, setCharactersData] = useState<ParentCharacterData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch characters data
  const fetchCharactersData = async () => {
    if (!accessToken) return
    
    setLoading(true)
    setError(null)
    
    try {
      const data = await getParentCharacterView(accessToken)
      setCharactersData(data)
    } catch (error) {
      setError(error instanceof Error ? error.message : "Error loading characters data")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCharactersData()
  }, [accessToken])

  const handleRefresh = () => {
    fetchCharactersData()
  }

  return (
    <section className="flex flex-col gap-4 w-full mx-auto p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-[#25AAE1] text-xl font-bold">CHARACTERS</h1>
        <div className="flex gap-4">
          {loading ? (
            <div className="flex items-center gap-2 text-gray-500">
              <Loader2 className="w-4 h-4 animate-spin" />
              Loading...
            </div>
          ) : error ? (
            <div className="flex items-center gap-2 text-red-500">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          ) : (
            <Select value={selectedStudent} onValueChange={setSelectedStudent}>
              <SelectTrigger className="w-[180px] bg-white">
                <SelectValue placeholder="All Students" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-students">All Students ({charactersData.length})</SelectItem>
                {charactersData.map((student) => (
                  <SelectItem key={student.student_id} value={student.student_id.toString()}>
                    {student.full_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      </div>

      <div className="flex gap-4">
        <button
          className="bg-[#B066F2] text-white px-6 py-3 rounded-md flex items-center gap-2"
          onClick={() => setIsReportModalOpen(true)}
        >
          <FileText className="h-5 w-5" />
          <span>Report</span>
        </button>
        <button className="bg-[#25AAE1] text-white px-4 py-3 rounded-md" onClick={() => setIsPrintModalOpen(true)}>
          <Printer className="h-5 w-5" />
        </button>
        <button
          className="bg-white border rounded-md px-4 py-3 flex items-center gap-2"
          onClick={handleRefresh}
        >
          <RefreshCw className="h-5 w-5 text-gray-500" />
          <span>Refresh</span>
        </button>
      </div>

      <Card className="rounded-lg shadow-sm p-0 overflow-hidden border-0">
        <ParentCharactersTable
          selectedStudent={selectedStudent}
          charactersData={charactersData}
          loading={loading}
          error={error}
        />
      </Card>

      <ReportDialog
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
      />

      <PrintDialog
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
      />
    </section>
  )
} 