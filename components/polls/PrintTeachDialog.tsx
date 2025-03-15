"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import Image from "next/image";
import { generalImages } from "@/constants/images";
import { ClassDay } from "@/types";
import Link from "next/link";

export function PrintTeachDialog() {
  const [open, setOpen] = useState(false);
  const [subject, setSubject] = useState<string>("Select Subject");
  const [singleclass, setSingleClass] = useState<string>("Select Class");
  const [type, setType] = useState<string>("Select Type");

  console.log({ subject, singleclass, type });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex gap-2 items-center text-lg bg-blue-500 hover:bg-blue-600 rounded-md  px-2 py-4 lg:px-4 lg:py-6">
          <Image
            src={generalImages.print}
            alt="print"
            width={100}
            height={100}
            className="w-8 h-8"
          />
          <span>Print</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-blue-500">
            Print Teach
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-wrap gap-4 py-4">
          <div className="flex-1 min-w-[200px]">
            <select
              onChange={(e) => setSubject(e.target.value)}
              value={subject}
              className="rounded-full flex h-10 w-full border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option disabled>Select Subject</option>
              <option>Math</option>
              <option>Language</option>
            </select>
          </div>
          <div className="flex-1 min-w-[200px]">
            <select
              onChange={(e) => setSingleClass(e.target.value)}
              value={singleclass}
              className="rounded-full flex h-10 w-full border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option disabled>Select Class</option>
              <option>Class 3 Math</option>
              <option>Class 4 Math</option>
              <option>Grade 3 Language</option>
              <option>Grade 4 Language</option>
            </select>{" "}
          </div>
          <div className="flex-1 min-w-[200px]">
            <select
              onChange={(e) => setType(e.target.value)}
              value={type}
              className="rounded-full flex h-10 w-full border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option disabled>Select Type</option>
              <option>Lesson</option>
              <option>Exam</option>
            </select>{" "}
          </div>
        </div>
        {subject !== "Select Subject" &&
        singleclass !== "Select Class" &&
        type !== "Select Type" ? (
          <div className="flex flex-col gap-1">
            <label className="text-muted-foreground">Files:</label>
            {[1, 2, 3].map((el) => (
              <label key={el} className="flex gap-4">
                <input type="checkbox" />
                <Link
                  href={"/assets/google_search.pdf"}
                  target="_blank"
                  className="text-blue-500 hover:text-blue-700 underline"
                >{`file${el}.pdf`}</Link>
              </label>
            ))}
          </div>
        ) : (
          ""
        )}
        <div className="flex justify-end gap-4 mt-4">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button className="bg-blue-500 hover:bg-blue-600 text-white">
            Print
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
