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
import { getAttendances, updateAttendance } from "@/services/AttendanceService";

type Attendance = {};

export function AttendanceTable({
  isAttendanceDatePast,
}: {
  isAttendanceDatePast: boolean;
}) {
  const [attendances, setAttendances] = useState<any>([]);
  const [primaryDomain, setPrimaryDomain] = useState<string>("");
  const [accessToken, setAccessToken] = useState<string>("");
  const [refreshToken, setRefreshToken] = useState<string>("");

  useEffect(() => {
    const accessToken: any = localStorage.getItem("accessToken");
    const refreshToken: any = localStorage.getItem("refreshToken");
    const tenantData: any = localStorage.getItem("tenantData");

    const { primary_domain } = JSON.parse(tenantData);
    const domain = `https://${primary_domain}`;

    setPrimaryDomain(domain);
    setAccessToken(accessToken);
    setRefreshToken(refreshToken);

    const loadAttendance = async () => {
      const data = await getAttendances(domain, accessToken, refreshToken);
      console.log("getAttendances DATA => ", data);
      setAttendances(data);
    };

    loadAttendance();
  }, []);

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
          {attendances.map((attendance: any, index: any) => (
            <TableRow key={attendance.id}>
              <TableCell>{attendance.student}</TableCell>
              <TableCell>
                <AttendanceItem
                  label={attendance.status}
                  isAttendanceDatePast={isAttendanceDatePast}
                  handleChange={(status: string) =>
                    updateAttendance(
                      {
                        id: attendance.id,
                        status: status,
                        student: attendance.student,
                      },
                      primaryDomain,
                      accessToken,
                      refreshToken
                    )
                  }
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
