"use client";

import { Card } from "@/components/ui/card";
import { ClassesTable } from "./classes-table";
import AllClassFiltersPopUp from "./AllClassFiltersPopUp";
import { AddClassDialog } from "./AddClassDialog";
import { useState } from "react";
import PageTitleH1 from "../ui/page-title-h1";
import { BookOpen, Users, Calendar, Filter } from "lucide-react";

export default function ClassesPage() {
  const [refreshTime, setRefreshTime] = useState<string>("");

  return (
    <section className="flex flex-col h-full w-full bg-gradient-to-br from-blue-50/30 to-blue-50/20">
      {/* Enhanced Header */}
      <div className="flex justify-between items-center bg-[#79bef2] px-8 py-6 shadow-xl rounded-2xl mx-6 mt-8">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
            <BookOpen className="h-6 w-6 text-white" />
          </div>
          <PageTitleH1 title="Classes" className="text-white font-bold text-2xl" />
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-2">
            <AllClassFiltersPopUp />
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 mx-6 pb-8 space-y-6">
        {/* Action Bar */}
        <div className="flex justify-between items-center mt-2">
          <AddClassDialog setRefreshTime={setRefreshTime} />
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>Manage your classes</span>
            </div>
          </div>
        </div>

        {/* Enhanced Table Card */}
        <Card className="rounded-2xl shadow-xl border-0 bg-white/80 backdrop-blur-sm overflow-hidden">
          <div className="p-6">
            <ClassesTable refreshTime={refreshTime} setRefreshTime={setRefreshTime} />
          </div>
        </Card>
      </div>
    </section>
  );
}
