import { useState, useEffect, useCallback } from "react";
import { ChatMessageService, ChatRoomService } from "@/services/chat-service";
import {
  useChatWebSocket,
  useChatRoomRealtime,
  useUserStatus,
} from "@/hooks/useChatWebSocket";
import {
  EnhancedChatRoom,
  EnhancedChatMessage,
  ChatRoom,
  ChatMessage,
  ChatParticipant,
  CreateChatMessage,
  CreateChatRoom,
} from "@/types/chat";

// Helper functions pour convertir les données API en types enhanced
const enhanceMessage = (
  message: ChatMessage,
  participants: ChatParticipant[]
): EnhancedChatMessage => {
  const sender = participants.find((p) => p.id === message.sender) || {
    id: message.sender,
    name: "Unknown User",
    role: "student" as const,
    status: "offline" as const,
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
  allParticipants: ChatParticipant[]
): EnhancedChatRoom => {
  return {
    ...room,
    participants: allParticipants,
    last_message: null,
    unread_count: 0,
  };
};

// Données mock pour le développement
const mockParticipants: ChatParticipant[] = [
  {
    id: 1,
    name: "Jean Dupont",
    avatar: "/avatars/jean.jpg",
    status: "online",
    role: "teacher",
  },
  {
    id: 2,
    name: "Marie Martin",
    avatar: "/avatars/marie.jpg",
    status: "away",
    role: "student",
  },
  {
    id: 3,
    name: "Pierre Durand",
    status: "offline",
    role: "parent",
  },
];

const mockRooms: ChatRoom[] = [
  {
    id: 1,
    school: "123",
    name: "Classe 6A - Mathématiques",
    details: "Discussion pour le cours de mathématiques",
    is_group: true,
    is_deleted: false,
    uuid: "room-1-uuid",
    created_at: "2024-01-15T10:00:00Z",
    last_update: "2024-01-15T10:00:00Z",
    extra_data: {},
  },
  {
    id: 2,
    school: "123",
    name: "Discussion privée",
    details: "Conversation entre enseignant et parent",
    is_group: false,
    is_deleted: false,
    uuid: "room-2-uuid",
    created_at: "2024-01-16T14:30:00Z",
    last_update: "2024-01-16T14:30:00Z",
    extra_data: {},
  },
];

const mockMessages: ChatMessage[] = [
  {
    id: 1,
    content: "Bonjour, comment allez-vous?",
    is_deleted: false,
    uuid: "msg-1-uuid",
    created_at: "2024-01-15T10:05:00Z",
    last_update: "2024-01-15T10:05:00Z",
    extra_data: {},
    school: 123,
    chat: 1,
    sender: 1,
  },
  {
    id: 2,
    content: "Très bien merci! Et vous?",
    is_deleted: false,
    uuid: "msg-2-uuid",
    created_at: "2024-01-15T10:06:00Z",
    last_update: "2024-01-15T10:06:00Z",
    extra_data: {},
    school: 123,
    chat: 1,
    sender: 2,
  },
];

export const useChatRooms = (userId: number = 1, token?: string) => {
  const [rooms, setRooms] = useState<EnhancedChatRoom[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<EnhancedChatRoom | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Intégration WebSocket
  const {
    isConnected,
    error: wsError,
    reconnect,
  } = useChatWebSocket(userId, token);
  const { updateStatus } = useUserStatus();

  const fetchRooms = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await ChatRoomService.listRooms();

      // Transformer les données de l'API en EnhancedChatRoom
      const enhancedRooms: EnhancedChatRoom[] = response.results.map(
        (room) => ({
          ...room,
          participants: mockParticipants,
          last_message: null,
          unread_count: Math.floor(Math.random() * 5),
        })
      );

      setRooms(enhancedRooms);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch rooms");
      console.error("Error fetching rooms:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const createRoom = useCallback(
    async (roomData: CreateChatRoom) => {
      try {
        setLoading(true);
        setError(null);
        const newRoom = await ChatRoomService.createChatRoom(roomData);

        // Recharger la liste des salons après création
        await fetchRooms();

        return newRoom;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to create room");
        console.error("Error creating room:", err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchRooms]
  );

  const updateRoom = useCallback(
    async (
      roomId: number,
      updates: {
        name?: string;
        details?: string;
        is_group?: boolean;
        is_deleted?: boolean;
        extra_data?: string;
      }
    ) => {
      try {
        setError(null);
        await ChatRoomService.partialUpdateRoom(roomId, updates);

        // Mettre à jour localement
        setRooms((prev) =>
          prev.map((room) => {
            if (room.id === roomId) {
              const baseRoom = { ...room };
              if (updates.name !== undefined) baseRoom.name = updates.name;
              if (updates.details !== undefined)
                baseRoom.details = updates.details;
              if (updates.is_group !== undefined)
                baseRoom.is_group = updates.is_group;
              if (updates.is_deleted !== undefined)
                baseRoom.is_deleted = updates.is_deleted;

              // Convertir le room de base en enhanced room
              return enhanceRoom(baseRoom, mockParticipants);
            }
            return room;
          })
        );

        if (selectedRoom?.id === roomId) {
          setSelectedRoom((prev) => {
            if (!prev) return null;
            const baseRoom = { ...prev };
            if (updates.name !== undefined) baseRoom.name = updates.name;
            if (updates.details !== undefined)
              baseRoom.details = updates.details;
            if (updates.is_group !== undefined)
              baseRoom.is_group = updates.is_group;
            if (updates.is_deleted !== undefined)
              baseRoom.is_deleted = updates.is_deleted;

            return enhanceRoom(baseRoom, mockParticipants);
          });
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to update room");
        console.error("Error updating room:", err);
        throw err;
      }
    },
    [selectedRoom]
  );

  const deleteRoom = useCallback(
    async (roomId: number) => {
      try {
        setError(null);
        await ChatRoomService.deleteRoom(roomId);

        // Supprimer localement
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
    [selectedRoom]
  );

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

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
    // États WebSocket
    isConnected,
    reconnect,
  };
};

export const useChatMessages = (roomId: number | null) => {
  const [messages, setMessages] = useState<EnhancedChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Intégration WebSocket pour les messages en temps réel
  const {
    messages: realtimeMessages,
    typing,
    userStatuses,
    sendMessage: sendRealtimeMessage,
  } = useChatRoomRealtime(roomId);

  // Charger les messages initiaux depuis l'API
  const fetchMessages = useCallback(
    async (limit?: number, offset?: number) => {
      if (!roomId) return;

      try {
        setLoading(true);
        setError(null);
        const response = await ChatMessageService.listMessages(limit, offset);

        // Filtrer les messages pour ce salon et les transformer
        const roomMessages = response.results.filter(
          (msg) => msg.chat === roomId
        );
        const enhancedMessages: EnhancedChatMessage[] = roomMessages.map(
          (msg) => ({
            ...msg,
            sender_info:
              mockParticipants.find((p) => p.id === msg.sender) ||
              mockParticipants[0],
            timestamp: new Date(msg.created_at),
            status: "delivered",
          })
        );

        setMessages(enhancedMessages);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch messages"
        );
        console.error("Error fetching messages:", err);
      } finally {
        setLoading(false);
      }
    },
    [roomId]
  );

  // Fusionner les messages API avec les messages temps réel
  useEffect(() => {
    if (realtimeMessages.length > 0) {
      setMessages((prev) => {
        const allMessages = [...prev, ...realtimeMessages];
        // Éliminer les doublons basés sur l'ID
        const uniqueMessages = allMessages.filter(
          (msg, index, arr) => arr.findIndex((m) => m.id === msg.id) === index
        );
        // Trier par timestamp
        return uniqueMessages.sort(
          (a, b) =>
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
      });
    }
  }, [realtimeMessages]);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!roomId) return;

      try {
        setError(null);

        // Envoyer via WebSocket pour la temps réel
        sendRealtimeMessage(content);

        // Également envoyer via API pour la persistance
        const messageData: CreateChatMessage = {
          chat_room_id: roomId.toString(),
          content,
        };

        await ChatMessageService.createChatMessage(messageData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to send message");
        console.error("Error sending message:", err);
        throw err;
      }
    },
    [roomId, sendRealtimeMessage]
  );

  const updateMessage = useCallback(
    async (messageId: number, content: string) => {
      try {
        setError(null);
        await ChatMessageService.partialUpdateMessage(messageId, { content });

        // Mettre à jour localement
        setMessages((prev) =>
          prev.map((msg) => (msg.id === messageId ? { ...msg, content } : msg))
        );
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to update message"
        );
        console.error("Error updating message:", err);
        throw err;
      }
    },
    []
  );

  const deleteMessage = useCallback(async (messageId: number) => {
    try {
      setError(null);
      await ChatMessageService.deleteMessage(messageId);

      // Marquer comme supprimé localement
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
  }, []);

  useEffect(() => {
    if (roomId) {
      fetchMessages();
    } else {
      setMessages([]);
    }
  }, [roomId, fetchMessages]);

  return {
    messages,
    loading,
    error,
    fetchMessages,
    sendMessage,
    updateMessage,
    deleteMessage,
    // États temps réel
    typing,
    userStatuses,
  };
};
