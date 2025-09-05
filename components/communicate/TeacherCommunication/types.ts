
export interface Message {
  id: string;
  sender: {
    id: string;
    name: string;
    avatar: string;
    role: "teacher" | "student" | "parent";
  };
  content: string;
  timestamp: string;
  attachments?: { name: string; url: string }[];
  read?: boolean;
}

export interface Conversation {
  id: string;
  type: "individual" | "class" | "parent" | "announcement";
  participants: {
    id: string;
    name: string;
    avatar: string;
    role: "teacher" | "student" | "parent";
  }[];
  lastMessage: Message;
  unreadCount: number;
}

export type RecipientType = "student" | "class" | "parent";