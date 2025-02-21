'use client';

import { Card } from "@/components/ui/card";
import { Bell } from "lucide-react";

interface ExamReminder {
  className: string;
  subject: string;
}

export function AIAssistance() {
  const examReminders: ExamReminder[] = [
    { className: "Class 5 - Math", subject: "Mathematics" },
    { className: "Class 5 - Sci", subject: "Science" }
  ];

  return (
    <Card className="p-6 bg-white">
      <h2 className="text-xl font-semibold mb-4">AI Student Assistance</h2>
      <div className="space-y-3">
        {examReminders.map((reminder, index) => (
          <div key={index} className="flex items-center gap-3 text-sm">
            <div className="p-2 bg-yellow-100 rounded-full">
              <Bell className="w-4 h-4 text-yellow-600" />
            </div>
            <p>
              Remember that tomorrow <span className="font-medium">{reminder.className}</span> has an exam
            </p>
          </div>
        ))}
      </div>
    </Card>
  );
}