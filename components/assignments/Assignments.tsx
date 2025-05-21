"use client";

import { Card } from "@/components/ui/card";
import { AssignmentsTable } from "./assignments-table";
import AssignmentFiltersPopUp from "./AssignmentsFiltersPopUp";
import { AddAssignmentDialog } from "./AddAssignmentDialog";
import ClassSelect from "../ClassSelect";

export default function Assignments() {
  return (
    <section className="flex flex-col gap-2 w-full">

      {/* Première ligne : Titre à gauche, filtre à droite */}
      <div className="flex justify-between items-center bg-[#3e81d4] px-4 py-3 rounded-md">
        <PageTitleH1 title="Assignments" className="text-white" />
        <ClassSelect />
      </div>

      <div className="flex items-center justify-between">
        <AddAssignmentDialog />

        {/* <AssignmentFiltersPopUp /> */}
      </div>

      <Card className="rounded-md">
        <AssignmentsTable />
      </Card>
    </section>
  );
}