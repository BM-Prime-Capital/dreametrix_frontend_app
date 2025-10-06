"use client";

import { useState, useMemo, useCallback } from "react";
import { useStudentChat } from "@/hooks/useStudentChat";
import { useChatNotifications } from "@/hooks/useChatNotifications";
import { useCommunicationData } from "@/hooks/useCommunicationData"; 
import { Button } from "@/components/ui/button";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { MessageArea } from "./MessageArea";
import { ComposeDialog } from "./ComposeDialog";
import { AnnounceDialog } from "./AnnounceDialog";
import { Conversation, RecipientType } from "./types";
import { localStorageKey } from "@/constants/global";

export default function StudentCommunication() {
  const [searchQuery, setSearchQuery] = useState("");
  const [composeMessage, setComposeMessage] = useState("");
  const [chatMessage, setChatMessage] = useState("");
  const [announcementMessage, setAnnouncementMessage] = useState("");

  const [composeDialogOpen, setComposeDialogOpen] = useState(false);
  const [announceDialogOpen, setAnnounceDialogOpen] = useState(false);
  const [recipientType, setRecipientType] = useState<RecipientType>("student");
  const [selectedRecipients, setSelectedRecipients] = useState<string[]>([]);
  const [isCreatingConversation, setIsCreatingConversation] = useState(false);
  const [isCreatingAnnouncement, setIsCreatingAnnouncement] = useState(false);

  const storedUser = localStorage.getItem(localStorageKey.USER_DATA);
  const currentUserId = storedUser ? JSON.parse(storedUser).id : null;

  const {
    classes,
    students,
    parents,
    loading: dataLoading,
    error: dataError,
    refetch: refetchData,
  } = useCommunicationData();

  const {
    notifyConversationCreated,
    notifyAnnouncementSent,
    notifyMessageSent,
    notifyCreationError,
    notifyMessageError,
  } = useChatNotifications();

  // Utiliser le hook student
  const {
    allRooms,
    selectedRoom,
    setSelectedRoom,
    deselectRoom,
    messages,
    loading: roomsLoading,
    error: roomsError,
    sendMessage,
  } = useStudentChat(currentUserId);

  const cleanRoomName = (name: string): string => {
    if (!name) return "Unnamed Group";

    let clean = name.trim();
    clean = clean.replace(/^(Classe|Class)\s*/i, "");
    return `Class ${clean}`;
  };

  // Conversion des rooms en conversations
  const conversations: Conversation[] = useMemo(() => {
    return allRooms.map((room) => {
      const isGroup = room.is_group;

      const displayName = isGroup
        ? cleanRoomName(room.name) || "Unnamed Group"
        : room.participants.find((p) => p.id.toString() !== currentUserId?.toString())?.name || 
          room.participants[0]?.name || "Unknown User";

      return {
        id: room.id.toString(),
        type: isGroup ? "class" : "individual",
        participants: room.participants.map((p) => ({
          id: p.id.toString(),
          name: p.name,
          avatar: p.avatar || "/assets/images/general/student.png",
          role: p.role === "admin" ? "teacher" : (p.role as "teacher" | "student" | "parent"),
        })),
        displayName,
        lastMessage: room.last_message
          ? {
              id: room.last_message.uuid.toString(),
              sender: {
                id: room.last_message.sender_info.id.toString(),
                name: room.last_message.sender_info.name,
                avatar: room.last_message.sender_info.avatar || "/assets/images/general/student.png",
                role: room.last_message.sender_info.role === "admin"
                  ? "teacher"
                  : (room.last_message.sender_info.role as "teacher" | "student" | "parent"),
              },
              content: room.last_message.content,
              timestamp: new Date(room.last_message.created_at).toLocaleTimeString("fr-FR", {
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
        unreadCount: room.unread_count,
      };
    });
  }, [allRooms, currentUserId]);

  // CORRECTION: Transformer les messages pour qu'ils aient le même format
  const formattedMessages = useMemo(() => {
    return messages.map((msg) => ({
      id: msg.uuid?.toString() || msg.uuid?.toString(),
      uuid: msg.uuid,
      content: msg.content,
      timestamp: msg.timestamp || new Date(msg.created_at),
      sender: {
        id: msg.sender_info?.id?.toString() || msg.sender?.id?.toString(),
        name: msg.sender_info?.name ,
        role: msg.sender_info?.role ,
      },
      sender_info: {
        id: msg.sender_info?.id?.toString() || msg.sender?.id?.toString(),
        name: msg.sender_info?.name ,
        avatar: msg.sender_info?.avatar  || "/assets/images/general/student.png",
        role: msg.sender_info?.role ,
      },
      // attachments: msg.attachments || [],
      created_at: msg.created_at,
      status: msg.status || "delivered",
    }));
  }, [messages]);

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

  const handleSelectConversation = useCallback(
    (conversation: Conversation) => {
      const room = allRooms.find((r) => r.id.toString() === conversation.id);
      if (room) {
        setSelectedRoom(room);
      }
    },
    [allRooms, setSelectedRoom]
  );

  // Utiliser la fonction du hook
  const handleDeselectConversation = useCallback(() => {
    deselectRoom();
  }, [deselectRoom]);

  // -----------------------
  // Créer une conversation (DÉSACTIVÉ POUR STUDENT)
  // -----------------------
  const handleCreateConversation = async () => {
    notifyCreationError("conversation");
    setComposeDialogOpen(false);
    setSelectedRecipients([]);
  };

  // -----------------------
  // Créer une annonce (DÉSACTIVÉ POUR STUDENT)
  // -----------------------
  const handleCreateAnnouncement = async () => {
    notifyCreationError("announcement");
    setAnnounceDialogOpen(false);
    setSelectedRecipients([]);
  };

  // -----------------------
  // Envoyer un message dans un chat existant
  // -----------------------
  const handleSendMessage = async () => {
    if (!chatMessage.trim() || !selectedRoom) return;

    try {
      await sendMessage(chatMessage.trim());
      setChatMessage("");
      notifyMessageSent();
    } catch (error) {
      console.error("Erreur lors de l'envoi du message:", error);
      notifyMessageError();
    }
  };

  console.log("[DEBUG-index.tsx] Composant monté");

  const toggleRecipient = (id: string) => {
    setSelectedRecipients((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
    );
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
        <Header
          onOpenCompose={() => setComposeDialogOpen(true)}
          onOpenAnnounce={() => setAnnounceDialogOpen(true)}
          isStudent={true}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 animate-fade-in">
          <Sidebar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            conversations={filteredConversations}
            selectedConversation={selectedConversation}
            onSelectConversation={handleSelectConversation}
            onOpenCompose={() => setComposeDialogOpen(true)}
            loading={roomsLoading}
            error={roomsError}
            isStudent={true}
          />

          <MessageArea
            selectedConversation={selectedConversation}
            messages={formattedMessages}  // CORRIGÉ: utiliser formattedMessages
            loading={roomsLoading}
            newMessage={chatMessage}
            onMessageChange={setChatMessage}
            onSendMessage={handleSendMessage}
            onDeselectConversation={handleDeselectConversation}
            onOpenCompose={() => setComposeDialogOpen(true)}
            onOpenAnnounce={() => setAnnounceDialogOpen(true)}
            currentUserId={currentUserId}
            isStudent={true}
          />
        </div>
      </section>

      <ComposeDialog
        open={composeDialogOpen}
        onOpenChange={setComposeDialogOpen}
        recipientType={recipientType}
        onRecipientTypeChange={setRecipientType}
        selectedRecipients={selectedRecipients}
        setSelectedRecipients={setSelectedRecipients} 
        onRecipientToggle={toggleRecipient}
        newMessage={composeMessage}
        onMessageChange={setComposeMessage}
        onCreateConversation={handleCreateConversation}
        isCreating={isCreatingConversation}
        students={students}
        classes={classes}
        parents={parents}
        dataLoading={dataLoading}
        dataError={dataError}
        onRetryData={refetchData}
        isStudent={true}
      />

      <AnnounceDialog
        open={announceDialogOpen}
        onOpenChange={setAnnounceDialogOpen}
        selectedRecipients={selectedRecipients}
        onRecipientToggle={toggleRecipient}
        newMessage={announcementMessage}
        onMessageChange={setAnnouncementMessage}
        onCreateAnnouncement={handleCreateAnnouncement}
        isCreating={isCreatingAnnouncement}
        classes={classes}
        dataLoading={dataLoading}
        isStudent={true}
      />
    </div>
  );
}