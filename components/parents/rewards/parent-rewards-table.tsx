"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ParentRewardsData } from "@/services/RewardsService"
import { Loader2, AlertCircle, Trophy, Star } from "lucide-react"
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
      <div className="w-full flex items-center justify-center py-8">
        <div className="flex items-center gap-2 text-gray-500">
          <Loader2 className="w-4 h-4 animate-spin" />
          Loading rewards data...
        </div>
      </div>
    )
  }

  // Show error state
  if (error) {
    return (
      <div className="w-full flex items-center justify-center py-8">
        <div className="text-red-500">Error: {error}</div>
      </div>
    )
  }

  return (
    <div className="w-full relative">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent border-b bg-gray-50">
            <TableHead className="font-bold text-gray-700 py-4 text-sm uppercase tracking-wide">STUDENT</TableHead>
            <TableHead className="font-bold text-gray-700 py-4 text-sm uppercase tracking-wide">TOTAL POINTS</TableHead>
            <TableHead className="font-bold text-gray-700 py-4 text-sm uppercase tracking-wide">ATTENDANCE BALANCE</TableHead>
            <TableHead className="font-bold text-gray-700 py-4 text-sm uppercase tracking-wide">GOOD DOMAINS</TableHead>
            <TableHead className="font-bold text-gray-700 py-4 text-sm uppercase tracking-wide">FOCUS AREAS</TableHead>
            <TableHead className="font-bold text-gray-700 py-4 text-sm uppercase tracking-wide">ACTIONS</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredData.map((item, index) => (
            <TableRow key={item.student_id} className={`hover:bg-gray-50 transition-colors ${index % 2 === 0 ? "bg-white" : "bg-gray-50"}`}>
              <TableCell className="py-4">
                <div className="font-semibold text-gray-800">{item.full_name}</div>
              </TableCell>
              <TableCell className="py-4">
                <div className="flex items-center gap-2">
                  <Trophy className="h-4 w-4 text-amber-500" />
                  <span className="font-semibold text-amber-600">{item.report.totalPoints}</span>
                </div>
              </TableCell>
              <TableCell className="py-4">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">{item.report.attendanceBalance.present}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">{item.report.attendanceBalance.absent}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">{item.report.attendanceBalance.late}</span>
                  </div>
                </div>
              </TableCell>
              <TableCell className="py-4">
                <div className="flex flex-wrap gap-1">
                  {item.report.goodDomains.slice(0, 2).map((domain, i) => (
                    <Badge key={i} variant="outline" className="bg-green-50 text-green-700 border-green-200 text-xs">
                      {domain}
                    </Badge>
                  ))}
                  {item.report.goodDomains.length > 2 && (
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs">
                      +{item.report.goodDomains.length - 2} more
                    </Badge>
                  )}
                </div>
              </TableCell>
              <TableCell className="py-4">
                <div className="flex flex-wrap gap-1">
                  {item.report.focusDomains.slice(0, 2).map((domain, i) => (
                    <Badge key={i} variant="outline" className="bg-orange-50 text-orange-700 border-orange-200 text-xs">
                      {domain}
                    </Badge>
                  ))}
                  {item.report.focusDomains.length > 2 && (
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs">
                      +{item.report.focusDomains.length - 2} more
                    </Badge>
                  )}
                </div>
              </TableCell>
              <TableCell className="py-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleRewardClick(item)}
                  className="text-blue-600 hover:text-blue-700 border-blue-200 hover:border-blue-300 hover:bg-blue-50"
                >
                  <Star className="h-4 w-4 mr-2" />
                  View Details
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {filteredData.length === 0 && !loading && (
        <div className="text-center py-8 text-gray-500">
          <AlertCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p>No rewards records found for the selected filters</p>
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