"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Assignment, MiniCourse } from "@/types";
import { updateAssignment } from "@/services/AssignmentService";
import { getClasses } from "@/services/ClassService";
import { useRequestInfo } from "@/hooks/useRequestInfo";
import {
  Loader2,
  BookOpen,
  Calendar,
  FileText,
  Globe,
  GraduationCap,
} from "lucide-react";

interface EditAssignmentDialogProps {
  assignment: Assignment | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (updatedAssignment: Assignment) => void;
}

const ASSIGNMENT_TYPES = [
  { value: "test", label: "Test", icon: "📝" },
  { value: "quiz", label: "Quiz", icon: "❓" },
  { value: "homework", label: "Homework", icon: "📚" },
  { value: "participation", label: "Participation", icon: "🙋" },
  { value: "other", label: "Other", icon: "📋" },
];

export function EditAssignmentDialog({
  assignment,
  isOpen,
  onClose,
  onUpdate,
}: EditAssignmentDialogProps) {
  const { tenantDomain, accessToken, refreshToken } = useRequestInfo();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingCourses, setIsLoadingCourses] = useState(false);
  const [courses, setCourses] = useState<MiniCourse[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    due_date: "",
    kind: "",
    published: false,
    course: 0,
  });

  // Load available courses
  useEffect(() => {
    const loadCourses = async () => {
      if (!tenantDomain || !accessToken || !refreshToken) return;

      setIsLoadingCourses(true);
      try {
        const classesData = await getClasses(
          tenantDomain,
          accessToken,
          refreshToken
        );
        // Transform classes to MiniCourse format
        const coursesData: MiniCourse[] = classesData.map((cls: any) => ({
          id: cls.id,
          name: cls.name || `Class ${cls.grade} - ${cls.subject_in_short}`,
        }));
        setCourses(coursesData);
      } catch (error) {
        console.error("Error loading courses:", error);
      } finally {
        setIsLoadingCourses(false);
      }
    };

    if (isOpen) {
      loadCourses();
    }
  }, [isOpen, tenantDomain, accessToken, refreshToken]);

  // Initialize form data when assignment changes
  useEffect(() => {
    if (assignment) {
      setFormData({
        name: assignment.name,
        due_date: assignment.due_date.split("T")[0], // Extract date part only
        kind: assignment.kind,
        published: assignment.published,
        course: assignment.course.id,
      });
      // Reset file when switching assignments
      setFile(null);
    }
  }, [assignment]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!assignment) return;

    setIsLoading(true);

    try {
      // Create FormData object to handle file upload
      const formDataWithFile = new FormData();
      formDataWithFile.append("name", formData.name);
      formDataWithFile.append("due_date", formData.due_date);
      formDataWithFile.append("kind", formData.kind);
      formDataWithFile.append("published", formData.published.toString());
      formDataWithFile.append("course", formData.course.toString());

      // Add file if selected
      if (file) {
        formDataWithFile.append("file", file);
      }

      const updatedAssignment = await updateAssignment(
        assignment.id,
        formDataWithFile,
        tenantDomain,
        accessToken
      );

      // Create the updated assignment object with the course information
      const updatedAssignmentWithCourse = {
        ...updatedAssignment,
        course: assignment.course, // Keep the original course object structure
      };

      onUpdate(updatedAssignmentWithCourse);
      handleClose();
    } catch (error) {
      console.error("Error updating assignment:", error);
      alert("Failed to update assignment. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleClose = () => {
    setFile(null); // Reset file when dialog closes
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto bg-gradient-to-br from-blue-50/50 to-indigo-50/50 border-0 shadow-2xl">
        <DialogHeader className="text-center pb-6">
          <div className="mx-auto mb-4 w-16 h-16 bg-gradient-to-r from-[#3e81d4] to-[#1D8CB3] rounded-full flex items-center justify-center">
            <FileText className="h-8 w-8 text-white" />
          </div>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-[#3e81d4] to-[#1D8CB3] bg-clip-text text-transparent">
            Edit Assignment
          </DialogTitle>
          <DialogDescription className="text-gray-600 text-lg">
            Make changes to the assignment. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Assignment Name */}
          <div className="space-y-3">
            <Label
              htmlFor="name"
              className="text-base font-semibold text-gray-700 flex items-center gap-2"
            >
              <BookOpen className="h-4 w-4 text-[#3e81d4]" />
              Assignment Name
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="Enter assignment name"
              required
              className="h-12 text-base border-2 border-gray-200 focus:border-[#3e81d4] focus:ring-2 focus:ring-[#3e81d4]/20 rounded-lg transition-all duration-200"
            />
          </div>

          {/* Course Selection */}
          <div className="space-y-3">
            <Label
              htmlFor="course"
              className="text-base font-semibold text-gray-700 flex items-center gap-2"
            >
              <GraduationCap className="h-4 w-4 text-[#3e81d4]" />
              Course
            </Label>
            <Select
              value={formData.course.toString()}
              onValueChange={(value) =>
                handleInputChange("course", parseInt(value))
              }
              disabled={isLoadingCourses}
            >
              <SelectTrigger className="h-12 text-base border-2 border-gray-200 focus:border-[#3e81d4] focus:ring-2 focus:ring-[#3e81d4]/20 rounded-lg transition-all duration-200">
                <SelectValue
                  placeholder={
                    isLoadingCourses ? "Loading courses..." : "Select a course"
                  }
                />
              </SelectTrigger>
              <SelectContent className="max-h-60">
                {isLoadingCourses ? (
                  <SelectItem value="loading" disabled>
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Loading courses...
                    </div>
                  </SelectItem>
                ) : courses.length === 0 ? (
                  <SelectItem value="no-courses" disabled>
                    No courses available
                  </SelectItem>
                ) : (
                  courses.map((course) => (
                    <SelectItem key={course.id} value={course.id.toString()}>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-[#3e81d4] rounded-full"></div>
                        {course.name}
                      </div>
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Due Date */}
            <div className="space-y-3">
              <Label
                htmlFor="due_date"
                className="text-base font-semibold text-gray-700 flex items-center gap-2"
              >
                <Calendar className="h-4 w-4 text-[#3e81d4]" />
                Due Date
              </Label>
              <Input
                id="due_date"
                type="date"
                value={formData.due_date}
                onChange={(e) => handleInputChange("due_date", e.target.value)}
                required
                className="h-12 text-base border-2 border-gray-200 focus:border-[#3e81d4] focus:ring-2 focus:ring-[#3e81d4]/20 rounded-lg transition-all duration-200"
              />
            </div>

            {/* Assignment Type */}
            <div className="space-y-3">
              <Label
                htmlFor="kind"
                className="text-base font-semibold text-gray-700 flex items-center gap-2"
              >
                <Globe className="h-4 w-4 text-[#3e81d4]" />
                Type
              </Label>
              <Select
                value={formData.kind}
                onValueChange={(value) => handleInputChange("kind", value)}
              >
                <SelectTrigger className="h-12 text-base border-2 border-gray-200 focus:border-[#3e81d4] focus:ring-2 focus:ring-[#3e81d4]/20 rounded-lg transition-all duration-200">
                  <SelectValue placeholder="Select assignment type" />
                </SelectTrigger>
                <SelectContent>
                  {ASSIGNMENT_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{type.icon}</span>
                        {type.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* File Upload */}
          <div className="space-y-3">
            <Label
              htmlFor="file"
              className="text-base font-semibold text-gray-700 flex items-center gap-2"
            >
              <FileText className="h-4 w-4 text-[#3e81d4]" />
              Assignment File
            </Label>
            <Input
              type="file"
              className="w-full file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#3e81d4]/10 file:text-[#3e81d4] hover:file:bg-[#3e81d4]/20"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              required
            />
          </div>

          {/* Published Status */}
          <div className="flex items-center space-x-3 p-4 bg-white/70 rounded-lg border-2 border-gray-100">
            <Checkbox
              id="published"
              checked={formData.published}
              onCheckedChange={(checked) =>
                handleInputChange("published", Boolean(checked))
              }
              className="w-5 h-5 border-2 border-[#3e81d4] data-[state=checked]:bg-[#3e81d4] data-[state=checked]:text-white"
            />
            <Label
              htmlFor="published"
              className="text-base font-medium text-gray-700 cursor-pointer"
            >
              Publish assignment immediately
            </Label>
          </div>

          <DialogFooter className="pt-6 gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
              className="h-12 px-6 text-base border-2 border-gray-300 hover:bg-gray-50 transition-all duration-200"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="h-12 px-8 text-base bg-gradient-to-r from-[#3e81d4] to-[#1D8CB3] hover:from-[#1D8CB3] hover:to-[#3e81d4] text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
            >
              {isLoading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
