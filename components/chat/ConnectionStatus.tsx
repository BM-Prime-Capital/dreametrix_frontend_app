"use client";

import React from "react";
import { Wifi, WifiOff, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ConnectionStatusProps {
  isConnected: boolean;
  error?: string | null;
  onReconnect?: () => void;
  className?: string;
}

const ConnectionStatus: React.FC<ConnectionStatusProps> = ({
  isConnected,
  error,
  onReconnect,
  className = "",
}) => {
  if (isConnected) {
    return (
      <div
        className={`flex items-center gap-2 text-green-600 text-sm ${className}`}
      >
        <Wifi className="h-4 w-4" />
        <span>Connecté</span>
      </div>
    );
  }

  return (
    <div
      className={`flex items-center gap-2 text-red-600 text-sm ${className}`}
    >
      <WifiOff className="h-4 w-4" />
      <div className="flex items-center gap-2">
        <span>{error || "Déconnecté"}</span>
        {onReconnect && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onReconnect}
            className="h-6 px-2 text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <RefreshCw className="h-3 w-3 mr-1" />
            Reconnecter
          </Button>
        )}
      </div>
    </div>
  );
};

export default ConnectionStatus;
