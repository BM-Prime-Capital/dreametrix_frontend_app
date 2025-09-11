"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  FileText,
  Clock,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
} from "lucide-react";
import { StudentPoll } from "@/types/student-polls";
import { StudentPollsTable } from "@/components/student/polls/student-polls-table";
import { PollSubmissionDialog } from "@/components/student/polls/poll-submission-dialog";
import { PollDetailsDialog } from "@/components/student/polls/poll-details-dialog";

export default function StudentPollsPage() {
  const [selectedPoll, setSelectedPoll] = useState<StudentPoll | null>(null);
  const [isSubmissionDialogOpen, setIsSubmissionDialogOpen] = useState(false);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleViewDetails = (poll: StudentPoll) => {
    setSelectedPoll(poll);
    setIsDetailsDialogOpen(true);
  };

  const handleSubmitPoll = (poll: StudentPoll) => {
    setSelectedPoll(poll);
    setIsSubmissionDialogOpen(true);
  };

  const handleSubmissionSuccess = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const handleSubmitFromDetails = (poll: StudentPoll) => {
    setIsDetailsDialogOpen(false);
    setSelectedPoll(poll);
    setIsSubmissionDialogOpen(true);
  };

  return (
    <div className="flex flex-col gap-6 w-full min-h-screen">
      {/* Header with modern gradient */}
      <div className="bg-gradient-to-r from-[#25AAE1] via-[#25AAE1] to-[#1D8CB3] p-8 rounded-2xl shadow-xl">
        <div className="flex items-center gap-4 text-white">
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/20 p-3 rounded-full transition-all duration-200"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-white tracking-wide mb-1">
              POLLS
            </h1>
            <p className="text-white/80 text-sm">View and respond to available polls</p>
          </div>
        </div>
      </div>

      <section className="flex flex-col gap-6 w-full mx-auto p-6 bg-gradient-to-br from-blue-50 via-white to-blue-100 min-h-screen rounded-2xl">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="p-4 border-0 shadow-lg bg-white/80 backdrop-blur">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="h-5 w-5 text-[#25AAE1]" />
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium">Total Polls</p>
                <p className="text-2xl font-bold text-gray-900">--</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 border-0 shadow-lg bg-white/80 backdrop-blur">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium">Pending</p>
                <p className="text-2xl font-bold text-gray-900">--</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 border-0 shadow-lg bg-white/80 backdrop-blur">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium">Submitted</p>
                <p className="text-2xl font-bold text-gray-900">--</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 border-0 shadow-lg bg-white/80 backdrop-blur">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium">Expired</p>
                <p className="text-2xl font-bold text-gray-900">--</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center justify-between bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="text-gray-700 font-semibold text-lg">Your Polls Dashboard</div>
            <Badge className="bg-blue-100 text-[#25AAE1] border-0 px-3 py-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              Active
            </Badge>
          </div>
          <div className="flex gap-3">
            <div className="text-sm text-gray-600 bg-blue-50 px-4 py-2 rounded-lg">
              <span className="font-medium">Tip:</span> Submit your polls before the deadline to ensure your responses are recorded
            </div>
          </div>
        </div>

        {/* Main Polls Table */}
        <StudentPollsTable
          key={refreshTrigger}
          onViewDetails={handleViewDetails}
          onSubmitPoll={handleSubmitPoll}
        />

        {/* Dialogs */}
        <PollSubmissionDialog
          poll={selectedPoll}
          open={isSubmissionDialogOpen}
          onOpenChange={setIsSubmissionDialogOpen}
          onSubmissionSuccess={handleSubmissionSuccess}
        />

        <PollDetailsDialog
          poll={selectedPoll}
          open={isDetailsDialogOpen}
          onOpenChange={setIsDetailsDialogOpen}
          onSubmitPoll={handleSubmitFromDetails}
        />
      </section>
    </div>
  );
}