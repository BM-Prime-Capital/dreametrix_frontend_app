"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
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
  Zap,
  Calendar,
  Users,
} from "lucide-react";
import { StudentPoll } from "@/types/student-polls";
import { StudentPollsTable } from "@/components/student/polls/student-polls-table";
import { PollSubmissionDialog } from "@/components/student/polls/poll-submission-dialog";
import { PollDetailsDialog } from "@/components/student/polls/poll-details-dialog";
import { getAvailablePolls } from "@/services/student-polls-service";
import { useRequestInfo } from "@/hooks/useRequestInfo";
import { differenceInHours, isAfter, parseISO } from "date-fns";

export default function StudentPollsPage() {
  const [selectedPoll, setSelectedPoll] = useState<StudentPoll | null>(null);
  const [isSubmissionDialogOpen, setIsSubmissionDialogOpen] = useState(false);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [polls, setPolls] = useState<StudentPoll[]>([]);
  const [loading, setLoading] = useState(true);
  
  const { tenantDomain, accessToken } = useRequestInfo();

  // Fetch polls for stats
  useEffect(() => {
    if (tenantDomain && accessToken) {
      fetchPollsForStats();
    }
  }, [tenantDomain, accessToken, refreshTrigger]);

  const fetchPollsForStats = async () => {
    try {
      setLoading(true);
      const data = await getAvailablePolls(tenantDomain!, accessToken!);
      const enrichedPolls = data.map((poll) => {
        const isExpired = isAfter(new Date(), parseISO(poll.deadline));
        const hoursUntilDeadline = differenceInHours(parseISO(poll.deadline), new Date());
        
        return {
          ...poll,
          is_expired: isExpired,
          hours_until_deadline: hoursUntilDeadline,
        };
      });
      setPolls(enrichedPolls);
    } catch (error) {
      console.error("Error fetching polls for stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatsData = () => {
    const total = polls.length;
    const pending = polls.filter(p => !p.has_responded && !p.is_expired).length;
    const submitted = polls.filter(p => p.has_responded).length;
    const expired = polls.filter(p => p.is_expired).length;
    const urgent = polls.filter(p => !p.has_responded && !p.is_expired && (p.hours_until_deadline || 0) <= 24).length;
    
    return { total, pending, submitted, expired, urgent };
  };

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
        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
          {/* Total Polls Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="relative overflow-hidden border-0 shadow-lg bg-white group hover:shadow-xl transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent opacity-60"></div>
              <div className="relative p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-600 mb-2">Total Polls</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {loading ? (
                        <div className="w-8 h-8 bg-gray-200 rounded animate-pulse"></div>
                      ) : (
                        getStatsData().total
                      )}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">This semester</p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-xl group-hover:scale-110 transition-transform duration-300">
                    <FileText className="h-6 w-6 text-[#25AAE1]" />
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Urgent Polls Card - Priority */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className={`relative overflow-hidden border-0 shadow-lg group hover:shadow-xl transition-all duration-300 ${
              getStatsData().urgent > 0 
                ? "bg-gradient-to-br from-amber-400 to-orange-500 text-white"
                : "bg-white"
            }`}>
              <div className="relative p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm font-semibold mb-2 ${
                      getStatsData().urgent > 0 ? "text-amber-100" : "text-gray-600"
                    }`}>
                      Due Today
                    </p>
                    <p className="text-3xl font-bold">
                      {loading ? (
                        <div className={`w-8 h-8 rounded animate-pulse ${
                          getStatsData().urgent > 0 ? "bg-white/30" : "bg-gray-200"
                        }`}></div>
                      ) : (
                        getStatsData().urgent
                      )}
                    </p>
                    <p className={`text-xs mt-1 ${
                      getStatsData().urgent > 0 ? "text-amber-100" : "text-gray-500"
                    }`}>
                      {getStatsData().urgent > 0 ? "Requires immediate attention" : "All caught up!"}
                    </p>
                  </div>
                  <div className={`p-3 rounded-xl transition-all duration-300 ${
                    getStatsData().urgent > 0 
                      ? "bg-white/20 group-hover:scale-110" 
                      : "bg-amber-100 group-hover:scale-110"
                  }`}>
                    {getStatsData().urgent > 0 ? (
                      <Zap className="h-6 w-6 animate-pulse" />
                    ) : (
                      <Calendar className="h-6 w-6 text-amber-600" />
                    )}
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Pending Polls Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="relative overflow-hidden border-0 shadow-lg bg-white group hover:shadow-xl transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-50 to-transparent opacity-60"></div>
              <div className="relative p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-600 mb-2">Pending</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {loading ? (
                        <div className="w-8 h-8 bg-gray-200 rounded animate-pulse"></div>
                      ) : (
                        getStatsData().pending
                      )}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Awaiting response</p>
                  </div>
                  <div className="p-3 bg-yellow-100 rounded-xl group-hover:scale-110 transition-transform duration-300">
                    <Clock className="h-6 w-6 text-yellow-600" />
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Submitted Polls Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card className="relative overflow-hidden border-0 shadow-lg bg-white group hover:shadow-xl transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-transparent opacity-60"></div>
              <div className="relative p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-600 mb-2">Completed</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {loading ? (
                        <div className="w-8 h-8 bg-gray-200 rounded animate-pulse"></div>
                      ) : (
                        getStatsData().submitted
                      )}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {getStatsData().total > 0 
                        ? `${Math.round((getStatsData().submitted / getStatsData().total) * 100)}% completion rate`
                        : "Great job!"
                      }
                    </p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-xl group-hover:scale-110 transition-transform duration-300">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
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