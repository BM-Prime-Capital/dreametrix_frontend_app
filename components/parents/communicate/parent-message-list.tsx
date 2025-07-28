"use client";

import { useState, useMemo } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trash2 } from "lucide-react";
import { ParentMessageDetail } from "./parent-message-detail";
import { Badge } from "@/components/ui/badge";
import {
  useParentCommunicationData,
  ParentCommunicationMessage,
} from "@/hooks/useParentCommunicationData";

interface Message {
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

interface ParentMessageListProps {
  activeTab: "teachers" | "school-admin" | "other-parents";
  selectedMessageId: number | null;
  onMessageClick: (id: number) => void;
  selectedStudents: number[];
}

export function ParentMessageList({
  activeTab,
  selectedMessageId,
  onMessageClick,
  selectedStudents,
}: ParentMessageListProps) {
  // Fetch real data instead of using initialMessages
  const {
    messages: fetchedMessages,
    loading,
    error,
  } = useParentCommunicationData();
  const [messages, setMessages] = useState<ParentCommunicationMessage[]>([]);

  // Update local messages when fetched data changes
  useMemo(() => {
    setMessages(fetchedMessages);
  }, [fetchedMessages]);

  const handleClick = (id: number) => {
    setMessages((prevMessages) =>
      prevMessages.map((message) =>
        message.id === id ? { ...message, isRead: true } : message
      )
    );
    onMessageClick(id);
  };

  // Show loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
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
      <div className="flex justify-center items-center h-64">
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

  const filteredMessages = useMemo(() => {
    return messages.filter((message) => {
      const tabFilter =
        activeTab === "teachers"
          ? message.sender !== "Principal Johnson"
          : activeTab === "school-admin"
          ? message.sender === "Principal Johnson"
          : false;

      const studentFilter =
        selectedStudents.length === 0
          ? true
          : message.regardingIds
          ? message.regardingIds.some((id) => selectedStudents.includes(id))
          : false;

      return tabFilter && studentFilter;
    });
  }, [messages, activeTab, selectedStudents]);

  return (
    <div className="w-full">
      {filteredMessages.length > 0 ? (
        filteredMessages.map((message) => {
          const isSelected = selectedMessageId === message.id;
          const isUnread = !message.isRead;

          return (
            <div key={message.id}>
              <div
                className={`flex items-center p-4 border-b cursor-pointer transition-colors relative ${
                  isSelected
                    ? "bg-blue-50"
                    : isUnread
                    ? "bg-white hover:bg-gray-50"
                    : "bg-gray-50 hover:bg-gray-100"
                }`}
                onClick={() => handleClick(message.id)}
              >
                {isUnread && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 rounded-r-md"></div>
                )}

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
                  <div className="flex items-center">
                    <div
                      className={`font-medium ${
                        isUnread
                          ? "text-gray-900 font-semibold"
                          : "text-gray-700"
                      }`}
                    >
                      {message.sender}
                    </div>
                    {message.regarding && (
                      <Badge
                        variant="outline"
                        className="ml-2 bg-blue-50 text-blue-700"
                      >
                        {message.regarding}
                      </Badge>
                    )}
                  </div>
                  <div
                    className={`truncate ${
                      isUnread ? "text-gray-900 font-medium" : "text-gray-500"
                    }`}
                  >
                    {message.subject}
                  </div>
                </div>

                <div className="flex flex-col items-end ml-4">
                  <div
                    className={`text-sm ${
                      isUnread ? "text-gray-900" : "text-gray-500"
                    }`}
                  >
                    {message.time}
                  </div>
                  <div className="text-sm text-gray-500">{message.date}</div>
                </div>

                <button
                  className="ml-4 text-red-400 hover:text-red-600"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>

              {isSelected && <ParentMessageDetail message={message} />}
            </div>
          );
        })
      ) : (
        <div className="p-8 text-center text-gray-500">
          {selectedStudents.length > 0
            ? "No messages match the selected students"
            : "No messages in this category"}
        </div>
      )}
    </div>
  );
}
