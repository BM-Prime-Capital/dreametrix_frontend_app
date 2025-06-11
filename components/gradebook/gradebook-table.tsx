"use client";

import { useState } from "react";
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
import { Eye, ChevronDown, Search, ChevronLeft, ChevronRight, Download } from "lucide-react";
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
import { ClassData } from "../types/gradebook";

const globalFilterFn: FilterFn<ClassData> = (row, columnId, filterValue) => {
  const value = row.getValue(columnId);
  return String(value).toLowerCase().includes(filterValue.toLowerCase());
};

interface GradebookTableProps {
  classes: ClassData[];
  onClassSelect: (selectedClass: ClassData) => void;
}

export function GradebookTable({ classes, onClassSelect }: GradebookTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const columns: ColumnDef<ClassData>[] = [
    {
      accessorKey: "name",
      header: "CLASS",
      cell: ({ row }) => (
      <div className="text-left"> {/* Ajout de text-left ici */}
        <span className="bg-[#3e81d4]/10 text-[#3e81d4] rounded-full px-3 py-1 text-sm font-medium">
          {row.getValue("name")}
        </span>
      </div>
      ),
    },
    {
      accessorKey: "average",
      header: "CLASS AVERAGE",
      cell: ({ row }) => (
        <span className="px-2.5 py-1 bg-[#3e81d4]/10 text-[#3e81d4] rounded-full text-sm font-medium text-center">
          {row.getValue("average")}
        </span>
      ),
    },
    {
      accessorKey: "noOfExams",
      header: "# TESTS",
      cell: ({ row }) => (
        <span className="bg-[#3e81d4]/10 text-[#3e81d4] rounded-full px-2 py-1 text-xs font-medium">
          {row.getValue("noOfExams")}
        </span>
      ),
    },
    {
      accessorKey: "noOfTests",
      header: "# QUIZ",
      cell: ({ row }) => (
        <span className="bg-[#3e81d4]/10 text-[#3e81d4] rounded-full px-2 py-1 text-xs font-medium">
          {row.getValue("noOfTests")}
        </span>
      ),
    },
    {
      accessorKey: "noOfHomeworks",
      header: "# HOMEWORKS",
      cell: ({ row }) => (
        <span className="bg-[#3e81d4]/10 text-[#3e81d4] rounded-full px-2 py-1 text-xs font-medium">
          {row.getValue("noOfHomeworks")}
        </span>
      ),
    },
    {
      accessorKey: "noOfParticipation",
      header: "# PARTICIPATIONS",
      cell: ({ row }) => (
        <span className="bg-[#3e81d4]/10 text-[#3e81d4] rounded-full px-2 py-1 text-xs font-medium">
          {row.getValue("noOfParticipation")}
        </span>
      ),
    },
    {
      accessorKey: "noOfOther",
      header: "# OTHERS",
      cell: ({ row }) => (
        <span className="bg-[#3e81d4]/10 text-[#3e81d4] rounded-full px-2 py-1 text-xs font-medium">
          {row.getValue("noOfOther")}
        </span>
      ),
    },
    {
      id: "actions",
      header: "VIEW",
      enableHiding: false,
      cell: ({ row }) => (
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 hover:bg-[#3e81d4]/10"
          onClick={() => onClassSelect(row.original)}
        >
          <Eye className="h-3.5 w-3.5 text-[#3e81d4]" />
        </Button>
      ),
    },
  ];

  const table = useReactTable({
    data: classes,
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

  const handleExport = () => {
    const csvContent = [
      Object.keys(classes[0]).join(','),
      ...classes.map(item => Object.values(item).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'gradebook.csv');
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
                  <TableHead 
                    key={header.id} 
                    className={`px-4 py-3 text-xs font-medium text-[#3e81d4] uppercase tracking-wider ${
                      header.id === "name" ? "text-left" : "text-center"
                    }`}
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody className="bg-white divide-y divide-gray-200">
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map(row => (
                <TableRow 
                  key={row.id} 
                  className="hover:bg-[#3e81d4]/5 cursor-pointer"
                  onClick={() => onClassSelect(row.original)}
                >
                  {row.getVisibleCells().map(cell => (
                    <TableCell 
                        key={cell.id} 
                        className={`px-4 py-3 whitespace-nowrap text-sm text-gray-800 ${
                          cell.column.id === "name" ? "text-left" : "text-center"
                        }`}
                      >
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
          Showing {table.getRowModel().rows.length} of {classes.length} classes
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
    </div>
  );
}