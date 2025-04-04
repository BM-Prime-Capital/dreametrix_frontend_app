"use client";

import { Card } from "@/components/ui/card";
import { AssignmentsTable } from "./assignments-table";
import PageTitleH1 from "@/components/ui/page-title-h1";
import AssignmentFiltersPopUp from "./AssignmentsFiltersPopUp";
import { AddAssignmentDialog } from "./AddAssignmentDialog";

import ClassSelect from "../ClassSelect";

export default function Assignments() {
  return (
    <section className="flex flex-col gap-2 w-full">
      <div className="flex justify-between items-center">
        <PageTitleH1 title="ASSIGNMENTS" />
        <ClassSelect />
      </div>

      <div className="flex items-center justify-between">
        <AddAssignmentDialog />

        <AssignmentFiltersPopUp />
      </div>

      <Card className="rounded-md">
        <AssignmentsTable />
      </Card>
    </section>
  );
}
