"use client";

import { useState, useEffect } from "react";
import { useRequestInfo } from "./useRequestInfo";

// Types for parent communication data
export interface ParentCommunicationStudent {
  id: number;
  name: string;
  class: string;
}

export interface ParentCommunicationTeacher {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface ParentCommunicationMessage {
  id: number;
  sender: string;
  subject: string;
  content: string;
  time: string;
  date: string;
  avatar: string;
  regarding?: string;
  regardingIds?: number[];
  attachments?: string[];
  isRead: boolean;
}

interface UseParentCommunicationDataReturn {
  students: ParentCommunicationStudent[];
  teachers: ParentCommunicationTeacher[];
  messages: ParentCommunicationMessage[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useParentCommunicationData(): UseParentCommunicationDataReturn {
  const [students, setStudents] = useState<ParentCommunicationStudent[]>([]);
  const [teachers, setTeachers] = useState<ParentCommunicationTeacher[]>([]);
  const [messages, setMessages] = useState<ParentCommunicationMessage[]>([]);
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

      // For parents, we might need to fetch their children specifically
      // For now, we'll use mock data that represents what a parent would see (their children)

      const mockChildren: ParentCommunicationStudent[] = [
        { id: 1, name: "John Smith", class: "Grade 1" },
        { id: 2, name: "Emma Smith", class: "Grade 2" },
      ];

      const mockTeachers: ParentCommunicationTeacher[] = [
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

      const mockMessages: ParentCommunicationMessage[] = [
        {
          id: 1,
          sender: "Ms. Johnson",
          subject: "Regarding John's Math Progress",
          content:
            "Dear Parent, I wanted to update you on John's progress in mathematics. He's been showing significant improvement in algebra concepts over the past few weeks. His last quiz score was 92%, which is excellent.",
          time: "13:45",
          date: new Date().toLocaleDateString(),
          avatar: "/assets/images/general/teacher.png",
          regarding: "John Smith",
          regardingIds: [1],
          isRead: false,
        },
        {
          id: 2,
          sender: "Mr. Williams",
          subject: "Science Project Update - Emma",
          content:
            "Hello! I wanted to inform you that Emma has been doing exceptional work on her science project. Her experiment design is creative and well-thought-out.",
          time: "10:23",
          date: new Date().toLocaleDateString(),
          avatar: "/assets/images/general/teacher.png",
          regarding: "Emma Smith",
          regardingIds: [2],
          isRead: true,
        },
      ];

      setStudents(mockChildren);
      setTeachers(mockTeachers);
      setMessages(mockMessages);
    } catch (err) {
      console.error("Error fetching parent communication data:", err);
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
    students,
    teachers,
    messages,
    loading,
    error,
    refetch,
  };
}
