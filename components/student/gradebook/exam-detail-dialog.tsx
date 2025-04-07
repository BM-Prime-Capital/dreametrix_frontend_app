"use client"

import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { X, ChevronLeft, ChevronRight, Play, Check, XIcon } from "lucide-react"
import { useState } from "react"

// Define proper types
interface Exam {
  id: number
  score: string
}

interface Question {
  text: string
  isCorrect: boolean
  hasExplanation: boolean
}

interface ExamDetailDialogProps {
  isOpen: boolean
  onClose: () => void
  exam: Exam
  exams: Exam[]
}

export function ExamDetailDialog({ isOpen, onClose,  exams }: ExamDetailDialogProps) {
  const [currentExamIndex, setCurrentExamIndex] = useState(0)

  // Sample exam questions with correct/incorrect status
  const questions: Question[] = [
    { text: "Question 1", isCorrect: true, hasExplanation: false },
    { text: "Question 2", isCorrect: false, hasExplanation: true },
    { text: "Question 3", isCorrect: false, hasExplanation: true },
    { text: "Question 4", isCorrect: false, hasExplanation: true },
  ]

  const handlePrevExam = () => {
    if (currentExamIndex > 0) {
      setCurrentExamIndex(currentExamIndex - 1)
    }
  }

  const handleNextExam = () => {
    if (currentExamIndex < exams.length - 1) {
      setCurrentExamIndex(currentExamIndex + 1)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] p-0 overflow-hidden gap-0 flex">
        <div className="w-[300px] p-6 border-r">
          <div className="flex items-center justify-between mb-4">
            <div className="text-lg font-medium">EXAMS</div>
            <Button variant="ghost" size="icon" onClick={onClose} className="h-6 w-6">
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="border-t pt-4" />

          <div className="space-y-4 mt-2">
            {exams.map((exam, index) => (
              <div
                key={exam.id}
                className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
                onClick={() => setCurrentExamIndex(index)}
              >
                <span className="text-gray-700">
                  {index + 1}. {exam.score}
                </span>
                <Folder className="h-5 w-5 text-[#25AAE1]" />
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1 p-6 bg-gray-50">
          <div className="text-lg font-medium mb-4">EXAM {currentExamIndex + 1}</div>

          <div className="bg-white rounded-lg p-6 min-h-[400px]">
            <div className="space-y-6">
              {questions.map((question, index) => (
                <div key={index} className="flex items-start">
                  <div className="flex-1">
                    <div className="h-4 bg-gray-500 rounded w-3/4 mb-2"></div>
                    {index === 0 && <div className="h-4 bg-gray-500 rounded w-full"></div>}
                    {index === 1 && (
                      <>
                        <div className="h-4 bg-gray-500 rounded w-full mb-2"></div>
                        <div className="h-4 bg-gray-500 rounded w-full"></div>
                      </>
                    )}
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    {question.isCorrect ? (
                      <Check className="h-5 w-5 text-green-500" />
                    ) : (
                      <XIcon className="h-5 w-5 text-red-500" />
                    )}

                    {question.hasExplanation && (
                      <Button variant="ghost" size="icon" className="h-6 w-6 bg-green-500 text-white rounded-full">
                        <Play className="h-3 w-3 ml-0.5" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center items-center gap-2 text-sm text-gray-500 mt-4">
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={handlePrevExam}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span>
              {currentExamIndex + 1}/{exams.length}
            </span>
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={handleNextExam}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function Folder({ className }: { className?: string }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M3 7V17C3 18.1046 3.89543 19 5 19H19C20.1046 19 21 18.1046 21 17V9C21 7.89543 20.1046 7 19 7H13L11 5H5C3.89543 5 3 5.89543 3 7Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

