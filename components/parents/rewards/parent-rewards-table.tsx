"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ParentRewardsData } from "@/services/RewardsService"
import { Loader2, AlertCircle, Trophy, Star, CheckCircle, Clock, XCircle, RefreshCw } from "lucide-react"
import { RewardsDetailsDialog } from "./rewards-details-dialog"

interface ParentRewardsTableProps {
  selectedStudent: string
  rewardsData: ParentRewardsData[]
  loading: boolean
  error: string | null
}

export function ParentRewardsTable({ 
  selectedStudent, 
  rewardsData,
  loading,
  error
}: ParentRewardsTableProps) {
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  const [selectedReward, setSelectedReward] = useState<ParentRewardsData | null>(null)

  // Filtrer les données
  const filteredData = rewardsData.filter((item) => {
    const studentMatch = 
      selectedStudent === "all-students" || 
      item.student_id.toString() === selectedStudent
    
    return studentMatch
  })

  const handleRewardClick = (reward: ParentRewardsData) => {
    setSelectedReward(reward)
    setIsDetailsModalOpen(true)
  }

  // Show loading state
  if (loading) {
    return (
      <div className="w-full flex items-center justify-center py-16">
        <div className="text-center">
          <div className="relative">
            <Loader2 className="h-12 w-12 animate-spin text-[#25AAE1] mx-auto mb-4" />
            <div className="absolute inset-0 w-12 h-12 border-4 border-[#25AAE1]/20 rounded-full mx-auto"></div>
          </div>
          <p className="text-gray-600 font-medium text-lg">Loading rewards data...</p>
          <p className="text-gray-500 text-sm mt-2">Analyzing achievements and progress</p>
        </div>
      </div>
    )
  }

  // Show error state
  if (error) {
    return (
      <div className="w-full flex items-center justify-center py-16">
        <div className="bg-gradient-to-br from-red-50 to-rose-50 p-8 rounded-3xl border border-red-200 shadow-lg max-w-md w-full">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
            <h3 className="text-xl font-bold text-red-800 mb-2">Connection Error</h3>
            <p className="text-red-600 font-medium text-center mb-6">{error}</p>
            <Button
              onClick={() => window.location.reload()}
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
    <div className="w-full relative">
      <div className="overflow-x-auto">
        <Table className="w-full">
          <TableHeader>
            <TableRow className="hover:bg-transparent border-b border-gray-200">
              <TableHead className="font-bold text-gray-700 py-4 text-sm uppercase tracking-wide pl-6">STUDENT</TableHead>
              <TableHead className="font-bold text-gray-700 py-4 text-sm uppercase tracking-wide text-center">TOTAL POINTS</TableHead>
              <TableHead className="font-bold text-gray-700 py-4 text-sm uppercase tracking-wide text-center">ATTENDANCE</TableHead>
              <TableHead className="font-bold text-gray-700 py-4 text-sm uppercase tracking-wide text-center">GOOD DOMAINS</TableHead>
              <TableHead className="font-bold text-gray-700 py-4 text-sm uppercase tracking-wide text-center">FOCUS AREAS</TableHead>
              <TableHead className="font-bold text-gray-700 py-4 text-sm uppercase tracking-wide text-center">ACTIONS</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map((item, index) => (
              <TableRow 
                key={item.student_id} 
                className={`hover:bg-blue-50/50 transition-all duration-200 cursor-pointer ${
                  index % 2 === 0 ? "bg-white" : "bg-gray-50/30"
                }`}
                onClick={() => handleRewardClick(item)}
              >
                <TableCell className="py-4 pl-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-[#25AAE1] to-[#1D8CB3] rounded-full flex items-center justify-center text-white font-semibold text-sm">
                      {item.full_name.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-800">{item.full_name}</div>
                      <div className="text-gray-500 text-sm">ID: {item.student_id}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="py-4 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full flex items-center justify-center">
                      <Trophy className="h-4 w-4 text-white" />
                    </div>
                    <span className="font-bold text-xl text-amber-600">{item.report.totalPoints}</span>
                  </div>
                </TableCell>
                <TableCell className="py-4 text-center">
                  <div className="flex items-center justify-center space-x-4">
                    <div className="flex flex-col items-center gap-1">
                      <div className="flex items-center gap-1">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm font-semibold text-green-600">{item.report.attendanceBalance.present}</span>
                      </div>
                      <span className="text-xs text-gray-500">Present</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <div className="flex items-center gap-1">
                        <XCircle className="h-4 w-4 text-red-500" />
                        <span className="text-sm font-semibold text-red-600">{item.report.attendanceBalance.absent}</span>
                      </div>
                      <span className="text-xs text-gray-500">Absent</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4 text-yellow-500" />
                        <span className="text-sm font-semibold text-yellow-600">{item.report.attendanceBalance.late}</span>
                      </div>
                      <span className="text-xs text-gray-500">Late</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="py-4 text-center">
                  <div className="flex flex-wrap justify-center gap-1">
                    {item.report.goodDomains.slice(0, 2).map((domain, i) => (
                      <Badge 
                        key={i} 
                        variant="outline" 
                        className="bg-green-50 text-green-700 border-green-200 text-xs"
                      >
                        {domain}
                      </Badge>
                    ))}
                    {item.report.goodDomains.length > 2 && (
                      <Badge 
                        variant="outline" 
                        className="bg-blue-50 text-blue-700 border-blue-200 text-xs"
                      >
                        +{item.report.goodDomains.length - 2}
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell className="py-4 text-center">
                  <div className="flex flex-wrap justify-center gap-1">
                    {item.report.focusDomains.slice(0, 2).map((domain, i) => (
                      <Badge 
                        key={i} 
                        variant="outline" 
                        className="bg-orange-50 text-orange-700 border-orange-200 text-xs"
                      >
                        {domain}
                      </Badge>
                    ))}
                    {item.report.focusDomains.length > 2 && (
                      <Badge 
                        variant="outline" 
                        className="bg-blue-50 text-blue-700 border-blue-200 text-xs"
                      >
                        +{item.report.focusDomains.length - 2}
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell className="py-4 text-center">
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-gradient-to-r from-[#25AAE1] to-[#1D8CB3] text-white border-0 hover:from-[#1D8CB3] hover:to-[#1453B8] transition-all duration-300"
                  >
                    <Star className="h-4 w-4 mr-2" />
                    View Details
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {filteredData.length === 0 && !loading && (
        <div className="text-center py-16">
          <div className="bg-gradient-to-br from-gray-50 to-slate-50 p-8 rounded-3xl border border-gray-200 shadow-lg max-w-md mx-auto">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">No Rewards Data</h3>
            <p className="text-gray-600 text-center">No rewards records found for the selected filters</p>
          </div>
        </div>
      )}

      {/* Rewards Details Dialog */}
      {selectedReward && (
        <RewardsDetailsDialog
          isOpen={isDetailsModalOpen}
          onClose={() => {
            setIsDetailsModalOpen(false)
            setSelectedReward(null)
          }}
          reward={selectedReward}
        />
      )}
    </div>
  )
} 