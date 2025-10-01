"use client";

import React, { useState } from "react";
import { useChatRooms, useChatMessages } from "@/hooks/useChat";
import {
  EnhancedChatRoom,
  EnhancedChatMessage,
  ChatParticipant,
} from "@/types/chat";
import { Button } from "@/ui/Button";

interface ChatInterfaceProps {
  className?: string;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ className = "" }) => {
  const [newMessage, setNewMessage] = useState("");
  const [newRoomName, setNewRoomName] = useState("");
  const [showCreateRoom, setShowCreateRoom] = useState(false);

  const {
    rooms,
    selectedRoom,
    setSelectedRoom,
    loading: roomsLoading,
    error: roomsError,
    fetchRooms,
    createRoom,
    // updateRoom,
    // deleteRoom,
  } = useChatRooms();

  const {
    messages,
    loading: messagesLoading,
    error: messagesError,
    fetchMessages,
    sendMessage,
    // updateMessage,
    // deleteMessage,
  } = useChatMessages(selectedRoom?.id || null);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedRoom) return;

    try {
      await sendMessage(newMessage.trim());
      setNewMessage("");
    } catch (error) {
      console.error("Erreur lors de l'envoi du message:", error);
    }
  };

  const handleCreateRoom = async () => {
    if (!newRoomName.trim()) return;

    try {
      await createRoom(newRoomName.trim());
      setNewRoomName("");
      setShowCreateRoom(false);
    } catch (error) {
      console.error("Erreur lors de la création de la room:", error);
    }
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatParticipantName = (participant: ChatParticipant) => {
    return participant.name;
  };

  const getStatusColor = (status: ChatParticipant["status"]) => {
    switch (status) {
      case "online":
        return "bg-green-500";
      case "away":
        return "bg-yellow-500";
      case "offline":
        return "bg-gray-400";
      default:
        return "bg-gray-400";
    }
  };

  return (
    <div className={`chat-interface flex h-full ${className}`}>
      {/* Liste des salles de chat */}
      <div className="w-1/3 border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Conversations</h2>
            <Button
              onClick={() => setShowCreateRoom(!showCreateRoom)}
              className="text-sm"
            >
              + Nouvelle
            </Button>
          </div>

          {showCreateRoom && (
            <div className="mb-4 p-3 bg-gray-50 rounded">
              <input
                type="text"
                value={newRoomName}
                onChange={(e) => setNewRoomName(e.target.value)}
                placeholder="Nom de la conversation..."
                className="w-full p-2 border border-gray-300 rounded mb-2"
                onKeyPress={(e) => e.key === "Enter" && handleCreateRoom()}
              />
              <div className="flex gap-2">
                <Button onClick={handleCreateRoom} className="text-sm">
                  Créer
                </Button>
                <Button
                  onClick={() => setShowCreateRoom(false)}
                  className="text-sm bg-gray-500"
                >
                  Annuler
                </Button>
              </div>
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto">
          {roomsLoading ? (
            <div className="p-4 text-gray-500">Chargement...</div>
          ) : roomsError ? (
            <div className="p-4 text-red-500">Erreur: {roomsError}</div>
          ) : rooms.length === 0 ? (
            <div className="p-4 text-gray-500">Aucune conversation</div>
          ) : (
            rooms.map((room) => (
              <div
                key={room.id}
                onClick={() => setSelectedRoom(room)}
                className={`p-3 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                  selectedRoom?.id === room.id
                    ? "bg-blue-50 border-l-4 border-l-blue-500"
                    : ""
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-medium text-sm">{room.name}</h3>
                    <p className="text-xs text-gray-500 mt-1">{room.details}</p>
                    {room.last_message && (
                      <p className="text-xs text-gray-600 mt-1 truncate">
                        {room.last_message.content}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col items-end">
                    {room.unread_count > 0 && (
                      <span className="bg-blue-500 text-white text-xs rounded-full px-2 py-1 mb-1">
                        {room.unread_count}
                      </span>
                    )}
                    <span className="text-xs text-gray-400">
                      {formatTime(room.last_update)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Zone de chat */}
      <div className="flex-1 flex flex-col">
        {selectedRoom ? (
          <>
            {/* En-tête du chat */}
            <div className="p-4 border-b border-gray-200 bg-white">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold">{selectedRoom.name}</h3>
                  <p className="text-sm text-gray-500">
                    {selectedRoom.details}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">
                    {selectedRoom.participants.length} participant(s)
                  </span>
                  {selectedRoom.participants.slice(0, 3).map((participant) => (
                    <div key={participant.id} className="flex items-center">
                      <div className="relative">
                        {participant.avatar ? (
                          <img
                            src={participant.avatar}
                            alt={participant.name}
                            className="w-8 h-8 rounded-full"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-xs">
                            {participant.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div
                          className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(
                            participant.status
                          )}`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messagesLoading ? (
                <div className="text-center text-gray-500">
                  Chargement des messages...
                </div>
              ) : messagesError ? (
                <div className="text-center text-red-500">
                  Erreur: {messagesError}
                </div>
              ) : messages.length === 0 ? (
                <div className="text-center text-gray-500">Aucun message</div>
              ) : (
                messages.map((message) => (
                  <div key={message.uuid} className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      {message.sender_info.avatar ? (
                        <img
                          src={message.sender_info.avatar}
                          alt={message.sender_info.name}
                          className="w-8 h-8 rounded-full"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-xs">
                          {message.sender_info.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm">
                          {formatParticipantName(message.sender_info)}
                        </span>
                        <span className="text-xs text-gray-500">
                          {formatTime(message.created_at)}
                        </span>
                        <span
                          className={`text-xs px-2 py-1 rounded ${
                            message.status === "read"
                              ? "bg-green-100 text-green-800"
                              : message.status === "delivered"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {message.status}
                        </span>
                      </div>
                      <div className="bg-gray-100 rounded-lg p-3">
                        <p className="text-sm">{message.content}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Zone de saisie */}
            <div className="p-4 border-t border-gray-200 bg-white">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Tapez votre message..."
                  className="flex-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  className="px-4"
                >
                  Envoyer
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            Sélectionnez une conversation pour commencer
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatInterface;
