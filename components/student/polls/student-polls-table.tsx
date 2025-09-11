"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
  Eye,
  Edit,
  Search,
  Filter,
} from "lucide-react";
import { format, isAfter, parseISO } from "date-fns";
import { StudentPoll, PollTableFilters } from "@/types/student-polls";
import { getAvailablePolls } from "@/services/student-polls-service";
import { useRequestInfo } from "@/hooks/useRequestInfo";
import { toast } from "sonner";

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
  }, [polls, filters]);

  const fetchPolls = async () => {
    try {
      setLoading(true);
      const data = await getAvailablePolls(tenantDomain!, accessToken!);
      
      const enrichedPolls = data.map((poll) => {
        const course = courses.find(c => c.id === poll.course);
        const isExpired = isAfter(new Date(), parseISO(poll.deadline));
        
        return {
          ...poll,
          course_name: course?.name || `Course ${poll.course}`,
          is_expired: isExpired,
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

    if (filters.course !== "all") {
      filtered = filtered.filter((poll) => poll.course.toString() === filters.course);
    }

    if (filters.search) {
      filtered = filtered.filter((poll) =>
        poll.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        poll.description.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    setFilteredPolls(filtered);
  };

  const getStatusBadge = (poll: StudentPoll) => {
    if (poll.has_responded) {
      return (
        <Badge className="bg-green-100 text-green-800 border-green-200">
          <CheckCircle className="w-3 h-3 mr-1" />
          Submitted
        </Badge>
      );
    }
    
    if (poll.is_expired) {
      return (
        <Badge className="bg-red-100 text-red-800 border-red-200">
          <AlertTriangle className="w-3 h-3 mr-1" />
          Expired
        </Badge>
      );
    }
    
    return (
      <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
        <Clock className="w-3 h-3 mr-1" />
        Pending
      </Badge>
    );
  };

  const canSubmitPoll = (poll: StudentPoll) => {
    return !poll.has_responded && !poll.is_expired;
  };

  if (loading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center h-32">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-blue-600 rounded-full animate-pulse"></div>
            <div className="w-4 h-4 bg-blue-600 rounded-full animate-pulse animation-delay-200"></div>
            <div className="w-4 h-4 bg-blue-600 rounded-full animate-pulse animation-delay-400"></div>
            <span className="ml-2 text-gray-600">Loading polls...</span>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="rounded-2xl shadow-xl overflow-hidden border-0 bg-white">
      <div className="bg-gradient-to-r from-[#25AAE1] to-[#1D8CB3] p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-white font-bold text-lg flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Available Polls
          </h2>
          <div className="text-white text-sm">
            {filteredPolls.length} of {polls.length} polls
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search polls..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="pl-10 rounded-lg border-gray-300 focus:border-[#25AAE1] focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <Select
            value={filters.status}
            onValueChange={(value) => setFilters({ ...filters, status: value as any })}
          >
            <SelectTrigger className="w-48 rounded-lg border-gray-300 focus:border-[#25AAE1]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent className="rounded-lg">
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="submitted">Submitted</SelectItem>
              <SelectItem value="expired">Expired</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filters.course}
            onValueChange={(value) => setFilters({ ...filters, course: value })}
          >
            <SelectTrigger className="w-48 rounded-lg border-gray-300 focus:border-[#25AAE1]">
              <SelectValue placeholder="Filter by course" />
            </SelectTrigger>
            <SelectContent className="rounded-lg">
              <SelectItem value="all">All Courses</SelectItem>
              {courses.map((course) => (
                <SelectItem key={course.id} value={course.id.toString()}>
                  {course.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {filteredPolls.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <FileText className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <p className="text-lg font-medium mb-2">No polls found</p>
            <p className="text-sm">
              {filters.search || filters.status !== "all" || filters.course !== "all"
                ? "Try adjusting your filters"
                : "No polls are available at this time"}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-gray-200 hover:bg-gray-50">
                  <TableHead className="font-semibold text-gray-700">Poll</TableHead>
                  <TableHead className="font-semibold text-gray-700">Course</TableHead>
                  <TableHead className="font-semibold text-gray-700">Deadline</TableHead>
                  <TableHead className="font-semibold text-gray-700">Status</TableHead>
                  <TableHead className="font-semibold text-gray-700 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPolls.map((poll) => (
                  <TableRow key={poll.id} className="border-gray-200 hover:bg-blue-50/30 transition-colors">
                    <TableCell className="py-4">
                      <div>
                        <div className="font-semibold text-gray-900 mb-1">{poll.title}</div>
                        <div className="text-sm text-gray-600 line-clamp-2">{poll.description}</div>
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <span className="text-sm font-medium text-gray-700">
                        {poll.course_name}
                      </span>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="text-sm">
                        <div className="font-medium text-gray-900">
                          {format(parseISO(poll.deadline), "MMM dd, yyyy")}
                        </div>
                        <div className="text-gray-600">
                          {format(parseISO(poll.deadline), "h:mm a")}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      {getStatusBadge(poll)}
                    </TableCell>
                    <TableCell className="py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onViewDetails(poll)}
                          className="border-gray-300 text-gray-700 hover:bg-gray-50"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        {canSubmitPoll(poll) && (
                          <Button
                            size="sm"
                            onClick={() => onSubmitPoll(poll)}
                            className="bg-[#25AAE1] hover:bg-[#1D8CB3] text-white"
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Submit
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </Card>
  );
}