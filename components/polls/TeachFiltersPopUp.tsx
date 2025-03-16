"use client";

import { generalImages } from "@/constants/images";
import Image from "next/image";
import React, { useState } from "react";
import CrossCloseButton from "../ui/cross-close-button";
import ClassSelect from "../ClassSelect";

export default function TeachFiltersPopUp() {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col relative">
      <div className="flex items-center gap-8">
        <label>All Dates - All Classes</label>
        <button
          className="flex justify-center items-center bg-white p-1 rounded-md w-7 h-7"
          onClick={() => setOpen(!open)}
        >
          {open ? (
            <CrossCloseButton callBack={() => setOpen(false)} />
          ) : (
            <Image
              src={generalImages.filter}
              alt="add"
              width={100}
              height={100}
              className="w-5 h-5"
            />
          )}
        </button>
      </div>
      {open ? (
        <div className="flex flex-col bg-white shadow-md rounded-md p-4 gap-4 w-fit absolute top-8 right-1 z-10">
          <h2 className="pb-2" style={{ borderBottom: "solid 1px #eee" }}>
            Filter by
          </h2>
          <div className="flex flex-col gap-2 text-gray-600">
            <select
              style={{ border: "solid 1px #eee" }}
              className="px-2 py-1 bg-white rounded-full"
            >
              <option selected disabled>
                Subject
              </option>
              <option>Math</option>
              <option>Language</option>
            </select>

            <ClassSelect />

            <select
              style={{ border: "solid 1px #eee" }}
              className="px-2 py-1 bg-white rounded-full"
            >
              <option selected disabled>
                Type
              </option>
              <option>Type 1</option>
              <option>Type 2</option>
            </select>

            <div
              className="relative p-2 mt-2 rounded-md"
              style={{ border: "solid 1px #eee" }}
            >
              <label className="absolute -top-3 bg-white text-sm">
                Time-Frame
              </label>
              <div className="flex flex-col gap-2">
                <label className="flex items-center justify-between gap-2">
                  <span className="text-muted-foreground">From: </span>
                  <input
                    className="bg-white hover:bg-gray-50 rounded-md p-0.5 cursor-pointer"
                    type="date"
                  />
                </label>
                <label className="flex items-center justify-between gap-2">
                  <span className="text-muted-foreground">To: </span>
                  <input
                    className="bg-white hover:bg-gray-50 rounded-md p-0.5 cursor-pointer"
                    type="date"
                  />
                </label>
              </div>
            </div>
          </div>
          <div className="flex justify-between gap-2">
            <button
              className="max-w-fit rounded-full px-4 hover:bg-gray-100"
              onClick={() => setOpen(false)}
            >
              Cancel
            </button>
            <button className="max-w-fit bg-blue-500 hover:bg-blue-600 text-white rounded-full px-4">
              Apply
            </button>
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
}
