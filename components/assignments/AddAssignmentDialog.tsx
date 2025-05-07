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
  weight: string;
  kind: string;
  published: boolean;
  file?: File;
};

export function AddAssignmentDialog() {
  const { tenantDomain, accessToken, refreshToken } = useRequestInfo();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    course: '',
    due_date: '',
    weight: '',
    kind: 'homework',
    published: false
  });
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { list: classes, isLoading: classesLoading } = useList(getClasses);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const form = new FormData();
      form.append('name', formData.name);
      form.append('course', formData.course);
      form.append('due_date', formData.due_date);
      form.append('weight', formData.weight);
      form.append('kind', formData.kind);
      form.append('published', formData.published.toString());
      if (file) form.append('file', file);

      await createAssignment(
        form,
        tenantDomain,
        accessToken,
        refreshToken
      );
      
      setOpen(false);
      window.location.reload(); // Rafraîchir la liste
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: keyof FormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex gap-2 items-center text-lg bg-blue-500 hover:bg-blue-600 rounded-md px-2 py-4 lg:px-4 lg:py-6">
          <Image
            src={generalImages.add}
            alt="add"
            width={100}
            height={100}
            className="w-8 h-8"
          />
          <span>Add New Assignment</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-blue-500">
            NEW ASSIGNMENT
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-wrap gap-4 py-4">
          {classesLoading ? (
            <Loader />
          ) : (
            <div className="flex-1 min-w-[200px]">
              <select
                className="rounded-full w-full border p-2"
                value={formData.course}
                onChange={(e) => handleChange('course', e.target.value)}
                required
              >
                <option value="">Select Class</option>
                {classes?.map((cls: Class) => (
                  <option key={cls.id} value={cls.id}>
                    {cls.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="flex-1 min-w-[200px]">
            <Input
              className="rounded-full"
              placeholder="Assignment Name"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              required
            />
          </div>

          <div className="flex-1 min-w-[200px]">
            <Input
              type="date"
              className="rounded-full"
              value={formData.due_date}
              onChange={(e) => handleChange('due_date', e.target.value)}
              required
            />
          </div>

          <div className="flex-1 min-w-[200px]">
            <select
              className="rounded-full w-full border p-2"
              value={formData.kind}
              onChange={(e) => handleChange('kind', e.target.value)}
              required
            >
              <option value="homework">Homework</option>
              <option value="test">Test</option>
              <option value="quiz">Quiz</option>
              <option value="participation">Participation</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="flex-1 min-w-[200px]">
            <Input
              type="number"
              step="0.01"
              className="rounded-full"
              placeholder="Weight (%)"
              value={formData.weight}
              onChange={(e) => handleChange('weight', e.target.value)}
              required
            />
          </div>

          <div className="flex-1 min-w-[200px]">
            <label className="flex items-center gap-2 p-2">
              <input
                type="checkbox"
                checked={formData.published}
                onChange={(e) => handleChange('published', e.target.checked)}
              />
              Published
            </label>
          </div>

          <div className="flex-1 min-w-[200px]">
            <Input
              type="file"
              className="rounded-full"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              required
            />
          </div>

          <div className="flex justify-end gap-4 w-full mt-4">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="bg-blue-500 hover:bg-blue-600 text-white"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating...' : 'Create Assignment'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}