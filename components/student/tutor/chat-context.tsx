"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

type Attachment = {
  type: "image" | "document"
  url: string
}

type Message = {
  id: string
  sender: string
  content: string
  isUser: boolean
  timestamp: Date
  attachment?: Attachment
}

type ChatContextType = {
  messages: Message[]
  isTyping: boolean
  sendMessage: (content: string, attachment?: Attachment) => void
}

const ChatContext = createContext<ChatContextType | undefined>(undefined)

export function ChatProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: "Junior",
      content: "Hello John! My name is Junior. I'm your virtual tutor. How can I help you?",
      isUser: false,
      timestamp: new Date(),
    },
    {
      id: "2",
      sender: "You",
      content: "I need help with this Lorem ipsum",
      isUser: true,
      timestamp: new Date(Date.now() - 60000),
      attachment: {
        type: "image",
        url: "/placeholder.svg?height=100&width=150",
      },
    },
  ])
  const [isTyping, setIsTyping] = useState(false)

  const sendMessage = (content: string, attachment?: Attachment) => {
    // Create user message
    const userMessage: Message = {
      id: Date.now().toString(),
      sender: "You",
      content: content || "",
      isUser: true,
      timestamp: new Date(),
      attachment,
    }

    setMessages((prev) => [...prev, userMessage])

    // Simulate tutor typing
    setIsTyping(true)

    // Generate tutor response after delay
    setTimeout(() => {
      setIsTyping(false)

      // Add tutor response
      const tutorResponse: Message = {
        id: (Date.now() + 1).toString(),
        sender: "Junior",
        content: getTutorResponse(content),
        isUser: false,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, tutorResponse])
    }, 2000)
  }

  // Generate appropriate tutor responses based on user input
  const getTutorResponse = (userMessage: string): string => {
    const lowerCaseMessage = userMessage.toLowerCase()

    if (lowerCaseMessage.includes("hello") || lowerCaseMessage.includes("hi")) {
      return "Hello! How can I help you with your studies today?"
    } else if (lowerCaseMessage.includes("math") || lowerCaseMessage.includes("mathematics")) {
      return "I'd be happy to help with your math problems. What specific topic are you working on?"
    } else if (lowerCaseMessage.includes("science")) {
      return "Science is a fascinating subject! Which area of science do you need help with - biology, chemistry, physics?"
    } else if (lowerCaseMessage.includes("homework")) {
      return "I'm here to help with your homework. Could you share the specific assignment or question you're working on?"
    } else if (lowerCaseMessage.includes("thank")) {
      return "You're welcome! Feel free to ask if you have any other questions."
    } else if (userMessage.trim() === "") {
      return "I see you've shared a document. Let me take a look at it and help you with your question."
    } else {
      return (
        "I understand your question about " +
        (userMessage || "Lorem ipsum") +
        ". Let me help you with that. Could you provide more details so I can give you a more specific answer?"
      )
    }
  }

  return <ChatContext.Provider value={{ messages, isTyping, sendMessage }}>{children}</ChatContext.Provider>
}

export function useChat() {
  const context = useContext(ChatContext)
  if (context === undefined) {
    throw new Error("useChat must be used within a ChatProvider")
  }
  return context
}

