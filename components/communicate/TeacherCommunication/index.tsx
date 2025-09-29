"use client";

import { useState, useMemo, useCallback } from "react";
import { useChatRooms, useChatMessages } from "@/hooks/useChat";
import { useChatNotifications } from "@/hooks/useChatNotifications";
import { useCommunicationData } from "@/hooks/useCommunicationData"; 
import { Button } from "@/components/ui/button";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { MessageArea } from "./MessageArea";
import { ComposeDialog } from "./ComposeDialog";
import { AnnounceDialog } from "./AnnounceDialog";
import { Conversation, RecipientType } from "./types";

export default function TeacherCommunication() {
  const [searchQuery, setSearchQuery] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [composeDialogOpen, setComposeDialogOpen] = useState(false);
  const [announceDialogOpen, setAnnounceDialogOpen] = useState(false);
  const [recipientType, setRecipientType] = useState<RecipientType>("student");
  const [selectedRecipients, setSelectedRecipients] = useState<string[]>([]);
  const [isCreatingConversation, setIsCreatingConversation] = useState(false);
  const [isCreatingAnnouncement, setIsCreatingAnnouncement] = useState(false);

  const currentUserId = 1; // À remplacer par l'ID réel de l'utilisateur connecté

  const {
    classes,
    students,
    parents,
   // teachers,
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

  const {
    rooms,
    selectedRoom,
    setSelectedRoom,
    loading: roomsLoading,
    error: roomsError,
    createRoom,
  } = useChatRooms(currentUserId);

  const {
    messages,
    loading: messagesLoading,
    //error: messagesError,
    sendMessage,
  } = useChatMessages(selectedRoom?.id || null);

  // Conversion des rooms en conversations
  const conversations: Conversation[] = useMemo(() => {
    return rooms.map((room) => ({
      id: room.id.toString(),
      type: room.is_group ? "class" : "individual",
      participants: room.participants.map((p) => ({
        id: p.id.toString(),
        name: p.name,
        avatar: p.avatar || "/assets/images/general/student.png",
        role:
          p.role === "admin"
            ? "teacher"
            : (p.role as "teacher" | "student" | "parent"),
      })),
      lastMessage: room.last_message?.id // ✅ Utilisation de l'opérateur de chaînage optionnel
        ? {
            id: room.last_message.id.toString(),
            sender: {
              id: room.last_message.sender_info?.id?.toString() || "unknown", // ✅ Chaînage optionnel
              name: room.last_message.sender_info?.name || "Unknown User", // ✅ Chaînage optionnel
              avatar:
                room.last_message.sender_info?.avatar || // ✅ Chaînage optionnel
                "/assets/images/general/student.png",
              role:
                room.last_message.sender_info?.role === "admin" // ✅ Chaînage optionnel
                  ? "teacher"
                  : (room.last_message.sender_info?.role as // ✅ Chaînage optionnel
                      | "teacher"
                      | "student"
                      | "parent" || "student"), // ✅ Fallback
            },
            content: room.last_message.content || "Aucun message", // ✅ Fallback
            timestamp: room.last_message.created_at 
              ? new Date(room.last_message.created_at).toLocaleTimeString("fr-FR", {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "",
            read: room.last_message.status !== "sent",
          }
        : {
            id: "",
            sender: {
              id: "",
              name: "",
              avatar: "",
              role: "student" as const,
            },
            content: "Aucun message",
            timestamp: "",
            read: true,
          },
      unreadCount: room.unread_count,
    }));
  }, [rooms]);

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
      notifyMessageSent();
    } catch (error) {
      console.error("Erreur lors de l'envoi du message:", error);
      notifyMessageError();
    }
  };

  const handleSelectConversation = useCallback(
    (conversation: Conversation) => {
      const room = rooms.find((r) => r.id.toString() === conversation.id);
      if (room) {
        setSelectedRoom(room);
      }
    },
    [rooms, setSelectedRoom]
  );

  const handleCreateConversation = async () => {
    if (selectedRecipients.length === 0 || isCreatingConversation) return;

    setIsCreatingConversation(true);

    try {
      let conversationName = "";

      if (recipientType === "student") {
        const selectedStudentNames = students
          .filter((student) => selectedRecipients.includes(student.id))
          .map((student) => student.name);
        conversationName =
          selectedStudentNames.length === 1
            ? `Conversation avec ${selectedStudentNames[0]}`
            : `Conversation avec ${selectedStudentNames.length} étudiants`;
      } else if (recipientType === "class") {
        const selectedClassNames = classes
          .filter((cls) => selectedRecipients.includes(cls.id))
          .map((cls) => cls.name);
        conversationName =
          selectedClassNames.length === 1
            ? `Classe ${selectedClassNames[0]}`
            : `${selectedClassNames.length} classes`;
      } else if (recipientType === "parent") {
        const selectedParentNames = parents
          .filter((parent) => selectedRecipients.includes(parent.id))
          .map((parent) => parent.name);
        conversationName =
          selectedParentNames.length === 1
            ? `Conversation avec ${selectedParentNames[0]}`
            : `Conversation avec ${selectedParentNames.length} parents`;
      }

      await createRoom(conversationName);
      setComposeDialogOpen(false);
      setSelectedRecipients([]);
      notifyConversationCreated(conversationName);
    } catch (error) {
      console.error("Erreur lors de la création de la conversation:", error);
      notifyCreationError("conversation");
    } finally {
      setIsCreatingConversation(false);
    }
  };

  const handleCreateAnnouncement = async () => {
    if (
      !newMessage.trim() ||
      selectedRecipients.length === 0 ||
      isCreatingAnnouncement
    )
      return;

    setIsCreatingAnnouncement(true);

    try {
      const selectedClassNames = classes
        .filter((cls) => selectedRecipients.includes(cls.id))
        .map((cls) => cls.name);

      const announcementName =
        selectedClassNames.length === 1
          ? `Annonce - ${selectedClassNames[0]}`
          : `Annonce - ${selectedClassNames.length} classes`;

      const newRoom = await createRoom(announcementName);

      if (newRoom && selectedRoom) {
        setTimeout(async () => {
          try {
            await sendMessage(newMessage.trim());
          } catch (error) {
            console.error(
              "Erreur lors de l'envoi du message d'annonce:",
              error
            );
          }
        }, 500);
      }

      setAnnounceDialogOpen(false);
      setSelectedRecipients([]);
      setNewMessage("");
      notifyAnnouncementSent(selectedRecipients.length);
    } catch (error) {
      console.error("Erreur lors de la création de l'annonce:", error);
      notifyCreationError("announcement");
    } finally {
      setIsCreatingAnnouncement(false);
    }
  };

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
          />

          <MessageArea
            selectedConversation={selectedConversation}
            messages={messages}
            loading={messagesLoading}
            newMessage={newMessage}
            onMessageChange={setNewMessage}
            onSendMessage={handleSendMessage}
            onDeselectConversation={() => setSelectedRoom(null)}
            onOpenCompose={() => setComposeDialogOpen(true)}
            onOpenAnnounce={() => setAnnounceDialogOpen(true)}
          />
        </div>
      </section>

      <ComposeDialog
        open={composeDialogOpen}
        onOpenChange={setComposeDialogOpen}
        recipientType={recipientType}
        onRecipientTypeChange={setRecipientType}
        selectedRecipients={selectedRecipients}
        onRecipientToggle={toggleRecipient}
        newMessage={newMessage}
        onMessageChange={setNewMessage}
        onCreateConversation={handleCreateConversation}
        isCreating={isCreatingConversation}
        students={students}
        classes={classes}
        parents={parents}
        dataLoading={dataLoading}
        dataError={dataError}
        onRetryData={refetchData}
      />

      <AnnounceDialog
        open={announceDialogOpen}
        onOpenChange={setAnnounceDialogOpen}
        selectedRecipients={selectedRecipients}
        onRecipientToggle={toggleRecipient}
        newMessage={newMessage}
        onMessageChange={setNewMessage}
        onCreateAnnouncement={handleCreateAnnouncement}
        isCreating={isCreatingAnnouncement}
        classes={classes}
        dataLoading={dataLoading}
      />
    </div>
  );
}