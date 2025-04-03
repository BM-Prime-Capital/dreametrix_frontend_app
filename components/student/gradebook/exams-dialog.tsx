"use client"

import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

// Define proper types
interface Exam {
  id: number
  score: string
}

interface ClassData {
  id: number
  class: string
  average: string
  exams: Exam[]
  tests: number
  assignments: number
  teacher: string
  trend: "up" | "down"
}

interface ExamsDialogProps {
  isOpen: boolean
  onClose: () => void
  classData: ClassData
  onExamClick: (exam: Exam) => void
}

export function ExamsDialog({ isOpen, onClose, classData, onExamClick }: ExamsDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px] p-6 overflow-hidden gap-0">
        <div className="flex items-center justify-between mb-4">
          <div className="text-lg font-medium">EXAMS</div>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-6 w-6">
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="border-t pt-4" />

        <div className="space-y-4 mt-2">
          {classData.exams.map((exam, index) => (
            <div
              key={exam.id}
              className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
              onClick={() => onExamClick(exam)}
            >
              <span className="text-gray-700">
                {index + 1}. {exam.score}
              </span>
              <Folder className="h-5 w-5 text-[#25AAE1]" />
            </div>
          ))}
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

