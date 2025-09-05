"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { getStudentRewardsView, StudentRewardsData } from "@/services/RewardsService"
import { useRequestInfo } from "@/hooks/useRequestInfo"
import { 
  Loader2, 
  AlertCircle, 
  RefreshCw, 
  DollarSign, 
  FileText, 
  Eye, 
  TrendingUp, 
  Award, 
  Target, 
  Calendar, 
  Heart, 
  AlertTriangle,
  Star,
  Trophy,
  Zap,
  CheckCircle,
  XCircle,
  Clock,
  Users,
  BookOpen,
  Target as TargetIcon,
  Sparkles,
  X,
  TrendingDown,
  Activity,
  Medal,
  Crown,
  Gift,
  ArrowRightLeft,
  Minus
} from "lucide-react"

export function RewardsDashboard() {
  const [rewardsData, setRewardsData] = useState<StudentRewardsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { accessToken } = useRequestInfo()

  // Modal states
  const [isExchangeOpen, setIsExchangeOpen] = useState(false)
  const [isTransactionsOpen, setIsTransactionsOpen] = useState(false)

  const fetchRewardsData = async () => {
    if (!accessToken) {
      setError("Authentication required")
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)
      const data = await getStudentRewardsView(accessToken)
      console.log("Student rewards data received:", data)
      setRewardsData(data)
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Error loading rewards data"
      console.error("Error fetching rewards data:", err)
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRewardsData()
  }, [accessToken])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    })
  }

  const getStatusIcon = (status: 'good' | 'bad') => {
    return status === 'good' ? (
      <CheckCircle className="h-4 w-4 text-green-500" />
    ) : (
      <XCircle className="h-4 w-4 text-red-500" />
    )
  }

  const getStatusColor = (status: 'good' | 'bad') => {
    return status === 'good' ? 'text-green-600' : 'text-red-600'
  }

  const getStatusBgColor = (status: 'good' | 'bad') => {
    return status === 'good' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-[#25AAE1] mb-4" />
        <p className="text-gray-600 font-medium">Loading your rewards data...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <AlertCircle className="h-8 w-8 text-red-500 mb-4" />
        <p className="text-red-600 font-medium text-center mb-4">{error}</p>
        <Button
          onClick={fetchRewardsData}
          className="bg-[#25AAE1] hover:bg-[#1D8CB3] text-white"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Try Again
        </Button>
      </div>
    )
  }

  if (!rewardsData) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <AlertCircle className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No rewards data</h3>
        <p className="text-gray-500 text-center">Your rewards data will appear here once available</p>
      </div>
    )
  }

  const student = rewardsData.student
  const totalPoints = student.totalPoints || 0
  const attendanceBalance = student.attendanceBalance || { present: 0, absent: 0, late: 0, half_day: 0 }

  // Calculer les statistiques
  const totalGoodTraits = Object.keys(student.goodCharacter || {}).length
  const totalBadTraits = Object.keys(student.badCharacter || {}).length
  const totalGoodPoints = Object.values(student.goodCharacter || {}).reduce((sum, points) => sum + points, 0)
  const totalBadPoints = Object.values(student.badCharacter || {}).reduce((sum, points) => sum + points, 0)
  const overallScore = totalGoodPoints - totalBadPoints

  return (
    <div className="space-y-6">
      {/* Action Buttons */}
      <div className="flex gap-4 justify-end mb-6">
          <Button
            onClick={() => setIsExchangeOpen(true)}
          className="bg-gradient-to-r from-[#25AAE1] to-[#1D8CB3] text-white px-6 py-3 rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300 shadow-md flex items-center gap-2"
        >
          <Gift className="h-4 w-4" />
          <span className="font-semibold">Exchange Points</span>
          </Button>
          
          <Button
            onClick={() => setIsTransactionsOpen(true)}
          className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-6 py-3 rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300 shadow-md flex items-center gap-2"
        >
          <FileText className="h-4 w-4" />
          <span className="font-semibold">View History</span>
          </Button>
        </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {/* Total Points Card */}
        <Card className="p-6 bg-gradient-to-br from-[#25AAE1] to-[#1D8CB3] text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border-0">
          <div className="flex items-center justify-between mb-4">
            <Trophy className="h-8 w-8 text-yellow-300" />
            <Badge className="bg-white/20 text-white border-white/30">Total</Badge>
          </div>
          <div className="text-3xl font-bold mb-1">{totalPoints}</div>
          <p className="text-blue-100 font-medium">Total Points</p>
          <div className="mt-3 flex items-center gap-2 text-sm text-yellow-300">
            <Star className="h-4 w-4" />
            <span>Level {Math.floor(totalPoints / 50) + 1}</span>
          </div>
        </Card>

        {/* Attendance Card */}
        <Card className="p-6 bg-gradient-to-br from-[#25AAE1]/10 to-[#1D8CB3]/20 border-[#25AAE1]/30 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
          <div className="flex items-center justify-between mb-4">
            <Calendar className="h-8 w-8 text-[#25AAE1]" />
            <Badge className="bg-[#25AAE1]/20 text-[#1D8CB3] border-[#25AAE1]/30">Present</Badge>
          </div>
          <div className="text-3xl font-bold text-[#1D8CB3] mb-1">{attendanceBalance.present}</div>
          <p className="text-[#25AAE1] font-medium">Days Present</p>
          <div className="mt-3 flex items-center gap-2 text-sm text-[#25AAE1]">
            <CheckCircle className="h-4 w-4" />
            <span>Perfect attendance!</span>
      </div>
        </Card>

        {/* Good Character Card */}
        <Card className="p-6 bg-gradient-to-br from-[#25AAE1]/10 to-[#1D8CB3]/20 border-[#25AAE1]/30 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
          <div className="flex items-center justify-between mb-4">
            <Heart className="h-8 w-8 text-[#25AAE1]" />
            <Badge className="bg-[#25AAE1]/20 text-[#1D8CB3] border-[#25AAE1]/30">Positive</Badge>
          </div>
          <div className="text-3xl font-bold text-[#1D8CB3] mb-1">{totalGoodTraits}</div>
          <p className="text-[#25AAE1] font-medium">Good Traits</p>
          <div className="mt-3 flex items-center gap-2 text-sm text-[#25AAE1]">
            <Star className="h-4 w-4" />
            <span>{totalGoodPoints} total points</span>
        </div>
      </Card>

        {/* Focus Areas Card */}
        <Card className="p-6 bg-gradient-to-br from-[#25AAE1]/10 to-[#1D8CB3]/20 border-[#25AAE1]/30 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
          <div className="flex items-center justify-between mb-4">
            <Target className="h-8 w-8 text-[#25AAE1]" />
            <Badge className="bg-[#25AAE1]/20 text-[#1D8CB3] border-[#25AAE1]/30">Focus</Badge>
            </div>
          <div className="text-3xl font-bold text-[#1D8CB3] mb-1">{student.focusDomains?.length || 0}</div>
          <p className="text-[#25AAE1] font-medium">Areas to Improve</p>
          <div className="mt-3 flex items-center gap-2 text-sm text-[#25AAE1]">
            <TargetIcon className="h-4 w-4" />
            <span>Keep working hard!</span>
          </div>
        </Card>

        {/* Overall Score Card */}
        <Card className="p-6 bg-gradient-to-br from-[#25AAE1]/10 to-[#1D8CB3]/20 border-[#25AAE1]/30 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
          <div className="flex items-center justify-between mb-4">
            <Crown className="h-8 w-8 text-[#25AAE1]" />
            <Badge className="bg-[#25AAE1]/20 text-[#1D8CB3] border-[#25AAE1]/30">Score</Badge>
            </div>
          <div className="text-3xl font-bold text-[#1D8CB3] mb-1">{overallScore}</div>
          <p className="text-[#25AAE1] font-medium">Overall Score</p>
          <div className="mt-3 flex items-center gap-2 text-sm text-[#25AAE1]">
            <TrendingUp className="h-4 w-4" />
            <span>Excellent progress!</span>
          </div>
        </Card>
      </div>

      {/* Character Traits Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Good Character Traits */}
        <Card className="p-6 bg-gradient-to-br from-[#25AAE1]/5 to-[#1D8CB3]/10 border-[#25AAE1]/20 rounded-2xl shadow-lg">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-[#25AAE1]/20 rounded-xl flex items-center justify-center">
              <Heart className="h-5 w-5 text-[#25AAE1]" />
            </div>
          <div>
              <h3 className="text-xl font-bold text-[#1D8CB3]">Good Character Traits</h3>
              <p className="text-[#25AAE1]">Your positive qualities</p>
            </div>
          </div>
          
          <div className="space-y-4">
            {Object.entries(student.goodCharacter || {}).map(([trait, points]) => (
              <div key={trait} className="flex items-center justify-between p-4 bg-white rounded-xl border border-[#25AAE1]/20 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-[#25AAE1]/20 rounded-lg flex items-center justify-center">
                    <Star className="h-4 w-4 text-[#25AAE1]" />
          </div>
          <div>
                    <div className="font-semibold text-[#1D8CB3] capitalize">{trait}</div>
                    <div className="text-sm text-[#25AAE1]">{points} points earned</div>
            </div>
          </div>
                <Badge className="bg-[#25AAE1]/20 text-[#1D8CB3] border-[#25AAE1]/30">
                  +{points}
                </Badge>
              </div>
            ))}
        </div>
      </Card>

        {/* Focus Areas */}
        <Card className="p-6 bg-gradient-to-br from-[#25AAE1]/5 to-[#1D8CB3]/10 border-[#25AAE1]/20 rounded-2xl shadow-lg">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-[#25AAE1]/20 rounded-xl flex items-center justify-center">
              <Target className="h-5 w-5 text-[#25AAE1]" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-[#1D8CB3]">Areas to Improve</h3>
              <p className="text-[#25AAE1]">Focus on these traits</p>
            </div>
          </div>
          
          <div className="space-y-4">
            {Object.entries(student.badCharacter || {}).map(([trait, points]) => (
              <div key={trait} className="flex items-center justify-between p-4 bg-white rounded-xl border border-[#25AAE1]/20 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-[#25AAE1]/20 rounded-lg flex items-center justify-center">
                    <AlertTriangle className="h-4 w-4 text-[#25AAE1]" />
                  </div>
                  <div>
                    <div className="font-semibold text-[#1D8CB3] capitalize">{trait}</div>
                    <div className="text-sm text-[#25AAE1]">{points} points to improve</div>
                  </div>
                </div>
                <Badge className="bg-[#25AAE1]/20 text-[#1D8CB3] border-[#25AAE1]/30">
                  -{points}
                </Badge>
              </div>
            ))}
            
            {student.focusDomains?.map((domain) => (
              <div key={domain} className="flex items-center justify-between p-4 bg-white rounded-xl border border-[#25AAE1]/20 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-[#25AAE1]/20 rounded-lg flex items-center justify-center">
                    <TargetIcon className="h-4 w-4 text-[#25AAE1]" />
                  </div>
                  <div>
                    <div className="font-semibold text-[#1D8CB3]">{domain}</div>
                    <div className="text-sm text-[#25AAE1]">Focus domain</div>
                  </div>
                </div>
                <Badge className="bg-[#25AAE1]/20 text-[#1D8CB3] border-[#25AAE1]/30">
                  Focus
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>



      {/* Exchange Dialog */}
      <Dialog open={isExchangeOpen} onOpenChange={setIsExchangeOpen}>
        <DialogContent className="sm:max-w-[600px] p-0 bg-white rounded-3xl shadow-2xl border-0 overflow-hidden">
          {/* Header avec gradient spectaculaire */}
          <div className="relative bg-gradient-to-br from-[#25AAE1] via-[#1D8CB3] to-[#1453B8] p-8 text-white">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>
            
            <div className="relative z-10">
              <h2 className="text-3xl font-bold mb-2">🎁 Exchange Points</h2>
              <p className="text-blue-100 text-lg">Convert your points into amazing rewards</p>
            </div>
          </div>

          <div className="p-8">
            {/* Points Display - Design spectaculaire */}
            <div className="relative mb-8">
              <div className="bg-gradient-to-br from-[#25AAE1]/10 via-purple-50 to-indigo-50 p-8 rounded-3xl border border-[#25AAE1]/20 shadow-lg">
                <div className="text-center">
                  <div className="text-6xl font-bold bg-gradient-to-r from-[#25AAE1] to-purple-600 bg-clip-text text-transparent mb-3">
                    {totalPoints}
                  </div>
                  <div className="text-gray-600 font-semibold text-lg mb-2">Available Points</div>
                  <div className="flex items-center justify-center gap-2 text-[#25AAE1]">
                    <Trophy className="h-5 w-5" />
                    <span className="font-medium">Level {Math.floor(totalPoints / 50) + 1} Achiever</span>
                  </div>
                </div>
            </div>

              {/* Éléments décoratifs */}
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full animate-pulse"></div>
              <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-purple-400 rounded-full animate-pulse delay-1000"></div>
            </div>

            {/* Exchange Info Cards */}
            <div className="grid grid-cols-2 gap-6 mb-8">
              <div className="relative group">
                <div className="bg-gradient-to-br from-emerald-50 to-green-100 p-6 rounded-2xl border border-emerald-200 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <Minus className="h-6 w-6 text-emerald-600" />
                    </div>
                    <div className="text-3xl font-bold text-emerald-700 mb-1">100</div>
                    <div className="text-emerald-600 font-medium">Minimum Exchange</div>
              </div>
                </div>
              </div>

              <div className="relative group">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-6 rounded-2xl border border-blue-200 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <ArrowRightLeft className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="text-3xl font-bold text-blue-700 mb-1">5</div>
                    <div className="text-blue-600 font-medium">Exchange Rate</div>
                  </div>
                </div>
            </div>
            </div>

            {/* Action Button */}
            <Button className="w-full bg-gradient-to-r from-[#25AAE1] to-[#1D8CB3] text-white py-6 rounded-2xl hover:shadow-xl hover:scale-105 transition-all duration-300 shadow-lg border-0 text-lg font-semibold group">
              <Gift className="h-6 w-6 mr-3 group-hover:rotate-12 transition-transform" />
              Exchange Points for Rewards
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Transactions Dialog */}
      <Dialog open={isTransactionsOpen} onOpenChange={setIsTransactionsOpen}>
        <DialogContent className="sm:max-w-[900px] p-0 bg-white rounded-3xl shadow-2xl border-0 overflow-hidden">
          {/* Header spectaculaire */}
          <div className="relative bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600 p-8 text-white">
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-20 translate-x-20"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-16 -translate-x-16"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-white/5 rounded-full"></div>
            
            <div className="relative z-10">
              <h2 className="text-3xl font-bold mb-2">📊 Activity History</h2>
              <p className="text-purple-100 text-lg">Your complete rewards journey</p>
              <div className="flex items-center gap-4 mt-4">
                <div className="flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full">
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  <span className="text-sm">Good Activities</span>
                </div>
                <div className="flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full">
                  <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                  <span className="text-sm">Areas to Improve</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-8">
            {/* Stats Summary */}
            <div className="grid grid-cols-3 gap-6 mb-8">
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-2xl border border-green-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-700">
                      {student.latestNews?.filter(n => n.status === 'good').length || 0}
                    </div>
                    <div className="text-green-600 text-sm">Good Activities</div>
                  </div>
                </div>
            </div>

              <div className="bg-gradient-to-br from-red-50 to-rose-50 p-4 rounded-2xl border border-red-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-red-700">
                      {student.latestNews?.filter(n => n.status === 'bad').length || 0}
                    </div>
                    <div className="text-red-600 text-sm">Areas to Improve</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-2xl border border-blue-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Star className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-700">
                      {student.latestNews?.reduce((sum, n) => sum + n.points, 0) || 0}
                    </div>
                    <div className="text-blue-600 text-sm">Total Points</div>
                  </div>
                </div>
            </div>
          </div>

            {/* Activity List */}
            <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
              {student.latestNews?.map((news, index) => (
                <div key={index} className={`group relative overflow-hidden rounded-2xl border transition-all duration-300 hover:shadow-lg hover:scale-[1.02] ${
                  news.status === 'good' 
                    ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200' 
                    : 'bg-gradient-to-r from-red-50 to-rose-50 border-red-200'
                }`}>
                  {/* Background decoration */}
                  <div className={`absolute top-0 right-0 w-20 h-20 opacity-10 ${
                    news.status === 'good' ? 'bg-green-400' : 'bg-red-400'
                  } rounded-full -translate-y-10 translate-x-10`}></div>
                  
                  <div className="relative p-6">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg ${
                        news.status === 'good' ? 'bg-green-100' : 'bg-red-100'
                      }`}>
                        {getStatusIcon(news.status)}
            </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <div className="font-bold text-gray-800 capitalize text-lg">
                            {news.newsAndComment.split('(')[0].trim()}
                          </div>
                          <div className={`font-bold text-2xl ${
                            news.status === 'good' ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {news.status === 'good' ? '+' : '-'}{news.points}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <BookOpen className="h-4 w-4" />
                            <span>{news.class}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>{formatDate(news.date)}</span>
                          </div>
                        </div>
                        
                        {news.newsAndComment && (
                          <div className="mt-3 text-sm text-gray-700 bg-white/50 p-3 rounded-lg">
                            {news.newsAndComment}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
} 