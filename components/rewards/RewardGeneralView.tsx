/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { Eye, Search, ChevronLeft, ChevronRight, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
// import {
//   DropdownMenu,
//   DropdownMenuCheckboxItem,
//   DropdownMenuContent,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
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
      <div className="text-left"> {/* Added text-left wrapper */}
        <button
          className="text-blue-600 hover:text-blue-800 hover:underline cursor-pointer font-medium"
          onClick={() => handleViewDetails(row.original)}
        >
          {row.getValue("student")}
        </button>
      </div>
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
          .map(([, value]) => value)
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
    <section className="flex flex-col h-full w-full bg-gradient-to-br from-amber-50/30 to-orange-50/20">
      {/* Enhanced Header */}
      <div className="flex justify-between items-center bg-[#79bef2] px-8 py-6 shadow-xl rounded-2xl mx-6 mt-8">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
            <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
          </div>
          <div>
            <PageTitleH1 title="Student Rewards" className="text-white font-bold text-2xl" />
            <p className="text-blue-100 text-sm mt-1">Track student points and achievements</p>
          </div>
        </div>
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-2">
          <ClassSelect className="text-white bg-transparent hover:bg-white/10" />
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 mx-6 pb-8 space-y-6">

        {/* Simplified Stats Bar */}
        <div className="flex justify-between items-center bg-white/80 backdrop-blur-sm p-4 rounded-xl shadow-lg mt-2">
          <div className="flex items-center gap-6">
            <div className="text-lg text-gray-700">
              <span className="font-bold text-amber-700 text-2xl">{rewardsCount}</span>
              <span className="text-sm text-gray-600 ml-2">students</span>
            </div>
            <div className="flex items-center gap-3">
              <input
                className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm"
                type="date"
                placeholder="From"
                onChange={(e) => setFromDate(e.target.value)}
              />
              <span className="text-gray-400">to</span>
              <input
                className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm"
                type="date"
                placeholder="To"
                onChange={(e) => setToDate(e.target.value)}
              />
            </div>
          </div>
          <AllRewardFiltersPopUp />
        </div>

        {/* Simplified Search Bar */}
        <div className="flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search students..."
              value={globalFilter ?? ''}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="pl-10 h-10 rounded-lg border-gray-300"
            />
          </div>
          <Button 
            onClick={handleExport}
            className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-lg px-4 py-2"
            disabled={rewards.length === 0}
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>

        {/* Enhanced Table Card */}
        <Card className="rounded-2xl shadow-xl border-0 bg-white/80 backdrop-blur-sm overflow-hidden">
          <div className="p-6">
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
                          <TableHead 
                            key={header.id} 
                            className={`px-4 py-3 text-xs font-medium text-[#3e81d4] uppercase tracking-wider ${
                              header.id === "student" ? "text-left" : "text-center"
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
                        <TableRow key={row.id} className="hover:bg-[#3e81d4]/5 cursor-pointer" onClick={() => handleViewDetails(row.original)}>
                          {row.getVisibleCells().map(cell => (
                            <TableCell 
                              key={cell.id} 
                              className={`px-4 py-3 whitespace-nowrap text-sm text-gray-800 ${
                                cell.column.id === "student" ? "text-left" : "text-center"
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
                          <NoData />
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
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
      </div>
    </section>
  );
}