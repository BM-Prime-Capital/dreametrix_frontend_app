"use client";

import React, { useState } from "react";
import CrossCloseButton from "./cross-close-button";

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
      <CrossCloseButton callBack={deleteCallback} />
    </label>
  );
}
