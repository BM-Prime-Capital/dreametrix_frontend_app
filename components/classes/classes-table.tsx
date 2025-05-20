"use client";

import { useEffect, useState } from "react";
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
  type FilterFn
} from "@tanstack/react-table";
import { Eye, Trash2, ChevronDown, Search, ChevronLeft, ChevronRight, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { deleteClass, getClasses } from "@/services/ClassService";
import { Loader } from "../ui/loader";
import { useRequestInfo } from "@/hooks/useRequestInfo";
import { AddClassDialog } from "./AddClassDialog";
import Swal from 'sweetalert2';
import { ClassDetailsDialog } from "./ClassDetailsDialog";
import { Class } from "@/types";

const globalFilterFn: FilterFn<Class> = (row, columnId, filterValue) => {
  const value = row.getValue(columnId);
  return String(value).toLowerCase().includes(filterValue.toLowerCase());
};

export function ClassesTable({ refreshTime, setRefreshTime }: { refreshTime: string, setRefreshTime: Function }) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [allClasses, setAllClasses] = useState<Class[]>([]);
  const { tenantDomain, accessToken, refreshToken } = useRequestInfo();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const columns: ColumnDef<Class>[] = [
    {
      accessorKey: "name",
      header: "Class",
      cell: ({ row }) => (
        <span className="bg-[#3e81d4]/10 text-[#3e81d4] rounded-full px-3 py-1 text-sm font-medium">
          {row.getValue("name")}
        </span>
      ),
    },
    {
      accessorKey: "subject_in_short",
      header: "Subject",
    },
    {
      accessorKey: "grade",
      header: "Grade",
      cell: ({ row }) => (
        <span className="px-2.5 py-1 bg-[#3e81d4]/10 text-[#3e81d4] rounded-full text-xs font-medium">
          {row.getValue("grade")}
        </span>
      ),
    },
    {
      accessorKey: "teacher.full_name",
      header: "Teacher",
      cell: ({ row }) => (
        <span className="bg-[#3e81d4]/10 text-[#3e81d4] rounded-full px-3 py-1 text-sm font-medium">
          {row.getValue("teacher.full_name")}
        </span>
      ),
    },
    {
      accessorKey: "students",
      header: "Students",
      cell: ({ row }) => (
        <div className="flex items-center justify-center gap-2">
          <span className="px-2.5 py-1 bg-[#3e81d4]/10 text-[#3e81d4] rounded-full text-xs font-medium">
            {(row.getValue("students") as unknown[]).length}
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 hover:bg-[#3e81d4]/10"
            onClick={() => handleViewDetails(row.original)}
          >
            <Eye className="h-3.5 w-3.5 text-[#3e81d4]" />
          </Button>
        </div>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      enableHiding: false,
      cell: ({ row }) => (
        <div className="flex gap-2 justify-center">
          <AddClassDialog 
            setRefreshTime={setRefreshTime} 
            existingClass={{
              ...row.original,
              teacher: typeof row.original.teacher === 'object' ? row.original.teacher.id : row.original.teacher
            }} 
          />
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 hover:bg-[#3e81d4]/10"
            onClick={() => handleDeleteClass(row.original.id)}
          >
            <Trash2 className="h-3.5 w-3.5 text-[#3e81d4]" />
          </Button>
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data: allClasses,
    columns,
    filterFns: { global: globalFilterFn },
    globalFilterFn,
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: { sorting, globalFilter, columnVisibility },
  });

  const handleViewDetails = (classData: any) => {
    setSelectedClass(classData);
    setDetailsOpen(true);
  };

  const handleDeleteClass = async (classId: number) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
      customClass: {
        title: 'text-lg font-semibold',
        htmlContainer: 'text-sm',
        confirmButton: 'text-sm',
        cancelButton: 'text-sm'
      },
      buttonsStyling: true,
      backdrop: `
        rgba(0,0,0,0.4)
        url("/images/nyan-cat.gif")
        left top
        no-repeat
      `
    });
  
    if (result.isConfirmed) {
      try {
        setIsLoading(true);
        const success = await deleteClass(
          classId,
          tenantDomain,
          accessToken,
          refreshToken
        );
        
        if (success) {
          const updatedClasses = await getClasses(tenantDomain, accessToken, refreshToken);
          setAllClasses(updatedClasses);
          
          await Swal.fire({
            title: 'Deleted!',
            text: 'Class has been deleted.',
            icon: 'success',
            customClass: {
              title: 'text-lg font-semibold',
              htmlContainer: 'text-sm'
            }
          });
        } else {
          await Swal.fire({
            title: 'Failed!',
            text: 'Failed to delete class.',
            icon: 'error',
            customClass: {
              title: 'text-lg font-semibold',
              htmlContainer: 'text-sm'
            }
          });
        }
      } catch (error) {
        console.error("Error deleting class:", error);
        await Swal.fire({
          title: 'Error!',
          text: error instanceof Error ? error.message : 'Unknown error',
          icon: 'error',
          customClass: {
            title: 'text-lg font-semibold',
            htmlContainer: 'text-sm'
          }
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    let isMounted = true;
    
    const loadClasses = async () => {
      if (tenantDomain && accessToken && refreshToken) {
        setIsLoading(true);
        try {
          const classes = await getClasses(tenantDomain, accessToken, refreshToken);
          if (isMounted) {
            setAllClasses(classes);
          }
        } catch (error) {
          await Swal.fire(
            'Error!',
            'Failed to load classes.',
            'error'
          );
        } finally {
          if (isMounted) {
            setIsLoading(false);
          }
        }
      }
    };
  
    loadClasses();
  
    return () => {
      isMounted = false;
    };
  }, [refreshTime, tenantDomain, accessToken, refreshToken]);


  const handleExport = () => {
    const csvContent = [
      Object.keys(allClasses[0]).join(','),
      ...allClasses.map(item => Object.values(item).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'classes.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full space-y-6 p-4 bg-white rounded-lg shadow-sm">
      {/* Header avec filtres */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-auto md:flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Filter classes..."
            value={globalFilter ?? ''}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="pl-8 w-full md:w-[400px]"
          />
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
              <Button variant="outline" className="bg-[#3e81d4]/10 text-[#3e81d4] hover:bg-[#3e81d4]/20 border-[#3e81d4]/20">
                Columns <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table.getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) => column.toggleVisibility(!!value)}
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Tableau */}
      <div className="rounded-lg border border-gray-200 overflow-hidden">
        <Table className="min-w-full">
          <TableHeader className="bg-[#3e81d4]/10">
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <TableHead key={header.id} className="px-4 py-3 text-left text-xs font-medium text-[#3e81d4] uppercase tracking-wider">
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody className="bg-white divide-y divide-gray-200">
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map(row => (
                <TableRow key={row.id} className="hover:bg-[#3e81d4]/5">
                  {row.getVisibleCells().map(cell => (
                    <TableCell key={cell.id} className="px-4 py-3 whitespace-nowrap text-sm text-gray-800">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="px-4 py-3 text-center text-sm text-gray-500">
                  No classes found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex flex-col md:flex-row items-center justify-between px-4 py-3 bg-[#3e81d4]/5 rounded-b-lg">
        <div className="text-sm text-[#3e81d4] mb-4 md:mb-0">
          Showing {table.getRowModel().rows.length} of {allClasses.length} classes
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

      <ClassDetailsDialog
        classData={selectedClass ? {
          ...selectedClass,
          teacher: typeof selectedClass.teacher === 'object' ? selectedClass.teacher.id : selectedClass.teacher
        } : null}
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
      />
    </div>
  );
}