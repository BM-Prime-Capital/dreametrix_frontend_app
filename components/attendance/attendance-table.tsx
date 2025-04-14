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
import { useRequestInfo } from "@/hooks/useRequestInfo";
import NoData from "../ui/no-data";
import { useEffect, useState } from "react";
import { localStorageKey } from "@/constants/global";

export function AttendanceTable({
  isAttendanceDatePast,
  currentDate,
}: {
  isAttendanceDatePast: boolean;
  currentDate: string;
}) {
  const [attendances, setAttendances] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { tenantDomain, accessToken, refreshToken } = useRequestInfo();
  const userData = JSON.parse(localStorage.getItem(localStorageKey.USER_DATA)!);
  const { id: currentClassId } = JSON.parse(
    localStorage.getItem(localStorageKey.CURRENT_SELECTED_CLASS)!
  );

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

  useEffect(() => {
    const loadAttendances = async () => {
      setIsLoading(true);
      if (tenantDomain && accessToken && refreshToken) {
        const data = await getAttendances(
          {
            date: currentDate,
            class_id: currentClassId,
            teacher_id: userData.owner_id,
          },
          tenantDomain,
          accessToken,
          refreshToken
        );

        console.log("ATTENDANCES LOADED => ", data);
        setAttendances(data);
        setIsLoading(false);
      }
    };

    loadAttendances();
  }, [tenantDomain, accessToken, refreshToken, currentDate]);

  return (
    <div className="w-full overflow-auto">
      {isLoading ? (
        <Loader />
      ) : (
        <>
          {attendances.length > 0 ? (
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
                  <TableRow key={attendance.attendance_id}>
                    <TableCell>{attendance.student.user.username}</TableCell>
                    <TableCell>
                      <AttendanceItem
                        label={attendance.status ? attendance.status : "absent"}
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
                          {0} {/* TODO : attendance.presentAttendanceCount */}
                        </span>
                        <span className="border-b-4 border-bgPinkLight2">
                          {0}
                        </span>
                        <span className="border-b-4 border-bgYellow">{0}</span>
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
