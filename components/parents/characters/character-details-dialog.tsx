"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { TransformedCharacterData } from "@/services/CharacterService"
import { Calendar, User, BookOpen, Smile, Frown, AlertCircle, MessageSquare, Award } from "lucide-react"

interface CharacterDetailsDialogProps {
  isOpen: boolean
  onClose: () => void
  student: TransformedCharacterData | null
}

export function CharacterDetailsDialog({ isOpen, onClose, student }: CharacterDetailsDialogProps) {
  if (!student) return null

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-[#25AAE1] flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#25AAE1] to-[#1D8CB3] flex items-center justify-center text-white font-bold text-lg">
              {student.full_name.split(' ').map(n => n[0]).join('').toUpperCase()}
            </div>
            {student.full_name} - Character Details
          </DialogTitle>
        </DialogHeader>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
            <div className="text-center">
              <Award className="h-6 w-6 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-700">{student.character.character_score.toFixed(1)}%</div>
              <p className="text-blue-600 text-xs">Character Score</p>
            </div>
          </Card>

          <Card className="p-4 bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
            <div className="text-center">
              <Calendar className="h-6 w-6 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-purple-700">{student.summary.total_days_evaluated}</div>
              <p className="text-purple-600 text-xs">Days Evaluated</p>
            </div>
          </Card>

          <Card className="p-4 bg-gradient-to-r from-green-50 to-green-100 border-green-200">
            <div className="text-center">
              <Smile className="h-6 w-6 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-700">{student.summary.average_good_per_day.toFixed(1)}</div>
              <p className="text-green-600 text-xs">Avg Good/Day</p>
            </div>
          </Card>

          <Card className="p-4 bg-gradient-to-r from-red-50 to-red-100 border-red-200">
            <div className="text-center">
              <Frown className="h-6 w-6 text-red-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-red-700">{student.summary.average_bad_per_day.toFixed(1)}</div>
              <p className="text-red-600 text-xs">Avg Bad/Day</p>
            </div>
          </Card>
        </div>

        {/* Behavior Timeline */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <Calendar className="h-5 w-5 text-[#25AAE1]" />
            Behavior Timeline
          </h3>

          {student.ratings.length === 0 ? (
            <Card className="p-8 text-center bg-gray-50">
              <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No behavior ratings recorded yet</p>
            </Card>
          ) : (
            <div className="space-y-3">
              {student.ratings
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .map((rating) => (
                  <Card key={rating.id} className="p-4 hover:shadow-lg transition-all duration-200 border-l-4 border-[#25AAE1]">
                    {/* Header: Date, Class, Teacher */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          <span className="font-semibold text-gray-800">{formatDate(rating.date)}</span>
                          {rating.period && (
                            <Badge variant="outline" className="text-xs">
                              {rating.period}
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mb-1">
                          <BookOpen className="h-4 w-4 text-[#25AAE1]" />
                          <span className="text-sm font-medium text-gray-700">{rating.class.name}</span>
                          <Badge variant="secondary" className="text-xs">{rating.class.subject}</Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-gray-500" />
                          <span className="text-sm text-gray-600">{rating.teacher.full_name}</span>
                        </div>
                      </div>
                    </div>

                    {/* Good Behaviors */}
                    {rating.good_statistics_character.length > 0 && (
                      <div className="mb-3">
                        <div className="flex items-center gap-2 mb-2">
                          <Smile className="h-4 w-4 text-green-600" />
                          <span className="text-sm font-semibold text-green-700">Good Behaviors</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {rating.good_statistics_character.map((behavior, idx) => (
                            <Badge key={idx} className="bg-green-100 text-green-700 border-green-200">
                              {behavior}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Bad Behaviors */}
                    {rating.bad_statistics_character.length > 0 && (
                      <div className="mb-3">
                        <div className="flex items-center gap-2 mb-2">
                          <Frown className="h-4 w-4 text-red-600" />
                          <span className="text-sm font-semibold text-red-700">Bad Behaviors</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {rating.bad_statistics_character.map((behavior, idx) => (
                            <Badge key={idx} className="bg-red-100 text-red-700 border-red-200">
                              {behavior}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Sanctions */}
                    {rating.sanctions && rating.sanctions.trim() !== "" && (
                      <div className="mb-3">
                        <div className="flex items-center gap-2 mb-2">
                          <AlertCircle className="h-4 w-4 text-orange-600" />
                          <span className="text-sm font-semibold text-orange-700">Sanctions</span>
                        </div>
                        <p className="text-sm text-gray-700 bg-orange-50 p-3 rounded-lg border border-orange-200">
                          {rating.sanctions}
                        </p>
                      </div>
                    )}

                    {/* Teacher Comments */}
                    {(rating.teacher_comment_good_character || rating.teacher_comment_bad_character) && (
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <MessageSquare className="h-4 w-4 text-[#25AAE1]" />
                          <span className="text-sm font-semibold text-gray-700">Teacher Comments</span>
                        </div>
                        {rating.teacher_comment_good_character && (
                          <p className="text-sm text-green-700 bg-green-50 p-3 rounded-lg mb-2 border border-green-200">
                            <span className="font-semibold">Good: </span>{rating.teacher_comment_good_character}
                          </p>
                        )}
                        {rating.teacher_comment_bad_character && (
                          <p className="text-sm text-red-700 bg-red-50 p-3 rounded-lg border border-red-200">
                            <span className="font-semibold">Bad: </span>{rating.teacher_comment_bad_character}
                          </p>
                        )}
                      </div>
                    )}

                    {/* Empty state for rating with no data */}
                    {rating.good_statistics_character.length === 0 &&
                     rating.bad_statistics_character.length === 0 &&
                     !rating.sanctions &&
                     !rating.teacher_comment_good_character &&
                     !rating.teacher_comment_bad_character && (
                      <div className="text-center py-4">
                        <p className="text-sm text-gray-500">No behavioral observations recorded for this day</p>
                      </div>
                    )}
                  </Card>
                ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
