"use client";

import { useState, useEffect } from "react";
import { useRequestInfo } from "./useRequestInfo";

// Types for student communication data
export interface StudentCommunicationMessage {
  id: number;
  sender: string;
  subject: string;
  content: string;
  time: string;
  date: string;
  avatar: string;
  attachments?: string[];
}

export interface StudentCommunicationTeacher {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface UseStudentCommunicationDataReturn {
  messages: StudentCommunicationMessage[];
  teachers: StudentCommunicationTeacher[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useStudentCommunicationData(): UseStudentCommunicationDataReturn {
  const [messages, setMessages] = useState<StudentCommunicationMessage[]>([]);
  const [teachers, setTeachers] = useState<StudentCommunicationTeacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { accessToken, tenantDomain } = useRequestInfo();

  const fetchData = async () => {
    if (!accessToken || !tenantDomain) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // For now, we'll use mock data until proper student message APIs are available
      // In a real implementation, you would fetch from appropriate endpoints

      const mockMessages: StudentCommunicationMessage[] = [
        {
          id: 1,
          sender: "Ms. Johnson",
          subject: "Assignment Reminder",
          content: "Don't forget to submit your math homework by Friday.",
          time: "10:30",
          date: new Date().toLocaleDateString(),
          avatar: "/assets/images/general/teacher.png",
        },
        {
          id: 2,
          sender: "Mr. Williams",
          subject: "Great Work!",
          content: "Excellent performance on your science project. Keep it up!",
          time: "14:15",
          date: new Date().toLocaleDateString(),
          avatar: "/assets/images/general/teacher.png",
        },
      ];

      const mockTeachers: StudentCommunicationTeacher[] = [
        {
          id: "t1",
          name: "Ms. Johnson",
          email: "johnson@school.com",
          avatar: "/assets/images/general/teacher.png",
        },
        {
          id: "t2",
          name: "Mr. Williams",
          email: "williams@school.com",
          avatar: "/assets/images/general/teacher.png",
        },
      ];

      setMessages(mockMessages);
      setTeachers(mockTeachers);
    } catch (err) {
      console.error("Error fetching student communication data:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [accessToken, tenantDomain]);

  const refetch = async () => {
    await fetchData();
  };

  return {
    messages,
    teachers,
    loading,
    error,
    refetch,
  };
}
