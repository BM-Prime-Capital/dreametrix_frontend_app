"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useParentClassDetails } from "@/hooks/useParentClasses"
import { useRequestInfo } from "@/hooks/useRequestInfo"
import { 
  Clock, 
  Users, 
  BookOpen, 
  Calendar, 
  User, 
  Mail, 
  Phone,
  Loader2,
  AlertCircle
} from "lucide-react"

interface ClassDetailsDialogProps {
  isOpen: boolean
  onClose: () => void
  classId: number | null
}

export function ClassDetailsDialog({ isOpen, onClose, classId }: ClassDetailsDialogProps) {
  const { accessToken, refreshToken } = useRequestInfo()
  const [isLoading, setIsLoading] = useState(false)

  const { classDetails, loading, error, refreshDetails } = useParentClassDetails({
    classId: classId || 0,
    accessToken,
    refreshToken
  })

  useEffect(() => {
    if (isOpen && classId) {
      refreshDetails()
    }
  }, [isOpen, classId, refreshDetails])

  const handleClose = () => {
    onClose()
  }

  if (!classId) return null

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
                     <DialogTitle className="flex items-center gap-2">
             <BookOpen className="w-5 h-5 text-blue-500" />
             Class Details
           </DialogTitle>
           <DialogDescription>
             Detailed information about the class and its participants
           </DialogDescription>
        </DialogHeader>

        {loading && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
                         <span className="ml-2">Loading details...</span>
          </div>
        )}

        {error && (
          <div className="flex items-center justify-center py-8 text-red-500">
            <AlertCircle className="w-6 h-6 mr-2" />
                         <span>Error: {error}</span>
          </div>
        )}

                 {classDetails && !loading && (
           <div className="space-y-6">
             {/* Informations générales */}
             <Card className="border-0 shadow-sm">
               <CardHeader className="pb-3">
                                    <CardTitle className="flex items-center gap-2 text-lg">
                     <BookOpen className="w-5 h-5 text-blue-500" />
                     General Information
                   </CardTitle>
               </CardHeader>
               <CardContent className="space-y-4">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div>
                     <label className="text-sm font-medium text-gray-500 mb-1 block">Class Name</label>
                     <p className="text-lg font-semibold text-gray-900">{classDetails.name}</p>
                   </div>
                   <div>
                     <label className="text-sm font-medium text-gray-500 mb-1 block">Subject</label>
                     <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                       {classDetails.subject}
                     </Badge>
                   </div>
                   <div>
                     <label className="text-sm font-medium text-gray-500 mb-1 block">Level</label>
                     <p className="text-lg font-semibold text-gray-900">Level {classDetails.level}</p>
                   </div>
                   <div>
                     <label className="text-sm font-medium text-gray-500 mb-1 block">Number of Students</label>
                     <p className="text-lg font-semibold text-gray-900">{classDetails.students.length}</p>
                   </div>
                 </div>
                 
                 {classDetails.description && (
                   <div>
                     <label className="text-sm font-medium text-gray-500 mb-1 block">Description</label>
                     <p className="text-gray-700 mt-1 bg-gray-50 p-3 rounded-lg">{classDetails.description}</p>
                   </div>
                 )}
               </CardContent>
             </Card>

                         {/* Informations sur l'enseignant */}
             <Card className="border-0 shadow-sm">
               <CardHeader className="pb-3">
                                    <CardTitle className="flex items-center gap-2 text-lg">
                     <User className="w-5 h-5 text-green-500" />
                     Teacher
                   </CardTitle>
               </CardHeader>
               <CardContent>
                 <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                   <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-white text-xl font-medium shadow-sm">
                     {classDetails.teacher.first_name?.charAt(0) || 'P'}{classDetails.teacher.last_name?.charAt(0) || ''}
                   </div>
                   <div className="flex-1">
                     <h3 className="text-lg font-semibold text-gray-900">
                       {classDetails.teacher.first_name || 'Teacher'} {classDetails.teacher.last_name || ''}
                     </h3>
                     <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                       <div className="flex items-center gap-1">
                         <Mail className="w-4 h-4" />
                         {classDetails.teacher.email || 'Email not available'}
                       </div>
                     </div>
                   </div>
                   <Button variant="outline" size="sm" className="border-gray-300 hover:bg-gray-50">
                     Contact
                   </Button>
                 </div>
               </CardContent>
             </Card>

                         {/* Horaires */}
             <Card className="border-0 shadow-sm">
               <CardHeader className="pb-3">
                                    <CardTitle className="flex items-center gap-2 text-lg">
                     <Clock className="w-5 h-5 text-orange-500" />
                     Schedule
                   </CardTitle>
               </CardHeader>
               <CardContent>
                 <div className="space-y-2">
                   {classDetails.schedule.map((schedule, index) => (
                     <div key={index} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                       <Calendar className="w-4 h-4 text-orange-500" />
                       <span className="font-medium">{schedule.day}</span>
                       <span className="text-gray-600">at {schedule.time}</span>
                     </div>
                   ))}
                 </div>
               </CardContent>
             </Card>

                         {/* Liste des étudiants */}
             <Card className="border-0 shadow-sm">
               <CardHeader className="pb-3">
                                    <CardTitle className="flex items-center gap-2 text-lg">
                     <Users className="w-5 h-5 text-blue-500" />
                     Students ({classDetails.students.length})
                   </CardTitle>
               </CardHeader>
               <CardContent>
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                   {classDetails.students.map((student) => (
                     <div key={student.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                       <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                         {student.first_name?.charAt(0) || 'S'}{student.last_name?.charAt(0) || ''}
                       </div>
                       <div>
                         <p className="font-medium">
                           {student.first_name || 'Student'} {student.last_name || ''}
                         </p>
                                                    <p className="text-sm text-gray-600">{student.email || 'Email not available'}</p>
                       </div>
                     </div>
                   ))}
                 </div>
               </CardContent>
             </Card>

                         {/* Assessment Weights (si disponibles) */}
             {classDetails.assessment_weights && Object.keys(classDetails.assessment_weights).length > 0 && (
               <Card className="border-0 shadow-sm">
                 <CardHeader className="pb-3">
                   <CardTitle className="flex items-center gap-2 text-lg">
                     <BookOpen className="w-5 h-5 text-indigo-500" />
                     Assessment Weights
                   </CardTitle>
                 </CardHeader>
                 <CardContent>
                   <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                     {Object.entries(classDetails.assessment_weights).map(([type, weight]) => (
                       <div key={type} className="text-center p-3 bg-indigo-50 rounded-lg">
                         <p className="text-lg font-bold text-indigo-600">{weight}%</p>
                         <p className="text-sm text-gray-600 capitalize">{type}</p>
                       </div>
                     ))}
                   </div>
                 </CardContent>
               </Card>
             )}

             {/* Statistiques (si disponibles) */}
             {classDetails.statistics && (
               <Card className="border-0 shadow-sm">
                 <CardHeader className="pb-3">
                   <CardTitle className="flex items-center gap-2 text-lg">
                     <BookOpen className="w-5 h-5 text-blue-500" />
                     Statistics
                   </CardTitle>
                 </CardHeader>
                 <CardContent>
                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                     <div className="text-center p-4 bg-blue-50 rounded-lg">
                       <p className="text-2xl font-bold text-blue-600">{classDetails.statistics.total_students}</p>
                       <p className="text-sm text-gray-600">Total students</p>
                     </div>
                     {classDetails.statistics.total_submissions && (
                       <div className="text-center p-4 bg-purple-50 rounded-lg">
                         <p className="text-2xl font-bold text-purple-600">{classDetails.statistics.total_submissions}</p>
                         <p className="text-sm text-gray-600">Total submissions</p>
                       </div>
                     )}
                     {classDetails.statistics.average_grade && (
                       <div className="text-center p-4 bg-green-50 rounded-lg">
                         <p className="text-2xl font-bold text-green-600">{classDetails.statistics.average_grade}%</p>
                         <p className="text-sm text-gray-600">Average grade</p>
                       </div>
                     )}
                     {classDetails.statistics.graded_submissions && (
                       <div className="text-center p-4 bg-orange-50 rounded-lg">
                         <p className="text-2xl font-bold text-orange-600">{classDetails.statistics.graded_submissions}</p>
                         <p className="text-sm text-gray-600">Graded submissions</p>
                       </div>
                     )}
                   </div>
                 </CardContent>
               </Card>
             )}
          </div>
        )}

        <div className="flex justify-end gap-2 pt-4">
                     <Button variant="outline" onClick={handleClose}>
             Close
           </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
} 