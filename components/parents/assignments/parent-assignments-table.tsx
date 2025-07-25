"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FileIcon, FileTextIcon } from "lucide-react";
import { ViewAssignmentDialog } from "@/components/student/assignments/view-assignment-dialog";
import { ViewSubmissionDialog } from "@/components/student/assignments/view-submission-dialog";
import { Badge } from "@/components/ui/badge";
import { useParentAssignments } from "@/hooks/useParentAssignments";
import { ParentAssignment } from "@/services/ParentAssignmentService";

// This will be replaced with API data

interface ParentAssignmentsTableProps {
  selectedStudent: string;
  selectedClass: string;
  accessToken: string;
  refreshToken: string;
}

export function ParentAssignmentsTable({
  selectedStudent,
  selectedClass,
  accessToken,
  refreshToken,
}: ParentAssignmentsTableProps) {
  const [isViewAssignmentModalOpen, setIsViewAssignmentModalOpen] =
    useState(false);
  const [isViewSubmissionModalOpen, setIsViewSubmissionModalOpen] =
    useState(false);
  const [selectedAssignment, setSelectedAssignment] =
    useState<ParentAssignment | null>(null);

  // Get child ID from selected student
  const getChildId = () => {
    if (selectedStudent === "john") return 1; // Replace with actual child ID
    if (selectedStudent === "mia") return 2; // Replace with actual child ID
    return undefined; // For "all-students"
  };

  // Use the API hook to fetch assignments
  const { assignments, loading, error } = useParentAssignments({
    accessToken,
    refreshToken,
    childId: getChildId(),
  });

  const handleAssignmentClick = (assignment: ParentAssignment) => {
    setSelectedAssignment(assignment);
    setIsViewAssignmentModalOpen(true);
  };

  const handleSubmissionClick = (assignment: ParentAssignment) => {
    setSelectedAssignment(assignment);
    if (assignment.published) {
      setIsViewSubmissionModalOpen(true);
    }
  };

  // Filter assignments based on selected class
  const filteredAssignments = assignments.filter((assignment) => {
    const classMatch =
      selectedClass === "all-classes" ||
      assignment.class.toLowerCase() === selectedClass.replace(/-/g, " ");

    return classMatch;
  });

  // Show loading state
  if (loading) {
    return (
      <div className="w-full flex items-center justify-center py-8">
        <div className="text-gray-500">Loading assignments...</div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="w-full flex items-center justify-center py-8">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="w-full relative">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent border-b">
            <TableHead className="font-bold text-gray-700 py-4">
              STUDENT
            </TableHead>
            <TableHead className="font-bold text-gray-700 py-4">
              CLASS
            </TableHead>
            <TableHead className="font-bold text-gray-700 py-4">DAY</TableHead>
            <TableHead className="font-bold text-gray-700 py-4">TYPE</TableHead>
            <TableHead className="font-bold text-gray-700 py-4">
              ASSIGNMENT
            </TableHead>
            <TableHead className="font-bold text-gray-700 py-4">
              FILES
            </TableHead>
            <TableHead className="font-bold text-gray-700 py-4">
              TEACHER
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredAssignments.map((assignment, index) => (
            <TableRow
              key={assignment.id}
              className={index % 2 === 0 ? "bg-[#EDF6FA]" : ""}
            >
              <TableCell className="font-medium text-gray-500">
                <Badge
                  variant="outline"
                  className="bg-blue-50 text-blue-700 hover:bg-blue-100"
                >
                  {assignment.name}
                </Badge>
              </TableCell>
              <TableCell className="font-medium text-gray-500">
                {assignment.course.name}
              </TableCell>
              <TableCell className="text-gray-500">
                <span
                  className={
                    assignment.day === "TODAY"
                      ? "text-[#25AAE1] underline"
                      : assignment.day === "YESTERDAY"
                      ? "text-orange-400 underline"
                      : ""
                  }
                >
                  {assignment.created_at}
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
                    className={`${
                      assignment.published ? "text-[#4CAF50]" : "text-gray-400"
                    } hover:opacity-80`}
                    onClick={() => handleSubmissionClick(assignment)}
                  >
                    <FileIcon className="h-5 w-5" />
                  </button>
                </div>
              </TableCell>
              <TableCell className="text-gray-500">
                <div className="flex items-center">
                  {assignment.teacher} <MessageIcon />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {selectedAssignment && (
        <>
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

      {(isViewAssignmentModalOpen || isViewSubmissionModalOpen) && (
        <div className="absolute inset-0 bg-white/50 backdrop-blur-sm" />
      )}
    </div>
  );
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
      <path
        d="M22 2L11 13"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M22 2L15 22L11 13L2 9L22 2Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
