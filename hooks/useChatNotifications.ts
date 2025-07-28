import { toast } from "@/hooks/use-toast";

// Types pour les notifications de chat
export type ChatNotificationType =
  | "conversation_created"
  | "announcement_sent"
  | "message_sent"
  | "error";

export interface ChatNotificationOptions {
  title: string;
  description?: string;
  type: ChatNotificationType;
  duration?: number;
}

// Hook pour gérer les notifications dans le contexte du chat
export const useChatNotifications = () => {
  const showNotification = (options: ChatNotificationOptions) => {
    const { title, description, type, duration = 5000 } = options;

    // Déterminer le variant basé sur le type
    const variant = type === "error" ? "destructive" : "default";

    // Émojis selon le type
    const getEmoji = (notificationType: ChatNotificationType): string => {
      switch (notificationType) {
        case "conversation_created":
          return "💬";
        case "announcement_sent":
          return "📢";
        case "message_sent":
          return "✅";
        case "error":
          return "❌";
        default:
          return "🔔";
      }
    };

    toast({
      title: `${getEmoji(type)} ${title}`,
      description,
      variant,
      duration,
    });
  };

  // Notifications prédéfinies pour le chat
  const notifyConversationCreated = (conversationName: string) => {
    showNotification({
      title: "Conversation créée",
      description: `La conversation "${conversationName}" a été créée avec succès.`,
      type: "conversation_created",
    });
  };

  const notifyAnnouncementSent = (recipients: number) => {
    showNotification({
      title: "Annonce envoyée",
      description: `Votre annonce a été envoyée à ${recipients} destinataire${
        recipients > 1 ? "s" : ""
      }.`,
      type: "announcement_sent",
    });
  };

  const notifyMessageSent = () => {
    showNotification({
      title: "Message envoyé",
      description: "Votre message a été envoyé avec succès.",
      type: "message_sent",
      duration: 3000,
    });
  };

  const notifyError = (errorMessage: string, details?: string) => {
    showNotification({
      title: "Erreur",
      description: details || errorMessage,
      type: "error",
      duration: 7000,
    });
  };

  // Notifications spécifiques aux erreurs de chat
  const notifyConnectionError = () => {
    notifyError(
      "Erreur de connexion",
      "Impossible de se connecter au serveur de chat. Vérifiez votre connexion internet."
    );
  };

  const notifyCreationError = (type: "conversation" | "announcement") => {
    notifyError(
      `Erreur de création`,
      `Impossible de créer ${
        type === "conversation" ? "la conversation" : "l'annonce"
      }. Veuillez réessayer.`
    );
  };

  const notifyMessageError = () => {
    notifyError(
      "Erreur d'envoi",
      "Impossible d'envoyer le message. Vérifiez votre connexion et réessayez."
    );
  };

  return {
    showNotification,
    notifyConversationCreated,
    notifyAnnouncementSent,
    notifyMessageSent,
    notifyError,
    notifyConnectionError,
    notifyCreationError,
    notifyMessageError,
  };
};
