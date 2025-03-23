"use client";

import { Card } from "@/components/ui/card";
import { ClassesTable } from "./classes-table";
import { Button } from "@/components/ui/button";
import AllClassFiltersPopUp from "./AllClassFiltersPopUp";
import { AddClassDialog } from "./AddClassDialog";
import { useState } from "react";

export default function ClassesPage() {
  const [refreshTime, setRefreshTime] = useState<string>("");
  return (
    <section className="flex flex-col gap-4 w-full p-6 max-w-[1400px] mx-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">CLASSES</h1>
        <AllClassFiltersPopUp />
      </div>
      <div>
        <AddClassDialog setRefreshTime={setRefreshTime} />
      </div>
      <Card className="rounded-lg shadow-sm">
        <ClassesTable refreshTime={refreshTime} />
      </Card>
    </section>
  );
}
