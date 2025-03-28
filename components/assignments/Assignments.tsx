"use client";

import { Card } from "@/components/ui/card";
import { AssignmentsTable } from "./assignments-table";
import PageTitleH1 from "@/components/ui/page-title-h1";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { generalImages } from "@/constants/images";
import AssignmentFiltersPopUp from "./AssignmentsFiltersPopUp";
import { AddAssignmentDialog } from "./AddAssignmentDialog";
import ContentViewType from "../layout/ContentViewType";

export default function Assignments() {
  return (
    <section className="flex flex-col gap-2 w-full">
      <ContentViewType>
        <PageTitleH1 title="ASSIGNMENTS" />
      </ContentViewType>
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
