"use client";

import React, { useState } from "react";

export default function MultiSelectList({
  selectedItems,
  allItems,
  itemsLabel,
}: {
  selectedItems: any[];
  allItems: any[];
  itemsLabel?: string;
}) {
  return (
    <div className="flex flex-col bg-white border-[1px] border-[#eee] rounded-md p-4 gap-4 w-full">
      <div className="flex flex-wrap gap-4 max-h-[125px] overflow-scroll">
        <label className="flex gap-1">
          <input type="checkbox" /> <span>{"Select All"}</span>
        </label>
        {allItems.map((item, index) => (
          <label key={index} className="flex gap-1">
            <input className="item" type="checkbox" /> <span>{item}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
