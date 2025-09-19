"use client"

import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { FileText, ChevronLeft, ChevronRight } from "lucide-react"
import { Progress } from "@/components/ui/progress"

interface Exam {
  id: number
  score: string
  date: string
  title: string
}

interface ClassData {
  id: number
  class: string
  student: string
  average: string
  exams: Exam[]
  teacher: string
  trend: "up" | "down" | "stable"
}

interface ExamDetailDialogProps {
  isOpen: boolean
  onClose: () => void
  exam: Exam
  classData: ClassData
}

export function ExamDetailDialog({ isOpen, onClose, exam, classData }: ExamDetailDialogProps) {
  // Convert score percentage to number
  const scoreValue = Number.parseInt(exam.score.replace("%", ""))

  // Helper function to get grade letter
  const getGradeLetter = (score: number) => {
    if (score >= 90) return "A"
    if (score >= 80) return "B"
    if (score >= 70) return "C"
    if (score >= 60) return "D"
    return "F"
  }

  // Get color based on score
  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600"
    if (score >= 80) return "text-blue-600"
    if (score >= 70) return "text-yellow-600"
    if (score >= 60) return "text-orange-600"
    return "text-red-600"
  }

  // Get progress color based on score
//   const getProgressColor = (score: number) => {
//     if (score >= 90) return "bg-green-600"
//     if (score >= 80) return "bg-blue-600"
//     if (score >= 70) return "bg-yellow-600"
//     if (score >= 60) return "bg-orange-600"
//     return "bg-red-600"
//   }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden">
        <div className="p-6">
          <div className="mb-4">
            <div className="text-lg font-medium">{exam.title}</div>
          </div>

          <div className="border-t pt-4 mb-4" />

          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <span className="text-gray-600 mr-2">Class:</span>
                <span className="font-medium">{classData.class}</span>
              </div>
              <div className="flex items-center">
                <span className="text-gray-600 mr-2">Date:</span>
                <span className="font-medium">{exam.date}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="text-gray-600 mr-2">Student:</span>
                <span className="font-medium">{classData.student}</span>
              </div>
              <div className="flex items-center">
                <span className="text-gray-600 mr-2">Teacher:</span>
                <span className="font-medium">{classData.teacher}</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <div className="flex justify-between items-center mb-4">
              <div className="text-xl font-bold">Score</div>
              <div className={`text-2xl font-bold ${getScoreColor(scoreValue)}`}>
                {exam.score} ({getGradeLetter(scoreValue)})
              </div>
            </div>
            <Progress
              value={scoreValue}
              className="h-4 bg-gray-200"
            />
          </div>

          <div className="flex items-center justify-center mt-4 space-x-4">
            <Button variant="outline" className="flex items-center">
              <FileText className="mr-2 h-4 w-4" />
              View Exam
            </Button>
            <Button variant="outline" className="flex items-center">
              <FileText className="mr-2 h-4 w-4" />
              View Answers
            </Button>
          </div>

          <div className="flex justify-between mt-8 pt-4 border-t">
            {classData.exams.findIndex((e) => e.id === exam.id) > 0 ? (
              <Button variant="ghost" className="flex items-center text-gray-600">
                <ChevronLeft className="mr-1 h-4 w-4" />
                Previous Exam
              </Button>
            ) : (
              <div></div>
            )}

            {classData.exams.findIndex((e) => e.id === exam.id) < classData.exams.length - 1 ? (
              <Button variant="ghost" className="flex items-center text-gray-600">
                Next Exam
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            ) : (
              <div></div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
