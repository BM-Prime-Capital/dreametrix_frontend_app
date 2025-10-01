import { useEffect, useState, useCallback, useRef } from "react";
import {
  chatWebSocket,
  TypingIndicator,
  UserStatus,
} from "@/services/websocket-service";
import { EnhancedChatMessage } from "@/types/chat";

// Hook pour gérer la connexion WebSocket du chat
export const useChatWebSocket = (userId: number, token?: string) => {
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [connectionAttempts, setConnectionAttempts] = useState(0);

  const unsubscribeRefs = useRef<(() => void)[]>([]);

  // Connexion initiale
  useEffect(() => {
    if (userId) {
      chatWebSocket.connect(userId, token);
      setConnectionAttempts((prev) => prev + 1);

      // S'abonner aux changements de connexion
      const unsubscribeConnection = chatWebSocket.onConnectionChange(
        (connected) => {
          setIsConnected(connected);
          if (connected) {
            setError(null);
          }
        }
      );

      // S'abonner aux erreurs
      const unsubscribeError = chatWebSocket.onError((errorMessage) => {
        setError(errorMessage);
      });

      unsubscribeRefs.current = [unsubscribeConnection, unsubscribeError];

      return () => {
        unsubscribeRefs.current.forEach((unsub) => unsub());
        chatWebSocket.disconnect();
      };
    }
  }, [userId, token]);

  // Reconnecter manuellement
  const reconnect = useCallback(() => {
    if (userId) {
      setError(null);
      chatWebSocket.connect(userId, token);
      setConnectionAttempts((prev) => prev + 1);
    }
  }, [userId, token]);

  // Déconnecter manuellement
  const disconnect = useCallback(() => {
    chatWebSocket.disconnect();
  }, []);

  return {
    isConnected,
    error,
    connectionAttempts,
    reconnect,
    disconnect,
  };
};

// Hook pour gérer les messages en temps réel d'un salon
export const useChatRoomRealtime = (roomId: number | null) => {
  const [messages, setMessages] = useState<EnhancedChatMessage[]>([]);
  const [typing, setTyping] = useState<TypingIndicator[]>([]);
  const [userStatuses, setUserStatuses] = useState<Map<number, UserStatus>>(
    new Map()
  );

  const unsubscribeRefs = useRef<(() => void)[]>([]);

  useEffect(() => {
    if (!roomId) return;

    // Rejoindre le salon
    chatWebSocket.joinRoom(roomId);

    // S'abonner aux nouveaux messages
    const unsubscribeMessage = chatWebSocket.onMessage((message) => {
      if (message.chat === roomId) {
        setMessages((prev) => {
          // Éviter les doublons
          if (prev.some((m) => m.uuid === message.uuid)) {
            return prev;
          }
          return [...prev, message].sort(
            (a, b) =>
              new Date(a.created_at).getTime() -
              new Date(b.created_at).getTime()
          );
        });
      }
    });

    // S'abonner aux indicateurs de frappe
    const unsubscribeTyping = chatWebSocket.onTyping((typingIndicator) => {
      if (typingIndicator.room_id === roomId) {
        setTyping((prev) => {
          if (typingIndicator.is_typing) {
            // Ajouter ou mettre à jour l'indicateur
            const filtered = prev.filter(
              (t) => t.user_id !== typingIndicator.user_id
            );
            return [...filtered, typingIndicator];
          } else {
            // Supprimer l'indicateur
            return prev.filter((t) => t.user_id !== typingIndicator.user_id);
          }
        });
      }
    });

    // S'abonner aux statuts utilisateur
    const unsubscribeStatus = chatWebSocket.onUserStatus((status) => {
      setUserStatuses((prev) => {
        const newMap = new Map(prev);
        newMap.set(status.user_id, status);
        return newMap;
      });
    });

    unsubscribeRefs.current = [
      unsubscribeMessage,
      unsubscribeTyping,
      unsubscribeStatus,
    ];

    return () => {
      // Quitter le salon
      chatWebSocket.leaveRoom(roomId);

      // Se désabonner
      unsubscribeRefs.current.forEach((unsub) => unsub());

      // Nettoyer les états
      setMessages([]);
      setTyping([]);
    };
  }, [roomId]);

  // Envoyer un message
  const sendMessage = useCallback(
    (content: string) => {
      if (roomId && content.trim()) {
        chatWebSocket.sendMessage(roomId, content.trim());
      }
    },
    [roomId]
  );

  // Envoyer un indicateur de frappe
  const sendTypingIndicator = useCallback(
    (isTyping: boolean) => {
      if (roomId) {
        chatWebSocket.sendTypingIndicator(roomId, isTyping);
      }
    },
    [roomId]
  );

  return {
    messages,
    typing,
    userStatuses,
    sendMessage,
    sendTypingIndicator,
  };
};

// Hook pour gérer l'indicateur de frappe automatique
export const useTypingIndicator = (
  roomId: number | null,
  delay: number = 1000
) => {
  const [isTyping, setIsTypingState] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { sendTypingIndicator } = useChatRoomRealtime(roomId);

  const setIsTyping = useCallback(
    (typing: boolean) => {
      if (typing) {
        if (!isTyping) {
          setIsTypingState(true);
          sendTypingIndicator(true);
        }

        // Réinitialiser le timer
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(() => {
          setIsTypingState(false);
          sendTypingIndicator(false);
        }, delay);
      } else {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        setIsTypingState(false);
        sendTypingIndicator(false);
      }
    },
    [isTyping, sendTypingIndicator, delay]
  );

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return { isTyping, setIsTyping };
};

// Hook pour les statuts utilisateur en temps réel
export const useUserStatus = () => {
  const updateStatus = useCallback((status: "online" | "offline" | "away") => {
    chatWebSocket.updateUserStatus(status);
  }, []);

  // Mise à jour automatique du statut basée sur l'activité de la page
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        updateStatus("away");
      } else {
        updateStatus("online");
      }
    };

    const handleBeforeUnload = () => {
      updateStatus("offline");
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("beforeunload", handleBeforeUnload);

    // Statut initial
    updateStatus("online");

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      updateStatus("offline");
    };
  }, [updateStatus]);

  return { updateStatus };
};
