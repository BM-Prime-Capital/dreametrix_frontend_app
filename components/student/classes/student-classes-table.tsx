"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { SendMessageDialog } from "./send-message-dialog"
import { getAllClasses } from "@/app/api/student/class/classController" 
import { CourseRead, Student } from "@/app/api/student/class/classModel"
import { useRequestInfo } from "@/hooks/useRequestInfo"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, RefreshCw, BookOpen, Users, Calendar, Info, MoreHorizontal, Clock } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface StudentClassesTableProps {
  onStatsUpdate?: (stats: {
    totalClasses: number;
    todayClasses: number;
    totalTeachers: number;
    activeSubjects: number;
  }) => void;
  selectedSubject?: string;
  isFilterLoading?: boolean;
}

export function StudentClassesTable({ onStatsUpdate, selectedSubject = "all-subjects", isFilterLoading = false }: StudentClassesTableProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedTeacherName, setSelectedTeacherName] = useState("")
  const [studentClasses, setStudentClasses] = useState<CourseRead[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null);
  const { tenantDomain,accessToken } = useRequestInfo();
  
  // Modal states
  const [studentsModalOpen, setStudentsModalOpen] = useState(false);
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState<CourseRead | null>(null);
  
  const fetchClasses = async () => {
    setLoading(true);
    setError(null);

    if (!accessToken) {
      setError("Authentification requise.");
      setLoading(false);
      setStudentClasses([]);
      return;
    }
    try {
      const res = await getAllClasses(accessToken); // Passe le token

      if (res && res.data && Array.isArray(res.data.results)) {
        setStudentClasses(res.data.results);
        
        // Calculate stats
        const classes = res.data.results;
        const uniqueTeachers = new Set();
        const uniqueSubjects = new Set();
        let todayClassesCount = 0;
        const today = new Date().toLocaleDateString();
        
        classes.forEach((class_: CourseRead) => {
          if (class_.teacher?.full_name) {
            uniqueTeachers.add(class_.teacher?.full_name);
          }
          if (class_.subject_in_all_letter) {
            uniqueSubjects.add(class_.subject_in_all_letter);
          }
          
          // Check if class is today
          if (class_.hours_and_dates_of_course_schedule && 
              typeof class_.hours_and_dates_of_course_schedule === 'object') {
            Object.entries(class_.hours_and_dates_of_course_schedule).forEach(([day, schedules]) => {
              if (Array.isArray(schedules)) {
                schedules.forEach((schedule) => {
                  if (schedule.date === today) {
                    todayClassesCount++;
                  }
                });
              }
            });
          }
        });
        
        if (onStatsUpdate) {
          onStatsUpdate({
            totalClasses: classes.length,
            todayClasses: todayClassesCount,
            totalTeachers: uniqueTeachers.size,
            activeSubjects: uniqueSubjects.size
          });
        }
      } else {
        setStudentClasses([]);
        setError("Format de données inattendu reçu de l'API.");
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
      setError(`Échec du chargement des classes: ${errorMessage}`);
      setStudentClasses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (accessToken) {
      fetchClasses();
    }
  }, [accessToken]);

  const handleTeacherClick = (teacherData: string | { full_name: string } | null | undefined) => {
    const teacherName = typeof teacherData === 'object' && teacherData !== null && 'full_name' in teacherData
        ? teacherData.full_name
        : (typeof teacherData === 'string' ? teacherData : "");
    setSelectedTeacherName(teacherName);
    // setIsModalOpen(true);
  };

  const handleRetry = () => {
    if (accessToken) {
      fetchClasses();
    }
  };

  // Skeleton Loading Component
  const TableSkeleton = () => (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-transparent border-b">
          <TableHead className="font-bold text-gray-700 py-4">CLASS</TableHead>
          <TableHead className="font-bold text-gray-700 py-4">SUBJECT</TableHead>
          <TableHead className="font-bold text-gray-700 py-4">TEACHER</TableHead>
          <TableHead className="font-bold text-gray-700 py-4">GRADE</TableHead>
          <TableHead className="font-bold text-gray-700 py-4">STUDENTS</TableHead>
          <TableHead className="font-bold text-gray-700 py-4">ACTIONS</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {[...Array(5)].map((_, index) => (
          <TableRow key={index} className={index % 2 === 0 ? "bg-[#EDF6FA]" : ""}>
            <TableCell className="py-4">
              <Skeleton className="h-4 w-32" />
            </TableCell>
            <TableCell className="py-4">
              <Skeleton className="h-4 w-24" />
            </TableCell>
            <TableCell className="py-4">
              <Skeleton className="h-4 w-28" />
            </TableCell>
            <TableCell className="py-4">
              <Skeleton className="h-6 w-16 rounded-full" />
            </TableCell>
            <TableCell className="py-4">
              <div className="flex items-center gap-1">
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-4 w-6" />
              </div>
            </TableCell>
            <TableCell className="py-4">
              <Skeleton className="h-8 w-8 rounded" />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  // Filter classes based on selected subject
  const filteredClasses = selectedSubject === "all-subjects" 
    ? studentClasses 
    : studentClasses.filter(class_ => 
        class_.subject_in_all_letter?.toLowerCase().includes(selectedSubject.toLowerCase())
      );

  if (loading || isFilterLoading) {
    return (
      <div className="w-full relative">
        <TableSkeleton />
        {isFilterLoading && (
          <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] flex items-center justify-center">
            <div className="bg-white p-4 rounded-xl shadow-lg flex items-center gap-3">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#25AAE1]"></div>
              <span className="text-[#25AAE1] font-medium">Filtering classes...</span>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full relative">
        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            <div className="flex items-center justify-between">
              <span>{error}</span>
              <Button 
                onClick={handleRetry}
                variant="outline" 
                size="sm"
                className="ml-4 border-red-300 text-red-700 hover:bg-red-100"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Réessayer
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="w-full relative">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent border-b">
            <TableHead className="font-bold text-gray-700 py-4">CLASS</TableHead>
            <TableHead className="font-bold text-gray-700 py-4">SUBJECT</TableHead>
            <TableHead className="font-bold text-gray-700 py-4">TEACHER</TableHead>
            <TableHead className="font-bold text-gray-700 py-4">GRADE</TableHead>
            <TableHead className="font-bold text-gray-700 py-4">STUDENTS</TableHead>
            <TableHead className="font-bold text-gray-700 py-4">ACTIONS</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredClasses.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8">
                <div className="flex flex-col items-center gap-2 text-gray-500">
                  <BookOpen className="h-8 w-8 text-gray-300" />
                  <p className="font-medium">No classes found</p>
                  <p className="text-sm">
                    {selectedSubject === "all-subjects" 
                      ? "You don't have any classes enrolled yet." 
                      : `No classes found for "${selectedSubject}".`
                    }
                  </p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            filteredClasses.map((class_, index) => (
            <TableRow key={class_.id} className={index % 2 === 0 ? "bg-[#EDF6FA]" : ""}>
              <TableCell className="font-medium text-gray-500">{class_.name}</TableCell>
              <TableCell className="text-gray-500">{class_.subject_in_short || class_.subject_in_all_letter}</TableCell>
              <TableCell className="text-gray-500">
                {class_.teacher ? (
                  <div className="flex items-center cursor-pointer" onClick={() => handleTeacherClick(class_.teacher)}>
                    {typeof class_.teacher === 'object' && class_.teacher !== null && 'full_name' in class_.teacher
                        ? class_.teacher.full_name
                        : (typeof class_.teacher === 'string' ? class_.teacher : "N/A")}
                  </div>
                ) : (
                  "N/A"
                )}
              </TableCell>
              <TableCell className="text-gray-500">
                {class_.grade ? (
                  <Badge variant="outline" className="font-medium">
                    {class_.grade}
                  </Badge>
                ) : (
                  "N/A"
                )}
              </TableCell>
              <TableCell className="text-gray-500">
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>{class_.students?.length || 0}</span>
                </div>
              </TableCell>
              <TableCell className="text-gray-500">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem 
                      onClick={() => {
                        setSelectedClass(class_);
                        setStudentsModalOpen(true);
                      }}
                    >
                      <Users className="mr-2 h-4 w-4" />
                      View Students
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => {
                        setSelectedClass(class_);
                        setScheduleModalOpen(true);
                      }}
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      View Schedule
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => {
                        setSelectedClass(class_);
                        setDetailsModalOpen(true);
                      }}
                    >
                      <Info className="mr-2 h-4 w-4" />
                      View Details
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          )))}
        </TableBody>
      </Table>

      {/* <SendMessageDialog isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} teacher={selectedTeacherName || ""} /> */}

      {/* Students Modal */}
      <Dialog open={studentsModalOpen} onOpenChange={setStudentsModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Students in {selectedClass?.name}
            </DialogTitle>
            <DialogDescription>
              {selectedClass?.students?.length || 0} students enrolled
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-64 overflow-y-auto">
            {selectedClass?.students && selectedClass.students.length > 0 ? (
              <div className="space-y-2">
                {selectedClass.students.map((student, index) => (
                  <div key={student.id || index} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-sm font-medium text-blue-600">
                        {student.full_name?.charAt(0) || 'S'}
                      </span>
                    </div>
                    <span className="text-gray-700">{student.full_name || 'Unknown Student'}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Users className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                <p>No students enrolled</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Schedule Modal */}
      <Dialog open={scheduleModalOpen} onOpenChange={setScheduleModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Schedule for {selectedClass?.name}
            </DialogTitle>
            <DialogDescription>
              Class schedule and timing details
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {selectedClass?.hours_and_dates_of_course_schedule &&
             typeof selectedClass.hours_and_dates_of_course_schedule === 'object' &&
             Object.keys(selectedClass.hours_and_dates_of_course_schedule).length > 0 ? (
              Object.entries(selectedClass.hours_and_dates_of_course_schedule).map(([day, schedules], dayIndex) => (
                <div key={dayIndex} className="border rounded-lg p-4">
                  <h3 className="font-semibold text-gray-800 mb-2 capitalize">{day}</h3>
                  {Array.isArray(schedules) && schedules.length > 0 ? (
                    <div className="space-y-2">
                      {schedules.map((schedule, scheduleIndex) => (
                        <div key={scheduleIndex} className="bg-blue-50 rounded p-3 border-l-4 border-blue-400">
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className="h-4 w-4 text-blue-600" />
                            <span className="font-medium">{schedule.date}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm mt-1">
                            <Clock className="h-4 w-4 text-blue-600" />
                            <span>{schedule.start_time} - {schedule.end_time}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">No schedule available for this day</p>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Calendar className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                <p>No schedule information available</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Details Modal */}
      <Dialog open={detailsModalOpen} onOpenChange={setDetailsModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Info className="h-5 w-5" />
              {selectedClass?.name} Details
            </DialogTitle>
            <DialogDescription>
              Complete class information
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {selectedClass && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-500">Subject</label>
                    <p className="text-gray-800">{selectedClass.subject_in_all_letter || 'N/A'}</p>
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-500">Grade Level</label>
                    <p className="text-gray-800">
                      {selectedClass.grade ? (
                        <Badge variant="outline">{selectedClass.grade}</Badge>
                      ) : (
                        'N/A'
                      )}
                    </p>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-500">Teacher</label>
                  <p className="text-gray-800">
                    {selectedClass.teacher && typeof selectedClass.teacher === 'object' 
                      ? selectedClass.teacher.full_name 
                      : selectedClass.teacher || 'N/A'}
                  </p>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-500">Students Enrolled</label>
                  <p className="text-gray-800">{selectedClass.students?.length || 0} students</p>
                </div>

                {selectedClass.description && (
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-500">Description</label>
                    <p className="text-gray-700 text-sm bg-gray-50 p-3 rounded-lg">{selectedClass.description}</p>
                  </div>
                )}

                {selectedClass.created_at && (
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-500">Created</label>
                    <p className="text-gray-600 text-sm">
                      {new Date(selectedClass.created_at).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {isModalOpen && <div className="absolute inset-0 bg-white/50 backdrop-blur-sm" />}
    </div>
  )
}
