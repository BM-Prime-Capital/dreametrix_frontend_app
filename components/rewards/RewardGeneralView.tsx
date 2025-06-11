"use client";

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
import { useEffect, useState } from "react";
import NoData from "../ui/no-data";
import { Loader } from "../ui/loader";
import { AttendanceDisplay } from "../ui/AttendanceDisplay";
import PageTitleH1 from "../ui/page-title-h1";
import ClassSelect from "../ClassSelect";
import { Card } from "@/components/ui/card";
import AllRewardFiltersPopUp from "./AllRewardFiltersPopUp";
import { getRewardsGeneralView } from "@/services/RewardsService";
import { useRequestInfo } from "@/hooks/useRequestInfo";
import { localStorageKey } from "@/constants/global";

const globalFilterFn: FilterFn<any> = (row, columnId, filterValue) => {
  const value = row.getValue(columnId);
  return String(value).toLowerCase().includes(filterValue.toLowerCase());
};

interface RewardsGeneralViewProps {
  changeView: (viewName: string, student?: any) => void;
}

export default function RewardsGeneralView({
  changeView,
}: RewardsGeneralViewProps) {
  const {
    tenantDomain: tenantPrimaryDomain,
    accessToken,
    refreshToken,
  } = useRequestInfo();
  const currentClass = JSON.parse(
    localStorage.getItem(localStorageKey.CURRENT_SELECTED_CLASS)!
  );

  const [isLoading, setIsLoading] = useState(false);
  const [rewards, setRewards] = useState<any[]>([]);
  const [rewardsCount, setRewardsCount] = useState(0);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "student",
      header: "STUDENT",
      cell: ({ row }) => (
        <button
          className="text-blue-600 hover:text-blue-800 hover:underline cursor-pointer font-medium"
          onClick={() => handleViewDetails(row.original)}
        >
          {row.getValue("student")}
        </button>
      ),
    },
    {
      accessorKey: "class",
      header: "CLASS",
      cell: ({ row }) => (
        <span className="bg-[#3e81d4]/10 text-[#3e81d4] rounded-full px-3 py-1 text-sm font-medium">
          {row.getValue("class")}
        </span>
      ),
    },
    {
      accessorKey: "attendance",
      header: "ATTENDANCE",
      cell: ({ row }) => (
        <AttendanceDisplay attendance={row.getValue("attendance")} />
      ),
    },
    {
      accessorKey: "pointGained",
      header: "POINTS GAINED",
      cell: ({ row }) => (
        <span className="bg-green-100 text-green-800 rounded-full px-3 py-1 text-sm font-medium">
          {row.getValue("pointGained")}
        </span>
      ),
    },
    {
      accessorKey: "pointLost",
      header: "POINTS LOST",
      cell: ({ row }) => (
        <span className="bg-red-100 text-red-800 rounded-full px-3 py-1 text-sm font-medium">
          {row.getValue("pointLost")}
        </span>
      ),
    },
    {
      accessorKey: "total",
      header: "TOTAL",
      cell: ({ row }) => (
        <span className="bg-[#3e81d4]/10 text-[#3e81d4] rounded-full px-3 py-1 text-sm font-medium font-bold">
          {row.getValue("total")}
        </span>
      ),
    },
    {
      id: "actions",
      header: "ACTIONS",
      enableHiding: false,
      cell: ({ row }) => (
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 hover:bg-[#3e81d4]/10"
          onClick={() => handleViewDetails(row.original)}
        >
          <Eye className="h-3.5 w-3.5 text-[#3e81d4]" />
        </Button>
      ),
    },
  ];

  const table = useReactTable({
    data: rewards,
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

  useEffect(() => {
    const loadRewards = async () => {
      setIsLoading(true);
      try {
        if (!tenantPrimaryDomain || !accessToken || !refreshToken) {
          console.error("Missing authentication credentials");
          return;
        }

        const apiData = await getRewardsGeneralView(
          tenantPrimaryDomain,
          accessToken,
          refreshToken,
          fromDate,
          toDate,
          currentClass?.id
        );

        const transformedData = apiData.classes.flatMap((classItem: any) =>
          classItem.students.map((studentItem: any) => ({
            id: studentItem.student.id,
            student: studentItem.student.name,
            class: classItem.className,
            attendance: studentItem.attendance,
            pointGained: studentItem.pointGained,
            pointLost: studentItem.pointLost,
            total: studentItem.total,
            rawData: studentItem,
          }))
        );

        setRewards(transformedData);
        setRewardsCount(apiData.results);
      } catch (error) {
        console.error("Failed to load rewards:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadRewards();
  }, [
    tenantPrimaryDomain,
    accessToken,
    refreshToken,
    fromDate,
    toDate,
    currentClass?.id,
  ]);

  const handleViewDetails = (student: any) => {
    if (!student?.rawData?.student?.id) {
      console.log("Student data being passed to FocusView:", student.rawData);
      console.error("Invalid student data structure:", student);
      return;
    }
    changeView("FOCUSED_VIEW", student.rawData);
  };

  const handleExport = () => {
    if (rewards.length === 0) return;
    
    const csvContent = [
      Object.keys(rewards[0]).filter(key => key !== 'rawData').join(','),
      ...rewards.map(item => 
        Object.entries(item)
          .filter(([key]) => key !== 'rawData')
          .map(([_, value]) => value)
          .join(',')
      )
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'rewards.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section className="flex flex-col gap-4 w-full">
      {/* Première ligne : Titre à gauche, filtre à droite */}
      <div className="flex justify-between items-center bg-[#3e81d4] px-4 py-3 rounded-md">
        <PageTitleH1 title="Student Rewards" className="text-white" />
        <ClassSelect className="text-white bg-[#3e81d4] hover:bg-[#3e81d4]" />
      </div>

      {/* Deuxième ligne : "Results found" à gauche, dates à droite */}
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-500 ml-1">
          Results found:{" "}
          <span className="font-bold text-primaryText">{rewardsCount}</span>
        </div>

        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">From:</span>
            <input
              className="bg-white border rounded-md p-1 text-sm cursor-pointer"
              type="date"
              onChange={(e) => setFromDate(e.target.value)}
            />
          </label>

          <label className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">To:</span>
            <input
              className="bg-white border rounded-md p-1 text-sm cursor-pointer"
              type="date"
              onChange={(e) => setToDate(e.target.value)}
            />
          </label>
          <AllRewardFiltersPopUp />
        </div>
      </div>

      {/* Filtres et export */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-auto md:flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Filter students..."
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
            disabled={rewards.length === 0}
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
      <Card className="rounded-lg shadow-sm">
        {isLoading ? (
          <div className="p-4 flex justify-center">
            <Loader />
          </div>
        ) : (
          <div className="rounded-lg border border-gray-200 overflow-hidden">
            <Table className="min-w-full">
              <TableHeader className="bg-[#3e81d4]/10">
                {table.getHeaderGroups().map(headerGroup => (
                  <TableRow key={headerGroup.id} className="hover:bg-transparent">
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
                    <TableRow 
                      key={row.id} 
                      className="hover:bg-[#3e81d4]/5 cursor-pointer"
                    >
                      {row.getVisibleCells().map(cell => (
                        <TableCell key={cell.id} className="px-4 py-3 whitespace-nowrap text-sm text-gray-800 text-center">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="px-4 py-3 text-center text-sm text-gray-500">
                      <NoData />
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </Card>

      {/* Pagination */}
      {rewards.length > 0 && (
        <div className="flex flex-col md:flex-row items-center justify-between px-4 py-3 bg-[#3e81d4]/5 rounded-b-lg">
          <div className="text-sm text-[#3e81d4] mb-4 md:mb-0">
            Showing {table.getRowModel().rows.length} of {rewards.length} students
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
      )}
    </section>
  );
}