import { useState, useEffect, useRef } from 'react';
import { MessageCircle, Send, Minimize2, X, Bot, User, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

type Message = {
  id: string;
  content: string;
  sender: 'user' | 'bot' | 'agent';
  timestamp: Date;
  type?: 'text' | 'quick_reply' | 'typing';
};

type ChatStatus = 'closed' | 'open' | 'connecting' | 'connected';

const QUICK_REPLIES = [
  'How do I create a class?',
  'Gradebook issues',
  'Password reset',
  'Contact human agent'
];

const BOT_RESPONSES = {
  'how do i create a class': 'To create a new class, go to the CLASSES section and click "Add Class". You can fill in class details, schedule, and add students.',
  'gradebook': 'For Gradebook issues, the system automatically calculates weighted averages. Check your grading settings if you need to adjust weightings.',
  'password': 'To reset your password, click on "Forgot Password" on the login page or contact support at support@dreametrix.com',
  'agent': 'Connecting you with a human agent. Please wait...',
  'default': 'I understand you need help. Let me connect you with our support team or you can browse our FAQ section.'
};

export default function LiveChat() {
  const [status, setStatus] = useState<ChatStatus>('closed');
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const openChat = () => {
    setStatus('open');
    setUnreadCount(0);
    if (messages.length === 0) {
      // Welcome message
      const welcomeMessage: Message = {
        id: Date.now().toString(),
        content: 'Hello! I\'m your AI assistant. How can I help you today?',
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
    }
  };

  const closeChat = () => {
    setStatus('closed');
  };

  const minimizeChat = () => {
    setStatus('closed');
  };

  const sendMessage = async (content: string, isQuickReply = false) => {
    if (!content.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate bot response
    setTimeout(() => {
      setIsTyping(false);
      const botResponse = getBotResponse(content.toLowerCase());
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: botResponse,
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
      
      if (status === 'closed') {
        setUnreadCount(prev => prev + 1);
      }
    }, 1000 + Math.random() * 1000);
  };

  const getBotResponse = (input: string): string => {
    if (input.includes('class')) return BOT_RESPONSES['how do i create a class'];
    if (input.includes('gradebook') || input.includes('grade')) return BOT_RESPONSES['gradebook'];
    if (input.includes('password') || input.includes('login')) return BOT_RESPONSES['password'];
    if (input.includes('agent') || input.includes('human')) return BOT_RESPONSES['agent'];
    return BOT_RESPONSES['default'];
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(inputValue);
    }
  };

  if (status === 'closed') {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={openChat}
          className="rounded-full w-14 h-14 shadow-lg hover:shadow-xl transition-all relative"
          size="icon"
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
    <div className="fixed bottom-6 right-6 z-50 w-80 h-96">
      <Card className="h-full flex flex-col shadow-2xl">
        <CardHeader className="flex flex-row items-center justify-between py-3 px-4 bg-primary text-primary-foreground rounded-t-lg">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="font-medium">Support Chat</span>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-6 w-6 text-primary-foreground hover:bg-primary-foreground/20" onClick={minimizeChat}>
              <Minimize2 className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-6 w-6 text-primary-foreground hover:bg-primary-foreground/20" onClick={closeChat}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="flex-1 flex flex-col p-0">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-start gap-2 max-w-[80%] ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                    message.sender === 'user' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-secondary text-secondary-foreground'
                  }`}>
                    {message.sender === 'user' ? <User className="h-3 w-3" /> : <Bot className="h-3 w-3" />}
                  </div>
                  <div className={`px-3 py-2 rounded-lg text-sm ${
                    message.sender === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary text-secondary-foreground'
                  }`}>
                    {message.content}
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="flex items-start gap-2">
                  <div className="w-6 h-6 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center text-xs">
                    <Bot className="h-3 w-3" />
                  </div>
                  <div className="bg-secondary text-secondary-foreground px-3 py-2 rounded-lg text-sm flex items-center gap-1">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    <span>Typing...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Replies */}
          {messages.length === 1 && (
            <div className="px-4 pb-2">
              <div className="flex flex-wrap gap-2">
                {QUICK_REPLIES.map((reply) => (
                  <Button
                    key={reply}
                    variant="outline"
                    size="sm"
                    className="text-xs h-7"
                    onClick={() => sendMessage(reply, true)}
                  >
                    {reply}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-4 border-t">
            <div className="flex gap-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1"
              />
              <Button 
                onClick={() => sendMessage(inputValue)} 
                size="icon"
                disabled={!inputValue.trim()}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}