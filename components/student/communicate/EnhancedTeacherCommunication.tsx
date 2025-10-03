"use client";

import React, { useState } from "react";
import { MessageSquare, Users, Megaphone } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StudentCommunication from "./StudentCommunication";
import ChatInterface from "../../chat/ChatInterface";

const EnhancedStudentCommunication: React.FC = () => {
  const [activeTab, setActiveTab] = useState("messages");

  return (
    <div className="w-full h-full">
      <section className="flex flex-col gap-4 w-full h-full">
        {/* Header */}
        <div className="flex justify-between items-center bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 px-6 py-5 rounded-xl shadow-lg overflow-hidden relative animate-fade-in">
          <div className="absolute inset-0 bg-[url('/assets/images/bg.png')] bg-cover bg-center opacity-10"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/80 via-purple-500/80 to-pink-500/80"></div>

          <div className="flex items-center gap-3 relative z-10">
            <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm shadow-inner border border-white/30">
              <MessageSquare className="h-6 w-6 text-white" />
            </div>
            <div className="text-white">
              <h1 className="text-2xl font-bold tracking-tight">
                Communication
              </h1>
              <p className="text-blue-100 text-sm font-medium">
                Connectez-vous avec vos étudiants, parents et collègues
              </p>
            </div>
          </div>
        </div>

        {/* Main Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="flex-1 flex flex-col"
        >
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="messages" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Messages & Annonces
            </TabsTrigger>
            <TabsTrigger value="chat" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Chat en temps réel
            </TabsTrigger>
            <TabsTrigger value="broadcast" className="flex items-center gap-2">
              <Megaphone className="h-4 w-4" />
              Diffusions
            </TabsTrigger>
          </TabsList>

          <TabsContent value="messages" className="flex-1 mt-0">
            <StudentCommunication />
          </TabsContent>

          <TabsContent value="chat" className="flex-1 mt-0">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-full">
              <ChatInterface className="h-full" />
            </div>
          </TabsContent>

          <TabsContent value="broadcast" className="flex-1 mt-0">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 h-full">
              <div className="text-center text-gray-500">
                <Megaphone className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-semibold mb-2">
                  Diffusions de masse
                </h3>
                <p className="text-sm">
                  Fonctionnalité de diffusion en cours de développement.
                  <br />
                  Permettra d&apos;envoyer des messages à plusieurs groupes
                  simultanément.
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </section>
    </div>
  );
};

export default EnhancedStudentCommunication;
