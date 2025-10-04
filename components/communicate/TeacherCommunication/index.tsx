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
import { localStorageKey } from "@/constants/global";

export default function StudentCommunication() {
  const [searchQuery, setSearchQuery] = useState("");
  // const [newMessage, setNewMessage] = useState("");
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
  } = useChatMessages(
      selectedRoom?.id || null,
  selectedRoom?.uuid || undefined
  );
const cleanRoomName = (name: string): string => {
  if (!name) return "Unnamed Group";

  let clean = name.trim();

  // Supprime les préfixes "Classe" ou "Class" s'ils existent
  clean = clean.replace(/^(Classe|Class)\s*/i, "");

  // Retourne toujours avec "Class " au début
  return `Class ${clean}`;
};
  // Conversion des rooms en conversations
const conversations: Conversation[] = useMemo(() => {
  return rooms.map((room) => {
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
      displayName,  // 👈 ajouté
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
}, [rooms, currentUserId]);


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
      const room = rooms.find((r) => r.id.toString() === conversation.id);
      if (room) {
        setSelectedRoom(room);
      }
    },
    [rooms, setSelectedRoom]
  );

// -----------------------
// Créer une conversation
// -----------------------
// index.tsx
const handleCreateConversation = async () => {
      console.log("🎯 Creating conversation with recipients DANS INDE.TS:", {
    selectedRecipients,
    recipientType,
    students: students.filter(s => selectedRecipients.includes(s.id)),
    classes: classes.filter(c => selectedRecipients.includes(c.id)),
    parents: parents.filter(p => selectedRecipients.includes(p.id))
  });
  if (selectedRecipients.length === 0 || isCreatingConversation) return;

  setIsCreatingConversation(true);

  try {
    let conversationName = "";

    // Extraire uniquement les IDs numériques
    const participantIds = selectedRecipients
      .map((id) => {
        if (id.startsWith("student-")) return Number(id.replace("student-", ""));
        if (id.startsWith("class-")) return Number(id.replace("class-", ""));
        if (id.startsWith("parent-")) return Number(id.replace("parent-", ""));
        return NaN;
      })
      .filter((n) => !isNaN(n)); // élimine NaN

    if (recipientType === "student") {
      const selectedStudentNames = students
        .filter((student) => selectedRecipients.includes(`student-${student.id}`))
        .map((student) => student.name);
      conversationName =
        selectedStudentNames.length === 1
          ? `Conversation avec ${selectedStudentNames[0]}`
          : `Conversation avec ${selectedStudentNames.length} students`;
    } else if (recipientType === "class") {
      const selectedClassNames = classes
        .filter((cls) => selectedRecipients.includes(`class-${cls.id}`))
        .map((cls) => cls.name);
      conversationName =
        selectedClassNames.length === 1
          ? `Classe ${selectedClassNames[0]}`
          : `${selectedClassNames.length} classes`;
    } else if (recipientType === "parent") {
      const selectedParentNames = parents
        .filter((parent) => selectedRecipients.includes(`parent-${parent.id}`))
        .map((parent) => parent.name);
      conversationName =
        selectedParentNames.length === 1
          ? `Conversation avec ${selectedParentNames[0]}`
          : `Conversation avec ${selectedParentNames.length} parents`;
    }

    // Envoi correct avec IDs numériques
    const newRoom = await createRoom(
      conversationName,
      participantIds,
      participantIds.length > 1, // group si plusieurs
      composeMessage.trim() || undefined
    );

    if (newRoom) {
      setSelectedRoom(newRoom);
      setComposeMessage("");
      notifyConversationCreated(conversationName);
    }

    setComposeDialogOpen(false);
    setSelectedRecipients([]);
  } catch (error) {
    console.error("Erreur lors de la création de la conversation:", error);
    notifyCreationError("conversation");
  } finally {
    setIsCreatingConversation(false);
  }
};


// -----------------------
// Créer une annonce
// -----------------------
const handleCreateAnnouncement = async () => {
  if (!announcementMessage.trim() || selectedRecipients.length === 0 || isCreatingAnnouncement) return;

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
          await sendMessage(announcementMessage.trim());
          setAnnouncementMessage(""); // reset uniquement l’annonce
        } catch (error) {
          console.error("Erreur lors de l'envoi du message d'annonce:", error);
        }
      }, 500);
    }

    setAnnounceDialogOpen(false);
    setSelectedRecipients([]);
    notifyAnnouncementSent(selectedRecipients.length);
  } catch (error) {
    console.error("Erreur lors de la création de l'annonce:", error);
    notifyCreationError("announcement");
  } finally {
    setIsCreatingAnnouncement(false);
  }
};

// -----------------------
// Envoyer un message dans un chat existant
// -----------------------
const handleSendMessage = async () => {
  if (!chatMessage.trim() || !selectedRoom) return;

  try {
    await sendMessage(chatMessage.trim());
    setChatMessage(""); // vider uniquement la zone de chat
    notifyMessageSent();
  } catch (error) {
    console.error("Erreur lors de l'envoi du message:", error);
    notifyMessageError();
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
          newMessage={chatMessage}                 // message du chat
          onMessageChange={setChatMessage}         // maj state du chat
          onSendMessage={handleSendMessage}
          onDeselectConversation={() => setSelectedRoom(null)}
          onOpenCompose={() => setComposeDialogOpen(true)}
          onOpenAnnounce={() => setAnnounceDialogOpen(true)}
          currentUserId={currentUserId}
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
      newMessage={composeMessage}                 // message du modal "New Message"
      onMessageChange={setComposeMessage}         // maj state compose
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
      newMessage={announcementMessage}            // message du modal "Announcement"
      onMessageChange={setAnnouncementMessage}    // maj state announcement
      onCreateAnnouncement={handleCreateAnnouncement}
      isCreating={isCreatingAnnouncement}
      classes={classes}
      dataLoading={dataLoading}
    />
  </div>
);

}