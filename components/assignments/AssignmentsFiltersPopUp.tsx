"use client";

import { generalImages } from "@/constants/images";
import Image from "next/image";
import React, { useState } from "react";
import CrossCloseButton from "../ui/cross-close-button";
import ClassSelect from "../ClassSelect";

export default function AssignmentFiltersPopUp() {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col relative">
      <div className="flex items-center gap-8">
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
        <div className="flex flex-col bg-white shadow-md rounded-md p-4 gap-4 w-fit absolute top-8 -left-5 z-10">
          <h2 className="pb-2" style={{ borderBottom: "solid 1px #eee" }}>
            Filter by
          </h2>
          <div className="flex flex-col gap-2 text-gray-600">
            <select
              style={{ border: "solid 1px #eee" }}
              className="px-2 py-1 bg-white rounded-full"
            >
              <option selected disabled>
                Type of Assignment
              </option>
              <option>A1</option>
              <option>A2</option>
              <option>A3</option>
            </select>

            <select
              style={{ border: "solid 1px #eee" }}
              className="px-2 py-1 bg-white rounded-full"
            >
              <option selected disabled>
                Student
              </option>
              <option>S1</option>
              <option>S2</option>
              <option>S3</option>
            </select>
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
