"use client";

import { useState, useMemo } from "react";
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
import { useList } from "@/hooks/useList";
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

export function AssignmentsTable() {
  const { list: assignments, isLoading, error } = useList(getAssignments);
  const { tenantDomain, accessToken, refreshToken } = useRequestInfo();
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
    setSelectedAssignment(assignment);
    setIsSubmissionsPopupOpen(true);
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
        refreshToken
      );

      // Refresh the page to update the assignments list
      window.location.reload();
    } catch (error) {
      console.error("Error deleting assignment:", error);
      alert("Failed to delete assignment. Please try again.");
    }
  };

  const handleAssignmentUpdate = (updatedAssignment: Assignment) => {
    // Update the assignment in the local state
    // Note: In a real app, you might want to refetch the data or use a state management solution
    console.log("Assignment updated:", updatedAssignment);
    // You could trigger a refetch here or update local state
  };

  const resetFilters = () => {
    setGlobalFilter("");
    setCourseFilter("all");
  };

  const columns: ColumnDef<Assignment>[] = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => (
        <button
          onClick={() => handleAssignmentClick(row.original)}
          className="font-medium text-[#3e81d4] hover:text-[#1D8CB3] hover:underline cursor-pointer text-left"
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
              className="h-8 w-8 hover:bg-[#3e81d4]/10"
              onClick={() => handleAssignmentClick(row.original)}
              title="View Submissions"
            >
              <Eye className="h-4 w-4 text-[#3e81d4]" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 hover:bg-[#3e81d4]/10"
              onClick={() => handleEditAssignment(row.original)}
              title="Edit Assignment"
            >
              <Pencil className="h-4 w-4 text-[#3e81d4]" />
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
    <div className="w-full space-y-6 p-4 bg-white rounded-lg shadow-sm">
      {/* Header avec filtres */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto md:flex-1">
          <div className="relative w-full md:w-auto md:flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Filter assignments..."
              value={globalFilter ?? ""}
              onChange={(event) => setGlobalFilter(event.target.value)}
              className="pl-8 w-full md:w-[400px]"
            />
          </div>

          <div className="w-full md:w-auto">
            <Select
              value={courseFilter}
              onValueChange={setCourseFilter}
              disabled={isLoading || assignments.length === 0}
            >
              <SelectTrigger className="w-full md:w-[200px]">
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

        <div className="flex items-center gap-2">
          <Button
            onClick={handleExport}
            variant="outline"
            className="bg-[#3e81d4]/10 text-[#3e81d4] hover:bg-[#3e81d4]/20 border-[#3e81d4]/20"
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="bg-[#3e81d4]/10 text-[#3e81d4] hover:bg-[#3e81d4]/20 border-[#3e81d4]/20"
              >
                Columns <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Tableau */}
      <div className="rounded-lg border border-gray-200 overflow-hidden">
        <Table className="min-w-full">
          <TableHeader className="bg-[#3e81d4]/10">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className="px-4 py-3 text-left text-xs font-medium text-[#3e81d4] uppercase tracking-wider"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody className="bg-white divide-y divide-gray-200">
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="hover:bg-[#3e81d4]/5"
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className="px-4 py-3 whitespace-nowrap text-sm text-gray-800"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="px-4 py-3 text-center text-sm text-gray-500"
                >
                  No assignments found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex flex-col md:flex-row items-center justify-between px-4 py-3 bg-[#3e81d4]/5 rounded-b-lg">
        <div className="text-sm text-[#3e81d4] mb-4 md:mb-0">
          Showing{" "}
          <span className="font-medium">{table.getRowModel().rows.length}</span>{" "}
          of <span className="font-medium">{filteredAssignments.length}</span>{" "}
          assignments
          {courseFilter !== "all" && (
            <span className="text-gray-600"> (filtered by course)</span>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="px-3 py-1 border border-[#3e81d4]/20 rounded-md text-sm font-medium text-[#3e81d4] bg-[#3e81d4]/10 hover:bg-[#3e81d4]/20"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="px-3 py-1 border border-[#3e81d4]/20 rounded-md text-sm font-medium text-[#3e81d4] bg-[#3e81d4]/10 hover:bg-[#3e81d4]/20"
          >
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>

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
