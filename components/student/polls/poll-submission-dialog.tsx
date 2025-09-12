"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDrag } from "@use-gesture/react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Clock,
  FileText,
  AlertTriangle,
  CheckCircle,
  Send,
  X,
  Calendar,
  ArrowLeft,
  ArrowRight,
  Save,
  Info,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { format, parseISO, isAfter } from "date-fns";
import { StudentPoll, PollFormData, PollResponse } from "@/types/student-polls";
import { submitPollResponse, getPollDetails } from "@/services/student-polls-service";
import { useRequestInfo } from "@/hooks/useRequestInfo";
import { toast } from "sonner";

interface PollSubmissionDialogProps {
  poll: StudentPoll | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmissionSuccess: () => void;
}

// Utility function for debouncing
const debounce = (func: Function, delay: number) => {
  let timeoutId: NodeJS.Timeout;
  return (...args: any[]) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(null, args), delay);
  };
};

export function PollSubmissionDialog({
  poll,
  open,
  onOpenChange,
  onSubmissionSuccess,
}: PollSubmissionDialogProps) {
  const [formData, setFormData] = useState<PollFormData>({});
  const [submitting, setSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<number, string>>({});
  const [currentStep, setCurrentStep] = useState(0);
  const [pollDetails, setPollDetails] = useState<StudentPoll | null>(null);
  const [loading, setLoading] = useState(false);
  const [isDraftSaving, setIsDraftSaving] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);

  const { tenantDomain, accessToken } = useRequestInfo();

  // Auto-save functionality
  const saveDraft = useCallback(
    debounce(async (pollId: number, data: PollFormData) => {
      if (Object.keys(data).length === 0) return;
      
      try {
        setIsDraftSaving(true);
        localStorage.setItem(`poll_draft_${pollId}`, JSON.stringify(data));
        setTimeout(() => setIsDraftSaving(false), 1000);
      } catch (error) {
        console.error("Error saving draft:", error);
      }
    }, 2000),
    []
  );

  // Load saved draft
  const loadDraft = useCallback((pollId: number) => {
    try {
      const saved = localStorage.getItem(`poll_draft_${pollId}`);
      if (saved) {
        const data = JSON.parse(saved);
        setFormData(data);
        toast.success("Previous draft loaded", { duration: 2000 });
      }
    } catch (error) {
      console.error("Error loading draft:", error);
    }
  }, []);

  // Clear draft after successful submission
  const clearDraft = useCallback((pollId: number) => {
    try {
      localStorage.removeItem(`poll_draft_${pollId}`);
    } catch (error) {
      console.error("Error clearing draft:", error);
    }
  }, []);

  useEffect(() => {
    if (poll && open) {
      resetForm();
      fetchPollDetails();
      loadDraft(poll.id);
    }
  }, [poll, open, loadDraft]);

  // Auto-save when form data changes
  useEffect(() => {
    if (poll && Object.keys(formData).length > 0) {
      saveDraft(poll.id, formData);
    }
  }, [formData, poll, saveDraft]);

  const fetchPollDetails = async () => {
    if (!poll || !tenantDomain || !accessToken) return;
    
    try {
      setLoading(true);
      const details = await getPollDetails(poll.id, tenantDomain, accessToken);
      setPollDetails(details);
    } catch (error) {
      console.error("Error fetching poll details:", error);
      toast.error("Failed to load poll details");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({});
    setValidationErrors({});
    setCurrentStep(0);
    setDragOffset(0);
  };

  const handleInputChange = (questionId: number, value: any) => {
    setFormData(prev => ({
      ...prev,
      [questionId]: value
    }));
    
    // Clear validation error for this question
    if (validationErrors[questionId]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[questionId];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    if (!pollDetails) return false;

    const errors: Record<number, string> = {};

    pollDetails.questions.forEach((question) => {
      if (question.required) {
        const answer = formData[question.id];
        
        if (!answer || 
            (Array.isArray(answer) && answer.length === 0) || 
            (typeof answer === 'string' && answer.trim() === '')) {
          errors[question.id] = "This question is required";
        }
      }
    });

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Enhanced navigation functions
  const nextQuestion = () => {
    if (!pollDetails || currentStep >= pollDetails.questions.length - 1) return;
    setCurrentStep(prev => prev + 1);
  };

  const previousQuestion = () => {
    if (currentStep <= 0) return;
    setCurrentStep(prev => prev - 1);
  };

  const goToQuestion = (index: number) => {
    if (!pollDetails || index < 0 || index >= pollDetails.questions.length) return;
    setCurrentStep(index);
  };

  // Swipe gesture support
  const bind = useDrag(
    ({ last, movement: [mx], direction: [xDir], velocity: [vx] }) => {
      if (last && Math.abs(mx) > 100 && Math.abs(vx) > 0.2) {
        if (xDir > 0) {
          previousQuestion();
        } else {
          nextQuestion();
        }
        setDragOffset(0);
      } else {
        setDragOffset(last ? 0 : mx);
      }
    },
    { axis: 'x', bounds: { left: -200, right: 200 } }
  );

  const handleSubmit = async () => {
    if (!pollDetails || !tenantDomain || !accessToken) return;

    if (!validateForm()) {
      toast.error("Please answer all required questions");
      return;
    }

    if (pollDetails.is_expired || isAfter(new Date(), parseISO(pollDetails.deadline))) {
      toast.error("This poll has expired and can no longer be submitted");
      return;
    }

    setSubmitting(true);
    try {
      const responses: PollResponse[] = pollDetails.questions.map((question) => {
        const answer = formData[question.id];
        
        if (question.question_type === "text") {
          return {
            question: question.id,
            text_response: answer || ""
          };
        } else if (question.question_type === "single") {
          return {
            question: question.id,
            selected_choices: answer ? [answer] : []
          };
        } else {
          return {
            question: question.id,
            selected_choices: Array.isArray(answer) ? answer : []
          };
        }
      });

      await submitPollResponse(pollDetails.id, responses, tenantDomain, accessToken);
      
      // Clear draft on successful submission
      clearDraft(pollDetails.id);
      
      toast.success("Your poll response has been submitted successfully!");
      onSubmissionSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error("Error submitting poll:", error);
      toast.error("Failed to submit poll. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const renderQuestion = (question: any, index: number) => {
    const answer = formData[question.id];
    const hasError = !!validationErrors[question.id];

    return (
      <Card key={question.id} className={`p-6 border ${hasError ? 'border-red-300' : 'border-gray-200'}`}>
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <Badge variant="outline" className="mt-1 text-xs border-[#25AAE1] text-[#25AAE1]">
              {index + 1}
            </Badge>
            <div className="flex-1">
              <Label className="text-lg font-semibold text-gray-900 leading-tight">
                {question.text}
                {question.required && <span className="text-red-500 ml-1">*</span>}
              </Label>
              {question.question_type !== "text" && (
                <p className="text-sm text-gray-600 mt-1">
                  Select {question.question_type === "single" ? "one option" : "one or more options"}
                </p>
              )}
            </div>
          </div>

          <div className="ml-8">
            {question.question_type === "text" && (
              <Textarea
                value={answer || ""}
                onChange={(e) => handleInputChange(question.id, e.target.value)}
                placeholder="Enter your response..."
                className={`min-h-[100px] rounded-lg ${hasError ? 'border-red-300 focus:border-red-400' : 'border-gray-300 focus:border-[#25AAE1]'} focus:ring-2 focus:ring-blue-100`}
              />
            )}

            {question.question_type === "single" && (
              <RadioGroup
                value={answer?.toString() || ""}
                onValueChange={(value) => handleInputChange(question.id, parseInt(value))}
                className="space-y-3"
              >
                {question.choices?.map((choice: any) => (
                  <div key={choice.id} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-blue-50 transition-colors">
                    <RadioGroupItem 
                      value={choice.id.toString()} 
                      className="text-[#25AAE1] border-gray-400"
                    />
                    <Label className="flex-1 cursor-pointer text-gray-800">
                      {choice.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            )}

            {question.question_type === "multiple" && (
              <div className="space-y-3">
                {question.choices?.map((choice: any) => (
                  <div key={choice.id} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-blue-50 transition-colors">
                    <Checkbox
                      checked={Array.isArray(answer) && answer.includes(choice.id)}
                      onCheckedChange={(checked) => {
                        const currentAnswers = Array.isArray(answer) ? answer : [];
                        if (checked) {
                          handleInputChange(question.id, [...currentAnswers, choice.id]);
                        } else {
                          handleInputChange(question.id, currentAnswers.filter((id) => id !== choice.id));
                        }
                      }}
                      className="text-[#25AAE1] border-gray-400"
                    />
                    <Label className="flex-1 cursor-pointer text-gray-800">
                      {choice.label}
                    </Label>
                  </div>
                ))}
              </div>
            )}
          </div>

          {hasError && (
            <div className="ml-8 flex items-center gap-2 text-red-600 text-sm">
              <AlertTriangle className="h-4 w-4" />
              {validationErrors[question.id]}
            </div>
          )}
        </div>
      </Card>
    );
  };

  const getProgress = () => {
    if (!pollDetails) return 0;
    const totalQuestions = pollDetails.questions.length;
    const answeredQuestions = pollDetails.questions.filter(q => {
      const answer = formData[q.id];
      return answer !== undefined && answer !== "" && (!Array.isArray(answer) || answer.length > 0);
    }).length;
    return (answeredQuestions / totalQuestions) * 100;
  };

  if (!poll) return null;

  const isExpired = poll.is_expired || isAfter(new Date(), parseISO(poll.deadline));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden p-0 border-0 rounded-xl">
        <div className="bg-gradient-to-r from-[#25AAE1] to-[#1D8CB3] p-6 rounded-t-xl">
          <DialogHeader>
            <div className="flex items-start justify-between text-white">
              <div className="flex-1">
                <DialogTitle className="text-2xl font-bold text-white mb-2">
                  {poll.title}
                </DialogTitle>
                <p className="text-blue-100 mb-3">{poll.description}</p>
                <div className="flex items-center gap-4 text-sm text-blue-100">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Due: {format(parseISO(poll.deadline), "MMM dd, yyyy 'at' h:mm a")}
                  </div>
                  {poll.is_anonymous && (
                    <Badge className="bg-blue-200 text-blue-800 border-0">
                      Anonymous
                    </Badge>
                  )}
                </div>
              </div>
              {/* <Button
                variant="ghost"
                size="icon"
                onClick={() => onOpenChange(false)}
                className="text-white hover:bg-white/20 shrink-0"
              >
                <X className="h-5 w-5" />
              </Button> */}
            </div>
          </DialogHeader>
        </div>

        {isExpired && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4">
            <div className="flex items-center gap-2 text-red-800">
              <AlertTriangle className="h-5 w-5" />
              <span className="font-semibold">Poll Expired</span>
            </div>
            <p className="text-red-700 text-sm mt-1">
              This poll expired on {format(parseISO(poll.deadline), "MMM dd, yyyy 'at' h:mm a")} and can no longer be submitted.
            </p>
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 border-3 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                <span className="text-gray-600">Loading poll details...</span>
              </div>
            </div>
          ) : pollDetails ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-[#25AAE1]" />
                  <span className="font-semibold text-gray-800">
                    Progress: {pollDetails.questions.filter(q => {
                      const answer = formData[q.id];
                      return answer !== undefined && answer !== "" && (!Array.isArray(answer) || answer.length > 0);
                    }).length} of {pollDetails.questions.length} questions answered
                  </span>
                </div>
                <div className="w-32">
                  <Progress value={getProgress()} className="h-2" />
                </div>
              </div>

              <div className="space-y-6">
                {pollDetails.questions.map((question, index) => renderQuestion(question, index))}
              </div>

              {!isExpired && (
                <div className="sticky bottom-0 bg-white border-t border-gray-200 pt-6 mt-8">
                  <div className="flex justify-end gap-3">
                    <Button
                      variant="outline"
                      onClick={() => onOpenChange(false)}
                      disabled={submitting}
                      className="border-gray-300 text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSubmit}
                      disabled={submitting || Object.keys(validationErrors).length > 0}
                      className="bg-[#25AAE1] hover:bg-[#1D8CB3] text-white px-6"
                    >
                      {submitting ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Submitting...
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Send className="h-4 w-4" />
                          Submit Poll
                        </div>
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p className="text-lg font-medium">Failed to load poll details</p>
              <p className="text-sm">Please try again later</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}