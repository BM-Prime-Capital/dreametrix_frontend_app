// src/services/chatService.ts
import { io, Socket } from "socket.io-client";
import { Message, Conversation } from "@/types/chat";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

interface ChatMessage {
  id: string;
  sender: {
    id: string;
    name: string;
    avatar: string;
    role: "teacher" | "student" | "parent";
  };
  content: string;
  timestamp: string;
  read: boolean;
  attachments?: { name: string; url: string }[];
}

interface ChatRoom {
  id: string;
  name: string;
  is_group: boolean;
  participants: {
    id: string;
    name: string;
    avatar: string;
    role: "teacher" | "student" | "parent";
  }[];
  last_message?: {
    id: string;
    content: string;
    created_at: string;
    sender_info: {
      id: string;
      name: string;
      avatar: string;
      role: string;
    };
    status: "sent" | "delivered" | "read";
  };
  unread_count: number;
}

class ChatService {
  private static instance: ChatService;
  private socket: Socket | null = null;
  private token: string | null = null;
  private userId: number | null = null;

  private constructor() {}

  public static getInstance(): ChatService {
    if (!ChatService.instance) {
      ChatService.instance = new ChatService();
    }
    return ChatService.instance;
  }

  public initialize(userId: number, token: string): void {
    this.userId = userId;
    this.token = token;

    // Initialiser la connexion WebSocket
    this.connectSocket();
  }

  private connectSocket(): void {
    if (!this.token || !this.userId) {
      console.error("Cannot connect to WebSocket: missing token or userId");
      return;
    }

    this.socket = io(API_BASE_URL, {
      path: "/ws/chat/",
      auth: { token: this.token },
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    this.socket.on("connect", () => {
      console.log("Connected to WebSocket");
      this.joinUserRooms();
    });

    this.socket.on("disconnect", () => {
      console.log("Disconnected from WebSocket");
    });

    this.socket.on("connect_error", (err) => {
      console.error("WebSocket connection error:", err);
    });
  }

  private async joinUserRooms(): Promise<void> {
    if (!this.socket || !this.userId) return;

    try {
      const rooms = await this.getChatRooms();
      rooms.forEach((room) => {
        this.socket?.emit("join_room", { room_id: room.id });
      });
    } catch (error) {
      console.error("Error joining rooms:", error);
    }
  }

  // API REST Methods
  public async getChatRooms(): Promise<ChatRoom[]> {
    const response = await fetch(`${API_BASE_URL}/chats/rooms/`, {
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch chat rooms");
    }

    return response.json();
  }

  public async getChatMessages(roomId: string): Promise<ChatMessage[]> {
    const response = await fetch(`${API_BASE_URL}/chats/messages/?room_id=${roomId}`, {
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch chat messages");
    }

    const data = await response.json();
    return data.map((msg: any) => this.transformMessage(msg));
  }

  public async createRoom(
    name: string,
    participantIds: number[],
    isGroup: boolean
  ): Promise<ChatRoom> {
    const url = isGroup
      ? `${API_BASE_URL}/chats/rooms/create_group/`
      : `${API_BASE_URL}/chats/rooms/create/`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.token}`,
      },
      body: JSON.stringify({
        name,
        participant_ids: participantIds,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to create chat room");
    }

    return response.json();
  }

  public async sendMessage(
    roomId: string,
    content: string,
    attachments: File[] = []
  ): Promise<ChatMessage> {
    const formData = new FormData();
    formData.append("chat_room_id", roomId);
    formData.append("content", content);
    formData.append("message_type", "text");

    attachments.forEach((file, index) => {
      formData.append(`attachment_${index}`, file);
    });

    const response = await fetch(`${API_BASE_URL}/chats/messages/create/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Failed to send message");
    }

    return response.json();
  }

  public async markAsRead(roomId: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/chats/rooms/${roomId}/mark_as_read/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to mark messages as read");
    }
  }

  // WebSocket Methods
  public subscribeToMessages(
    callback: (message: ChatMessage) => void
  ): () => void {
    if (!this.socket) {
      throw new Error("WebSocket not initialized");
    }

    const listener = (data: any) => {
      callback(this.transformMessage(data));
    };

    this.socket.on("new_message", listener);

    return () => {
      this.socket?.off("new_message", listener);
    };
  }

  public subscribeToTyping(
    callback: (data: { roomId: string; userId: number; isTyping: boolean }) => void
  ): () => void {
    if (!this.socket) {
      throw new Error("WebSocket not initialized");
    }

    this.socket.on("typing", callback);

    return () => {
      this.socket?.off("typing", callback);
    };
  }

  public sendTyping(roomId: string, isTyping: boolean): void {
    if (!this.socket || !this.userId) return;
    this.socket.emit("typing", {
      room_id: roomId,
      user_id: this.userId,
      is_typing: isTyping,
    });
  }

  // Helper Methods
  private transformMessage(msg: any): ChatMessage {
    return {
      id: msg.id.toString(),
      sender: {
        id: msg.sender_info.id.toString(),
        name: msg.sender_info.name,
        avatar: msg.sender_info.avatar || "/default-avatar.png",
        role: msg.sender_info.role === "admin" ? "teacher" : msg.sender_info.role,
      },
      content: msg.content,
      timestamp: new Date(msg.created_at).toISOString(),
      read: msg.status === "read",
      attachments: msg.attachments?.map((att: any) => ({
        name: att.filename,
        url: att.url,
      })),
    };
  }

  public transformToConversation(room: ChatRoom): Conversation {
    return {
      id: room.id.toString(),
      type: room.is_group ? "class" : "individual",
      participants: room.participants.map((p) => ({
        id: p.id.toString(),
        name: p.name,
        avatar: p.avatar || "/default-avatar.png",
        role: p.role === "admin" ? "teacher" : p.role,
      })),
      lastMessage: room.last_message
        ? {
            id: room.last_message.id.toString(),
            sender: {
              id: room.last_message.sender_info.id.toString(),
              name: room.last_message.sender_info.name,
              avatar: room.last_message.sender_info.avatar || "/default-avatar.png",
              role:
                room.last_message.sender_info.role === "admin"
                  ? "teacher"
                  : room.last_message.sender_info.role,
            },
            content: room.last_message.content,
            timestamp: new Date(room.last_message.created_at).toISOString(),
            read: room.last_message.status !== "sent",
          }
        : {
            id: "",
            sender: {
              id: "",
              name: "",
              avatar: "",
              role: "student",
            },
            content: "Aucun message",
            timestamp: "",
            read: true,
          },
      unreadCount: room.unread_count,
    };
  }

  public disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}

export default ChatService.getInstance();