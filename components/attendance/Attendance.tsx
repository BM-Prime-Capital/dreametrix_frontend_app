"use client";

import React, { useState } from "react";
import AttendanceGeneralView from "./AttendanceGeneralView";
import AttendanceFocusedView from "./AttendanceFocusedView";
import { views } from "@/constants/global";

function Attendance() {
  const [view, setView] = useState<string>(views.GENERAL_VIEW);
  return (
    <>
      {view === views.GENERAL_VIEW ? (
        <AttendanceGeneralView
          changeView={(viewName: string) => setView(viewName)}
        />
      ) : (
        <AttendanceFocusedView
          changeView={(viewName: string) => setView(viewName)}
        />
      )}
    </>
  );
}

export default Attendance;
