"use client";

import React, { useState } from "react";
import { views } from "@/constants/global";
import CharacterGeneralView from "./CharacterGeneralView";
import CharacterFocusedView from "./CharracterFocusedView";

function Character() {
  const [view, setView] = useState<string>(views.GENERAL_VIEW);
  return (
    <>
      {view === views.GENERAL_VIEW ? (
        <CharacterGeneralView
          changeView={(viewName: string) => setView(viewName)}
        />
      ) : (
        <CharacterFocusedView
          changeView={(viewName: string) => setView(viewName)}
        />
      )}
    </>
  );
}

export default Character;
