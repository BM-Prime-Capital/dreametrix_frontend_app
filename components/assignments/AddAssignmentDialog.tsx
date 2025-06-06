"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import Image from "next/image";
import { generalImages } from "@/constants/images";
import { useRequestInfo } from "@/hooks/useRequestInfo";
import { createAssignment } from "@/services/AssignmentService";
import { useList } from "@/hooks/useList";
import { getClasses } from "@/services/ClassService";
import { Loader } from "../ui/loader";
import { Class } from "@/types";

type FormData = {
  name: string;
  course: string;
  due_date: string;
  kind: string;
  published: boolean;
  file?: File;
};

export function AddAssignmentDialog() {
  const { tenantDomain, accessToken, refreshToken } = useRequestInfo();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    course: "",
    due_date: "",
    kind: "homework",
    published: false,
  });
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { list: classes, isLoading: classesLoading } = useList(getClasses);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const form = new FormData();
      form.append("name", formData.name);
      form.append("course", formData.course);
      form.append("due_date", formData.due_date);
      form.append("kind", formData.kind);
      form.append("published", formData.published.toString());
      if (file) form.append("file", file);

      await createAssignment(form, tenantDomain, accessToken, refreshToken);

      setOpen(false);
      window.location.reload();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: keyof FormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* <DialogTrigger asChild>
        <Button className="flex gap-2 items-center text-lg bg-[#3e81d4] hover:bg-[#3e81d4]/90 text-white rounded-lg px-4 py-3 shadow-md transition-all">
          <Image
            src={generalImages.add}
            alt="add"
            width={24}
            height={24}
            className="w-6 h-6 filter brightness-0 invert"
          />
          <span>Add New Assignment</span>
        </Button>
      </DialogTrigger> */}
      <DialogTrigger asChild>
        <Button className="flex gap-3 items-center text-lg bg-[#f59e0b] hover:bg-[#f59e0b]/90 text-white rounded-xl px-5 py-4 shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02] group">
          <div className="relative flex items-center justify-center">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              className="w-7 h-7 transform group-hover:rotate-180 transition-transform duration-300"
            >
              <path
                d="M12 5V19M5 12H19"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12 5V19M5 12H19"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="opacity-30"
              />
            </svg>
          </div>
          <span className="font-semibold tracking-wide">New Assignment</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] rounded-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-[#3e81d4] border-b pb-3">
            Create New Assignment
          </DialogTitle>
        </DialogHeader>
        <form
          onSubmit={handleSubmit}
          className="flex flex-wrap gap-4 p-4 items-center"
        >
          {classesLoading ? (
            <Loader />
          ) : (
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Class
              </label>
              <select
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3e81d4] focus:border-[#3e81d4] transition-colors"
                value={formData.course}
                onChange={(e) => handleChange("course", e.target.value)}
                required
              >
                <option value="">Select a class</option>
                {classes?.map((cls: Class) => (
                  <option key={cls.id} value={cls.id}>
                    {cls.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="w-full md:w-[calc(50%-0.5rem)]">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Assignment Name
            </label>
            <Input
              className="w-full focus:ring-2 focus:ring-[#3e81d4]"
              placeholder="Enter assignment name"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              required
            />
          </div>

          <div className="w-full md:w-[calc(50%-0.5rem)]">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Due Date
            </label>
            <Input
              type="date"
              className="w-full focus:ring-2 focus:ring-[#3e81d4]"
              value={formData.due_date}
              onChange={(e) => handleChange("due_date", e.target.value)}
              required
            />
          </div>

          <div className="w-full md:w-[calc(50%-0.5rem)]">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type
            </label>
            <select
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3e81d4] focus:border-[#3e81d4] transition-colors"
              value={formData.kind}
              onChange={(e) => handleChange("kind", e.target.value)}
              required
            >
              <option value="homework">Homework</option>
              <option value="test">Test</option>
              <option value="quiz">Quiz</option>
              <option value="participation">Participation</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="w-full md:w-[calc(50%-0.5rem)] flex items-center gap-2 p-2">
            <label className="relative flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.published}
                onChange={(e) => handleChange("published", e.target.checked)}
                className="sr-only"
              />
              <div
                className={`w-5 h-5 border-2 rounded-md transition-colors 
                ${
                  formData.published
                    ? "bg-[#3e81d4] border-[#3e81d4]"
                    : "bg-white border-gray-300"
                }`}
              >
                {formData.published && (
                  <svg
                    className="w-4 h-4 text-white mx-auto mt-0.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
              </div>
              <span className="ml-2 text-sm text-gray-700">
                Publish immediately
              </span>
            </label>
          </div>

          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Attach File
            </label>
            <Input
              type="file"
              className="w-full file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#3e81d4]/10 file:text-[#3e81d4] hover:file:bg-[#3e81d4]/20"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              required
            />
          </div>

          <div className="w-full flex justify-end gap-3 mt-6 border-t pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="px-6 py-2 text-gray-700 hover:bg-gray-50 border-gray-300"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="px-6 py-2 bg-[#3e81d4] hover:bg-[#3e81d4]/90 text-white disabled:opacity-70 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating...
                </span>
              ) : (
                "Create Assignment"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
