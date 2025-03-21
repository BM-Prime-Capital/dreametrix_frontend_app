"use client"

import { Button } from "@/components/ui/button"
import { useStudents } from "@/hooks/SchoolAdmin/use-students"
import { Loader } from "@/components/ui/loader"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

export function StudentsTable() {
  const { students, isLoading, error } = useStudents()

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="flex flex-col items-center">
          <Loader className="text-blue-600" />
          <p className="mt-4 text-sm text-slate-500">Loading Students...</p>
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

  if (students.length === 0) {
    return <div className="text-center p-8 text-slate-500">No students found !! </div>
  }

  // Helper function to convert grade number to display format
  const formatGrade = (grade: number) => {
    return `Grade ${grade}`
  }

  // For demo purposes, we'll alternate between "Paid" and "Debt" status
  // In a real app, this would come from the API
  const getPaymentStatus = (id: number) => {
    return id % 2 === 0 ? "Paid" : "Debt"
  }

  // For demo purposes, we'll alternate between "Morning" and "Afternoon" shifts
  // In a real app, this would come from the API
  const getShift = (id: number) => {
    return id % 2 === 0 ? "Morning" : "Afternoon"
  }

  return (
    <div className="w-full overflow-auto rounded-lg shadow-sm bg-white">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-50 border-y border-gray-200">
            <th className="py-5 px-6 text-left text-gray-600 font-medium text-base">STUDENT</th>
            <th className="py-5 px-6 text-left text-gray-600 font-medium text-base">STATUS</th>
            <th className="py-5 px-6 text-left text-gray-600 font-medium text-base">GRADE</th>
            <th className="py-5 px-6 text-left text-gray-600 font-medium text-base">SHIFT</th>
            <th className="py-5 px-6 text-left text-gray-600 font-normal text-base">VIEW MORE</th>
            <th className="py-5 px-6 text-left text-gray-600 font-normal text-base">EDIT</th>
            <th className="py-5 px-6 text-left text-gray-600 font-normal text-base">DELETE</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student, index) => (
            <tr
              key={student.id}
              className={`
                ${index % 2 === 0 ? "bg-[#EBF5FA]" : "bg-white"}
                hover:bg-[#EBF5FA]/80 transition-colors
              `}
            >
              <td className="py-5 px-6 font-normal text-gray-700">
                {student.user.first_name} {student.user.last_name}
              </td>
              <td className="py-5 px-6 text-gray-600 font-normal">
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    getPaymentStatus(student.id) === "Paid" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                  }`}
                >
                  {getPaymentStatus(student.id)}
                </span>
              </td>
              <td className="py-5 px-6 text-gray-600 font-normal">{formatGrade(student.grade)}</td>
              <td className="py-5 px-6 text-gray-600 font-normal">{getShift(student.id)}</td>
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

