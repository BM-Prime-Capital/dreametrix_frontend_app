"use client";

import { Card } from "@/components/ui/card";
import { GradebookTable } from "./gradebook-table";
import PageTitleH1 from "@/components/ui/page-title-h1";
import { AddGradebookItemDialog } from "./AddGradebookItemDialog";
import { useState } from "react";
import { GradebookClassTable } from "./gradebook-class-table";
import { Button } from "../ui/button";
import Image from "next/image";
import { generalImages } from "@/constants/images";
import ClassSelect from "../ClassSelect";

const classes = [
  {
    id: 1,
    name: "Class 3 - L",
    average: "65%",
    noOfExams: 13,
    noOfTests: 14,
    noOfHomeworks: 15,
    totalWork: 15,
  },
  {
    id: 2,
    name: "Class 3 - M",
    average: "78%",
    noOfExams: 25,
    noOfTests: 14,
    noOfHomeworks: 5,
    totalWork: 12,
  },
  {
    id: 3,
    name: "Class 4 - L",
    average: "78%",
    noOfExams: 25,
    noOfTests: 14,
    noOfHomeworks: 5,
    totalWork: 16,
  },
];

export default function Gradebook() {
  const [currentClass, setCurrentClass] = useState<any>(null);

  return (
    <section className="flex flex-col gap-2 w-full p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <PageTitleH1 title="GRADEBOOK" className="text-[#e91e63]" />
          {currentClass && (
            <h1 className="text-[#e91e63] text-2xl font-bold px-2">
              : {currentClass.name}
            </h1>
          )}
        </div>

        {currentClass && <ClassSelect />}
      </div>
      <div className="flex gap-2">
        <AddGradebookItemDialog />
        {currentClass && (
          <Button className="flex gap-2 items-center text-lg bg-yellow-500 hover:bg-yellow-600 rounded-md  px-2 py-4 lg:px-4 lg:py-6">
            <Image
              src={generalImages.layout}
              alt="add"
              width={100}
              height={100}
              className="w-8 h-8"
            />
            <span>Layout</span>
          </Button>
        )}
      </div>
      <Card className="rounded-md">
        {currentClass ? (
          <GradebookClassTable />
        ) : (
          <GradebookTable classes={classes} setCurrentClass={setCurrentClass} />
        )}
      </Card>
    </section>
  );
}
