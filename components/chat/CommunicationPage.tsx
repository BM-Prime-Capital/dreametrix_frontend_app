"use client";

import React from "react";
import EnhancedTeacherCommunication from "@/components/communicate/EnhancedTeacherCommunication";

/**
 * Page de communication pour les enseignants avec module chat intégré
 *
 * Cette page combine :
 * - Les fonctionnalités de communication existantes (messages, annonces)
 * - Le nouveau module de chat en temps réel
 * - Une interface unifiée avec navigation par onglets
 */
const CommunicationPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <EnhancedTeacherCommunication />
      </div>
    </div>
  );
};

export default CommunicationPage;
