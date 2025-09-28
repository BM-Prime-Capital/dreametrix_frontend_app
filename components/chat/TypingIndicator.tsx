"use client";

import React from "react";
import { TypingIndicator } from "@/services/websocket-service";

interface TypingIndicatorComponentProps {
  typing: TypingIndicator[];
  className?: string;
}

const TypingIndicatorComponent: React.FC<TypingIndicatorComponentProps> = ({
  typing,
  className = "",
}) => {
  if (typing.length === 0) return null;

  const getTypingText = () => {
    const names = typing.map((t) => t.user_name);

    if (names.length === 1) {
      return `${names[0]} est en train d'écrire...`;
    } else if (names.length === 2) {
      return `${names[0]} et ${names[1]} sont en train d'écrire...`;
    } else {
      return `${names[0]} et ${
        names.length - 1
      } autres sont en train d'écrire...`;
    }
  };

  return (
    <div
      className={`flex items-center gap-2 text-sm text-gray-500 animate-pulse ${className}`}
    >
      <div className="flex gap-1">
        <div
          className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
          style={{ animationDelay: "0ms" }}
        ></div>
        <div
          className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
          style={{ animationDelay: "150ms" }}
        ></div>
        <div
          className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
          style={{ animationDelay: "300ms" }}
        ></div>
      </div>
      <span className="italic">{getTypingText()}</span>
    </div>
  );
};

export default TypingIndicatorComponent;
