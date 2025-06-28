"use client";

import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SendHorizonal, History, CalendarDays, Plus, Trash2, Edit, Check, X, Copy, CopyCheck, Search } from "lucide-react";
import { format } from 'date-fns';
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/use-toast";
import { getConversations, updateConversationTitle, deleteConversation, clearConversations } from "@/services/ai-chat-service";

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
  isNew?: boolean;
};

interface BigBrainProps {
  accessToken: string;
  tenantDomain: string;
}

// Délai d'inactivité avant sauvegarde (30 secondes)
const INACTIVITY_SAVE_DELAY = 30000;

export default function BigBrain({ accessToken, tenantDomain }: BigBrainProps) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [editingConversationId, setEditingConversationId] = useState<string | null>(null);
  const [editedTitle, setEditedTitle] = useState('');
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editedMessageText, setEditedMessageText] = useState('');
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFetchingConversations, setIsFetchingConversations] = useState(false);
  const [isUpdatingTitle, setIsUpdatingTitle] = useState(false);
  const [isDeletingConversation, setIsDeletingConversation] = useState(false);
  const [isClearingHistory, setIsClearingHistory] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const editInputRef = useRef<HTMLInputElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const inactivityTimerRef = useRef<NodeJS.Timeout>();
  const { toast } = useToast();

  // Charger les conversations initiales
  useEffect(() => {
    if (!accessToken || !tenantDomain) return;

    const fetchConversations = async () => {
      setIsFetchingConversations(true);
      try {
        const data = await getConversations(accessToken, tenantDomain);
        
        const transformedConversations = data.results.map((conv: any) => ({
          id: conv.id,
          date: new Date(conv.created_at),
          title: conv.title,
          messages: conv.last_message ? [
            {
              id: conv.last_message.id,
              text: conv.last_message.text,
              sender: conv.last_message.is_user ? "user" : "ai",
              timestamp: new Date(conv.last_message.created_at)
            }
          ] : []
        }));
    
        setConversations(transformedConversations);
    
        if (transformedConversations.length > 0) {
          setActiveConversation(transformedConversations[0].id);
        } else {
          startNewConversation();
        }
        setIsInitialized(true);
      } catch (error) {
        console.error("Failed to fetch conversations:", error);
        startNewConversation();
        setIsInitialized(true);
      } finally {
        setIsFetchingConversations(false);
      }
    };

    fetchConversations();
  }, [accessToken, tenantDomain]);

  // Filtrer les conversations selon le terme de recherche
  const filteredConversations = useMemo(() => {
    return conversations.filter(conv => 
      conv.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conv.messages.some(msg => msg.text.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [conversations, searchTerm]);

  // Scroll vers le bas des messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversations, activeConversation]);

  // Focus sur l'input quand on change de conversation
  useEffect(() => {
    inputRef.current?.focus();
  }, [activeConversation]);

  // Focus sur l'input d'édition de titre
  useEffect(() => {
    if (editingConversationId) {
      editInputRef.current?.focus();
      const conversation = conversations.find(c => c.id === editingConversationId);
      if (conversation) setEditedTitle(conversation.title);
    }
  }, [editingConversationId]);

  // Sauvegarde automatique après inactivité
  const resetInactivityTimer = useCallback(() => {
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
    }

    inactivityTimerRef.current = setTimeout(() => {
      if (activeConversation) {
        const conversation = conversations.find(c => c.id === activeConversation);
        if (conversation && !conversation.isNew) {
          saveConversationToDB(conversation);
        }
      }
    }, INACTIVITY_SAVE_DELAY);
  }, [activeConversation, conversations]);

  // Réinitialiser le timer à chaque interaction
  useEffect(() => {
    resetInactivityTimer();
    return () => {
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
      }
    };
  }, [resetInactivityTimer]);

  // Sauvegarde d'une conversation dans la base de données
  const saveConversationToDB = async (conversation: Conversation) => {
    try {
      const response = await fetch(`${tenantDomain}/api/chat/save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          conversationId: conversation.id,
          title: conversation.title,
          messages: conversation.messages
        })
      });

      if (!response.ok) {
        throw new Error('Failed to save conversation');
      }

      // Mettre à jour le statut isNew si nécessaire
      if (conversation.isNew) {
        setConversations(prev => prev.map(conv => 
          conv.id === conversation.id ? { ...conv, isNew: false } : conv
        ));
      }
    } catch (error) {
      console.error("Auto-save failed:", error);
    }
  };

  // Envoi d'un message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !activeConversation || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: "user",
      timestamp: new Date()
    };

    // Mise à jour locale immédiate
    setConversations(prev => prev.map(conv => 
      conv.id === activeConversation 
        ? { ...conv, messages: [...conv.messages, userMessage] } 
        : conv
    ));
    setInput('');
    resetInactivityTimer();
    
    try {
      setIsLoading(true);
      
      // Préparation de la réponse AI
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

      // Récupération du contexte complet
      const currentConv = conversations.find(c => c.id === activeConversation);
      const allMessages = [...(currentConv?.messages || []), userMessage];

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: allMessages
            .filter(m => m.sender === "user")
            .map(m => ({
              role: 'user',
              content: m.text
            }))
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
        text: "Sorry, an error occurred. Please try again.",
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
      resetInactivityTimer();
    }
  };

  // Régénération d'une réponse
  const regenerateResponse = async (messageId: string) => {
    try {
      setIsLoading(true);
      
      const conversation = conversations.find(c => c.id === activeConversation);
      if (!conversation) return;

      const modifiedMessage = conversation.messages.find(m => m.id === messageId);
      if (!modifiedMessage) return;

      const messageIndex = conversation.messages.findIndex(m => m.id === messageId);
      
      // Garder tout jusqu'au message modifié
      const updatedMessages = conversation.messages.slice(0, messageIndex + 1);
      
      // Mise à jour locale
      setConversations(prev => prev.map(conv => 
        conv.id === activeConversation
          ? { ...conv, messages: updatedMessages }
          : conv
      ));

      // Préparation de la nouvelle réponse AI
      const aiMessageId = Date.now().toString() + '-ai';
      const aiMessage: Message = {
        id: aiMessageId,
        text: '',
        sender: "ai",
        timestamp: new Date()
      };

      setConversations(prev => prev.map(conv => 
        conv.id === activeConversation
          ? { ...conv, messages: [...updatedMessages, aiMessage] }
          : conv
      ));

      // Appel API avec le nouveau contexte
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: updatedMessages
            .filter(m => m.sender === "user")
            .map(m => ({
              role: 'user',
              content: m.text
            }))
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
        text: "Sorry, an error occurred while regenerating the response.",
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
      resetInactivityTimer();
    }
  };

  // Nouvelle conversation
  const startNewConversation = () => {
    const newConversation: Conversation = {
      id: Date.now().toString(),
      date: new Date(),
      title: `New conversation ${conversations.length + 1}`,
      messages: [{
        id: "1",
        text: "Hello! I'm BiG BrA.In, your educational AI assistant. How can I help you today?",
        sender: "ai",
        timestamp: new Date()
      }],
      isNew: true
    };
    setConversations(prev => [newConversation, ...prev]);
    setActiveConversation(newConversation.id);
    setEditingConversationId(null);
    setSearchTerm('');
    resetInactivityTimer();
  };

  // Suppression d'une conversation
  const handleDeleteConversation = async (id: string) => {
    setIsDeletingConversation(true);
    try {
      await deleteConversation(id, accessToken, tenantDomain);
      
      setConversations(prev => prev.filter(conv => conv.id !== id));
      if (activeConversation === id) {
        setActiveConversation(conversations.length > 1 ? 
          conversations.find(conv => conv.id !== id)?.id || null : null);
      }
      setEditingConversationId(null);
    } catch (error) {
      console.error("Failed to delete conversation:", error);
      toast({
        title: "Error",
        description: "Failed to delete conversation",
        variant: "destructive",
      });
    } finally {
      setIsDeletingConversation(false);
    }
  };

  // Édition du titre d'une conversation
  const startEditing = (id: string) => {
    setEditingConversationId(id);
  };

  const cancelEditing = () => {
    setEditingConversationId(null);
  };

  const saveEditing = async () => {
    if (!editingConversationId || !editedTitle.trim()) return;
    
    setIsUpdatingTitle(true);
    try {
      await updateConversationTitle(editingConversationId, editedTitle.trim(), accessToken, tenantDomain);
      
      setConversations(prev => prev.map(conv => 
        conv.id === editingConversationId
          ? { ...conv, title: editedTitle.trim() }
          : conv
      ));
      setEditingConversationId(null);
      resetInactivityTimer();
    } catch (error) {
      console.error("Failed to update conversation title:", error);
      toast({
        title: "Error",
        description: "Failed to update conversation title",
        variant: "destructive",
      });
    } finally {
      setIsUpdatingTitle(false);
    }
  };

  // Effacer l'historique
  const handleClearHistory = async () => {
    setIsClearingHistory(true);
    try {
      await clearConversations(accessToken, tenantDomain);
      
      const newConversation: Conversation = {
        id: Date.now().toString(),
        date: new Date(),
        title: "New conversation",
        messages: [{
          id: "1",
          text: "Hello! I'm BiG BrA.In, your educational AI assistant. How can I help you today?",
          sender: "ai",
          timestamp: new Date()
        }],
        isNew: true
      };
      
      setConversations([newConversation]);
      setActiveConversation(newConversation.id);
      setEditingConversationId(null);
      setSearchTerm('');
    } catch (error) {
      console.error("Failed to clear conversations:", error);
      toast({
        title: "Error",
        description: "Failed to clear conversations",
        variant: "destructive",
      });
    } finally {
      setIsClearingHistory(false);
    }
  };

  // Copie d'un message dans le presse-papier
  const copyToClipboard = (text: string, messageId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedMessageId(messageId);
    toast({
      title: "Message copié",
      description: "Le message a été copié dans le presse-papier",
    });
    setTimeout(() => setCopiedMessageId(null), 2000);
  };

  // Édition d'un message
  const startEditingMessage = (messageId: string, currentText: string) => {
    setEditingMessageId(messageId);
    setEditedMessageText(currentText);
  };

  const cancelEditingMessage = () => {
    setEditingMessageId(null);
    setEditedMessageText('');
  };

  const saveEditedMessage = () => {
    if (!editingMessageId || !editedMessageText.trim()) return;

    setConversations(prev => prev.map(conv => 
      conv.id === activeConversation
        ? {
            ...conv,
            messages: conv.messages.map(msg =>
              msg.id === editingMessageId
                ? { ...msg, text: editedMessageText.trim() }
                : msg
            )
          }
        : conv
    ));
    cancelEditingMessage();
    resetInactivityTimer();
    
    // Si c'est un message utilisateur, régénérer la réponse
    if (conversations.find(c => c.id === activeConversation)?.messages.find(m => m.id === editingMessageId)?.sender === "user") {
      regenerateResponse(editingMessageId);
    }
  };

  // Messages de la conversation active
  const currentMessages = conversations.find(c => c.id === activeConversation)?.messages || [];

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50/30 to-gray-50/20 w-full">
      {/* Enhanced Sidebar */}
      <div className="w-80 bg-white/80 backdrop-blur-sm border-r border-gray-200/60 flex flex-col shadow-xl">
        <div className="p-6 border-b border-gray-200/60 bg-[#79bef2] rounded-2xl mx-6 mt-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold flex items-center text-white">
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm mr-3">
                <History className="h-5 w-5 text-white" />
              </div>
              <span>BiG BrA.In</span>
            </h3>
            <Button 
              onClick={startNewConversation}
              className="bg-white/20 hover:bg-white/30 text-white border-white/30 rounded-xl backdrop-blur-sm"
              size="sm"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Chat
            </Button>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/70" />
            <Input
              ref={searchInputRef}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search conversations..."
              className="pl-9 bg-white/20 border-white/30 text-white placeholder:text-white/70 rounded-xl backdrop-blur-sm focus:bg-white/30"
            />
          </div>

          <Button
            onClick={handleClearHistory}
            variant="ghost"
            size="sm"
            className="group relative mt-4 text-white/80 hover:bg-white/20 rounded-xl backdrop-blur-sm"
            disabled={isClearingHistory || conversations.length === 0}
          >
            {isClearingHistory ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Clearing...
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4" />
                <span className="ml-2">Clear History</span>
              </>
            )}
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {isFetchingConversations ? (
            <div className="flex items-center justify-center h-full">
              <div className="flex space-x-2">
                <div className="w-3 h-3 rounded-full bg-[#3e81d4] animate-bounce" />
                <div className="w-3 h-3 rounded-full bg-[#3e81d4] animate-bounce delay-100" />
                <div className="w-3 h-3 rounded-full bg-[#3e81d4] animate-bounce delay-200" />
              </div>
            </div>
          ) : (
            filteredConversations.map((conversation) => (
              <div
                key={conversation.id}
                className={cn(
                  "p-4 hover:bg-indigo-50/50 cursor-pointer transition-all duration-200 border-b border-gray-100 group rounded-lg mx-2 my-1",
                  activeConversation === conversation.id ? "bg-gradient-to-r from-indigo-100 to-purple-100 border-l-4 border-l-indigo-500 shadow-md" : ""
                )}
                onClick={() => {
                  setActiveConversation(conversation.id);
                  setEditingConversationId(null);
                  resetInactivityTimer();
                }}
              >
                {editingConversationId === conversation.id ? (
                  <div className="flex flex-col gap-2">
                    <Input
                      ref={editInputRef}
                      value={editedTitle}
                      onChange={(e) => setEditedTitle(e.target.value)}
                      className="w-full"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') saveEditing();
                        if (e.key === 'Escape') cancelEditing();
                      }}
                    />
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={(e) => {
                          e.stopPropagation();
                          cancelEditing();
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant={editedTitle.trim() ? "default" : "ghost"}
                        size="sm" 
                        className={cn(
                          editedTitle.trim() ? "bg-[#3e81d4] hover:bg-[#3e81d4]/90" : "bg-[#3e81d4]/30 text-white/50",
                          "transition-colors"
                        )}
                        onClick={(e) => {
                          e.stopPropagation();
                          saveEditing();
                        }}
                        disabled={!editedTitle.trim() || isUpdatingTitle}
                      >
                        {isUpdatingTitle ? (
                          <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                        ) : (
                          <Check className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="relative">
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium text-gray-900 truncate pr-2">
                        {conversation.title}
                      </h4>
                      <span className="text-xs text-gray-500 whitespace-nowrap">
                        {format(conversation.date, 'HH:mm')}
                      </span>
                    </div>
                    <div className="flex items-center mt-1">
                      <CalendarDays className="h-3 w-3 mr-1 text-gray-400" />
                      <span className="text-xs text-gray-500">
                        {format(conversation.date, 'PP')}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 truncate mt-1">
                      {conversation.messages[0]?.text || "No messages"}
                    </p>
                    
                    <div className="absolute top-2 right-2 flex opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-gray-500 hover:text-[#3e81d4]"
                        onClick={(e) => {
                          e.stopPropagation();
                          startEditing(conversation.id);
                        }}
                        disabled={isUpdatingTitle}
                      >
                        {editingConversationId === conversation.id && isUpdatingTitle ? (
                          <svg className="animate-spin h-3 w-3 text-[#3e81d4]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                        ) : (
                          <Edit className="h-3 w-3" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-gray-500 hover:text-red-500"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteConversation(conversation.id);
                        }}
                        disabled={isDeletingConversation}
                      >
                        {isDeletingConversation && activeConversation === conversation.id ? (
                          <svg className="animate-spin h-3 w-3 text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                        ) : (
                          <Trash2 className="h-3 w-3" />
                        )}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Enhanced Main Chat Area */}
      <div className="flex-1 flex flex-col">
        <div className="border-b border-gray-200/60 p-6 bg-white/80 backdrop-blur-sm flex items-center justify-between shadow-sm mx-6 mt-2 rounded-t-2xl">
          <div>
            <h2 className="text-2xl font-bold text-white">
              {conversations.find(c => c.id === activeConversation)?.title || "New Conversation"}
            </h2>
            <p className="text-sm text-gray-500 mt-1">AI-powered educational assistant</p>
          </div>
          <div className="text-sm text-gray-500 flex items-center bg-gray-50 px-3 py-2 rounded-xl">
            <CalendarDays className="h-4 w-4 mr-2" />
            {format(new Date(), 'MMM d, yyyy')}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 bg-gradient-to-b from-gray-50/50 to-white/50 mx-6">
          {currentMessages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-gray-400">
              <div className="w-20 h-20 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-10 h-10 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <p className="text-lg font-medium text-gray-600">Start a new conversation with BiG BrA.In</p>
              <p className="text-sm text-gray-400 mt-2">Your AI educational assistant is ready to help</p>
            </div>
          )}

          {currentMessages.map((message) => (
            <div key={message.id} className={cn(
              "flex mb-4 group",
              message.sender === "user" ? "justify-end" : "justify-start"
            )}>
              <div className="flex max-w-[85%]">
                {message.sender === "ai" && (
                  <div className="h-10 w-10 mr-3 mt-1 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                )}
                <div className="relative">
                  {editingMessageId === message.id ? (
                    <div className="flex flex-col gap-2">
                      <Input
                        value={editedMessageText}
                        onChange={(e) => setEditedMessageText(e.target.value)}
                        className="w-full"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') saveEditedMessage();
                          if (e.key === 'Escape') cancelEditingMessage();
                        }}
                      />
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={cancelEditingMessage}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="default"
                          size="sm" 
                          className="bg-[#3e81d4] hover:bg-[#3e81d4]/90"
                          onClick={saveEditedMessage}
                          disabled={!editedMessageText.trim()}
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className={cn(
                        "px-4 py-3 rounded-2xl shadow-sm",
                        message.sender === "user" 
                          ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-br-sm" 
                          : "bg-white/80 backdrop-blur-sm text-gray-800 border border-gray-200/60 rounded-bl-sm"
                      )}>
                        <p className="break-words whitespace-pre-wrap">{message.text}</p>
                      </div>
                      <div className={cn(
                        "text-xs mt-1 flex items-center",
                        message.sender === "user" ? "justify-end" : "justify-start"
                      )}>
                        <span className={cn(
                          message.sender === "user" ? "text-gray-300" : "text-gray-400"
                        )}>
                          {format(message.timestamp, 'HH:mm')}
                        </span>
                        <div className="ml-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          {message.sender === "user" && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className={cn(
                                "h-5 w-5",
                                message.sender === "user" 
                                  ? "text-gray-300 hover:text-white" 
                                  : "text-gray-400 hover:text-gray-600"
                              )}
                              onClick={() => startEditingMessage(message.id, message.text)}
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            className={cn(
                              "h-5 w-5",
                              message.sender === "user" 
                                ? "text-gray-300 hover:text-white" 
                                : "text-gray-400 hover:text-gray-600"
                            )}
                            onClick={() => copyToClipboard(message.text, message.id)}
                          >
                            {copiedMessageId === message.id ? (
                              <CopyCheck className="h-3 w-3 text-green-500" />
                            ) : (
                              <Copy className="h-3 w-3" />
                            )}
                          </Button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start mb-4">
              <div className="flex max-w-[85%]">
                <div className="h-10 w-10 mr-3 mt-1 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <div className="bg-white/80 backdrop-blur-sm text-gray-800 rounded-2xl px-4 py-3 border border-gray-200/60 rounded-bl-sm shadow-sm">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" />
                    <div className="w-2 h-2 rounded-full bg-purple-500 animate-bounce delay-100" />
                    <div className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce delay-200" />
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="border-t border-gray-200/60 p-6 bg-white/80 backdrop-blur-sm mx-6 pb-8 rounded-b-2xl">
          <form onSubmit={handleSendMessage} className="flex gap-4 items-end">
            <div className="flex-1 relative">
              <Input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask BiG BrA.In anything about education..."
                className="w-full rounded-2xl px-6 py-4 text-base border-gray-300 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 shadow-sm"
                disabled={isLoading}
              />
              {input.trim() && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                </div>
              )}
            </div>
            <Button 
              type="submit" 
              disabled={!input.trim() || isLoading}
              className={cn(
                "rounded-2xl h-14 w-14 p-0 transition-all duration-200 shadow-lg",
                input.trim() && !isLoading 
                  ? "bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 hover:scale-105" 
                  : "bg-gray-300 cursor-not-allowed"
              )}
              size="icon"
            >
              {isLoading ? (
                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <SendHorizonal className="h-5 w-5" />
              )}
            </Button>
          </form>
          <p className="text-xs text-gray-400 mt-3 text-center">
            BiG BrA.In can make mistakes. Consider checking important information.
          </p>
        </div>
      </div>
    </div>
  );
}