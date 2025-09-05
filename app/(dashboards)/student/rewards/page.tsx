"use client"

import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

import { Dialog, DialogContent } from "@/components/ui/dialog"
import { X, Eye, ArrowLeft, RefreshCw, Trophy, TrendingUp, TrendingDown, Calendar } from "lucide-react"
import { useRewards } from "@/hooks/useRewards"
import { useRequestInfo } from "@/hooks/useRequestInfo"
import { RewardStudent, LatestNews } from "@/types/rewards"
import { Alert, AlertDescription } from "@/components/ui/alert"


export default function RewardsPage() {
  const [exchangeCost] = useState(100)
  const [isExchangeOpen, setIsExchangeOpen] = useState(false)
  const [isTransactionsOpen, setIsTransactionsOpen] = useState(false)

  const { accessToken, isLoading: tokenLoading } = useRequestInfo();
  
  const {
    data,
    loading,
    error,
    refetch,
    clearError
  } = useRewards({}, accessToken);

  const handleRefresh = () => {
    if (accessToken) {
      refetch()
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  };

  const getTopCharacterDomain = (student: RewardStudent) => {
    const goodChar = student.goodCharacter;
    let maxValue = 0;
    let topDomain = 'None';
    
    Object.entries(goodChar).forEach(([domain, value]) => {
      if (value > maxValue) {
        maxValue = value;
        topDomain = domain.charAt(0).toUpperCase() + domain.slice(1);
      }
    });
    
    return { domain: topDomain, value: maxValue };
  };

  const getFocusDomain = (student: RewardStudent) => {
    const badChar = student.badCharacter;
    let maxValue = 0;
    let focusDomain = 'None';
    
    Object.entries(badChar).forEach(([domain, value]) => {
      if (value > maxValue) {
        maxValue = value;
        focusDomain = domain.charAt(0).toUpperCase() + domain.slice(1);
      }
    });
    
    return { domain: focusDomain, value: maxValue };
  };

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
          <p className="text-gray-600 mb-4">Please log in to view your rewards.</p>
          <Button 
            onClick={() => window.location.reload()}
            className="bg-[#25AAE1] hover:bg-[#1D8CB3]"
          >
            Refresh Page
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
              REWARDS
            </h1>
            <p className="text-white/80 text-sm">Manage your points and rewards</p>
          </div>
        </div>
      </div>

      <section className="flex flex-col gap-6 w-full mx-auto p-6 bg-gradient-to-br from-blue-50 via-white to-blue-100 min-h-screen rounded-2xl">
        {/* Header Section avec design moderne */}
        <div className="flex items-center justify-between bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-r from-[#25AAE1] to-[#1D8CB3] rounded-xl flex items-center justify-center">
              <Trophy className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#25AAE1]">
                {data ? `${data.name} - Rewards` : 'Rewards Center'}
              </h2>
              <p className="text-gray-600 text-sm">
                {data ? `${data.totalPoints} Total Points` : 'Earn and exchange points for rewards'}
              </p>
            </div>
          </div>
          
          <div className="flex gap-4">
            <Button
              onClick={handleRefresh}
              disabled={loading}
              className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-xl flex items-center gap-2 hover:shadow-lg transition-all duration-300"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              <span className="font-semibold">Refresh</span>
            </Button>
            
            <Button
              className="bg-gradient-to-r from-[#25AAE1] to-[#1D8CB3] text-white px-8 py-3 rounded-xl flex items-center gap-3 hover:shadow-lg hover:scale-105 transition-all duration-300 shadow-md"
              onClick={() => setIsTransactionsOpen(true)}
              disabled={!data}
            >
              <Calendar className="h-5 w-5" />
              <span className="font-semibold">Latest News</span>
            </Button>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <Alert className="border-red-200 bg-red-50">
            <X className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              {error}
              <Button 
                onClick={clearError} 
                variant="link" 
                className="text-red-600 p-0 h-auto ml-2"
              >
                Dismiss
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-[#25AAE1]" />
              <p className="text-gray-600">Loading rewards data...</p>
            </div>
          </div>
        )}

        {/* Balance Card avec design moderne */}
        {data && (
          <Card className="p-8 bg-gradient-to-r from-[#25AAE1] to-[#1D8CB3] text-white rounded-2xl shadow-xl border-0">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-3xl font-bold">Total Points</h2>
                <p className="opacity-90 mt-2">{data.name}</p>
              </div>
              <div className="text-5xl font-bold">{data.totalPoints}</div>
            </div>
          </Card>
        )}

        {/* Performance Cards avec design moderne */}
        {data && (
          <>
            {/* Character Analysis */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-6 bg-gradient-to-r from-green-50 to-green-100 rounded-2xl flex justify-between items-center border-green-200 hover:shadow-lg transition-all duration-300 hover:scale-105">
                <div>
                  <h2 className="text-xl text-gray-800 font-semibold">Strongest Domain</h2>
                  <div className="text-2xl font-bold text-[#4CAF50] flex items-center mt-2">
                    {getTopCharacterDomain(data).domain}
                    <TrendingUp className="ml-4 text-[#25AAE1]" />
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {getTopCharacterDomain(data).value} points
                  </p>
                </div>
              </Card>

              <Card className="p-6 bg-gradient-to-r from-orange-50 to-orange-100 rounded-2xl flex justify-between items-center border-orange-200 hover:shadow-lg transition-all duration-300 hover:scale-105">
                <div>
                  <h2 className="text-xl text-gray-800 font-semibold">Focus Area</h2>
                  <div className="text-2xl font-bold text-[#FF8A00] flex items-center mt-2">
                    {getFocusDomain(data).domain !== 'None' ? getFocusDomain(data).domain : 'All Good!'}
                    <TrendingDown className="ml-4 text-[#25AAE1]" />
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {getFocusDomain(data).domain !== 'None' ? `${getFocusDomain(data).value} issues` : 'Keep it up!'}
                  </p>
                </div>
              </Card>
            </div>

            {/* Attendance & Character Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
                <div className="text-blue-800 font-semibold">Present Days</div>
                <div className="text-2xl font-bold text-blue-900">{data.attendanceBalance.present}</div>
              </Card>
              <Card className="p-4 bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200">
                <div className="text-yellow-800 font-semibold">Late Days</div>
                <div className="text-2xl font-bold text-yellow-900">{data.attendanceBalance.late}</div>
              </Card>
              <Card className="p-4 bg-gradient-to-r from-red-50 to-red-100 border-red-200">
                <div className="text-red-800 font-semibold">Absent Days</div>
                <div className="text-2xl font-bold text-red-900">{data.attendanceBalance.absent}</div>
              </Card>
              <Card className="p-4 bg-gradient-to-r from-green-50 to-green-100 border-green-200">
                <div className="text-green-800 font-semibold">Good Domains</div>
                <div className="text-2xl font-bold text-green-900">{data.goodDomains.length}</div>
              </Card>
            </div>
          </>
        )}

        {/* Character Breakdown */}
        {data && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Good Character */}
            <Card className="p-6 bg-gradient-to-r from-green-50 to-green-100 rounded-2xl border-green-200">
              <h3 className="text-xl font-bold text-green-800 mb-4">Good Character Points</h3>
              <div className="space-y-2">
                {Object.entries(data.goodCharacter).map(([domain, points]) => (
                  <div key={domain} className="flex justify-between items-center">
                    <span className="capitalize text-gray-700">{domain}</span>
                    <span className="font-bold text-green-600">{points}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Bad Character */}
            <Card className="p-6 bg-gradient-to-r from-red-50 to-red-100 rounded-2xl border-red-200">
              <h3 className="text-xl font-bold text-red-800 mb-4">Areas for Improvement</h3>
              <div className="space-y-2">
                {Object.entries(data.badCharacter).length > 0 ? (
                  Object.entries(data.badCharacter).map(([domain, points]) => (
                    <div key={domain} className="flex justify-between items-center">
                      <span className="capitalize text-gray-700">{domain}</span>
                      <span className="font-bold text-red-600">{points}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-600 italic">Great job! No areas needing improvement.</p>
                )}
              </div>
            </Card>
          </div>
        )}

        {/* Exchange Dialog */}
        <Dialog open={isExchangeOpen} onOpenChange={setIsExchangeOpen}>
          <DialogContent className="sm:max-w-[400px] p-0">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-medium text-gray-700">Exchange Points</h2>
                <button onClick={() => setIsExchangeOpen(false)} className="text-gray-500 hover:text-gray-700" title="Close">
                  <X size={18} />
                </button>
              </div>

              <div className="border-t mb-6"></div>

              <div className="space-y-4">
                <div className="flex justify-between items-center bg-gradient-to-r from-[#25AAE1]/10 to-[#D15A9D]/10 p-4 rounded-xl">
                  <span className="text-gray-600">Credit</span>
                  <span className="text-2xl font-medium text-[#25AAE1]">2300 D</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Exchange Cost</span>
                  <div className="bg-gradient-to-r from-[#25AAE1]/10 to-[#D15A9D]/10 p-3 rounded-xl min-w-[100px] text-center">
                    <span className="text-xl font-medium text-[#25AAE1]">{exchangeCost} D</span>
                  </div>
                </div>

                <Button className="w-full bg-gradient-to-r from-[#25AAE1] to-[#1D8CB3] hover:shadow-lg text-white rounded-xl px-8 py-6">EXCHANGE</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Latest News Dialog */}
        <Dialog open={isTransactionsOpen} onOpenChange={setIsTransactionsOpen}>
          <DialogContent className="sm:max-w-[800px] p-0 max-h-[80vh] overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-medium text-gray-700">Latest News & Activities</h2>
                <button onClick={() => setIsTransactionsOpen(false)} className="text-gray-500 hover:text-gray-700" title="Close">
                  <X size={18} />
                </button>
              </div>

              <div className="border-t mb-6"></div>

              <div className="space-y-4 max-h-[60vh] overflow-y-auto">
                {data?.latestNews && data.latestNews.length > 0 ? (
                  <div className="space-y-3">
                    {data.latestNews.map((news, index) => (
                      <div key={index} className={`p-4 rounded-lg border-l-4 ${
                        news.status === 'good' 
                          ? 'bg-green-50 border-green-400' 
                          : 'bg-red-50 border-red-400'
                      }`}>
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                news.status === 'good'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {news.status === 'good' ? 'GOOD' : 'NEEDS IMPROVEMENT'}
                              </span>
                              <span className="text-sm text-gray-600">{news.class}</span>
                            </div>
                            <p className="text-gray-800 font-medium">{news.newsAndComment}</p>
                            {news.sanctions && (
                              <p className="text-red-600 text-sm mt-1">Sanctions: {news.sanctions}</p>
                            )}
                            <p className="text-sm text-gray-500 mt-2">
                              {formatDate(news.date)} • {news.period || 'All day'}
                            </p>
                          </div>
                          <div className="text-right">
                            <div className={`text-2xl font-bold ${
                              news.status === 'good' ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {news.status === 'good' ? '+' : ''}{news.points}
                            </div>
                            <div className="text-xs text-gray-500">points</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No recent news available</p>
                  </div>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>

      </section>
    </div>
  )
}

