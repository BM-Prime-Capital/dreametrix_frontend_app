/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from "react";
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
  Users2,
  Users,
  Phone,
  Video,
  Smile,
  Mic,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/utils/tailwind";
import { Conversation } from "./types";

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
  currentUserId: string | number | null;
  isStudent?: boolean;
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
  currentUserId,
  isStudent = false,
}: MessageAreaProps) {
  const [, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const [isRecording, setIsRecording] = useState(false);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleMessageChange = (value: string) => {
    onMessageChange(value);
    setIsTyping(!!value.trim());
  };

  const handleVoiceCall = () => {
    console.log("Démarrage appel vocal avec:", selectedConversation?.displayName);
  };

  const handleVideoCall = () => {
    console.log("Démarrage appel vidéo avec:", selectedConversation?.displayName);
  };

  const handleVoiceMessage = () => {
    setIsRecording(!isRecording);
  };

  return (
    <Card className="p-3 lg:col-span-2 h-[calc(100vh-190px)] flex flex-col bg-white/80 backdrop-blur-sm border-0 shadow-md rounded-xl overflow-hidden">
      {selectedConversation ? (
        <>
          {/* En-tête de conversation amélioré */}
          <div className="flex items-center justify-between pb-3 mb-2 border-b border-blue-100 bg-gradient-to-r from-blue-50 to-white rounded-lg p-3">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Avatar
                  className={cn(
                    "h-14 w-14 rounded-2xl shadow-lg border-2",
                    selectedConversation.type === "announcement"
                      ? "border-purple-300 bg-purple-100"
                      : selectedConversation.type === "class"
                      ? "border-green-300 bg-green-100"
                      : selectedConversation.type === "parent"
                      ? "border-amber-300 bg-amber-100"
                      : "border-blue-300 bg-blue-100"
                  )}
                >
                  <AvatarImage
                    src={selectedConversation.participants[0]?.avatar || "/assets/images/general/student.png"}
                    alt={selectedConversation.displayName}
                    className="object-cover rounded-xl"
                  />
                  <AvatarFallback className="rounded-xl text-lg font-semibold">
                    {selectedConversation.type === "class" ? (
                      <Users className="h-6 w-6" />
                    ) : selectedConversation.type === "announcement" ? (
                      <Megaphone className="h-6 w-6" />
                    ) : selectedConversation.participants.length > 2 ? (
                      <Users2 className="h-6 w-6" />
                    ) : (
                      selectedConversation.displayName.charAt(0)
                    )}
                  </AvatarFallback>
                </Avatar>
                <div
                  className={cn(
                    "absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white",
                    selectedConversation.participants[0]?.status === "online"
                      ? "bg-green-500"
                      : selectedConversation.participants[0]?.status === "busy"
                      ? "bg-red-500"
                      : selectedConversation.participants[0]?.status === "away"
                      ? "bg-yellow-400"
                      : "bg-gray-400"
                  )}
                ></div>
              </div>
              <div>
                <h3 className="font-bold text-xl text-gray-800">
                  {selectedConversation.displayName}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <Badge
                    className={cn(
                      "text-xs py-1 px-3 font-semibold",
                      selectedConversation.type === "announcement"
                        ? "bg-purple-100 text-purple-800 border-purple-300"
                        : selectedConversation.type === "class"
                        ? "bg-green-100 text-green-800 border-green-300"
                        : selectedConversation.type === "parent"
                        ? "bg-amber-100 text-amber-800 border-amber-300"
                        : "bg-blue-100 text-blue-800 border-blue-300"
                    )}
                  >
                    {selectedConversation.type === "class"
                      ? "Class Group"
                      : selectedConversation.type === "parent"
                      ? "Parent Group"
                      : selectedConversation.type === "announcement"
                      ? "Announcement"
                      : `${selectedConversation.participants.length} members`}
                  </Badge>
                  <span className="text-xs text-gray-500 flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    {selectedConversation.participants[0]?.status === "online"
                      ? "Active now"
                      : selectedConversation.participants[0]?.status === "busy"
                      ? "Busy"
                      : selectedConversation.participants[0]?.status === "away"
                      ? "Away"
                      : "Offline"}
                  </span>
                </div>
              </div>
            </div>

            {/* Boutons d'appel et actions */}
            <div className="flex items-center gap-2">
              <TooltipProvider>
                {/* Masquer les boutons d'appel pour les students si nécessaire */}
                {!isStudent && (
                  <>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={handleVoiceCall}
                          className="rounded-full border-green-200 bg-green-50 hover:bg-green-100 transition-all duration-200 hover:scale-110"
                        >
                          <Phone className="h-4 w-4 text-green-600" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Voice Call</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={handleVideoCall}
                          className="rounded-full border-blue-200 bg-blue-50 hover:bg-blue-100 transition-all duration-200 hover:scale-110"
                        >
                          <Video className="h-4 w-4 text-blue-600" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Video Call</TooltipContent>
                    </Tooltip>
                  </>
                )}

                {/* Autres actions */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-full border-blue-100 hover:bg-blue-50 transition-all duration-200"
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
                      className="rounded-full border-blue-100 hover:bg-blue-50 transition-all duration-200"
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
                      className="rounded-full border-blue-100 hover:bg-blue-50 transition-all duration-200"
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
                      className="rounded-full border-red-200 bg-red-50 hover:bg-red-100 transition-all duration-200 ml-2"
                    >
                      <X className="h-4 w-4 text-red-500" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Close conversation</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>

          {/* Zone des messages avec design amélioré */}
          <div className="flex-1 overflow-y-auto py-3 space-y-4 px-3 mb-2 bg-gradient-to-b from-gray-50/50 to-white rounded-lg">
            {loading ? (
              <div className="flex justify-center items-center h-full">
                <div className="flex flex-col items-center gap-3">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
                  <p className="text-gray-500">Loading messages...</p>
                </div>
              </div>
            ) : messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-12">
                <MessageSquare className="h-16 w-16 text-gray-300 mb-4" />
                <h4 className="text-lg font-semibold text-gray-500 mb-2">No messages yet</h4>
                <p className="text-gray-400 max-w-sm">
                  Start the conversation by sending the first message
                </p>
              </div>
            ) : (
              <>
                {messages.map((message: any) => {
                  // CORRECTION: Vérifier si c'est l'utilisateur courant qui a envoyé le message
                  const isCurrentUser = 
                    message.sender_info?.id?.toString() === currentUserId?.toString() ||
                    message.sender?.id?.toString() === currentUserId?.toString();

                  console.log("Message debug:", {
    messageId: message.id,
    senderId: message.sender_info?.id,
    senderRole: message.sender_info?.role,
    currentUserId,
    isCurrentUser
  });

                  // CORRECTION: Pour les étudiants, leurs propres messages doivent être à DROITE
                  // Les messages des autres (teachers, autres étudiants) doivent être à GAUCHE
                  return (
                    <div
                      key={message.uuid || message.id}
                      className={`flex gap-3 max-w-[85%] animate-fade-in ${
                        isCurrentUser ? "ml-auto flex-row-reverse" : ""
                      }`}
                    >
                      <Avatar
                        className={cn(
                          "h-10 w-10 rounded-xl border-2 shadow-md flex-shrink-0 transition-all duration-200 hover:scale-105",
                          isCurrentUser
                            ? "border-blue-300 bg-gradient-to-br from-blue-100 to-blue-200"
                            : "border-green-300 bg-gradient-to-br from-green-100 to-green-200"
                        )}
                      >
                        <AvatarImage
                          src={message.sender_info?.avatar || message.sender?.avatar}
                          alt={message.sender_info?.name || message.sender?.name}
                          className="object-cover rounded-lg"
                        />
                        <AvatarFallback className="rounded-lg font-medium">
                          {(message.sender_info?.name?.charAt(0) || message.sender?.name?.charAt(0) || "?")}
                        </AvatarFallback>
                      </Avatar>

                      <div
                        className={cn(
                          "rounded-2xl p-4 shadow-sm transition-all duration-200 hover:shadow-md",
                          isCurrentUser
                            ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white mr-0"
                            : "bg-gradient-to-br from-gray-100 to-white border border-gray-200 text-gray-800"
                        )}
                      >
                        <div className="flex justify-between items-center mb-2">
                          <span
                            className={cn(
                              "text-sm font-semibold",
                              isCurrentUser ? "text-blue-100" : "text-gray-700"
                            )}
                          >
                            {message.sender_info?.name || message.sender?.name}
                            {!isCurrentUser && message.sender_info?.role === "teacher" && (
                              <span className="ml-2 text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                                Teacher
                              </span>
                            )}
                          </span>
                          <span
                            className={cn(
                              "text-xs flex items-center gap-1",
                              isCurrentUser ? "text-blue-200" : "text-gray-500"
                            )}
                          >
                            {typeof message.timestamp === "object"
                              ? message.timestamp.toLocaleTimeString("en-US", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })
                              : message.timestamp}
                            {isCurrentUser && <CheckCheck className="h-3 w-3 ml-1" />}
                          </span>
                        </div>
                        <p
                          className={cn(
                            "text-sm leading-relaxed",
                            isCurrentUser ? "text-white" : "text-gray-800"
                          )}
                        >
                          {message.content}
                        </p>

                        {message.attachments && message.attachments.length > 0 && (
                          <div
                            className={cn(
                              "mt-3 pt-3",
                              isCurrentUser
                                ? "border-t border-white/30"
                                : "border-t border-gray-200"
                            )}
                          >
                            {message.attachments.map((attachment: any, i: number) => (
                              <div
                                key={i}
                                className={cn(
                                  "flex items-center gap-2 text-xs mt-2 p-2 rounded-lg",
                                  isCurrentUser 
                                    ? "bg-white/20" 
                                    : "bg-gray-100"
                                )}
                              >
                                <Paperclip
                                  className={cn(
                                    "h-3 w-3",
                                    isCurrentUser ? "text-blue-200" : "text-gray-600"
                                  )}
                                />
                                <a
                                  href={attachment.url}
                                  className={cn(
                                    "underline font-medium",
                                    isCurrentUser
                                      ? "text-blue-200 hover:text-white"
                                      : "text-blue-600 hover:text-blue-800"
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
                  );
                })}
              </>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Zone de saisie améliorée avec plus de fonctionnalités */}
          <div className="pt-2 border-t border-gray-200 mt-auto">
            <div className="bg-white rounded-2xl p-3 shadow-lg border border-gray-200">
              <div className="flex items-end gap-3">
                {/* Boutons d'actions */}
                <div className="flex gap-1">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          className="rounded-full border-gray-200 bg-gray-50 hover:bg-gray-100 h-10 w-10 transition-all duration-200"
                        >
                          <Smile className="h-5 w-5 text-gray-600" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Emoji</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          className="rounded-full border-gray-200 bg-gray-50 hover:bg-gray-100 h-10 w-10 transition-all duration-200"
                        >
                          <Paperclip className="h-5 w-5 text-gray-600" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Attach file</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={handleVoiceMessage}
                          className={cn(
                            "rounded-full h-10 w-10 transition-all duration-200",
                            isRecording
                              ? "bg-red-50 border-red-200 hover:bg-red-100"
                              : "border-gray-200 bg-gray-50 hover:bg-gray-100"
                          )}
                        >
                          <Mic className={cn("h-5 w-5", isRecording ? "text-red-500" : "text-gray-600")} />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        {isRecording ? "Stop recording" : "Voice message"}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>

                {/* Zone de texte */}
                <Textarea
                  placeholder="Type your message..."
                  className="min-h-[50px] max-h-[120px] resize-none bg-gray-50 border-gray-200 focus-visible:ring-blue-200 rounded-xl flex-1 transition-all duration-200"
                  value={newMessage}
                  onChange={(e) => handleMessageChange(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      onSendMessage();
                    }
                  }}
                />

                {/* Bouton d'envoi */}
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size="icon"
                        className={cn(
                          "rounded-full shadow-lg h-11 w-11 flex-shrink-0 transition-all duration-200 hover:scale-105",
                          newMessage.trim()
                            ? "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                            : "bg-gray-300 cursor-not-allowed"
                        )}
                        onClick={onSendMessage}
                        disabled={loading || !newMessage.trim()}
                      >
                        {loading ? (
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        ) : (
                          <Send className="h-5 w-5 text-white" />
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Send message</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              {/* Indicateur d'enregistrement */}
              {isRecording && (
                <div className="flex items-center gap-2 mt-3 p-2 bg-red-50 rounded-lg border border-red-200">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-red-700 font-medium">Recording...</span>
                  <Button
                    variant="outline"
                    size="sm"
                    className="ml-auto text-xs h-7 px-2"
                    onClick={handleVoiceMessage}
                  >
                    Stop
                  </Button>
                </div>
              )}
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
            {isStudent 
              ? "Select a conversation to view messages from your teachers and classmates."
              : "Select a conversation from the sidebar or start a new one to begin messaging with students, parents, or entire classes."
            }
          </p>
          {/* Masquer les boutons de création pour les students */}
          {!isStudent && (
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
          )}
        </div>
      )}
    </Card>
  );
}