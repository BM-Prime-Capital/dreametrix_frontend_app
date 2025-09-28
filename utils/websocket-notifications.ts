import { toast } from "@/hooks/use-toast";
import { ChatMessage, ChatRoom } from "@/types/chat";
import { config } from "@/config/websocket";

// Types pour les notifications
export interface NotificationData {
  id: string;
  type: "message" | "mention" | "room_invite" | "system";
  title: string;
  body: string;
  icon?: string;
  data?: any;
  timestamp: Date;
}

export interface NotificationPermissions {
  granted: boolean;
  denied: boolean;
  default: boolean;
}

class WebSocketNotificationManager {
  private static instance: WebSocketNotificationManager;
  private permissions: NotificationPermissions = {
    granted: false,
    denied: false,
    default: true,
  };

  private constructor() {
    this.checkPermissions();
  }

  public static getInstance(): WebSocketNotificationManager {
    if (!WebSocketNotificationManager.instance) {
      WebSocketNotificationManager.instance =
        new WebSocketNotificationManager();
    }
    return WebSocketNotificationManager.instance;
  }

  // Vérifier les permissions de notification
  private checkPermissions(): void {
    if (typeof window !== "undefined" && "Notification" in window) {
      const permission = Notification.permission;
      this.permissions = {
        granted: permission === "granted",
        denied: permission === "denied",
        default: permission === "default",
      };
    }
  }

  // Demander les permissions de notification
  public async requestPermission(): Promise<boolean> {
    if (!("Notification" in window)) {
      console.warn("Ce navigateur ne supporte pas les notifications");
      return false;
    }

    if (this.permissions.granted) {
      return true;
    }

    try {
      const permission = await Notification.requestPermission();
      this.checkPermissions();
      return permission === "granted";
    } catch (error) {
      console.error("Erreur lors de la demande de permission:", error);
      return false;
    }
  }

  // Afficher une notification système
  public showNotification(data: NotificationData): void {
    // Toujours afficher un toast dans l'interface
    this.showToast(data);

    // Afficher une notification système si les permissions sont accordées
    if (this.permissions.granted && config.features.enablePushNotifications) {
      this.showSystemNotification(data);
    }
  }

  // Afficher un toast dans l'interface
  private showToast(data: NotificationData): void {
    const variant = this.getToastVariant(data.type);

    toast({
      title: data.title,
      description: data.body,
      variant,
      duration: 5000,
    });
  }

  // Obtenir le variant du toast selon le type
  private getToastVariant(
    type: NotificationData["type"]
  ): "default" | "destructive" {
    switch (type) {
      case "system":
        return "destructive";
      default:
        return "default";
    }
  }

  // Afficher une notification système
  private showSystemNotification(data: NotificationData): void {
    try {
      const notification = new Notification(data.title, {
        body: data.body,
        icon: data.icon || "/favicon.ico",
        badge: "/favicon.ico",
        tag: data.id,
        data: data.data,
        requireInteraction: data.type === "mention",
      });

      // Auto-fermer après 5 secondes sauf pour les mentions
      if (data.type !== "mention") {
        setTimeout(() => {
          notification.close();
        }, 5000);
      }

      // Gérer les clics sur la notification
      notification.onclick = () => {
        window.focus();
        this.handleNotificationClick(data);
        notification.close();
      };
    } catch (error) {
      console.error("Erreur lors de l'affichage de la notification:", error);
    }
  }

  // Gérer les clics sur les notifications
  private handleNotificationClick(data: NotificationData): void {
    switch (data.type) {
      case "message":
      case "mention":
        if (data.data?.roomId) {
          // Naviguer vers la salle de chat
          const event = new CustomEvent("navigate-to-chat", {
            detail: { roomId: data.data.roomId },
          });
          window.dispatchEvent(event);
        }
        break;
      case "room_invite":
        if (data.data?.roomId) {
          // Naviguer vers l'invitation de salle
          const event = new CustomEvent("navigate-to-room-invite", {
            detail: { roomId: data.data.roomId },
          });
          window.dispatchEvent(event);
        }
        break;
    }
  }

  // Créer une notification pour un nouveau message
  public notifyNewMessage(
    message: ChatMessage,
    room: ChatRoom,
    currentUserId: number
  ): void {
    // Ne pas notifier nos propres messages
    if (message.sender === currentUserId) {
      return;
    }

    const senderName =
      (message as any).sender_info?.name || "Utilisateur inconnu";
    const isMention =
      message.content.includes(`@${currentUserId}`) ||
      message.content.includes("@tous");

    const notification: NotificationData = {
      id: `message-${message.id}`,
      type: isMention ? "mention" : "message",
      title: isMention
        ? `${senderName} vous a mentionné`
        : `Nouveau message de ${senderName}`,
      body: this.truncateMessage(message.content),
      data: { roomId: room.id, messageId: message.id },
      timestamp: new Date(message.created_at),
    };

    this.showNotification(notification);
  }

  // Créer une notification pour une invitation de salle
  public notifyRoomInvite(room: ChatRoom, inviterName: string): void {
    const notification: NotificationData = {
      id: `invite-${room.id}`,
      type: "room_invite",
      title: "Nouvelle invitation de chat",
      body: `${inviterName} vous a invité à rejoindre "${room.name}"`,
      data: { roomId: room.id },
      timestamp: new Date(),
    };

    this.showNotification(notification);
  }

  // Créer une notification système
  public notifySystem(title: string, message: string, data?: any): void {
    const notification: NotificationData = {
      id: `system-${Date.now()}`,
      type: "system",
      title,
      body: message,
      data,
      timestamp: new Date(),
    };

    this.showNotification(notification);
  }

  // Tronquer un message pour la notification
  private truncateMessage(content: string, maxLength: number = 100): string {
    if (content.length <= maxLength) {
      return content;
    }
    return content.substring(0, maxLength - 3) + "...";
  }

  // Obtenir le statut des permissions
  public getPermissions(): NotificationPermissions {
    return { ...this.permissions };
  }

  // Désactiver les notifications
  public disableNotifications(): void {
    // Cette méthode peut être utilisée pour désactiver temporairement les notifications
    // sans modifier les permissions du navigateur
  }
}

// Export de l'instance singleton
export const notificationManager = WebSocketNotificationManager.getInstance();

// Hook personnalisé pour utiliser les notifications dans les composants React
export const useWebSocketNotifications = () => {
  const requestPermission = () => notificationManager.requestPermission();
  const getPermissions = () => notificationManager.getPermissions();

  return {
    requestPermission,
    getPermissions,
    notifyNewMessage:
      notificationManager.notifyNewMessage.bind(notificationManager),
    notifyRoomInvite:
      notificationManager.notifyRoomInvite.bind(notificationManager),
    notifySystem: notificationManager.notifySystem.bind(notificationManager),
  };
};
