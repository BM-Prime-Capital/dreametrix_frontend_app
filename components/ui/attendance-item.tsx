import { attendanceLabel } from "@/constants/global";
import React, { useState } from "react";

export default function AttendanceItem({ label }: { label: string }) {
  const [currentAttendanceLabel, setCurrentAttendanceLabel] = useState(label);

  const PRESENT = attendanceLabel.PRESENT;
  const ABSENT = attendanceLabel.ABSENT;
  const LATE = attendanceLabel.LATE;

  return (
    <div className="flex gap-2">
      <span
        className={`py-2 px-4 rounded-full cursor-pointer ${
          currentAttendanceLabel == PRESENT
            ? "bg-bgGreenLight2"
            : "border-2 border-bgGreenLight2"
        }`}
        onClick={() => setCurrentAttendanceLabel(PRESENT)}
      >
        {PRESENT}
      </span>

      <span
        className={`py-2 px-4 rounded-full cursor-pointer ${
          currentAttendanceLabel == ABSENT
            ? "bg-bgPinkLight2"
            : "border-2 border-bgPinkLight2"
        }`}
        onClick={() => setCurrentAttendanceLabel(ABSENT)}
      >
        {ABSENT}
      </span>

      <span
        className={`py-2 px-4 rounded-full cursor-pointer ${
          currentAttendanceLabel == LATE
            ? "bg-bgYellow"
            : "border-2 border-bgYellow"
        }`}
        onClick={() => setCurrentAttendanceLabel(LATE)}
      >
        {LATE}
      </span>
    </div>
  );
}
