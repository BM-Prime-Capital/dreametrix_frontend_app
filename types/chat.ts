/* eslint-disable @typescript-eslint/no-explicit-any */
// Types pour l'API Chat basés sur la documentation
export interface ChatMessage {
  id: number;
  content: string;
  is_deleted: boolean;
  uuid: string;
  created_at: string;
  last_update: string;
  extra_data: any
  school: number;
  chat: number;
  sender: number;
}

export interface ChatRoom {
  id: number;
  school: string;
  name: string;
  details: string;
  is_group: boolean;
  is_deleted: boolean;
  uuid: string;
  created_at: string;
  last_update: string;
  extra_data: Record<string, any>;
}

export interface ChatRoomDetail extends ChatRoom {
  messages: string;
}

export interface CreateChatMessage {
  chat_room_id: number;
  content: string;
}

export interface CreateChatRoom {
  name: string;
}

export interface ChatMessagesResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: ChatMessage[];
}

export interface ChatRoomsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: ChatRoom[];
}

// Types étendus pour l'UI
export interface ChatParticipant {
  id: number;
  name: string;
  avatar?: string;
  status: "online" | "offline" | "away";
  role: "teacher" | "student" | "parent" | "admin";
}

export interface EnhancedChatMessage extends ChatMessage {
  sender_info: ChatParticipant;
  timestamp: Date;
  status: "sent" | "delivered" | "read";
}

export interface EnhancedChatRoom extends ChatRoom {
  participants: ChatParticipant[];
  last_message: EnhancedChatMessage | null;
  unread_count: number;
}
