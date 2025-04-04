"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

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

interface MessageDetailProps {
  message: Message
}

export function MessageDetail({ message }: MessageDetailProps) {
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
              <div className="font-medium text-gray-700">{message.sender}</div>
              <div className="text-gray-700 font-medium">{message.subject}</div>
            </div>
            <div className="flex items-center">
              <span className="text-sm text-gray-500 mr-2">{message.time}</span>
              <span className="text-sm text-gray-500">{message.date}</span>
            </div>
          </div>

          <div className="mt-2 text-gray-600">{message.content}</div>

          {message.attachments && message.attachments.length > 0 && (
            <div className="mt-4">
              <div className="flex items-center text-[#25AAE1] mb-2">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="mr-1"
                >
                  <path
                    d="M21.44 11.05L12.25 20.24C11.1242 21.3658 9.59723 21.9983 8.005 21.9983C6.41277 21.9983 4.88584 21.3658 3.76 20.24C2.63416 19.1142 2.00166 17.5872 2.00166 15.995C2.00166 14.4028 2.63416 12.8758 3.76 11.75L12.33 3.18C13.0806 2.42925 14.0991 2.00128 15.16 2.00128C16.2209 2.00128 17.2394 2.42925 17.99 3.18C18.7406 3.93075 19.1686 4.94924 19.1686 6.01C19.1686 7.07076 18.7406 8.08925 17.99 8.84L9.41 17.41C9.03472 17.7853 8.52573 17.9936 7.995 17.9936C7.46427 17.9936 6.95528 17.7853 6.58 17.41C6.20472 17.0347 5.99642 16.5257 5.99642 15.995C5.99642 15.4643 6.20472 14.9553 6.58 14.58L15.07 6.1"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span>{message.attachments.length} Attachments</span>
              </div>

              <div className="grid grid-cols-4 gap-2">
                {message.attachments.map((attachment, index) => (
                  <div key={index} className="relative overflow-hidden rounded-md h-20">
                    <img
                      src={attachment || "https://placehold.co/400x300/e3f2f9/25aae1?text=Attachment"}
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
              <span className="mr-1">Reply</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M9 17L4 12M4 12L9 7M4 12H20"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  transform="rotate(180 12 12)"
                />
              </svg>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

