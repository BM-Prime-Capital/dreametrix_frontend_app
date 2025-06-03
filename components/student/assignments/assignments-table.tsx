"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { FileIcon, FileTextIcon } from "lucide-react"
import { SubmitAssignmentDialog } from "./submit-assignment-dialog"
import { ViewAssignmentDialog } from "./view-assignment-dialog"
import { ViewSubmissionDialog } from "./view-submission-dialog"
import { getAssignments } from "@/app/api/student/assignment/assignment.controller"
import { getClassById } from "@/app/api/student/class/classController"
import { useRequestInfo } from "@/hooks/useRequestInfo"
import { Assignment } from "@/app/api/student/assignment/assignment.model"

export function AssignmentsTable() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [teacherNames, setTeacherNames] = useState<{[key: number]: string}>({});
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false)
  const [isViewAssignmentModalOpen, setIsViewAssignmentModalOpen] = useState(false)
  const [isViewSubmissionModalOpen, setIsViewSubmissionModalOpen] = useState(false)
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null)
  const { accessToken } = useRequestInfo();
  
  useEffect(() => {
    const fetchAssignments = async () => {
      setLoading(true);
      setError(null);
  
      if (!accessToken) {
        setError("Authentification requise.");
        setLoading(false);
        setAssignments([]);
        return;
      }
      try {
        const res = await getAssignments(accessToken);

        if (res && res.data && Array.isArray(res.data.results)) {
          // Ensure the fetched data conforms to the Assignment interface
          const fetchedAssignments: Assignment[] = res.data.results.map((item: any) => ({
            id: item.id,
            name: item.name,
            file: item.file,
            due_date: item.due_date,
            weight: item.weight,
            kind: item.kind,
            published: item.published,
            created_at: item.created_at,
            updated_at: item.updated_at,
            published_at: item.published_at,
            course: item.course,
          })
        );

          setAssignments(fetchedAssignments);

          // Fetch teacher names for each assignment's course
          const courseIds = fetchedAssignments.map(assignment => assignment.course).filter(courseId => typeof courseId === 'number'); // Ensure courseId is a number
          const uniqueCourseIds = [...new Set(courseIds)]; // Get unique course IDs
          const fetchedTeacherNames: {[key: number]: string} = {};

          for (const courseId of uniqueCourseIds) {
            try {
              const classRes = await getClassById(courseId, accessToken);
              if (classRes && classRes.data && classRes.data.teacher) {
                fetchedTeacherNames[courseId] = classRes.data.teacher.full_name;
              } else {
                fetchedTeacherNames[courseId] = "Inconnu";
              }
            } catch (classError) {
              fetchedTeacherNames[courseId] = "Erreur";
            }
          }
          setTeacherNames(fetchedTeacherNames);
        } else {
          setAssignments([]);
          setError("Format de données inattendu reçu de l'API.");
        }
      } catch (err) {
        setError('Failed to load assignments.');
        setAssignments([]);
      } finally {
        setLoading(false);
      }
    };

    if (accessToken) {
      fetchAssignments();
    }
  }, [accessToken]);

  const handleAssignmentClick = (assignment: Assignment) => {
    setSelectedAssignment(assignment)
    setIsViewAssignmentModalOpen(true)
  }

  const handleSubmissionClick = (assignment: Assignment) => {
    setSelectedAssignment(assignment)
    if (assignment.published) {
      setIsViewSubmissionModalOpen(true)
    } else {
      setIsSubmitModalOpen(true)
    }
  }

  if (loading) {
    return <div>Loading assignments...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="w-full relative">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent border-b">
            <TableHead className="font-bold text-gray-700 py-4">CLASS</TableHead>
            <TableHead className="font-bold text-gray-700 py-4">DAY</TableHead>
            <TableHead className="font-bold text-gray-700 py-4">TYPE</TableHead>
            <TableHead className="font-bold text-gray-700 py-4">ASSIGNMENT</TableHead>
            <TableHead className="font-bold text-gray-700 py-4">YOUR FILES</TableHead>
            <TableHead className="font-bold text-gray-700 py-4">TEACHER</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {assignments.map((assignment, index) => {
            console.log("Rendering teacher name for course ID", assignment.course, ":", teacherNames[assignment.course]);
            return (
            <TableRow key={assignment.id} className={index % 2 === 0 ? "bg-[#EDF6FA]" : ""}>
              <TableCell className="font-medium text-gray-500">{assignment.course}</TableCell>
              <TableCell className="text-gray-500">
                <span>
                  {assignment.due_date}
                </span>
              </TableCell>
              <TableCell className="text-gray-500">{assignment.kind}</TableCell>
              <TableCell>
                <div className="flex items-center justify-center">
                  <button
                    className="text-[#25AAE1] hover:text-[#1D8CB3]"
                    onClick={() => handleAssignmentClick(assignment)}
                  >
                    <FileTextIcon className="h-5 w-5" />
                  </button>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center justify-center">
                  <button
                    // Adjust logic based on assignment property indicating submission if needed
                    className={`${assignment.published ? "text-[#4CAF50]" : "text-gray-400"} hover:opacity-80`}
                    onClick={() => handleSubmissionClick(assignment)}
                  >
                    <FileIcon className="h-5 w-5" />
                  </button>
                </div>
              </TableCell>
              <TableCell className="text-gray-500">
                <div className="flex items-center">
                  {teacherNames[assignment.course] || "Chargement..."} <MessageIcon />
                </div>
              </TableCell>
            </TableRow>
          );})}
        </TableBody>
      </Table>

      {selectedAssignment && (
        <>
          <SubmitAssignmentDialog
            isOpen={isSubmitModalOpen}
            onClose={() => setIsSubmitModalOpen(false)}
            assignment={selectedAssignment}
          />

          <ViewAssignmentDialog
            isOpen={isViewAssignmentModalOpen}
            onClose={() => setIsViewAssignmentModalOpen(false)}
            assignment={selectedAssignment}
          />

          <ViewSubmissionDialog
            isOpen={isViewSubmissionModalOpen}
            onClose={() => setIsViewSubmissionModalOpen(false)}
            assignment={selectedAssignment}
          />
        </>
      )}

      {(isSubmitModalOpen || isViewAssignmentModalOpen || isViewSubmissionModalOpen) && (
        <div className="absolute inset-0 bg-white/50 backdrop-blur-sm" />
      )}
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

