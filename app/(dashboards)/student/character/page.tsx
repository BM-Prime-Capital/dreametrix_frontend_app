"use client"

import { useState } from "react"

import { FileText, Printer, ArrowLeft, ChevronLeft, ChevronRight, RefreshCw, X } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { CharacterTable } from "../../../../components/student/character/character-table"

import { CommentsModal } from "../../../../components/student/character/comments-modal"
import { HistoryModal } from "../../../../components/student/character/history-modal"
import { useCharacter } from "@/hooks/useCharacter"
import { useRequestInfo } from "@/hooks/useRequestInfo"
import { CharacterRating } from "@/types/character"

export default function CharacterPage() {
  const [selectedClass, setSelectedClass] = useState<string>("all-classes")
  const [selectedItem, setSelectedItem] = useState<CharacterRating | null>(null)
  const [isCommentsOpen, setIsCommentsOpen] = useState(false)
  const [isHistoryOpen, setIsHistoryOpen] = useState(false)
  const [isPrintOpen, setIsPrintOpen] = useState(false)

  const { accessToken, isLoading: tokenLoading } = useRequestInfo();
  
  const {
    data,
    loading,
    error,
    studentInfo,
    summary,
    refetch,
    fetchByPeriod,
    clearError
  } = useCharacter({}, accessToken);

  const handleOpenComments = (item: CharacterRating) => {
    setSelectedItem(item)
    setIsCommentsOpen(true)
  }

  const handleOpenHistory = (item: CharacterRating) => {
    setSelectedItem(item)
    setIsHistoryOpen(true)
  }

  const handleOpenReport = () => {
    setIsReportOpen(true)
  }

  const handleOpenPrint = () => {
    setIsPrintOpen(true)
  }

  const handleRefresh = () => {
    clearError()
    if (accessToken) {
      refetch()
    }
  }

  // Show loading while token is being loaded
  if (tokenLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-[#25AAE1]" />
          <p className="text-gray-600">Loading authentication...</p>
        </div>
      </div>
    )
  }

  // Show error if no token after loading
  if (!tokenLoading && (!accessToken || accessToken.trim() === '')) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Authentication Required</h2>
          <p className="text-gray-600 mb-4">Please log in to view your character records.</p>
          <Button 
            onClick={() => window.location.href = '/login'} 
            className="bg-[#25AAE1] hover:bg-[#1D8CB3]"
          >
            Go to Login
          </Button>
        </div>
      </div>
    )
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
            <Button
              onClick={handleRefresh}
              disabled={loading}
              className="bg-white border-2 border-[#25AAE1] text-[#25AAE1] hover:bg-[#25AAE1] hover:text-white rounded-xl shadow-md px-4 py-3"
            >
              <RefreshCw className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
            </Button>
            <div className="relative">
              <Select value={selectedClass} onValueChange={(value) => {
                setSelectedClass(value);
                if (value !== "all-classes") {
                  fetchByPeriod(value);
                } else if (accessToken) {
                  refetch();
                }
              }}>
                <SelectTrigger className="w-[200px] bg-white border-2 border-[#25AAE1] rounded-xl shadow-md">
                  <SelectValue placeholder="All Periods" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-classes">All Periods</SelectItem>
                  <SelectItem value="morning">Morning</SelectItem>
                  <SelectItem value="afternoon">Afternoon</SelectItem>
                  <SelectItem value="evening">Evening</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Student Info & Stats Summary */}
        {!loading && studentInfo && summary && (
          <>
            <Card className="p-6 bg-gradient-to-r from-[#25AAE1] to-[#1D8CB3] text-white mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">{studentInfo.name}</h2>
                  <p className="opacity-90">Student ID: {studentInfo.id}</p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold">{summary.total_days_evaluated}</div>
                  <div className="opacity-90">Days Evaluated</div>
                </div>
              </div>
            </Card>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="p-4 bg-gradient-to-r from-green-50 to-green-100 border-green-200">
                <div className="text-green-800 font-semibold">Good Behaviors</div>
                <div className="text-2xl font-bold text-green-900">{summary.total_good_character}</div>
                <div className="text-sm text-green-600">{summary.average_good_per_day.toFixed(1)} avg/day</div>
              </Card>
              <Card className="p-4 bg-gradient-to-r from-red-50 to-red-100 border-red-200">
                <div className="text-red-800 font-semibold">Bad Behaviors</div>
                <div className="text-2xl font-bold text-red-900">{summary.total_bad_character}</div>
                <div className="text-sm text-red-600">{summary.average_bad_per_day.toFixed(1)} avg/day</div>
              </Card>
              <Card className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
                <div className="text-blue-800 font-semibold">Total Records</div>
                <div className="text-2xl font-bold text-blue-900">{data?.length || 0}</div>
              </Card>
              <Card className="p-4 bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
                <div className="text-purple-800 font-semibold">Success Rate</div>
                <div className="text-2xl font-bold text-purple-900">
                  {summary.total_good_character + summary.total_bad_character > 0 
                    ? Math.round((summary.total_good_character / (summary.total_good_character + summary.total_bad_character)) * 100)
                    : 0}%
                </div>
              </Card>
            </div>
          </>
        )}

        {/* Table avec design moderne */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          <div className="bg-gradient-to-r from-[#25AAE1] to-[#1D8CB3] p-4">
            <h2 className="text-white font-bold text-lg">Character Assessment</h2>
          </div>

          
          <CharacterTable 
            data={data || []} 
            loading={loading} 
            error={error}
            onOpenComments={handleOpenComments}
            onOpenHistory={handleOpenHistory}
          />
        </div>




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

        <CommentsModal 
          isOpen={isCommentsOpen}
          onClose={() => setIsCommentsOpen(false)}
          selectedItem={selectedItem}
        />

        <HistoryModal 
          isOpen={isHistoryOpen}
          onClose={() => setIsHistoryOpen(false)}
          selectedItem={selectedItem}
          allData={data || []}
        />
      </div>
    </div>
  )
}

