"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { generalImages } from "@/constants/images";
import Image from "next/image";
import AssignmentStudentsDialog from "./AssignmentStudentsDialog";
import AttendanceItem from "../ui/attendance-item";
import { attendanceLabel } from "@/constants/global";
import { useEffect, useState } from "react";

// This would typically come from your API
const attendances = [
  {
    id: 1,
    name: "Jordan Clever",
    currentAttendance: attendanceLabel.PRESENT,
    presentAttendanceCount: 45,
    absentAttendanceCount: 5,
    lateAttendanceCount: 10,
  },
  {
    id: 2,
    name: "Prince Ilunga",
    subject: "Mathematics",
    currentAttendance: attendanceLabel.PRESENT,
    presentAttendanceCount: 33,
    absentAttendanceCount: 7,
    lateAttendanceCount: 20,
  },
  {
    id: 3,
    name: "Clara Pearl",
    currentAttendance: attendanceLabel.PRESENT,
    presentAttendanceCount: 24,
    absentAttendanceCount: 17,
    lateAttendanceCount: 19,
  },
];

export function AttendanceTable({
  isAttendanceDatePast,
}: {
  isAttendanceDatePast: boolean;
}) {
  return (
    <div className="w-full overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>STUDENT</TableHead>
            <TableHead>ATTENDANCE</TableHead>
            <TableHead>STATISTICS</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {attendances.map((attendance, index) => (
            <TableRow key={attendance.id}>
              <TableCell>{attendance.name}</TableCell>
              <TableCell>
                <AttendanceItem
                  label={attendance.currentAttendance}
                  isAttendanceDatePast={isAttendanceDatePast}
                />
              </TableCell>
              <TableCell>
                <div className="flex gap-8">
                  <span className="border-b-4 border-bgGreenLight2">
                    {attendance.presentAttendanceCount}
                  </span>
                  <span className="border-b-4 border-bgPinkLight2">
                    {attendance.absentAttendanceCount}
                  </span>
                  <span className="border-b-4 border-bgYellow">
                    {attendance.lateAttendanceCount}
                  </span>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
