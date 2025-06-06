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
  const { accessToken, tenantDomain, refreshToken } = useRequestInfo();
  
  console.log("Token::::::", accessToken);
  console.log("État de chargement:", loading);
  console.log("Classes actuelles (avant rendu):", studentClasses);

  useEffect(() => {
    const fetchClasses = async () => {
      setLoading(true);
      setError(null);
  
      if (!accessToken) {
        console.error("Aucun token d'authentification n'est disponible (accessToken est vide ou null).");
        setError("Authentification requise.");
        setLoading(false);
        setStudentClasses([]);
        return;
      }
      console.log("Token2::::::", accessToken);
      try {
        const res = await getAllClasses(accessToken); // Passe le token
  
        console.log("Réponse complète de getAllClasses:", res);
  
        if (res && res.data && Array.isArray(res.data.results)) {
          setStudentClasses(res.data.results);
        } else {
          console.warn("La réponse de l'API n'a pas la structure attendue (res.data.results n'est pas un tableau):", res);
          setStudentClasses([]);
          setError("Format de données inattendu reçu de l'API.");
        }
      } catch (err: any) {
        console.error("Erreur lors de la récupération des classes:", err);
        setError(`Échec du chargement des classes: ${err.message || 'Erreur inconnue'}`);
        setStudentClasses([]);
      } finally {
        setLoading(false);
      }
    };
    
    if (accessToken) { // Optionnel mais recommandé : n'appelle fetchClasses que si un token (potentiellement non vide) est disponible initialement
      fetchClasses();
    }
  
  }, [accessToken]);

  const handleTeacherClick = (teacherData: any) => {
    const teacherName = typeof teacherData === 'object' && teacherData !== null && 'full_name' in teacherData
        ? teacherData.full_name
        : (typeof teacherData === 'string' ? teacherData : "");
    setSelectedTeacherName(teacherName);
    setIsModalOpen(true);
  }

  if (loading) {
    return <div>Chargement...</div>
  }
  if (error) {
    return <div>Erreur : {error}</div>
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
          {studentClasses.map((class_, index) => (
            <TableRow key={class_.id} className={index % 2 === 0 ? "bg-[#EDF6FA]" : ""}>
              <TableCell className="font-medium text-gray-500">{class_.name}</TableCell>
              <TableCell className="text-gray-500">{class_.subject_in_short || class_.subject_in_all_letter}</TableCell>
              <TableCell className="text-gray-500">
                {class_.teacher ? (
                  <div className="flex items-center cursor-pointer" onClick={() => handleTeacherClick(class_.teacher)}>
                    {typeof class_.teacher === 'object' && class_.teacher !== null && 'full_name' in class_.teacher
                        ? class_.teacher.full_name
                        : (typeof class_.teacher === 'string' ? class_.teacher : "N/A")}
                    <MessageIcon />
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
                         <span key={`${dayIndex}-empty`}>{day}: Pas d'horaire</span>
                       )
                     ))
                   ) : (
                     // Afficher "N/A" si l'objet est null, vide, ou pas un objet
                     <span>N/A</span>
                   )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <SendMessageDialog isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} teacher={selectedTeacherName || ""} />

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

