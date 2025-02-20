import React from "react";

export default function PageTitleH2({
  title,
  className,
}: {
  title: string;
  className?: string;
}) {
  return (
    <h2 className={`text-xl font-semibold opacity-80 ${className}`}>{title}</h2>
  );
}
