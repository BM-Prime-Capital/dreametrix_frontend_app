"use client"

import type React from "react"

import { useState } from "react"
import { Send } from "lucide-react"

export default function MessageInput() {
  const [message, setMessage] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (message.trim()) {
      // Handle sending message
      console.log("Sending message:", message)
      setMessage("")
    }
  }

  return (
    <div className="p-3 border-t bg-white">
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <input
          type="text"
          placeholder="Message..."
          className="flex-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
          disabled={!message.trim()}
        >
          <Send size={20} />
        </button>
      </form>
    </div>
  )
}

