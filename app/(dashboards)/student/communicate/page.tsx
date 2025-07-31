"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { MessageList } from "../../../../components/student/communicate/message-list"
import { ComposeDialog } from "../../../../components/student/communicate/compose-dialog"

export default function CommunicatePage() {
    const [activeTab, setActiveTab] = useState<"teachers" | "whole-class" | "other-groups">("teachers")
    const [isComposeOpen, setIsComposeOpen] = useState(false)
    const [selectedMessageId, setSelectedMessageId] = useState<number | null>(null)
  
    const handleMessageClick = (messageId: number) => {
      setSelectedMessageId(messageId === selectedMessageId ? null : messageId)
    }
  
    return (
      <section className="flex flex-col gap-4 w-full mx-auto p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-success text-xl font-bold">COMMUNICATE</h1>
        </div>
  
        <div className="flex gap-4">
          <button
            className="bg-primary text-white px-6 py-3 rounded-md flex items-center gap-2 hover:bg-primary-hover transition-colors"
            onClick={() => setIsComposeOpen(true)}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M19 4H5C3.89543 4 3 4.89543 3 6V18C3 19.1046 3.89543 20 5 20H19C20.1046 20 21 19.1046 21 18V6C21 4.89543 20.1046 4 19 4Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path d="M12 12H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M8 12H8.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M16 12H16.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span>Compose</span>
          </button>
        </div>
  
        <div className="flex">
          <button
            className={`flex-1 py-4 flex flex-col items-center ${activeTab === "teachers" ? "bg-accent/10" : "bg-muted/30"}`}
            onClick={() => setActiveTab("teachers")}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-primary mb-1"
            >
              <path
                d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="text-foreground font-medium">TEACHERS</span>
          </button>
          <button
            className={`flex-1 py-4 flex flex-col items-center ${activeTab === "whole-class" ? "bg-accent/10" : "bg-card"}`}
            onClick={() => setActiveTab("whole-class")}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-primary mb-1"
            >
              <path
                d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="text-foreground font-medium">WHOLE CLASS</span>
          </button>
          <button
            className={`flex-1 py-4 flex flex-col items-center ${activeTab === "other-groups" ? "bg-accent/10" : "bg-muted/30"}`}
            onClick={() => setActiveTab("other-groups")}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-success mb-1"
            >
              <path
                d="M16 21V19C16 17.9391 15.5786 16.9217 14.8284 16.1716C14.0783 15.4214 13.0609 15 12 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M8.5 11C10.7091 11 12.5 9.20914 12.5 7C12.5 4.79086 10.7091 3 8.5 3C6.29086 3 4.5 4.79086 4.5 7C4.5 9.20914 6.29086 11 8.5 11Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M17 11L19 13L23 9"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="text-foreground font-medium">OTHER GROUPS</span>
          </button>
        </div>
  
        <Card className="rounded-lg shadow-sm p-0 overflow-hidden border">
          <MessageList activeTab={activeTab} selectedMessageId={selectedMessageId} onMessageClick={handleMessageClick} />
        </Card>
  
        <ComposeDialog isOpen={isComposeOpen} onClose={() => setIsComposeOpen(false)} />
      </section>
    )
  }
  

