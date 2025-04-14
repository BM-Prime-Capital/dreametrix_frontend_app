"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Trash2 } from "lucide-react"
import { MessageDetail } from "./message-detail"

interface Message {
  id: number
  sender: string
  subject: string
  content: string
  time: string
  date: string
  avatar: string
  attachments?: string[]
}

interface MessageListProps {
  activeTab: "teachers" | "whole-class" | "other-groups"
  selectedMessageId: number | null
  onMessageClick: (id: number) => void
}

// Update the messages array to use online image URLs
const messages: Message[] = [
  {
    id: 1,
    sender: "Eva Parker",
    subject: "Hi Teacher,",
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum fermentum facilisis libero, venenatis mattis sed hendrerit eget. Etiam ultricies mollis justo, nec fermentum elit viverra eu. Cras et cursus turpis. Nullam magna sem, vulputate quis massa nec, mollis sollicitudin est. Sed ac massa in arcu pharetra posuere. Praesent condimentum ac dapibus magna.",
    time: "13:45",
    date: "21/07/24",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
    attachments: [
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1099&q=80",
      "https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1176&q=80",
      "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    ],
  },
  {
    id: 2,
    sender: "Eva Parker",
    subject: "Hi Student,",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do.",
    time: "13:45",
    date: "21/07/24",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
  },
  {
    id: 3,
    sender: "Eva Parker",
    subject: "Hi Student,",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do.",
    time: "13:45",
    date: "21/07/24",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
  },
  {
    id: 4,
    sender: "Eva Parker",
    subject: "Hi Student,",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do.",
    time: "13:45",
    date: "21/07/24",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
  },
  {
    id: 5,
    sender: "Eva Parker",
    subject: "Hi Student,",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do.",
    time: "13:45",
    date: "21/07/24",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
  },
]

export function MessageList({ selectedMessageId, onMessageClick }: MessageListProps) {
  return (
    <div className="w-full">
      {messages.map((message) => (
        <div key={message.id}>
          <div
            className={`flex items-center p-4 border-b hover:bg-gray-50 cursor-pointer ${selectedMessageId === message.id ? "bg-gray-50" : ""}`}
            onClick={() => onMessageClick?.(message.id)}
          >
            <Avatar className="h-12 w-12 mr-4">
              <AvatarImage src={message.avatar} />
              <AvatarFallback>
                {message.sender
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-gray-700">{message.sender}</div>
              <div className="text-gray-500 truncate">{message.subject}</div>
            </div>

            <div className="flex flex-col items-end ml-4">
              <div className="text-sm text-gray-500">{message.time}</div>
              <div className="text-sm text-gray-500">{message.date}</div>
            </div>

            <button className="ml-4 text-red-400 hover:text-red-600" onClick={(e) => e.stopPropagation()}>
              <Trash2 className="h-5 w-5" />
            </button>
          </div>

          {selectedMessageId === message.id && <MessageDetail message={message} />}
        </div>
      ))}
    </div>
  )
}

