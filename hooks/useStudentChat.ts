// hooks/useStudentChat.ts
import { useState, useEffect, useCallback, useRef } from "react";
import { ChatMessageService, ChatRoomService } from "@/services/chat-service";
import { useApiHeaders } from "@/lib/api-config";
import {
  EnhancedChatRoom,
  EnhancedChatMessage,
  ChatRoom,
  ChatMessage,
  ChatParticipant,
} from "@/types/chat";

// -----------------------------
// Helpers pour Student - CORRIGÉ
// -----------------------------
const enhanceMessageForStudent = (
  message: any,
  currentUserId: string
): EnhancedChatMessage => {
  // CORRECTION : Utiliser le vrai rôle depuis l'API
  const rawRole = message.sender?.role || "student";
  const isCurrentUser = message.sender.id.toString() === currentUserId;
  
  const sender = {
    id: message.sender.id,
    name: message.sender.full_name || message.sender.username || "Unknown User",
    role: isCurrentUser ? "student" : (rawRole === "admin" ? "teacher" : rawRole), // Rôle correct
    status: "offline" as const,
    avatar: (isCurrentUser ? "student" : (rawRole === "admin" ? "teacher" : rawRole)) === "teacher" 
      ? "/assets/images/general/teacher.png"
      : "/assets/images/general/student.png",
  };

  return {
    uuid: message.uuid,
    created_at: message.created_at,
    last_update: message.last_update,
    content: message.content,
    message_type: message.message_type,
    attachment_url: message.attachment_url,
    voice_note_url: message.voice_note_url,
    is_deleted: message.is_deleted,
    extra_data: message.extra_data,
    
    sender: {
      id: message.sender.id,
      username: message.sender.username,
      full_name: message.sender.full_name,
      email: message.sender.email
    },
    
    sender_info: sender,
    timestamp: new Date(message.created_at),
    status: "delivered" as const,
  };
};

const enhanceRoomForStudent = (
  room: ChatRoom,
  currentUserId: string
): EnhancedChatRoom => {
  // Pour les students, on veut afficher le nom du teacher ou du groupe
  let displayName = room.name;
  
  if (!room.is_group) {
    // Trouver le teacher dans les participants
    const teacherParticipant = room.participants?.find(
      (p: any) => p.id !== parseInt(currentUserId) && p.role === "teacher"
    );
    if (teacherParticipant) {
      displayName = teacherParticipant.full_name || teacherParticipant.username;
    } else {
      // Si pas de teacher, prendre le premier participant différent de l'utilisateur courant
      const otherParticipant = room.participants?.find(
        (p: any) => p.id !== parseInt(currentUserId)
      );
      if (otherParticipant) {
        displayName = otherParticipant.full_name || otherParticipant.username;
      }
    }
  }

  const participants: ChatParticipant[] = room.participants?.map((participant: any) => {
    const isCurrentUser = participant.id.toString() === currentUserId;
    const role = isCurrentUser ? "student" : (participant.role === "admin" ? "teacher" : participant.role);
    
    return {
      id: participant.id,
      name: participant.full_name || participant.username || "Unknown",
      role: role as "teacher" | "student" | "parent",
      status: "offline",
      avatar: participant.image_url || (
        role === "teacher" 
          ? "/assets/images/general/teacher.png"
          : "/assets/images/general/student.png"
      ),
    };
  }) || [];

  return {
    ...room,
    name: displayName,
    participants,
    last_message: room.last_message 
      ? enhanceMessageForStudent(room.last_message, currentUserId)
      : null,
    unread_count: (room as any).unread_count || 0,
  };
};

// ------------------------------------------------
// HOOK useStudentChatRooms
// ------------------------------------------------
export const useStudentChatRooms = (
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

  const hasInitialized = useRef(false);

  const fetchRooms = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      console.log("[useStudentChatRooms] Chargement des rooms étudiant...");

      const response = await ChatRoomService.listRooms(
        tenantPrimaryDomain,
        accessToken
      );

      console.log("[useStudentChatRooms] Rooms chargées:", response.results.length);

      // Trier par date du dernier message (plus récent en premier)
      const sortedResults = [...response.results].sort((a, b) => {
        const dateA = a.last_message ? new Date(a.last_message.created_at).getTime() : 0;
        const dateB = b.last_message ? new Date(b.last_message.created_at).getTime() : 0;
        return dateB - dateA;
      });

      const enhancedRooms: EnhancedChatRoom[] = sortedResults.map((room: ChatRoom) => 
        enhanceRoomForStudent(room, userId.toString())
      );

      console.log("[useStudentChatRooms] Rooms enrichies:", enhancedRooms.length);
      
      // DEBUG : Afficher les rôles des participants
      enhancedRooms.forEach(room => {
        console.log(`[useStudentChatRooms] Room ${room.id} participants:`, 
          room.participants.map(p => ({ id: p.id, name: p.name, role: p.role }))
        );
      });
      
      setRooms(enhancedRooms);
    } 
    catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch rooms";
      setError(errorMessage);
      console.error("[useStudentChatRooms] Erreur chargement rooms:", err);
    } 
    finally {
      setLoading(false);
    }
  }, [tenantPrimaryDomain, accessToken, userId]);

  // Marquer une conversation comme lue
  const markAsRead = useCallback(async (roomId: number) => {
    try {
      await ChatRoomService.markAsRead(
        tenantPrimaryDomain,
        accessToken,
        roomId
      );
      
      // Mettre à jour le compteur local
      setRooms(prev => prev.map(room => 
        room.id === roomId 
          ? { ...room, unread_count: 0 }
          : room
      ));
    } catch (err) {
      console.error("[useStudentChatRooms] Erreur marquage comme lu:", err);
    }
  }, [tenantPrimaryDomain, accessToken]);

  useEffect(() => {
    if (!hasInitialized.current && accessToken) {
      hasInitialized.current = true;
      fetchRooms();
    }
  }, [accessToken, fetchRooms]);

  // Debug effect
  useEffect(() => {
    console.log("[useStudentChatRooms] Rooms state:", {
      count: rooms.length,
      rooms: rooms.map(r => ({ 
        id: r.id, 
        name: r.name, 
        is_group: r.is_group,
        participants: r.participants.map(p => ({ id: p.id, name: p.name, role: p.role }))
      }))
    });
  }, [rooms]);

  return {
    rooms,
    selectedRoom,
    setSelectedRoom,
    loading,
    error,
    fetchRooms,
    markAsRead,
  };
};

// ------------------------------------------------
// HOOK useStudentChatMessages
// ------------------------------------------------
export const useStudentChatMessages = (
  roomId: number | null,
  roomUuid?: string,
  token?: string,
  tenantDomain?: string
) => {
  const [messages, setMessages] = useState<EnhancedChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const headers = useApiHeaders();
  const tenantPrimaryDomain = tenantDomain || process.env.NEXT_PUBLIC_TENANT_DOMAIN || "";
  const accessToken = token || headers["Authorization"]?.replace("Bearer ", "") || "";

  const lastRoomId = useRef<number | null>(null);

  // ---------------- FETCH MESSAGES ----------------
  const fetchMessages = useCallback(
    async (limit?: number, offset?: number) => {
      if (!roomId) {
        console.log("[useStudentChatMessages] Aucun roomId, skip fetch");
        return;
      }

      try {
        setLoading(true);
        setError(null);
        console.log("[useStudentChatMessages] Chargement messages étudiant pour room:", roomId);

        const response = await ChatMessageService.listMessages(
          tenantPrimaryDomain,
          accessToken,
          limit,
          offset,
          roomId
        );

        console.log("[useStudentChatMessages] Messages chargés:", response.results.length);

        // CORRECTION : Passer le vrai currentUserId au lieu de "student"
        const storedUser = localStorage.getItem("user_data");
        const currentUserId = storedUser ? JSON.parse(storedUser).id : null;
        
        const enhancedMessages = response.results
          .map((msg) => enhanceMessageForStudent(msg, currentUserId?.toString() || ""))
          .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());

        // DEBUG : Afficher les rôles des messages
        enhancedMessages.forEach(msg => {
          console.log(`[useStudentChatMessages] Message ${msg.uuid}:`, {
            senderId: msg.sender_info.id,
            senderName: msg.sender_info.name,
            role: msg.sender_info.role,
            isCurrentUser: msg.sender_info.id.toString() === currentUserId?.toString()
          });
        });

        setMessages(enhancedMessages);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to fetch messages";
        setError(errorMessage);
        console.error("[useStudentChatMessages] Erreur chargement messages:", err);
      } finally {
        setLoading(false);
      }
    },
    [tenantPrimaryDomain, accessToken, roomId]
  );

  // ---------------- SEND MESSAGE ----------------
  const sendMessage = useCallback(
    async (content?: string, file?: File, voiceNote?: File) => {
      if (!roomUuid) throw new Error("Aucune conversation sélectionnée");

      try {
        const formData = new FormData();
        formData.append("chat_room_id", roomUuid);

        if (content) formData.append("content", content);
        if (file) formData.append("attachment", file);
        if (voiceNote) formData.append("voice_note", voiceNote);

        const sentMessage = await ChatMessageService.createChatMessage(
          tenantPrimaryDomain,
          accessToken,
          formData
        );

        // Recharger les messages après envoi
        await fetchMessages();
        return sentMessage;
      } catch (err) {
        console.error("[useStudentChatMessages] Erreur envoi message:", err);
        throw err;
      }
    },
    [tenantPrimaryDomain, accessToken, roomUuid, fetchMessages]
  );

  // ---------------- EFFECTS ----------------
  useEffect(() => {
    if (roomId && roomId !== lastRoomId.current && accessToken) {
      console.log("[useStudentChatMessages] Room changée:", roomId);
      lastRoomId.current = roomId;
      fetchMessages();
    } else if (!roomId && messages.length > 0) {
      console.log("[useStudentChatMessages] Clear messages (no room selected)");
      lastRoomId.current = null;
      setMessages([]);
    }
  }, [roomId, accessToken, fetchMessages, messages.length]);

  useEffect(() => {
    console.log("[useStudentChatMessages] Messages state:", {
      count: messages.length,
      roomId,
      sampleMessages: messages.slice(0, 3).map(m => ({
        id: m.uuid,
        sender: m.sender_info.name,
        role: m.sender_info.role,
        content: m.content
      }))
    });
  }, [messages, roomId]);

  // ---------------- RETURN ----------------
  return {
    messages,
    loading,
    error,
    fetchMessages,
    sendMessage,
  };
};

// ------------------------------------------------
// HOOK PRINCIPAL useStudentChat
// ------------------------------------------------
export const useStudentChat = (
  userId: number = 1,
  token?: string,
  tenantDomain?: string
) => {
  const {
    rooms,
    selectedRoom,
    setSelectedRoom,
    loading: roomsLoading,
    error: roomsError,
    fetchRooms,
    markAsRead,
  } = useStudentChatRooms(userId, token, tenantDomain);

  const {
    messages,
    loading: messagesLoading,
    error: messagesError,
    fetchMessages,
    sendMessage,
  } = useStudentChatMessages(
    selectedRoom?.id || null,
    selectedRoom?.uuid,
    token,
    tenantDomain
  );

  const handleDeselectRoom = useCallback(() => {
    setSelectedRoom(null);
  }, [setSelectedRoom]);

  // Sélectionner une room et charger ses messages
  const handleSelectRoom = useCallback(async (room: EnhancedChatRoom) => {
    setSelectedRoom(room);
    // Marquer comme lu immédiatement
    await markAsRead(room.id);
  }, [setSelectedRoom, markAsRead]);

  // Envoyer un message (version simplifiée pour student)
  const handleSendMessage = useCallback(async (content: string) => {
    if (!selectedRoom) return;
    
    try {
      await sendMessage(content);
    } catch (error) {
      console.error("Erreur envoi message:", error);
      throw error;
    }
  }, [selectedRoom, sendMessage]);

  return {
    // Rooms
    rooms,
    selectedRoom,
    setSelectedRoom: handleSelectRoom,
    deselectRoom: handleDeselectRoom,
    
    // Messages
    messages,
    
    // États
    loading: roomsLoading || messagesLoading,
    error: roomsError || messagesError,
    
    // Actions
    fetchRooms,
    sendMessage: handleSendMessage,
    refreshMessages: fetchMessages,
    markAsRead,
    
    // Utilitaires
    hasRooms: rooms.length > 0,
    hasMessages: messages.length > 0,
  };
};