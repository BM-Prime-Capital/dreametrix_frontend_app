"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Paperclip, Reply } from "lucide-react"

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

interface ParentMessageDetailProps {
  message: Message
}

export function ParentMessageDetail({ message }: ParentMessageDetailProps) {
  return (
    <div className="p-4 border-b">
      <div className="flex items-start">
        <Avatar className="h-12 w-12 mr-4">
          <AvatarImage src={message.avatar} />
          <AvatarFallback>
            {message.sender
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center">
                <div className="font-medium text-gray-700">{message.sender}</div>
                {message.regarding && (
                  <Badge variant="outline" className="ml-2 bg-blue-50 text-blue-700">
                    {message.regarding}
                  </Badge>
                )}
              </div>
              <div className="text-gray-700 font-medium">{message.subject}</div>
            </div>
            <div className="flex items-center">
              <span className="text-sm text-gray-500 mr-2">{message.time}</span>
              <span className="text-sm text-gray-500">{message.date}</span>
            </div>
          </div>

          <div className="mt-4 text-gray-600 whitespace-pre-line">{message.content}</div>

          {message.attachments && message.attachments.length > 0 && (
            <div className="mt-4">
              <div className="flex items-center text-[#25AAE1] mb-2">
                <Paperclip className="h-4 w-4 mr-1" />
                <span>{message.attachments.length} Attachments</span>
              </div>

              <div className="grid grid-cols-4 gap-2">
                {message.attachments.map((attachment, index) => (
                  <div key={index} className="relative overflow-hidden rounded-md h-20">
                    <img
                      src={attachment || "/placeholder.svg"}
                      alt={`Attachment ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-4 flex justify-end">
            <Button className="bg-[#25AAE1] hover:bg-[#1D8CB3] text-white rounded-full px-6 py-1 h-8">
              <Reply className="h-4 w-4 mr-2" />
              <span>Reply</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
