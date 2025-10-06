"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Search,
  MessageSquare,
  Users,
  User,
  Bell,
  Send,
  Paperclip,
  Calendar,
  X,
  Megaphone,
  Star,
  Filter,
  MoreHorizontal,
  Clock,
  CheckCheck,
} from "lucide-react";
import { useStudentChat } from "@/hooks/useStudentChat";
import { useChatNotifications } from "@/hooks/useChatNotifications";
import { useCommunicationData } from "@/hooks/useCommunicationData";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { TooltipProvider } from "@/components/ui/tooltip";
import PageTitleH1 from "@/components/ui/page-title-h1";
import { cn } from "@/utils/tailwind";
import { useRequestInfo } from "@/hooks/useRequestInfo";
import { localStorageKey } from "@/constants/global";

// Types
interface Message {
  id: string;
  sender: {
    id: string;
    name: string;
    avatar: string;
    role: "teacher" | "student" | "parent";
  };
  content: string;
  timestamp: string;
  attachments?: { name: string; url: string }[];
  read: boolean;
}

interface Conversation {
  id: string;
  type: "individual" | "class" | "parent" | "announcement";
  participants: {
    id: string;
    name: string;
    avatar: string;
    role: "teacher" | "student" | "parent";
  }[];
  lastMessage: Message;
  unreadCount: number;
  displayName: string;
}

export default function StudentCommunication() {
  const { tenantDomain, accessToken } = useRequestInfo();
  const [searchQuery, setSearchQuery] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [composeDialogOpen, setComposeDialogOpen] = useState(false);
  const [announceDialogOpen, setAnnounceDialogOpen] = useState(false);
  const [recipientType, setRecipientType] = useState<
    "student" | "class" | "parent"
  >("student");
  const [selectedRecipients, setSelectedRecipients] = useState<string[]>([]);
  const [isCreatingConversation, setIsCreatingConversation] = useState(false);
  const [isCreatingAnnouncement, setIsCreatingAnnouncement] = useState(false);

  const storedUser = localStorage.getItem(localStorageKey.USER_DATA);
  const currentUserId = storedUser ? JSON.parse(storedUser).id : null;

  const {
    classes,
    students,
    parents,
    teachers,
    loading: dataLoading,
    error: dataError,
    refetch: refetchData,
  } = useCommunicationData();

  console.log("[DEBUG-StudentCommunication.tsx] Composant monté");

  useEffect(() => {
    console.log("🔍 DEBUG StudentCommunication Data:", {
      dataLoading,
      dataError,
      studentsCount: students?.length || 0,
      classesCount: classes?.length || 0,
      parentsCount: parents?.length || 0,
      teachersCount: teachers?.length || 0,
      sampleStudent: students?.[0],
      sampleClass: classes?.[0],
    });
  }, [dataLoading, dataError, students, classes, parents, teachers]);

  const {
    notifyConversationCreated,
    notifyAnnouncementSent,
    notifyMessageSent,
    notifyCreationError,
    notifyMessageError,
  } = useChatNotifications();

  // CORRIGÉ: Utilisation du hook useStudentChat
  const {
    allRooms,
    selectedRoom,
    setSelectedRoom,
    deselectRoom,
    messages,
    loading: roomsLoading,
    error: roomsError,
    sendMessage,
  } = useStudentChat(currentUserId, accessToken, tenantDomain);

  const setIsTyping = (_value?: boolean) => {};

  const cleanRoomName = (name: string): string => {
    if (!name) return "Unnamed Group";
    let clean = name.trim();
    clean = clean.replace(/^(Classe|Class)\s*/i, "");
    return `Class ${clean}`;
  };

  // const conversations: Conversation[] = useMemo(() => {
  //   return rooms.map((room) => {
  //     const isGroup = room.is_group;
  //     let conversationType: "individual" | "class" | "announcement" | "parent" = "individual";
  //     let displayName = "Conversation";

  //     if (isGroup) {
  //       if (room.room_type === "class") {
  //         conversationType = "class";
  //         displayName = `Group: ${room.name}`;
  //       } else if (room.room_type === "announcement") {
  //         conversationType = "announcement";
  //         displayName = `Group Announcement: ${room.name}`;
  //       } else if (room.room_type === "parent") {
  //         conversationType = "parent";
  //         displayName = `Parent Group: ${room.name}`;
  //       } else {
  //         conversationType = "class";
  //         displayName = `Group: ${room.name}`;
  //       }
  //     } else {
  //       conversationType = "individual";
  //       displayName =
  //         room.participants.find(
  //           (p) => p.id.toString() !== currentUserId?.toString()
  //         )?.name ||
  //         room.participants[0]?.name ||
  //         "Unknown User";
  //     }

  //     return {
  //       id: room.id.toString(),
  //       type: conversationType,
  //       participants: room.participants.map((p) => ({
  //         id: p.id.toString(),
  //         name: p.name,
  //         avatar: p.avatar || "/assets/images/general/student.png",
  //         role:
  //           p.role === "admin"
  //             ? "teacher"
  //             : (p.role as "teacher" | "student" | "parent"),
  //       })),
  //       displayName,
  //       lastMessage: room.last_message
  //         ? {
  //             id: room.last_message.uuid.toString(),
  //             sender: {
  //               id: room.last_message.sender_info.id.toString(),
  //               name: room.last_message.sender_info.name,
  //               avatar:
  //                 room.last_message.sender_info.avatar ||
  //                 "/assets/images/general/student.png",
  //               role:
  //                 room.last_message.sender_info.role === "admin"
  //                   ? "teacher"
  //                   : (room.last_message.sender_info.role as
  //                       | "teacher"
  //                       | "student"
  //                       | "parent"),
  //             },
  //             content: room.last_message.content,
  //             timestamp: new Date(
  //               room.last_message.created_at
  //             ).toLocaleTimeString("fr-FR", {
  //               hour: "2-digit",
  //               minute: "2-digit",
  //             }),
  //             read: room.last_message.status !== "sent",
  //           }
  //         : {
  //             id: "",
  //             sender: { id: "", name: "", avatar: "", role: "student" },
  //             content: "Aucun message",
  //             timestamp: "",
  //             read: true,
  //           },
  //       unreadCount: room.unread_count,
  //     };
  //   });
  // }, [rooms, currentUserId]);

  // const chatMessages: Message[] = useMemo(() => {
  //   return messages.map((msg) => ({
  //     id: msg.uuid.toString(),
  //     sender: {
  //       id: msg.sender_info.id.toString(),
  //       name: msg.sender_info.name,
  //       avatar: msg.sender_info.avatar || "/assets/images/general/student.png",
  //       role:
  //         msg.sender_info.role === "admin"
  //           ? "teacher"
  //           : (msg.sender_info.role as "teacher" | "student" | "parent"),
  //     },
  //     content: msg.content,
  //     timestamp: new Date(msg.created_at).toLocaleTimeString("fr-FR", {
  //       hour: "2-digit",
  //       minute: "2-digit",
  //     }),
  //     read: msg.status !== "sent",
  //   }));
  // }, [messages]);

const conversations: Conversation[] = useMemo(() => {
  if (!allRooms || !Array.isArray(allRooms)) {
    console.log("[DEBUG] allRooms est undefined ou pas un tableau:", allRooms);
    return [];
  }

  
  
  return allRooms.map((room) => {
    const isGroup = room.is_group;
    let conversationType: "individual" | "class" | "announcement" | "parent" = "individual";
    let displayName = "Conversation";

    if (isGroup) {
      if (room.room_type === "class") {
        conversationType = "class";
        displayName = `Group: ${room.name}`;
      } else if (room.room_type === "announcement") {
        conversationType = "announcement";
        displayName = `Group Announcement: ${room.name}`;
      } else if (room.room_type === "parent") {
        conversationType = "parent";
        displayName = `Parent Group: ${room.name}`;
      } else {
        conversationType = "class";
        displayName = `Group: ${room.name}`;
      }
    } else {
      conversationType = "individual";
      displayName =
        room.participants?.find(
          (p) => p.id.toString() !== currentUserId?.toString()
        )?.name ||
        room.participants?.[0]?.name ||
        "Unknown User";
    }

    return {
      id: room.id.toString(),
      type: conversationType,
      participants: room.participants?.map((p) => ({
        id: p.id.toString(),
        name: p.name,
        avatar: p.avatar || "/assets/images/general/student.png",
        role:
          p.role === "admin"
            ? "teacher"
            : (p.role as "teacher" | "student" | "parent"),
      })) || [],
      displayName,
      lastMessage: room.last_message
        ? {
            id: room.last_message.uuid.toString(),
            sender: {
              id: room.last_message.sender_info.id.toString(),
              name: room.last_message.sender_info.name,
              avatar:
                room.last_message.sender_info.avatar ||
                "/assets/images/general/student.png",
              role:
                room.last_message.sender_info.role === "admin"
                  ? "teacher"
                  : (room.last_message.sender_info.role as
                      | "teacher"
                      | "student"
                      | "parent"),
            },
            content: room.last_message.content,
            timestamp: new Date(
              room.last_message.created_at
            ).toLocaleTimeString("fr-FR", {
              hour: "2-digit",
              minute: "2-digit",
            }),
            read: room.last_message.status !== "sent",
          }
        : {
            id: "",
            sender: { id: "", name: "", avatar: "", role: "student" },
            content: "Aucun message",
            timestamp: "",
            read: true,
          },
      unreadCount: room.unread_count || 0,
    };
  });
}, [allRooms, currentUserId]);

  const chatMessages: Message[] = useMemo(() => {
  console.log("🔍 DEBUG messages raw:", messages);
  
  const formattedMessages = messages.map((msg) => {
    const formatted = {
      id: msg.uuid.toString(),
      sender: {
        id: msg.sender_info.id.toString(),
        name: msg.sender_info.name,
        avatar: msg.sender_info.avatar || "/assets/images/general/student.png",
        role:
          msg.sender_info.role === "admin"
            ? "teacher"
            : (msg.sender_info.role as "teacher" | "student" | "parent"),
      },
      content: msg.content,
      timestamp: new Date(msg.created_at).toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      read: msg.status !== "sent",
    };
    
    console.log("🔍 DEBUG message mapping:", {
      raw: msg,
      formatted: formatted,
      currentUserId,
      isCurrentUser: formatted.sender.id === currentUserId?.toString()
    });
    
    return formatted;
  });
  
  return formattedMessages;
}, [messages, currentUserId]);
  const selectedConversation = useMemo(() => {
    return selectedRoom
      ? conversations.find((c) => c.id === selectedRoom.id.toString()) || null
      : null;
  }, [selectedRoom, conversations]);

  const filteredConversations = useMemo(() => {
    return conversations.filter((conversation) => {
      const participantNames = conversation.participants.map((p) =>
        p.name.toLowerCase()
      );
      return participantNames.some((name) =>
        name.includes(searchQuery.toLowerCase())
      );
    });
  }, [conversations, searchQuery]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedRoom) return;

    try {
      await sendMessage(newMessage.trim());
      setNewMessage("");
      setIsTyping(false);
      notifyMessageSent();
    } catch (error) {
      console.error("Erreur lors de l'envoi du message:", error);
      notifyMessageError();
    }
  };

  const handleMessageChange = (value: string) => {
    setNewMessage(value);
    if (value.trim()) {
      setIsTyping(true);
    } else {
      setIsTyping(false);
    }
  };

  // const handleSelectConversation = (conversation: Conversation) => {
  //   const room = rooms.find((r) => r.id.toString() === conversation.id);
  //   if (room) {
  //     setSelectedRoom(room);
  //   }
  // };

  const handleSelectConversation = (conversation: Conversation) => {
  // Remplacer rooms par allRooms
  const room = allRooms.find((r) => r.id.toString() === conversation.id);
  if (room) {
    setSelectedRoom(room);
  }
};

  // CORRIGÉ: Désactiver la création de conversation pour les étudiants
  const handleCreateConversation = async () => {
    notifyCreationError("conversation");
    setComposeDialogOpen(false);
    setSelectedRecipients([]);
  };

  // CORRIGÉ: Désactiver la création d'annonces pour les étudiants
  const handleCreateAnnouncement = async () => {
    notifyCreationError("announcement");
    setAnnounceDialogOpen(false);
    setSelectedRecipients([]);
  };

  

  if (dataError) {
    return (
      <div className="flex flex-col gap-4 w-full">
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-red-800 mb-2">
                Error Loading Data
              </h3>
              <p className="text-red-600 mb-4">{dataError}</p>
              <Button
                onClick={refetchData}
                className="bg-red-600 hover:bg-red-700"
              >
                Try Again
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <section className="flex flex-col gap-4 w-full">
        {/* Header - Masquer les boutons pour les étudiants */}
        <div className="flex justify-between items-center bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 px-6 py-5 rounded-xl shadow-lg overflow-hidden relative animate-fade-in">
          <div className="absolute inset-0 bg-[url('/assets/images/bg.png')] bg-cover bg-center opacity-10"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/80 via-purple-500/80 to-pink-500/80"></div>

          <div className="flex items-center gap-3 relative z-10">
            <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm shadow-inner border border-white/30">
              <MessageSquare className="h-6 w-6 text-white" />
            </div>
            <div>
              <PageTitleH1
                title="Student Communication"
                className="text-white font-bold"
              />
              <p className="text-blue-100 text-sm mt-1">
                Connect with teachers and classmates
              </p>
            </div>
          </div>

          {/* MASQUER les boutons New Message et Announcement pour les étudiants */}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 animate-fade-in">
          {/* Sidebar */}
          <Card className="p-3 lg:col-span-1 h-[calc(100vh-190px)] flex flex-col bg-white/80 backdrop-blur-sm border-0 shadow-md rounded-xl overflow-hidden">
            <div className="flex items-center gap-2 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-blue-500" />
                <Input
                  placeholder="Search messages..."
                  className="pl-9 border-blue-100 bg-blue-50/50 focus-visible:ring-blue-200 rounded-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full border-blue-100 bg-blue-50/50 hover:bg-blue-100/50"
                    title="Filter messages"
                  >
                    <Filter className="h-4 w-4 text-blue-500" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="rounded-xl shadow-lg border-blue-100"
                >
                  <DropdownMenuItem className="cursor-pointer">
                    All Messages
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer">
                    Unread
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer">
                    Teachers
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer">
                    Classmates
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer">
                    Classes
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer">
                    Announcements
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* TABS adaptés pour les étudiants */}
            <Tabs defaultValue="all" className="mb-4">
              <TabsList className="grid grid-cols-4 bg-blue-50/50 p-1 rounded-xl">
                <TabsTrigger
                  value="all"
                  className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm"
                >
                  All
                </TabsTrigger>
                <TabsTrigger
                  value="teachers"
                  className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm"
                >
                  Teachers
                </TabsTrigger>
                <TabsTrigger
                  value="classes"
                  className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm"
                >
                  Classes
                </TabsTrigger>
                <TabsTrigger
                  value="classmates"
                  className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm"
                >
                  Classmates
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="overflow-y-auto flex-1">
              {roomsLoading ? (
                <div className="flex flex-col items-center justify-center h-full text-center p-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mb-2"></div>
                  <p className="text-muted-foreground">
                    Loading conversations...
                  </p>
                </div>
              ) : roomsError ? (
                <div className="flex flex-col items-center justify-center h-full text-center p-4">
                  <MessageSquare className="h-12 w-12 text-red-300 mb-2" />
                  <p className="text-red-500 text-sm">Error: {roomsError}</p>
                </div>
              ) : filteredConversations.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center p-4">
                  <MessageSquare className="h-12 w-12 text-muted-foreground mb-2 opacity-20" />
                  <p className="text-muted-foreground">
                    No conversations yet
                  </p>
                </div>
              ) : (
                <div className="space-y-1">
                  {filteredConversations.map((conversation) => (
                    <div
                      key={conversation.id}
                      className={cn(
                        "flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all animate-fade-in",
                        selectedConversation?.id === conversation.id
                          ? "bg-gradient-to-r from-blue-50 to-blue-100 border-l-4 border-blue-500 shadow-sm"
                          : "hover:bg-blue-50/50 border-l-4 border-transparent"
                      )}
                      onClick={() => handleSelectConversation(conversation)}
                    >
                      <Avatar
                        className={cn(
                          "h-12 w-12 rounded-xl shadow-sm border-2",
                          conversation.type === "announcement"
                            ? "border-purple-200 bg-purple-50"
                            : conversation.type === "class"
                            ? "border-green-200 bg-green-50"
                            : conversation.type === "parent"
                            ? "border-amber-200 bg-amber-50"
                            : "border-blue-200 bg-blue-50"
                        )}
                      >
                        <AvatarImage
                          src={conversation.participants[0].avatar}
                          alt={conversation.displayName}
                          className="object-cover rounded-lg"
                        />
                        <AvatarFallback className="rounded-lg">
                          {conversation.participants[0].name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center">
                          <p
                            className={cn(
                              "font-medium truncate",
                              conversation.unreadCount > 0
                                ? "text-blue-800 font-semibold"
                                : ""
                            )}
                          >
                            {conversation.displayName}
                            {conversation.unreadCount > 0 && (
                              <span className="ml-2 inline-flex h-2 w-2 rounded-full bg-blue-500"></span>
                            )}
                          </p>
                          <span className="text-xs text-muted-foreground">
                            {conversation.lastMessage.timestamp}
                          </span>
                        </div>

                        <div className="flex items-center gap-1 mt-0.5">
                          {conversation.type === "announcement" && (
                            <Badge
                              variant="outline"
                              className="text-xs py-0 h-5 bg-purple-50 text-purple-700 border-purple-200"
                            >
                              <Megaphone className="h-3 w-3 mr-1" />
                              Announcement
                            </Badge>
                          )}
                          {conversation.type === "class" && (
                            <Badge
                              variant="outline"
                              className="text-xs py-0 h-5 bg-green-50 text-green-700 border-green-200"
                            >
                              <Users className="h-3 w-3 mr-1" />
                              Class
                            </Badge>
                          )}
                          {conversation.type === "parent" && (
                            <Badge
                              variant="outline"
                              className="text-xs py-0 h-5 bg-amber-50 text-amber-700 border-amber-200"
                            >
                              <User className="h-3 w-3 mr-1" />
                              Parent
                            </Badge>
                          )}
                          <p className="text-sm text-muted-foreground truncate">
                            {conversation.lastMessage.content}
                          </p>
                        </div>
                      </div>

                      {conversation.unreadCount > 0 && (
                        <Badge className="h-6 w-6 flex items-center justify-center p-0 rounded-full bg-blue-500 text-white font-medium shadow-sm">
                          {conversation.unreadCount}
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>

          {/* Message Content */}
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
                        alt={selectedConversation.displayName}
                        className="object-cover rounded-lg"
                      />
                      <AvatarFallback className="rounded-lg">
                        {selectedConversation.displayName}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-lg">
                        {selectedConversation.displayName}
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
                            onClick={() => deselectRoom()}
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
                  {roomsLoading ? (
                    <div className="flex justify-center items-center h-full">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                    </div>
                  ) : chatMessages.length === 0 ? (
                    <div className="flex justify-center items-center h-full text-gray-500">
                      <p>No messages in this conversation</p>
                    </div>
                  ) : (
                    <>
                      {chatMessages.map((message) => {
                        // CORRECTION : Vérifier si c'est l'utilisateur courant
                        const isCurrentUser = message.sender.id.toString() === currentUserId?.toString();
                        
                        return (
                          <div
                            key={message.id}
                            className={`flex gap-3 max-w-[85%] animate-fade-in ${
                              isCurrentUser || message.sender.role === "teacher"
                                ? "ml-auto flex-row-reverse"  // Student courant + teachers à droite
                                : ""
                            }`}
                          >
                            <Avatar
                              className={cn(
                                "h-9 w-9 mt-1 rounded-xl border-2 shadow-sm flex-shrink-0",
                                isCurrentUser || message.sender.role === "teacher"
                                  ? "border-blue-200 bg-blue-50"    // Style pour messages à droite
                                  : "border-blue-100"               // Style pour messages à gauche
                              )}
                            >
                              <AvatarImage
                                src={message.sender.avatar}
                                alt={message.sender.name}
                                className="object-cover rounded-lg"
                              />
                              <AvatarFallback className="rounded-lg">
                                {message.sender.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>

                            <div
                              className={cn(
                                "rounded-2xl p-3 shadow-sm",
                                isCurrentUser || message.sender.role === "teacher"
                                  ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white mr-0"  // Bubble bleue
                                  : "bg-gradient-to-br from-gray-50 to-blue-50 border border-blue-100 text-gray-800"  // Bubble grise
                              )}
                            >
                              <div className="flex justify-between items-center mb-1">
                                <span
                                  className={cn(
                                    "text-xs font-medium",
                                    isCurrentUser || message.sender.role === "teacher"
                                      ? "text-blue-100"
                                      : "text-blue-700"
                                  )}
                                >
                                  {message.sender.name}
                                  {message.sender.role === "teacher" && (
                                    <span className="ml-2 text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                                      Teacher
                                    </span>
                                  )}
                                  {isCurrentUser && (
                                    <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                                      You
                                    </span>
                                  )}
                                </span>
                                <span
                                  className={cn(
                                    "text-xs flex items-center gap-1",
                                    isCurrentUser || message.sender.role === "teacher"
                                      ? "text-blue-100"
                                      : "text-blue-400"
                                  )}
                                >
                                  {message.timestamp}
                                  {(isCurrentUser || message.sender.role === "teacher") && (
                                    <CheckCheck className="h-3 w-3 ml-1" />
                                  )}
                                </span>
                              </div>
                              <p
                                className={cn(
                                  "text-sm leading-relaxed",
                                  isCurrentUser || message.sender.role === "teacher"
                                    ? "text-white"
                                    : "text-gray-800"
                                )}
                              >
                                {message.content}
                              </p>

                              {message.attachments &&
                                message.attachments.length > 0 && (
                                  <div
                                    className={cn(
                                      "mt-3 pt-2",
                                      isCurrentUser || message.sender.role === "teacher"
                                        ? "border-t border-white/20"
                                        : "border-t border-blue-100"
                                    )}
                                  >
                                    {message.attachments.map((attachment, i) => (
                                      <div
                                        key={i}
                                        className="flex items-center gap-1 text-xs mt-1"
                                      >
                                        <Paperclip
                                          className={cn(
                                            "h-3 w-3",
                                            isCurrentUser || message.sender.role === "teacher"
                                              ? "text-blue-100"
                                              : "text-blue-500"
                                          )}
                                        />
                                        <a
                                          href={attachment.url}
                                          className={cn(
                                            "underline",
                                            isCurrentUser || message.sender.role === "teacher"
                                              ? "text-blue-100 hover:text-white"
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
                            handleSendMessage();
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
                                onClick={handleSendMessage}
                                disabled={roomsLoading || !newMessage.trim()}
                              >
                                {roomsLoading ? (
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
                  Select a conversation to view messages from your teachers and classmates.
                </p>
              </div>
            )}
          </Card>
        </div>
      </section>

      {/* Dialogs masqués ou adaptés pour les étudiants */}
      <Dialog open={composeDialogOpen} onOpenChange={setComposeDialogOpen}>
        <DialogContent className="sm:max-w-[500px] border-0 shadow-2xl bg-gradient-to-b from-white to-blue-50/50">
          <DialogHeader className="pb-2 border-b">
            <DialogTitle className="text-xl font-semibold text-blue-700 flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              View Conversations
            </DialogTitle>
          </DialogHeader>
          <div className="py-8 text-center">
            <MessageSquare className="h-12 w-12 text-blue-300 mx-auto mb-4" />
            <p className="text-muted-foreground">
              Students can only join existing conversations created by teachers.
            </p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setComposeDialogOpen(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={announceDialogOpen} onOpenChange={setAnnounceDialogOpen}>
        <DialogContent className="sm:max-w-[500px] border-0 shadow-2xl bg-gradient-to-b from-white to-purple-50/50">
          <DialogHeader className="pb-2 border-b">
            <DialogTitle className="text-xl font-semibold text-purple-700 flex items-center gap-2">
              <Megaphone className="h-5 w-5" />
              View Announcements
            </DialogTitle>
          </DialogHeader>
          <div className="py-8 text-center">
            <Megaphone className="h-12 w-12 text-purple-300 mx-auto mb-4" />
            <p className="text-muted-foreground">
              Students can only view announcements created by teachers.
            </p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setAnnounceDialogOpen(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}