"use client"

import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

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
  tests: {
    count: number
    average: string
  }
  assignments: {
    count: number
    average: string
    completed: number
  }
  teacher: string
  trend: "up" | "down" | "stable"
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
      <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="text-lg font-medium">
              {classData.class} Exams - {classData.student}
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} className="h-6 w-6">
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="border-t pt-4 mb-4" />

          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-b">
                <TableHead className="font-medium text-gray-700">DATE</TableHead>
                <TableHead className="font-medium text-gray-700">EXAM</TableHead>
                <TableHead className="font-medium text-gray-700">SCORE</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {classData.exams.map((exam) => (
                <TableRow key={exam.id} className="cursor-pointer hover:bg-gray-50" onClick={() => onExamClick(exam)}>
                  <TableCell className="text-gray-500">{exam.date}</TableCell>
                  <TableCell className="text-gray-500">{exam.title}</TableCell>
                  <TableCell className="text-gray-500">{exam.score}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="mt-6 text-center">
            <div className="text-lg font-medium mb-2">Exam Average: {classData.average}</div>
            <div className="text-sm text-gray-500">Click on any exam to see details</div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
