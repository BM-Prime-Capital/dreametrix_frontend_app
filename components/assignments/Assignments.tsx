import { Card } from "@/components/ui/card";
import { AssignmentsTable } from "./assignments-table";
import PageTitleH1 from "@/components/ui/page-title-h1";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { generalImages } from "@/constants/images";
import AssignmentFiltersPopUp from "./AssignmentsFiltersPopUp";
import { AddAssignmentDialog } from "./AddAssignmentDialog";

export default function Assignments() {
  return (
    <section className="flex flex-col gap-2 w-full p-6">
      <div className="flex justify-between items-center">
        <PageTitleH1 title="ASSIGNMENTS" />
        <div className="flex items-center gap-2">
          <AssignmentFiltersPopUp />
        </div>
      </div>
      <div>
        <AddAssignmentDialog />
      </div>
      <Card className="rounded-md">
        <AssignmentsTable />
      </Card>
    </section>
  );
}
