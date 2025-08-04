"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trash2 } from "lucide-react";
import { MessageDetail } from "./message-detail";
import { useStudentCommunicationData } from "@/hooks/useStudentCommunicationData";

interface Message {
  id: number;
  sender: string;
  subject: string;
  content: string;
  time: string;
  date: string;
  avatar: string;
  attachments?: string[];
}

interface MessageListProps {
  activeTab: "teachers" | "whole-class" | "other-groups";
  selectedMessageId: number | null;
  onMessageClick: (id: number) => void;
}

export function MessageList({
  selectedMessageId,
  onMessageClick,
}: MessageListProps) {
  // Fetch real data instead of using hardcoded messages
  const { messages, loading, error } = useStudentCommunicationData();

  // Show loading state
  if (loading) {
    return (
      <div className="w-full flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
          <p className="text-muted-foreground">Loading messages...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="w-full flex justify-center items-center h-64">
        <div className="text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-red-800 mb-2">
              Error Loading Messages
            </h3>
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {messages.map((message) => (
        <div key={message.id}>
          <div
            className={`flex items-center p-4 border-b hover:bg-gray-50 cursor-pointer ${
              selectedMessageId === message.id ? "bg-gray-50" : ""
            }`}
            onClick={() => onMessageClick?.(message.id)}
          >
            <Avatar className="h-12 w-12 mr-4">
              <AvatarImage src={message.avatar} />
              <AvatarFallback>
                {message.sender
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-gray-700">{message.sender}</div>
              <div className="text-gray-500 truncate">{message.subject}</div>
            </div>

            <div className="flex flex-col items-end ml-4">
              <div className="text-sm text-gray-500">{message.time}</div>
              <div className="text-sm text-gray-500">{message.date}</div>
            </div>

            <button
              className="ml-4 text-red-400 hover:text-red-600"
              onClick={(e) => e.stopPropagation()}
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </div>

          {selectedMessageId === message.id && (
            <MessageDetail message={message} />
          )}
        </div>
      ))}
    </div>
  );
}
