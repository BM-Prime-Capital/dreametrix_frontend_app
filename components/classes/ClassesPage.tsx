"use client";

import { Card } from "@/components/ui/card";
import { ClassesTable } from "./classes-table";
import AllClassFiltersPopUp from "./AllClassFiltersPopUp";
import { AddClassDialog } from "./AddClassDialog";
import { useState } from "react";
import PageTitleH1 from "../ui/page-title-h1";

export default function ClassesPage() {
  const [refreshTime, setRefreshTime] = useState<string>("");

  return (
    <section className="flex flex-col gap-2 w-full">

      {/* Première ligne : Titre à gauche, filtre à droite */}
      <div className="flex justify-between items-center bg-[#3e81d4] px-4 py-3 rounded-md">
        <PageTitleH1 title="Classes" className="text-white" />
        <AllClassFiltersPopUp />
      </div>

      <div>
        <AddClassDialog setRefreshTime={setRefreshTime} />
      </div>
      <Card className="rounded-lg shadow-sm">
        <ClassesTable refreshTime={refreshTime} setRefreshTime={setRefreshTime} />
      </Card>
    </section>
  );
}
