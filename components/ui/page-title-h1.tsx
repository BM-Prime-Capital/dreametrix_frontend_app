import React from "react";

export default function PageTitleH1({
  title,
  className,
}: {
  title: string;
  className?: string;
}) {
  return (
    <h1
      className={`text-2xl font-bold px-2 ${
        className ? className : "text-primaryText"
      }`}
    >
      {title}
    </h1>
  );
}
