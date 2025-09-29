/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import {
  Paperclip,
  Send,
  MessageSquare,
  Megaphone,
  Clock,
  CheckCheck,
  Star,
  Bell,
  MoreHorizontal,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/utils/tailwind";
import { Conversation,
   //Message 
  } from "./types";

interface MessageAreaProps {
  selectedConversation: Conversation | null;
  messages: any;
  loading: boolean;
  newMessage: string;
  onMessageChange: (value: string) => void;
  onSendMessage: () => void;
  onDeselectConversation: () => void;
  onOpenCompose: () => void;
  onOpenAnnounce: () => void;
}

export function MessageArea({
  selectedConversation,
  messages,
  loading,
  newMessage,
  onMessageChange,
  onSendMessage,
  onDeselectConversation,
  onOpenCompose,
  onOpenAnnounce,
}: MessageAreaProps) {
  const [, setIsTyping] = useState(false);

  const handleMessageChange = (value: string) => {
    onMessageChange(value);
    setIsTyping(!!value.trim());
  };

  return (
    <Card className="p-3 lg:col-span-2 h-[calc(100vh-190px)] flex flex-col bg-white/80 backdrop-blur-sm border-0 shadow-md rounded-xl overflow-hidden">
      {selectedConversation ? (
        <>
          {/* Conversation Header */}
          <div className="flex items-center justify-between pb-2 mb-1 border-b border-blue-100">
            <div className="flex items-center gap-3">
              <Avatar
                className={cn(
                  "h-12 w-12 rounded-xl shadow-sm border-2",
                  selectedConversation.type === "announcement"
                    ? "border-purple-200 bg-purple-50"
                    : selectedConversation.type === "class"
                    ? "border-green-200 bg-green-50"
                    : selectedConversation.type === "parent"
                    ? "border-amber-200 bg-amber-50"
                    : "border-blue-200 bg-blue-50"
                )}
              >
                <AvatarImage
                  src={selectedConversation.participants[0].avatar}
                  alt={selectedConversation.participants[0].name}
                  className="object-cover rounded-lg"
                />
                <AvatarFallback className="rounded-lg">
                  {selectedConversation.participants[0].name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold text-lg">
                  {selectedConversation.participants[0].name}
                </h3>
                <div className="flex items-center gap-2">
                  <Badge
                    className={cn(
                      "text-xs py-0.5 px-2",
                      selectedConversation.type === "announcement"
                        ? "bg-purple-50 text-purple-700 border-purple-200"
                        : selectedConversation.type === "class"
                        ? "bg-green-50 text-green-700 border-green-200"
                        : selectedConversation.type === "parent"
                        ? "bg-amber-50 text-amber-700 border-amber-200"
                        : "bg-blue-50 text-blue-700 border-blue-200"
                    )}
                  >
                    {selectedConversation.type === "class"
                      ? "Class"
                      : selectedConversation.type === "parent"
                      ? "Parent"
                      : selectedConversation.type === "announcement"
                      ? "Announcement"
                      : "Student"}
                  </Badge>
                  <span className="text-xs text-muted-foreground flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    Last active: Today
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-full border-blue-100 hover:bg-blue-50"
                    >
                      <Star className="h-4 w-4 text-amber-400" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Mark as important</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-full border-blue-100 hover:bg-blue-50"
                    >
                      <Bell className="h-4 w-4 text-blue-500" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Notification settings</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-full border-blue-100 hover:bg-blue-50"
                    >
                      <MoreHorizontal className="h-4 w-4 text-gray-500" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>More options</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={onDeselectConversation}
                      className="rounded-full border-blue-100 hover:bg-blue-50 ml-2"
                    >
                      <X className="h-4 w-4 text-gray-500" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Close conversation</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto py-1 space-y-4 px-2 mb-1">
            {loading ? (
              <div className="flex justify-center items-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            ) : messages.length === 0 ? (
              <div className="flex justify-center items-center h-full text-gray-500">
                <p>Aucun message dans cette conversation</p>
              </div>
            ) : (
              <>
                {messages.map((message: any) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 max-w-[85%] animate-fade-in ${
                      message.sender.role === "teacher"
                        ? "ml-auto flex-row-reverse"
                        : ""
                    }`}
                  >
                    <Avatar
                      className={cn(
                        "h-9 w-9 mt-1 rounded-xl border-2 shadow-sm flex-shrink-0",
                        message.sender.role === "teacher"
                          ? "border-blue-200 bg-blue-50"
                          : "border-blue-100"
                      )}
                    >
                      <AvatarImage
                        src={message.sender.avatar}
                        alt={message.sender.name}
                        className="object-cover rounded-lg"
                      />
                      <AvatarFallback className="rounded-lg">
                        {message.sender?.name?.charAt(0) || "?"}
                      </AvatarFallback>
                    </Avatar>

                    <div
                      className={cn(
                        "rounded-2xl p-3 shadow-sm",
                        message.sender.role === "teacher"
                          ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white mr-0"
                          : "bg-gradient-to-br from-gray-50 to-blue-50 border border-blue-100"
                      )}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span
                          className={cn(
                            "text-xs font-medium",
                            message.sender.role === "teacher"
                              ? "text-blue-100"
                              : "text-blue-700"
                          )}
                        >
                          {message.sender.name}
                        </span>
                        <span
                          className={cn(
                            "text-xs flex items-center gap-1",
                            message.sender.role === "teacher"
                              ? "text-blue-100"
                              : "text-blue-400"
                          )}
                        >
                          {message.timestamp}
                          {message.sender.role === "teacher" && (
                            <CheckCheck className="h-3 w-3 ml-1" />
                          )}
                        </span>
                      </div>
                      <p
                        className={cn(
                          "text-sm leading-relaxed",
                          message.sender.role === "teacher"
                            ? "text-white"
                            : "text-gray-800"
                        )}
                      >
                        {message.content}
                      </p>

                      {message.attachments && message.attachments.length > 0 && (
                        <div
                          className={cn(
                            "mt-3 pt-2",
                            message.sender.role === "teacher"
                              ? "border-t border-white/20"
                              : "border-t border-blue-100"
                          )}
                        >
                          {message.attachments.map((attachment: any, i: string) => (
                            <div
                              key={i}
                              className="flex items-center gap-1 text-xs mt-1"
                            >
                              <Paperclip
                                className={cn(
                                  "h-3 w-3",
                                  message.sender.role === "teacher"
                                    ? "text-blue-100"
                                    : "text-blue-500"
                                )}
                              />
                              <a
                                href={attachment.url}
                                className={cn(
                                  "underline",
                                  message.sender.role === "teacher"
                                    ? "text-blue-100"
                                    : "text-blue-600"
                                )}
                              >
                                {attachment.name}
                              </a>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>

          {/* Message Input */}
          <div className="pt-1 border-t border-blue-100 mt-auto">
            <div className="bg-blue-50/50 rounded-xl p-1 shadow-sm border border-blue-100">
              <div className="flex items-center gap-2">
                <Textarea
                  placeholder="Type your message..."
                  className="min-h-[40px] h-[40px] resize-none bg-white border-blue-100 focus-visible:ring-blue-200 rounded-xl"
                  value={newMessage}
                  onChange={(e) => handleMessageChange(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      onSendMessage();
                    }
                  }}
                />
                <div className="flex gap-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          className="rounded-full border-blue-200 bg-white hover:bg-blue-50 h-9 w-9 flex-shrink-0"
                        >
                          <Paperclip className="h-4 w-4 text-blue-500" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Attach file</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          size="icon"
                          className="rounded-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-md h-9 w-9 flex-shrink-0"
                          onClick={onSendMessage}
                          disabled={loading || !newMessage.trim()}
                        >
                          {loading ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          ) : (
                            <Send className="h-4 w-4 text-white" />
                          )}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Send message</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center h-full text-center">
          <div className="relative">
            <div className="absolute -inset-4 rounded-full bg-blue-100/50 animate-pulse"></div>
            <div className="relative bg-gradient-to-br from-blue-500 to-purple-500 p-6 rounded-full shadow-lg">
              <MessageSquare className="h-12 w-12 text-white" />
            </div>
          </div>
          <h3 className="text-2xl font-semibold mt-6 mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            No Conversation Selected
          </h3>
          <p className="text-muted-foreground mb-6 max-w-md">
            Select a conversation from the sidebar or start a new one to
            begin messaging with students, parents, or entire classes.
          </p>
          <div className="flex gap-3">
            <Button
              onClick={onOpenCompose}
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-md px-6"
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              New Message
            </Button>
            <Button
              variant="outline"
              onClick={onOpenAnnounce}
              className="border-blue-200 hover:bg-blue-50 shadow-sm px-6"
            >
              <Megaphone className="h-4 w-4 mr-2 text-blue-500" />
              Create Announcement
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}