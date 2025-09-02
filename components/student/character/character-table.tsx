"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { getStudentCharacterView, StudentCharacterData } from "@/services/CharacterService"
import { useRequestInfo } from "@/hooks/useRequestInfo"
import { 
  Loader2, 
  AlertCircle, 
  RefreshCw, 
  Heart, 
  AlertTriangle, 
  TrendingUp, 
  Calendar,
  Star,
  Target,
  Award,
  Users,
  CheckCircle,
  XCircle
} from "lucide-react"

interface CharacterRecord {
  id: number
  class: string
  goodCharacter: number
  badCharacter: number
  totalDays: number
  averageGood: number
  averageBad: number
}

export function CharacterTable() {
  const [characterData, setCharacterData] = useState<StudentCharacterData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { accessToken } = useRequestInfo()

  const fetchCharacterData = async () => {
    if (!accessToken) {
      setError("Authentication required")
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)
      
      const data = await getStudentCharacterView(accessToken)
      console.log("Student character data received:", data)
      
      // Ne plus détecter automatiquement le mode démo basé sur les données d'étudiant
      // Le mode démo ne devrait être activé que si l'API retourne explicitement des données de démo
      // ou en cas d'erreur réseau/serveur
      
      setCharacterData(data)
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Error loading character data"
      console.error("Error fetching character data:", err)
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCharacterData()
  }, [accessToken])

  const transformCharacterData = (): CharacterRecord[] => {
    if (!characterData) return []

    // Pour l'instant, on crée un enregistrement basé sur les données de résumé
    // car l'API retourne un tableau vide pour les ratings
    return [{
      id: 1,
      class: "All Classes",
      goodCharacter: characterData.summary.total_good_character,
      badCharacter: characterData.summary.total_bad_character,
      totalDays: characterData.summary.total_days_evaluated,
      averageGood: characterData.summary.average_good_per_day,
      averageBad: characterData.summary.average_bad_per_day
    }]
  }

  const getProgressPercentage = (good: number, bad: number) => {
    const total = good + bad
    return total > 0 ? (good / total) * 100 : 0
  }

  const getCharacterScore = (good: number, bad: number) => {
    const total = good + bad
    if (total === 0) return 0
    return Math.round((good / total) * 100)
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="relative">
          <Loader2 className="h-12 w-12 animate-spin text-[#25AAE1] mb-6" />
          <div className="absolute inset-0 w-12 h-12 border-4 border-[#25AAE1]/20 rounded-full"></div>
        </div>
        <p className="text-gray-600 font-medium text-lg">Loading your character data...</p>
        <p className="text-gray-500 text-sm mt-2">Analyzing your character development</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="bg-gradient-to-br from-red-50 to-rose-50 p-8 rounded-3xl border border-red-200 shadow-lg max-w-md w-full">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
            <h3 className="text-xl font-bold text-red-800 mb-2">Connection Error</h3>
            <p className="text-red-600 font-medium text-center mb-6">{error}</p>
            <Button
              onClick={fetchCharacterData}
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

  const transformedData = transformCharacterData()

  if (transformedData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="bg-gradient-to-br from-gray-50 to-slate-50 p-8 rounded-3xl border border-gray-200 shadow-lg max-w-md w-full">
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">No Character Data</h3>
            <p className="text-gray-600 text-center">Your character data will appear here once available</p>
          </div>
        </div>
      </div>
    )
  }

  const record = transformedData[0]
  const characterScore = getCharacterScore(record.goodCharacter, record.badCharacter)
  const progressPercentage = getProgressPercentage(record.goodCharacter, record.badCharacter)

  return (
    <div className="space-y-6">
      {/* Demo Data Notification - Supprimé car l'API fonctionne correctement */}

      {/* Header Section */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-[#1D8CB3] mb-2">Character Assessment</h1>
        <p className="text-[#25AAE1] text-lg">Track your character development and growth</p>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Character Score Card */}
        <Card className="p-4 bg-gradient-to-br from-[#25AAE1] to-[#1D8CB3] text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border-0">
          <div className="flex items-center justify-between mb-3">
            <Award className="h-6 w-6 text-yellow-300" />
            <Badge className="bg-white/20 text-white border-white/30 text-xs">Score</Badge>
          </div>
          <div className="text-2xl font-bold mb-1">{characterScore}%</div>
          <p className="text-blue-100 font-medium text-sm">Character Score</p>
          <div className="mt-2 flex items-center gap-2 text-xs text-yellow-300">
            <Star className="h-3 w-3" />
            <span>{characterScore >= 80 ? 'Excellent' : characterScore >= 60 ? 'Good' : 'Needs Improvement'}</span>
          </div>
        </Card>

        {/* Good Character Card */}
        <Card className="p-4 bg-gradient-to-br from-[#25AAE1]/10 to-[#1D8CB3]/20 border-[#25AAE1]/30 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
          <div className="flex items-center justify-between mb-3">
            <Heart className="h-6 w-6 text-[#25AAE1]" />
            <Badge className="bg-[#25AAE1]/20 text-[#1D8CB3] border-[#25AAE1]/30 text-xs">Positive</Badge>
          </div>
          <div className="text-2xl font-bold text-[#1D8CB3] mb-1">{record.goodCharacter}</div>
          <p className="text-[#25AAE1] font-medium text-sm">Good Character</p>
          <div className="mt-2 flex items-center gap-2 text-xs text-[#25AAE1]">
            <CheckCircle className="h-3 w-3" />
            <span>Positive traits</span>
          </div>
        </Card>

        {/* Bad Character Card */}
        <Card className="p-4 bg-gradient-to-br from-[#25AAE1]/10 to-[#1D8CB3]/20 border-[#25AAE1]/30 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
          <div className="flex items-center justify-between mb-3">
            <AlertTriangle className="h-6 w-6 text-[#25AAE1]" />
            <Badge className="bg-[#25AAE1]/20 text-[#1D8CB3] border-[#25AAE1]/30 text-xs">Improve</Badge>
          </div>
          <div className="text-2xl font-bold text-[#1D8CB3] mb-1">{record.badCharacter}</div>
          <p className="text-[#25AAE1] font-medium text-sm">Areas to Improve</p>
          <div className="mt-2 flex items-center gap-2 text-xs text-[#25AAE1]">
            <Target className="h-3 w-3" />
            <span>Focus areas</span>
          </div>
        </Card>

        {/* Total Days Card */}
        <Card className="p-4 bg-gradient-to-br from-[#25AAE1]/10 to-[#1D8CB3]/20 border-[#25AAE1]/30 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
          <div className="flex items-center justify-between mb-3">
            <Calendar className="h-6 w-6 text-[#25AAE1]" />
            <Badge className="bg-[#25AAE1]/20 text-[#1D8CB3] border-[#25AAE1]/30 text-xs">Days</Badge>
          </div>
          <div className="text-2xl font-bold text-[#1D8CB3] mb-1">{record.totalDays}</div>
          <p className="text-[#25AAE1] font-medium text-sm">Days Evaluated</p>
          <div className="mt-2 flex items-center gap-2 text-xs text-[#25AAE1]">
            <Users className="h-3 w-3" />
            <span>Total assessment</span>
          </div>
        </Card>
      </div>

      {/* Character Progress Section */}
      <Card className="p-6 bg-gradient-to-br from-[#25AAE1]/5 to-[#1D8CB3]/10 border-[#25AAE1]/20 rounded-xl shadow-lg">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-[#25AAE1]/20 rounded-lg flex items-center justify-center">
            <TrendingUp className="h-5 w-5 text-[#25AAE1]" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-[#1D8CB3]">Character Progress</h3>
            <p className="text-[#25AAE1] text-sm">Your character development overview</p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-[#1D8CB3] font-semibold text-sm">Overall Progress</span>
              <span className="text-[#25AAE1] font-bold">{progressPercentage.toFixed(1)}%</span>
            </div>
            <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden shadow-inner">
              <div
                className="h-full bg-gradient-to-r from-[#25AAE1] to-[#1D8CB3] shadow-sm transition-all duration-1000 ease-out"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>

          {/* Character Ratio */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-lg p-4 border border-[#25AAE1]/20 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-[#1D8CB3] text-sm">Good Character</h4>
                  <p className="text-[#25AAE1] text-xs">Positive traits</p>
                </div>
              </div>
              <div className="text-2xl font-bold text-green-600 mb-1">{record.goodCharacter}</div>
              <div className="text-xs text-gray-600">
                Average: {record.averageGood.toFixed(1)} per day
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 border border-[#25AAE1]/20 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                  <XCircle className="h-4 w-4 text-red-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-[#1D8CB3] text-sm">Areas to Improve</h4>
                  <p className="text-[#25AAE1] text-xs">Focus areas</p>
                </div>
              </div>
              <div className="text-2xl font-bold text-red-600 mb-1">{record.badCharacter}</div>
              <div className="text-xs text-gray-600">
                Average: {record.averageBad.toFixed(1)} per day
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}

 