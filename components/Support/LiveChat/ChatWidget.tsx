'use client';

import { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Bot, User, MinusCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';

type Message = {
  id: string;
  content: string;
  sender: 'user' | 'agent' | 'bot';
  timestamp: Date;
  agentName?: string;
};

type ChatStatus = 'online' | 'away' | 'offline';

const COMMON_QUESTIONS = [
  "How do I create a new class?",
  "How to reset my password?",
  "Where can I find my gradebook?",
  "How to message parents?",
];

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [chatStatus, setChatStatus] = useState<ChatStatus>('online');
  const [unreadCount, setUnreadCount] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Welcome message
      setMessages([{
        id: '1',
        content: "Hello! I'm your AI assistant. How can I help you today?",
        sender: 'bot',
        timestamp: new Date(),
      }]);
    }
  }, [isOpen, messages.length]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (!isOpen && messages.length > 1) {
      setUnreadCount(prev => prev + 1);
    } else if (isOpen) {
      setUnreadCount(0);
    }
  }, [messages, isOpen]);

  const simulateAgentResponse = async (userMessage: string) => {
    setIsTyping(true);
    
    // Simulate delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    let response = "I understand your question. Let me help you with that.";
    
    // Simple AI responses based on keywords
    const lowerMessage = userMessage.toLowerCase();
    if (lowerMessage.includes('class') || lowerMessage.includes('create')) {
      response = "To create a new class, go to the 'CLASSES' section and click 'Add Class'. Fill in the class details including name, subject, and schedule. Would you like me to guide you through this process?";
    } else if (lowerMessage.includes('password') || lowerMessage.includes('reset')) {
      response = "To reset your password, click on 'Forgot Password' on the login page. You'll receive an email with reset instructions. If you don't see it, please check your spam folder.";
    } else if (lowerMessage.includes('gradebook') || lowerMessage.includes('grade')) {
      response = "You can find your gradebook in the main navigation menu. It automatically calculates weighted averages based on your grading system. Need help setting up grading categories?";
    } else if (lowerMessage.includes('parent') || lowerMessage.includes('message')) {
      response = "To message parents, go to the 'COMMUNICATE' section and use the 'Message Parents' feature. You can filter by students with missing work and include assignment details automatically.";
    }

    const newMessage: Message = {
      id: Date.now().toString(),
      content: response,
      sender: Math.random() > 0.3 ? 'bot' : 'agent',
      timestamp: new Date(),
      agentName: Math.random() > 0.3 ? undefined : 'Sarah Johnson',
    };

    setMessages(prev => [...prev, newMessage]);
    setIsTyping(false);
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');

    // Simulate response
    await simulateAgentResponse(inputValue);
  };

  const handleQuickQuestion = (question: string) => {
    setInputValue(question);
  };

  const getStatusColor = (status: ChatStatus) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'away': return 'bg-yellow-500';
      case 'offline': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: ChatStatus) => {
    switch (status) {
      case 'online': return 'Available';
      case 'away': return 'Away';
      case 'offline': return 'Offline';
      default: return 'Unknown';
    }
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          size="lg"
          className="rounded-full h-14 w-14 shadow-lg hover:shadow-xl transition-all duration-200 relative"
        >
          <MessageCircle className="h-6 w-6" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 flex items-center justify-center text-xs">
              {unreadCount}
            </Badge>
          )}
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className={`bg-white rounded-lg shadow-2xl border transition-all duration-300 ${
        isMinimized ? 'w-80 h-16' : 'w-96 h-[600px]'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-primary text-white rounded-t-lg">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className={`w-3 h-3 rounded-full ${getStatusColor(chatStatus)}`} />
            </div>
            <div>
              <h3 className="font-semibold text-sm">Support Chat</h3>
              <p className="text-xs opacity-90">{getStatusText(chatStatus)}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMinimized(!isMinimized)}
              className="text-white hover:bg-white/20 h-8 w-8 p-0"
            >
              <MinusCircle className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-white/20 h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* Messages */}
            <ScrollArea className="h-96 p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`flex items-start gap-2 max-w-[80%] ${
                      message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
                    }`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        message.sender === 'user' 
                          ? 'bg-primary text-white' 
                          : message.sender === 'bot'
                          ? 'bg-blue-100 text-blue-600'
                          : 'bg-green-100 text-green-600'
                      }`}>
                        {message.sender === 'user' ? (
                          <User className="h-4 w-4" />
                        ) : message.sender === 'bot' ? (
                          <Bot className="h-4 w-4" />
                        ) : (
                          <span className="text-xs font-semibold">
                            {message.agentName?.charAt(0)}
                          </span>
                        )}
                      </div>
                      <div className={`rounded-lg p-3 ${
                        message.sender === 'user'
                          ? 'bg-primary text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}>
                        <p className="text-sm">{message.content}</p>
                        <p className={`text-xs mt-1 ${
                          message.sender === 'user' ? 'text-white/70' : 'text-gray-500'
                        }`}>
                          {message.timestamp.toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                          {message.agentName && (
                            <span className="ml-2">• {message.agentName}</span>
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                        <Bot className="h-4 w-4 text-gray-600" />
                      </div>
                      <div className="bg-gray-100 rounded-lg p-3">
                        <div className="flex items-center gap-1">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span className="text-sm text-gray-600">Typing...</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Quick Questions */}
            {messages.length === 1 && (
              <div className="px-4 py-2 border-t bg-gray-50">
                <p className="text-xs text-gray-600 mb-2">Quick questions:</p>
                <div className="flex flex-wrap gap-2">
                  {COMMON_QUESTIONS.slice(0, 2).map((question, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuickQuestion(question)}
                      className="text-xs h-7"
                    >
                      {question}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
<div className="p-4 border-t bg-white rounded-b-lg">
  <div className="flex gap-2 items-center">
    <Input
      value={inputValue}
      onChange={(e) => setInputValue(e.target.value)}
      onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
      placeholder="Type your message..."
      className="flex-1 text-sm rounded-lg border-gray-300 focus:ring-2 focus:ring-primary"
    />
    <Button 
      onClick={handleSendMessage} 
      size="sm" 
      className="px-3 rounded-lg"
    >
      <Send className="h-4 w-4" />
    </Button>
  </div>
</div>

          </>
        )}
      </div>
    </div>
  );
}