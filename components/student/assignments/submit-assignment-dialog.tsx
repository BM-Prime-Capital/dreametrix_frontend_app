"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { X, Upload } from "lucide-react";
import { Assignment } from "@/app/api/student/assignment/assignment.model";

interface SubmitAssignmentDialogProps {
  isOpen: boolean;
  onClose: () => void;

  assignment: Assignment | null;
}

export function SubmitAssignmentDialog({
  isOpen,
  onClose,
  assignment,
}: SubmitAssignmentDialogProps) {
  const [message, setMessage] = useState("Hi Teacher,\nThis is my homework.");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSubmitting(false);
    console.log("Assignment submitted:", {
      assignment: assignment?.name,
      message,
      file: selectedFile?.name,
    });
    alert("Assignment submitted successfully!");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px] p-0 overflow-hidden gap-0">
        <DialogHeader className="p-4 pb-2">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-gray-700">Submit</DialogTitle>
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
          <div className="border-t pt-4" />

          <div className="space-y-4">
            <div className="text-gray-500 text-sm">
              {assignment?.name}
              <br />
              {assignment?.kind}
            </div>

            <label className="rounded-full border px-4 py-2 flex items-center text-gray-500 cursor-pointer hover:bg-gray-50 transition-colors">
              <Upload className="h-4 w-4 mr-2" />
              <span>{selectedFile ? selectedFile.name : "Upload"}</span>
              <input
                type="file"
                className="hidden"
                onChange={handleFileUpload}
                accept=".pdf,.doc,.docx,.txt,.jpg,.png"
              />
            </label>

            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="min-h-[100px] resize-none rounded-xl"
            />

            <div className="flex justify-between items-center pt-2">
              <Button variant="ghost" onClick={onClose} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button
                className="bg-[#25AAE1] hover:bg-[#1D8CB3] text-white rounded-full px-8"
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? "SUBMITTING..." : "SUBMIT"}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
