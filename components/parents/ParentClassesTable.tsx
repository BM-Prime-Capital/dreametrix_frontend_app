/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { SendMessageDialog } from "./SendMessageDialog"
import { ClassDetailsDialog } from "./ClassDetailsDialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
//import { ParentClass } from "@/services/ParentClassService"
import { Eye, BookOpen, Users, AlertCircle, MessageSquare, Calendar, User } from "lucide-react"

interface ParentClassesTableProps {
  selectedChild: string
  selectedSubject?: string
  selectedLevel?: string
  classes: any
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
  const filteredClasses = classes.filter((cls: { subject: string; level: string; students: { id: { toString: () => string } }[] }) => {
    const subjectMatch = selectedSubject === "all" || cls.subject.toLowerCase() === selectedSubject.toLowerCase()
    const levelMatch = selectedLevel === "all" || cls.level === selectedLevel
    const childMatch = selectedChild === "all" || cls.students.some((student: { id: { toString: () => string } }) => student.id.toString() === selectedChild)
    return subjectMatch && levelMatch && childMatch
  })

  // Get students to display based on filter
  const getStudentsToDisplay = (cls: any) => {
    if (selectedChild === "all") {
      return cls.students
    } else {
      // Show only the selected student
      return cls.students.filter((student: { id: { toString: () => string } }) => student.id.toString() === selectedChild)
    }
  }

  const formatTime = (timeString: string) => {
    const time = new Date(`2000-01-01T${timeString}`)
    return time.toLocaleTimeString('en-US', { 
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  }

  const getSubjectBadge = (subject: string) => {
    const subjectColors = {
      'mathematics': 'bg-blue-100 text-blue-700 border-blue-200',
      'science': 'bg-green-100 text-green-700 border-green-200',
      'english': 'bg-purple-100 text-purple-700 border-purple-200',
      'history': 'bg-orange-100 text-orange-700 border-orange-200',
      'geography': 'bg-red-100 text-red-700 border-red-200',
      'art': 'bg-pink-100 text-pink-700 border-pink-200',
      'music': 'bg-indigo-100 text-indigo-700 border-indigo-200',
      'physical education': 'bg-yellow-100 text-yellow-700 border-yellow-200'
    };
    
    const colorClass = subjectColors[subject.toLowerCase() as keyof typeof subjectColors] || 'bg-gray-100 text-gray-700 border-gray-200';
    
    return (
      <Badge variant="outline" className={`${colorClass} text-xs`}>
        {subject.charAt(0).toUpperCase() + subject.slice(1)}
      </Badge>
    )
  };

  const getLevelBadge = (level: string) => {
    return (
      <Badge variant="outline" className="bg-amber-100 text-amber-700 border-amber-200 text-xs">
        Grade {level}
      </Badge>
    )
  };

  if (filteredClasses.length === 0) {
    return (
      <div className="w-full flex items-center justify-center py-16">
        <div className="bg-gradient-to-br from-gray-50 to-slate-50 p-8 rounded-3xl border border-gray-200 shadow-lg max-w-md w-full">
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">No Classes Found</h3>
            <p className="text-gray-600 text-center">No classes match the selected filters</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full relative">
      <div className="overflow-x-auto">
        <Table className="w-full">
          <TableHeader>
            <TableRow className="hover:bg-transparent border-b border-gray-200">
              <TableHead className="font-bold text-gray-700 py-4 text-sm uppercase tracking-wide pl-6">CLASS</TableHead>
              <TableHead className="font-bold text-gray-700 py-4 text-sm uppercase tracking-wide text-center">SUBJECT</TableHead>
              <TableHead className="font-bold text-gray-700 py-4 text-sm uppercase tracking-wide text-center">TEACHER</TableHead>
              <TableHead className="font-bold text-gray-700 py-4 text-sm uppercase tracking-wide text-center">SCHEDULE</TableHead>
              <TableHead className="font-bold text-gray-700 py-4 text-sm uppercase tracking-wide text-center">LEVEL</TableHead>
              <TableHead className="font-bold text-gray-700 py-4 text-sm uppercase tracking-wide text-center">STUDENTS</TableHead>
              <TableHead className="font-bold text-gray-700 py-4 text-sm uppercase tracking-wide text-center">ACTIONS</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredClasses.map((class_: any, index: number) => {
              const studentsToDisplay = getStudentsToDisplay(class_)
              
              return (
                <TableRow 
                  key={class_.id} 
                  className={`hover:bg-blue-50/50 transition-all duration-200 cursor-pointer ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50/30"
                  }`}
                  onClick={() => handleViewDetails(class_.id)}
                >
                  <TableCell className="py-4 pl-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-[#25AAE1] to-[#1D8CB3] rounded-full flex items-center justify-center">
                        <BookOpen className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-800">{class_.name}</div>
                        <div className="text-gray-500 text-sm">ID: {class_.id}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="py-4 text-center">
                    {getSubjectBadge(class_.subject)}
                  </TableCell>
                  <TableCell className="py-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center">
                        <User className="h-4 w-4 text-white" />
                      </div>
                      <div className="text-sm">
                        <div className="font-medium text-gray-700">
                          {class_.teacher.first_name} {class_.teacher.last_name}
                        </div>
                        <div className="text-gray-500 text-xs">Teacher</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="py-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full flex items-center justify-center">
                        <Calendar className="h-4 w-4 text-white" />
                      </div>
                      <div className="text-sm">
                        <div className="font-medium text-gray-700">
                          {class_.day}
                        </div>
                        <div className="text-gray-500 text-xs">
                          {formatTime(class_.start_time)} - {formatTime(class_.end_time)}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="py-4 text-center">
                    {getLevelBadge(class_.level)}
                  </TableCell>
                  <TableCell className="py-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
                        <Users className="h-4 w-4 text-white" />
                      </div>
                      <div className="text-sm">
                        <div className="font-medium text-gray-700">
                          {studentsToDisplay.length} student{studentsToDisplay.length !== 1 ? 's' : ''}
                        </div>
                        <div className="text-gray-500 text-xs">
                          {studentsToDisplay.slice(0, 2).map((s: { first_name: any; last_name: any }) => `${s.first_name} ${s.last_name}`).join(', ')}
                          {studentsToDisplay.length > 2 && ` +${studentsToDisplay.length - 2}`}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="py-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-gradient-to-r from-[#25AAE1] to-[#1D8CB3] text-white border-0 hover:from-[#1D8CB3] hover:to-[#1453B8] transition-all duration-300"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewDetails(class_.id);
                        }}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Details
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0 hover:from-green-600 hover:to-green-700 transition-all duration-300"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleTeacherClick(`${class_.teacher.first_name} ${class_.teacher.last_name}`);
                        }}
                      >
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Message
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>

      {/* Send Message Dialog */}
      {selectedTeacher && (
        <SendMessageDialog
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedTeacher("");
          }}
          teacher={selectedTeacher}
        />
      )}

      {/* Class Details Dialog */}
      {selectedClassId && (
        <ClassDetailsDialog
          isOpen={isDetailsModalOpen}
          onClose={() => {
            setIsDetailsModalOpen(false);
            setSelectedClassId(null);
          }}
          classId={selectedClassId}
        />
      )}
    </div>
  )
}
