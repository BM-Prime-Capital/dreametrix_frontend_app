"use client";

import { generalImages } from "@/constants/images";
import Image from "next/image";
import React, { useState } from "react";
import CrossCloseButton from "../ui/cross-close-button";
import { motion, AnimatePresence } from "framer-motion";

export default function AssignmentFiltersPopUp() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <div className="flex items-center gap-8">
        <motion.button
          whileTap={{ scale: 0.95 }}
          className="flex justify-center items-center bg-white p-1 rounded-md w-7 h-7 shadow-sm hover:shadow-md transition-shadow"
          onClick={() => setOpen(!open)}
        >
          {open ? (
            <CrossCloseButton callBack={() => setOpen(false)} />
          ) : (
            <Image
              src={generalImages.filter}
              alt="filter"
              width={100}
              height={100}
              className="w-5 h-5"
            />
          )}
        </motion.button>
      </div>

      <AnimatePresence>
        {open && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/10 z-[999]"
              onClick={() => setOpen(false)}
            />
            
            {/* Popup */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="fixed top-[calc(50px+var(--header-height))] right-4 z-[1000] w-64 bg-white rounded-lg shadow-xl border border-gray-100 p-4"
            >
              <h2 className="font-semibold text-gray-900 pb-3 border-b">
                Filter by
              </h2>

              <div className="flex flex-col gap-3 mt-3">
                <select
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option selected disabled>
                    Type of Assignment
                  </option>
                  <option>A1</option>
                  <option>A2</option>
                  <option>A3</option>
                </select>

                <select
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option selected disabled>
                    Student
                  </option>
                  <option>S1</option>
                  <option>S2</option>
                  <option>S3</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 mt-4 pt-3 border-t">
                <button
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-md hover:bg-gray-50"
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </button>
                <button className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600">
                  Apply
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}