import React from "react";

export default function PageTitleH1({ title }: { title: string }) {
  return <h1 className="text-2xl font-bold px-2 text-primaryText">{title}</h1>;
}
