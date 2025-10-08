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
import { FileIcon, FileTextIcon, Calendar, Users, AlertCircle, Eye, BookOpen, Clock, CheckCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { ViewAssignmentDialog } from "@/components/student/assignments/view-assignment-dialog";
import { ViewSubmissionDialog } from "@/components/student/assignments/view-submission-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  //refreshKey,
  assignments,
  //accessToken,
  //refreshToken,
}: ParentAssignmentsTableProps) {
  const [isViewAssignmentModalOpen, setIsViewAssignmentModalOpen] =
    useState(false);
  const [isViewSubmissionModalOpen, setIsViewSubmissionModalOpen] =
    useState(false);
  const [selectedAssignment, setSelectedAssignment] =
    useState<ParentAssignment | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

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

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedStudent, selectedClass, selectedType]);

  // Pagination functions
  const getCurrentPageData = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredAssignments.slice(startIndex, endIndex);
  };

  const totalPages = Math.ceil(filteredAssignments.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Get students to display based on filter
  const getStudentsToDisplay = (assignment: ParentAssignment) => {
    if (selectedStudent === "all-students") {
      return assignment.students || [];
    } else {
      // Show only the selected student
      return assignment.students?.filter(student => student.id.toString() === selectedStudent) || [];
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  };

  const getStatusBadge = (published: boolean) => {
    if (published) {
      return (
        <Badge className="bg-green-100 text-green-700 border-green-200 text-xs">
          <CheckCircle className="h-3 w-3 mr-1" />
          Published
        </Badge>
      )
    } else {
      return (
        <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200 text-xs">
          <Clock className="h-3 w-3 mr-1" />
          Draft
        </Badge>
      )
    }
  };

  const getTypeBadge = (type: string) => {
    const typeColors = {
      'homework': 'bg-blue-100 text-blue-700 border-blue-200',
      'project': 'bg-purple-100 text-purple-700 border-purple-200',
      'quiz': 'bg-orange-100 text-orange-700 border-orange-200',
      'exam': 'bg-red-100 text-red-700 border-red-200',
      'assignment': 'bg-green-100 text-green-700 border-green-200'
    };
    
    const colorClass = typeColors[type.toLowerCase() as keyof typeof typeColors] || 'bg-gray-100 text-gray-700 border-gray-200';
    
    return (
      <Badge variant="outline" className={`${colorClass} text-xs`}>
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </Badge>
    )
  };

  if (filteredAssignments.length === 0) {
    return (
      <div className="w-full flex items-center justify-center py-16">
        <div className="bg-gradient-to-br from-gray-50 to-slate-50 p-8 rounded-3xl border border-gray-200 shadow-lg max-w-md w-full">
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">No Assignments Found</h3>
            <p className="text-gray-600 text-center">No assignments match the selected filters</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full relative">
      <div className="overflow-x-auto">
        <Table className="w-full">
          <TableHeader>
            <TableRow className="hover:bg-transparent border-b border-gray-200">
              <TableHead className="font-bold text-gray-700 py-4 text-sm uppercase tracking-wide pl-6">ASSIGNMENT</TableHead>
              <TableHead className="font-bold text-gray-700 py-4 text-sm uppercase tracking-wide text-center">CLASS</TableHead>
              <TableHead className="font-bold text-gray-700 py-4 text-sm uppercase tracking-wide text-center">TYPE</TableHead>
              <TableHead className="font-bold text-gray-700 py-4 text-sm uppercase tracking-wide text-center">STUDENTS</TableHead>
              <TableHead className="font-bold text-gray-700 py-4 text-sm uppercase tracking-wide text-center">DUE DATE</TableHead>
              <TableHead className="font-bold text-gray-700 py-4 text-sm uppercase tracking-wide text-center">STATUS</TableHead>
              <TableHead className="font-bold text-gray-700 py-4 text-sm uppercase tracking-wide text-center">ACTIONS</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {getCurrentPageData().map((assignment, index) => (
              <TableRow 
                key={assignment.id} 
                className={`hover:bg-blue-50/50 transition-all duration-200 cursor-pointer ${
                  index % 2 === 0 ? "bg-white" : "bg-gray-50/30"
                }`}
                onClick={() => handleAssignmentClick(assignment)}
              >
                <TableCell className="py-4 pl-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-[#25AAE1] to-[#1D8CB3] rounded-full flex items-center justify-center">
                      <FileTextIcon className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-800">{assignment.title}</div>
                      <div className="text-gray-500 text-sm line-clamp-2">{assignment.description}</div>
                    </div>
                  </div>
                </TableCell>x
                <TableCell className="py-4 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full flex items-center justify-center">
                      <BookOpen className="h-4 w-4 text-white" />
                    </div>
                    <span className="font-medium text-gray-700">{assignment.course.name}</span>
                  </div>
                </TableCell>
                <TableCell className="py-4 text-center">
                  {getTypeBadge(assignment.kind)}
                </TableCell>
                <TableCell className="py-4 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
                      <Users className="h-4 w-4 text-white" />
                    </div>
                    <div className="text-sm">
                      <div className="font-medium text-gray-700">
                        {getStudentsToDisplay(assignment).length} student{getStudentsToDisplay(assignment).length !== 1 ? 's' : ''}
                      </div>
                      <div className="text-gray-500 text-xs">
                        {getStudentsToDisplay(assignment).slice(0, 2).map(s => s.name).join(', ')}
                        {getStudentsToDisplay(assignment).length > 2 && ` +${getStudentsToDisplay(assignment).length - 2}`}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="py-4 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full flex items-center justify-center">
                      <Calendar className="h-4 w-4 text-white" />
                    </div>
                    <div className="text-sm">
                      <div className="font-medium text-gray-700">
                        {formatDate(assignment.due_date)}
                      </div>
                      <div className="text-gray-500 text-xs">
                        {new Date(assignment.due_date) < new Date() ? 'Overdue' : 'Upcoming'}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="py-4 text-center">
                  {getStatusBadge(assignment.published)}
                </TableCell>
                <TableCell className="py-4 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-gradient-to-r from-[#25AAE1] to-[#1D8CB3] text-white border-0 hover:from-[#1D8CB3] hover:to-[#1453B8] transition-all duration-300"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAssignmentClick(assignment);
                      }}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </Button>
                    {assignment.published && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0 hover:from-green-600 hover:to-green-700 transition-all duration-300"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSubmissionClick(assignment);
                        }}
                      >
                        <FileIcon className="h-4 w-4 mr-2" />
                        Submission
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center py-4 px-6 border-t border-gray-100">
          <div className="text-sm text-gray-600">
            Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredAssignments.length)} of {filteredAssignments.length} records
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="flex items-center gap-1"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => handlePageChange(page)}
                  className={`w-8 h-8 p-0 ${
                    currentPage === page
                      ? "bg-gradient-to-r from-[#25AAE1] to-[#1D8CB3] text-white"
                      : ""
                  }`}
                >
                  {page}
                </Button>
              ))}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="flex items-center gap-1"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Assignment Details Dialog */}
      {selectedAssignment && (
        <ViewAssignmentDialog
          isOpen={isViewAssignmentModalOpen}
          onClose={() => {
            setIsViewAssignmentModalOpen(false);
            setSelectedAssignment(null);
          }}
          assignment={selectedAssignment}
         // refreshToken={refreshToken}
        />
      )}

      {/* Submission Details Dialog */}
      {selectedAssignment && (
        <ViewSubmissionDialog
          isOpen={isViewSubmissionModalOpen}
          onClose={() => {
            setIsViewSubmissionModalOpen(false);
            setSelectedAssignment(null);
          }}
          assignment={selectedAssignment}
         // refreshToken={refreshToken}
        />
      )}
    </div>
  );
}
