"use client"

import { Button } from "@/components/ui/button"
import { useTeachers, type Teacher } from "@/hooks/SchoolAdmin/use-teachers"
import { Loader } from "@/components/ui/loader"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

export function TeachersTable() {
  const { teachers, isLoading, error } = useTeachers()

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="flex flex-col items-center">
          <Loader className="text-blue-600" />
          <p className="mt-4 text-sm text-slate-500">Loading Teachers... </p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive" className="my-4">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  if (teachers.length === 0) {
    return <div className="text-center p-8 text-slate-500">No teachers found !! </div>
  }

  // Fonction pour déterminer le shift basé sur l'ID (pour la démo)
  const getShiftFromId = (id: number): string => {
    return id % 2 === 0 ? "Afternoon" : "Morning"
  }

  // Fonction pour déterminer les matières basées sur le nom (pour la démo)
  const getSubjectsFromName = (firstName: string): string => {
    const subjects: Record<string, string> = {
      Samantha: "Science - Mathematics",
      Joe: "History - English",
      Parker: "Mathematics",
      Patrik: "Science",
      Alison: "English",
      Susan: "Geography - History",
      Jeffry: "Music",
    }

    return subjects[firstName] || "Subject"
  }

  // Fonction pour déterminer les niveaux basés sur l'ID (pour la démo)
  const getGradesFromId = (id: number): string => {
    const grades: Record<number, string> = {
      1: "Grade 5",
      2: "Grade 3 - 4 - 5",
      3: "Grade 6 - 7",
      4: "Grade 7",
      5: "Grade 5",
      6: "Grade 7 - 8 - 9",
      7: "Grade 3 - 4 - 5 - 6 - 7 - 8",
    }

    return grades[id] || `Grade ${id}`
  }

  return (
    <div className="w-full overflow-auto rounded-lg shadow-sm bg-white">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-50 border-y border-gray-200">
            <th className="py-5 px-6 text-left text-gray-600 font-medium text-base">TEACHER</th>
            <th className="py-5 px-6 text-left text-gray-600 font-medium text-base">SUBJECTS</th>
            <th className="py-5 px-6 text-left text-gray-600 font-medium text-base">GRADES</th>
            <th className="py-5 px-6 text-left text-gray-600 font-medium text-base">SHIFT</th>
            <th className="py-5 px-6 text-left text-gray-600 font-normal text-base">VIEW MORE</th>
            <th className="py-5 px-6 text-left text-gray-600 font-normal text-base">EDIT</th>
            <th className="py-5 px-6 text-left text-gray-600 font-normal text-base">DELETE</th>
          </tr>
        </thead>
        <tbody>
          {teachers.map((teacher: Teacher, index: number) => (
            <tr
              key={teacher.id}
              className={`
                ${index % 2 === 0 ? "bg-[#EBF5FA]" : "bg-white"}
                hover:bg-[#EBF5FA]/80 transition-colors
              `}
            >
              <td className="py-5 px-6 font-normal text-gray-700">
                {teacher.user.first_name} {teacher.user.last_name}
              </td>
              <td className="py-5 px-6 text-gray-600 font-normal">{getSubjectsFromName(teacher.user.first_name)}</td>
              <td className="py-5 px-6 text-gray-600 font-normal">{getGradesFromId(teacher.id)}</td>
              <td className="py-5 px-6 text-gray-600 font-normal">{getShiftFromId(teacher.id)}</td>
              <td className="py-5 px-6">
                <Button variant="ghost" size="sm" className="h-8 w-8 rounded-full p-0">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#25AAE1"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                </Button>
              </td>
              <td className="py-5 px-6">
                <Button variant="ghost" size="sm" className="h-8 w-8 rounded-full p-0">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#25AAE1"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                  </svg>
                </Button>
              </td>
              <td className="py-5 px-6">
                <Button variant="ghost" size="sm" className="h-8 w-8 rounded-full p-0">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#FF6B6B"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M3 6h18" />
                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                  </svg>
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

