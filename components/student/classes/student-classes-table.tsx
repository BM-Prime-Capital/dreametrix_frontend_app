"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { SendMessageDialog } from "./send-message-dialog"
import { getAllClasses } from "@/app/api/student/class/classController" 
import { CourseRead } from "@/app/api/student/class/classModel"
import { useRequestInfo } from "@/hooks/useRequestInfo"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { AlertCircle, RefreshCw, BookOpen } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

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
  const { accessToken } = useRequestInfo();
  
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
          <TableHead className="font-bold text-gray-700 py-4">DAY & TIME</TableHead>
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
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-8 w-8 rounded" />
              </div>
            </TableCell>
            <TableCell className="py-4">
              <div className="space-y-1">
                <Skeleton className="h-3 w-36" />
                <Skeleton className="h-3 w-28" />
              </div>
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
            <TableHead className="font-bold text-gray-700 py-4">DAY & TIME</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredClasses.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-8">
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
                    {/* <MessageIcon /> */}
                  </div>
                ) : (
                  "N/A"
                )}
              </TableCell>
              <TableCell className="text-gray-500">
                <div className="flex flex-col">
                  {class_.hours_and_dates_of_course_schedule &&
                   typeof class_.hours_and_dates_of_course_schedule === 'object' &&
                   Object.keys(class_.hours_and_dates_of_course_schedule).length > 0 ? (
                     // Itérer sur les clés (les jours) de l'objet
                     Object.entries(class_.hours_and_dates_of_course_schedule).map(([day, schedules], dayIndex) => (
                       // Pour chaque jour, itérer sur le tableau des horaires
                       Array.isArray(schedules) && schedules.length > 0 ? (
                         schedules.map((schedule, scheduleIndex) => (
                           <span key={`${dayIndex}-${scheduleIndex}`}>
                             {day}: 
                             {`${schedule.date} ${schedule.start_time} - ${schedule.end_time}`}
                           </span>
                         ))
                       ) : (
                         // Gérer le cas où le tableau d'horaires pour un jour est vide ou non un tableau
                         <span key={`${dayIndex}-empty`}>{day}: Pas d&apos;horaire</span>
                       )
                     ))
                   ) : (
                     // Afficher "N/A" si l'objet est null, vide, ou pas un objet
                     <span>N/A</span>
                   )}
                </div>
              </TableCell>
            </TableRow>
          )))}
        </TableBody>
      </Table>

      {/* <SendMessageDialog isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} teacher={selectedTeacherName || ""} /> */}

      {isModalOpen && <div className="absolute inset-0 bg-white/50 backdrop-blur-sm" />}
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

