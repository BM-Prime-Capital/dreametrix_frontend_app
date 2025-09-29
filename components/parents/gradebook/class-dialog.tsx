"use client"

import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Calendar, BookOpen, FileText, Users } from "lucide-react"
import { Progress } from "@/components/ui/progress"

interface ClassData {
  id: number
  class: string
  student: string
  average: string
  exams: {
    id: number
    score: string
    date: string
    title: string
  }[]
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

interface ClassDialogProps {
  isOpen: boolean
  onClose: () => void
  classData: ClassData
}

export function ClassDialog({ isOpen, onClose, classData }: ClassDialogProps) {
  // Parse percentage values
  const averagePercentage = Number.parseInt(classData.average.split("%")[0])
  const examAveragePercentage =
    classData.exams.reduce((acc, exam) => acc + Number.parseInt(exam.score.replace("%", "")), 0) /
    classData.exams.length
  const testsAveragePercentage = Number.parseInt(classData.tests.average.replace("%", ""))
  const assignmentsAveragePercentage = Number.parseInt(classData.assignments.average.replace("%", ""))

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden">
        <div className="p-6">
          <div className="mb-4">
            <div className="text-xl font-medium">{classData.class}</div>
          </div>

          <div className="border-t pt-4 mb-4" />

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="flex items-center">
              <Users className="h-5 w-5 text-gray-500 mr-2" />
              <div>
                <div className="text-sm text-gray-600">Teacher</div>
                <div className="font-medium">{classData.teacher}</div>
              </div>
            </div>

            <div className="flex items-center">
              <BookOpen className="h-5 w-5 text-gray-500 mr-2" />
              <div>
                <div className="text-sm text-gray-600">Student</div>
                <div className="font-medium">{classData.student}</div>
              </div>
            </div>

            <div className="flex items-center">
              <Calendar className="h-5 w-5 text-gray-500 mr-2" />
              <div>
                <div className="text-sm text-gray-600">Schedule</div>
                <div className="font-medium">Mon, Wed, Fri</div>
              </div>
            </div>

            <div className="flex items-center">
              <FileText className="h-5 w-5 text-gray-500 mr-2" />
              <div>
                <div className="text-sm text-gray-600">Syllabus</div>
                <div className="font-medium text-blue-600 cursor-pointer">View</div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <div className="font-medium">Overall Average</div>
                <div className="font-medium">{classData.average}</div>
              </div>
              <Progress value={averagePercentage} className="h-3 bg-gray-200" />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <div className="font-medium">Exams ({classData.exams.length})</div>
                <div className="font-medium">{examAveragePercentage.toFixed(0)}%</div>
              </div>
              <Progress value={examAveragePercentage} className="h-3 bg-gray-200"  />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <div className="font-medium">Tests ({classData.tests.count})</div>
                <div className="font-medium">{classData.tests.average}</div>
              </div>
              <Progress value={testsAveragePercentage} className="h-3 bg-gray-200"  />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <div className="font-medium">
                  Assignments ({classData.assignments.completed}/{classData.assignments.count})
                </div>
                <div className="font-medium">{classData.assignments.average}</div>
              </div>
              <Progress
                value={assignmentsAveragePercentage}
                className="h-3 bg-gray-200"
               
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            {/* <Button variant="outline" className="bg-white">
              <FileText className="h-4 w-4 mr-2" />
              Class Report
            </Button> */}
            <Button className="bg-[#25AAE1] hover:bg-[#1D8CB3] text-white">Contact Teacher</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
