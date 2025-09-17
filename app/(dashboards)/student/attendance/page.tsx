"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { AttendanceTable } from "../../../../components/student/attendance/attendance-table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

import { FileText, Printer, Calendar, ArrowLeft, ChevronLeft, ChevronRight, RefreshCw } from "lucide-react"
import { DatePickerDialog } from "../../../../components/student/attendance/date-picker-dialog"
import { ReportDialog } from "../../../../components/student/attendance/report-dialog"
import { PrintDialog } from "../../../../components/student/attendance/print-dialog"
import { Button } from "@/components/ui/button"

import { useAttendance } from "@/hooks/useAttendance"
import { useRequestInfo } from "@/hooks/useRequestInfo"

export default function AttendancePage() {
  const [selectedClass, setSelectedClass] = useState<string>("all-classes")
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false)
  const [isReportModalOpen, setIsReportModalOpen] = useState(false)
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false)

  const { accessToken, isLoading: tokenLoading } = useRequestInfo();
  const {
    data,
    loading,
    error,
    totalCount,
    hasNext,
    hasPrevious,
    currentPage,
    refetch,
    fetchPage,
    fetchByDate,
    clearError
  } = useAttendance({}, accessToken);
  
  const handleDateSelection = (dateTimestamp: Date) => {
    const selectedDate = new Date(dateTimestamp).toISOString().split('T')[0]
    console.log('selectedDate => ', selectedDate);
    fetchByDate(selectedDate)
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
          <p className="text-gray-600 mb-4">Please log in to view your attendance records.</p>
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
              ATTENDANCE
            </h1>
            <p className="text-white/80 text-sm">Track your daily attendance</p>
          </div>
        </div>
      </div>

      <section className="flex flex-col gap-6 w-full mx-auto p-6 bg-gradient-to-br from-blue-50 via-white to-blue-100 min-h-screen rounded-2xl">

        {/* Header Section avec design moderne */}
        <div className="flex items-center justify-between bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-r from-[#25AAE1] to-[#1D8CB3] rounded-xl flex items-center justify-center">
              <Calendar className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#25AAE1]">Attendance Records</h2>
              <p className="text-gray-600 text-sm">Manage your attendance data</p>
            </div>
          </div>
          
          <div className="flex gap-4">
            <button
              className="bg-white border-2 border-[#25AAE1] rounded-xl px-6 py-3 flex items-center gap-3 hover:bg-[#25AAE1] hover:text-white transition-all duration-300 shadow-md"
              onClick={() => setIsDatePickerOpen(true)}
            >
              <span className="text-[#25AAE1] font-semibold hover:text-white transition-colors">SELECT DATE</span>
              <Calendar className="h-5 w-5 text-[#25AAE1] hover:text-white transition-colors" />
            </button>

            <Button
              onClick={handleRefresh}
              disabled={loading}
              className="bg-white border-2 border-[#25AAE1] text-[#25AAE1] hover:bg-[#25AAE1] hover:text-white rounded-xl shadow-md"
            >
              <RefreshCw className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
            </Button>
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

        {/* Stats Summary */}
        {!loading && data && data.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
              <div className="text-blue-800 font-semibold">Total Records</div>
              <div className="text-2xl font-bold text-blue-900">{totalCount}</div>
            </Card>
            <Card className="p-4 bg-gradient-to-r from-green-50 to-green-100 border-green-200">
              <div className="text-green-800 font-semibold">Current Page</div>
              <div className="text-2xl font-bold text-green-900">{currentPage}</div>
            </Card>
            <Card className="p-4 bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
              <div className="text-purple-800 font-semibold">Records on Page</div>
              <div className="text-2xl font-bold text-purple-900">{data?.length || 0}</div>
            </Card>
          </div>
        )}

        {/* Table avec design moderne */}
        <Card className="rounded-2xl shadow-xl p-0 overflow-hidden border-0 bg-white">
          <div className="bg-gradient-to-r from-[#25AAE1] to-[#1D8CB3] p-4">
            <h2 className="text-white font-bold text-lg">Attendance Records</h2>
          </div>
          <AttendanceTable data={data || []} loading={loading} error={error} />
        </Card>

        {/* Pagination */}
        {!loading && !error && totalCount > 0 && (
          <div className="flex items-center justify-between bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
            <div className="text-sm text-gray-600">
              Showing {data?.length || 0} of {totalCount} records (Page {currentPage})
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                onClick={() => fetchPage(currentPage - 1)}
                disabled={!hasPrevious || loading}
                variant="outline"
                size="sm"
                className="border-[#25AAE1] text-[#25AAE1] hover:bg-[#25AAE1] hover:text-white"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              
              <Button
                onClick={() => fetchPage(currentPage + 1)}
                disabled={!hasNext || loading}
                variant="outline"
                size="sm"
                className="border-[#25AAE1] text-[#25AAE1] hover:bg-[#25AAE1] hover:text-white"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        <DatePickerDialog
          isOpen={isDatePickerOpen}
          onClose={() => setIsDatePickerOpen(false)}
          onApply={handleDateSelection}
        />

        <ReportDialog isOpen={isReportModalOpen} onClose={() => setIsReportModalOpen(false)} />

        <PrintDialog isOpen={isPrintModalOpen} onClose={() => setIsPrintModalOpen(false)} />
      </section>
    </div>
  )
}

