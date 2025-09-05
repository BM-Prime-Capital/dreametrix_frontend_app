"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ParentCharactersTable } from "@/components/parents/characters/parent-characters-table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileText, Printer, RefreshCw, Loader2, AlertCircle, Heart, Star, Users, TrendingUp, Award, Smile, Frown } from "lucide-react"
import { ReportDialog } from "@/components/parents/characters/report-dialog"
import { PrintDialog } from "@/components/parents/characters/print-dialog"
import { getParentCharacterView, ParentCharacterData } from "@/services/CharacterService"
import { useRequestInfo } from "@/hooks/useRequestInfo"
import { menuImages } from "@/constants/images"
import Image from "next/image"
import { useLoading } from "@/lib/LoadingContext"

export default function ParentCharactersPage() {
  const { accessToken } = useRequestInfo()
  const { stopLoading } = useLoading()
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
      // Arrêter le chargement dès qu'on reçoit une réponse (succès)
      stopLoading()
    } catch (error) {
      setError(error instanceof Error ? error.message : "Error loading characters data")
      // Arrêter le chargement même en cas d'erreur
      stopLoading()
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCharactersData()
  }, [accessToken])

  // Supprimer le useEffect de sécurité car on gère maintenant dans le try/catch

  const handleRefresh = () => {
    fetchCharactersData()
  }

  // Calculer les statistiques globales
  const totalStudents = charactersData.length
  const totalDaysEvaluated = charactersData.reduce((sum, student) => sum + student.summary.total_days_evaluated, 0)
  const totalGoodCharacter = charactersData.reduce((sum, student) => sum + student.summary.total_good_character, 0)
  const totalBadCharacter = charactersData.reduce((sum, student) => sum + student.summary.total_bad_character, 0)
  const averageGoodPerDay = totalDaysEvaluated > 0 ? Math.round(totalGoodCharacter / totalDaysEvaluated) : 0
  const averageBadPerDay = totalDaysEvaluated > 0 ? Math.round(totalBadCharacter / totalDaysEvaluated) : 0

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="relative">
          <Loader2 className="h-12 w-12 animate-spin text-[#25AAE1] mb-6" />
          <div className="absolute inset-0 w-12 h-12 border-4 border-[#25AAE1]/20 rounded-full"></div>
        </div>
        <p className="text-gray-600 font-medium text-lg">Loading character data...</p>
        <p className="text-gray-500 text-sm mt-2">Analyzing character development and behavior</p>
      </div>
    )
  }

  return (
    <div className="w-full space-y-6">
      {/* Header Section */}
      <div className="bg-gradient-to-br from-[#25AAE1] via-[#1D8CB3] to-[#1453B8] p-6 rounded-2xl text-white shadow-xl">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-3xl font-bold mb-1 flex items-center gap-3">
              <Image 
                src={menuImages.character} 
                alt="Character" 
                width={32} 
                height={32} 
                className="w-8 h-8 brightness-0 invert"
              />
              Character Dashboard
            </h1>
            <p className="text-blue-100 text-base">Monitor your children's character development and behavior</p>
          </div>
          <div className="flex gap-2">
            <Button 
              className="bg-white/20 hover:bg-white/30 text-white border-white/30 text-sm px-3 py-2"
              onClick={() => setIsReportModalOpen(true)}
            >
              <FileText className="h-3 w-3 mr-1" />
              Report
            </Button>
            <Button 
              className="bg-white/20 hover:bg-white/30 text-white border-white/30 text-sm px-3 py-2"
              onClick={() => setIsPrintModalOpen(true)}
            >
              <Printer className="h-3 w-3 mr-1" />
              Print
            </Button>
          </div>
        </div>

        {/* Filters and Stats */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-white/10 p-3 rounded-xl backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-2">
                <Users className="h-4 w-4 text-blue-200" />
                <span className="text-blue-200 text-xs">Students</span>
              </div>
              <h3 className="text-lg font-bold">{totalStudents}</h3>
              <p className="text-blue-100 text-sm">Total Children</p>
            </div>
            
            <div className="bg-white/10 p-3 rounded-xl backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-2">
                <Star className="h-4 w-4 text-blue-200" />
                <span className="text-blue-200 text-xs">Days</span>
              </div>
              <h3 className="text-lg font-bold">{totalDaysEvaluated}</h3>
              <p className="text-blue-100 text-sm">Days Evaluated</p>
            </div>
            
            <div className="bg-white/10 p-3 rounded-xl backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-4 w-4 text-blue-200" />
                <span className="text-blue-200 text-xs">Good</span>
              </div>
              <h3 className="text-lg font-bold">{totalGoodCharacter}</h3>
              <p className="text-blue-100 text-sm">Good Behaviors</p>
            </div>
          </div>

          <div className="flex gap-2">
            <Select value={selectedStudent} onValueChange={setSelectedStudent}>
              <SelectTrigger className="w-[180px] bg-white/20 border-white/30 text-white placeholder:text-blue-100">
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
          </div>
        </div>
      </div>

      {/* Character Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Students */}
        <Card className="p-4 bg-gradient-to-br from-[#25AAE1] to-[#1D8CB3] text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border-0">
          <div className="flex items-center justify-between mb-3">
            <Users className="h-6 w-6 text-blue-200" />
            <Badge className="bg-white/20 text-white border-white/30 text-xs">Students</Badge>
          </div>
          <div className="text-3xl font-bold mb-1">{totalStudents}</div>
          <p className="text-blue-100 font-medium text-sm">Total Students</p>
          <div className="mt-2 flex items-center gap-2 text-xs text-blue-200">
            <Star className="h-3 w-3" />
            <span>All Children</span>
          </div>
        </Card>

        {/* Total Good Character */}
        <Card className="p-4 bg-gradient-to-br from-[#10B981] to-[#059669] text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border-0">
          <div className="flex items-center justify-between mb-3">
            <Heart className="h-6 w-6 text-green-200" />
            <Badge className="bg-white/20 text-white border-white/30 text-xs">Good</Badge>
          </div>
          <div className="text-3xl font-bold mb-1">{totalGoodCharacter}</div>
          <p className="text-green-100 font-medium text-sm">Good Behaviors</p>
          <div className="mt-2 flex items-center gap-2 text-xs text-green-200">
            <Smile className="h-3 w-3" />
            <span>Positive Actions</span>
          </div>
        </Card>

        {/* Total Bad Character */}
        <Card className="p-4 bg-gradient-to-br from-[#EF4444] to-[#DC2626] text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border-0">
          <div className="flex items-center justify-between mb-3">
            <Frown className="h-6 w-6 text-red-200" />
            <Badge className="bg-white/20 text-white border-white/30 text-xs">Bad</Badge>
          </div>
          <div className="text-3xl font-bold mb-1">{totalBadCharacter}</div>
          <p className="text-red-100 font-medium text-sm">Bad Behaviors</p>
          <div className="mt-2 flex items-center gap-2 text-xs text-red-200">
            <TrendingUp className="h-3 w-3" />
            <span>Areas to Improve</span>
          </div>
        </Card>

        {/* Average Good Per Day */}
        <Card className="p-4 bg-gradient-to-br from-[#F59E0B] to-[#D97706] text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border-0">
          <div className="flex items-center justify-between mb-3">
            <Award className="h-6 w-6 text-yellow-200" />
            <Badge className="bg-white/20 text-white border-white/30 text-xs">Average</Badge>
          </div>
          <div className="text-3xl font-bold mb-1">{averageGoodPerDay}</div>
          <p className="text-yellow-100 font-medium text-sm">Good/Day</p>
          <div className="mt-2 flex items-center gap-2 text-xs text-yellow-200">
            <Star className="h-3 w-3" />
            <span>Daily Average</span>
          </div>
        </Card>
      </div>

      {/* Characters Table */}
      <Card className="bg-white rounded-2xl shadow-xl border-0 overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-gray-100">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            <Image 
              src={menuImages.character} 
              alt="Character" 
              width={20} 
              height={20} 
              className="w-5 h-5"
            />
            Character Overview
          </h2>
          <p className="text-gray-600 text-sm mt-1">Detailed view of your children's character development and behavior patterns</p>
        </div>
        <ParentCharactersTable
          selectedStudent={selectedStudent}
          charactersData={charactersData}
          loading={loading}
          error={error}
        />
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-center gap-4">
        <Button
          onClick={handleRefresh}
          disabled={loading}
          className="bg-gradient-to-r from-[#25AAE1] to-[#1D8CB3] text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-300"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4 mr-2" />
          )}
          Refresh Data
        </Button>
      </div>

      {/* Modals */}
      <ReportDialog
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
      />

      <PrintDialog
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
      />
    </div>
  )
} 