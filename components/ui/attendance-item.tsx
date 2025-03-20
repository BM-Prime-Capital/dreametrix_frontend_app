import { attendanceLabel } from "@/constants/global";
import React, { useState } from "react";

export default function AttendanceItem({
  label,
  isAttendanceDatePast,
  handleChange,
}: {
  label: string;
  isAttendanceDatePast: boolean;
  handleChange: Function;
}) {
  const [currentAttendanceLabel, setCurrentAttendanceLabel] = useState(label);

  const PRESENT = attendanceLabel.PRESENT;
  const ABSENT = attendanceLabel.ABSENT;
  const LATE = attendanceLabel.LATE;

  const PRESENT_COLOR = isAttendanceDatePast ? "gray-300" : "bgGreenLight2";
  const ABSENT_COLOR = isAttendanceDatePast ? "gray-300" : "bgPinkLight2";
  const LATE_COLOR = isAttendanceDatePast ? "gray-300" : "bgYellow";

  function handleClick(attendanceLabel: string): void {
    if (!isAttendanceDatePast) {
      setCurrentAttendanceLabel(attendanceLabel);
      handleChange(attendanceLabel.toLowerCase());
    } else {
      alert(
        "This is a past attendance list, please click edit button for any change.\nDon't forget to save you changes."
      );
    }
  }

  return (
    <div className="flex gap-2">
      <span
        className={`py-2 px-4 rounded-full cursor-pointer ${
          currentAttendanceLabel.toLocaleLowerCase() ==
          PRESENT.toLocaleLowerCase()
            ? `bg-${PRESENT_COLOR} text-green-900`
            : `border-2 border-${PRESENT_COLOR}`
        }`}
        onClick={() => handleClick(PRESENT)}
      >
        {PRESENT}
      </span>

      <span
        className={`py-2 px-4 rounded-full cursor-pointer ${
          currentAttendanceLabel.toLocaleLowerCase() ==
          ABSENT.toLocaleLowerCase()
            ? `bg-${ABSENT_COLOR} text-pink-900`
            : `border-2 border-${ABSENT_COLOR}`
        }`}
        onClick={() => handleClick(ABSENT)}
      >
        {ABSENT}
      </span>

      <span
        className={`py-2 px-4 rounded-full cursor-pointer ${
          currentAttendanceLabel.toLocaleLowerCase() == LATE.toLocaleLowerCase()
            ? `bg-[#ffd271] text-yellow-900`
            : `border-2 border-${LATE_COLOR}`
        }`}
        onClick={() => handleClick(LATE)}
      >
        {LATE}
      </span>
    </div>
  );
}
