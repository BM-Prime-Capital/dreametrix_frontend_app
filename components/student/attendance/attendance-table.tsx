"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

import { AttendanceRecord, AttendanceStatus } from "@/types/attendance"
import { Loader2, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface AttendanceTableProps {
  data: AttendanceRecord[];
  loading: boolean;
  error: string | null;
}

export function AttendanceTable({ data, loading, error }: AttendanceTableProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const isToday = date.toDateString() === today.toDateString();
    
    if (isToday) {
      return "TODAY";
    }
    
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const getStatusColor = (status: AttendanceStatus) => {
    switch (status) {
      case AttendanceStatus.PRESENT:
        return "text-[#25AAE1]";
      case AttendanceStatus.LATE:
        return "text-orange-400";
      case AttendanceStatus.ABSENT:
        return "text-red-500";
      case AttendanceStatus.EXCUSED:
        return "text-green-500";
      default:
        return "text-gray-500";
    }
  };

  const getStatusDisplay = (status: AttendanceStatus) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  if (loading) {
    return (
      <div className="w-full flex items-center justify-center py-12">
        <div className="flex items-center gap-3 text-gray-600">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading attendance data...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full py-6">
        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            {error}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="w-full flex items-center justify-center py-12">
        <div className="text-center">
          <div className="text-gray-500 text-lg mb-2">No attendance records found</div>
          <div className="text-gray-400 text-sm">Try selecting a different date or check back later.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <Table>
        <TableHeader>
       <TableRow className="hover:bg-transparent border-b">
            <TableHead className="font-bold text-gray-700 py-4">ID</TableHead>
            <TableHead className="font-bold text-gray-700 py-4">DATE</TableHead>
            <TableHead className="font-bold text-gray-700 py-4">STATUS</TableHead>
            <TableHead className="font-bold text-gray-700 py-4">COURSE</TableHead>
            <TableHead className="font-bold text-gray-700 py-4">TEACHER</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((record, index) => (
            <TableRow key={record.id} className={index % 2 === 0 ? "bg-[#EDF6FA]" : ""}>
              <TableCell className="font-medium text-gray-500">
                #{record.id}
              </TableCell>
              <TableCell className="text-gray-500">
                <span className="text-[#25AAE1] underline">
                  {formatDate(record.date)}
                </span>
              </TableCell>
              <TableCell>
                <span
                  className={`
                    underline font-medium
                    ${getStatusColor(record.status)}
                  `}
                >
                  {getStatusDisplay(record.status)}
                </span>
              </TableCell>
              <TableCell className="text-gray-500">
                <div>
                  <div className="font-semibold text-black">{record.course.name}</div>
                  <div className="text-sm">{record.course.subject.full}</div>
                </div>
              </TableCell>
              <TableCell className="text-gray-500">
                <div>
                  <div className="font-semibold text-black">{record.teacher.name}</div>
                  <div className="text-sm">{record.teacher.email}</div>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

function MessageIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="text-gray-400"
    >
      <path d="M22 2L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path
        d="M22 2L15 22L11 13L2 9L22 2Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

