"use client";

import { useEffect, useState } from "react";
import { BarChart2, Users, Edit2, Trash2, Share2, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getPolls } from "./api";
import { useRequestInfo } from "@/hooks/useRequestInfo";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { AddPollsDialog } from "./AddPollsDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Course = {
  id: number;
  name: string;
  subject: string;
};

type PollStatus = "done" | "pending" | "draft";

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
  onViewGlobal?: () => void;
  className?: string;
};

const statusColors = {
  done: "bg-emerald-100 text-emerald-800",
  pending: "bg-amber-100 text-amber-800",
  draft: "bg-gray-100 text-gray-800"
};

export function PollsTable({ onViewRespondents, onViewResults, onViewGlobal, className }: Props) {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [loading, setLoading] = useState(true);
  const { tenantDomain, accessToken } = useRequestInfo();

  useEffect(() => {
    const fetchPolls = async () => {
      try {
        const data = await getPolls(tenantDomain, accessToken);
        const items: Poll[] = Array.isArray(data) ? data : data.results ?? [];
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

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "N/A";
    const date = new Date(dateStr);
    return isNaN(date.getTime()) ? "N/A" : format(date, 'MMM dd, yyyy');
  };

  return (
    <div className={`space-y-3 w-full ${className}`}>
      <div className="flex justify-between items-center w-full">
        <h2 className="text-xl font-semibold text-gray-900">Your Polls</h2>
        <div className="flex gap-3">
          <AddPollsDialog />
          <Button 
            onClick={onViewGlobal} 
            variant="default"
            className="bg-blue-600 hover:bg-blue-700 shadow-sm"
          >
            Global Results
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="space-y-3 w-full">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-100 w-full">
              <div className="flex items-center space-x-4">
                <Skeleton className="h-10 w-10 rounded-lg" />
                <Skeleton className="h-4 w-32 rounded-md" />
              </div>
              <div className="flex space-x-8">
                <Skeleton className="h-4 w-24 rounded-md" />
                <Skeleton className="h-4 w-24 rounded-md" />
                <Skeleton className="h-4 w-24 rounded-md" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3 w-full">
          {polls.length > 0 ? (
            polls.map((poll) => (
              <div 
                key={poll.id} 
                className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-100 hover:shadow-xs transition-all w-full"
              >
                <div className="flex items-center space-x-4">
                  <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                    <BarChart2 className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{poll.title}</h3>
                    <p className="text-sm text-gray-500">
                      {formatDate(poll.start_date)} - {formatDate(poll.end_date)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-6">
                  <div className="text-center min-w-[80px]">
                    <p className="text-sm text-gray-500">Responses</p>
                    <p className="font-medium">{poll.responses}</p>
                  </div>

                  <div className="text-center min-w-[100px]">
                    <p className="text-sm text-gray-500">Status</p>
                    <Badge className={`${statusColors[poll.status]} rounded-full`}>
                      {poll.status === "done" ? "Completed" : poll.status === "pending" ? "Active" : "Draft"}
                    </Badge>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-blue-600 border-blue-200 hover:bg-blue-50"
                      onClick={() => onViewResults?.(poll.id)}
                    >
                      <BarChart2 className="h-4 w-4 mr-2" />
                      Results
                    </Button>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-9 w-9 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem onClick={() => onViewRespondents?.(poll.id)}>
                          <Users className="h-4 w-4 mr-2 text-blue-600" />
                          Respondents
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit2 className="h-4 w-4 mr-2 text-blue-600" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Share2 className="h-4 w-4 mr-2 text-blue-600" />
                          Share
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-12 gap-4 bg-white rounded-lg border border-gray-100 w-full">
              <div className="p-4 rounded-full bg-blue-50">
                <BarChart2 className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">No polls created yet</h3>
              <p className="text-gray-500 text-center max-w-md">
                Get started by creating your first poll to collect feedback from participants.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}