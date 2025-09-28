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

interface EnrichedStudentPoll extends StudentPoll {
  hours_until_deadline?: number;
  isUrgent?: boolean;
}

interface PaginatedResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: StudentPoll[];
}
import { StudentPollsTable } from "@/components/student/polls/student-polls-table";
import { PollSubmissionDialog } from "@/components/student/polls/poll-submission-dialog";
import { PollDetailsDialog } from "@/components/student/polls/poll-details-dialog";
import { getAvailablePolls } from "@/services/student-polls-service";
import { useRequestInfo } from "@/hooks/useRequestInfo";
import { differenceInHours, isAfter, parseISO } from "date-fns";

export default function StudentPollsPage() {
  const [selectedPoll, setSelectedPoll] = useState<EnrichedStudentPoll | null>(null);
  const [isSubmissionDialogOpen, setIsSubmissionDialogOpen] = useState(false);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [polls, setPolls] = useState<EnrichedStudentPoll[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrevious, setHasPrevious] = useState(false);
  const itemsPerPage = 10;
  
  const { tenantDomain, accessToken } = useRequestInfo();

  // Fetch polls for stats
  useEffect(() => {
    if (tenantDomain && accessToken) {
      fetchPollsForStats();
    }
  }, [tenantDomain, accessToken, refreshTrigger, currentPage]);

  const fetchPollsForStats = async () => {
    try {
      setLoading(true);
      const response = await getAvailablePolls(tenantDomain!, accessToken!);
      
      // Handle the service response which includes pagination logic
      let pollsData: StudentPoll[];
      let count: number;
      
      if (Array.isArray(response)) {
        // Non-paginated response (fallback)
        pollsData = response;
        count = response.length;
        setHasNext(false);
        setHasPrevious(false);
      } else {
        // The service already handles pagination by returning data.results || data
        pollsData = response as StudentPoll[];
        count = pollsData.length;
        
        // For now, we'll simulate pagination on the frontend
        // In a real implementation, you'd modify the service to accept page parameters
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const paginatedPolls = pollsData.slice(startIndex, endIndex);
        
        const enrichedPolls = paginatedPolls.map((poll) => {
          const isExpired = isAfter(new Date(), parseISO(poll.deadline));
          const hoursUntilDeadline = differenceInHours(parseISO(poll.deadline), new Date());
          const isUrgent = !poll.has_responded && !isExpired && hoursUntilDeadline <= 24;
          
          return {
            ...poll,
            is_expired: isExpired,
            hours_until_deadline: hoursUntilDeadline,
            isUrgent: isUrgent,
          };
        });
        
        setPolls(sortPolls(enrichedPolls));
        
        setTotalCount(count);
        setHasNext(endIndex < count);
        setHasPrevious(currentPage > 1);
        return;
      }
      
      const enrichedPolls = pollsData.map((poll) => {
        const isExpired = isAfter(new Date(), parseISO(poll.deadline));
        const hoursUntilDeadline = differenceInHours(parseISO(poll.deadline), new Date());
        const isUrgent = !poll.has_responded && !isExpired && hoursUntilDeadline <= 24;
        
        return {
          ...poll,
          is_expired: isExpired,
          hours_until_deadline: hoursUntilDeadline,
          isUrgent: isUrgent,
        };
      });
      
      setPolls(sortPolls(enrichedPolls));
      setTotalCount(count);
    } catch (error) {
      console.error("Error fetching polls for stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatsData = () => {
    const total = totalCount || polls.length;
    const pending = polls.filter(p => !p.has_responded && !p.is_expired).length;
    const submitted = polls.filter(p => p.has_responded).length;
    const expired = polls.filter(p => p.is_expired).length;
    const urgent = polls.filter(p => !p.has_responded && !p.is_expired && (p.hours_until_deadline || 0) <= 24).length;
    
    return { total, pending, submitted, expired, urgent };
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  const handleViewDetails = (poll: EnrichedStudentPoll) => {
    setSelectedPoll(poll);
    setIsDetailsDialogOpen(true);
  };

  const handleSubmitPoll = (poll: EnrichedStudentPoll) => {
    setSelectedPoll(poll);
    setIsSubmissionDialogOpen(true);
  };

  const handleSubmissionSuccess = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const handleSubmitFromDetails = (poll: EnrichedStudentPoll) => {
    setIsDetailsDialogOpen(false);
    setSelectedPoll(poll);
    setIsSubmissionDialogOpen(true);
  };

  // Sorting function to prioritize urgent polls and sort by deadline
  const sortPolls = (polls: EnrichedStudentPoll[]): EnrichedStudentPoll[] => {
    return polls.sort((a, b) => {
      // First priority: urgent polls first
      if (a.isUrgent && !b.isUrgent) return -1;
      if (!a.isUrgent && b.isUrgent) return 1;
      
      // Second priority: sort by deadline (earliest first)
      const deadlineA = new Date(a.deadline).getTime();
      const deadlineB = new Date(b.deadline).getTime();
      
      // For urgent polls or equal urgency status, sort by earliest deadline first
      if (deadlineA !== deadlineB) {
        return deadlineA - deadlineB;
      }
      
      // Third priority: pending polls before completed/expired
      if (!a.has_responded && !a.is_expired && (b.has_responded || b.is_expired)) return -1;
      if ((a.has_responded || a.is_expired) && !b.has_responded && !b.is_expired) return 1;
      
      // Final fallback: by poll ID
      return a.id - b.id;
    });
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
        {/* Enhanced Stats Cards - Moved to Top */}
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

        {/* Quick Summary & Actions */}
        <div className="flex items-center justify-between bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
          <div className="flex items-center gap-6">
            <div className="text-gray-700 font-semibold text-lg">Polls Summary</div>
            <div className="flex gap-4 text-sm">
              <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full">
                {getStatsData().pending} Pending
              </span>
              <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full">
                {getStatsData().submitted} Completed
              </span>
              {getStatsData().urgent > 0 && (
                <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full animate-pulse">
                  {getStatsData().urgent} Due Today
                </span>
              )}
            </div>
          </div>
          <div className="flex gap-3">
            <div className="text-sm text-gray-600 bg-blue-50 px-4 py-2 rounded-lg">
              <span className="font-medium">Tip:</span> Submit your polls before the deadline to ensure your responses are recorded
            </div>
          </div>
        </div>
        {/* Main Polls Table */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Your Polls</h2>
                <p className="text-sm text-gray-600 mt-1">View and respond to available polls</p>
              </div>
              <Badge className="bg-blue-100 text-[#25AAE1] border-0 px-3 py-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                {getStatsData().total} Total
              </Badge>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Poll Title
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Course
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Deadline
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center">
                      <div className="flex items-center justify-center">
                        <div className="flex items-center space-x-3">
                          <div className="w-3 h-3 bg-[#25AAE1] rounded-full animate-bounce"></div>
                          <div className="w-3 h-3 bg-[#25AAE1] rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                          <div className="w-3 h-3 bg-[#25AAE1] rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                          <span className="ml-4 text-gray-600 font-medium">Loading your polls...</span>
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : polls.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center">
                      <div className="text-gray-500">
                        <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                        <p className="text-lg font-medium">No polls available</p>
                        <p className="text-sm">Check back later for new polls from your instructors.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  polls.map((poll) => {
                    const isExpired = poll.is_expired || false;
                    const isUrgent = poll.isUrgent || false;
                    
                    return (
                      <tr key={poll.id} className={`hover:bg-gray-50 transition-colors duration-150 ${
                        isUrgent ? "bg-gradient-to-r from-red-50 to-transparent border-l-4 border-red-400" : ""
                      }`}>
                        <td className="px-6 py-4">
                          <div className="flex items-start">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{poll.title}</div>
                              <div className="text-sm text-gray-500 mt-1 max-w-xs truncate">{poll.description}</div>
                            </div>
                            {isUrgent && (
                              <Badge className="ml-2 bg-red-100 text-red-700 border-red-200 animate-pulse">
                                URGENT
                              </Badge>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {poll.course_name || `Course ${poll.course}`}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          <div>
                            <div className="font-medium">
                              {new Date(poll.deadline).toLocaleDateString('en-US', { 
                                month: 'short', 
                                day: 'numeric', 
                                year: 'numeric' 
                              })}
                            </div>
                            <div className="text-xs text-gray-500">
                              {new Date(poll.deadline).toLocaleTimeString('en-US', { 
                                hour: 'numeric', 
                                minute: '2-digit' 
                              })}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {poll.has_responded ? (
                            <Badge className="bg-green-100 text-green-700 border-green-200">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Completed
                            </Badge>
                          ) : isExpired ? (
                            <Badge className="bg-red-100 text-red-700 border-red-200">
                              <AlertTriangle className="h-3 w-3 mr-1" />
                              Expired
                            </Badge>
                          ) : (
                            <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">
                              <Clock className="h-3 w-3 mr-1" />
                              Pending
                            </Badge>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewDetails(poll)}
                              className="text-[#25AAE1] border-[#25AAE1] hover:bg-[#25AAE1] hover:text-white"
                            >
                              View
                            </Button>
                            {!poll.has_responded && !isExpired && (
                              <Button
                                size="sm"
                                onClick={() => handleSubmitPoll(poll)}
                                className="bg-[#25AAE1] hover:bg-[#1D8CB3] text-white"
                              >
                                Submit
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Showing page {currentPage} of {totalPages} ({totalCount} total polls)
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={!hasPrevious}
                    className="text-gray-600 border-gray-300 hover:bg-gray-100"
                  >
                    Previous
                  </Button>
                  
                  <div className="flex items-center space-x-1">
                    {/* Page Numbers */}
                    {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                      let pageNumber;
                      if (totalPages <= 5) {
                        pageNumber = i + 1;
                      } else if (currentPage <= 3) {
                        pageNumber = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNumber = totalPages - 4 + i;
                      } else {
                        pageNumber = currentPage - 2 + i;
                      }
                      
                      return (
                        <Button
                          key={pageNumber}
                          variant={currentPage === pageNumber ? "default" : "outline"}
                          size="sm"
                          onClick={() => handlePageChange(pageNumber)}
                          className={
                            currentPage === pageNumber
                              ? "bg-[#25AAE1] text-white hover:bg-[#1D8CB3]"
                              : "text-gray-600 border-gray-300 hover:bg-gray-100"
                          }
                        >
                          {pageNumber}
                        </Button>
                      );
                    })}
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={!hasNext}
                    className="text-gray-600 border-gray-300 hover:bg-gray-100"
                  >
                    Next
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

       


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