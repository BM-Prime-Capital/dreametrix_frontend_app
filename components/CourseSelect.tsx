"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Course {
  id: number;
  name: string;
}

interface CourseSelectProps {
  courses: Course[];
  onCourseChange: (courseId: number) => void;
  className?: string;
}

export function CourseSelect({ courses, onCourseChange, className }: CourseSelectProps) {
  return (
    <Select onValueChange={(value) => onCourseChange(Number(value))}>
      <SelectTrigger className={className}>
        <SelectValue placeholder="Select a course" />
      </SelectTrigger>
      <SelectContent>
        {courses.map((course) => (
          <SelectItem key={course.id} value={course.id.toString()}>
            {course.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}