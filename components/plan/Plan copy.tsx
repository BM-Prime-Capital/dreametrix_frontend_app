"use client";
import { useState } from "react";
import InitialScreen from "./InitialScreen";
import PlanGeneralView from "./PlanGeneralView";
import { views } from "@/constants/global";

export default function Plan() {
  const [view, setView] = useState(views.GENERAL_VIEW);
  const [selectedPlan, setSelectedPlan] = useState(null);

  return (
    <>
      {view === views.GENERAL_VIEW ? (
        <InitialScreen
          changeView={(viewName: string, plan?: any) => {
            setView(viewName);
            if (plan) setSelectedPlan(plan);
          }}
        />
      ) : (
        <PlanGeneralView
          plan={selectedPlan}
          changeView={(viewName: string) => setView(viewName)}
        />
      )}
    </>
  );
}
