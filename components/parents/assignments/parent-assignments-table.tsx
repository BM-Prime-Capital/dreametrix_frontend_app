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
import { FileIcon, FileTextIcon, Calendar } from "lucide-react";
import { ViewAssignmentDialog } from "@/components/student/assignments/view-assignment-dialog";
import { ViewSubmissionDialog } from "@/components/student/assignments/view-submission-dialog";
import { Badge } from "@/components/ui/badge";
import { useParentAssignments } from "@/hooks/useParentAssignments";
import { ParentAssignment } from "@/services/ParentAssignmentService";

// This will be replaced with API data

interface ParentAssignmentsTableProps {
  selectedStudent: string;
  selectedClass: string;
  selectedType: string;
  selectedDates: number[];
  refreshKey: number;
  accessToken: string;
  refreshToken: string;
}

export function ParentAssignmentsTable({
  selectedStudent,
  selectedClass,
  selectedType,
  selectedDates,
  refreshKey,
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
    if (selectedStudent === "all-students") return undefined;
    return parseInt(selectedStudent);
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

  // Filter assignments based on selected filters
  const filteredAssignments = assignments.filter((assignment) => {
    // Filter by class
    const classMatch =
      selectedClass === "all-classes" ||
      assignment.course.name.toLowerCase().includes(selectedClass.toLowerCase());

    // Filter by type
    const typeMatch =
      selectedType === "all-types" ||
      assignment.kind.toLowerCase() === selectedType.toLowerCase();

    // Filter by dates (if selected)
    const dateMatch = selectedDates.length === 0 || selectedDates.some(date => {
      const assignmentDate = new Date(assignment.created_at);
      const filterDate = new Date(date);
      return assignmentDate.toDateString() === filterDate.toDateString();
    });

    return classMatch && typeMatch && dateMatch;
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
          <TableRow className="hover:bg-transparent border-b bg-gray-50">
            <TableHead className="font-bold text-gray-700 py-4 text-sm uppercase tracking-wide">
              ASSIGNMENT
            </TableHead>
            <TableHead className="font-bold text-gray-700 py-4 text-sm uppercase tracking-wide">
              CLASS
            </TableHead>
            <TableHead className="font-bold text-gray-700 py-4 text-sm uppercase tracking-wide">DUE DATE</TableHead>
            <TableHead className="font-bold text-gray-700 py-4 text-sm uppercase tracking-wide">TYPE</TableHead>
            <TableHead className="font-bold text-gray-700 py-4 text-sm uppercase tracking-wide">
              WEIGHT
            </TableHead>
            <TableHead className="font-bold text-gray-700 py-4 text-sm uppercase tracking-wide">
              STATUS
            </TableHead>
            <TableHead className="font-bold text-gray-700 py-4 text-sm uppercase tracking-wide">
              ACTIONS
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredAssignments.map((assignment, index) => (
            <TableRow
              key={assignment.id}
              className={`hover:bg-gray-50 transition-colors ${index % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
            >
              <TableCell className="py-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <FileTextIcon className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{assignment.name}</div>
                    <div className="text-sm text-gray-500">ID: {assignment.id}</div>
                  </div>
                </div>
              </TableCell>
              <TableCell className="py-4">
                <Badge
                  variant="outline"
                  className="bg-purple-50 text-purple-700 border-purple-200"
                >
                  {assignment.course.name}
                </Badge>
              </TableCell>
              <TableCell className="py-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Calendar className="w-4 h-4 text-orange-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">
                      {new Date(assignment.due_date).toLocaleDateString()}
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(assignment.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell className="py-4">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 capitalize">
                  {assignment.kind}
                </span>
              </TableCell>
              <TableCell className="py-4">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {assignment.weight}%
                </span>
              </TableCell>
              <TableCell className="py-4">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  assignment.published 
                    ? "bg-green-100 text-green-800" 
                    : "bg-yellow-100 text-yellow-800"
                }`}>
                  {assignment.published ? "Published" : "Draft"}
                </span>
              </TableCell>
              <TableCell className="py-4">
                <div className="flex items-center gap-2">
                  <button
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    onClick={() => handleAssignmentClick(assignment)}
                    title="View Assignment"
                  >
                    <FileTextIcon className="h-4 w-4" />
                  </button>
                  {assignment.published && (
                    <button
                      className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      onClick={() => handleSubmissionClick(assignment)}
                      title="View Submissions"
                    >
                      <FileIcon className="h-4 w-4" />
                    </button>
                  )}
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
