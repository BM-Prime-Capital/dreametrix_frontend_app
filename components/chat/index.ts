// Module Chat - Point d'entrée principal
// Exportation de tous les composants, hooks et types du module chat

// Types
export * from "../../types/chat";

// Services
export {
  ChatMessageService,
  ChatRoomService,
} from "../../services/chat-service";

// Hooks
export { useChatRooms, useChatMessages } from "../../hooks/useChat";

// Composants
export { default as ChatInterface } from "./ChatInterface";
export { default as EnhancedTeacherCommunication } from "../communicate/EnhancedTeacherCommunication";
export { default as CommunicationPage } from "./CommunicationPage";

// Constantes et utilitaires
export const CHAT_CONFIG = {
  MAX_MESSAGE_LENGTH: 1000,
  MAX_ROOM_NAME_LENGTH: 100,
  POLLING_INTERVAL: 5000, // 5 secondes pour le polling des nouveaux messages
  AUTO_SCROLL_THRESHOLD: 100, // Distance en pixels pour l'auto-scroll
} as const;

// Types d'utilité pour l'intégration
export interface ChatModuleProps {
  className?: string;
  onRoomSelect?: (roomId: number) => void;
  onMessageSend?: (message: string, roomId: number) => void;
  showCreateRoom?: boolean;
  maxHeight?: string;
}

// Messages d'erreur standardisés
export const CHAT_ERRORS = {
  ROOM_NOT_FOUND: "Salon de conversation non trouvé",
  MESSAGE_SEND_FAILED: "Échec de l'envoi du message",
  ROOM_CREATE_FAILED: "Échec de la création du salon",
  UNAUTHORIZED: "Non autorisé à accéder à cette conversation",
  NETWORK_ERROR: "Erreur de connexion réseau",
} as const;
