"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Trophy, Star, Heart, TrendingUp, Calendar, Award, Target, Users, MessageCircle } from "lucide-react"
import { ParentRewardsData } from "@/services/RewardsService"

interface RewardsDetailsDialogProps {
  isOpen: boolean
  onClose: () => void
  reward: ParentRewardsData
}

export function RewardsDetailsDialog({ isOpen, onClose, reward }: RewardsDetailsDialogProps) {
  // Calculate attendance percentages
  const totalAttendance = reward.report.attendanceBalance.present + reward.report.attendanceBalance.absent + reward.report.attendanceBalance.late
  const presentPercentage = totalAttendance > 0 ? Math.round((reward.report.attendanceBalance.present / totalAttendance) * 100) : 0
  const absentPercentage = totalAttendance > 0 ? Math.round((reward.report.attendanceBalance.absent / totalAttendance) * 100) : 0
  const latePercentage = totalAttendance > 0 ? Math.round((reward.report.attendanceBalance.late / totalAttendance) * 100) : 0

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] p-0 overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-50">
        <DialogHeader className="bg-gradient-to-r from-blue-300 to-indigo-400 text-white p-6">
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Rewards Details
          </DialogTitle>
        </DialogHeader>

        <div className="p-6 space-y-6">
          {/* Student Information Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Users className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <div className="text-sm text-gray-500 font-medium">Student</div>
                  <div className="font-semibold text-gray-900">{reward.full_name}</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-50 rounded-lg">
                  <Trophy className="h-5 w-5 text-indigo-400" />
                </div>
                <div>
                  <div className="text-sm text-gray-500 font-medium">Total Points</div>
                  <div className="font-semibold text-gray-900">{reward.report.totalPoints}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs for different sections */}
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-white">
              <TabsTrigger value="overview" className="text-xs">Overview</TabsTrigger>
              <TabsTrigger value="attendance" className="text-xs">Attendance</TabsTrigger>
              <TabsTrigger value="domains" className="text-xs">Domains</TabsTrigger>
              <TabsTrigger value="character" className="text-xs">Character</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4 mt-4">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <Star className="h-5 w-5 text-blue-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Rewards Overview</h3>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Total Points</span>
                      <span className="font-semibold text-blue-400">{reward.report.totalPoints}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Good Domains</span>
                      <span className="font-semibold text-green-600">{reward.report.goodDomains.length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Focus Areas</span>
                      <span className="font-semibold text-orange-600">{reward.report.focusDomains.length}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Present Days</span>
                      <span className="font-semibold text-green-600">{reward.report.attendanceBalance.present}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Absent Days</span>
                      <span className="font-semibold text-red-600">{reward.report.attendanceBalance.absent}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Late Days</span>
                      <span className="font-semibold text-yellow-600">{reward.report.attendanceBalance.late}</span>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="attendance" className="space-y-4 mt-4">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Calendar className="h-5 w-5 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Attendance Statistics</h3>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="text-sm font-medium text-gray-700">Present ({reward.report.attendanceBalance.present})</span>
                      </div>
                      <span className="text-sm font-semibold text-green-600">{presentPercentage}%</span>
                    </div>
                    <Progress 
                      value={presentPercentage} 
                      className="h-2 bg-gray-100" 
                      style={{ 
                        '--progress-background': '#10B981',
                        '--progress-foreground': '#10B981'
                      } as React.CSSProperties}
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <span className="text-sm font-medium text-gray-700">Absent ({reward.report.attendanceBalance.absent})</span>
                      </div>
                      <span className="text-sm font-semibold text-red-600">{absentPercentage}%</span>
                    </div>
                    <Progress 
                      value={absentPercentage} 
                      className="h-2 bg-gray-100"
                      style={{ 
                        '--progress-background': '#EF4444',
                        '--progress-foreground': '#EF4444'
                      } as React.CSSProperties}
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <span className="text-sm font-medium text-gray-700">Late ({reward.report.attendanceBalance.late})</span>
                      </div>
                      <span className="text-sm font-semibold text-yellow-600">{latePercentage}%</span>
                    </div>
                    <Progress 
                      value={latePercentage} 
                      className="h-2 bg-gray-100"
                      style={{ 
                        '--progress-background': '#F59E0B',
                        '--progress-foreground': '#F59E0B'
                      } as React.CSSProperties}
                    />
                  </div>
                </div>

                {/* Summary Card */}
                <div className="mt-4 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">Total Attendance Days</span>
                    <span className="text-sm font-bold text-blue-400">{totalAttendance} days</span>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="domains" className="space-y-4 mt-4">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Target className="h-5 w-5 text-purple-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Academic Domains</h3>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-800 mb-2 flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      Good Domains ({reward.report.goodDomains.length})
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {reward.report.goodDomains.length > 0 ? (
                        reward.report.goodDomains.map((domain, index) => (
                          <Badge key={index} variant="outline" className="bg-green-50 text-green-700 border-green-200">
                            {domain}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-gray-500 text-sm">No good domains recorded</span>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-800 mb-2 flex items-center gap-2">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      Focus Areas ({reward.report.focusDomains.length})
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {reward.report.focusDomains.length > 0 ? (
                        reward.report.focusDomains.map((domain, index) => (
                          <Badge key={index} variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                            {domain}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-gray-500 text-sm">No focus areas recorded</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="character" className="space-y-4 mt-4">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-2 bg-indigo-50 rounded-lg">
                    <Heart className="h-5 w-5 text-indigo-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Character Development</h3>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-800 mb-2 flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      Good Character Traits
                    </h4>
                    <div className="p-4 bg-green-50 rounded-lg">
                      {reward.report.goodCharacter && Object.keys(reward.report.goodCharacter).length > 0 ? (
                        <div className="text-sm text-green-700">
                          {Object.entries(reward.report.goodCharacter).map(([trait, value]) => (
                            <div key={trait} className="flex justify-between items-center py-1">
                              <span className="capitalize">{trait.replace(/_/g, ' ')}</span>
                              <span className="font-semibold">{value}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-6">
                          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                            <Heart className="h-6 w-6 text-green-400" />
                          </div>
                          <p className="text-gray-500 text-sm font-medium">No good character traits recorded</p>
                          <p className="text-gray-400 text-xs mt-1">Character traits will appear here when recorded</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-800 mb-2 flex items-center gap-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      Areas for Improvement
                    </h4>
                    <div className="p-4 bg-red-50 rounded-lg">
                      {reward.report.badCharacter && Object.keys(reward.report.badCharacter).length > 0 ? (
                        <div className="text-sm text-red-700">
                          {Object.entries(reward.report.badCharacter).map(([trait, value]) => (
                            <div key={trait} className="flex justify-between items-center py-1">
                              <span className="capitalize">{trait.replace(/_/g, ' ')}</span>
                              <span className="font-semibold">{value}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-6">
                          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                            <TrendingUp className="h-6 w-6 text-red-400" />
                          </div>
                          <p className="text-gray-500 text-sm font-medium">No areas for improvement recorded</p>
                          <p className="text-gray-400 text-xs mt-1">Improvement areas will appear here when noted</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* Action Buttons */}
          {/* <div className="flex gap-3 pt-2">
            <Button 
              variant="outline" 
              className="flex-1 bg-white border-gray-200 hover:bg-gray-50 text-gray-700"
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Contact Teacher
            </Button>
            <Button 
              className="flex-1 bg-gradient-to-r from-blue-300 to-indigo-400 hover:from-blue-400 hover:to-indigo-500 text-white shadow-lg"
            >
              <Award className="h-4 w-4 mr-2" />
              View Full Report
            </Button>
          </div> */}
        </div>
      </DialogContent>
    </Dialog>
  )
} 