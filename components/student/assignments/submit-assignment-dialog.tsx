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
import { X, Upload, FileText, AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import { Assignment } from "@/app/api/student/assignment/assignment.model";
import { submitAssignment } from "@/services/AssignmentService";
import { useRequestInfo } from "@/hooks/useRequestInfo";
import { toast } from "@/hooks/use-toast";

interface SubmitAssignmentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  assignment: Assignment | null;
  onSuccess?: () => void;
}

export function SubmitAssignmentDialog({
  isOpen,
  onClose,
  assignment,
  onSuccess,
}: SubmitAssignmentDialogProps) {
  const [message, setMessage] = useState("Hi Teacher,\nThis is my homework.");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<{ file?: string; message?: string }>({});
  const { accessToken, tenantDomain } = useRequestInfo();

  const validateForm = () => {
    const newErrors: { file?: string; message?: string } = {};

    if (!selectedFile) {
      newErrors.file = "Please select a file to upload";
    } else {
      // Vérifier la taille du fichier (max 10MB)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (selectedFile.size > maxSize) {
        newErrors.file = "File size must be less than 10MB";
      }

      // Vérifier le type de fichier
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain',
        'image/jpeg',
        'image/png',
        'image/jpg'
      ];
      
      if (!allowedTypes.includes(selectedFile.type)) {
        newErrors.file = "Please select a valid file type (PDF, DOC, DOCX, TXT, JPG, PNG)";
      }
    }

    if (!message.trim()) {
      newErrors.message = "Please add a message";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      // Clear file error when user selects a file
      if (errors.file) {
        setErrors(prev => ({ ...prev, file: undefined }));
      }
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    if (!assignment || !selectedFile || !accessToken || !tenantDomain) {
      toast({
        title: "Error",
        description: "Missing required information for submission",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      await submitAssignment(
        assignment.id,
        tenantDomain,
        accessToken,
        selectedFile,
        assignment.course.id
      );

      toast({
        title: "Success!",
        description: "Your assignment has been submitted successfully",
        variant: "default",
      });

      // Reset form
      setMessage("Hi Teacher,\nThis is my homework.");
      setSelectedFile(null);
      setErrors({});

      // Call success callback
      onSuccess?.();
      
      // Close dialog
      onClose();

    } catch (error) {
      console.error("Submission error:", error);
      
      const errorMessage = error instanceof Error 
        ? error.message 
        : "Failed to submit assignment. Please try again.";

      toast({
        title: "Submission Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setMessage("Hi Teacher,\nThis is my homework.");
      setSelectedFile(null);
      setErrors({});
      onClose();
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden gap-0">
        <DialogHeader className="p-6 pb-4 bg-gradient-to-r from-[#25AAE1] to-[#1D8CB3] text-white">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-white text-xl font-bold">
              Submit Assignment
            </DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              className="h-8 w-8 text-white hover:bg-white/20"
              disabled={isSubmitting}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </DialogHeader>

        <div className="p-6 space-y-6">
          {/* Assignment Info */}
          <div className="bg-gray-50 rounded-xl p-4">
            <h3 className="font-semibold text-gray-800 mb-2">Assignment Details</h3>
            <div className="space-y-1 text-sm text-gray-600">
              <p><span className="font-medium">Name:</span> {assignment?.name}</p>
              <p><span className="font-medium">Type:</span> {assignment?.kind}</p>
              {assignment?.due_date && (
                <p><span className="font-medium">Due Date:</span> {new Date(assignment.due_date).toLocaleDateString()}</p>
              )}
            </div>
          </div>

          {/* File Upload */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              Upload File *
            </label>
            
            <div className="relative">
              <label className={`
                block w-full rounded-xl border-2 border-dashed p-6 text-center cursor-pointer transition-all duration-200
                ${selectedFile 
                  ? 'border-green-300 bg-green-50 hover:bg-green-100' 
                  : 'border-gray-300 hover:border-[#25AAE1] hover:bg-gray-50'
                }
                ${errors.file ? 'border-red-300 bg-red-50' : ''}
              `}>
                <input
                  type="file"
                  className="hidden"
                  onChange={handleFileUpload}
                  accept=".pdf,.doc,.docx,.txt,.jpg,.png"
                  disabled={isSubmitting}
                />
                
                {selectedFile ? (
                  <div className="space-y-2">
                    <CheckCircle className="h-8 w-8 text-green-500 mx-auto" />
                    <div>
                      <p className="font-medium text-gray-800">{selectedFile.name}</p>
                      <p className="text-sm text-gray-500">{formatFileSize(selectedFile.size)}</p>
                    </div>
                    <p className="text-xs text-gray-400">Click to change file</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Upload className="h-8 w-8 text-gray-400 mx-auto" />
                    <div>
                      <p className="font-medium text-gray-700">Click to upload or drag and drop</p>
                      <p className="text-sm text-gray-500">PDF, DOC, DOCX, TXT, JPG, PNG (max 10MB)</p>
                    </div>
                  </div>
                )}
              </label>
            </div>

            {errors.file && (
              <div className="flex items-center gap-2 text-red-600 text-sm">
                <AlertCircle className="h-4 w-4" />
                {errors.file}
              </div>
            )}
          </div>

          {/* Message */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              Message to Teacher *
            </label>
            <Textarea
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                if (errors.message) {
                  setErrors(prev => ({ ...prev, message: undefined }));
                }
              }}
              className={`min-h-[120px] resize-none rounded-xl border-2 ${
                errors.message ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Add a message to your teacher..."
              disabled={isSubmitting}
            />
            {errors.message && (
              <div className="flex items-center gap-2 text-red-600 text-sm">
                <AlertCircle className="h-4 w-4" />
                {errors.message}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button 
              variant="outline" 
              onClick={handleClose} 
              disabled={isSubmitting}
              className="px-6"
            >
              Cancel
            </Button>
            <Button
              className="bg-gradient-to-r from-[#25AAE1] to-[#1D8CB3] hover:from-[#1D8CB3] hover:to-[#25AAE1] text-white px-8 rounded-xl"
              onClick={handleSubmit}
              disabled={isSubmitting || !selectedFile}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <FileText className="h-4 w-4 mr-2" />
                  Submit Assignment
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
