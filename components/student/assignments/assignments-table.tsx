"use client";

import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FileIcon, FileTextIcon } from "lucide-react";
import { SubmitAssignmentDialog } from "./submit-assignment-dialog";
import { ViewAssignmentDialog } from "./view-assignment-dialog";
import { ViewSubmissionDialog } from "./view-submission-dialog";
import { getAssignments } from "@/app/api/student/assignment/assignment.controller";
import { getClassById } from "@/app/api/student/class/classController";
import { useRequestInfo } from "@/hooks/useRequestInfo";
import { Assignment } from "@/app/api/student/assignment/assignment.model";

interface AssignmentsTableProps {
  selectedClass?: string;
  selectedDates?: number[];
  dateFilter?: string;
}

export function AssignmentsTable({
  selectedClass = "all-classes",
  selectedDates = [],
  dateFilter = "all-days",
}: AssignmentsTableProps) {
  const [allAssignments, setAllAssignments] = useState<Assignment[]>([]);
  const [filteredAssignments, setFilteredAssignments] = useState<Assignment[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [teacherNames, setTeacherNames] = useState<{ [key: number]: string }>(
    {}
  );
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isViewAssignmentModalOpen, setIsViewAssignmentModalOpen] =
    useState(false);
  const [isViewSubmissionModalOpen, setIsViewSubmissionModalOpen] =
    useState(false);
  const [selectedAssignment, setSelectedAssignment] =
    useState<Assignment | null>(null);
  const { accessToken } = useRequestInfo();

  useEffect(() => {
    const fetchAssignments = async () => {
      setLoading(true);
      setError(null);

      // Mock data instead of API call
      const mockAssignments: Assignment[] = [
        {
          id: 1,
          name: "Science Homework",
          teacher: "Eve Parker",
          file: "",
          due_date: "2025-06-12",
          weight: 10,
          kind: "Homework",
          class: "Class 5 - Sci",
          published: true,
          created_at: "2025-06-10",
          updated_at: "2025-06-10",
          published_at: "2025-06-10",
          course: 1,
        },
        {
          id: 2,
          name: "Math Test",
          teacher: "Eve Parker",
          file: "",
          due_date: "2025-06-13",
          weight: 25,
          kind: "Test",
          class: "Class 5 - Math",
          published: false,
          created_at: "2025-06-11",
          updated_at: "2025-06-11",
          published_at: "",
          course: 2,
        },
        {
          id: 3,
          name: "Biology Assignment",
          teacher: "Sam Burke",
          file: "",
          due_date: "2025-06-14",
          weight: 15,
          kind: "Homework",
          class: "Class 5 - Bio",
          published: false,
          created_at: "2025-06-12",
          updated_at: "2025-06-12",
          published_at: "",
          course: 3,
        },
        {
          id: 4,
          name: "Literature Essay",
          teacher: "Anne Blake",
          file: "",
          due_date: "2025-06-14",
          weight: 20,
          kind: "Homework",
          class: "Class 5 - Lit",
          published: false,
          created_at: "2025-06-13",
          updated_at: "2025-06-13",
          published_at: "",
          course: 4,
        },
        {
          id: 5,
          name: "Chemistry Lab Report",
          teacher: "Sam Burke",
          file: "",
          due_date: "2025-06-15",
          weight: 30,
          kind: "Test",
          class: "Class 5 - Che",
          published: false,
          created_at: "2025-06-13",
          updated_at: "2025-06-13",
          published_at: "",
          course: 5,
        },
        {
          id: 6,
          name: "Spanish Vocabulary Quiz",
          teacher: "Anne Blake",
          file: "",
          due_date: "2025-06-17",
          weight: 15,
          kind: "Test",
          class: "Class 5 - Spa",
          published: false,
          created_at: "2025-06-13",
          updated_at: "2025-06-13",
          published_at: "",
          course: 6,
        },
        {
          id: 7,
          name: "Physics Problem Set",
          teacher: "Eve Parker",
          file: "",
          due_date: "2025-06-18",
          weight: 20,
          kind: "Test",
          class: "Class 5 - Phy",
          published: false,
          created_at: "2025-06-13",
          updated_at: "2025-06-13",
          published_at: "",
          course: 7,
        },
      ];

      // Mock teacher names
      const mockTeacherNames = {
        1: "Eve Parker",
        2: "Eve Parker",
        3: "Sam Burke",
        4: "Anne Blake",
        5: "Sam Burke",
        6: "Anne Blake",
        7: "Eve Parker",
      };

      setAllAssignments(mockAssignments);
      setTeacherNames(mockTeacherNames);
      setLoading(false);
    };

    fetchAssignments();
  }, []);

  // Filter assignments based on selected filters
  useEffect(() => {
    let filtered = [...allAssignments];

    // Filter by class
    if (selectedClass !== "all-classes") {
      const courseMapping: { [key: string]: number } = {
        "class-5-math": 2,
        "class-5-sci": 1,
        "class-5-bio": 3,
        "class-5-lit": 4,
        "class-5-che": 5,
        "class-5-spa": 6,
        "class-5-phy": 7,
      };
      const courseId = courseMapping[selectedClass];
      if (courseId) {
        filtered = filtered.filter(
          (assignment) => assignment.course === courseId
        );
      }
    }

    // Filter by date
    if (dateFilter === "custom" && selectedDates.length > 0) {
      filtered = filtered.filter((assignment) => {
        const assignmentDate = new Date(assignment.due_date);
        const assignmentDay = assignmentDate.getDate();
        return selectedDates.includes(assignmentDay);
      });
    }

    setFilteredAssignments(filtered);
  }, [allAssignments, selectedClass, selectedDates, dateFilter]);

  const handleAssignmentClick = (assignment: Assignment) => {
    console.log("Opening assignment dialog for:", assignment.name);
    setSelectedAssignment(assignment);
    setIsViewAssignmentModalOpen(true);
  };

  const handleSubmissionClick = (assignment: Assignment) => {
    console.log("Opening submission dialog for:", assignment.name);
    setSelectedAssignment(assignment);
    if (assignment.published) {
      setIsViewSubmissionModalOpen(true);
    } else {
      setIsSubmitModalOpen(true);
    }
  };

  const handleDialogClose = () => {
    setIsSubmitModalOpen(false);
    setIsViewAssignmentModalOpen(false);
    setIsViewSubmissionModalOpen(false);
    setSelectedAssignment(null);
  };

  if (loading) {
    return <div className="p-6 text-center">Loading assignments...</div>;
  }

  if (error) {
    return <div className="p-6 text-center text-red-500">Error: {error}</div>;
  }

  if (filteredAssignments.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500">
        {allAssignments.length === 0
          ? "No assignments found."
          : "No assignments match the selected filters."}
      </div>
    );
  }

  // Helper function to format dates
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "TODAY";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "YESTERDAY";
    } else {
      return date.toLocaleDateString("en-US", {
        month: "2-digit",
        day: "2-digit",
      });
    }
  };

  // Helper function to get class name from course ID
  const getClassName = (courseId: number) => {
    // This is a simplified mapping - you might want to fetch actual class names
    const classMap: { [key: number]: string } = {
      1: "Class 5 - Sci",
      2: "Class 5 - Math",
      3: "Class 5 - Bio",
      4: "Class 5 - Lit",
      5: "Class 5 - Che",
      6: "Class 5 - Spa",
      7: "Class 5 - Phy",
    };
    return classMap[courseId] || `Class ${courseId}`;
  };

  return (
    <div className="w-full relative bg-white ">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent border-b border-gray-200">
            <TableHead className="font-bold text-gray-600 py-4 px-6 text-left">
              ASSIGNMENT
            </TableHead>
            <TableHead className="font-bold text-gray-600 py-4 px-6 text-left">
              CLASS
            </TableHead>
            <TableHead className="font-bold text-gray-600 py-4 px-6 text-left">
              DAY
            </TableHead>
            <TableHead className="font-bold text-gray-600 py-4 px-6 text-left">
              TYPE
            </TableHead>
            <TableHead className="font-bold text-gray-600 py-4 px-6 text-center">
              VIEW
            </TableHead>
            <TableHead className="font-bold text-gray-600 py-4 px-6 text-center">
              YOUR FILES
            </TableHead>
            <TableHead className="font-bold text-gray-600 py-4 px-6 text-left">
              TEACHER
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredAssignments.map((assignment: Assignment, index: number) => {
            const isEvenRow = index % 2 === 0;
            const formattedDate = formatDate(assignment.due_date);
            const isToday = formattedDate === "TODAY";
            const isYesterday = formattedDate === "YESTERDAY";

            return (
              <TableRow
                key={assignment.id}
                className={`${
                  isEvenRow ? "bg-[#EDF7FF]" : "bg-white"
                } hover:bg-gray-50 transition-colors`}
              >
                <TableCell className="font-semibold text-gray-700 py-4 px-6">
                  {assignment.name}
                </TableCell>
                <TableCell className="font-medium text-gray-600 py-4 px-6">
                  {getClassName(assignment.course)}
                </TableCell>
                <TableCell className="py-4 px-6">
                  <span
                    className={`
                  ${
                    isToday
                      ? "bg-orange-500 text-white px-2 py-1 rounded text-sm font-medium"
                      : ""
                  }
                  ${
                    isYesterday
                      ? "bg-red-500 text-white px-2 py-1 rounded text-sm font-medium"
                      : ""
                  }
                  ${!isToday && !isYesterday ? "text-gray-600" : ""}
                `}
                  >
                    {formattedDate}
                  </span>
                </TableCell>
                <TableCell className="text-gray-600 py-4 px-6 capitalize">
                  {assignment.kind}
                </TableCell>
                <TableCell className="py-4 px-6">
                  <div className="flex items-center justify-center">
                    <button
                      className="bg-[#4A90E2] hover:bg-[#357ABD] text-white p-2 rounded transition-colors"
                      onClick={() => handleAssignmentClick(assignment)}
                      title="View Assignment"
                    >
                      <FileTextIcon className="h-4 w-4" />
                    </button>
                  </div>
                </TableCell>
                <TableCell className="py-4 px-6">
                  <div className="flex items-center justify-center">
                    <button
                      className={`${
                        assignment.published
                          ? "bg-[#4CAF50] hover:bg-[#45A049] text-white"
                          : "bg-gray-300 hover:bg-gray-400 text-gray-600"
                      } p-2 rounded transition-colors`}
                      onClick={() => handleSubmissionClick(assignment)}
                      title={
                        assignment.published
                          ? "View Submission"
                          : "Submit Assignment"
                      }
                    >
                      <FileIcon className="h-4 w-4" />
                    </button>
                  </div>
                </TableCell>
                <TableCell className="text-gray-600 py-4 px-6">
                  <div className="flex items-center">
                    <span className="mr-2">
                      {teacherNames[assignment.course] || "Loading..."}
                    </span>
                    <MessageIcon />
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      {selectedAssignment && (
        <>
          <SubmitAssignmentDialog
            isOpen={isSubmitModalOpen}
            onClose={handleDialogClose}
            assignment={selectedAssignment}
          />

          <ViewAssignmentDialog
            isOpen={isViewAssignmentModalOpen}
            onClose={handleDialogClose}
            assignment={selectedAssignment}
          />

          <ViewSubmissionDialog
            isOpen={isViewSubmissionModalOpen}
            onClose={handleDialogClose}
            assignment={selectedAssignment}
          />
        </>
      )}

      {(isSubmitModalOpen ||
        isViewAssignmentModalOpen ||
        isViewSubmissionModalOpen) && (
        <div className="absolute inset-0 bg-white/50 backdrop-blur-sm" />
      )}
    </div>
  );
}

function MessageIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="text-[#4A90E2] cursor-pointer hover:text-[#357ABD] transition-colors"
    >
      <path
        d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
