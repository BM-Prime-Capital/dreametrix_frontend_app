"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Eye, BarChart2, Users, Edit2, Trash2, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getPolls } from "./api";
import { useRequestInfo } from "@/hooks/useRequestInfo";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AddPollsDialog } from "./AddPollsDialog";

type Course = {
  id: number;
  name: string;
  subject: string;
  color?: string;
};

type PollStatus = "done" | "pending";

type Poll = {
  id: number;
  title: string;
  course: Course;
  status: PollStatus;
  start_date: string;
  end_date: string;
  responses?: number;
};

type Props = {
  onViewRespondents?: (id: number) => void;
  onViewResults?: (id: number) => void;
};

const subjectColors: Record<string, string> = {
  "Math": "bg-purple-100 text-purple-800",
  "Science": "bg-blue-100 text-blue-800",
  "History": "bg-amber-100 text-amber-800",
  "English": "bg-green-100 text-green-800",
  "Art": "bg-pink-100 text-pink-800",
  "default": "bg-gray-100 text-gray-800"
};

export function PollsTable({ onViewRespondents, onViewResults }: Props) {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [loading, setLoading] = useState(true);
  const { tenantDomain, accessToken } = useRequestInfo();

  useEffect(() => {
    const fetchPolls = async () => {
      try {
        const data = await getPolls(tenantDomain, accessToken);
        const items: Poll[] = Array.isArray(data) ? data : data.results ?? [];
        // Add mock responses count for demo
        const pollsWithResponses = items.map((poll: Poll) => ({
          ...poll,
          responses: Math.floor(Math.random() * 50)
        }));
        setPolls(pollsWithResponses);
      } catch (error) {
        console.error("Error fetching polls:", error);
      } finally {
        setLoading(false);
      }
    };

    if (tenantDomain && accessToken) fetchPolls();
  }, [tenantDomain, accessToken]);

  const getSubjectColor = (subject: string) => {
    return subjectColors[subject] || subjectColors.default;
  };

  const getStatusVariant = (status: PollStatus) => {
    return status === "done" ? "secondary" : "default";
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-16 w-full rounded-lg" />
        ))}
      </div>
    );
  }
  const formatDate = (dateStr?: string) => {
  if (!dateStr) return "N/A";
  const date = new Date(dateStr);
  return isNaN(date.getTime()) ? "N/A" : format(date, 'MMM dd, yyyy');
};


  return (
    <div className="w-full overflow-auto rounded-lg">
      <Table className="border-separate border-spacing-y-2">
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-[200px]">Poll Title</TableHead>
            <TableHead>Subject</TableHead>
            <TableHead>Class</TableHead>
            <TableHead>End Date</TableHead>
            <TableHead>Responses</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {polls.map((poll: Poll) => (
            <TableRow key={poll.id} className="rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <TableCell className="font-medium">
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8 bg-blue-50 text-blue-600">
                    <AvatarFallback>{poll.title.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span>{poll.title}</span>
                </div>
              </TableCell>
              <TableCell>
                <Badge className={`${getSubjectColor(poll.course.subject)} rounded-full`}>
                  {poll.course.subject}
                </Badge>
              </TableCell>
              <TableCell>{poll.course.name}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">
                    <span className="text-gray-500">
                      {formatDate(poll.end_date)}
                    </span>

                  </span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-gray-500" />
                  <span>{poll.responses}</span>
                </div>
              </TableCell>
              <TableCell>
                <Badge 
                  variant={getStatusVariant(poll.status)}
                  className="rounded-full"
                >
                  {poll.status === "done" ? "Completed" : "Active"}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-9 w-9 rounded-full hover:bg-gray-100"
                    onClick={() => onViewResults?.(poll.id)}
                    title="View Results"
                  >
                    <BarChart2 className="h-4 w-4 text-indigo-600" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-9 w-9 rounded-full hover:bg-gray-100"
                    onClick={() => onViewRespondents?.(poll.id)}
                    title="View Respondents"
                  >
                    <Users className="h-4 w-4 text-blue-600" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-9 w-9 rounded-full hover:bg-gray-100"
                    title="Edit"
                  >
                    <Edit2 className="h-4 w-4 text-gray-600" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-9 w-9 rounded-full hover:bg-gray-100"
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-9 w-9 rounded-full hover:bg-gray-100"
                    title="Share"
                  >
                    <Share2 className="h-4 w-4 text-green-600" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      {polls.length === 0 && !loading && (
        <div className="flex flex-col items-center justify-center py-12 gap-4">
          <div className="bg-blue-50 p-6 rounded-full">
            <BarChart2 className="h-10 w-10 text-blue-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900">No polls yet</h3>
          <p className="text-gray-500 text-center max-w-md">
            Create your first poll to start collecting feedback from students and teachers.
          </p>
          <AddPollsDialog />
        </div>
      )}
    </div>
  );
}