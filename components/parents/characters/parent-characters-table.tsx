"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ParentCharacterData, transformCharacterData } from "@/services/CharacterService"
import { Loader2, AlertCircle, Heart, Star, TrendingUp, TrendingDown, RefreshCw, Eye, User, Calendar, Smile, Frown } from "lucide-react"
import { CharacterDetailsDialog } from "./character-details-dialog"

interface ParentCharactersTableProps {
  selectedStudent: string
  charactersData: ParentCharacterData[]
  loading: boolean
  error: string | null
}

export function ParentCharactersTable({ 
  selectedStudent, 
  charactersData,
  loading,
  error
}: ParentCharactersTableProps) {
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  const [selectedCharacter, setSelectedCharacter] = useState<ParentCharacterData | null>(null)

  // Filtrer les données
  const filteredData = charactersData.filter((item) => {
    const studentMatch = 
      selectedStudent === "all-students" || 
      item.student_id.toString() === selectedStudent
    
    return studentMatch
  })

  const handleCharacterClick = (character: ParentCharacterData) => {
    setSelectedCharacter(character)
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
          <p className="text-gray-600 font-medium text-lg">Loading character data...</p>
          <p className="text-gray-500 text-sm mt-2">Analyzing character development and behavior</p>
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

  const getBehaviorScore = (good: number, bad: number) => {
    const total = good + bad
    if (total === 0) return { score: 0, color: 'text-gray-500', label: 'No Data' }
    
    const percentage = Math.round((good / total) * 100)
    
    if (percentage >= 80) return { score: percentage, color: 'text-green-600', label: 'Excellent' }
    if (percentage >= 60) return { score: percentage, color: 'text-blue-600', label: 'Good' }
    if (percentage >= 40) return { score: percentage, color: 'text-yellow-600', label: 'Average' }
    return { score: percentage, color: 'text-red-600', label: 'Needs Improvement' }
  }

  return (
    <div className="w-full relative">
      <div className="overflow-x-auto">
        <Table className="w-full">
          <TableHeader>
            <TableRow className="hover:bg-transparent border-b border-gray-200">
              <TableHead className="font-bold text-gray-700 py-4 text-sm uppercase tracking-wide pl-6">STUDENT</TableHead>
              <TableHead className="font-bold text-gray-700 py-4 text-sm uppercase tracking-wide text-center">DAYS EVALUATED</TableHead>
              <TableHead className="font-bold text-gray-700 py-4 text-sm uppercase tracking-wide text-center">GOOD CHARACTER</TableHead>
              <TableHead className="font-bold text-gray-700 py-4 text-sm uppercase tracking-wide text-center">BAD CHARACTER</TableHead>
              <TableHead className="font-bold text-gray-700 py-4 text-sm uppercase tracking-wide text-center">BEHAVIOR SCORE</TableHead>
              <TableHead className="font-bold text-gray-700 py-4 text-sm uppercase tracking-wide text-center">AVERAGES</TableHead>
              <TableHead className="font-bold text-gray-700 py-4 text-sm uppercase tracking-wide text-center">ACTIONS</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map((item, index) => {
              const behaviorScore = getBehaviorScore(item.summary.total_good_character, item.summary.total_bad_character)
              const avgGoodPerDay = item.summary.total_days_evaluated > 0 ? 
                Math.round(item.summary.total_good_character / item.summary.total_days_evaluated) : 0
              const avgBadPerDay = item.summary.total_days_evaluated > 0 ? 
                Math.round(item.summary.total_bad_character / item.summary.total_days_evaluated) : 0

              return (
                <TableRow 
                  key={item.student_id} 
                  className={`hover:bg-blue-50/50 transition-all duration-200 cursor-pointer ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50/30"
                  }`}
                  onClick={() => handleCharacterClick(item)}
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
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
                        <Calendar className="h-4 w-4 text-white" />
                      </div>
                      <div className="text-center">
                        <div className="font-bold text-lg text-gray-700">{item.summary.total_days_evaluated}</div>
                        <div className="text-xs text-gray-500">Days</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="py-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center">
                        <Heart className="h-4 w-4 text-white" />
                      </div>
                      <div className="text-center">
                        <div className="font-bold text-lg text-green-600">{item.summary.total_good_character}</div>
                        <div className="text-xs text-gray-500">Good</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="py-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-8 h-8 bg-gradient-to-r from-red-400 to-red-600 rounded-full flex items-center justify-center">
                        <Frown className="h-4 w-4 text-white" />
                      </div>
                      <div className="text-center">
                        <div className="font-bold text-lg text-red-600">{item.summary.total_bad_character}</div>
                        <div className="text-xs text-gray-500">Bad</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="py-4 text-center">
                    <div className="flex flex-col items-center gap-1">
                      <div className={`font-bold text-xl ${behaviorScore.color}`}>
                        {behaviorScore.score}%
                      </div>
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${
                          behaviorScore.label === 'Excellent' ? 'bg-green-50 text-green-700 border-green-200' :
                          behaviorScore.label === 'Good' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                          behaviorScore.label === 'Average' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                          'bg-red-50 text-red-700 border-red-200'
                        }`}
                      >
                        {behaviorScore.label}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell className="py-4 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <div className="flex items-center gap-1">
                        <Smile className="h-3 w-3 text-green-500" />
                        <span className="text-xs font-semibold text-green-600">{avgGoodPerDay}/day</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Frown className="h-3 w-3 text-red-500" />
                        <span className="text-xs font-semibold text-red-600">{avgBadPerDay}/day</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="py-4 text-center">
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-gradient-to-r from-[#25AAE1] to-[#1D8CB3] text-white border-0 hover:from-[#1D8CB3] hover:to-[#1453B8] transition-all duration-300"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>

      {filteredData.length === 0 && !loading && (
        <div className="text-center py-16">
          <div className="bg-gradient-to-br from-gray-50 to-slate-50 p-8 rounded-3xl border border-gray-200 shadow-lg max-w-md mx-auto">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">No Character Data</h3>
            <p className="text-gray-600 text-center">No character records found for the selected filters</p>
          </div>
        </div>
      )}

      {/* Character Details Dialog */}
      {selectedCharacter && (
        <CharacterDetailsDialog
          isOpen={isDetailsModalOpen}
          onClose={() => {
            setIsDetailsModalOpen(false)
            setSelectedCharacter(null)
          }}
          student={transformCharacterData([selectedCharacter])[0]}
        />
      )}
    </div>
  )
} 