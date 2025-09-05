"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Heart, Star, TrendingUp, TrendingDown, Users, Calendar, Award, MessageCircle, Target } from "lucide-react"
import { ParentCharacterData } from "@/services/CharacterService"

interface CharacterDetailsDialogProps {
  isOpen: boolean
  onClose: () => void
  character: ParentCharacterData
}

export function CharacterDetailsDialog({ isOpen, onClose, character }: CharacterDetailsDialogProps) {
  // Calculate percentages
  const totalEvaluations = character.summary.total_good_character + character.summary.total_bad_character
  const goodPercentage = totalEvaluations > 0 ? Math.round((character.summary.total_good_character / totalEvaluations) * 100) : 0
  const badPercentage = totalEvaluations > 0 ? Math.round((character.summary.total_bad_character / totalEvaluations) * 100) : 0

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] p-0 overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-50">
        <DialogHeader className="bg-gradient-to-r from-blue-300 to-indigo-400 text-white p-6">
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <Heart className="h-5 w-5" />
            Character Details
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
                  <div className="font-semibold text-gray-900">{character.full_name}</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-50 rounded-lg">
                  <Calendar className="h-5 w-5 text-indigo-400" />
                </div>
                <div>
                  <div className="text-sm text-gray-500 font-medium">Days Evaluated</div>
                  <div className="font-semibold text-gray-900">{character.summary.total_days_evaluated}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs for different sections */}
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-white">
              <TabsTrigger value="overview" className="text-xs">Overview</TabsTrigger>
              <TabsTrigger value="statistics" className="text-xs">Statistics</TabsTrigger>
              <TabsTrigger value="ratings" className="text-xs">Ratings</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4 mt-4">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <Star className="h-5 w-5 text-blue-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Character Overview</h3>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Total Days Evaluated</span>
                      <span className="font-semibold text-blue-400">{character.summary.total_days_evaluated}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Good Character Traits</span>
                      <span className="font-semibold text-green-600">{character.summary.total_good_character}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Areas for Improvement</span>
                      <span className="font-semibold text-red-600">{character.summary.total_bad_character}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Average Good/Day</span>
                      <span className="font-semibold text-green-600">{character.summary.average_good_per_day.toFixed(1)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Average Bad/Day</span>
                      <span className="font-semibold text-red-600">{character.summary.average_bad_per_day.toFixed(1)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Total Evaluations</span>
                      <span className="font-semibold text-gray-600">{totalEvaluations}</span>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="statistics" className="space-y-4 mt-4">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Character Statistics</h3>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="text-sm font-medium text-gray-700">Good Character Traits ({character.summary.total_good_character})</span>
                      </div>
                      <span className="text-sm font-semibold text-green-600">{goodPercentage}%</span>
                    </div>
                    <Progress 
                      value={goodPercentage} 
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
                        <span className="text-sm font-medium text-gray-700">Areas for Improvement ({character.summary.total_bad_character})</span>
                      </div>
                      <span className="text-sm font-semibold text-red-600">{badPercentage}%</span>
                    </div>
                    <Progress 
                      value={badPercentage} 
                      className="h-2 bg-gray-100"
                      style={{ 
                        '--progress-background': '#EF4444',
                        '--progress-foreground': '#EF4444'
                      } as React.CSSProperties}
                    />
                  </div>
                </div>

                {/* Summary Card */}
                <div className="mt-4 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">Total Character Evaluations</span>
                    <span className="text-sm font-bold text-blue-400">{totalEvaluations} evaluations</span>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="ratings" className="space-y-4 mt-4">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Target className="h-5 w-5 text-purple-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Daily Ratings</h3>
                </div>

                <div className="space-y-4">
                  {character.ratings && character.ratings.length > 0 ? (
                    <div className="space-y-3">
                      {character.ratings.map((rating, index) => (
                        <div key={index} className="p-3 bg-gray-50 rounded-lg">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium text-gray-700">Day {index + 1}</span>
                            <span className="text-xs text-gray-500">{rating.date || 'N/A'}</span>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div className="flex items-center gap-2">
                              <Heart className="h-4 w-4 text-green-500" />
                              <span className="text-sm text-green-600">{rating.good_character || 0}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <TrendingDown className="h-4 w-4 text-red-500" />
                              <span className="text-sm text-red-600">{rating.bad_character || 0}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Target className="h-6 w-6 text-purple-400" />
                      </div>
                      <p className="text-gray-500 text-sm font-medium">No daily ratings available</p>
                      <p className="text-gray-400 text-xs mt-1">Daily ratings will appear here when recorded</p>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
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
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 