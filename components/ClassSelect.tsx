/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { localStorageKey } from "@/constants/global";
import { ISchoolClass } from "@/types";

import React, { useEffect, useState } from "react";

export default function ClassSelect({
  className,
  onClassChange,
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

    // Convert string value to number for comparison
    const numericValue = parseInt(value);
    const foundClass = classes.find((cl) => cl.id === numericValue);
    localStorage.setItem(
      localStorageKey.CURRENT_SELECTED_CLASS,
      JSON.stringify(foundClass)
    );
    setSelectedClass(foundClass);
    // Pass the string version of the ID to maintain consistency
    if (onClassChange) onClassChange(foundClass?.id?.toString() || null);
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
      try {
        const parsed = JSON.parse(loadedSelectedClass);
        setSelectedClass(parsed);
        // Pass the string version of the ID to maintain consistency
        if (onClassChange) onClassChange(parsed?.id?.toString() || null);
      } catch (error) {
        console.error(
          "Failed to parse selected class from localStorage:",
          error
        );
        localStorage.removeItem(localStorageKey.CURRENT_SELECTED_CLASS);
      }
    }
  }, [loadedSelectedClass, onClassChange]);

  return (
    <select
      value={selectedClass?.id?.toString() || ""}
      onChange={(e) => handleClassChange(e.target.value)}
      className={`text-white bg-bgPurple font-bold p-1 rounded-md ${className}`}
    >
      <option value={""}>All Classes</option>
      {classes.map((classEl: any, index) => (
        <option key={index} value={classEl.id?.toString()}>
          {classEl.name}
        </option>
      ))}
    </select>
  );
}
