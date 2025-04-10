"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Trash2 } from "lucide-react"
import { ParentMessageDetail } from "./parent-message-detail"
import { Badge } from "@/components/ui/badge"

interface Message {
  id: number
  sender: string
  subject: string
  content: string
  time: string
  date: string
  avatar: string
  regarding?: string
  attachments?: string[]
}

interface ParentMessageListProps {
  activeTab: "teachers" | "school-admin" | "other-parents"
  selectedMessageId: number | null
  onMessageClick: (id: number) => void
}

// Sample messages for parent communication
const messages: Message[] = [
  {
    id: 1,
    sender: "Eva Parker",
    subject: "Regarding John's Math Progress",
    content:
      "Dear Parent Smith, I wanted to update you on John's progress in mathematics. He's been showing significant improvement in algebra concepts over the past few weeks. His last quiz score was 92%, which is excellent. I'd like to discuss some additional resources that might help him continue this positive trend. Please let me know when you might be available for a brief call or meeting. Best regards, Eva Parker",
    time: "13:45",
    date: "21/07/24",
    avatar: "/placeholder.svg",
    regarding: "John Smith",
    attachments: [
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1099&q=80",
    ],
  },
  {
    id: 2,
    sender: "Sam Burke",
    subject: "Science Project Update - Emma",
    content:
      "Hello Parent Smith, I wanted to inform you that Emma has been doing exceptional work on her science project. Her experiment design is creative and well-thought-out. The project is due next Friday, and I'm confident she'll do very well. Please encourage her to continue her excellent work. Regards, Sam Burke",
    time: "10:23",
    date: "20/07/24",
    avatar: "/placeholder.svg",
    regarding: "Emma Smith",
  },
  {
    id: 3,
    sender: "Anna Blake",
    subject: "Upcoming Parent-Teacher Conference",
    content:
      "Dear Parent Smith, This is a reminder about our scheduled parent-teacher conference next Tuesday at 4:30 PM. We'll be discussing both John and Emma's progress this semester. Please confirm your attendance. Looking forward to our meeting. Best, Anna Blake",
    time: "09:15",
    date: "19/07/24",
    avatar: "/placeholder.svg",
    regarding: "John & Emma Smith",
  },
  {
    id: 4,
    sender: "Principal Johnson",
    subject: "School Event - Annual Science Fair",
    content:
      "Dear Parents, We're excited to announce our Annual Science Fair will be held on August 15th. Students from all grades are encouraged to participate. Registration forms are attached. We hope to see your children's creative projects! Sincerely, Principal Johnson",
    time: "14:30",
    date: "18/07/24",
    avatar: "/placeholder.svg",
  },
  {
    id: 5,
    sender: "Eva Parker",
    subject: "Homework Reminder - John",
    content:
      "Dear Parent Smith, Just a friendly reminder that John has a math assignment due this Friday. The assignment covers the recent lessons on geometry. Please ensure he completes it on time. Thank you for your support. Regards, Eva Parker",
    time: "16:05",
    date: "17/07/24",
    avatar: "/placeholder.svg",
    regarding: "John Smith",
  },
]

export function ParentMessageList({ activeTab, selectedMessageId, onMessageClick }: ParentMessageListProps) {
  // Filter messages based on active tab
  const filteredMessages = messages.filter((message) => {
    if (activeTab === "teachers") {
      return message.sender !== "Principal Johnson"
    } else if (activeTab === "school-admin") {
      return message.sender === "Principal Johnson"
    } else {
      return false // No other parent messages in this sample
    }
  })

  return (
    <div className="w-full">
      {filteredMessages.length > 0 ? (
        filteredMessages.map((message) => (
          <div key={message.id}>
            <div
              className={`flex items-center p-4 border-b hover:bg-gray-50 cursor-pointer ${
                selectedMessageId === message.id ? "bg-gray-50" : ""
              }`}
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
                <div className="flex items-center">
                  <div className="font-medium text-gray-700">{message.sender}</div>
                  {message.regarding && (
                    <Badge variant="outline" className="ml-2 bg-blue-50 text-blue-700">
                      {message.regarding}
                    </Badge>
                  )}
                </div>
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

            {selectedMessageId === message.id && <ParentMessageDetail message={message} />}
          </div>
        ))
      ) : (
        <div className="p-8 text-center text-gray-500">No messages in this category</div>
      )}
    </div>
  )
}
