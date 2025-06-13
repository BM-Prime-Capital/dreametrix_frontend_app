"use client";

import { localStorageKey } from "@/constants/global";
import { ISchoolClass } from "@/types";

import React, { useEffect, useState } from "react";

export default function ClassSelect({ 
  className, 
  onClassChange 
}: { 
  className?: string;
  onClassChange?: (classId: string | null) => void; 
}) {
  const loadedClasses = localStorage.getItem("classes");
  const loadedSelectedClass = localStorage.getItem(
    localStorageKey.CURRENT_SELECTED_CLASS
  );

  const [classes, setClasses] = useState<any[]>([]);
  const [selectedClass, setSelectedClass] = useState<ISchoolClass | null>(null);

  const handleClassChange = (value: string) => {
    if (value === "") {
      localStorage.removeItem(localStorageKey.CURRENT_SELECTED_CLASS);
      setSelectedClass(null);
      if (onClassChange) onClassChange(null);
      return;
    }

    const foundClass = classes.find((cl) => cl.id === value);
    localStorage.setItem(
      localStorageKey.CURRENT_SELECTED_CLASS,
      JSON.stringify(foundClass)
    );
    setSelectedClass(foundClass);
    if (onClassChange) onClassChange(foundClass?.id || null);
  };

  useEffect(() => {
    if (loadedClasses) {
      try {
        const allClasses = JSON.parse(loadedClasses);
        setClasses(allClasses);
      } catch (error) {
        console.error("Failed to parse classes from localStorage:", error);
        localStorage.removeItem("classes");
      }
    }
  }, [loadedClasses]);

  useEffect(() => {
    if (loadedSelectedClass) {
      if (loadedSelectedClass === "undefined") {
        localStorage.removeItem(localStorageKey.CURRENT_SELECTED_CLASS);
        return;
      }
      const parsed = JSON.parse(loadedSelectedClass);
      setSelectedClass(parsed);
      if (onClassChange) onClassChange(parsed?.id || null);
    }
  }, [loadedSelectedClass]);

  return (
    <select
      value={selectedClass ? selectedClass.id : ""}
      onChange={(e) => handleClassChange(e.target.value)}
      className={`text-white bg-bgPurple font-bold p-1 rounded-md ${className}`}
    >
      <option value={""}>All Classes</option>
      {classes.map((classEl: any, index) => (
        <option key={index} value={classEl.id}>
          {classEl.name}
        </option>
      ))}
    </select>
  );
}