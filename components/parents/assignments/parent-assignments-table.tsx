"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { FileIcon, FileTextIcon } from "lucide-react"
import { ViewAssignmentDialog } from "@/components/student/assignments/view-assignment-dialog"
import { ViewSubmissionDialog } from "@/components/student/assignments/view-submission-dialog"
import { Badge } from "@/components/ui/badge"

// Sample assignments data
const assignments = [
  {
    id: 1,
    student: "Mia",
    class: "Class 5 - Sci",
    day: "YESTERDAY",
    type: "Homework",
    hasSubmitted: true,
    teacher: "Eva Parker",
  },
  {
    id: 2,
    student: "Mia",
    class: "Class 5 - Math",
    day: "TODAY",
    type: "Test",
    hasSubmitted: false,
    teacher: "Eva Parker",
  },
  {
    id: 3,
    student: "John",
    class: "Class 5 - Bio",
    day: "11:25",
    type: "Homework",
    hasSubmitted: true,
    teacher: "Sam Burke",
  },
  {
    id: 4,
    student: "John",
    class: "Class 5 - Lit",
    day: "11:25",
    type: "Homework",
    hasSubmitted: true,
    teacher: "Anna Blake",
  },
  {
    id: 5,
    student: "Mia",
    class: "Class 5 - Che",
    day: "11:29",
    type: "Test",
    hasSubmitted: false,
    teacher: "Sam Burke",
  },
  {
    id: 6,
    student: "John",
    class: "Class 5 - Spa",
    day: "12:05",
    type: "Test",
    hasSubmitted: false,
    teacher: "Anna Blake",
  },
  {
    id: 7,
    student: "John",
    class: "Class 5 - Phy",
    day: "12:06",
    type: "Test",
    hasSubmitted: false,
    teacher: "Eva Parker",
  },
]

interface ParentAssignmentsTableProps {
  selectedStudent: string
  selectedClass: string
}

export function ParentAssignmentsTable({ selectedStudent, selectedClass }: ParentAssignmentsTableProps) {
  const [isViewAssignmentModalOpen, setIsViewAssignmentModalOpen] = useState(false)
  const [isViewSubmissionModalOpen, setIsViewSubmissionModalOpen] = useState(false)
  const [selectedAssignment, setSelectedAssignment] = useState<{
    id: number
    student: string
    class: string
    day: string
    type: string
    hasSubmitted: boolean
    teacher: string
  } | null>(null)

  const handleAssignmentClick = (assignment: (typeof assignments)[0]) => {
    setSelectedAssignment(assignment)
    setIsViewAssignmentModalOpen(true)
  }

  const handleSubmissionClick = (assignment: (typeof assignments)[0]) => {
    setSelectedAssignment(assignment)
    if (assignment.hasSubmitted) {
      setIsViewSubmissionModalOpen(true)
    }
  }

  // Filter assignments based on selected student and class
  const filteredAssignments = assignments.filter((assignment) => {
    const studentMatch =
      selectedStudent === "all-students" ||
      (selectedStudent === "john" && assignment.student === "John") ||
      (selectedStudent === "mia" && assignment.student === "Mia")

    const classMatch =
      selectedClass === "all-classes" || assignment.class.toLowerCase() === selectedClass.replace(/-/g, " ")

    return studentMatch && classMatch
  })

  return (
    <div className="w-full relative">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent border-b">
            <TableHead className="font-bold text-gray-700 py-4">STUDENT</TableHead>
            <TableHead className="font-bold text-gray-700 py-4">CLASS</TableHead>
            <TableHead className="font-bold text-gray-700 py-4">DAY</TableHead>
            <TableHead className="font-bold text-gray-700 py-4">TYPE</TableHead>
            <TableHead className="font-bold text-gray-700 py-4">ASSIGNMENT</TableHead>
            <TableHead className="font-bold text-gray-700 py-4">FILES</TableHead>
            <TableHead className="font-bold text-gray-700 py-4">TEACHER</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredAssignments.map((assignment, index) => (
            <TableRow key={assignment.id} className={index % 2 === 0 ? "bg-[#EDF6FA]" : ""}>
              <TableCell className="font-medium text-gray-500">
                <Badge variant="outline" className="bg-blue-50 text-blue-700 hover:bg-blue-100">
                  {assignment.student}
                </Badge>
              </TableCell>
              <TableCell className="font-medium text-gray-500">{assignment.class}</TableCell>
              <TableCell className="text-gray-500">
                <span
                  className={
                    assignment.day === "TODAY"
                      ? "text-[#25AAE1] underline"
                      : assignment.day === "YESTERDAY"
                        ? "text-orange-400 underline"
                        : ""
                  }
                >
                  {assignment.day}
                </span>
              </TableCell>
              <TableCell className="text-gray-500">{assignment.type}</TableCell>
              <TableCell>
                <div className="flex items-center justify-center">
                  <button
                    className="text-[#25AAE1] hover:text-[#1D8CB3]"
                    onClick={() => handleAssignmentClick(assignment)}
                  >
                    <FileTextIcon className="h-5 w-5" />
                  </button>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center justify-center">
                  <button
                    className={`${assignment.hasSubmitted ? "text-[#4CAF50]" : "text-gray-400"} hover:opacity-80`}
                    onClick={() => handleSubmissionClick(assignment)}
                  >
                    <FileIcon className="h-5 w-5" />
                  </button>
                </div>
              </TableCell>
              <TableCell className="text-gray-500">
                <div className="flex items-center">
                  {assignment.teacher} <MessageIcon />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {selectedAssignment && (
        <>
          <ViewAssignmentDialog
            isOpen={isViewAssignmentModalOpen}
            onClose={() => setIsViewAssignmentModalOpen(false)}
            assignment={selectedAssignment}
          />

          <ViewSubmissionDialog
            isOpen={isViewSubmissionModalOpen}
            onClose={() => setIsViewSubmissionModalOpen(false)}
            assignment={selectedAssignment}
          />
        </>
      )}

      {(isViewAssignmentModalOpen || isViewSubmissionModalOpen) && (
        <div className="absolute inset-0 bg-white/50 backdrop-blur-sm" />
      )}
    </div>
  )
}

function MessageIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="text-[#25AAE1] ml-2"
    >
      <path d="M22 2L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path
        d="M22 2L15 22L11 13L2 9L22 2Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}