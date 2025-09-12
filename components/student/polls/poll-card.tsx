"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Clock,
  CheckCircle,
  AlertTriangle,
  Eye,
  Edit,
  BookOpen,
  Calendar,
  Users,
  Zap,
  Timer,
} from "lucide-react";
import { format, parseISO, isAfter, differenceInHours, differenceInDays } from "date-fns";
import { StudentPoll } from "@/types/student-polls";

interface PollCardProps {
  poll: StudentPoll;
  onViewDetails: (poll: StudentPoll) => void;
  onSubmitPoll: (poll: StudentPoll) => void;
  index?: number;
}

export function PollCard({ poll, onViewDetails, onSubmitPoll, index = 0 }: PollCardProps) {
  const isExpired = poll.is_expired || isAfter(new Date(), parseISO(poll.deadline));
  const canSubmit = !poll.has_responded && !isExpired;
  
  const getUrgencyInfo = () => {
    if (isExpired || poll.has_responded) return null;
    
    const now = new Date();
    const deadline = parseISO(poll.deadline);
    const hoursUntilDeadline = differenceInHours(deadline, now);
    const daysUntilDeadline = differenceInDays(deadline, now);
    
    if (hoursUntilDeadline <= 2) {
      return {
        level: "critical",
        color: "from-red-500 to-red-600",
        bgColor: "bg-red-50 border-red-200",
        textColor: "text-red-800",
        icon: AlertTriangle,
        message: "Due in less than 2 hours!",
        pulseAnimation: true,
      };
    } else if (hoursUntilDeadline <= 24) {
      return {
        level: "urgent",
        color: "from-amber-500 to-orange-600",
        bgColor: "bg-amber-50 border-amber-200",
        textColor: "text-amber-800",
        icon: Timer,
        message: "Due today!",
        pulseAnimation: false,
      };
    } else if (daysUntilDeadline <= 2) {
      return {
        level: "moderate",
        color: "from-yellow-500 to-yellow-600",
        bgColor: "bg-yellow-50 border-yellow-200",
        textColor: "text-yellow-800",
        icon: Clock,
        message: "Due soon",
        pulseAnimation: false,
      };
    }
    
    return null;
  };

  const getStatusBadge = () => {
    if (poll.has_responded) {
      return (
        <Badge className="bg-green-100 text-green-800 border-green-200 flex items-center gap-1.5 px-3 py-1">
          <CheckCircle className="w-3.5 h-3.5" />
          <span className="font-medium">Completed</span>
        </Badge>
      );
    }
    
    if (isExpired) {
      return (
        <Badge className="bg-red-100 text-red-800 border-red-200 flex items-center gap-1.5 px-3 py-1">
          <AlertTriangle className="w-3.5 h-3.5" />
          <span className="font-medium">Expired</span>
        </Badge>
      );
    }
    
    return (
      <Badge className="bg-blue-100 text-blue-800 border-blue-200 flex items-center gap-1.5 px-3 py-1">
        <Clock className="w-3.5 h-3.5" />
        <span className="font-medium">Pending</span>
      </Badge>
    );
  };

  const formatRelativeTime = (deadline: string) => {
    const now = new Date();
    const deadlineDate = parseISO(deadline);
    const hoursUntil = differenceInHours(deadlineDate, now);
    const daysUntil = differenceInDays(deadlineDate, now);

    if (isAfter(now, deadlineDate)) {
      return "Expired";
    }

    if (hoursUntil < 1) {
      const minutesUntil = Math.max(1, Math.floor((deadlineDate.getTime() - now.getTime()) / 60000));
      return `${minutesUntil} min${minutesUntil !== 1 ? 's' : ''} left`;
    } else if (hoursUntil < 24) {
      return `${hoursUntil} hour${hoursUntil !== 1 ? 's' : ''} left`;
    } else if (daysUntil === 0) {
      return "Due today";
    } else if (daysUntil === 1) {
      return "Due tomorrow";
    } else {
      return `${daysUntil} days left`;
    }
  };

  const urgencyInfo = getUrgencyInfo();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.3, 
        delay: index * 0.1,
        ease: "easeOut"
      }}
      whileHover={{ y: -2 }}
    >
      <Card 
        className={`group relative overflow-hidden transition-all duration-300 border-0 shadow-lg hover:shadow-xl bg-white ${
          urgencyInfo?.pulseAnimation ? 'animate-pulse' : ''
        }`}
      >
        {/* Urgency Banner */}
        {urgencyInfo && (
          <motion.div 
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className={`h-1 bg-gradient-to-r ${urgencyInfo.color} transform origin-left`}
          />
        )}

        <div className="p-6">
          {/* Header Section */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-start gap-3 mb-2">
                <motion.h3 
                  className="text-lg font-semibold text-gray-900 group-hover:text-[#25AAE1] transition-colors duration-200 line-clamp-2 leading-tight"
                  whileHover={{ scale: 1.02 }}
                >
                  {poll.title}
                </motion.h3>
                {urgencyInfo && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", delay: 0.3 }}
                  >
                    <Badge className={`${urgencyInfo.bgColor} ${urgencyInfo.textColor} border flex items-center gap-1 px-2 py-1 text-xs font-medium`}>
                      <urgencyInfo.icon className="w-3 h-3" />
                      {urgencyInfo.message}
                    </Badge>
                  </motion.div>
                )}
              </div>
              <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
                {poll.description}
              </p>
            </div>
            
            <div className="ml-4 flex-shrink-0">
              {getStatusBadge()}
            </div>
          </div>

          {/* Poll Meta Information */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4 text-sm">
            <div className="flex items-center gap-2 text-gray-600">
              <div className="p-1.5 bg-blue-50 rounded-md">
                <BookOpen className="h-3.5 w-3.5 text-[#25AAE1]" />
              </div>
              <span className="font-medium text-gray-700 truncate">
                {poll.course_name || `Course ${poll.course}`}
              </span>
            </div>
            
            <div className="flex items-center gap-2 text-gray-600">
              <div className="p-1.5 bg-blue-50 rounded-md">
                <Calendar className="h-3.5 w-3.5 text-[#25AAE1]" />
              </div>
              <div className="flex flex-col">
                <span className="font-medium text-gray-700">
                  {format(parseISO(poll.deadline), "MMM dd, yyyy")}
                </span>
                <span className="text-xs text-gray-500">
                  {format(parseISO(poll.deadline), "h:mm a")}
                </span>
              </div>
            </div>
          </div>

          {/* Time Until Deadline */}
          <div className="mb-4">
            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${
              urgencyInfo 
                ? `${urgencyInfo.bgColor} ${urgencyInfo.textColor}`
                : poll.has_responded
                  ? "bg-green-50 text-green-700 border border-green-200"
                  : isExpired 
                    ? "bg-gray-100 text-gray-600"
                    : "bg-blue-50 text-blue-700 border border-blue-200"
            }`}>
              <Timer className="w-3.5 h-3.5" />
              {formatRelativeTime(poll.deadline)}
            </div>
          </div>

          {/* Questions Count */}
          <div className="flex items-center gap-2 mb-4 text-sm text-gray-600">
            <Users className="w-4 h-4" />
            <span>
              {poll.questions?.length || 0} question{(poll.questions?.length || 0) !== 1 ? 's' : ''}
            </span>
            {poll.is_anonymous && (
              <>
                <span className="text-gray-400">•</span>
                <span className="text-green-600 font-medium">Anonymous</span>
              </>
            )}
          </div>

          {/* Progress Bar for Partially Completed Polls */}
          {poll.partial_completion && (
            <motion.div 
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ duration: 0.5 }}
              className="mb-4"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-blue-700">
                  Progress: {poll.completion_percentage}%
                </span>
                <span className="text-xs text-gray-500">
                  {Math.floor((poll.completion_percentage || 0) / 100 * (poll.questions?.length || 0))} of {poll.questions?.length || 0} questions
                </span>
              </div>
              <div className="relative">
                <Progress value={poll.completion_percentage} className="h-2" />
                {(poll.completion_percentage || 0) > 0 && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute right-0 -top-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center"
                  >
                    <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewDetails(poll)}
              className="flex items-center gap-2 border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"
            >
              <Eye className="h-4 w-4" />
              <span className="hidden sm:inline">View Details</span>
              <span className="sm:hidden">View</span>
            </Button>
            
            {canSubmit && (
              <motion.div 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1"
              >
                <Button
                  size="sm"
                  onClick={() => onSubmitPoll(poll)}
                  className="w-full bg-gradient-to-r from-[#25AAE1] to-[#1D8CB3] hover:from-[#1D8CB3] hover:to-[#0F6A8A] text-white shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2"
                >
                  {poll.partial_completion ? (
                    <>
                      <Edit className="h-4 w-4" />
                      <span className="hidden sm:inline">Continue Response</span>
                      <span className="sm:hidden">Continue</span>
                    </>
                  ) : (
                    <>
                      <Zap className="h-4 w-4" />
                      <span className="hidden sm:inline">Submit Response</span>
                      <span className="sm:hidden">Submit</span>
                    </>
                  )}
                </Button>
              </motion.div>
            )}
            
            {poll.has_responded && (
              <div className="flex-1 flex items-center justify-center py-2 px-4 bg-green-50 rounded-md border border-green-200">
                <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                <span className="text-sm font-medium text-green-700">
                  {poll.submitted_at 
                    ? `Submitted ${format(parseISO(poll.submitted_at), "MMM dd")}`
                    : "Submitted"
                  }
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Hover Effect Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-blue-600/0 group-hover:from-blue-500/5 group-hover:to-blue-600/10 transition-all duration-300 pointer-events-none rounded-lg"></div>
      </Card>
    </motion.div>
  );
}