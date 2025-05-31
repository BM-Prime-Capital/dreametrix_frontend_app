"use client"

import { useState, useMemo } from "react"
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
  regardingIds?: number[]
  attachments?: string[]
  isRead: boolean
}

interface ParentMessageListProps {
  activeTab: "teachers" | "school-admin" | "other-parents"
  selectedMessageId: number | null
  onMessageClick: (id: number) => void
  selectedStudents: number[]
}

const initialMessages: Message[] = [
  {
    id: 1,
    sender: "Eva Parker",
    subject: "Regarding John's Math Progress",
    content:
      "Dear Parent Smith, I wanted to update you on John's progress in mathematics. He's been showing significant improvement in algebra concepts over the past few weeks. His last quiz score was 92%, which is excellent. I'd like to discuss some additional resources that might help him continue this positive trend. Please let me know when you might be available for a brief call or meeting. Best regards, Eva Parker",
    time: "13:45",
    date: "21/07/23",
    avatar: "/placeholder.svg",
    regarding: "John Smith",
    regardingIds: [1],
    attachments: [
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80",
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&auto=format&fit=crop&w=1099&q=80",
    ],
    isRead: true,
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
    regardingIds: [2],
    isRead: true,
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
    regardingIds: [1, 2],
    isRead: false,
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
    regardingIds: [],
    isRead: false,
  },
  {
    id: 5,
    sender: "Eva Parkersi",
    subject: "Homework Reminder - John",
    content:
      "Dear Parent Smith, Just a friendly reminder that John has a math assignment due this Friday. The assignment covers the recent lessons on geometry. Please ensure he completes it on time. Thank you for your support. Regards, Eva Parker",
    time: "16:05",
    date: "17/07/24",
    avatar: "/placeholder.svg",
    regarding: "John Smith",
    regardingIds: [1],
    isRead: true,
  },
  {
    id: 6,
    sender: "Eva Parkersi",
    subject: "Homework Reminder - John",
    content:
      "Dear Parent Smith, Just a friendly reminder that John has a math assignment due this Friday. The assignment covers the recent lessons on geometry. Please ensure he completes it on time. Thank you for your support. Regards, Eva Parker",
    time: "16:05",
    date: "17/07/24",
    avatar: "/placeholder.svg",
    regarding: "John Smith",
    regardingIds: [1],
    isRead: true,
  },
]

export function ParentMessageList({
  activeTab,
  selectedMessageId,
  onMessageClick,
  selectedStudents,
}: ParentMessageListProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages)

  const handleClick = (id: number) => {
    setMessages(prevMessages => 
      prevMessages.map(message => 
        message.id === id 
          ? { ...message, isRead: true } 
          : message
      )
    )
    onMessageClick(id)
  }

  const filteredMessages = useMemo(() => {
    return messages.filter((message) => {
      const tabFilter =
        activeTab === "teachers"
          ? message.sender !== "Principal Johnson"
          : activeTab === "school-admin"
          ? message.sender === "Principal Johnson"
          : false

      const studentFilter =
        selectedStudents.length === 0
          ? true
          : message.regardingIds
          ? message.regardingIds.some((id) => selectedStudents.includes(id))
          : false

      return tabFilter && studentFilter
    })
  }, [messages, activeTab, selectedStudents])

  return (
    <div className="w-full">
      {filteredMessages.length > 0 ? (
        filteredMessages.map((message) => {
          const isSelected = selectedMessageId === message.id
          const isUnread = !message.isRead

          return (
            <div key={message.id}>
              <div
                className={`flex items-center p-4 border-b cursor-pointer transition-colors relative ${
                  isSelected 
                    ? "bg-blue-50" 
                    : isUnread 
                      ? "bg-white hover:bg-gray-50" 
                      : "bg-gray-50 hover:bg-gray-100"
                }`}
                onClick={() => handleClick(message.id)}
              >
                {isUnread && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 rounded-r-md"></div>
                )}
                
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
                    <div className={`font-medium ${
                      isUnread ? "text-gray-900 font-semibold" : "text-gray-700"
                    }`}>
                      {message.sender}
                    </div>
                    {message.regarding && (
                      <Badge
                        variant="outline"
                        className="ml-2 bg-blue-50 text-blue-700"
                      >
                        {message.regarding}
                      </Badge>
                    )}
                  </div>
                  <div className={`truncate ${
                    isUnread ? "text-gray-900 font-medium" : "text-gray-500"
                  }`}>
                    {message.subject}
                  </div>
                </div>

                <div className="flex flex-col items-end ml-4">
                  <div className={`text-sm ${
                    isUnread ? "text-gray-900" : "text-gray-500"
                  }`}>
                    {message.time}
                  </div>
                  <div className="text-sm text-gray-500">{message.date}</div>
                </div>

                <button
                  className="ml-4 text-red-400 hover:text-red-600"
                  onClick={(e) => {
                    e.stopPropagation()
                  }}
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>

              {isSelected && <ParentMessageDetail message={message} />}
            </div>
          )
        })
      ) : (
        <div className="p-8 text-center text-gray-500">
          {selectedStudents.length > 0
            ? "No messages match the selected students"
            : "No messages in this category"}
        </div>
      )}
    </div>
  )
}