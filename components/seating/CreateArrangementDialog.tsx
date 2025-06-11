/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
//import { DatePicker } from "../ui/date-picker";
import { teacherImages, generalImages } from "@/constants/images";
import Image from "next/image";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { createArrangementEvent } from "@/services/SeatingService";
import { localStorageKey } from "@/constants/global";

interface Course {
  id: number;
  name: string;
}

interface CreateArrangementDialogProps {
  onSuccess: () => void;
  tenantPrimaryDomain: string;
  accessToken: string;
  refreshToken: string;
  courses: any[];
}

export function CreateArrangementDialog({ 
  onSuccess, 
  tenantPrimaryDomain, 
  accessToken, 
  refreshToken 
}: CreateArrangementDialogProps) {
  const userData = JSON.parse(localStorage.getItem(localStorageKey.USER_DATA) || "{}");
  const teacherId = userData.owner_id;

  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [availablePlaceNumber, setAvailablePlaceNumber] = useState<number>(64);
  const [courseId, setCourseId] = useState<number | null>(null);
  const [, setDate] = useState<Date>(new Date());
  const [courses, setCourses] = useState<Course[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadCourses = () => {
      try {
        const savedCourses = localStorage.getItem("classes");
        if (savedCourses) {
          const parsedCourses: Course[] = JSON.parse(savedCourses);
          setCourses(parsedCourses);
        }
      } catch (error) {
        console.error("Failed to load courses", error);
        toast.error("Failed to load courses data");
      }
    };

    if (open) {
      loadCourses();
    }
  }, [open]);

  const handleSubmit = async () => {
    if (!name || !courseId || !availablePlaceNumber) {
      toast.error("Please fill all required fields");
      return;
    }

    if (!tenantPrimaryDomain || !accessToken || !refreshToken) {
      toast.error("Missing authentication credentials");
      return;
    }

    if (!teacherId) {
      toast.error("Teacher information not available");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await createArrangementEvent(
        tenantPrimaryDomain,
        accessToken,
        {
          name,
          course: courseId,
          teacher: teacherId,
          available_place_number: availablePlaceNumber,
        }
      );

      if (response.message) {
        toast.success(response.message);
      } else {
        toast.success("Arrangement created successfully!");
      }

      onSuccess();
      resetForm();
    } catch (error: any) {
      console.error("Error creating arrangement:", error);

      // More specific error messages
      if (error.message.includes("Failed to fetch")) {
        toast.error("Network error. Please check your connection.");
      } else if (error.response?.status === 401) {
        toast.error("Session expired. Please log in again.");
      } else {
        toast.error(error.message || "Failed to create arrangement");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setName("");
    setAvailablePlaceNumber(64);
    setCourseId(null);
    setDate(new Date());
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex gap-2 items-center text-lg bg-green-500 hover:bg-green-600 rounded-md px-2 py-4 lg:px-4 lg:py-4">
          <Image
            src={generalImages.add || teacherImages.upload}
            alt="add"
            width={24}
            height={24}
            className="w-6 h-6"
          />
          <span>New Arrangement</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">Create New Seating Arrangement</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name*
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="col-span-3"
              placeholder="Exam 1, Group Work, etc."
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="availablePlaceNumber" className="text-right">
              Available Places
            </Label>
            <Input
              id="availablePlaceNumber"
              type="number"
              value={availablePlaceNumber}
              onChange={(e) => setAvailablePlaceNumber(Number(e.target.value))}
              className="col-span-3"
              placeholder="64"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="course" className="text-right">
              Course*
            </Label>
            <select
              id="course"
              value={courseId || ""}
              onChange={(e) => setCourseId(Number(e.target.value))}
              className="col-span-3 p-2 border rounded-md"
              required
              disabled={courses.length === 0}
            >
              <option value="">Select a course</option>
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.name}
                </option>
              ))}
            </select>
            {courses.length === 0 && (
              <p className="col-span-4 text-sm text-red-500 text-center">
                No courses available. Please create a course first.
              </p>
            )}
          </div>
          <div className="flex justify-end gap-2 mt-6">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || !name || !courseId}
            >
              {isSubmitting ? "Creating..." : "Create"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}