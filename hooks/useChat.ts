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

// Dans useChat.ts - remplacez la fonction cleanRoomName
const cleanRoomName = (
  room: any, 
  currentUserId: string, 
  roomType?: string
): string => {
  const { name, participants, is_group } = room;

  // Conversations individuelles
  if (!is_group) {
    const otherParticipants = participants?.filter((p: any) => 
      p.id.toString() !== currentUserId.toString()
    ) || [];
    
    if (otherParticipants.length === 1) {
      return otherParticipants[0].full_name || otherParticipants[0].username;
    } else if (otherParticipants.length > 1) {
      return `Group (${otherParticipants.length})`;
    }
  }

  // Groupes - nettoie le nom existant
  let cleanName = name?.trim() || '';

  // Supprime tous les préfixes problématiques
  cleanName = cleanName.replace(/^(Classe|Class|Conversation avec|Group:|Announcement:|Parent Group:|Classe Class|\d+ classes?)\s*/i, '');
  
  // Si vide après nettoyage, génère un nom logique
  if (!cleanName || cleanName === 'Unnamed Group') {
    return generateLogicalGroupName(room, currentUserId, roomType);
  }

  return cleanName;
};

const generateLogicalGroupName = (
  room: any, 
  currentUserId: string, 
  roomType?: string
): string => {
  const { participants, is_group } = room;
  
  const otherParticipants = participants?.filter((p: any) => 
    p.id.toString() !== currentUserId.toString()
  ) || [];

  const participantCount = otherParticipants.length;

  switch (roomType) {
    case 'class':
      return participantCount > 0 ? 
        `Class (${participantCount})` : 
        'Class Group';
    
    case 'announcement':
      return participantCount > 0 ?
        `Announcement (${participantCount})` :
        'Announcement';
    
    case 'parent':
      return participantCount > 0 ?
        `Parents (${participantCount})` :
        'Parents';
    
    default:
      if (participantCount === 0) return 'Group';
      if (participantCount === 1) return otherParticipants[0].full_name;
      return `Group (${participantCount})`;
  }
};




const enhanceMessage = (
  message: any, // Utiliser un type plus spécifique si possible
  participants: ChatParticipant[]
): EnhancedChatMessage => {
  const sender = participants.find((p) => p.id === message.sender.id) || {
    id: message.sender.id,
    name: message.sender.full_name || "Unknown User",
    role: "student" as const,
    status: "offline" as const,
    avatar: "/assets/images/general/student.png",
  };

  return {
    // Propriétés de base du message depuis l'API
    uuid: message.uuid, // ← UUID récupéré directement de la réponse API
    created_at: message.created_at,
    last_update: message.last_update,
    content: message.content,
    message_type: message.message_type,
    attachment_url: message.attachment_url,
    voice_note_url: message.voice_note_url,
    is_deleted: message.is_deleted,
    extra_data: message.extra_data,
    
    // Expéditeur avec structure complète
    sender: {
      id: message.sender.id,
      username: message.sender.username,
      full_name: message.sender.full_name,
      email: message.sender.email
    },
    
    // Propriétés enrichies pour l'UI
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

    // Trier par date du dernier message
    const sortedResults = [...response.results].sort((a, b) => {
      const dateA = a.last_message ? new Date(a.last_message.created_at).getTime() : 0;
      const dateB = b.last_message ? new Date(b.last_message.created_at).getTime() : 0;
      return dateB - dateA;
    });


// Dans useChat.ts - remplacez l'appel à cleanRoomName
const enhancedRooms: EnhancedChatRoom[] = sortedResults.map((room: any) => {
  const rawParticipants = room.participants?.map((participant: any) => ({
    id: participant.id,
    name: participant.full_name || participant.username || "Unknown",
    role: participant.role || "student",
    status: "offline" as const,
    avatar: participant.image_url || "/assets/images/general/student.png",
  })) || [];

  // Utilisez la nouvelle fonction avec l'objet room complet
  const displayName = cleanRoomName(room, userId?.toString() || '', room.room_type);

  let roomParticipants;
  
  if (room.is_group) {
    roomParticipants = rawParticipants.length > 0
      ? rawParticipants
      : [{
          id: room.id,
          name: displayName,
          role: "student" as const,
          status: "offline" as const,
          avatar: "/assets/images/general/student.png",
        }];
  } else {
    const visibleParticipants = rawParticipants.filter(p => p.id.toString() !== userId?.toString());
    roomParticipants = visibleParticipants.length > 0
      ? visibleParticipants
      : rawParticipants;
  }

  return {
    ...room,
    name: displayName,
    room_type: room.room_type || (room.is_group ? "group" : "private"),
    participants: roomParticipants,
    last_message: room.last_message
      ? enhanceMessage(room.last_message, rawParticipants)
      : null,
    unread_count: room.unread_count || 0,
  };
});


    console.log("[useChatRooms] Rooms triées et enrichies:", enhancedRooms.length);
    setRooms(enhancedRooms);
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Failed to fetch rooms";
    setError(errorMessage);
    console.error("[useChatRooms] Erreur chargement rooms:", err);
  } finally {
    setLoading(false);
  }
}, [tenantPrimaryDomain, accessToken, userId]);



const createRoom = useCallback(
  async (
    name: string,
    participantIds?: number[],
    isGroup: boolean = false,
    initialMessage?: string
  ) => {
    try {
      setError(null);
      console.log("[useChatRooms] Création room:", { name, participantIds, isGroup, initialMessage });

      // ⚡ Nettoyer le nom ici
      const normalizedName = cleanRoomName(name);

      // Construire le payload avec le nom nettoyé
      const roomData: any = { name: normalizedName };

      if (participantIds && participantIds.length > 0) {
        roomData.participant_ids = participantIds;
      }

      if ((participantIds && participantIds.length > 1) || isGroup) {
        roomData.is_group = true;
        roomData.room_type = "group";
      } else {
        roomData.is_group = false;
        roomData.room_type = "private";
      }

      // Création côté API
      const newRoom = await ChatRoomService.createChatRoom(
        tenantPrimaryDomain,
        accessToken,
        {
          ...roomData,
          initial_message: initialMessage?.trim() || undefined,
        }
      );

      console.log("[useChatRooms] Room créée:", newRoom);

      // Participants API
      const rawParticipants = newRoom.participants?.map((participant: any) => ({
        id: participant.id,
        name: participant.full_name || participant.username || "Unknown",
        role: participant.role || "student",
        status: "offline" as const,
        avatar: participant.image_url || "/assets/images/general/student.png",
      })) || [];

      let roomParticipants;
      if (newRoom.is_group) {
        roomParticipants = rawParticipants.length > 0
          ? rawParticipants
          : [{
              id: newRoom.id,
              name: normalizedName, // ⚡ garder nom déjà nettoyé
              role: "student" as const,
              status: "offline" as const,
              avatar: "/assets/images/general/student.png",
            }];
      } else {
        const visibleParticipants = rawParticipants.filter(p => p.id !== userId);
        roomParticipants = visibleParticipants.length > 0
          ? visibleParticipants
          : rawParticipants.length > 0
            ? rawParticipants
            : [{
                id: newRoom.id,
                name: "Unknown Conversation",
                role: "student" as const,
                status: "offline" as const,
                avatar: "/assets/images/general/student.png",
              }];
      }

      const enhancedNewRoom: EnhancedChatRoom = {
        ...newRoom,
        name: normalizedName, // ⚡ utiliser le nom corrigé
        room_type: newRoom.room_type || (newRoom.is_group ? "group" : "private"),
        participants: roomParticipants,
        last_message: newRoom.last_message
          ? enhanceMessage(newRoom.last_message, rawParticipants)
          : null,
        unread_count: 0,
      };

      setRooms(prev => [enhancedNewRoom, ...prev]);

      return enhancedNewRoom;
    } catch (error) {
      console.error("[useChatRooms] Erreur création room:", error);
      setError(error instanceof Error ? error.message : "Failed to create room");
      throw error;
    }
  },
  [tenantPrimaryDomain, accessToken, userId]
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
  roomUuid?: string,
  token?: string,
  tenantDomain?: string
) => {
  const [messages, setMessages] = useState<EnhancedChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const headers = useApiHeaders();
  const tenantPrimaryDomain =
    tenantDomain || process.env.NEXT_PUBLIC_TENANT_DOMAIN || "";
  const accessToken =
    token || headers["Authorization"]?.replace("Bearer ", "") || "";

  const { students, teachers, parents } = useCommunicationData();
  const allParticipants = createParticipantsFromCommunicationData(
    students,
    teachers,
    parents
  );

  const lastRoomId = useRef<number | null>(null);

  // ---------------- FETCH MESSAGES ----------------
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

        const roomMessages = response.results.filter((msg) => msg.chat === roomId);

        console.log("[useChatMessages] Messages chargés:", roomMessages.length);

        const enhancedMessages = roomMessages
        .map((msg) => enhanceMessage(msg, allParticipants))
        .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()); // 👈 tri ASC


        setMessages(enhancedMessages);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to fetch messages";
        setError(errorMessage);
        console.error("[useChatMessages] Erreur chargement messages:", err);
      } finally {
        setLoading(false);
      }
    },
    [tenantPrimaryDomain, accessToken, roomId, allParticipants]
  );

  // ---------------- SEND MESSAGE ----------------
  const sendMessage = useCallback(
    async (content: string) => {
      if (!roomUuid) {
        console.error("[useChatMessages] Impossible d'envoyer: aucun roomUuid");
        throw new Error("Aucune conversation sélectionnée");
      }

      try {
        setError(null);
        console.log("[useChatMessages] Envoi message:", { roomUuid, content });

        const formData = new FormData();
        formData.append("chat_room_id", roomUuid); // ⚡ UUID obligatoire
        formData.append("content", content);

        const sentMessage = await ChatMessageService.createChatMessage(
          tenantPrimaryDomain,
          accessToken,
          formData
        );

        console.log("[useChatMessages] Message envoyé:", sentMessage);

        await fetchMessages();
        return sentMessage;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to send message";
        setError(errorMessage);
        console.error("[useChatMessages] Erreur envoi message:", err);
        throw err;
      }
    },
    [tenantPrimaryDomain, accessToken, roomUuid, fetchMessages]
  );

  // ---------------- UPDATE MESSAGE ----------------
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
          prev.map((msg) =>
            msg.id === messageId ? { ...msg, content } : msg
          )
        );
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to update message"
        );
        console.error("Error updating message:", err);
        throw err;
      }
    },
    [tenantPrimaryDomain, accessToken]
  );

  // ---------------- DELETE MESSAGE ----------------
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
        setError(
          err instanceof Error ? err.message : "Failed to delete message"
        );
        console.error("Error deleting message:", err);
        throw err;
      }
    },
    [tenantPrimaryDomain, accessToken]
  );

  // ---------------- EFFECTS ----------------
  useEffect(() => {
    if (roomId && roomId !== lastRoomId.current && accessToken) {
      console.log("[useChatMessages] Room changée:", roomId);
      lastRoomId.current = roomId;
      fetchMessages();
    } else if (!roomId && messages.length > 0) {
      console.log("[useChatMessages] Clear messages (no room selected)");
      lastRoomId.current = null;
      setMessages([]);
    }
  }, [roomId, accessToken, fetchMessages, messages.length]);

  useEffect(() => {
    console.log("[useChatMessages] Messages state:", {
      count: messages.length,
      roomId,
      sample: messages.length > 0 ? messages[0] : null,
    });
  }, [messages, roomId]);

  // ---------------- RETURN ----------------
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
