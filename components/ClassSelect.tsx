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
    if (foundClass) {
      localStorage.setItem("selectedClass", JSON.stringify(foundClass));
      setSelectedClass(foundClass);
    }
  };

  useEffect(() => {
    if (loadedClasses) {
      try {
        const allClasses = JSON.parse(loadedClasses);
        setClasses(allClasses);
      } catch (error) {
        console.error("Failed to parse classes from localStorage", error);
      }
    }
  }, [loadedClasses]);

  useEffect(() => {
    if (loadedSelectedClass) {
      try {
        const selectedClass = JSON.parse(loadedSelectedClass);
        setSelectedClass(selectedClass);
      } catch (error) {
        console.error("Failed to parse selected class from localStorage", error);
      }
    }
  }, [loadedSelectedClass]);

  return (
    <div className="relative inline-block">
      <select
        value={selectedClass ? selectedClass.name : ""}
        onChange={(e) => handleClassChange(e.target.value)}
        className={`pl-4 pr-8 py-2.5 text-gray-800 bg-white border-2 border-[#3e81d4]/30 rounded-lg font-semibold cursor-pointer appearance-none transition-all duration-200 hover:border-[#3e81d4]/60 focus:outline-none focus:ring-2 focus:ring-[#3e81d4]/40 focus:border-[#3e81d4] ${className}`}
      >
        <option value={""} className="text-gray-700">
          All Classes
        </option>
        {classes.map((classEl: any, index) => (
          <option
            key={index}
            value={classEl.name}
            className="text-gray-800 hover:bg-[#3e81d4]/10"
          >
            {classEl.name}
          </option>
        ))}
      </select>
      
      {/* Chevron Icon */}
      <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
        <svg
          className="w-5 h-5 text-[#3e81d4]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.5}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>
    </div>
  );
}