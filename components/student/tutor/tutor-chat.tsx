"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { Send, Paperclip } from "lucide-react"
import { useChat } from "./chat-context"

export default function TutorChat() {
  const { messages, isTyping, sendMessage } = useChat()
  const [newMessage, setNewMessage] = useState("")
  const [attachment, setAttachment] = useState<File | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isTyping])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (newMessage.trim() || attachment) {
      // In a real app, you would upload the attachment and get a URL
      const attachmentObj = attachment
        ? {

            type: (attachment.type.startsWith("image/") ? "image" : "document") as "image" | "document",
            url: "/placeholder.svg?height=100&width=150",
          }
        : undefined

      sendMessage(newMessage, attachmentObj)
      setNewMessage("")
      setAttachment(null)
    }

  }
  const handleFileClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAttachment(e.target.files[0])
    }
  }

  return (
    <div className="flex flex-col bg-white rounded-lg shadow-md overflow-hidden h-[600px]">
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.isUser ? "justify-end" : "justify-start"}`}>
            {!msg.isUser && (
              <div className="mr-2 flex-shrink-0">
                <Image
                  src="/placeholder.svg?height=40&width=40"
                  width={40}
                  height={40}
                  alt="Junior"
                  className="rounded-full bg-green-200"
                />
              </div>
            )}

            <div
              className={`max-w-[70%] ${
                msg.isUser
                  ? "bg-blue-100 rounded-tl-lg rounded-bl-lg rounded-br-lg"
                  : "bg-green-100 rounded-tr-lg rounded-bl-lg rounded-br-lg"
              } p-3`}
            >
              {!msg.isUser && <div className="font-medium text-sm mb-1">{msg.sender}</div>}
              <p className="text-sm">{msg.content}</p>

              {msg.attachment && (
                <div className="mt-2">
                  <Image
                    src={msg.attachment.url || "/placeholder.svg"}
                    width={150}
                    height={100}
                    alt="Attachment"
                    className="rounded-md"
                  />
                </div>
              )}
            </div>

            {msg.isUser && (
              <div className="ml-2 flex-shrink-0">
                <Image
                  src="/placeholder.svg?height=40&width=40"
                  width={40}
                  height={40}
                  alt="You"
                  className="rounded-full bg-blue-200"
                />
              </div>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center gap-2 text-sm text-gray-500 ml-12">
            <Image
              src="/placeholder.svg?height=24&width=24"
              width={24}
              height={24}
              alt="Junior"
              className="rounded-full bg-green-200"
            />
            <span>Junior is typing...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="p-3 border-t">
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <button type="button" onClick={handleFileClick} className="text-gray-500 hover:text-gray-700">
            <Paperclip size={20} />
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept="image/*,.pdf,.doc,.docx"
          />
          <input
            type="text"
            placeholder="Message..."
            className="flex-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <button
            type="submit"
            className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
            disabled={!newMessage.trim() && !attachment}
          >
            <Send size={20} />
          </button>
        </form>
      </div>
    </div>
  )
}

