"use client";

import { generalImages } from "@/constants/images";
import Image from "next/image";
import React, { useState } from "react";

const allUsers = [
  { name: "Prince bakenga" },
  { name: "Rose Mariline" },
  { name: "David Ligth" },
  { name: "Clara Jhonson" },
  { name: "Prince bakenga" },
  { name: "Rose Mariline" },
  { name: "David Ligth" },
  { name: "Clara Jhonson" },
  { name: "Prince bakenga" },
  { name: "Rose Mariline" },
  { name: "David Ligth" },
  { name: "Clara Jhonson" },
];

export default function SelectedUsersPopUp({
  selectedUsers,
  usersLabel,
}: {
  selectedUsers: [];
  usersLabel?: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col relative">
      <div className="flex items-center gap-8">
        <button
          className="flex justify-between items-center w-full bg-white p-1 border-[1px] border-[#eee] rounded-full"
          onClick={() => setOpen(!open)}
        >
          <span>{usersLabel || "Users"} List</span>
          <Image
            src={generalImages.arrow_down}
            width={12}
            height={12}
            alt="arrow_down"
          />
        </button>
      </div>
      {open ? (
        <div className="flex flex-col bg-white shadow-md shadow-gray-400 rounded-md p-4 gap-4 w-full absolute top-8 z-10">
          <h2
            className="pb-2 font-bold"
            style={{ borderBottom: "solid 1px #eee" }}
          >
            Selected {usersLabel || " Users"}
          </h2>
          <div className="flex flex-col gap-2 max-h-[125px] overflow-scroll">
            {allUsers.map((student) => (
              <div className="flex gap-4">
                <label>{student.name}</label>
                <input type="checkbox" />
              </div>
            ))}
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
}
