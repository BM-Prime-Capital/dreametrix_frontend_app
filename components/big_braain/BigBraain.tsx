"use client";

import { useState, useEffect, useRef } from 'react';
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SendHorizonal, History, CalendarDays } from "lucide-react";
import { format } from 'date-fns';

type Message = {
  id: string;
  text: string;
  sender: "user" | "ai";
  timestamp: Date;
};

type Conversation = {
  id: string;
  date: Date;
  title: string;
  messages: Message[];
};

export default function BigBraain() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const demoConversations: Conversation[] = [
      {
        id: "1",
        date: new Date(2023, 10, 15),
        title: "Course Planning",
        messages: [{
          id: "2-1",
          text: "Hello! I'm BIG BRAA.I.N, your educational AI assistant.",
          sender: "ai",
          timestamp: new Date()
        }]
      },
      {
        id: "2",
        date: new Date(),
        title: "New conversation",
        messages: [{
          id: "2-1",
          text: "Hello! I'm BIG BRAA.I.N, your educational AI assistant. How can I help you today?",
          sender: "ai",
          timestamp: new Date()
        }]
      }
    ];
    setConversations(demoConversations);
    setActiveConversation(demoConversations[1].id);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversations, activeConversation]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !activeConversation) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: "user",
      timestamp: new Date()
    };

    setConversations(prev => prev.map(conv => 
      conv.id === activeConversation 
        ? { ...conv, messages: [...conv.messages, userMessage] } 
        : conv
    ));
    setInput('');
    
    try {
      setIsLoading(true);
      
      const aiMessageId = Date.now().toString() + '-ai';
      const aiMessage: Message = {
        id: aiMessageId,
        text: '',
        sender: "ai",
        timestamp: new Date()
      };

      setConversations(prev => prev.map(conv => 
        conv.id === activeConversation
          ? { ...conv, messages: [...conv.messages, aiMessage] }
          : conv
      ));

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            {
              role: 'user',
              content: input
            }
          ]
        })
      });

      if (!response.ok) throw new Error('Network response was not ok');

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      
      if (!reader) throw new Error('No reader available');

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        
        setConversations(prev => prev.map(conv => 
          conv.id === activeConversation
            ? {
                ...conv,
                messages: conv.messages.map(msg => 
                  msg.id === aiMessageId
                    ? { ...msg, text: msg.text + chunk }
                    : msg
                )
              }
            : conv
        ));
      }
    } catch (error) {
      console.error('Error:', error);
      const errorMessage: Message = {
        id: Date.now().toString(),
        text: "Sorry, an error occurred.",
        sender: "ai",
        timestamp: new Date()
      };
      setConversations(prev => prev.map(conv => 
        conv.id === activeConversation 
          ? { ...conv, messages: [...conv.messages, errorMessage] } 
          : conv
      ));
    } finally {
      setIsLoading(false);
    }
  };

  const startNewConversation = () => {
    const newConversation: Conversation = {
      id: Date.now().toString(),
      date: new Date(),
      title: `New conversation`,
      messages: [{
        id: "1",
        text: "Hello! I'm BIG BRAA.I.N, your educational AI assistant.",
        sender: "ai",
        timestamp: new Date()
      }]
    };
    setConversations(prev => [newConversation, ...prev]);
    setActiveConversation(newConversation.id);
  };

  const currentMessages = conversations.find(c => c.id === activeConversation)?.messages || [];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Main Chat Area - Largeur fixe */}
      <div className="flex flex-col flex-[2] min-w-[600px] border-r">
        <div className="border-b p-4 bg-white">
          <h2 className="text-xl font-semibold">
            {conversations.find(c => c.id === activeConversation)?.title || "New Conversation"}
          </h2>
        </div>

        <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
          {currentMessages.map((message) => (
            <div key={message.id} className="mb-4">
              <div className={`w-full ${message.sender === "user" ? "pr-4 text-right" : "pl-4 text-left"}`}>
                <div 
                  className={`inline-block w-[85%] max-w-[85%] px-4 py-2 rounded-lg ${
                    message.sender === "user" 
                      ? "bg-blue-600 text-white" 
                      : "bg-white text-gray-800 border"
                  }`}
                >
                  <p className="break-words whitespace-pre-wrap">{message.text}</p>
                  <p className="text-xs opacity-75 mt-1">
                    {format(message.timestamp, 'HH:mm')}
                  </p>
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start mb-4">
              <div className="bg-white text-gray-800 rounded-lg px-4 py-2 border">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce" />
                  <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce delay-100" />
                  <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce delay-200" />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="border-t p-4 bg-white">
          <form onSubmit={handleSendMessage} className="flex space-x-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 min-w-[400px]"
            />
            <Button type="submit" disabled={isLoading}>
              <SendHorizonal className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </div>

      {/* Conversation History - Largeur fixe */}
      <div className="w-[320px] bg-white border-l flex-shrink-0">
        <div className="p-4 border-b">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold flex items-center">
              <History className="h-5 w-5 mr-2" />
              History
            </h3>
            <Button 
              onClick={startNewConversation}
              variant="outline"
              size="sm"
            >
              New
            </Button>
          </div>
        </div>

        <div className="divide-y overflow-y-auto h-[calc(100vh-120px)]">
          {conversations.map((conversation) => (
            <div
              key={conversation.id}
              className={`p-3 hover:bg-gray-50 cursor-pointer ${
                activeConversation === conversation.id ? "bg-blue-50" : ""
              }`}
              onClick={() => setActiveConversation(conversation.id)}
            >
              <div className="text-sm text-gray-500 mb-1 flex items-center">
                <CalendarDays className="h-4 w-4 mr-1" />
                {format(conversation.date, 'PP')}
              </div>
              <h4 className="font-medium truncate">{conversation.title}</h4>
              <p className="text-sm text-gray-500 truncate">
                {conversation.messages[0]?.text || "Aucun message"}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}