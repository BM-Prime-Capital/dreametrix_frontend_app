"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ParentCharacterData } from "@/services/CharacterService"
import { Loader2, AlertCircle, Heart, Star, TrendingUp, TrendingDown } from "lucide-react"
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
      <div className="w-full flex items-center justify-center py-8">
        <div className="flex items-center gap-2 text-gray-500">
          <Loader2 className="w-4 h-4 animate-spin" />
          Loading characters data...
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
            <TableHead className="font-bold text-gray-700 py-4 text-sm uppercase tracking-wide">DAYS EVALUATED</TableHead>
            <TableHead className="font-bold text-gray-700 py-4 text-sm uppercase tracking-wide">GOOD CHARACTER</TableHead>
            <TableHead className="font-bold text-gray-700 py-4 text-sm uppercase tracking-wide">BAD CHARACTER</TableHead>
            <TableHead className="font-bold text-gray-700 py-4 text-sm uppercase tracking-wide">AVERAGE GOOD/DAY</TableHead>
            <TableHead className="font-bold text-gray-700 py-4 text-sm uppercase tracking-wide">AVERAGE BAD/DAY</TableHead>
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
                  <Star className="h-4 w-4 text-blue-500" />
                  <span className="font-semibold text-gray-700">{item.summary.total_days_evaluated}</span>
                </div>
              </TableCell>
              <TableCell className="py-4">
                <div className="flex items-center gap-2">
                  <Heart className="h-4 w-4 text-green-500" />
                  <span className="font-semibold text-green-600">{item.summary.total_good_character}</span>
                </div>
              </TableCell>
              <TableCell className="py-4">
                <div className="flex items-center gap-2">
                  <TrendingDown className="h-4 w-4 text-red-500" />
                  <span className="font-semibold text-red-600">{item.summary.total_bad_character}</span>
                </div>
              </TableCell>
              <TableCell className="py-4">
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  {item.summary.average_good_per_day.toFixed(1)}
                </Badge>
              </TableCell>
              <TableCell className="py-4">
                <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                  {item.summary.average_bad_per_day.toFixed(1)}
                </Badge>
              </TableCell>
              <TableCell className="py-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCharacterClick(item)}
                  className="text-blue-600 hover:text-blue-700 border-blue-200 hover:border-blue-300 hover:bg-blue-50"
                >
                  <Heart className="h-4 w-4 mr-2" />
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
          <p>No characters data found for the selected filters</p>
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
          character={selectedCharacter}
        />
      )}
    </div>
  )
} 