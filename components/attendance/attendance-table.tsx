"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import AttendanceItem from "../ui/attendance-item";
import { getAttendances, updateAttendance } from "@/services/AttendanceService";
import { Loader } from "../ui/loader";
import { useList } from "@/hooks/useList";
import { useRequestInfo } from "@/hooks/useRequestInfo";
import NoData from "../ui/no-data";

export function AttendanceTable({
  isAttendanceDatePast,
}: {
  isAttendanceDatePast: boolean;
}) {
  const { list: attendances, isLoading, error } = useList(getAttendances);
  const { accessToken, refreshToken, tenantDomain } = useRequestInfo();

  const handleUpdateAttendance = async (attendance: any) => {
    if (accessToken && refreshToken && tenantDomain) {
      const response = await updateAttendance(
        attendance,
        tenantDomain!,
        accessToken!,
        refreshToken!
      );
      alert("Attendance updated with success !");
    }
  };

  return (
    <div className="w-full overflow-auto">
      {isLoading ? (
        <Loader />
      ) : (
        <>
          {attendances.lenght > 0 ? (
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
                          handleUpdateAttendance({
                            ...attendance,
                            status: status,
                          })
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
          ) : (
            <NoData />
          )}
        </>
      )}
    </div>
  );
}
