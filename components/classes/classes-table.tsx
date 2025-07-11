"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
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
import {  Trash2, ChevronDown, Search, ChevronLeft, ChevronRight, Download } from "lucide-react";
import { ClassRosterDialog } from "./roster-management";
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
import { getStudents } from "@/services/student-service";

const globalFilterFn: FilterFn<Class> = (row, columnId, filterValue) => {
  const value = row.getValue(columnId);
  return String(value).toLowerCase().includes(filterValue.toLowerCase());
};

export function ClassesTable({ refreshTime, setRefreshTime }: { refreshTime: string, setRefreshTime: (time: string) => void }) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [allClasses, setAllClasses] = useState<Class[]>([]);
  const { tenantDomain, accessToken, refreshToken } = useRequestInfo();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [selectedClass,] = useState<Class | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [rosterOpen, setRosterOpen] = useState(false);
  const [selectedClassForRoster, setSelectedClassForRoster] = useState<Class | null>(null);
  const [allStudents, setAllStudents] = useState<Student[]>([]);
  const [viewMode, setViewMode] = useState<'card' | 'table' | 'list'>('card');

  const transformClassData = useCallback((classData: Class): { id: number; name: string; students: Student[] } => {
    return {
      id: classData.id,
      name: classData.name,
      students: Array.isArray(classData.students) 
        ? classData.students.map(s => typeof s === 'number' 
            ? { id: s, full_name: `Student ${s}` } 
            : s)
        : []
    };
  }, []);

  const teacherColors = [
    'bg-blue-100 text-blue-800', 
    'bg-green-100 text-green-800',
    'bg-yellow-100 text-yellow-800',
    'bg-purple-100 text-purple-800',
    'bg-pink-100 text-pink-800',
  ];
  
  const getTeacherColor = (index: number) => {
    return teacherColors[index % teacherColors.length];
  };


  const columns = useMemo<ColumnDef<Class>[]>(() => [
    {
      accessorKey: "name",
      header: "Class",
      cell: ({ row }) => (
        <button 
          className="bg-[#3e81d4]/10 text-[#3e81d4] rounded-full px-3 py-1 text-sm font-medium hover:bg-[#3e81d4]/20 transition-colors"
          onClick={() => {
            setSelectedClassForRoster(row.original);
            setRosterOpen(true);
          }}
        >
          {row.getValue("name")}
        </button>
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
      accessorKey: "teacher",
      header: "Teacher",
      cell: ({ row }) => {
        const teacher = row.original.teacher;
        const teacherName = typeof teacher === 'object' ? teacher.full_name : 'Unknown';
        const initials = teacherName.split(' ')
          .filter(part => part.length > 0)
          .map(part => part[0].toUpperCase())
          .join('')
          .substring(0, 2);
        
        return (
          <div className="flex items-center gap-2">
            <div className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium ${getTeacherColor(row.index)}`}>
              {initials || '??'}
            </div>
            <span className="text-sm text-gray-700">{teacherName}</span>
          </div>
        );
      },
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
  ], [setRefreshTime]);

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

  const handleDeleteClass = useCallback(async (classId: number) => {
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
          setRefreshTime(Date.now().toString());
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
  }, [tenantDomain, accessToken, refreshToken, setRefreshTime]);

  const handleExport = useCallback(() => {
    if (allClasses.length === 0) return;
    
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
  }, [allClasses]);

  const handleGlobalFilterChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setGlobalFilter(e.target.value);
  }, []);

  const loadClassesAndStudents = useCallback(async () => {
    if (tenantDomain && accessToken && refreshToken) {
      setIsLoading(true);
      try {
        const [classes, students] = await Promise.all([
          getClasses(tenantDomain, accessToken, refreshToken),
          getStudents(tenantDomain, accessToken)
        ]);
        setAllClasses(classes);
        setAllStudents(students);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        await Swal.fire(
          'Error!',
          'Failed to load data.',
          'error'
        );
      } finally {
        setIsLoading(false);
      }
    }
  }, [tenantDomain, accessToken, refreshToken]);

  useEffect(() => {
    let isMounted = true;
    
    if (isMounted) {
      loadClassesAndStudents();
    }
  
    return () => {
      isMounted = false;
    };
  }, [refreshTime, loadClassesAndStudents]);

  const classDetailsData = useMemo(() => 
    selectedClass ? {
      ...selectedClass,
      teacher: typeof selectedClass.teacher === 'object' ? selectedClass.teacher.id : selectedClass.teacher
    } : null,
    [selectedClass]
  );

  const classRosterData = useMemo(() => 
    selectedClassForRoster ? transformClassData(selectedClassForRoster) : null,
    [selectedClassForRoster, transformClassData]
  );


  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader />
      </div>
    );
  }


  return (
    <div className="w-full space-y-6 p-6">
      {/* Header avec filtres */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-auto md:flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search classes by name, subject, or teacher..."
            value={globalFilter ?? ''}
            onChange={handleGlobalFilterChange}
            className="pl-10 w-full md:w-[400px] h-11 rounded-xl border-gray-300"
          />
        </div>
        
        <div className="flex items-center gap-3">
          <Button 
            onClick={handleExport}
            variant="outline" 
            className="bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200 rounded-xl px-4 py-2"
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="bg-gray-50 text-gray-700 hover:bg-gray-100 border-gray-200 rounded-xl px-4 py-2">
                {viewMode === 'card' ? 'Card' : viewMode === 'table' ? 'Table' : 'List'} View <ChevronDown className="ml-2 h-4 w-4" />
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
              <DropdownMenuCheckboxItem 
                checked={viewMode === 'list'} 
                onCheckedChange={() => setViewMode('list')}
              >
                List View
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Classes Display */}
      {table.getRowModel().rows?.length ? (
        <>
          {/* Card View */}
          {viewMode === 'card' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {table.getRowModel().rows.map(row => {
                const classData = row.original;
                const teacher = typeof classData.teacher === 'object' ? classData.teacher : null;
                const teacherName = teacher?.full_name || 'Unassigned';
                const studentCount = Array.isArray(classData.students) ? classData.students.length : 0;
                
                return (
                  <div key={row.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 overflow-hidden group">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 text-white">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg truncate">{classData.name}</h3>
                          <p className="text-blue-100 text-sm mt-1">{classData.subject_in_all_letter}</p>
                        </div>
                        <span className="bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium">
                          Grade {classData.grade}
                        </span>
                      </div>
                    </div>
                    <div className="p-4 space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
                          <span className="text-sm font-semibold text-gray-700">
                            {teacherName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{teacherName}</p>
                          <p className="text-xs text-gray-500">Instructor</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-blue-50 rounded-lg p-3 text-center">
                          <p className="text-2xl font-bold text-blue-600">{studentCount}</p>
                          <p className="text-xs text-blue-600 font-medium">Students</p>
                        </div>
                        <div className="bg-green-50 rounded-lg p-3 text-center">
                          <p className="text-2xl font-bold text-green-600">A</p>
                          <p className="text-xs text-green-600 font-medium">Avg Grade</p>
                        </div>
                      </div>
                    </div>
                    <div className="border-t border-gray-100 p-4 flex gap-2">
                      <Button variant="ghost" size="sm" className="flex-1 text-blue-600 hover:bg-blue-50 rounded-xl" onClick={() => { setSelectedClassForRoster(classData); setRosterOpen(true); }}>
                        View Roster
                      </Button>
                      <AddClassDialog setRefreshTime={setRefreshTime} existingClass={{ ...classData, teacher: typeof classData.teacher === 'object' ? classData.teacher.id : classData.teacher }} />
                      <Button variant="ghost" size="sm" className="px-3 text-red-600 hover:bg-red-50 rounded-xl" onClick={() => handleDeleteClass(classData.id)}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Table View */}
          {viewMode === 'table' && (
            <div className="rounded-lg border border-gray-200 overflow-hidden bg-white">
              <Table className="min-w-full">
                <TableHeader className="bg-gray-50">
                  {table.getHeaderGroups().map(headerGroup => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map(header => (
                        <TableHead key={header.id} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {flexRender(header.column.columnDef.header, header.getContext())}
                        </TableHead>
                      ))}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody className="bg-white divide-y divide-gray-200">
                  {table.getRowModel().rows.map(row => (
                    <TableRow key={row.id} className="hover:bg-gray-50">
                      {row.getVisibleCells().map(cell => (
                        <TableCell key={cell.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {/* List View */}
          {viewMode === 'list' && (
            <div className="space-y-3">
              {table.getRowModel().rows.map(row => {
                const classData = row.original;
                const teacher = typeof classData.teacher === 'object' ? classData.teacher : null;
                const teacherName = teacher?.full_name || 'Unassigned';
                const studentCount = Array.isArray(classData.students) ? classData.students.length : 0;
                
                return (
                  <div key={row.id} className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-all duration-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-semibold">
                          {classData.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{classData.name}</h3>
                          <p className="text-sm text-gray-500">{classData.subject_in_all_letter} • Grade {classData.grade}</p>
                        </div>
                        <div className="hidden md:flex items-center gap-6 text-sm text-gray-600">
                          <div className="text-center">
                            <p className="font-semibold text-gray-900">{teacherName}</p>
                            <p className="text-xs">Instructor</p>
                          </div>
                          <div className="text-center">
                            <p className="font-semibold text-blue-600">{studentCount}</p>
                            <p className="text-xs">Students</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" className="text-blue-600 hover:bg-blue-50" onClick={() => { setSelectedClassForRoster(classData); setRosterOpen(true); }}>Roster</Button>
                        <AddClassDialog setRefreshTime={setRefreshTime} existingClass={{ ...classData, teacher: typeof classData.teacher === 'object' ? classData.teacher.id : classData.teacher }} />
                        <Button variant="ghost" size="sm" className="text-red-600 hover:bg-red-50" onClick={() => handleDeleteClass(classData.id)}><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <div className="mx-auto h-24 w-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Search className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No classes found</h3>
          <p className="text-gray-500 mb-6">Get started by creating your first class</p>
          <AddClassDialog setRefreshTime={setRefreshTime} />
        </div>
      )}

      {/* Pagination */}
      {table.getRowModel().rows?.length > 0 && (
        <div className="flex flex-col md:flex-row items-center justify-between px-4 py-3 bg-gray-50 rounded-xl">
          <div className="text-sm text-gray-600 mb-4 md:mb-0">
            Showing {table.getRowModel().rows.length} of {allClasses.length} classes
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

      <ClassDetailsDialog
        classData={classDetailsData}
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
      />
      <ClassRosterDialog
        classData={classRosterData}
        studentList={allStudents}
        tenantPrimaryDomain={tenantDomain}
        accessToken={accessToken}
        refreshToken={refreshToken}
        open={rosterOpen}
        onOpenChange={setRosterOpen}
      />
    </div>
  );
}

interface Student {
  id: number;
  full_name: string;
}