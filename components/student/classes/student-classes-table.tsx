"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { SendMessageDialog } from "./send-message-dialog"
import { getAllClasses } from "@/app/api/student/class/classController" 
import { CourseRead } from "@/app/api/student/class/classModel"
import { useRequestInfo } from "@/hooks/useRequestInfo"

export function StudentClassesTable() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedTeacherName, setSelectedTeacherName] = useState("")
  const [studentClasses, setStudentClasses] = useState<CourseRead[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null);
  const { accessToken } = useRequestInfo();
  
  useEffect(() => {
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
    
    if (accessToken) { // Optionnel mais recommandé : n'appelle fetchClasses que si un token (potentiellement non vide) est disponible initialement
      fetchClasses();
    }
  
  }, [accessToken]);

  const handleTeacherClick = (teacherData: string | { full_name: string } | null | undefined) => {
    const teacherName = typeof teacherData === 'object' && teacherData !== null && 'full_name' in teacherData
        ? teacherData.full_name
        : (typeof teacherData === 'string' ? teacherData : "");
    setSelectedTeacherName(teacherName);
    setIsModalOpen(true);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Loading classes...</span>
      </div>
    )
  }
  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="text-red-500 mb-2">⚠️ Error loading classes</div>
          <div className="text-gray-600 text-sm">{error}</div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full relative">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-b-2 border-gray-100">
              <TableHead className="font-semibold text-gray-700 py-4 text-left">CLASS</TableHead>
              <TableHead className="font-semibold text-gray-700 py-4 text-left">SUBJECT</TableHead>
              <TableHead className="font-semibold text-gray-700 py-4 text-left">TEACHER</TableHead>
              <TableHead className="font-semibold text-gray-700 py-4 text-left">SCHEDULE</TableHead>
              <TableHead className="font-semibold text-gray-700 py-4 text-left">STATUS</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {studentClasses.map((class_, index) => (
              <TableRow key={class_.id} className="hover:bg-gray-50 transition-colors border-b border-gray-100">
                <TableCell className="py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <div>
                      <div className="font-medium text-gray-900">{class_.name}</div>
                      <div className="text-sm text-gray-500">Room 204</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="py-4">
                  <div className="flex items-center gap-2">
                    <div className="px-2 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium">
                      {class_.subject_in_short || class_.subject_in_all_letter}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="py-4">
                  {class_.teacher ? (
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-gray-600">
                          {class_.teacher?.full_name ? class_.teacher.full_name.split(' ').map((n: string) => n[0]).join('') : "N"}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">
                          {class_.teacher?.full_name || "N/A"}
                        </div>
                        <button 
                          onClick={() => handleTeacherClick(class_.teacher)}
                          className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
                        >
                          <MessageIcon />
                          Send Message
                        </button>
                      </div>
                    </div>
                  ) : (
                    <span className="text-gray-400">No teacher assigned</span>
                  )}
                </TableCell>
                <TableCell className="py-4">
                  <div className="space-y-1">
                    {class_.hours_and_dates_of_course_schedule &&
                     typeof class_.hours_and_dates_of_course_schedule === 'object' &&
                     Object.keys(class_.hours_and_dates_of_course_schedule).length > 0 ? (
                       Object.entries(class_.hours_and_dates_of_course_schedule).map(([day, schedules], dayIndex) => (
                         Array.isArray(schedules) && schedules.length > 0 ? (
                           schedules.map((schedule, scheduleIndex) => (
                             <div key={`${dayIndex}-${scheduleIndex}`} className="flex items-center gap-2 text-sm">
                               <div className="px-2 py-1 bg-gray-100 rounded text-xs font-medium">{day}</div>
                               <span className="text-gray-600">{schedule.start_time} - {schedule.end_time}</span>
                             </div>
                           ))
                         ) : (
                           <div key={`${dayIndex}-empty`} className="text-sm text-gray-400">{day}: No schedule</div>
                         )
                       ))
                     ) : (
                       <span className="text-gray-400 text-sm">No schedule available</span>
                     )}
                  </div>
                </TableCell>
                <TableCell className="py-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm font-medium text-green-700">Active</span>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <SendMessageDialog isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} teacher={selectedTeacherName || ""} />

      {isModalOpen && <div className="absolute inset-0 bg-white/50 backdrop-blur-sm" />}
    </div>
  )
}

function MessageIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="text-current"
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

