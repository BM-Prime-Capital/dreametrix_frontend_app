"use client";

import React, { useState } from "react";
import RewardsGeneralView from "./RewardGeneralView";
import RewardsFocusedView from "./RewardFocusedView";
import { views } from "@/constants/global";

function Rewards() {
  const [view, setView] = useState(views.GENERAL_VIEW);
  const [selectedStudent, setSelectedStudent] = useState(null);

  return (
    <>
      {view === views.GENERAL_VIEW ? (
        <RewardsGeneralView
          changeView={(viewName: string, student?: any) => {
            setView(viewName);
            if (student) setSelectedStudent(student);
          }}
        />
      ) : (
        <RewardsFocusedView
          student={selectedStudent}
          changeView={(viewName: string) => setView(viewName)}
        />
      )}
    </>
  );
}

export default Rewards;