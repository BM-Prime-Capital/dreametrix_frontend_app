import { ChatMessage, EnhancedChatMessage } from "@/types/chat";
import { notificationManager } from "@/utils/websocket-notifications";

// Types pour les événements WebSocket
export interface WebSocketMessage {
  type:
    | "message"
    | "typing"
    | "user_status"
    | "room_update"
    | "error"
    | "auth"
    | "join_room"
    | "leave_room"
    | "ping"
    | "pong";
  data: any;
  room_id?: number;
  user_id?: number;
  timestamp: string;
}

export interface TypingIndicator {
  room_id: number;
  user_id: number;
  user_name: string;
  is_typing: boolean;
}

export interface UserStatus {
  user_id: number;
  status: "online" | "offline" | "away";
  last_seen?: string;
}

// Interface pour les préférences utilisateur
interface UserPreferences {
  autoReconnect: boolean;
  showTypingIndicators: boolean;
  showOnlineStatus: boolean;
  soundNotifications: boolean;
  pushNotifications: boolean;
}

// Configuration WebSocket
const WS_CONFIG = {
  RECONNECT_INTERVAL: 3000, // 3 secondes
  MAX_RECONNECT_ATTEMPTS: 5,
  HEARTBEAT_INTERVAL: 30000, // 30 secondes
  TYPING_TIMEOUT: 3000, // 3 secondes
};

// Service WebSocket pour le chat en temps réel
export class ChatWebSocketService {
  private static instance: ChatWebSocketService | null = null;
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private reconnectTimer: NodeJS.Timeout | null = null;
  private heartbeatTimer: NodeJS.Timeout | null = null;
  private typingTimer: NodeJS.Timeout | null = null;
  private isConnected = false;
  private currentRoomId: number | null = null;
  private userId: number | null = null;
  private userPreferences: UserPreferences;

  // Gestionnaires d'événements
  private messageHandlers: ((message: EnhancedChatMessage) => void)[] = [];
  private typingHandlers: ((typing: TypingIndicator) => void)[] = [];
  private statusHandlers: ((status: UserStatus) => void)[] = [];
  private connectionHandlers: ((connected: boolean) => void)[] = [];
  private errorHandlers: ((error: string) => void)[] = [];

  // Charger les préférences utilisateur depuis localStorage
  private loadUserPreferences(): UserPreferences {
    const defaultPreferences: UserPreferences = {
      autoReconnect: true,
      showTypingIndicators: true,
      showOnlineStatus: true,
      soundNotifications: true,
      pushNotifications: false,
    };

    try {
      const savedConnectionSettings = localStorage.getItem(
        "websocket-connection-settings"
      );
      const savedNotificationSettings = localStorage.getItem(
        "websocket-notification-settings"
      );

      const connectionSettings = savedConnectionSettings
        ? JSON.parse(savedConnectionSettings)
        : {};
      const notificationSettings = savedNotificationSettings
        ? JSON.parse(savedNotificationSettings)
        : {};

      return {
        ...defaultPreferences,
        autoReconnect:
          connectionSettings.autoReconnect ?? defaultPreferences.autoReconnect,
        showTypingIndicators:
          connectionSettings.showTypingIndicators ??
          defaultPreferences.showTypingIndicators,
        showOnlineStatus:
          connectionSettings.showOnlineStatus ??
          defaultPreferences.showOnlineStatus,
        soundNotifications:
          notificationSettings.soundNotifications ??
          defaultPreferences.soundNotifications,
        pushNotifications:
          notificationSettings.pushNotifications ??
          defaultPreferences.pushNotifications,
      };
    } catch (error) {
      console.error("Erreur lors du chargement des préférences:", error);
      return defaultPreferences;
    }
  }

  private constructor() {
    // Charger les préférences utilisateur depuis localStorage
    this.userPreferences = this.loadUserPreferences();
  }

  // Singleton pattern
  static getInstance(): ChatWebSocketService {
    if (!ChatWebSocketService.instance) {
      ChatWebSocketService.instance = new ChatWebSocketService();
    }
    return ChatWebSocketService.instance;
  }

  // Mettre à jour les préférences utilisateur
  updatePreferences(): void {
    this.userPreferences = this.loadUserPreferences();
  }

  // Obtenir les préférences actuelles
  getPreferences(): UserPreferences {
    return { ...this.userPreferences };
  }

  // Initialiser la connexion WebSocket
  connect(userId: number, token?: string): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      return; // Déjà connecté
    }

    this.userId = userId;

    // Construire l'URL WebSocket
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const host = process.env.NEXT_PUBLIC_WS_HOST || window.location.host;
    let wsUrl = `${protocol}//${host}/ws/chat/`;

    // Ajouter le token d'authentification si disponible
    if (token) {
      wsUrl += `?token=${token}`;
    }

    try {
      this.ws = new WebSocket(wsUrl);
      this.setupEventListeners();
    } catch (error) {
      console.error("Erreur lors de la connexion WebSocket:", error);
      this.handleError("Failed to connect to WebSocket");
    }
  }

  // Configurer les gestionnaires d'événements WebSocket
  private setupEventListeners(): void {
    if (!this.ws) return;

    this.ws.onopen = () => {
      console.log("WebSocket connecté");
      this.isConnected = true;
      this.reconnectAttempts = 0;
      this.startHeartbeat();
      this.notifyConnectionChange(true);

      // S'authentifier
      if (this.userId) {
        this.send({
          type: "auth",
          data: { user_id: this.userId },
          timestamp: new Date().toISOString(),
        });
      }
    };

    this.ws.onmessage = (event) => {
      try {
        const message: WebSocketMessage = JSON.parse(event.data);
        this.handleIncomingMessage(message);
      } catch (error) {
        console.error("Erreur lors du parsing du message WebSocket:", error);
      }
    };

    this.ws.onclose = (event) => {
      console.log("WebSocket fermé", event.code, event.reason);
      this.isConnected = false;
      this.stopHeartbeat();
      this.notifyConnectionChange(false);

      if (event.code !== 1000) {
        // Si ce n'est pas une fermeture normale
        this.scheduleReconnect();
      }
    };

    this.ws.onerror = (error) => {
      console.error("Erreur WebSocket:", error);
      this.handleError("WebSocket connection error");
    };
  }

  // Traiter les messages entrants
  private handleIncomingMessage(message: WebSocketMessage): void {
    switch (message.type) {
      case "message":
        this.handleNewMessage(message.data);
        break;
      case "typing":
        this.handleTypingIndicator(message.data);
        break;
      case "user_status":
        this.handleUserStatus(message.data);
        break;
      case "room_update":
        // Gérer les mises à jour de salon (participants ajoutés/supprimés, etc.)
        break;
      case "error":
        this.handleError(message.data.error || "Unknown error");
        break;
      default:
        console.warn("Type de message WebSocket non reconnu:", message.type);
    }
  }

  // Gérer un nouveau message
  private handleNewMessage(messageData: any): void {
    try {
      // Convertir en EnhancedChatMessage
      const enhancedMessage: EnhancedChatMessage = {
        ...messageData,
        sender_info: messageData.sender_info || {
          id: messageData.sender,
          name: "Unknown User",
          role: "student" as const,
          status: "online" as const,
        },
        timestamp: new Date(messageData.created_at),
        status: "delivered" as const,
      };

      // Notifier les handlers
      this.messageHandlers.forEach((handler) => handler(enhancedMessage));

      // Gérer les notifications si activées et si ce n'est pas notre propre message
      if (this.userId && messageData.sender !== this.userId) {
        if (
          this.userPreferences.pushNotifications ||
          this.userPreferences.soundNotifications
        ) {
          // Utiliser directement le gestionnaire de notifications simplifié
          const senderName =
            messageData.sender_info?.name || "Utilisateur inconnu";
          const isMention =
            messageData.content.includes(`@${this.userId}`) ||
            messageData.content.includes("@tous");

          const notificationData = {
            id: `message-${messageData.id}`,
            type: (isMention ? "mention" : "message") as "mention" | "message",
            title: isMention
              ? `${senderName} vous a mentionné`
              : `Nouveau message de ${senderName}`,
            body:
              messageData.content.length > 100
                ? messageData.content.substring(0, 97) + "..."
                : messageData.content,
            data: { roomId: messageData.chat, messageId: messageData.id },
            timestamp: new Date(),
          };

          notificationManager.showNotification(notificationData);
        }

        // Jouer un son si activé
        if (
          this.userPreferences.soundNotifications &&
          typeof window !== "undefined"
        ) {
          this.playNotificationSound();
        }
      }
    } catch (error) {
      console.error("Erreur lors du traitement du nouveau message:", error);
    }
  }

  // Gérer les indicateurs de frappe
  private handleTypingIndicator(typingData: TypingIndicator): void {
    // Respecter les préférences utilisateur pour les indicateurs de frappe
    if (this.userPreferences.showTypingIndicators) {
      this.typingHandlers.forEach((handler) => handler(typingData));
    }
  }

  // Gérer les statuts utilisateur
  private handleUserStatus(statusData: UserStatus): void {
    this.statusHandlers.forEach((handler) => handler(statusData));
  }

  // Gérer les erreurs
  private handleError(error: string): void {
    console.error("Erreur WebSocket:", error);
    this.errorHandlers.forEach((handler) => handler(error));
  }

  // Jouer un son de notification
  private playNotificationSound(): void {
    try {
      // Créer un son de notification simple
      const audioContext = new (window.AudioContext ||
        (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1);

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        audioContext.currentTime + 0.2
      );

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.2);
    } catch (error) {
      console.warn("Impossible de jouer le son de notification:", error);
    }
  }

  // Envoyer un message via WebSocket
  private send(message: WebSocketMessage): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    } else {
      console.warn("WebSocket non connecté, impossible d'envoyer le message");
    }
  }

  // Rejoindre un salon
  joinRoom(roomId: number): void {
    this.currentRoomId = roomId;
    this.send({
      type: "join_room",
      data: { room_id: roomId },
      room_id: roomId,
      timestamp: new Date().toISOString(),
    });
  }

  // Quitter un salon
  leaveRoom(roomId: number): void {
    if (this.currentRoomId === roomId) {
      this.currentRoomId = null;
    }
    this.send({
      type: "leave_room",
      data: { room_id: roomId },
      room_id: roomId,
      timestamp: new Date().toISOString(),
    });
  }

  // Envoyer un message
  sendMessage(roomId: number, content: string): void {
    this.send({
      type: "message",
      data: {
        room_id: roomId,
        content: content,
      },
      room_id: roomId,
      user_id: this.userId || undefined,
      timestamp: new Date().toISOString(),
    });
  }

  // Envoyer un indicateur de frappe
  sendTypingIndicator(roomId: number, isTyping: boolean): void {
    this.send({
      type: "typing",
      data: {
        room_id: roomId,
        is_typing: isTyping,
      },
      room_id: roomId,
      user_id: this.userId || undefined,
      timestamp: new Date().toISOString(),
    });

    // Arrêter automatiquement l'indicateur de frappe après un délai
    if (isTyping) {
      if (this.typingTimer) {
        clearTimeout(this.typingTimer);
      }
      this.typingTimer = setTimeout(() => {
        this.sendTypingIndicator(roomId, false);
      }, WS_CONFIG.TYPING_TIMEOUT);
    }
  }

  // Mettre à jour le statut utilisateur
  updateUserStatus(status: "online" | "offline" | "away"): void {
    this.send({
      type: "user_status",
      data: { status },
      user_id: this.userId || undefined,
      timestamp: new Date().toISOString(),
    });
  }

  // Gestion du heartbeat
  private startHeartbeat(): void {
    this.heartbeatTimer = setInterval(() => {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.send({
          type: "ping",
          data: {},
          timestamp: new Date().toISOString(),
        });
      }
    }, WS_CONFIG.HEARTBEAT_INTERVAL);
  }

  private stopHeartbeat(): void {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
  }

  // Reconnexion automatique
  private scheduleReconnect(): void {
    // Vérifier si la reconnexion automatique est activée
    if (!this.userPreferences.autoReconnect) {
      console.log("Reconnexion automatique désactivée par l'utilisateur");
      return;
    }

    if (this.reconnectAttempts >= WS_CONFIG.MAX_RECONNECT_ATTEMPTS) {
      console.error("Nombre maximum de tentatives de reconnexion atteint");
      this.handleError("Max reconnection attempts reached");
      return;
    }

    this.reconnectAttempts++;
    console.log(
      `Tentative de reconnexion ${this.reconnectAttempts}/${WS_CONFIG.MAX_RECONNECT_ATTEMPTS}`
    );

    this.reconnectTimer = setTimeout(() => {
      if (this.userId) {
        this.connect(this.userId);
      }
    }, WS_CONFIG.RECONNECT_INTERVAL);
  }

  // Gestionnaires d'événements publics
  onMessage(handler: (message: EnhancedChatMessage) => void): () => void {
    this.messageHandlers.push(handler);
    return () => {
      const index = this.messageHandlers.indexOf(handler);
      if (index > -1) {
        this.messageHandlers.splice(index, 1);
      }
    };
  }

  onTyping(handler: (typing: TypingIndicator) => void): () => void {
    this.typingHandlers.push(handler);
    return () => {
      const index = this.typingHandlers.indexOf(handler);
      if (index > -1) {
        this.typingHandlers.splice(index, 1);
      }
    };
  }

  onUserStatus(handler: (status: UserStatus) => void): () => void {
    this.statusHandlers.push(handler);
    return () => {
      const index = this.statusHandlers.indexOf(handler);
      if (index > -1) {
        this.statusHandlers.splice(index, 1);
      }
    };
  }

  onConnectionChange(handler: (connected: boolean) => void): () => void {
    this.connectionHandlers.push(handler);
    return () => {
      const index = this.connectionHandlers.indexOf(handler);
      if (index > -1) {
        this.connectionHandlers.splice(index, 1);
      }
    };
  }

  onError(handler: (error: string) => void): () => void {
    this.errorHandlers.push(handler);
    return () => {
      const index = this.errorHandlers.indexOf(handler);
      if (index > -1) {
        this.errorHandlers.splice(index, 1);
      }
    };
  }

  // Notifier les changements de connexion
  private notifyConnectionChange(connected: boolean): void {
    this.connectionHandlers.forEach((handler) => handler(connected));
  }

  // Fermer la connexion
  disconnect(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    if (this.typingTimer) {
      clearTimeout(this.typingTimer);
      this.typingTimer = null;
    }

    this.stopHeartbeat();

    if (this.ws) {
      this.ws.close(1000, "User disconnected");
      this.ws = null;
    }

    this.isConnected = false;
    this.currentRoomId = null;
    this.userId = null;
  }

  // Getters
  get connected(): boolean {
    return this.isConnected;
  }

  get currentRoom(): number | null {
    return this.currentRoomId;
  }
}

// Export d'une instance singleton
export const chatWebSocket = ChatWebSocketService.getInstance();
