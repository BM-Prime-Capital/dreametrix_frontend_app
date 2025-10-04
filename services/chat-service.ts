// Henock BARAKAEL
// -----------------------------------------------------------------------------------------
// Service Chat (Rooms & Messages) – version corrigée avec support des participants
// -----------------------------------------------------------------------------------------

import {
  ChatMessage,
  ChatRoom,
  ChatRoomDetail,
  CreateChatMessage,
  CreateChatRoom,
  ChatMessagesResponse,
  ChatRoomsResponse,
} from "@/types/chat";
import { BACKEND_BASE_URL } from "@/app/utils/constants";

// -----------------------------------------------------------------------------------------
// Erreur API uniforme
// -----------------------------------------------------------------------------------------
export class ChatApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public details?: any,
    public accessToken?: string
  ) {
    super(message);
    this.name = "ChatApiError";
  }
}

// -----------------------------------------------------------------------------------------
// Endpoints du module chat
// -----------------------------------------------------------------------------------------
const CHAT_ENDPOINTS = {
  // Messages
  MESSAGES: "/chats/messages/",
  MESSAGES_CREATE: "/chats/messages/create/",
  MESSAGES_DETAIL: (id: number) => `/chats/messages/${id}/`,

  // Rooms
  ROOMS: "/chats/rooms/",
  ROOMS_CREATE: "/chats/rooms/create/",
  ROOMS_DETAIL: (id: number) => `/chats/rooms/${id}/`,
} as const;

// -----------------------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------------------

/**
 * Retourne la base URL effective.
 */
function resolveBaseURL(tenantPrimaryDomain?: string): string {
  const base = (tenantPrimaryDomain && tenantPrimaryDomain.trim()) || BACKEND_BASE_URL;
  return base.endsWith("/") ? base.slice(0, -1) : base;
}

/**
 * Construit un objet Headers pour Authorization + extras.
 */
function buildAuthHeaders(
  accessToken?: string,
  extra?: HeadersInit
): HeadersInit {
  const headers: HeadersInit = {
    ...(extra || {}),
  };

  if (!accessToken || accessToken.trim() === "") {
    return headers;
  }

  return {
    ...headers,
    Authorization: `Bearer ${accessToken}`,
  };
}

/**
 * Construit un URL avec ses query params.
 */
function buildUrlWithParams(base: string, path: string, params?: Record<string, string>): string {
  const url = new URL(`${base}${path}`);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        url.searchParams.append(key, String(value));
      }
    });
  }
  return url.toString();
}

/**
 * Normalise les erreurs fetch → ChatApiError
 */
async function normalizeFetchError(
  response: Response,
  accessToken?: string
): Promise<never> {
  let details: any = undefined;
  try {
    details = await response.json();
  } catch {
    try {
      const txt = await response.text();
      details = { raw: txt };
    } catch {
      // ignore
    }
  }
  const message =
    (details && (details.message || details.detail)) ||
    `HTTP Error: ${response.status}`;
  throw new ChatApiError(message, response.status, details, accessToken);
}

/**
 * Vérifie le token, sinon lève une ChatApiError 401 cohérente
 */
function assertToken(accessToken?: string) {
  if (!accessToken || accessToken.trim() === "") {
    throw new ChatApiError(
      "No access token provided. Please log in again.",
      401,
      { code: "NO_TOKEN" },
      accessToken
    );
  }
}

// -----------------------------------------------------------------------------------------
// ChatMessageService
// -----------------------------------------------------------------------------------------
export class ChatMessageService {
  /**
   * GET /chats/messages/ (optionnel: limit, offset)
   */
  static async listMessages(
    tenantPrimaryDomain: string | undefined,
    accessToken: string | undefined,
    limit?: number,
    offset?: number,
    chatRoomId?: number
  ): Promise<ChatMessagesResponse> {
    try {
      assertToken(accessToken);

      const base = resolveBaseURL(tenantPrimaryDomain);
      const params: Record<string, string> = {};
      if (limit !== undefined) params.limit = String(limit);
      if (offset !== undefined) params.offset = String(offset);
      if (chatRoomId) params.chat = chatRoomId.toString();

      const url = buildUrlWithParams(base, CHAT_ENDPOINTS.MESSAGES, params);

      if (process.env.NODE_ENV === "development") {
        console.log("🔎 [ChatMessageService.listMessages] URL =>", url);
      }

      const response = await fetch(url, {
        method: "GET",
        headers: buildAuthHeaders(accessToken),
      });

      if (!response.ok) {
        return normalizeFetchError(response, accessToken);
      }

      return (await response.json()) as ChatMessagesResponse;
    } catch (error) {
      if (error instanceof ChatApiError) throw error;
      throw new ChatApiError(
        error instanceof Error ? error.message : "Unknown error occurred",
        0,
        error,
        accessToken
      );
    }
  }

    /**
   *  STUDENT-SPECIFIC METHODS
   *  (if any student-specific logic is needed, it can be added here)
   */

    /**
   * GET /chats/rooms/:uuid/ → retourne le détail d'une room avec ses messages
   */
  static async getChatMessages(
    tenantPrimaryDomain: string | undefined,
    accessToken: string | undefined,
    roomUuid: string
  ): Promise<ChatRoomDetail> {
    try {
      assertToken(accessToken);

      const base = resolveBaseURL(tenantPrimaryDomain);
      const url = `${base}/chats/rooms/${roomUuid}/`;

      if (process.env.NODE_ENV === "development") {
        console.log("🔎 [ChatMessageService.getChatMessages] URL =>", url);
      }

      const response = await fetch(url, {
        method: "GET",
        headers: buildAuthHeaders(accessToken),
      });

      if (!response.ok) {
        return normalizeFetchError(response, accessToken);
      }

      return (await response.json()) as ChatRoomDetail;
    } catch (error) {
      if (error instanceof ChatApiError) throw error;
      throw new ChatApiError(
        error instanceof Error ? error.message : "Unknown error occurred",
        0,
        error,
        accessToken
      );
    }
  }


  /**
   * POST /chats/messages/ (payload JSON générique)
   */
  static async createMessage(
    tenantPrimaryDomain: string | undefined,
    accessToken: string | undefined,
    messageData: Omit<ChatMessage, "id" | "uuid" | "created_at" | "last_update">
  ): Promise<ChatMessage> {
    try {
      assertToken(accessToken);

      const base = resolveBaseURL(tenantPrimaryDomain);
      const url = `${base}${CHAT_ENDPOINTS.MESSAGES}`;

      if (process.env.NODE_ENV === "development") {
        console.log("📝 [ChatMessageService.createMessage] URL =>", url, "payload =>", messageData);
      }

      const response = await fetch(url, {
        method: "POST",
        headers: buildAuthHeaders(accessToken, { "Content-Type": "application/json" }),
        body: JSON.stringify({ data: messageData }),
      });

      if (!response.ok) {
        return normalizeFetchError(response, accessToken);
      }

      return (await response.json()) as ChatMessage;
    } catch (error) {
      if (error instanceof ChatApiError) throw error;
      throw new ChatApiError(
        error instanceof Error ? error.message : "Unknown error occurred",
        0,
        error,
        accessToken
      );
    }
  }

/**
 * POST /chats/messages/create/
 * Accepte soit FormData (recommandé), soit JSON fallback.
 */
static async createChatMessage(
  tenantPrimaryDomain: string | undefined,
  accessToken: string | undefined,
  messageData: CreateChatMessage | FormData
): Promise<ChatMessage> {
  try {
    assertToken(accessToken);

    const base = resolveBaseURL(tenantPrimaryDomain);
    const url = `${base}${CHAT_ENDPOINTS.MESSAGES_CREATE}`;

    const isFormData = messageData instanceof FormData;

    if (process.env.NODE_ENV === "development") {
      console.log(
        "📝 [ChatMessageService.createChatMessage] URL =>", url,
        "payload =>", messageData,
        "isFormData =>", isFormData
      );
    }

    const response = await fetch(url, {
      method: "POST",
      headers: buildAuthHeaders(
        accessToken,
        isFormData ? {} : { "Content-Type": "application/json" }
      ),
      body: isFormData ? messageData : JSON.stringify(messageData),
    });

    if (!response.ok) {
      return normalizeFetchError(response, accessToken);
    }

    return (await response.json()) as ChatMessage;
  } catch (error) {
    if (error instanceof ChatApiError) throw error;
    throw new ChatApiError(
      error instanceof Error ? error.message : "Unknown error occurred",
      0,
      error,
      accessToken
    );
  }
}


  /**
   * GET /chats/messages/:id/
   */
  static async getMessage(
    tenantPrimaryDomain: string | undefined,
    accessToken: string | undefined,
    id: number
  ): Promise<ChatMessage> {
    try {
      assertToken(accessToken);

      const base = resolveBaseURL(tenantPrimaryDomain);
      const url = `${base}${CHAT_ENDPOINTS.MESSAGES_DETAIL(id)}`;

      if (process.env.NODE_ENV === "development") {
        console.log("🔎 [ChatMessageService.getMessage] URL =>", url);
      }

      const response = await fetch(url, {
        method: "GET",
        headers: buildAuthHeaders(accessToken),
      });

      if (!response.ok) {
        return normalizeFetchError(response, accessToken);
      }

      return (await response.json()) as ChatMessage;
    } catch (error) {
      if (error instanceof ChatApiError) throw error;
      throw new ChatApiError(
        error instanceof Error ? error.message : "Unknown error occurred",
        0,
        error,
        accessToken
      );
    }
  }

  /**
   * PUT /chats/messages/:id/ (JSON complet)
   */
  static async updateMessage(
    tenantPrimaryDomain: string | undefined,
    accessToken: string | undefined,
    id: number,
    messageData: Omit<ChatMessage, "id" | "uuid" | "created_at" | "last_update">
  ): Promise<ChatMessage> {
    try {
      assertToken(accessToken);

      const base = resolveBaseURL(tenantPrimaryDomain);
      const url = `${base}${CHAT_ENDPOINTS.MESSAGES_DETAIL(id)}`;

      if (process.env.NODE_ENV === "development") {
        console.log("🛠️ [ChatMessageService.updateMessage] URL =>", url, "payload =>", messageData);
      }

      const response = await fetch(url, {
        method: "PUT",
        headers: buildAuthHeaders(accessToken, { "Content-Type": "application/json" }),
        body: JSON.stringify({ data: messageData }),
      });

      if (!response.ok) {
        return normalizeFetchError(response, accessToken);
      }

      return (await response.json()) as ChatMessage;
    } catch (error) {
      if (error instanceof ChatApiError) throw error;
      throw new ChatApiError(
        error instanceof Error ? error.message : "Unknown error occurred",
        0,
        error,
        accessToken
      );
    }
  }

  /**
   * PATCH /chats/messages/:id/ (JSON partiel)
   */
  static async partialUpdateMessage(
    tenantPrimaryDomain: string | undefined,
    accessToken: string | undefined,
    id: number,
    messageData: Partial<ChatMessage>
  ): Promise<ChatMessage> {
    try {
      assertToken(accessToken);

      const base = resolveBaseURL(tenantPrimaryDomain);
      const url = `${base}${CHAT_ENDPOINTS.MESSAGES_DETAIL(id)}`;

      if (process.env.NODE_ENV === "development") {
        console.log("🛠️ [ChatMessageService.partialUpdateMessage] URL =>", url, "payload =>", messageData);
      }

      const response = await fetch(url, {
        method: "PATCH",
        headers: buildAuthHeaders(accessToken, { "Content-Type": "application/json" }),
        body: JSON.stringify({ data: messageData }),
      });

      if (!response.ok) {
        return normalizeFetchError(response, accessToken);
      }

      return (await response.json()) as ChatMessage;
    } catch (error) {
      if (error instanceof ChatApiError) throw error;
      throw new ChatApiError(
        error instanceof Error ? error.message : "Unknown error occurred",
        0,
        error,
        accessToken
      );
    }
  }

  /**
   * DELETE /chats/messages/:id/
   */
  static async deleteMessage(
    tenantPrimaryDomain: string | undefined,
    accessToken: string | undefined,
    id: number
  ): Promise<void> {
    try {
      assertToken(accessToken);

      const base = resolveBaseURL(tenantPrimaryDomain);
      const url = `${base}${CHAT_ENDPOINTS.MESSAGES_DETAIL(id)}`;

      if (process.env.NODE_ENV === "development") {
        console.log("🗑️ [ChatMessageService.deleteMessage] URL =>", url);
      }

      const response = await fetch(url, {
        method: "DELETE",
        headers: buildAuthHeaders(accessToken),
      });

      if (!response.ok) {
        return normalizeFetchError(response, accessToken);
      }
    } catch (error) {
      if (error instanceof ChatApiError) throw error;
      throw new ChatApiError(
        error instanceof Error ? error.message : "Unknown error occurred",
        0,
        error,
        accessToken
      );
    }
  }
}

// -----------------------------------------------------------------------------------------
// ChatRoomService - CORRIGÉ POUR SUPPORTER LES PARTICIPANTS
// -----------------------------------------------------------------------------------------
export class ChatRoomService {


  /**
   * POST /chats/rooms/{id}/mark_as_read/ - Marquer une conversation comme lue
   */
  static async markAsRead(
    tenantPrimaryDomain: string | undefined,
    accessToken: string | undefined,
    roomId: number
  ): Promise<{ success: boolean }> {
    try {
      assertToken(accessToken);

      const base = resolveBaseURL(tenantPrimaryDomain);
      const url = `${base}/chats/rooms/${roomId}/mark_as_read/`;

      if (process.env.NODE_ENV === "development") {
        console.log("📖 [ChatRoomService.markAsRead] URL =>", url);
      }

      const response = await fetch(url, {
        method: "POST",
        headers: buildAuthHeaders(accessToken),
      });

      if (!response.ok) {
        return normalizeFetchError(response, accessToken);
      }

      return await response.json();
    } catch (error) {
      if (error instanceof ChatApiError) throw error;
      throw new ChatApiError(
        error instanceof Error ? error.message : "Unknown error occurred",
        0,
        error,
        accessToken
      );
    }
  }


  /**
   * GET /chats/rooms/ (filtres optionnels + pagination)
   */
  static async listRooms(
    tenantPrimaryDomain: string | undefined,
    accessToken: string | undefined,
    name?: string,
    school?: string,
    details?: string,
    limit?: number,
    offset?: number
  ): Promise<ChatRoomsResponse> {
    try {
      assertToken(accessToken);

      const base = resolveBaseURL(tenantPrimaryDomain);

      const params: Record<string, string> = {};
      if (name) params.name = name;
      if (school) params.school = school;
      if (details) params.details = details;
      if (limit !== undefined) params.limit = String(limit);
      if (offset !== undefined) params.offset = String(offset);

      const url = buildUrlWithParams(base, CHAT_ENDPOINTS.ROOMS, params);

      if (process.env.NODE_ENV === "development") {
        console.log("🔎 [ChatRoomService.listRooms] URL =>", url);
      }

      const response = await fetch(url, {
        method: "GET",
        headers: buildAuthHeaders(accessToken),
      });

      if (!response.ok) {
        return normalizeFetchError(response, accessToken);
      }

      return (await response.json()) as ChatRoomsResponse;
    } catch (error) {
      if (error instanceof ChatApiError) throw error;
      throw new ChatApiError(
        error instanceof Error ? error.message : "Unknown error occurred",
        0,
        error,
        accessToken
      );
    }
  }

  /**
   * POST /chats/rooms/ (création standard – FormData)
   */
  static async createRoom(
    tenantPrimaryDomain: string | undefined,
    accessToken: string | undefined,
    roomData: {
      name?: string;
      details?: string;
      is_group?: boolean;
      is_deleted?: boolean;
      extra_data?: string;
      participants?: number[]; // Ajout du support des participants
    }
  ): Promise<ChatRoom> {
    try {
      assertToken(accessToken);

      const base = resolveBaseURL(tenantPrimaryDomain);
      const url = `${base}${CHAT_ENDPOINTS.ROOMS}`;

      if (process.env.NODE_ENV === "development") {
        console.log("📝 [ChatRoomService.createRoom] URL =>", url, "payload =>", roomData);
      }

      const formData = new FormData();
      if (roomData.name !== undefined) formData.append("name", roomData.name);
      if (roomData.details !== undefined) formData.append("details", roomData.details);
      if (roomData.is_group !== undefined) formData.append("is_group", String(roomData.is_group));
      if (roomData.is_deleted !== undefined) formData.append("is_deleted", String(roomData.is_deleted));
      if (roomData.extra_data !== undefined) formData.append("extra_data", roomData.extra_data);
      
      // Ajout des participants si présents
      if (roomData.participants && Array.isArray(roomData.participants)) {
        roomData.participants.forEach((participantId: number) => {
          formData.append("participants", participantId.toString());
        });
      }

      const response = await fetch(url, {
        method: "POST",
        headers: buildAuthHeaders(accessToken),
        body: formData,
      });

      if (!response.ok) {
        return normalizeFetchError(response, accessToken);
      }

      return (await response.json()) as ChatRoom;
    } catch (error) {
      if (error instanceof ChatApiError) throw error;
      throw new ChatApiError(
        error instanceof Error ? error.message : "Unknown error occurred",
        0,
        error,
        accessToken
      );
    }
  }

/**
 * POST /chats/rooms/create/ (endpoint spécialisé – FormData corrigé)
 */

  static async createChatRoom(
    tenantPrimaryDomain: string | undefined,
    accessToken: string | undefined,
    roomData: {
      name?: string;
      participants?: number[];   // remplace participant_ids
      is_group?: boolean;
      initial_message?: string;
    }
  ): Promise<ChatRoom> {
    try {
      assertToken(accessToken);

      const base = resolveBaseURL(tenantPrimaryDomain);
      const url = `${base}${CHAT_ENDPOINTS.ROOMS_CREATE}`;

      const formData = new FormData();
      if (roomData.name) formData.append("name", roomData.name);
      if (roomData.is_group !== undefined) {
        formData.append("is_group", String(roomData.is_group));
      }
      if (roomData.initial_message) {
        formData.append("initial_message", roomData.initial_message);
      }

      // unifié : on utilise "participants"
      if (roomData.participants && Array.isArray(roomData.participants)) {
        roomData.participants.forEach((id) =>
          formData.append("participants", id.toString())
        );
      }

      const response = await fetch(url, {
        method: "POST",
        headers: buildAuthHeaders(accessToken),
        body: formData,
      });

      if (!response.ok) {
        return normalizeFetchError(response, accessToken);
      }

      return (await response.json()) as ChatRoom;
    } catch (error) {
      console.error("❌ [ChatRoomService.createChatRoom] Erreur:", error);
      if (error instanceof ChatApiError) throw error;
      throw new ChatApiError(
        error instanceof Error ? error.message : "Unknown error occurred",
        0,
        error,
        accessToken
      );
    }
  }

  /**
   * GET /chats/rooms/:id/
   */
  static async getRoom(
    tenantPrimaryDomain: string | undefined,
    accessToken: string | undefined,
    id: number
  ): Promise<ChatRoomDetail> {
    try {
      assertToken(accessToken);

      const base = resolveBaseURL(tenantPrimaryDomain);
      const url = `${base}${CHAT_ENDPOINTS.ROOMS_DETAIL(id)}`;

      if (process.env.NODE_ENV === "development") {
        console.log("🔎 [ChatRoomService.getRoom] URL =>", url);
      }

      const response = await fetch(url, {
        method: "GET",
        headers: buildAuthHeaders(accessToken),
      });

      if (!response.ok) {
        return normalizeFetchError(response, accessToken);
      }

      return (await response.json()) as ChatRoomDetail;
    } catch (error) {
      if (error instanceof ChatApiError) throw error;
      throw new ChatApiError(
        error instanceof Error ? error.message : "Unknown error occurred",
        0,
        error,
        accessToken
      );
    }
  }

  /**
   * PUT /chats/rooms/:id/ (FormData complet)
   */
  static async updateRoom(
    tenantPrimaryDomain: string | undefined,
    accessToken: string | undefined,
    id: number,
    roomData: {
      name?: string;
      details?: string;
      is_group?: boolean;
      is_deleted?: boolean;
      extra_data?: string;
      participants?: number[]; // Ajout du support des participants
    }
  ): Promise<ChatRoom> {
    try {
      assertToken(accessToken);

      const base = resolveBaseURL(tenantPrimaryDomain);
      const url = `${base}${CHAT_ENDPOINTS.ROOMS_DETAIL(id)}`;

      if (process.env.NODE_ENV === "development") {
        console.log("🛠️ [ChatRoomService.updateRoom] URL =>", url, "payload =>", roomData);
      }

      const formData = new FormData();
      if (roomData.name !== undefined) formData.append("name", roomData.name);
      if (roomData.details !== undefined) formData.append("details", roomData.details);
      if (roomData.is_group !== undefined) formData.append("is_group", String(roomData.is_group));
      if (roomData.is_deleted !== undefined) formData.append("is_deleted", String(roomData.is_deleted));
      if (roomData.extra_data !== undefined) formData.append("extra_data", roomData.extra_data);
      
      // Ajout des participants si présents
      if (roomData.participants && Array.isArray(roomData.participants)) {
        roomData.participants.forEach((participantId: number) => {
          formData.append("participants", participantId.toString());
        });
      }

      const response = await fetch(url, {
        method: "PUT",
        headers: buildAuthHeaders(accessToken),
        body: formData,
      });

      if (!response.ok) {
        return normalizeFetchError(response, accessToken);
      }

      return (await response.json()) as ChatRoom;
    } catch (error) {
      if (error instanceof ChatApiError) throw error;
      throw new ChatApiError(
        error instanceof Error ? error.message : "Unknown error occurred",
        0,
        error,
        accessToken
      );
    }
  }

  /**
   * PATCH /chats/rooms/:id/ (FormData partiel)
   */
  static async partialUpdateRoom(
    tenantPrimaryDomain: string | undefined,
    accessToken: string | undefined,
    id: number,
    roomData: {
      name?: string;
      details?: string;
      is_group?: boolean;
      is_deleted?: boolean;
      extra_data?: string;
      participants?: number[]; // Ajout du support des participants
    }
  ): Promise<ChatRoom> {
    try {
      assertToken(accessToken);

      const base = resolveBaseURL(tenantPrimaryDomain);
      const url = `${base}${CHAT_ENDPOINTS.ROOMS_DETAIL(id)}`;

      if (process.env.NODE_ENV === "development") {
        console.log("🛠️ [ChatRoomService.partialUpdateRoom] URL =>", url, "payload =>", roomData);
      }

      const formData = new FormData();
      if (roomData.name !== undefined) formData.append("name", roomData.name);
      if (roomData.details !== undefined) formData.append("details", roomData.details);
      if (roomData.is_group !== undefined) formData.append("is_group", String(roomData.is_group));
      if (roomData.is_deleted !== undefined) formData.append("is_deleted", String(roomData.is_deleted));
      if (roomData.extra_data !== undefined) formData.append("extra_data", roomData.extra_data);
      
      // Ajout des participants si présents
      if (roomData.participants && Array.isArray(roomData.participants)) {
        roomData.participants.forEach((participantId: number) => {
          formData.append("participants", participantId.toString());
        });
      }

      const response = await fetch(url, {
        method: "PATCH",
        headers: buildAuthHeaders(accessToken),
        body: formData,
      });

      if (!response.ok) {
        return normalizeFetchError(response, accessToken);
      }

      return (await response.json()) as ChatRoom;
    } catch (error) {
      if (error instanceof ChatApiError) throw error;
      throw new ChatApiError(
        error instanceof Error ? error.message : "Unknown error occurred",
        0,
        error,
        accessToken
      );
    }
  }

  /**
   * DELETE /chats/rooms/:id/
   */
  static async deleteRoom(
    tenantPrimaryDomain: string | undefined,
    accessToken: string | undefined,
    id: number
  ): Promise<void> {
    try {
      assertToken(accessToken);

      const base = resolveBaseURL(tenantPrimaryDomain);
      const url = `${base}${CHAT_ENDPOINTS.ROOMS_DETAIL(id)}`;

      if (process.env.NODE_ENV === "development") {
        console.log("🗑️ [ChatRoomService.deleteRoom] URL =>", url);
      }

      const response = await fetch(url, {
        method: "DELETE",
        headers: buildAuthHeaders(accessToken),
      });

      if (!response.ok) {
        return normalizeFetchError(response, accessToken);
      }
    } catch (error) {
      if (error instanceof ChatApiError) throw error;
      throw new ChatApiError(
        error instanceof Error ? error.message : "Unknown error occurred",
        0,
        error,
        accessToken
      );
    }
  }







}

// -----------------------------------------------------------------------------------------
// Notes d'utilisation CORRIGÉES
// -----------------------------------------------------------------------------------------
/**
 * - La fonction createChatRoom supporte maintenant les participants
 * - Les participants sont envoyés via FormData avec le champ "participants"
 * - Tous les appels API incluent des logs de débogage détaillés
 * - Gestion d'erreur uniforme avec ChatApiError
 * - Support des rooms de groupe (is_group, room_type)
 */