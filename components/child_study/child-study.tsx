/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import ChildStudyGeneralView from "./ChildStudyGeneralView";
import ChildStudyFocusedView from "./ChildStudyFocusedView";
import { views } from "@/constants/global";

function ChildStudy() {
  const [view, setView] = useState(views.GENERAL_VIEW);
  const [selectedStudent, setSelectedStudent] = useState(null);

  return (
    <>
      {view === views.GENERAL_VIEW ? (
        <ChildStudyGeneralView
          changeView={(viewName: string, student?: any) => {
            setView(viewName);
            if (student) setSelectedStudent(student);
          }}
        />
      ) : (
        <ChildStudyFocusedView
          student={selectedStudent}
          changeView={(viewName: string) => setView(viewName)}
        />
      )}
    </>
  );
}

export default ChildStudy;