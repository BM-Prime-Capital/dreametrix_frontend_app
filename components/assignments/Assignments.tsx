"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { AssignmentsTable } from "./assignments-table";
import { AddAssignmentDialog } from "./AddAssignmentDialog";
import AssignmentDetailView from "./AssignmentDetailView";
import ClassSelect from "../ClassSelect";
import { motion } from "framer-motion";
import PageTitleH1 from "../ui/page-title-h1";
import { FileText, Clock, Target, Filter } from "lucide-react";
import { Assignment } from "@/types";
import {NotebookText} from "lucide-react";

export default function Assignments() {
  const [currentView, setCurrentView] = useState<'list' | 'detail'>('list');
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);

  const handleViewAssignment = (assignment: Assignment) => {
    setSelectedAssignment(assignment);
    setCurrentView('detail');
  };

  const handleBackToList = () => {
    setCurrentView('list');
    setSelectedAssignment(null);
  };

  if (currentView === 'detail' && selectedAssignment) {
    return (
      <AssignmentDetailView
        assignment={selectedAssignment}
        onBack={handleBackToList}
      />
    );
  }
  return (
    <section className="flex flex-col h-full w-full bg-gradient-to-br from-blue-50/30 to-blue-50/20">
      {/* Enhanced Header */}
      <div className="flex justify-between items-center bg-[#79bef2] px-8 py-6 shadow-xl rounded-2xl mx-6 mt-8">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
            <FileText className="h-6 w-6 text-white" />
          </div>
          <PageTitleH1 title="Assignments" className="text-white font-bold text-2xl" />
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 mx-6 pb-8 space-y-6">
        {/* Action Bar */}
        <div className="flex justify-between items-center mt-2">
          <AddAssignmentDialog />
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              <span>Track student progress</span>
            </div>
          </div>
        </div>

        {/* Enhanced Table Card */}
        <Card className="rounded-2xl shadow-xl border-0 bg-white/80 backdrop-blur-sm overflow-hidden">
          <div className="p-6">
            <AssignmentsTable onViewAssignment={handleViewAssignment} />
          </div>
        </Card>
      </div>
    </section>
  );
}
