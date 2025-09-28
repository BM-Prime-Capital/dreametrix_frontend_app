"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, Send } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useRequestInfo } from "@/hooks/useRequestInfo";
import { createAssignment } from "@/services/AssignmentService";
import { convertBlobToFile } from "@/utils/pdfUtils";
import { localStorageKey } from "@/constants/global";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { userPath } from "@/constants/userConstants";

interface GenerateAssessmentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  fileStream: string;
  worksheetTitle?: string;
  onSendToClass?: () => void;
  preselectedData?: {
    assignmentType?: string;
    subject?: string;
    grade?: string;
    questionType?: string;
    numberOfQuestions?: string;
    teacherName?: string;
  };
}

interface ClassOption {
  id: string;
  name: string;
}

export default function GenerateAssessmentDialog({
  isOpen,
  onClose,
  fileStream,
  worksheetTitle = "Digital Library Worksheet",
  onSendToClass = () => {},
  preselectedData,
}: GenerateAssessmentDialogProps) {
  const [selectedClassId, setSelectedClassId] = useState<string>("");
  const [classes, setClasses] = useState<ClassOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [assignmentName, setAssignmentName] = useState<string>(
    `[Digital Library] ${worksheetTitle}`
  );
  const [dueDate, setDueDate] = useState<string>("");
  const [isPublished, setIsPublished] = useState<boolean>(false);
  const { tenantDomain, accessToken, refreshToken } = useRequestInfo();
  const { toast } = useToast();
  const router = useRouter();

  // Load classes from localStorage on component mount
  useEffect(() => {
    const loadedClasses = localStorage.getItem("classes");
    if (loadedClasses) {
      try {
        const allClasses = JSON.parse(loadedClasses);
        const formattedClasses: ClassOption[] = allClasses.map((cls: any) => ({
          id: cls.id?.toString(),
          name: cls.name || `Class ${cls.id}`,
        }));
        setClasses(formattedClasses);
      } catch (error) {
        console.error("Failed to parse classes from localStorage:", error);
      }
    }

    // Set default assignment name when component opens
    setAssignmentName(`[Digital Library] ${worksheetTitle}`);

    // Set default due date (7 days from now)
    const defaultDueDate = new Date();
    defaultDueDate.setDate(defaultDueDate.getDate() + 7);
    setDueDate(defaultDueDate.toISOString().split("T")[0]);
  }, [isOpen, worksheetTitle]);

  const handleSendToClass = async () => {
    if (!selectedClassId) {
      toast({
        title: "Class Required",
        description: "Please select a class to send the worksheet to.",
        variant: "destructive",
      });
      return;
    }

    if (!assignmentName.trim()) {
      toast({
        title: "Assignment Name Required",
        description: "Please enter a name for the assignment.",
        variant: "destructive",
      });
      return;
    }

    if (!dueDate) {
      toast({
        title: "Due Date Required",
        description: "Please select a due date for the assignment.",
        variant: "destructive",
      });
      return;
    }

    if (!tenantDomain || !accessToken) {
      toast({
        title: "Authentication Error",
        description: "Please log in to send worksheets to class.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Convert PDF blob to file for FormData
      const filename = `${worksheetTitle.replace(/[^a-zA-Z0-9]/g, "_")}.pdf`;
      const pdfFile = await convertBlobToFile(fileStream, filename);

      // Find selected class name for user feedback
      const selectedClass = classes.find((cls) => cls.id === selectedClassId);
      const className = selectedClass?.name || "Selected Class";

      // Create FormData for assignment creation
      const formData = new FormData();
      formData.append("name", assignmentName.trim());
      // Use preselected assignment type or default to homework
      const assignmentKind =
        preselectedData?.assignmentType?.toLowerCase() || "homework";
      formData.append("kind", assignmentKind);
      formData.append("course", selectedClassId);
      formData.append("file", pdfFile);
      formData.append("due_date", dueDate);
      formData.append("published", isPublished.toString());

      // Create assignment via API
      await createAssignment(formData, tenantDomain, accessToken);

      // Show success message
      toast({
        title: "Worksheet Sent Successfully!",
        description: `${
          preselectedData?.assignmentType || "Assignment"
        } "${assignmentName}" has been sent to ${className}${
          isPublished ? " and published" : ""
        }.`,
      });

      // Call optional callback and close dialog
      onSendToClass();
      onClose();

      // Redirect to assignments page
      router.push(`${userPath.TEACHER_BASE_PATH}/assignments`);
    } catch (error) {
      console.error("Error sending worksheet to class:", error);
      toast({
        title: "Failed to Send Worksheet",
        description:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = fileStream;
    link.download = `${worksheetTitle.replace(/[^a-zA-Z0-9]/g, "_")}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle className="text-center">
            Generated Worksheet Preview
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* PDF Preview */}
          <div className="w-full h-[400px] border rounded-lg overflow-hidden">
            {fileStream ? (
              <embed
                src={fileStream}
                type="application/pdf"
                width="100%"
                height="100%"
                className="rounded-lg"
              />
            ) : (
              <div className="flex flex-col gap-4 justify-center items-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                <p className="text-muted-foreground">Loading PDF...</p>
                <p className="text-sm text-muted-foreground">
                  Make sure all fields are filled correctly...
                </p>
              </div>
            )}
          </div>

          {/* Class Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Select Class to Send Worksheet:
            </label>
            <select
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isLoading}
            >
              <option value="">Choose a class...</option>
              {classes.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {cls.name}
                </option>
              ))}
            </select>
          </div>

          {/* Assignment Configuration */}
          <div className="space-y-4 bg-gray-50 p-4 rounded-lg border">
            <h4 className="text-sm font-medium text-gray-800">
              Assignment Configuration
            </h4>

            {/* Assignment Name */}
            <div className="space-y-2">
              <Label
                htmlFor="assignment-name"
                className="text-sm font-medium text-gray-700"
              >
                Assignment Name
              </Label>
              <Input
                id="assignment-name"
                type="text"
                value={assignmentName}
                onChange={(e) => setAssignmentName(e.target.value)}
                placeholder="Enter assignment name..."
                disabled={isLoading}
                className="w-full"
              />
            </div>

            {/* Due Date */}
            <div className="space-y-2">
              <Label
                htmlFor="due-date"
                className="text-sm font-medium text-gray-700"
              >
                Due Date
              </Label>
              <Input
                id="due-date"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                disabled={isLoading}
                className="w-full"
                min={new Date().toISOString().split("T")[0]}
              />
            </div>

            {/* Publish Checkbox */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="publish"
                checked={isPublished}
                onCheckedChange={(checked) =>
                  setIsPublished(checked as boolean)
                }
                disabled={isLoading}
              />
              <Label
                htmlFor="publish"
                className="text-sm font-medium text-gray-700"
              >
                Publish assignment immediately
              </Label>
            </div>

            <p className="text-xs text-gray-500">
              {isPublished
                ? "Students will be able to see and access this assignment immediately."
                : "Assignment will be saved as draft. You can publish it later from the assignments page."}
            </p>
          </div>

          {/* Assignment Details */}
          {preselectedData && (
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h4 className="text-sm font-medium text-blue-800 mb-2">
                Assignment Details:
              </h4>
              <div className="grid grid-cols-2 gap-3 text-sm">
                {preselectedData.assignmentType && (
                  <div>
                    <span className="text-blue-600 font-medium">Type:</span>{" "}
                    {preselectedData.assignmentType}
                  </div>
                )}
                {preselectedData.subject && (
                  <div>
                    <span className="text-blue-600 font-medium">Subject:</span>{" "}
                    {preselectedData.subject}
                  </div>
                )}
                {preselectedData.grade && (
                  <div>
                    <span className="text-blue-600 font-medium">Grade:</span>{" "}
                    {preselectedData.grade}
                  </div>
                )}
                {preselectedData.questionType && (
                  <div>
                    <span className="text-blue-600 font-medium">
                      Question Type:
                    </span>{" "}
                    {preselectedData.questionType}
                  </div>
                )}
                {preselectedData.numberOfQuestions && (
                  <div>
                    <span className="text-blue-600 font-medium">
                      Questions:
                    </span>{" "}
                    {preselectedData.numberOfQuestions}
                  </div>
                )}
                {preselectedData.teacherName && (
                  <div>
                    <span className="text-blue-600 font-medium">Teacher:</span>{" "}
                    {preselectedData.teacherName}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              onClick={handleDownload}
              className="flex-1 bg-gray-600 hover:bg-gray-700 text-white flex items-center justify-center gap-2"
              disabled={!fileStream || isLoading}
            >
              <Download className="w-4 h-4" />
              Download PDF
            </Button>

            <Button
              onClick={handleSendToClass}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-2"
              disabled={
                !fileStream ||
                !selectedClassId ||
                !assignmentName.trim() ||
                !dueDate ||
                isLoading
              }
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Send to Class
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
