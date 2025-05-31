"use client";

import { localStorageKey } from "@/constants/global";
import { ISchoolClass } from "@/types";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function ClassSelect({ className }: { className?: string }) {
  const loadedClasses = localStorage.getItem("classes");
  const loadedSelectedClass = localStorage.getItem(
    localStorageKey.CURRENT_SELECTED_CLASS
  );

  const [classes, setClasses] = useState<any[]>([]);
  const [selectedClass, setSelectedClass] = useState<ISchoolClass | null>(null);

  const handleClassChange = (value: string) => {
    const foundClass = classes.find((cl) => cl.name === value);
    localStorage.setItem(
      localStorageKey.CURRENT_SELECTED_CLASS,
      JSON.stringify(foundClass)
    );
    setSelectedClass(foundClass);
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
        // First check if it's the string "undefined"
        if (loadedSelectedClass === "undefined") {
          localStorage.removeItem(localStorageKey.CURRENT_SELECTED_CLASS);
          return;
        }
        const parsed = JSON.parse(loadedSelectedClass);
          setSelectedClass(parsed);
        
      
    }
  }, [loadedSelectedClass]);

  return (
    <select
      value={selectedClass ? selectedClass.name : ""}
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