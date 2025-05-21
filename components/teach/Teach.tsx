"use client";

import { Card } from "@/components/ui/card";
import { AssignmentsTable } from "./teach-table";
import PageTitleH1 from "@/components/ui/page-title-h1";
import TeachFiltersPopUp from "./TeachFiltersPopUp";
import { AddTeachDialog } from "./AddTeachDialog";
import { PrintTeachDialog } from "./PrintTeachDialog";

export default function Teach() {
  return (
    <section className="flex flex-col gap-2 w-full">

             <div className="flex justify-between items-center bg-[#3e81d4] px-4 py-3 rounded-md">
                    <PageTitleH1 title="Polls" className="text-white" />
                    <div className="flex items-center gap-2">
                    <TeachFiltersPopUp />
                  </div>
              </div>
      <div className="flex gap-4">
        <AddTeachDialog />

        <PrintTeachDialog />
      </div>
      <Card className="rounded-md">
        <AssignmentsTable />
      </Card>
    </section>
  );
}
