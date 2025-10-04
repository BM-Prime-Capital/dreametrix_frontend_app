/* eslint-disable @typescript-eslint/no-explicit-any */
// Types pour l'API Chat basés sur la documentation
export interface ChatMessage {
  id: number;
  content: string;
  is_deleted: boolean;
  uuid: string;
  created_at: string;
  last_update: string;
  extra_data: any;
  school: number;
  chat: number;
  sender: number;
}

export interface ChatRoom {
  id: number;
  school: {
    id: number;
    name: string;
    code: string;
  };
  participants: {
    id: number;
    username: string;
    full_name: string;
    email: string;
    image_url: string | null;
  }[];
  last_message: {
    uuid: string;
    created_at: string;
    last_update: string;
    content: string;
    message_type: string;
    sender: {
      id: number;
      username: string;
      full_name: string;
      email: string;
    };
    attachment_url: string | null;
    voice_note_url: string | null;
    is_deleted: boolean;
    extra_data: any;
  } | null;
  recipient: any;
  name: string;
  details: string | null;
  is_group: boolean;
  is_deleted: boolean;
  uuid: string;
  created_at: string;
  last_update: string;
  extra_data: any;
  room_type: string;
  participant_ids_cache: string | null;
  
}

export interface ChatRoomDetail extends ChatRoom {
  mmessages: ChatMessage[];
}

export interface CreateChatMessage {
  chat_room_id: number;
  content: string;
  message_type?: "text" | "image" | "file" | "audio" | "video";
  attachment?: File;
  voice_note?: File;
}

export interface CreateChatRoom {
  name: string;
  participants?: number[];
  is_group?: boolean;
  room_type?: 'private' | 'group';
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

// EnhancedChatMessage étend maintenant l'objet last_message de l'API

export interface EnhancedChatMessage {
  uuid: string;
  created_at: string;
  last_update: string;
  content: string;
  message_type: string;
  // Utiliser le même type que ChatRoom['last_message']['sender']
  sender: {
    id: number;
    username: string;
    full_name: string;
    email: string;
  };
  attachment_url: string | null;
  voice_note_url: string | null;
  is_deleted: boolean;
  extra_data: any;
  // Propriétés enrichies pour l'UI
  sender_info: ChatParticipant;
  timestamp: Date;
  status: "sent" | "delivered" | "read";
  chat?: number;
}

export interface EnhancedChatRoom extends Omit<ChatRoom, 'participants'> {
  participants: ChatParticipant[];
  last_message: EnhancedChatMessage | null;
  unread_count: number;
}


export function enhanceMessage(
  raw: ChatMessage,
  participants: ChatParticipant[]
): EnhancedChatMessage {
  // Trouver le sender dans les participants enrichis
  const senderInfo =
    participants.find((p) => p.id === raw.sender) ||
    ({
      id: raw.sender,
      name: "Unknown",
      avatar: "/assets/images/general/student.png",
      role: "student",
      status: "offline",
    } as ChatParticipant);

  return {
    uuid: raw.uuid,
    created_at: raw.created_at,
    last_update: raw.last_update,
    content: raw.content,
    message_type: "text", // ⚡ fallback
    sender: {
      id: senderInfo.id,
      username: senderInfo.name,
      full_name: senderInfo.name,
      email: "",
    },
    attachment_url: null,
    voice_note_url: null,
    is_deleted: raw.is_deleted,
    extra_data: raw.extra_data,
    sender_info: senderInfo,
    timestamp: new Date(raw.created_at),
    status: "sent",
    chat: raw.chat,
  };
}

