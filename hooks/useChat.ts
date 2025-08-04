import { useState, useEffect, useCallback, useRef } from "react";
import { ChatMessageService, ChatRoomService } from "@/services/chat-service";
import { useApiHeaders } from "@/lib/api-config";
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
import { useCommunicationData } from "@/hooks/useCommunicationData";

// Helper function to convert communication data to chat participants
const createParticipantsFromCommunicationData = (
  students: any[],
  teachers: any[],
  parents: any[]
): ChatParticipant[] => {
  const participants: ChatParticipant[] = [];

  // Add students
  students.forEach((student) => {
    participants.push({
      id: parseInt(student.id),
      name: student.name,
      role: "student",
      status: "offline",
      avatar: student.avatar,
    });
  });

  // Add teachers
  teachers.forEach((teacher) => {
    participants.push({
      id: parseInt(teacher.id),
      name: teacher.name,
      role: "teacher",
      status: "offline",
      avatar: teacher.avatar,
    });
  });

  // Add parents
  parents.forEach((parent) => {
    participants.push({
      id: parseInt(parent.id),
      name: parent.name,
      role: "parent",
      status: "offline",
      avatar: parent.avatar,
    });
  });

  return participants;
};

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

export const useChatRooms = (userId: number = 1, token?: string) => {
  const [rooms, setRooms] = useState<EnhancedChatRoom[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<EnhancedChatRoom | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Headers API avec authentification
  const headers = useApiHeaders();

  // Get real communication data
  const { students, teachers, parents } = useCommunicationData();

  // Create participants from real data
  const allParticipants = createParticipantsFromCommunicationData(
    students,
    teachers,
    parents
  );

  // Intégration WebSocket (DÉSACTIVÉ TEMPORAIREMENT)
  // const {
  //   isConnected,
  //   error: wsError,
  //   reconnect,
  // } = useChatWebSocket(userId, token);
  // const { updateStatus } = useUserStatus();

  // Variables temporaires pour remplacer WebSocket
  const isConnected = false;
  const wsError = null;
  const reconnect = () => {};

  // Utiliser useRef pour éviter les boucles infinies
  const hasInitialized = useRef(false);

  const fetchRooms = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await ChatRoomService.listRooms(headers);

      console.log("🔍 DEBUG API Rooms Response:", response);
      console.log("🔍 DEBUG All Participants:", allParticipants);

      // Transformer les données de l'API en EnhancedChatRoom
      const enhancedRooms: EnhancedChatRoom[] = response.results.map(
        (room: any) => {
          // Créer des participants par défaut pour chaque room
          // En attendant une API qui retourne les vrais participants de la room
          const roomParticipants =
            allParticipants.length > 0
              ? [
                  allParticipants[
                    Math.floor(Math.random() * allParticipants.length)
                  ],
                ]
              : [
                  {
                    id: 1,
                    name: room.name || "Unknown",
                    role: "student" as const,
                    status: "offline" as const,
                    avatar: "/assets/images/general/student.png",
                  },
                ];

          return {
            ...room,
            participants: roomParticipants,
            last_message: null,
            unread_count: Math.floor(Math.random() * 3),
          };
        }
      );

      setRooms(enhancedRooms);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch rooms");
      console.error("Error fetching rooms:", err);
    } finally {
      setLoading(false);
    }
  }, [headers]);

  const createRoom = useCallback(
    async (name: string) => {
      if (!headers) return null;

      try {
        const roomData = { name };
        const newRoom = await ChatRoomService.createChatRoom(headers, roomData);
        return newRoom;
      } catch (error) {
        console.error("Error creating room:", error);
        throw error;
      }
    },
    [headers]
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
        await ChatRoomService.partialUpdateRoom(headers, roomId, updates);

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
              return enhanceRoom(baseRoom, allParticipants);
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

            return enhanceRoom(baseRoom, allParticipants);
          });
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to update room");
        console.error("Error updating room:", err);
        throw err;
      }
    },
    [headers, selectedRoom]
  );

  const deleteRoom = useCallback(
    async (roomId: number) => {
      try {
        setError(null);
        await ChatRoomService.deleteRoom(headers, roomId);

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
    [headers, selectedRoom]
  );

  useEffect(() => {
    // Attendre que l'auth soit disponible avant de faire la première requête
    if (!hasInitialized.current && headers["Authorization"]) {
      hasInitialized.current = true;

      // Fonction inline pour éviter les dépendances infinies
      const loadRooms = async () => {
        try {
          setLoading(true);
          setError(null);
          const response = await ChatRoomService.listRooms(headers);

          // Transformer les données de l'API en EnhancedChatRoom
          const enhancedRooms: EnhancedChatRoom[] = response.results.map(
            (room: any) => {
              // Créer des participants par défaut pour chaque room
              const roomParticipants =
                allParticipants.length > 0
                  ? [
                      allParticipants[
                        Math.floor(Math.random() * allParticipants.length)
                      ],
                    ]
                  : [
                      {
                        id: 1,
                        name: room.name || "Unknown",
                        role: "student" as const,
                        status: "offline" as const,
                        avatar: "/assets/images/general/student.png",
                      },
                    ];

              return {
                ...room,
                participants: roomParticipants,
                last_message: null,
                unread_count: Math.floor(Math.random() * 3),
              };
            }
          );

          setRooms(enhancedRooms);
        } catch (err) {
          setError(
            err instanceof Error ? err.message : "Failed to fetch rooms"
          );
          console.error("Error fetching rooms:", err);
        } finally {
          setLoading(false);
        }
      };

      loadRooms();
    }
  }, [headers]);

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

  // Headers API avec authentification
  const headers = useApiHeaders();

  // Get real communication data
  const { students, teachers, parents } = useCommunicationData();

  // Create participants from real data
  const allParticipants = createParticipantsFromCommunicationData(
    students,
    teachers,
    parents
  );

  // Utiliser useRef pour éviter les boucles infinies
  const lastRoomId = useRef<number | null>(null);

  // Intégration WebSocket pour les messages en temps réel (DÉSACTIVÉ TEMPORAIREMENT)
  // const {
  //   messages: realtimeMessages,
  //   typing,
  //   userStatuses,
  //   sendMessage: sendRealtimeMessage,
  // } = useChatRoomRealtime(roomId);

  // Variables temporaires pour remplacer WebSocket
  const realtimeMessages: EnhancedChatMessage[] = [];
  const typing: any[] = [];
  const userStatuses = {};
  const sendRealtimeMessage = (_content: string) => {};

  // Charger les messages initiaux depuis l'API
  const fetchMessages = useCallback(
    async (limit?: number, offset?: number) => {
      if (!roomId) return;

      try {
        setLoading(true);
        setError(null);
        const response = await ChatMessageService.listMessages(
          headers,
          limit,
          offset
        );

        // Filtrer les messages pour ce salon et les transformer
        const roomMessages = response.results.filter(
          (msg) => msg.chat === roomId
        );
        const enhancedMessages: EnhancedChatMessage[] = roomMessages.map(
          (msg) => ({
            ...msg,
            sender_info: allParticipants.find(
              (p: ChatParticipant) => p.id === msg.sender
            ) ||
              allParticipants[0] || {
                id: msg.sender,
                name: "Unknown User",
                role: "student",
                status: "offline",
              },
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
    [headers, roomId]
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
      if (!roomId) {
        console.error("🚨 No roomId provided");
        return;
      }

      try {
        setError(null);

        // Envoyer via API REST uniquement (WebSocket désactivé temporairement)
        const messageData: CreateChatMessage = {
          chat_room_id: roomId,
          content,
        };

        console.log("🔍 DEBUG Sending message:", {
          roomId,
          messageData,
          headers,
        });

        await ChatMessageService.createChatMessage(headers, messageData);

        // Recharger les messages pour obtenir le nouveau message
        // (solution temporaire en attendant WebSocket)
        setTimeout(() => {
          const loadMessages = async () => {
            try {
              const response = await ChatMessageService.listMessages(headers);
              const roomMessages = response.results.filter(
                (msg) => msg.chat === roomId
              );
              const enhancedMessages: EnhancedChatMessage[] = roomMessages.map(
                (msg) => ({
                  ...msg,
                  sender_info: allParticipants.find(
                    (p: ChatParticipant) => p.id === msg.sender
                  ) ||
                    allParticipants[0] || {
                      id: msg.sender,
                      name: "Unknown User",
                      role: "student",
                      status: "offline",
                    },
                  timestamp: new Date(msg.created_at),
                  status: "delivered",
                })
              );
              setMessages(enhancedMessages);
            } catch (error) {
              console.error("Error reloading messages:", error);
            }
          };
          loadMessages();
        }, 500);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to send message");
        console.error("Error sending message:", err);
        throw err;
      }
    },
    [headers, roomId]
  );

  const updateMessage = useCallback(
    async (messageId: number, content: string) => {
      try {
        setError(null);
        await ChatMessageService.partialUpdateMessage(headers, messageId, {
          content,
        });

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
    [headers]
  );

  const deleteMessage = useCallback(
    async (messageId: number) => {
      try {
        setError(null);
        await ChatMessageService.deleteMessage(headers, messageId);

        // Marquer comme supprimé localement
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
    [headers]
  );

  useEffect(() => {
    if (roomId && roomId !== lastRoomId.current && headers["Authorization"]) {
      lastRoomId.current = roomId;

      // Fonction interne pour éviter les dépendances infinies
      const loadMessages = async () => {
        if (!roomId) return;

        try {
          setLoading(true);
          setError(null);
          const response = await ChatMessageService.listMessages(headers);

          // Filtrer les messages pour ce salon et les transformer
          const roomMessages = response.results.filter(
            (msg) => msg.chat === roomId
          );
          const enhancedMessages: EnhancedChatMessage[] = roomMessages.map(
            (msg) => ({
              ...msg,
              sender_info: allParticipants.find(
                (p: ChatParticipant) => p.id === msg.sender
              ) ||
                allParticipants[0] || {
                  id: msg.sender,
                  name: "Unknown User",
                  role: "student",
                  status: "offline",
                },
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
      };

      loadMessages();
    } else if (!roomId) {
      lastRoomId.current = null;
      setMessages([]);
    }
  }, [roomId, headers]);

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
