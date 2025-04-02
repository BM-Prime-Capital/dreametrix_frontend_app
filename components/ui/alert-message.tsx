import React from "react";

export default function AlertMessage({
  content,
  color,
}: {
  content: string;
  color?: string;
}) {
  return (
    <div
      className={`p-2 rounded-md border-[1px] border-[#eee] text-${
        color || "green-500"
      }`}
    >
      {content}
    </div>
  );
}
