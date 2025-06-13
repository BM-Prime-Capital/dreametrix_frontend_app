"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, Download, Printer, ChevronLeft, ChevronRight } from "lucide-react";
import { Assignment } from "@/app/api/student/assignment/assignment.model";

interface ViewAssignmentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  assignment: Assignment | null;
}
export function ViewAssignmentDialog({
  isOpen,
  onClose,
  assignment,
}: ViewAssignmentDialogProps) {
  const getAssignmentContent = (assignmentName: string) => {
    const content = {
      "Science Homework":
        "Complete Chapter 5 exercises on photosynthesis. Answer questions 1-10 and conduct the leaf experiment.",
      "Math Test":
        "Solve algebraic equations and word problems. Topics: Linear equations, quadratic formulas, and geometry.",
      "Biology Assignment":
        "Research and write a 2-page report on cellular respiration. Include diagrams and references.",
      "Literature Essay":
        "Write a 500-word essay analyzing the main themes in 'Romeo and Juliet'. Focus on love and conflict.",
      "Chemistry Lab Report":
        "Complete the acid-base titration experiment and submit a detailed lab report with observations.",
      "Spanish Vocabulary Quiz":
        "Study vocabulary from Unit 3. Quiz will cover 50 words including verbs, nouns, and adjectives.",
      "Physics Problem Set":
        "Solve problems 1-15 from Chapter 8 on motion and forces. Show all work and calculations.",
    };
    return (
      content[assignmentName as keyof typeof content] ||
      "Assignment details will be displayed here."
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px] p-0 overflow-hidden gap-0 bg-gray-50">
        <DialogHeader className="p-4 pb-2">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-gray-700">Assignment</DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-6 w-6"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
        <div className="px-4 pb-4 space-y-4">
          <div className="text-gray-500 text-sm">
            {assignment?.name}
            <br />
            {assignment?.kind}
          </div>

          <div className="bg-white rounded-lg p-4 min-h-[200px]">
            <div className="text-gray-700 text-sm leading-relaxed">
              {assignment
                ? getAssignmentContent(assignment.name)
                : "Loading assignment..."}
            </div>
          </div>

          <div className="flex justify-center items-center gap-4">
            <Button variant="ghost" size="icon" className="text-purple-500">
              <Download className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-[#25AAE1]">
              <Printer className="h-5 w-5" />
            </Button>
          </div>

          <div className="flex justify-center items-center gap-2 text-sm text-gray-500">
            <Button variant="ghost" size="icon" className="h-6 w-6">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span>1/4</span>
            <Button variant="ghost" size="icon" className="h-6 w-6">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
