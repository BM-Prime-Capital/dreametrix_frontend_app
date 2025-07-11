"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function ClassSelectionPage({
  tenantPrimaryDomain,
  accessToken,
  refreshToken,
  courses,
}: {
  tenantPrimaryDomain: string;
  accessToken: string;
  refreshToken: string;
  courses: any[];
}) {
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);
  const router = useRouter();

  const handleCourseSelect = (courseId: number) => {
    setSelectedCourseId(courseId);
  };

  const handleProceed = () => {
    if (selectedCourseId) {
      router.push(`/seating?courseId=${selectedCourseId}`);
    } else {
      alert("Please select a class.");
    }
  };

  return (
    <div>
      <h1>Select a Class</h1>
      <ul>
        {courses.map((course) => (
          <li key={course.id}>
            <Button onClick={() => handleCourseSelect(course.id)}>
              {course.name}
            </Button>
          </li>
        ))}
      </ul>
      <Button onClick={handleProceed} disabled={!selectedCourseId}>
        Proceed to Seating Arrangement
      </Button>
    </div>
  );
}
