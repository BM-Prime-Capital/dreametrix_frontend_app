"use client";

import React, { useState } from "react";

export default function MultiSelectionItem({
  title,
  deleteCallback,
}: {
  title: string;
  deleteCallback: Function;
}) {
  return (
    <label className="flex gap-4 items-center bg-white rounded-full px-2 py-1">
      <span>{title}</span>
      <span
        className="text-muted-foreground cursor-pointer"
        onClick={() => deleteCallback()}
      >
        &#128473;
      </span>
    </label>
  );
}
