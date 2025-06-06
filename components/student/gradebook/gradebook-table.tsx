"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ExamsDialog } from "./exams-dialog"
import { ExamDetailDialog } from "./exam-detail-dialog"
import { getGradebookByClassId } from "@/app/api/student/gradebook/gradebook.controller"
import { StudentGrade } from "@/app/api/student/gradebook/gradebook.model"
import { useRequestInfo } from "@/hooks/useRequestInfo"
import { getAuthenticatedStudent } from "@/app/api/student/student.controller"
import { Student } from "@/app/api/student/student.model"
import { getClassById } from "@/app/api/student/class/classController"

// Define proper types for our data
interface Exam {
  id: number
  score: string
}

interface ClassData {
  id: number
  class: string
  average: string
  exams: Exam[]
  tests: number
  assignments: number
  teacher: string
  trend: "up" | "down"
}

export function GradebookTable() {
  const [studentGrades, setStudentGrades] = useState<StudentGrade[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [authenticatedStudent, setAuthenticatedStudent] = useState<Student | null>(null);
  const [className, setClassName] = useState<string | null>(null);
  const [teacherName, setTeacherName] = useState<string | null>(null); // New state for teacher name
  const [isExamsModalOpen, setIsExamsModalOpen] = useState(false)
  const [isExamDetailModalOpen, setIsExamDetailModalOpen] = useState(false)
  const [selectedClass, setSelectedClass] = useState<ClassData | null>(null)
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null)
  const { accessToken } = useRequestInfo();


  const handleExamClick = (exam: Exam) => {
    setSelectedExam(exam)
    setIsExamDetailModalOpen(true)
  }

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
  
      if (!accessToken) {
        setError("Authentification requise.");
        setLoading(false);
        setStudentGrades([]);
        return;
      }

      try {
        // 1. Get authenticated student info
        console.log("Fetching authenticated student info...");
        const studentInfo = await getAuthenticatedStudent(accessToken);
        setAuthenticatedStudent(studentInfo);
        console.log("Authenticated student info:", studentInfo);

        if (studentInfo && studentInfo.enrolled_courses && studentInfo.enrolled_courses.length > 0) {
          // Assuming the student is enrolled in only one class for now, or we take the first one
          const classId = studentInfo.enrolled_courses[0];
          console.log("Using class ID for gradebook fetch:", classId);

          // Fetch class details to get class name and teacher name
          try {
            const classRes = await getClassById(classId, accessToken);
            if (classRes && classRes.data) {
              if (classRes.data.name) {
                setClassName(classRes.data.name);
              } else {
                setClassName("Nom inconnu");
                console.warn(`Class name not found in class data for ID ${classId}:`, classRes.data);
              }
              if (classRes.data.teacher && classRes.data.teacher.full_name) { // Assuming teacher info is nested and has full_name
                setTeacherName(classRes.data.teacher.full_name);
              } else {
                setTeacherName("Prof inconnu");
                console.warn(`Teacher info not found in class data for ID ${classId}:`, classRes.data);
              }
            } else {
              setClassName("Erreur chargement nom");
              setTeacherName("Erreur chargement prof");
              console.error(`Failed to load class data for ID ${classId}:`, classRes);
            }
          } catch (classError) {
            setClassName("Erreur chargement nom");
            setTeacherName("Erreur chargement prof");
            console.error(`Error fetching class name and teacher for ID ${classId}:`, classError);
          }

          // 2. Get gradebook for the student's class
          console.log("Fetching gradebook for class ID:", classId);
          const grades = await getGradebookByClassId(classId, accessToken);
          console.log("Received gradebook data:", grades);

          // 3. Filter grades for the authenticated student
          console.log("Filtering gradebook for student ID:", studentInfo.id);
          const currentStudentGrade = grades.find(grade => {
            console.log(`Checking grade entry for student ID ${grade.student_id} against authenticated student ID ${studentInfo.id}`);
            return grade.student_id === studentInfo.id;
          });

          console.log("Result of filtering (currentStudentGrade):", currentStudentGrade);

          if (currentStudentGrade) {
              // Wrap the single student grade in an array to maintain expected state structure
              setStudentGrades([currentStudentGrade]);
              console.log("StudentGrades state updated with:", [currentStudentGrade]);
          } else {
              setStudentGrades([]);
              console.warn("Current student's grade not found in the gradebook data.", studentInfo);
          }

        } else {
          setStudentGrades([]);
          console.warn("Authenticated student or enrolled courses not found.", studentInfo);
        }
      } catch (err) {
        setError('Failed to load data.');
        console.error(err);
        setStudentGrades([]);
      } finally {
        setLoading(false);
      }
    };

    if (accessToken) { 
      fetchData();
    }

  }, [accessToken]); // Re-run effect when accessToken changes

  // Now currentStudentGrade is managed within the useEffect and stored in studentGrades state
  const currentStudentGradeToDisplay = studentGrades.length > 0 ? studentGrades[0] : null;

  if (loading) {
    return <div>Loading gradebook...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!currentStudentGradeToDisplay) {
      return <div>No grade data available for this class or student.</div>;
  }

  return (
    <div className="w-full relative">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent border-b">
            <TableHead className="font-bold text-gray-700 py-4">CLASS</TableHead>
            <TableHead className="font-bold text-gray-700 py-4">AVERAGE</TableHead>
            <TableHead className="font-bold text-gray-700 py-4">EXAM</TableHead>
            <TableHead className="font-bold text-gray-700 py-4">TESTS</TableHead>
            <TableHead className="font-bold text-gray-700 py-4">ASSIGNMENTS</TableHead>
            <TableHead className="font-bold text-gray-700 py-4">TEACHER</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
            <TableRow key={currentStudentGradeToDisplay.student_id} className="bg-[#EDF6FA]">
              <TableCell className="font-medium text-gray-500">{className || 'Chargement nom...'}</TableCell>
              <TableCell className="text-gray-500">{currentStudentGradeToDisplay.average_grade}</TableCell>
              <TableCell>
                <button
                  className="text-[#25AAE1] hover:underline flex items-center"> View </button>
              </TableCell>
              <TableCell>
                <button className="text-[#25AAE1] hover:underline flex items-center"> View </button>
              </TableCell>
              <TableCell>
                <button className="text-[#25AAE1] hover:underline flex items-center"> View </button>
              </TableCell>
              <TableCell className="text-gray-500">
                <div className="flex items-center">
                  {teacherName || 'Chargement prof...'} <MessageIcon />
                </div>
              </TableCell>
            </TableRow>
        </TableBody>
      </Table>

      {selectedClass && (
        <>
          <ExamsDialog
            isOpen={isExamsModalOpen}
            onClose={() => setIsExamsModalOpen(false)}
            classData={selectedClass}
            onExamClick={handleExamClick}
          />

          {selectedExam && (
            <ExamDetailDialog
              isOpen={isExamDetailModalOpen}
              onClose={() => setIsExamDetailModalOpen(false)}
              exam={selectedExam}
              exams={selectedClass.exams}
            />
          )}
        </>
      )}

      {(isExamsModalOpen || isExamDetailModalOpen) && <div className="absolute inset-0 bg-white/50 backdrop-blur-sm" />}
    </div>
  )
}

function TrendIcon({ trend }: { trend: "up" | "down" }) {
  if (trend === "up") {
    return (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-gray-500 ml-1"
      >
        <path
          d="M12 19V5M12 5L5 12M12 5L19 12"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    )
  }

  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="text-red-500 ml-1"
    >
      <path
        d="M12 5V19M12 19L5 12M12 19L19 12"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
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

