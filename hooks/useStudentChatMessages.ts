"use client";

import { useState, useEffect, useCallback } from "react";
import { ChatMessageService } from "@/services/chat-service";
import type {
  EnhancedChatMessage,
  ChatMessagesResponse,
  ChatParticipant,
} from "@/types/chatStudent";

import { enhanceMessage } from "@/types/chatStudent";

interface UseStudentChatMessagesReturn {
  messages: EnhancedChatMessage[];
  loading: boolean;
  error: string | null;
  sendMessage: (
    content?: string,
    file?: File,
    voiceNote?: File,
    emoji?: string
  ) => Promise<EnhancedChatMessage | null>;
  fetchMessages: () => Promise<void>;
}

export function useStudentChatMessages(
  roomUuid: string | null,
  accessToken: string,
  tenantDomain: string,
  participants: ChatParticipant[] = [] // 👈 inject participants here
): UseStudentChatMessagesReturn {
  const [messages, setMessages] = useState<EnhancedChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

const fetchMessages = useCallback(async () => {
  if (!roomUuid) return;
  try {
    setLoading(true);
    setError(null);

    // Correct type: getChatMessages returns ChatRoomDetail
    const data = await ChatMessageService.getChatMessages(
      tenantDomain,
      accessToken,
      roomUuid
    );

    // Use .mmessages (not .results)
    const enhanced = (data.mmessages || []).map((m) =>
      enhanceMessage(m, participants)
    );

    setMessages(enhanced);
  } catch (err: any) {
    console.error("[useStudentChatMessages] fetch error:", err);
    setError(err.message || "Erreur lors du chargement des messages");
  } finally {
    setLoading(false);
  }
}, [tenantDomain, accessToken, roomUuid, participants]);


  const sendMessage = useCallback(
    async (
      content?: string,
      file?: File,
      voiceNote?: File,
      emoji?: string
    ): Promise<EnhancedChatMessage | null> => {
      if (!roomUuid) throw new Error("Aucune conversation sélectionnée");

      try {
        const formData = new FormData();
        formData.append("chat_room_id", roomUuid);

        if (content) formData.append("content", content);
        if (emoji) formData.append("emoji", emoji);
        if (file) formData.append("attachment", file);
        if (voiceNote) formData.append("voice_note", voiceNote);

        const sent = await ChatMessageService.createChatMessage(
          tenantDomain,
          accessToken,
          formData
        );

        // also wrap sent message
        const enhanced = enhanceMessage(sent, participants);

        setMessages((prev) => [...prev, enhanced]);
        return enhanced;
      } catch (err) {
        console.error("[useStudentChatMessages] send error:", err);
        throw err;
      }
    },
    [tenantDomain, accessToken, roomUuid, participants]
  );

  useEffect(() => {
    if (roomUuid) fetchMessages();
  }, [roomUuid, fetchMessages]);

  return { messages, loading, error, sendMessage, fetchMessages };
}
