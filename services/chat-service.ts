import { API_CONFIG, buildApiUrl, getApiHeaders } from "@/lib/api-config";
import {
  ChatMessage,
  ChatRoom,
  ChatRoomDetail,
  CreateChatMessage,
  CreateChatRoom,
  ChatMessagesResponse,
  ChatRoomsResponse,
} from "@/types/chat";

// Configuration des endpoints Chat
const CHAT_ENDPOINTS = {
  MESSAGES: "/chats/messages/",
  MESSAGES_CREATE: "/chats/messages/create/",
  MESSAGES_DETAIL: (id: number) => `/chats/messages/${id}/`,
  ROOMS: "/chats/rooms/",
  ROOMS_CREATE: "/chats/rooms/create/",
  ROOMS_DETAIL: (id: number) => `/chats/rooms/${id}/`,
};

// Service pour les messages de chat
export class ChatMessageService {
  // Lister tous les messages avec pagination optionnelle
  static async listMessages(
    limit?: number,
    offset?: number
  ): Promise<ChatMessagesResponse> {
    try {
      const params: Record<string, string> = {};
      if (limit) params.limit = limit.toString();
      if (offset) params.offset = offset.toString();

      const url = buildApiUrl(CHAT_ENDPOINTS.MESSAGES, params);
      const response = await fetch(url, {
        method: "GET",
        headers: getApiHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch messages: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching chat messages:", error);
      throw error;
    }
  }

  // Créer un nouveau message
  static async createMessage(
    messageData: Omit<ChatMessage, "id" | "uuid" | "created_at" | "last_update">
  ): Promise<ChatMessage> {
    try {
      const url = buildApiUrl(CHAT_ENDPOINTS.MESSAGES);
      const response = await fetch(url, {
        method: "POST",
        headers: getApiHeaders(),
        body: JSON.stringify({ data: messageData }),
      });

      if (!response.ok) {
        throw new Error(`Failed to create message: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error creating chat message:", error);
      throw error;
    }
  }

  // Créer un message via l'endpoint spécialisé
  static async createChatMessage(
    messageData: CreateChatMessage
  ): Promise<CreateChatMessage> {
    try {
      const url = buildApiUrl(CHAT_ENDPOINTS.MESSAGES_CREATE);
      const response = await fetch(url, {
        method: "POST",
        headers: getApiHeaders(),
        body: JSON.stringify({ data: messageData }),
      });

      if (!response.ok) {
        throw new Error(`Failed to create chat message: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error creating chat message:", error);
      throw error;
    }
  }

  // Obtenir un message spécifique
  static async getMessage(id: number): Promise<ChatMessage> {
    try {
      const url = buildApiUrl(CHAT_ENDPOINTS.MESSAGES_DETAIL(id));
      const response = await fetch(url, {
        method: "GET",
        headers: getApiHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch message: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching chat message:", error);
      throw error;
    }
  }

  // Mettre à jour un message (PUT)
  static async updateMessage(
    id: number,
    messageData: Omit<ChatMessage, "id" | "uuid" | "created_at" | "last_update">
  ): Promise<ChatMessage> {
    try {
      const url = buildApiUrl(CHAT_ENDPOINTS.MESSAGES_DETAIL(id));
      const response = await fetch(url, {
        method: "PUT",
        headers: getApiHeaders(),
        body: JSON.stringify({ data: messageData }),
      });

      if (!response.ok) {
        throw new Error(`Failed to update message: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error updating chat message:", error);
      throw error;
    }
  }

  // Mettre à jour partiellement un message (PATCH)
  static async partialUpdateMessage(
    id: number,
    messageData: Partial<ChatMessage>
  ): Promise<ChatMessage> {
    try {
      const url = buildApiUrl(CHAT_ENDPOINTS.MESSAGES_DETAIL(id));
      const response = await fetch(url, {
        method: "PATCH",
        headers: getApiHeaders(),
        body: JSON.stringify({ data: messageData }),
      });

      if (!response.ok) {
        throw new Error(`Failed to update message: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error updating chat message:", error);
      throw error;
    }
  }

  // Supprimer un message
  static async deleteMessage(id: number): Promise<void> {
    try {
      const url = buildApiUrl(CHAT_ENDPOINTS.MESSAGES_DETAIL(id));
      const response = await fetch(url, {
        method: "DELETE",
        headers: getApiHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Failed to delete message: ${response.status}`);
      }
    } catch (error) {
      console.error("Error deleting chat message:", error);
      throw error;
    }
  }
}

// Service pour les salons de chat
export class ChatRoomService {
  // Lister tous les salons avec filtres optionnels
  static async listRooms(
    name?: string,
    school?: string,
    details?: string,
    limit?: number,
    offset?: number
  ): Promise<ChatRoomsResponse> {
    try {
      const params: Record<string, string> = {};
      if (name) params.name = name;
      if (school) params.school = school;
      if (details) params.details = details;
      if (limit) params.limit = limit.toString();
      if (offset) params.offset = offset.toString();

      const url = buildApiUrl(CHAT_ENDPOINTS.ROOMS, params);
      const response = await fetch(url, {
        method: "GET",
        headers: getApiHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch rooms: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching chat rooms:", error);
      throw error;
    }
  }

  // Créer un nouveau salon
  static async createRoom(roomData: {
    name?: string;
    details?: string;
    is_group?: boolean;
    is_deleted?: boolean;
    extra_data?: string;
  }): Promise<ChatRoom> {
    try {
      const url = buildApiUrl(CHAT_ENDPOINTS.ROOMS);
      const formData = new FormData();

      if (roomData.name) formData.append("name", roomData.name);
      if (roomData.details) formData.append("details", roomData.details);
      if (roomData.is_group !== undefined)
        formData.append("is_group", roomData.is_group.toString());
      if (roomData.is_deleted !== undefined)
        formData.append("is_deleted", roomData.is_deleted.toString());
      if (roomData.extra_data)
        formData.append("extra_data", roomData.extra_data);

      const response = await fetch(url, {
        method: "POST",
        // Don't set Content-Type for FormData, let browser handle it
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Failed to create room: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error creating chat room:", error);
      throw error;
    }
  }

  // Créer un salon via l'endpoint spécialisé
  static async createChatRoom(
    roomData: CreateChatRoom
  ): Promise<CreateChatRoom> {
    try {
      const url = buildApiUrl(CHAT_ENDPOINTS.ROOMS_CREATE);
      const formData = new FormData();
      formData.append("name", roomData.name);

      const response = await fetch(url, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Failed to create chat room: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error creating chat room:", error);
      throw error;
    }
  }

  // Obtenir un salon spécifique avec ses détails
  static async getRoom(id: number): Promise<ChatRoomDetail> {
    try {
      const url = buildApiUrl(CHAT_ENDPOINTS.ROOMS_DETAIL(id));
      const response = await fetch(url, {
        method: "GET",
        headers: getApiHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch room: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching chat room:", error);
      throw error;
    }
  }

  // Mettre à jour un salon (PUT)
  static async updateRoom(
    id: number,
    roomData: {
      name?: string;
      details?: string;
      is_group?: boolean;
      is_deleted?: boolean;
      extra_data?: string;
    }
  ): Promise<ChatRoom> {
    try {
      const url = buildApiUrl(CHAT_ENDPOINTS.ROOMS_DETAIL(id));
      const formData = new FormData();

      if (roomData.name) formData.append("name", roomData.name);
      if (roomData.details) formData.append("details", roomData.details);
      if (roomData.is_group !== undefined)
        formData.append("is_group", roomData.is_group.toString());
      if (roomData.is_deleted !== undefined)
        formData.append("is_deleted", roomData.is_deleted.toString());
      if (roomData.extra_data)
        formData.append("extra_data", roomData.extra_data);

      const response = await fetch(url, {
        method: "PUT",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Failed to update room: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error updating chat room:", error);
      throw error;
    }
  }

  // Mettre à jour partiellement un salon (PATCH)
  static async partialUpdateRoom(
    id: number,
    roomData: {
      name?: string;
      details?: string;
      is_group?: boolean;
      is_deleted?: boolean;
      extra_data?: string;
    }
  ): Promise<ChatRoom> {
    try {
      const url = buildApiUrl(CHAT_ENDPOINTS.ROOMS_DETAIL(id));
      const formData = new FormData();

      if (roomData.name) formData.append("name", roomData.name);
      if (roomData.details) formData.append("details", roomData.details);
      if (roomData.is_group !== undefined)
        formData.append("is_group", roomData.is_group.toString());
      if (roomData.is_deleted !== undefined)
        formData.append("is_deleted", roomData.is_deleted.toString());
      if (roomData.extra_data)
        formData.append("extra_data", roomData.extra_data);

      const response = await fetch(url, {
        method: "PATCH",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Failed to update room: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error updating chat room:", error);
      throw error;
    }
  }

  // Supprimer un salon
  static async deleteRoom(id: number): Promise<void> {
    try {
      const url = buildApiUrl(CHAT_ENDPOINTS.ROOMS_DETAIL(id));
      const response = await fetch(url, {
        method: "DELETE",
        headers: getApiHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Failed to delete room: ${response.status}`);
      }
    } catch (error) {
      console.error("Error deleting chat room:", error);
      throw error;
    }
  }
}
