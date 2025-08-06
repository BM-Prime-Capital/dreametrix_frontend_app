"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { SendMessageDialog } from "./SendMessageDialog"
import { ClassDetailsDialog } from "./ClassDetailsDialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ParentClass } from "@/services/ParentClassService"
import { Eye, Clock, BookOpen, Users } from "lucide-react"

interface ParentClassesTableProps {
  selectedChild: string
  selectedSubject?: string
  selectedLevel?: string
  classes: ParentClass[]
}

export function ParentClassesTable({ 
  selectedChild, 
  selectedSubject = "all", 
  selectedLevel = "all",
  classes
}: ParentClassesTableProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  const [selectedTeacher, setSelectedTeacher] = useState("")
  const [selectedClassId, setSelectedClassId] = useState<number | null>(null)

  const handleTeacherClick = (teacherName: string) => {
    setSelectedTeacher(teacherName)
    setIsModalOpen(true)
  }

  const handleViewDetails = (classId: number) => {
    setSelectedClassId(classId)
    setIsDetailsModalOpen(true)
  }

  // Filter classes based on selected filters
  const filteredClasses = classes.filter((cls) => {
    const subjectMatch = selectedSubject === "all" || cls.subject.toLowerCase() === selectedSubject.toLowerCase()
    const levelMatch = selectedLevel === "all" || cls.level === selectedLevel
    const childMatch = selectedChild === "all" || cls.students.some(student => student.id.toString() === selectedChild)
    return subjectMatch && levelMatch && childMatch
  })

  // Get students to display based on filter
  const getStudentsToDisplay = (cls: ParentClass) => {
    if (selectedChild === "all") {
      return cls.students
    } else {
      // Show only the selected student
      return cls.students.filter(student => student.id.toString() === selectedChild)
    }
  }

  return (
    <div className="w-full relative">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent border-b bg-gray-50">
            <TableHead className="font-bold text-gray-700 py-4 text-sm uppercase tracking-wide">CLASS</TableHead>
            <TableHead className="font-bold text-gray-700 py-4 text-sm uppercase tracking-wide">SUBJECT</TableHead>
            <TableHead className="font-bold text-gray-700 py-4 text-sm uppercase tracking-wide">TEACHER</TableHead>
            <TableHead className="font-bold text-gray-700 py-4 text-sm uppercase tracking-wide">DAY & TIME</TableHead>
            <TableHead className="font-bold text-gray-700 py-4 text-sm uppercase tracking-wide">LEVEL</TableHead>
            <TableHead className="font-bold text-gray-700 py-4 text-sm uppercase tracking-wide">STUDENTS</TableHead>
            <TableHead className="font-bold text-gray-700 py-4 text-sm uppercase tracking-wide">ACTIONS</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredClasses.map((class_, index) => {
            const studentsToDisplay = getStudentsToDisplay(class_)
            
            return (
              <TableRow key={class_.id} className={`hover:bg-gray-50 transition-colors ${index % 2 === 0 ? "bg-white" : "bg-gray-50"}`}>
                <TableCell className="py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <BookOpen className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-800">{class_.name}</div>
                      <div className="text-sm text-gray-500">ID: {class_.id}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="py-4">
                  <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                    {class_.subject}
                  </Badge>
                </TableCell>
                <TableCell className="py-4">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                      <Users className="w-3 h-3 text-green-600" />
                    </div>
                    <span className="font-medium text-gray-800">
                      {class_.teacher.first_name} {class_.teacher.last_name}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="py-4">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">
                      {class_.schedule && class_.schedule.length > 0 
                        ? class_.schedule.map(s => `${s.day} ${s.time}`).join(', ')
                        : 'No schedule'
                      }
                    </span>
                  </div>
                </TableCell>
                <TableCell className="py-4">
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    Grade {class_.level}
                  </Badge>
                </TableCell>
                <TableCell className="py-4">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-gray-400" />
                    <div className="flex flex-wrap gap-1">
                      {studentsToDisplay.slice(0, 3).map((student, i) => (
                        <span key={student.id} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {student.first_name} {student.last_name}
                        </span>
                      ))}
                      {studentsToDisplay.length > 3 && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          +{studentsToDisplay.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="py-4">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewDetails(class_.id)}
                      className="flex items-center gap-2 text-blue-600 hover:text-blue-700 border-blue-200 hover:border-blue-300 hover:bg-blue-50"
                    >
                      <Eye className="w-4 h-4" />
                      View Details
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>

      {filteredClasses.length === 0 && classes.length > 0 && (
        <div className="text-center py-8 text-gray-500">
          <BookOpen className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p>No classes found for the selected filters</p>
        </div>
      )}

      {classes.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <BookOpen className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p>No classes available</p>
        </div>
      )}

      {/* Modals */}
      <SendMessageDialog
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        teacher={selectedTeacher}
      />

      {selectedClassId && (
        <ClassDetailsDialog
          isOpen={isDetailsModalOpen}
          onClose={() => {
            setIsDetailsModalOpen(false)
            setSelectedClassId(null)
          }}
          classId={selectedClassId}
        />
      )}
    </div>
  )
}
