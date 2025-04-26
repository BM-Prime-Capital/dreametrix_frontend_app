"use client";
import { useState } from "react";
import PlanGeneralView from "./PlanGeneralView";
import PlanFocusedView from "./PlanFocusedView";
import { views } from "@/constants/global";

export default function Plan() {
  const [view, setView] = useState(views.GENERAL_VIEW);
  const [selectedPlan, setSelectedPlan] = useState(null);

  return (
    <>
      {view === views.GENERAL_VIEW ? (
        <PlanGeneralView
          changeView={(viewName: string, plan?: any) => {
            setView(viewName);
            if (plan) setSelectedPlan(plan);
          }}
        />
      ) : (
        <PlanFocusedView
          plan={selectedPlan}
          changeView={(viewName: string) => setView(viewName)}
        />
      )}
    </>
  );
}