"use client";

import { useState, useEffect, useCallback } from "react";
import { ChatMessageService } from "@/services/chat-service";
import type { EnhancedChatMessage } from "@/types/chat";

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
  roomUuid: string | null, // ⚡ UUID string obligatoire
  accessToken: string,
  tenantDomain: string
): UseStudentChatMessagesReturn {
  const [messages, setMessages] = useState<EnhancedChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch messages of the given room
   */
  const fetchMessages = useCallback(async () => {
    if (!roomUuid) return;
    try {
      setLoading(true);
      setError(null);

      const data = await ChatMessageService.getChatMessages(
        tenantDomain,
        accessToken,
        roomUuid // ✅ on passe le UUID et non un ID numérique
      );

      setMessages(data.results || []);
    } catch (err: any) {
      console.error("[useStudentChatMessages] fetch error:", err);
      setError(err.message || "Erreur lors du chargement des messages");
    } finally {
      setLoading(false);
    }
  }, [tenantDomain, accessToken, roomUuid]);

  /**
   * Send a new message
   */
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
        formData.append("chat_room_id", roomUuid); // ✅ UUID obligatoire

        if (content) formData.append("content", content);
        if (emoji) formData.append("emoji", emoji);
        if (file) formData.append("attachment", file);
        if (voiceNote) formData.append("voice_note", voiceNote);

        const sentMessage = await ChatMessageService.createChatMessage(
          tenantDomain,
          accessToken,
          formData
        );

        await fetchMessages();
        return sentMessage;
      } catch (err) {
        console.error("[useStudentChatMessages] send error:", err);
        throw err;
      }
    },
    [tenantDomain, accessToken, roomUuid, fetchMessages]
  );

  useEffect(() => {
    if (roomUuid) fetchMessages();
  }, [roomUuid, fetchMessages]);

  return { messages, loading, error, sendMessage, fetchMessages };
}
