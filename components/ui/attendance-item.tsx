import { attendanceLabel } from "@/constants/global";
import React, { useState } from "react";

export default function AttendanceItem({
  label,
  isAttendanceDatePast,
}: {
  label: string;
  isAttendanceDatePast: boolean;
}) {
  const [currentAttendanceLabel, setCurrentAttendanceLabel] = useState(label);

  const PRESENT = attendanceLabel.PRESENT;
  const ABSENT = attendanceLabel.ABSENT;
  const LATE = attendanceLabel.LATE;

  const PRESENT_BG_COLOR = isAttendanceDatePast
    ? "bg-gray-300"
    : "bg-bgGreenLight2";

  const ABSENT_BG_COLOR = isAttendanceDatePast
    ? "bg-gray-300"
    : "bg-bgPinkLight2";

  const LATE_BG_COLOR = isAttendanceDatePast ? "bg-gray-300" : "bg-bgYellow";

  function handleClick(attendanceLabel: string): void {
    if (!isAttendanceDatePast) {
      setCurrentAttendanceLabel(attendanceLabel);
    } else {
      alert(
        "This is a past Attendance list, please click the related edit icon to change this record."
      );
    }
  }

  return (
    <div className="flex gap-2">
      <span
        className={`py-2 px-4 rounded-full cursor-pointer ${
          currentAttendanceLabel == PRESENT
            ? PRESENT_BG_COLOR
            : "border-2 border-bgGreenLight2"
        }`}
        onClick={() => handleClick(PRESENT)}
      >
        {PRESENT}
      </span>

      <span
        className={`py-2 px-4 rounded-full cursor-pointer ${
          currentAttendanceLabel == ABSENT
            ? ABSENT_BG_COLOR
            : "border-2 border-bgPinkLight2"
        }`}
        onClick={() => handleClick(ABSENT)}
      >
        {ABSENT}
      </span>

      <span
        className={`py-2 px-4 rounded-full cursor-pointer ${
          currentAttendanceLabel == LATE
            ? LATE_BG_COLOR
            : "border-2 border-bgYellow"
        }`}
        onClick={() => handleClick(LATE)}
      >
        {LATE}
      </span>
    </div>
  );
}
