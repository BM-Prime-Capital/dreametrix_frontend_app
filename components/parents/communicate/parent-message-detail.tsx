"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Paperclip, Reply, X } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"

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

interface Reply {
  id: number
  sender: string
  content: string
  time: string
  avatar: string
}

interface ParentMessageDetailProps {
  message: Message
  replies?: Reply[]
}

export function ParentMessageDetail({ message, replies = [] }: ParentMessageDetailProps) {
  const [isReplying, setIsReplying] = useState(false)
  const [replyContent, setReplyContent] = useState("")
  const [allReplies, setAllReplies] = useState<Reply[]>(replies)

  const handleReplySubmit = () => {
    if (!replyContent.trim()) return
    
    const newReply: Reply = {
      id: Date.now(),
      sender: "You",
      content: replyContent,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      avatar: "/path/to/current/user/avatar.jpg"
    }
    
    setAllReplies([...allReplies, newReply])
    setReplyContent("")
    setIsReplying(false)
  }

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

          {allReplies.length > 0 && (
            <div className="mt-6 space-y-6">
              {allReplies.map((reply) => (
                <div key={reply.id} className="pl-8 border-l-2 border-gray-200">
                  <div className="flex items-start">
                    <Avatar className="h-10 w-10 mr-3">
                      <AvatarImage src={reply.avatar} />
                      <AvatarFallback>
                        {reply.sender
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div className="font-medium text-gray-700">{reply.sender}</div>
                        <span className="text-sm text-gray-500">{reply.time}</span>
                      </div>
                      <div className="mt-2 text-gray-600 whitespace-pre-line">
                        {reply.content}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Reply section */}
          <div className="mt-4 flex justify-end">
            {isReplying ? (
              <div className="w-full bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium text-gray-700">New Reply</h3>
                  <button 
                    onClick={() => setIsReplying(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <Textarea
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder="Type your reply here..."
                  className="min-h-[100px]"
                />
                <div className="flex justify-end mt-2 space-x-2">
                  <Button 
                    variant="outline" 
                    onClick={() => setIsReplying(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    className="bg-[#25AAE1] hover:bg-[#1D8CB3] text-white"
                    onClick={handleReplySubmit}
                  >
                    Send Reply
                  </Button>
                </div>
              </div>
            ) : (
              <Button 
                className="bg-[#25AAE1] hover:bg-[#1D8CB3] text-white rounded-full px-6 py-1 h-8"
                onClick={() => setIsReplying(true)}
              >
                <Reply className="h-4 w-4 mr-2" />
                <span>Reply</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}