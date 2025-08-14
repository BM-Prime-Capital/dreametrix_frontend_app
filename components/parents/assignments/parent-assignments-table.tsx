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
import { FileIcon, FileTextIcon, Calendar, Users } from "lucide-react";
import { ViewAssignmentDialog } from "@/components/student/assignments/view-assignment-dialog";
import { ViewSubmissionDialog } from "@/components/student/assignments/view-submission-dialog";
import { Badge } from "@/components/ui/badge";
import { ParentAssignment } from "@/services/ParentAssignmentService";

interface ParentAssignmentsTableProps {
  selectedStudent: string;
  selectedClass: string;
  selectedType: string;
  refreshKey: number;
  assignments: ParentAssignment[];
  accessToken: string;
  refreshToken: string;
}

export function ParentAssignmentsTable({
  selectedStudent,
  selectedClass,
  selectedType,
  refreshKey,
  assignments,
  accessToken,
  refreshToken,
}: ParentAssignmentsTableProps) {
  const [isViewAssignmentModalOpen, setIsViewAssignmentModalOpen] =
    useState(false);
  const [isViewSubmissionModalOpen, setIsViewSubmissionModalOpen] =
    useState(false);
  const [selectedAssignment, setSelectedAssignment] =
    useState<ParentAssignment | null>(null);

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
      assignment.course.id.toString() === selectedClass;

    // Filter by type
    const typeMatch =
      selectedType === "all-types" ||
      assignment.kind.toLowerCase() === selectedType.toLowerCase();

    // Filter by student
    const studentMatch = selectedStudent === "all-students" || 
      assignment.students?.some(student => student.id.toString() === selectedStudent);

    return classMatch && typeMatch && studentMatch;
  });

  // Get students to display based on filter
  const getStudentsToDisplay = (assignment: ParentAssignment) => {
    if (selectedStudent === "all-students") {
      return assignment.students || [];
    } else {
      // Show only the selected student
      return assignment.students?.filter(student => student.id.toString() === selectedStudent) || [];
    }
  };

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
            <TableHead className="font-bold text-gray-700 py-4 text-sm uppercase tracking-wide">
              STUDENTS
            </TableHead>
            <TableHead className="font-bold text-gray-700 py-4 text-sm uppercase tracking-wide">
              DUE DATE
            </TableHead>
            <TableHead className="font-bold text-gray-700 py-4 text-sm uppercase tracking-wide">
              TYPE
            </TableHead>
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
          {filteredAssignments.map((assignment, index) => {
            const studentsToDisplay = getStudentsToDisplay(assignment);
            
            return (
              <TableRow
                key={assignment.id}
                className={`hover:bg-gray-50 transition-colors ${
                  index % 2 === 0 ? "bg-white" : "bg-gray-50"
                }`}
              >
                <TableCell className="py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <FileTextIcon className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-800">
                        {assignment.name}
                      </div>
                      <div className="text-sm text-gray-500">ID: {assignment.id}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="py-4">
                  <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                    {assignment.course.name}
                  </Badge>
                </TableCell>
                <TableCell className="py-4">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-gray-400" />
                    <div className="flex flex-wrap gap-1">
                      {studentsToDisplay.slice(0, 3).map((student, i) => (
                        <span key={student.id} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {student.name}
                        </span>
                      ))}
                      {studentsToDisplay.length > 3 && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          +{studentsToDisplay.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="py-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">{assignment.due_date}</span>
                  </div>
                </TableCell>
                <TableCell className="py-4">
                  <span className="text-green-600 font-medium capitalize">
                    {assignment.kind}
                  </span>
                </TableCell>
                <TableCell className="py-4">
                  <span className="text-gray-600">{assignment.weight}%</span>
                </TableCell>
                <TableCell className="py-4">
                  <Badge
                    variant={assignment.published ? "default" : "secondary"}
                    className={
                      assignment.published
                        ? "bg-green-100 text-green-700 border-green-200"
                        : "bg-gray-100 text-gray-700 border-gray-200"
                    }
                  >
                    {assignment.published ? "Published" : "Draft"}
                  </Badge>
                </TableCell>
                <TableCell className="py-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleAssignmentClick(assignment)}
                      className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                      title="View Assignment"
                    >
                      <FileIcon className="w-4 h-4" />
                    </button>
                    {assignment.published && (
                      <button
                        onClick={() => handleSubmissionClick(assignment)}
                        className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                        title="View Submissions"
                      >
                        <FileTextIcon className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>

      {filteredAssignments.length === 0 && assignments.length > 0 && (
        <div className="text-center py-8 text-gray-500">
          <FileTextIcon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p>No assignments found for the selected filters</p>
        </div>
      )}

      {assignments.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <FileTextIcon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p>No assignments available</p>
        </div>
      )}

      {/* Modals */}
      {selectedAssignment && (
        <>
          <ViewAssignmentDialog
            isOpen={isViewAssignmentModalOpen}
            onClose={() => {
              setIsViewAssignmentModalOpen(false);
              setSelectedAssignment(null);
            }}
            assignment={selectedAssignment}
          />

          <ViewSubmissionDialog
            isOpen={isViewSubmissionModalOpen}
            onClose={() => {
              setIsViewSubmissionModalOpen(false);
              setSelectedAssignment(null);
            }}
            assignment={selectedAssignment}
          />
        </>
      )}
    </div>
  );
}
