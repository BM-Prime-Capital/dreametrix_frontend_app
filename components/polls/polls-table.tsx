"use client";

import { useEffect, useState } from "react";
import { BarChart2, Users, Edit2, Trash2, /* Share2, */ MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getPolls, deletePoll } from "./api";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

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
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [deletingPollId, setDeletingPollId] = useState<number | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [editingPollId, setEditingPollId] = useState<number | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
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
  }, [tenantDomain, accessToken, refreshTrigger]);

  const handlePollCreated = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const handleEdit = (pollId: number) => {
    console.log("handleEdit called with pollId:", pollId);
    setEditingPollId(pollId);
    setShowEditDialog(true);
  };

  const handleDeleteClick = (pollId: number) => {
    console.log("handleDeleteClick called with pollId:", pollId);
    setDeletingPollId(pollId);
    setShowDeleteDialog(true);
    console.log("Dialog state set to true");
  };

  const handleDeleteConfirm = async () => {
    if (!deletingPollId) return;

    try {
      await deletePoll(tenantDomain, accessToken, deletingPollId);
      toast.success("Poll deleted successfully!");
      setRefreshTrigger(prev => prev + 1);
    } catch (error) {
      console.error("Error deleting poll:", error);
      toast.error(error instanceof Error ? error.message : "Failed to delete poll");
    } finally {
      setShowDeleteDialog(false);
      setDeletingPollId(null);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteDialog(false);
    setDeletingPollId(null);
  };

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
          <AddPollsDialog onPollCreated={handlePollCreated} />
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
                    <h5 className="font-medium text-gray-900">{poll.title}</h5>
                    <p className="text-sm text-gray-500">
                      {formatDate(poll.start_date)} - {formatDate(poll.end_date)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-6">
                  {/* <div className="text-center min-w-[80px]">
                    <p className="text-sm text-gray-500">Responses</p>
                    <p className="font-medium">{poll.responses}</p>
                  </div> */}

                  {/* <div className="text-center min-w-[100px]">
                    <p className="text-sm text-gray-500">Status</p>
                    <Badge className={`${statusColors[poll.status]} rounded-full`}>
                      {poll.status === "done" ? "Completed" : poll.status === "pending" ? "Active" : "Draft"}
                    </Badge>
                  </div> */}

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
                        <DropdownMenuItem
                          onSelect={() => {
                            onViewRespondents?.(poll.id);
                          }}
                        >
                          <Users className="h-4 w-4 mr-2 text-blue-600" />
                          Respondents
                        </DropdownMenuItem>
                        {/* <DropdownMenuItem
                          onSelect={() => {
                            handleEdit(poll.id);
                          }}
                        >
                          <Edit2 className="h-4 w-4 mr-2 text-blue-600" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-600 focus:text-red-600"
                          onSelect={() => {
                            handleDeleteClick(poll.id);
                          }}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem> */}
                        {/* <DropdownMenuItem>
                          <Share2 className="h-4 w-4 mr-2 text-blue-600" />
                          Share
                        </DropdownMenuItem> */}
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

      {/* Edit Poll Dialog */}
      {showEditDialog && editingPollId && (
        <AddPollsDialog
          pollId={editingPollId}
          isOpen={showEditDialog}
          onOpenChange={setShowEditDialog}
          onPollCreated={() => {
            setRefreshTrigger(prev => prev + 1);
            setEditingPollId(null);
          }}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the poll
              and remove all associated data including responses.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleDeleteCancel}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
