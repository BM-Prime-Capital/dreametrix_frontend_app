"use client";

import { useState, useMemo, useEffect } from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
  type VisibilityState,
  type FilterFn,
} from "@tanstack/react-table";
import {
  Eye,
  Pencil,
  Trash2,
  ChevronDown,
  Search,
  ChevronLeft,
  ChevronRight,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { getAssignments, deleteAssignment } from "@/services/AssignmentService";
import { useRequestInfo } from "@/hooks/useRequestInfo";
import { Loader } from "../ui/loader";
import Image from "next/image";
import { generalImages } from "@/constants/images";
import { Assignment, MiniCourse } from "@/types";
import { SubmissionsPopup } from "./SubmissionsPopup";
import { EditAssignmentDialog } from "./EditAssignmentDialog";

const globalFilterFn: FilterFn<Assignment> = (row, columnId, filterValue) => {
  const value = row.getValue(columnId);

  if (typeof value === "string") {
    return value.toLowerCase().includes(filterValue.toLowerCase());
  }

  if (typeof value === "number") {
    return value.toString().includes(filterValue);
  }

  if (value instanceof Date) {
    return value.toLocaleDateString().includes(filterValue);
  }

  if (typeof value === "boolean") {
    return (value ? "published" : "draft").includes(filterValue.toLowerCase());
  }

  return false;
};

interface AssignmentsTableProps {
  onViewAssignment: (assignment: Assignment) => void;
}

export function AssignmentsTable({ onViewAssignment }: AssignmentsTableProps) {
  const { tenantDomain, accessToken, refreshToken } = useRequestInfo();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [courseFilter, setCourseFilter] = useState<string>("all");
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [selectedAssignment, setSelectedAssignment] =
    useState<Assignment | null>(null);
  const [isSubmissionsPopupOpen, setIsSubmissionsPopupOpen] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState<Assignment | null>(
    null
  );
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'card' | 'table'>('table');

  // Load assignments function
  const loadAssignments = async () => {
    if (!tenantDomain || !accessToken || !refreshToken) return;

    setIsLoading(true);
    setError("");

    try {
      const data = await getAssignments(
        tenantDomain,
        accessToken,
        //refreshToken
      );
      setAssignments(data);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Load assignments on mount
  useEffect(() => {
    loadAssignments();
  }, [tenantDomain, accessToken, refreshToken]);

  // Get unique courses for the filter dropdown
  const uniqueCourses = useMemo(() => {
    if (!assignments || assignments.length === 0) {
      return [];
    }
    const courseMap = new Map();
    assignments.forEach((assignment: Assignment) => {
      if (assignment.course && assignment.course.id) {
        courseMap.set(assignment.course.id, assignment.course);
      }
    });
    const courses = Array.from(courseMap.values()) as MiniCourse[];
    return courses.sort((a, b) => a.name.localeCompare(b.name));
  }, [assignments]);

  // Filter assignments by course
  const filteredAssignments = useMemo(() => {
    if (!assignments || assignments.length === 0) {
      return [];
    }
    if (courseFilter === "all") {
      return assignments;
    }
    return assignments.filter(
      (assignment: Assignment) =>
        assignment.course &&
        assignment.course.id &&
        assignment.course.id.toString() === courseFilter
    );
  }, [assignments, courseFilter]);

  const handleAssignmentClick = (assignment: Assignment) => {
    onViewAssignment(assignment);
  };

  const handleEditAssignment = (assignment: Assignment) => {
    setEditingAssignment(assignment);
    setIsEditDialogOpen(true);
  };

  const handleDeleteAssignment = async (assignment: Assignment) => {
    // Show confirmation dialog
    const confirmed = window.confirm(
      `Are you sure you want to delete the assignment "${assignment.name}"? This action cannot be undone.`
    );

    if (!confirmed) return;

    try {
      await deleteAssignment(
        assignment.id,
        tenantDomain,
        accessToken,
        //refreshToken
      );

      // Reload assignments list
      await loadAssignments();
    } catch (error) {
      console.error("Error deleting assignment:", error);
      alert("Failed to delete assignment. Please try again.");
    }
  };

  const handleAssignmentUpdate = async (updatedAssignment: Assignment) => {
    // Reload assignments to get the latest data
    await loadAssignments();
    console.log("Assignment updated:", updatedAssignment);
  };

  // const resetFilters = () => {
  //   setGlobalFilter("");
  //   setCourseFilter("all");
  // };

  const columns: ColumnDef<Assignment>[] = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => (
        <button
          onClick={() => handleAssignmentClick(row.original)}
          className="font-medium text-green-600 hover:text-green-800 hover:underline cursor-pointer text-left"
        >
          {row.getValue("name")}
        </button>
      ),
    },
    {
      accessorKey: "course",
      header: "Course",
      cell: ({ row }) => (
        <div className="font-medium text-gray-900">
          {row.original.course.name}
        </div>
      ),
    },
    {
      accessorKey: "kind",
      header: "Type",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("kind")}</div>
      ),
    },
    {
      accessorKey: "due_date",
      header: "Due Date",
      cell: ({ row }) => (
        <div className="whitespace-nowrap">
          {new Date(row.getValue("due_date")).toLocaleDateString()}
        </div>
      ),
    },
    {
      accessorKey: "weight",
      header: "Weight",
      cell: ({ row }) => (
        <div className="font-medium">
          {Number(row.getValue("weight")).toLocaleString(undefined, {
            maximumFractionDigits: 2,
            minimumFractionDigits: 0,
          })}
          %
        </div>
      ),
    },
    {
      accessorKey: "published",
      header: "Status",
      cell: ({ row }) => {
        const published = row.getValue("published");
        return (
          <div className="flex items-center gap-2">
            <Image
              src={published ? generalImages.published : generalImages.draft}
              className="h-4 w-4"
              alt="status"
              width={16}
              height={16}
            />
            <span className="capitalize">
              {published ? "Published" : "Draft"}
            </span>
          </div>
        );
      },
    },
    {
      id: "actions",
      header: "Action",
      enableHiding: false,
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 hover:bg-green-50"
              onClick={() => handleAssignmentClick(row.original)}
              title="View Submissions"
            >
              <Eye className="h-4 w-4 text-green-600" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 hover:bg-green-50"
              onClick={() => handleEditAssignment(row.original)}
              title="Edit Assignment"
            >
              <Pencil className="h-4 w-4 text-green-600" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 hover:bg-red-50"
              onClick={() => handleDeleteAssignment(row.original)}
              title="Delete Assignment"
            >
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data: filteredAssignments,
    columns,
    filterFns: {
      global: globalFilterFn,
    },
    globalFilterFn: globalFilterFn,
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    initialState: {
      pagination: {
        pageSize: 9,
      },
    },
    state: {
      sorting,
      globalFilter,
      columnVisibility,
    },
  });

  const handleExport = () => {
    const dataToExport =
      filteredAssignments.length > 0 ? filteredAssignments : assignments;

    if (dataToExport.length === 0) {
      console.warn("No data to export");
      return;
    }

    const csvContent = [
      Object.keys(dataToExport[0]).join(","),
      ...dataToExport.map((item: Assignment) => Object.values(item).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "assignments.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url); // Clean up the URL
  };

  if (isLoading) return <Loader />;

  if (error)
    return (
      <div className="text-red-500 p-4">Error loading assignments: {error}</div>
    );

  return (
    <div className="w-full space-y-6 p-6">
      {/* Enhanced Header */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto md:flex-1">
          <div className="relative w-full md:w-auto md:flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Search assignments by name, course, or type..."
              value={globalFilter ?? ""}
              onChange={(event) => setGlobalFilter(event.target.value)}
              className="pl-12 w-full md:w-[400px] h-12 rounded-xl border-gray-300 bg-white shadow-sm"
            />
          </div>

          <div className="w-full md:w-auto">
            <Select
              value={courseFilter}
              onValueChange={setCourseFilter}
              disabled={isLoading || assignments.length === 0}
            >
              <SelectTrigger className="w-full md:w-[200px] h-12 rounded-xl border-gray-300 bg-white shadow-sm">
                <SelectValue placeholder="Filter by course" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Classes</SelectItem>
                {uniqueCourses.map((course) => (
                  <SelectItem key={course.id} value={course.id.toString()}>
                    {course.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={handleExport}
            className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl px-6 py-3 shadow-lg font-medium"
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="bg-white border-gray-300 rounded-xl px-6 py-3 shadow-lg font-medium"
              >
                {viewMode === 'card' ? 'Card' : 'Table'} View <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuCheckboxItem 
                checked={viewMode === 'card'} 
                onCheckedChange={() => setViewMode('card')}
              >
                Card View
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem 
                checked={viewMode === 'table'} 
                onCheckedChange={() => setViewMode('table')}
              >
                Table View
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Enhanced Assignments Display */}
      {table.getRowModel().rows?.length ? (
        viewMode === 'card' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {table.getRowModel().rows.map((row) => {
            const assignment = row.original;
            const dueDate = new Date(assignment.due_date);
            const isOverdue = dueDate < new Date() && !assignment.published;
            const daysUntilDue = Math.ceil((dueDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
            
            return (
              <div key={row.id} className="bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 overflow-hidden group">
                {/* Assignment Header */}
                <div className={`p-6 text-white ${
                  assignment.kind === 'homework' ? 'bg-gradient-to-r from-blue-500 to-blue-600' :
                  assignment.kind === 'test' ? 'bg-gradient-to-r from-red-500 to-red-600' :
                  assignment.kind === 'quiz' ? 'bg-gradient-to-r from-purple-500 to-purple-600' :
                  assignment.kind === 'project' ? 'bg-gradient-to-r from-green-500 to-green-600' :
                  'bg-gradient-to-r from-gray-500 to-gray-600'
                }`}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-bold text-lg mb-1 line-clamp-2">{assignment.name}</h3>
                      <p className="text-white/80 text-sm">{assignment.course.name}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        assignment.published 
                          ? 'bg-green-500/20 text-green-100 border border-green-400/30' 
                          : 'bg-yellow-500/20 text-yellow-100 border border-yellow-400/30'
                      }`}>
                        {assignment.published ? 'Published' : 'Draft'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium capitalize">
                      {assignment.kind}
                    </span>
                    <span className="text-white/90 text-sm font-medium">
                      Weight: {Number(assignment.weight).toFixed(1)}%
                    </span>
                  </div>
                </div>

                {/* Assignment Content */}
                <div className="p-6 space-y-4">
                  {/* Due Date Info */}
                  <div className={`p-4 rounded-xl border-l-4 ${
                    isOverdue ? 'bg-red-50 border-red-400' :
                    daysUntilDue <= 3 ? 'bg-yellow-50 border-yellow-400' :
                    'bg-blue-50 border-blue-400'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">Due Date</p>
                        <p className={`text-sm ${
                          isOverdue ? 'text-red-700' :
                          daysUntilDue <= 3 ? 'text-yellow-700' :
                          'text-blue-700'
                        }`}>
                          {dueDate.toLocaleDateString('en-US', { 
                            weekday: 'short', 
                            month: 'short', 
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className={`text-xs font-medium ${
                          isOverdue ? 'text-red-600' :
                          daysUntilDue <= 3 ? 'text-yellow-600' :
                          'text-blue-600'
                        }`}>
                          {isOverdue ? 'Overdue' :
                           daysUntilDue === 0 ? 'Due Today' :
                           daysUntilDue === 1 ? 'Due Tomorrow' :
                           `${daysUntilDue} days left`}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Assignment Stats */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-gray-50 rounded-lg p-3 text-center">
                      <p className="text-2xl font-bold text-gray-700">
                        {assignment.submissions_count || 0}
                      </p>
                      <p className="text-xs text-gray-600 font-medium">Submissions</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3 text-center">
                      <p className="text-2xl font-bold text-gray-700">
                        {assignment.average_grade ? assignment.average_grade.toFixed(1) : '-'}
                      </p>
                      <p className="text-xs text-gray-600 font-medium">Avg Grade</p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="border-t border-gray-100 p-4 flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex-1 text-green-600 hover:bg-green-50 rounded-xl font-medium"
                    onClick={() => handleAssignmentClick(assignment)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="px-3 text-gray-600 hover:bg-gray-50 rounded-xl"
                    onClick={() => handleEditAssignment(assignment)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="px-3 text-red-600 hover:bg-red-50 rounded-xl"
                    onClick={() => handleDeleteAssignment(assignment)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            );
          })}
          </div>
        ) : (
          <div className="rounded-2xl border border-gray-200 overflow-hidden bg-white shadow-lg">
            <Table>
              <TableHeader className="bg-gradient-to-r from-green-50 to-blue-50">
                {table.getHeaderGroups().map(headerGroup => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map(header => (
                      <TableHead key={header.id} className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        {flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows.map(row => (
                  <TableRow key={row.id} className="hover:bg-green-50/30 transition-colors">
                    {row.getVisibleCells().map(cell => (
                      <TableCell key={cell.id} className="px-6 py-4 text-sm text-gray-900">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )
      ) : (
        <div className="text-center py-12">
          <div className="mx-auto h-24 w-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Search className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No assignments found</h3>
          <p className="text-gray-500 mb-6">Create your first assignment to get started</p>
        </div>
      )}

      {/* Enhanced Pagination */}
      {table.getRowModel().rows?.length > 0 && (
        <div className="flex flex-col md:flex-row items-center justify-between px-6 py-4 bg-gray-50 rounded-2xl">
          <div className="text-sm text-gray-600 mb-4 md:mb-0">
            Showing{" "}
            <span className="font-semibold text-gray-900">{table.getRowModel().rows.length}</span>{" "}
            of <span className="font-semibold text-gray-900">{filteredAssignments.length}</span>{" "}
            assignments
            {courseFilter !== "all" && (
              <span className="text-gray-500"> (filtered by course)</span>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      )}

      {/* Submissions Popup */}
      {selectedAssignment && (
        <SubmissionsPopup
          isOpen={isSubmissionsPopupOpen}
          onClose={() => {
            setIsSubmissionsPopupOpen(false);
            setSelectedAssignment(null);
          }}
          assessmentId={selectedAssignment.id}
          assessmentName={selectedAssignment.name}
        />
      )}

      {/* Edit Assignment Dialog */}
      <EditAssignmentDialog
        assignment={editingAssignment}
        isOpen={isEditDialogOpen}
        onClose={() => {
          setIsEditDialogOpen(false);
          setEditingAssignment(null);
        }}
        onUpdate={handleAssignmentUpdate}
      />
    </div>
  );
}
