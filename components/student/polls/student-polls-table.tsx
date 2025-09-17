"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Clock,
  CheckCircle,
  AlertTriangle,
  FileText,
  Search,
  Filter,
  LayoutGrid,
  List,
  SlidersHorizontal,
  TrendingUp,
} from "lucide-react";
import { format, isAfter, parseISO, differenceInHours } from "date-fns";
import { StudentPoll, PollTableFilters } from "@/types/student-polls";
import { getAvailablePolls } from "@/services/student-polls-service";
import { useRequestInfo } from "@/hooks/useRequestInfo";
import { toast } from "sonner";
import { PollCard } from "./poll-card";

interface StudentPollsTableProps {
  onViewDetails: (poll: StudentPoll) => void;
  onSubmitPoll: (poll: StudentPoll) => void;
  onViewNonRespondents?: (pollId: number) => void;
}

export function StudentPollsTable({
  onViewDetails,
  onSubmitPoll,
  onViewNonRespondents,
}: StudentPollsTableProps) {
  const [polls, setPolls] = useState<StudentPoll[]>([]);
  const [filteredPolls, setFilteredPolls] = useState<StudentPoll[]>([]);
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState<{ id: number; name: string }[]>([]);
  const [viewMode, setViewMode] = useState<"cards" | "list">("cards");
  const [sortBy, setSortBy] = useState<"deadline" | "title" | "status">("deadline");
  const [filters, setFilters] = useState<PollTableFilters>({
    status: "all",
    course: "all",
    search: "",
  });

  const { tenantDomain, accessToken } = useRequestInfo();

  useEffect(() => {
    const savedCourses = localStorage.getItem("classes");
    if (savedCourses) {
      try {
        const parsed = JSON.parse(savedCourses);
        setCourses(parsed || []);
      } catch (error) {
        console.error("Invalid courses in localStorage");
      }
    }
  }, []);

  useEffect(() => {
    if (tenantDomain && accessToken) {
      fetchPolls();
    }
  }, [tenantDomain, accessToken]);

  useEffect(() => {
    applyFilters();
  }, [polls, filters, sortBy]);

  const fetchPolls = async () => {
    try {
      setLoading(true);
      const data = await getAvailablePolls(tenantDomain!, accessToken!);
      
      const enrichedPolls = data.map((poll) => {
        const course = courses.find(c => c.id === poll.course);
        const isExpired = isAfter(new Date(), parseISO(poll.deadline));
        const hoursUntilDeadline = differenceInHours(parseISO(poll.deadline), new Date());
        
        return {
          ...poll,
          course_name: course?.name || `Course ${poll.course}`,
          is_expired: isExpired,
          hours_until_deadline: hoursUntilDeadline,
          urgency_score: isExpired ? 0 : poll.has_responded ? 1 : hoursUntilDeadline <= 2 ? 5 : hoursUntilDeadline <= 24 ? 4 : hoursUntilDeadline <= 48 ? 3 : 2,
        };
      });
      
      setPolls(enrichedPolls);
    } catch (error) {
      console.error("Error fetching polls:", error);
      toast.error("Failed to load polls. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...polls];

    // Apply status filter
    if (filters.status !== "all") {
      filtered = filtered.filter((poll) => {
        switch (filters.status) {
          case "pending":
            return !poll.has_responded && !poll.is_expired;
          case "submitted":
            return poll.has_responded;
          case "expired":
            return poll.is_expired;
          default:
            return true;
        }
      });
    }

    // Apply course filter
    if (filters.course !== "all") {
      filtered = filtered.filter((poll) => poll.course.toString() === filters.course);
    }

    // Apply search filter
    if (filters.search) {
      filtered = filtered.filter((poll) =>
        poll.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        poll.description.toLowerCase().includes(filters.search.toLowerCase()) ||
        poll.course_name?.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "deadline":
          // Priority sorting: urgent first, then by deadline
          // if (a.urgency_score !== b.urgency_score) {
          //   return b.urgency_score - a.urgency_score;
          // }
          return parseISO(a.deadline).getTime() - parseISO(b.deadline).getTime();
        case "title":
          return a.title.localeCompare(b.title);
        case "status":
          if (a.has_responded !== b.has_responded) {
            return a.has_responded ? 1 : -1;
          }
          if (a.is_expired !== b.is_expired) {
            return a.is_expired ? 1 : -1;
          }
          return parseISO(a.deadline).getTime() - parseISO(b.deadline).getTime();
        default:
          return 0;
      }
    });

    setFilteredPolls(filtered);
  };

  const getStatsData = () => {
    const total = polls.length;
    const pending = polls.filter(p => !p.has_responded && !p.is_expired).length;
    const submitted = polls.filter(p => p.has_responded).length;
    const expired = polls.filter(p => p.is_expired).length;
    const urgent = polls.filter(p => !p.has_responded && !p.is_expired).length;
    
    return { total, pending, submitted, expired, urgent };
  };

  const stats = getStatsData();

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-6"
      >
        <Card className="p-8 border-0 shadow-lg bg-white/80 backdrop-blur">
          <div className="flex items-center justify-center">
            <div className="flex items-center space-x-3">
              <motion.div
                className="w-3 h-3 bg-[#25AAE1] rounded-full"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity, delay: 0 }}
              />
              <motion.div
                className="w-3 h-3 bg-[#25AAE1] rounded-full"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
              />
              <motion.div
                className="w-3 h-3 bg-[#25AAE1] rounded-full"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
              />
              <span className="ml-4 text-gray-600 font-medium">Loading your polls...</span>
            </div>
          </div>
        </Card>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Enhanced Header with Stats */}
      <Card className="rounded-2xl shadow-xl overflow-hidden border-0 bg-white">
        <div className="bg-gradient-to-r from-[#25AAE1] to-[#1D8CB3] p-6">
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center gap-3">
              <FileText className="h-6 w-6" />
              <div>
                <h2 className="font-bold text-xl">Your Polls</h2>
                <p className="text-blue-100 text-sm">
                  {stats.urgent > 0 
                    ? `${stats.urgent} poll${stats.urgent > 1 ? 's' : ''} need${stats.urgent === 1 ? 's' : ''} immediate attention`
                    : "Stay on top of your poll responses"
                  }
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">{filteredPolls.length}</div>
              <div className="text-blue-100 text-sm">
                {filteredPolls.length === polls.length ? 'Total polls' : `of ${polls.length} polls`}
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Filter Bar */}
        <div className="p-6 bg-gray-50 border-b border-gray-100">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search polls, courses, or descriptions..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="pl-10 rounded-xl border-gray-200 focus:border-[#25AAE1] focus:ring-2 focus:ring-blue-100 bg-white shadow-sm"
              />
            </div>

            {/* Filters Row */}
            <div className="flex flex-wrap gap-3">
              <Select
                value={filters.status}
                onValueChange={(value) => setFilters({ ...filters, status: value as any })}
              >
                <SelectTrigger className="w-40 rounded-xl border-gray-200 bg-white shadow-sm focus:border-[#25AAE1]">
                  <Filter className="h-4 w-4 mr-2 text-gray-500" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">
                    <div className="flex items-center gap-2">
                      <Clock className="h-3 w-3 text-yellow-600" />
                      Pending
                    </div>
                  </SelectItem>
                  <SelectItem value="submitted">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-3 w-3 text-green-600" />
                      Submitted
                    </div>
                  </SelectItem>
                  <SelectItem value="expired">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-3 w-3 text-red-600" />
                      Expired
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={filters.course}
                onValueChange={(value) => setFilters({ ...filters, course: value })}
              >
                <SelectTrigger className="w-48 rounded-xl border-gray-200 bg-white shadow-sm focus:border-[#25AAE1]">
                  <SelectValue placeholder="All Courses" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="all">All Courses</SelectItem>
                  {courses.map((course) => (
                    <SelectItem key={course.id} value={course.id.toString()}>
                      {course.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={sortBy}
                onValueChange={(value) => setSortBy(value as any)}
              >
                <SelectTrigger className="w-40 rounded-xl border-gray-200 bg-white shadow-sm focus:border-[#25AAE1]">
                  <SlidersHorizontal className="h-4 w-4 mr-2 text-gray-500" />
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="deadline">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-3 w-3" />
                      Urgency
                    </div>
                  </SelectItem>
                  <SelectItem value="title">Title A-Z</SelectItem>
                  <SelectItem value="status">Status</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex items-center gap-1 bg-white rounded-xl border border-gray-200 shadow-sm">
                <Button
                  variant={viewMode === "cards" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("cards")}
                  className={`rounded-l-xl rounded-r-none px-3 ${
                    viewMode === "cards" 
                      ? "bg-[#25AAE1] text-white hover:bg-[#1D8CB3]" 
                      : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                  }`}
                >
                  <LayoutGrid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className={`rounded-r-xl rounded-l-none px-3 ${
                    viewMode === "list" 
                      ? "bg-[#25AAE1] text-white hover:bg-[#1D8CB3]" 
                      : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                  }`}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Active Filters Display */}
          {(filters.search || filters.status !== "all" || filters.course !== "all") && (
            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-200">
              <span className="text-sm text-gray-600 font-medium">Active filters:</span>
              <div className="flex flex-wrap gap-2">
                {filters.search && (
                  <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 cursor-pointer border-blue-200">
                    Search: "{filters.search}"
                  </Badge>
                )}
                {filters.status !== "all" && (
                  <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 cursor-pointer border-blue-200">
                    Status: {filters.status}
                  </Badge>
                )}
                {filters.course !== "all" && (
                  <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 cursor-pointer border-blue-200">
                    Course: {courses.find(c => c.id.toString() === filters.course)?.name}
                  </Badge>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setFilters({ status: "all", course: "all", search: "" })}
                  className="h-6 px-2 text-xs text-gray-500 hover:text-gray-700"
                >
                  Clear all
                </Button>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Polls Content */}
      <AnimatePresence mode="wait">
        {filteredPolls.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="p-12 text-center border-0 shadow-lg bg-white">
              <div className="max-w-md mx-auto">
                <FileText className="h-16 w-16 mx-auto mb-6 text-gray-300" />
                <h3 className="text-xl font-semibold text-gray-900 mb-3">No polls found</h3>
                <p className="text-gray-600 mb-6">
                  {filters.search || filters.status !== "all" || filters.course !== "all"
                    ? "Try adjusting your filters to see more polls."
                    : "No polls are available at this time. Check back later for new polls from your instructors."}
                </p>
                {(filters.search || filters.status !== "all" || filters.course !== "all") && (
                  <Button
                    variant="outline"
                    onClick={() => setFilters({ status: "all", course: "all", search: "" })}
                    className="border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    Clear all filters
                  </Button>
                )}
              </div>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className={viewMode === "cards" 
              ? "grid grid-cols-1 lg:grid-cols-2 gap-6" 
              : "space-y-4"
            }
          >
            {filteredPolls.map((poll, index) => (
              <PollCard
                key={poll.id}
                poll={poll}
                onViewDetails={onViewDetails}
                onSubmitPoll={onSubmitPoll}
                index={index}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}