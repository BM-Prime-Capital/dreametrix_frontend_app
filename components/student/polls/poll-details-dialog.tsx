"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Calendar,
  Clock,
  FileText,
  CheckCircle,
  AlertTriangle,
  Eye,
  X,
  User,
  BookOpen,
} from "lucide-react";
import { format, parseISO, isAfter } from "date-fns";
import { StudentPoll } from "@/types/student-polls";

interface PollDetailsDialogProps {
  poll: StudentPoll | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmitPoll?: (poll: StudentPoll) => void;
}

export function PollDetailsDialog({
  poll,
  open,
  onOpenChange,
  onSubmitPoll,
}: PollDetailsDialogProps) {
  if (!poll) return null;

  const isExpired = poll.is_expired || isAfter(new Date(), parseISO(poll.deadline));
  const canSubmit = !poll.has_responded && !isExpired && onSubmitPoll;

  const getStatusInfo = () => {
    if (poll.has_responded) {
      return {
        icon: CheckCircle,
        color: "text-green-600",
        bgColor: "bg-green-100",
        borderColor: "border-green-200",
        label: "Submitted",
        description: poll.submitted_at 
          ? `Submitted on ${format(parseISO(poll.submitted_at), "MMM dd, yyyy 'at' h:mm a")}`
          : "You have already submitted this poll"
      };
    }
    
    if (isExpired) {
      return {
        icon: AlertTriangle,
        color: "text-red-600",
        bgColor: "bg-red-100",
        borderColor: "border-red-200",
        label: "Expired",
        description: `This poll expired on ${format(parseISO(poll.deadline), "MMM dd, yyyy 'at' h:mm a")}`
      };
    }
    
    return {
      icon: Clock,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
      borderColor: "border-yellow-200",
      label: "Pending",
      description: `Due ${format(parseISO(poll.deadline), "MMM dd, yyyy 'at' h:mm a")}`
    };
  };

  const statusInfo = getStatusInfo();
  const StatusIcon = statusInfo.icon;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden p-0 border-0 rounded-xl">
        <div className="bg-gradient-to-r from-[#25AAE1] to-[#1D8CB3] p-6 rounded-t-xl">
          <DialogHeader>
            <div className="flex items-start justify-between text-white">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <FileText className="h-6 w-6" />
                  <DialogTitle className="text-2xl font-bold text-white">
                    Poll Details
                  </DialogTitle>
                </div>
                <p className="text-blue-100 text-sm">
                  Review poll information and questions
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onOpenChange(false)}
                className="text-white hover:bg-white/20 shrink-0"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </DialogHeader>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            {/* Poll Header */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{poll.title}</h2>
                  <p className="text-gray-600 leading-relaxed">{poll.description}</p>
                </div>
                <Badge className={`${statusInfo.bgColor} ${statusInfo.color} ${statusInfo.borderColor} border`}>
                  <StatusIcon className="w-3 h-3 mr-1" />
                  {statusInfo.label}
                </Badge>
              </div>
              
              <Separator className="my-4" />
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-[#25AAE1]" />
                  <span className="font-medium">Course:</span>
                  <span className="text-gray-700">{poll.course_name || `Course ${poll.course}`}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-[#25AAE1]" />
                  <span className="font-medium">Deadline:</span>
                  <span className="text-gray-700">{format(parseISO(poll.deadline), "MMM dd, yyyy")}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-[#25AAE1]" />
                  <span className="font-medium">Time:</span>
                  <span className="text-gray-700">{format(parseISO(poll.deadline), "h:mm a")}</span>
                </div>
              </div>
              
              {poll.is_anonymous && (
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center gap-2 text-blue-800">
                    <User className="h-4 w-4" />
                    <span className="font-semibold text-sm">Anonymous Poll</span>
                  </div>
                  <p className="text-blue-700 text-sm mt-1">
                    Your identity will not be associated with your responses
                  </p>
                </div>
              )}

              <div className={`mt-4 p-3 ${statusInfo.bgColor} border ${statusInfo.borderColor} rounded-lg`}>
                <div className="flex items-center gap-2">
                  <StatusIcon className={`h-4 w-4 ${statusInfo.color}`} />
                  <span className={`font-semibold text-sm ${statusInfo.color}`}>Status</span>
                </div>
                <p className={`text-sm mt-1 ${statusInfo.color.replace('600', '700')}`}>
                  {statusInfo.description}
                </p>
              </div>
            </div>

            {/* Questions Preview */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <h3 className="text-xl font-semibold text-gray-900">Questions</h3>
                <Badge variant="outline" className="text-xs">
                  {poll.questions.length} question{poll.questions.length !== 1 ? 's' : ''}
                </Badge>
              </div>

              {poll.questions.map((question, index) => (
                <Card key={question.id} className="p-6 border border-gray-200">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Badge variant="outline" className="mt-1 text-xs border-[#25AAE1] text-[#25AAE1]">
                        {index + 1}
                      </Badge>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold text-gray-900 text-lg leading-tight">
                            {question.text}
                          </h4>
                          {question.required && (
                            <Badge className="text-xs bg-red-100 text-red-800 border-red-200">
                              Required
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mb-3">
                          <Badge variant="outline" className="text-xs">
                            {question.question_type === "single" && "Single Choice"}
                            {question.question_type === "multiple" && "Multiple Choice"}
                            {question.question_type === "text" && "Text Response"}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    {question.question_type !== "text" && question.choices && (
                      <div className="ml-8 space-y-2">
                        <p className="text-sm text-gray-600 font-medium mb-2">Available options:</p>
                        <div className="space-y-2">
                          {question.choices.map((choice, choiceIndex) => (
                            <div key={choice.id} className="flex items-center gap-3 p-2 bg-gray-50 rounded-md">
                              <div className="w-4 h-4 border border-gray-300 rounded-sm bg-white"></div>
                              <span className="text-gray-800">{choice.label}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {question.question_type === "text" && (
                      <div className="ml-8">
                        <div className="p-3 bg-gray-50 border border-gray-200 rounded-md">
                          <p className="text-gray-600 text-sm italic">Text response expected</p>
                        </div>
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="sticky bottom-0 bg-white border-t border-gray-200 pt-6 mt-8">
              <div className="flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  className="border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Close
                </Button>
                {canSubmit && (
                  <Button
                    onClick={() => onSubmitPoll(poll)}
                    className="bg-[#25AAE1] hover:bg-[#1D8CB3] text-white"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Submit Responses
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}