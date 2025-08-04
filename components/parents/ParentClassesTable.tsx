"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { SendMessageDialog } from "./SendMessageDialog"
import { ClassDetailsDialog } from "./ClassDetailsDialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useParentClasses } from "@/hooks/useParentClasses"
import { useRequestInfo } from "@/hooks/useRequestInfo"
import { Eye, Clock, BookOpen, Users } from "lucide-react"

interface ParentClassesTableProps {
  selectedChild: string
  selectedSubject?: string
  selectedLevel?: string
}

export function ParentClassesTable({ 
  selectedChild, 
  selectedSubject = "all", 
  selectedLevel = "all" 
}: ParentClassesTableProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  const [selectedTeacher, setSelectedTeacher] = useState("")
  const [selectedClassId, setSelectedClassId] = useState<number | null>(null)
  const { accessToken, refreshToken } = useRequestInfo()

  // Convert selectedChild to childId if needed
  const getChildId = () => {
    if (selectedChild === "john") return 1 // Replace with actual child ID mapping
    if (selectedChild === "emma") return 2 // Replace with actual child ID mapping
    return undefined // For "all"
  }

  const { classes, loading, error, refreshClasses } = useParentClasses({
    accessToken,
    refreshToken,
    childId: getChildId()
  })

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
    const levelMatch = selectedLevel === "all" || cls.level.toLowerCase() === selectedLevel.toLowerCase()
    return subjectMatch && levelMatch
  })

  // Show loading state
  if (loading) {
    return (
      <div className="w-full flex items-center justify-center py-8">
        <div className="text-gray-500">Loading classes...</div>
      </div>
    )
  }

  // Show error state
  if (error) {
    return (
      <div className="w-full flex items-center justify-center py-8">
        <div className="text-red-500">Error: {error}</div>
      </div>
    )
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
            {selectedChild === "all" && <TableHead className="font-bold text-gray-700 py-4 text-sm uppercase tracking-wide">STUDENTS</TableHead>}
            <TableHead className="font-bold text-gray-700 py-4 text-sm uppercase tracking-wide">ACTIONS</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredClasses.map((class_, index) => (
            <TableRow key={class_.id} className={`hover:bg-gray-50 transition-colors ${index % 2 === 0 ? "bg-white" : "bg-gray-50"}`}>
              <TableCell className="py-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <BookOpen className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{class_.name}</div>
                    <div className="text-sm text-gray-500">{class_.name}</div>
                  </div>
                </div>
              </TableCell>
              <TableCell className="py-4">
                <Badge variant="outline" className="bg-purple-50 text-purple-700 hover:bg-purple-100 border-purple-200">
                  {class_.subject}
                </Badge>
              </TableCell>
              <TableCell className="py-4">
                <div className="flex items-center gap-3 cursor-pointer hover:bg-gray-100 p-2 rounded-lg transition-colors" onClick={() => handleTeacherClick(`${class_.teacher.first_name} ${class_.teacher.last_name}`)}>
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-medium shadow-sm">
                    {class_.teacher.first_name?.charAt(0) || 'P'}{class_.teacher.last_name?.charAt(0) || ''}
                  </div>
                  <div className="flex-1">
                                         <div className="font-medium text-gray-900">{class_.teacher.first_name || 'Teacher'} {class_.teacher.last_name || ''}</div>
                     <div className="text-sm text-gray-500">Teacher</div>
                  </div>
                  <MessageIcon />
                </div>
              </TableCell>
              <TableCell className="py-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Clock className="w-4 h-4 text-orange-600" />
                  </div>
                  <div className="flex flex-col">
                    {class_.schedule.map((schedule, i) => (
                      <span key={i} className="text-gray-900 font-medium">{schedule.day}</span>
                    ))}
                  </div>
                </div>
              </TableCell>
              <TableCell className="py-4">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  Level {class_.level}
                </span>
              </TableCell>
                              {selectedChild === "all" && (
                  <TableCell className="py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                        <Users className="w-4 h-4 text-gray-600" />
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {class_.students.slice(0, 3).map((student, i) => (
                          <span key={student.id} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            {student.first_name?.charAt(0) || 'S'}{student.last_name?.charAt(0) || ''} {student.first_name || 'Student'} {student.last_name || ''}
                          </span>
                        ))}
                        {class_.students.length > 3 && (
                                                   <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                           +{class_.students.length - 3} more
                         </span>
                        )}
                      </div>
                    </div>
                  </TableCell>
                )}
              <TableCell className="py-4">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleViewDetails(class_.id)}
                  className="bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200 transition-colors"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View Details
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <SendMessageDialog isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} teacher={selectedTeacher} />
      
      <ClassDetailsDialog 
        isOpen={isDetailsModalOpen} 
        onClose={() => setIsDetailsModalOpen(false)} 
        classId={selectedClassId}
      />

      {(isModalOpen || isDetailsModalOpen) && <div className="absolute inset-0 bg-white/50 backdrop-blur-sm" />}
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
