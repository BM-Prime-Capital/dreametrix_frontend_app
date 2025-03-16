"use client";

import { Card } from "@/components/ui/card";
import { PollsTable } from "./polls-table";
import PageTitleH1 from "@/components/ui/page-title-h1";
import TeachFiltersPopUp from "./TeachFiltersPopUp";
import { AddPollsDialog } from "./AddPollsDialog";
import { PrintTeachDialog } from "./PrintTeachDialog";

export default function Polls() {
  return (
    <section className="flex flex-col gap-2 w-full p-6">
      <div className="flex justify-between items-center">
        <PageTitleH1 title="POLLS" />
        <div className="flex items-center gap-2">
          <TeachFiltersPopUp />
        </div>
      </div>
      <div className="flex gap-4">
        <AddPollsDialog />

        <PrintTeachDialog />
      </div>
      <Card className="rounded-md">
        <PollsTable />
      </Card>
    </section>
  );
}
