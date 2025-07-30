"use client";

import React from "react";
import { useCommunicationData } from "@/hooks/useCommunicationData";

const DebugCommunicationData: React.FC = () => {
  const { classes, students, parents, teachers, loading, error } =
    useCommunicationData();

  if (process.env.NODE_ENV !== "development") {
    return null; // Only show in development
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white border border-gray-300 rounded-lg shadow-lg p-4 max-w-sm max-h-96 overflow-auto z-50">
      <h3 className="font-bold text-sm mb-2">🔍 Communication Data Debug</h3>

      <div className="text-xs space-y-2">
        <div>
          <strong>Status:</strong>{" "}
          {loading ? "Loading..." : error ? `Error: ${error}` : "Loaded"}
        </div>

        <div>
          <strong>Classes ({classes.length}):</strong>
          <ul className="ml-2 text-gray-600">
            {classes.slice(0, 3).map((cls) => (
              <li key={cls.id}>
                • {cls.name} (ID: {cls.id})
              </li>
            ))}
            {classes.length > 3 && <li>... +{classes.length - 3} more</li>}
          </ul>
        </div>

        <div>
          <strong>Students ({students.length}):</strong>
          <ul className="ml-2 text-gray-600">
            {students.slice(0, 3).map((student) => (
              <li key={student.id}>
                • {student.name} ({student.class})
              </li>
            ))}
            {students.length > 3 && <li>... +{students.length - 3} more</li>}
          </ul>
        </div>

        <div>
          <strong>Teachers ({teachers.length}):</strong>
          <ul className="ml-2 text-gray-600">
            {teachers.slice(0, 2).map((teacher) => (
              <li key={teacher.id}>• {teacher.name}</li>
            ))}
            {teachers.length > 2 && <li>... +{teachers.length - 2} more</li>}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DebugCommunicationData;
