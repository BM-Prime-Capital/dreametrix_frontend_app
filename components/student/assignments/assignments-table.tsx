"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FileIcon,
  FileTextIcon,
  Search,
  Download,
  X,
  Send,
} from "lucide-react";
import { SubmitAssignmentDialog } from "./submit-assignment-dialog";
import { ViewAssignmentDialog } from "./view-assignment-dialog";
import { ViewSubmissionDialog } from "./view-submission-dialog";
import { useRequestInfo } from "@/hooks/useRequestInfo";
import {
  Assignment,
  AssignmentsResponse,
} from "@/app/api/student/assignment/assignment.model";
import { getAssignments } from "@/services/AssignmentService";

interface MiniCourse {
  id: number;
  name: string;
}

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
  const { tenantDomain, accessToken, refreshToken } = useRequestInfo();

  // New state for enhanced filtering
  const [globalFilter, setGlobalFilter] = useState("");
  const [courseFilter, setCourseFilter] = useState<string>("all");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isViewAssignmentModalOpen, setIsViewAssignmentModalOpen] =
    useState(false);
  const [isViewSubmissionModalOpen, setIsViewSubmissionModalOpen] =
    useState(false);
  const [selectedAssignment, setSelectedAssignment] =
    useState<Assignment | null>(null);

  const uniqueCourses = useMemo(() => {
    if (!allAssignments || allAssignments.length === 0) {
      return [];
    }
    const courseMap = new Map();
    allAssignments.forEach((assignment: Assignment) => {
      if (assignment.course && assignment.course.id) {
        courseMap.set(assignment.course.id, assignment.course);
      }
    });
    const courses = Array.from(courseMap.values()) as MiniCourse[];
    return courses.sort((a, b) => a.name.localeCompare(b.name));
  }, [allAssignments]);

  useEffect(() => {
    const fetchAssignments = async () => {
      setLoading(true);
      setError(null);

      if (!accessToken) {
        setError("Authentication required.");
        setLoading(false);
        setAllAssignments([]);
        return;
      }

      try {
        const res = await getAssignments(
          tenantDomain,
          accessToken
        );

        if (res && Array.isArray(res)) {
          const fetchedAssignments: Assignment[] = res;
          setAllAssignments(fetchedAssignments);
        } else {
          setAllAssignments([]);
          setError("Unexpected data format received from API.");
        }
      } catch (err) {
        setError("Failed to load assignments.");
        setAllAssignments([]);
        console.error("Error fetching assignments:", err);
      } finally {
        setLoading(false);
      }
    };

    if (accessToken) {
      fetchAssignments();
    }
  }, [accessToken]);

  // Enhanced filter assignments with global search and course filter
  useEffect(() => {
    let filtered = [...allAssignments];

    // Global search filter
    if (globalFilter) {
      filtered = filtered.filter((assignment) => {
        const searchTerm = globalFilter.toLowerCase();
        return (
          assignment.name.toLowerCase().includes(searchTerm) ||
          assignment.course?.name?.toLowerCase().includes(searchTerm) ||
          assignment.kind?.toLowerCase().includes(searchTerm) ||
          new Date(assignment.due_date)
            .toLocaleDateString()
            .includes(searchTerm) ||
          (assignment.weight &&
            assignment.weight.toString().includes(searchTerm))
        );
      });
    }

    // Filter by course (new enhanced version)
    if (courseFilter !== "all") {
      filtered = filtered.filter(
        (assignment) =>
          assignment.course &&
          assignment.course.id &&
          assignment.course.id.toString() === courseFilter
      );
    }

    // Legacy filter by class (maintain backward compatibility)
    if (selectedClass !== "all-classes") {
      const courseMapping: { [key: string]: number } = {
        "class-8-ela": 2,
        "class-8-math": 3,
        // Add more mappings as needed based on actual course IDs
      };
      const courseId = courseMapping[selectedClass];
      if (courseId) {
        filtered = filtered.filter(
          (assignment) => assignment.course.id === courseId
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
  }, [
    allAssignments,
    globalFilter,
    courseFilter,
    selectedClass,
    selectedDates,
    dateFilter,
  ]);

  const handleAssignmentClick = (assignment: Assignment) => {
    console.log("Opening assignment dialog for:", assignment.name);
    setSelectedAssignment(assignment);
    setIsViewAssignmentModalOpen(true);
  };

  const handleSubmissionClick = (assignment: Assignment) => {
    console.log("Opening submission dialog for:", assignment.name);
    setSelectedAssignment(assignment);

    // Vérifier si une soumission existe réellement (pas seulement published)
    const hasSubmission =
      assignment.submission &&
      (assignment.submission.file ||
        assignment.submission.grade !== null ||
        assignment.submission.marked);

    if (hasSubmission) {
      setIsViewSubmissionModalOpen(true);
    } else {
      setIsSubmitModalOpen(true);
    }
  };

  // Reset all filters
  const resetFilters = () => {
    setGlobalFilter("");
    setCourseFilter("all");
  };

  // Export functionality
  const handleExport = () => {
    const dataToExport =
      filteredAssignments.length > 0 ? filteredAssignments : allAssignments;

    if (dataToExport.length === 0) {
      console.warn("No data to export");
      return;
    }

    // Create CSV content
    const headers = ["Name", "Course", "Type", "Due Date", "Weight", "Status"];
    const csvContent = [
      headers.join(","),
      ...dataToExport.map((assignment: Assignment) =>
        [
          `"${assignment.name}"`,
          `"${assignment.course?.name || ""}"`,
          `"${assignment.kind || ""}"`,
          `"${new Date(assignment.due_date).toLocaleDateString()}"`,
          `"${assignment.weight || ""}%"`,
          `"${assignment.published ? "Published" : "Draft"}"`,
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "student-assignments.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDialogClose = () => {
    setIsSubmitModalOpen(false);
    setIsViewAssignmentModalOpen(false);
    setIsViewSubmissionModalOpen(false);
    setSelectedAssignment(null);
  };

  if (loading) {
    return (
      <div className="w-full space-y-6 p-4 bg-white rounded-lg shadow-sm">
        <div className="p-6 text-center">Loading assignments...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full space-y-6 p-4 bg-white rounded-lg shadow-sm">
        <div className="p-6 text-center text-red-500">Error: {error}</div>
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

  return (
    <div className="w-full space-y-6 p-4 bg-white rounded-lg shadow-sm">
      {/* Enhanced Filter Header */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto md:flex-1">
          {/* Global Search */}
          <div className="relative w-full md:w-auto md:flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search assignments..."
              value={globalFilter ?? ""}
              onChange={(event) => setGlobalFilter(event.target.value)}
              className="pl-8 w-full md:w-[400px]"
            />
          </div>

          {/* Course Filter */}
          <div className="w-full md:w-auto">
            <Select
              value={courseFilter}
              onValueChange={setCourseFilter}
              disabled={loading || allAssignments.length === 0}
            >
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Filter by course" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Courses</SelectItem>
                {uniqueCourses.map((course) => (
                  <SelectItem key={course.id} value={course.id.toString()}>
                    {course.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {(globalFilter || courseFilter !== "all") && (
            <Button
              onClick={resetFilters}
              variant="outline"
              className="bg-gray-100 text-gray-600 hover:bg-gray-200 border-gray-300"
            >
              <X className="h-4 w-4 mr-2" />
              Clear Filters
            </Button>
          )}

          <Button
            onClick={handleExport}
            variant="outline"
            className="bg-[#3e81d4]/10 text-[#3e81d4] hover:bg-[#3e81d4]/20 border-[#3e81d4]/20"
            disabled={filteredAssignments.length === 0}
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Filter Summary */}
      {(globalFilter || courseFilter !== "all") && (
        <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
          Showing {filteredAssignments.length} of {allAssignments.length}{" "}
          assignments
          {globalFilter && (
            <span className="ml-2">
              • Search: "<strong>{globalFilter}</strong>"
            </span>
          )}
          {courseFilter !== "all" && (
            <span className="ml-2">
              • Course:{" "}
              <strong>
                {
                  uniqueCourses.find((c) => c.id.toString() === courseFilter)
                    ?.name
                }
              </strong>
            </span>
          )}
        </div>
      )}

      {/* Table Container */}
      <div className="rounded-lg border border-gray-200 overflow-hidden">
        <Table>
          <TableHeader className="bg-[#3e81d4]/10">
            <TableRow className="hover:bg-transparent border-b border-gray-200">
              <TableHead className="font-bold text-[#3e81d4] py-4 px-6 text-left uppercase tracking-wider">
                CLASS
              </TableHead>
              <TableHead className="font-bold text-[#3e81d4] py-4 px-6 text-left uppercase tracking-wider">
                DAY
              </TableHead>
              <TableHead className="font-bold text-[#3e81d4] py-4 px-6 text-left uppercase tracking-wider">
                TYPE
              </TableHead>
              <TableHead className="font-bold text-[#3e81d4] py-4 px-6 text-left uppercase tracking-wider">
                ASSIGNMENT
              </TableHead>
              <TableHead className="font-bold text-[#3e81d4] py-4 px-6 text-center uppercase tracking-wider">
                VIEW
              </TableHead>
              <TableHead className="font-bold text-[#3e81d4] py-4 px-6 text-center uppercase tracking-wider">
                YOUR FILES
              </TableHead>
              <TableHead className="font-bold text-[#3e81d4] py-4 px-6 text-left uppercase tracking-wider">
                TEACHER
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="bg-white divide-y divide-gray-200">
            {filteredAssignments.length > 0 ? (
              filteredAssignments.map(
                (assignment: Assignment, index: number) => {
                  const isEvenRow = index % 2 === 0;
                  const formattedDate = formatDate(assignment.due_date);
                  const isToday = formattedDate === "TODAY";
                  const isYesterday = formattedDate === "YESTERDAY";

                  return (
                    <TableRow
                      key={assignment.id}
                      className={`${
                        isEvenRow ? "bg-[#EDF7FF]" : "bg-white"
                      } hover:bg-[#3e81d4]/5 transition-colors`}
                    >
                      <TableCell className="font-medium text-gray-600 py-4 px-6">
                        {assignment.course.name}
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
                      <TableCell className="font-semibold text-gray-700 py-4 px-6">
                        <span>{assignment.name}</span>
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
                          {(() => {
                            // Vérifier si une soumission existe réellement
                            const hasSubmission =
                              assignment.submission &&
                              (assignment.submission.file ||
                                assignment.submission.grade !== null ||
                                assignment.submission.marked);

                            return (
                              <button
                                className={`${
                                  hasSubmission
                                    ? "bg-[#4CAF50] hover:bg-[#45A049] text-white"
                                    : "bg-gray-300 hover:bg-gray-400 text-gray-600"
                                } p-2 rounded transition-colors`}
                                onClick={() =>
                                  handleSubmissionClick(assignment)
                                }
                                title={
                                  hasSubmission
                                    ? "View Submission"
                                    : "Submit Assignment"
                                }
                              >
                                <FileIcon className="h-4 w-4" />
                              </button>
                            );
                          })()}
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-600 py-4 px-6">
                        <div className="flex items-center">
                          <span className="mr-2">Teacher</span>
                          <Send className="h-4 w-4 text-[#4A90E2] cursor-pointer hover:text-[#357ABD]" />
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                }
              )
            ) : (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="px-4 py-8 text-center text-sm text-gray-500"
                >
                  {allAssignments.length === 0
                    ? "No assignments found."
                    : "No assignments match the selected filters."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Info */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#3e81d4]/5 rounded-lg">
        <div className="text-sm text-[#3e81d4]">
          Showing{" "}
          <span className="font-medium">{filteredAssignments.length}</span> of{" "}
          <span className="font-medium">{allAssignments.length}</span>{" "}
          assignments
          {(globalFilter || courseFilter !== "all") && (
            <span className="text-gray-600"> (filtered)</span>
          )}
        </div>
      </div>

      {/* Modal Dialogs */}
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
    </div>
  );
}
