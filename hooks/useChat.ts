import { useState, useEffect, useCallback, useRef } from "react";
import { ChatMessageService, ChatRoomService } from "@/services/chat-service";
import { useApiHeaders } from "@/lib/api-config";
import {
  EnhancedChatRoom,
  EnhancedChatMessage,
  ChatRoom,
  ChatMessage,
  ChatParticipant,
  CreateChatMessage,
  CreateChatRoom,
} from "@/types/chat";
import { useCommunicationData } from "@/hooks/useCommunicationData";

// -----------------------------
// Helpers
// -----------------------------
const createParticipantsFromCommunicationData = (
  students: any[],
  teachers: any[],
  parents: any[]
): ChatParticipant[] => {
  const participants: ChatParticipant[] = [];

  students.forEach((student) => {
    if (student && student.id && student.name) {
      participants.push({
        id: parseInt(student.id),
        name: student.name,
        role: "student",
        status: "offline",
        avatar: student.avatar || "/assets/images/general/student.png",
      });
    }
  });

  teachers.forEach((teacher) => {
    if (teacher && teacher.id && teacher.name) {
      participants.push({
        id: parseInt(teacher.id),
        name: teacher.name,
        role: "teacher",
        status: "offline",
        avatar: teacher.avatar || "/assets/images/general/teacher.png",
      });
    }
  });

  parents.forEach((parent) => {
    if (parent && parent.id && parent.name) {
      participants.push({
        id: parseInt(parent.id),
        name: parent.name,
        role: "parent",
        status: "offline",
        avatar: parent.avatar || "/assets/images/general/parent.png",
      });
    }
  });

  return participants;
};

const enhanceMessage = (
  message: ChatMessage,
  participants: ChatParticipant[]
): EnhancedChatMessage => {
  const sender = participants.find((p) => p.id === message.sender) || {
    id: message.sender,
    name: "Unknown User",
    role: "student" as const,
    status: "offline" as const,
    avatar: "/assets/images/general/student.png",
  };

  return {
    ...message,
    sender_info: sender,
    timestamp: new Date(message.created_at),
    status: "delivered" as const,
  };
};

const enhanceRoom = (
  room: ChatRoom,
  participants: ChatParticipant[]
): EnhancedChatRoom => {
  // Utiliser les participants réels au lieu de tous les participants
  const roomParticipants = participants.length > 0 
    ? participants 
    : [{
        id: 1,
        name: room.name || "Unknown",
        role: "student" as const,
        status: "offline" as const,
        avatar: "/assets/images/general/student.png",
      }];

  return {
    ...room,
    participants: roomParticipants,
    last_message: null,
    unread_count: 0,
  };
};

// ------------------------------------------------
// HOOK useChatRooms
// ------------------------------------------------
export const useChatRooms = (
  userId: number = 1,
  token?: string,
  tenantDomain?: string
) => {
  const [rooms, setRooms] = useState<EnhancedChatRoom[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<EnhancedChatRoom | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const headers = useApiHeaders();
  const tenantPrimaryDomain = tenantDomain || process.env.NEXT_PUBLIC_TENANT_DOMAIN || "";
  const accessToken = token || (headers["Authorization"]?.replace("Bearer ", "") || "");

  const { students, teachers, parents } = useCommunicationData();
  const allParticipants = createParticipantsFromCommunicationData(
    students,
    teachers,
    parents
  );

  const isConnected = false;
  const wsError = null;
  const reconnect = () => {};
  const hasInitialized = useRef(false);

  const fetchRooms = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      console.log("[useChatRooms] Chargement des rooms...");
      
      const response = await ChatRoomService.listRooms(
        tenantPrimaryDomain,
        accessToken
      );

      console.log("[useChatRooms] Rooms chargées:", response.results.length);

      const enhancedRooms: EnhancedChatRoom[] = response.results.map(
        (room: any) => {
          // Essayer de trouver les participants réels de la room
          const roomParticipants = room.participants && room.participants.length > 0
            ? room.participants.map((participant: any) => ({
                id: participant.id,
                name: participant.full_name || participant.username || "Unknown",
                role: participant.role || "student",
                status: "offline" as const,
                avatar: participant.image_url || "/assets/images/general/student.png",
              }))
            : allParticipants.length > 0
            ? [allParticipants[Math.floor(Math.random() * allParticipants.length)]]
            : [{
                id: 1,
                name: room.name || "Unknown",
                role: "student" as const,
                status: "offline" as const,
                avatar: "/assets/images/general/student.png",
              }];

          return {
            ...room,
            participants: roomParticipants,
            last_message: room.last_message,
            unread_count: room.unread_count || Math.floor(Math.random() * 3),
          };
        }
      );

      setRooms(enhancedRooms);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch rooms";
      setError(errorMessage);
      console.error("[useChatRooms] Erreur chargement rooms:", err);
    } finally {
      setLoading(false);
    }
  }, [tenantPrimaryDomain, accessToken, allParticipants]);

  const createRoom = useCallback(
  async (name: string, participantIds?: number[], isGroup: boolean = false, initialMessage?: string) => {
    try {
      setError(null);
      console.log("[useChatRooms] Création room:", { name, participantIds, isGroup, initialMessage });
      
      const roomData: any = { 
        name 
      };
      
      if (participantIds && participantIds.length > 0) {
        roomData.participants = participantIds;
      }
      
      if (isGroup) {
        roomData.is_group = true;
        roomData.room_type = 'group';
      }

      const newRoom = await ChatRoomService.createChatRoom(
        tenantPrimaryDomain,
        accessToken,
        roomData
      );

      console.log("[useChatRooms] Room créée:", newRoom);

      // Créer une room enrichie
      const roomParticipants = participantIds && participantIds.length > 0 
        ? allParticipants.filter(p => participantIds.includes(p.id))
        : [{
            id: userId,
            name: "You",
            role: "teacher" as const,
            status: "online" as const,
            avatar: "/assets/images/general/teacher.png",
          }];

      const enhancedNewRoom: EnhancedChatRoom = {
        ...newRoom,
        participants: roomParticipants,
        last_message: null,
        unread_count: 0,
      };

      // Ajouter la nouvelle room à la liste
      setRooms(prev => [enhancedNewRoom, ...prev]);
      
      // ENVOYER LE MESSAGE INITIAL SI FOURNI
      if (initialMessage && initialMessage.trim()) {
        try {
          console.log("Envoi du message initial:", initialMessage);
          const messageData: CreateChatMessage = { 
            chat_room_id: enhancedNewRoom.id, 
            content: initialMessage 
          };
          
          await ChatMessageService.createChatMessage(
            tenantPrimaryDomain,
            accessToken,
            messageData
          );
          console.log("Message initial envoyé avec succès");
        } catch (messageError) {
          console.error("Erreur envoi message initial:", messageError);
        }
      }
      
      return enhancedNewRoom;
    } catch (error) {
      console.error("[useChatRooms] Erreur création room:", error);
      setError(error instanceof Error ? error.message : "Failed to create room");
      throw error;
    }
  },
  [tenantPrimaryDomain, accessToken, allParticipants, userId]
);

  const updateRoom = useCallback(
    async (
      roomId: number,
      updates: {
        name?: string;
        details?: string;
        is_group?: boolean;
        is_deleted?: boolean;
        extra_data?: string | Record<string, any>;
      }
    ) => {
      try {
        setError(null);

        const payload = {
          ...updates,
          extra_data: updates.extra_data
            ? JSON.stringify(updates.extra_data)
            : undefined,
        };

        await ChatRoomService.partialUpdateRoom(
          tenantPrimaryDomain,
          accessToken,
          roomId,
          payload
        );

        setRooms((prev) =>
          prev.map((room) => {
            if (room.id === roomId) {
              const merged: ChatRoom = {
                ...room,
                ...updates,
                extra_data:
                  typeof updates.extra_data === "string"
                    ? JSON.parse(updates.extra_data)
                    : updates.extra_data,
              };
              return enhanceRoom(merged, room.participants);
            }
            return room;
          })
        );

        if (selectedRoom?.id === roomId) {
          setSelectedRoom((prev) => {
            if (!prev) return null;

            const merged: ChatRoom = {
              ...prev,
              ...updates,
              extra_data:
                typeof updates.extra_data === "string"
                  ? JSON.parse(updates.extra_data)
                  : updates.extra_data,
            };

            return enhanceRoom(merged, prev.participants);
          });
        }

      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to update room");
        console.error("Error updating room:", err);
        throw err;
      }
    },
    [tenantPrimaryDomain, accessToken, selectedRoom]
  );

  const deleteRoom = useCallback(
    async (roomId: number) => {
      try {
        setError(null);
        await ChatRoomService.deleteRoom(
          tenantPrimaryDomain,
          accessToken,
          roomId
        );

        setRooms((prev) => prev.filter((room) => room.id !== roomId));

        if (selectedRoom?.id === roomId) {
          setSelectedRoom(null);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to delete room");
        console.error("Error deleting room:", err);
        throw err;
      }
    },
    [tenantPrimaryDomain, accessToken, selectedRoom]
  );

  useEffect(() => {
    if (!hasInitialized.current && accessToken) {
      hasInitialized.current = true;
      fetchRooms();
    }
  }, [accessToken, fetchRooms]);

  // Debug effect
  useEffect(() => {
    console.log("useChatRooms] Rooms state:", {
      count: rooms.length,
      rooms: rooms.map(r => ({ id: r.id, name: r.name, participants: r.participants.length }))
    });
  }, [rooms]);

  useEffect(() => {
    console.log("[useChatRooms] Selected room:", selectedRoom);
  }, [selectedRoom]);

  return {
    rooms,
    selectedRoom,
    setSelectedRoom,
    loading,
    error: error || wsError,
    fetchRooms,
    createRoom,
    updateRoom,
    deleteRoom,
    isConnected,
    reconnect,
  };
};

// ------------------------------------------------
// HOOK useChatMessages
// ------------------------------------------------
export const useChatMessages = (
  roomId: number | null,
  token?: string,
  tenantDomain?: string
) => {
  const [messages, setMessages] = useState<EnhancedChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const headers = useApiHeaders();
  const tenantPrimaryDomain = tenantDomain || process.env.NEXT_PUBLIC_TENANT_DOMAIN || "";
  const accessToken = token || (headers["Authorization"]?.replace("Bearer ", "") || "");

  const { students, teachers, parents } = useCommunicationData();
  const allParticipants = createParticipantsFromCommunicationData(
    students,
    teachers,
    parents
  );

  const lastRoomId = useRef<number | null>(null);

  const fetchMessages = useCallback(
    async (limit?: number, offset?: number) => {
      if (!roomId) {
        console.log("[useChatMessages] Aucun roomId, skip fetch");
        return;
      }
      
      try {
        setLoading(true);
        setError(null);
        console.log("[useChatMessages] Chargement messages pour room:", roomId);

        const response = await ChatMessageService.listMessages(
          tenantPrimaryDomain,
          accessToken,
          limit,
          offset
        );

        const roomMessages = response.results.filter(
          (msg) => msg.chat === roomId
        );
        
        console.log("[useChatMessages] Messages chargés:", roomMessages.length);

        const enhancedMessages = roomMessages.map((msg) =>
          enhanceMessage(msg, allParticipants)
        );

        setMessages(enhancedMessages);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to fetch messages";
        setError(errorMessage);
        console.error("[useChatMessages] Erreur chargement messages:", err);
      } finally {
        setLoading(false);
      }
    },
    [tenantPrimaryDomain, accessToken, roomId, allParticipants]
  );

  const sendMessage = useCallback(
    async (content: string) => {
      if (!roomId) {
        console.error("[useChatMessages] Impossible d'envoyer: aucun roomId");
        throw new Error("Aucune conversation sélectionnée");
      }
      
      try {
        setError(null);
        console.log("[useChatMessages] Envoi message:", { roomId, content });
        
        const messageData: CreateChatMessage = { 
          chat_room_id: roomId, 
          content 
        };
        
        // Envoyer le message
        const sentMessage = await ChatMessageService.createChatMessage(
          tenantPrimaryDomain,
          accessToken,
          messageData
        );
        
        console.log("[useChatMessages] Message envoyé:", sentMessage);
        
        // Recharger les messages immédiatement
        await fetchMessages();
        
        return sentMessage;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to send message";
        setError(errorMessage);
        console.error("[useChatMessages] Erreur envoi message:", err);
        throw err;
      }
    },
    [tenantPrimaryDomain, accessToken, roomId, fetchMessages]
  );

  const updateMessage = useCallback(
    async (messageId: number, content: string) => {
      try {
        setError(null);
        await ChatMessageService.partialUpdateMessage(
          tenantPrimaryDomain,
          accessToken,
          messageId,
          { content }
        );
        setMessages((prev) =>
          prev.map((msg) => (msg.id === messageId ? { ...msg, content } : msg))
        );
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to update message");
        console.error("Error updating message:", err);
        throw err;
      }
    },
    [tenantPrimaryDomain, accessToken]
  );

  const deleteMessage = useCallback(
    async (messageId: number) => {
      try {
        setError(null);
        await ChatMessageService.deleteMessage(
          tenantPrimaryDomain,
          accessToken,
          messageId
        );
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === messageId ? { ...msg, is_deleted: true } : msg
          )
        );
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to delete message");
        console.error("Error deleting message:", err);
        throw err;
      }
    },
    [tenantPrimaryDomain, accessToken]
  );

  useEffect(() => {
    if (roomId && roomId !== lastRoomId.current && accessToken) {
      console.log("[useChatMessages] Room changée:", roomId);
      lastRoomId.current = roomId;
      fetchMessages();
    } else if (!roomId && messages.length > 0) {
      console.log("useChatMessages] Clear messages (no room selected)");
      lastRoomId.current = null;
      setMessages([]);
    }
  }, [roomId, accessToken, fetchMessages, messages.length]);

  // Debug effect
  useEffect(() => {
    console.log("[useChatMessages] Messages state:", {
      count: messages.length,
      roomId,
      sample: messages.length > 0 ? messages[0] : null
    });
  }, [messages, roomId]);

  return {
    messages,
    loading,
    error,
    fetchMessages,
    sendMessage,
    updateMessage,
    deleteMessage,
    typing: [],
    userStatuses: {},
  };
};