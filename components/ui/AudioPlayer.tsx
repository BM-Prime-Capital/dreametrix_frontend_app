"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause, Volume2 } from "lucide-react";

interface AudioPlayerProps {
  audioPath: string;
  tenantDomain: string;
  accessToken: string;
  refreshToken: string;
  className?: string;
}

export function AudioPlayer({
  audioPath,
  tenantDomain,
  accessToken,
  refreshToken,
  className = "",
}: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioBlob, setAudioBlob] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Load audio with authorization
  useEffect(() => {
    const loadAudio = async () => {
      if (!audioPath) return;

      setIsLoading(true);
      setError(null);

      try {
        // Check if it's an external URL (like test audio)
        if (audioPath.startsWith("http")) {
          setAudioBlob(audioPath);
          return;
        }

        // For internal files, fetch with authorization
        const response = await fetch(`${tenantDomain}${audioPath}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "X-Refresh-Token": refreshToken,
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch audio: ${response.status}`);
        }

        const blob = await response.blob();
        const blobUrl = URL.createObjectURL(blob);
        setAudioBlob(blobUrl);
      } catch (err) {
        console.error("Error loading audio:", err);
        setError("Failed to load audio");
        // Fallback to direct URL
        setAudioBlob(`${tenantDomain}${audioPath}`);
      } finally {
        setIsLoading(false);
      }
    };

    loadAudio();

    // Cleanup blob URL on unmount
    return () => {
      if (audioBlob && audioBlob.startsWith("blob:")) {
        URL.revokeObjectURL(audioBlob);
      }
    };
  }, [audioPath, tenantDomain, accessToken, refreshToken]);

  const togglePlayPause = () => {
    if (!audioRef.current || !audioBlob) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleAudioEnd = () => {
    setIsPlaying(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
        <span className="text-xs text-gray-500">Loading...</span>
      </div>
    );
  }

  if (error && !audioBlob) {
    return (
      <div className="flex items-center gap-2">
        <Volume2 className="h-4 w-4 text-gray-400" />
        <span className="text-xs text-red-500">Error loading audio</span>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Button
        variant="ghost"
        size="sm"
        onClick={togglePlayPause}
        className="h-8 w-8 p-0 hover:bg-blue-50"
        disabled={!audioBlob}
      >
        {isPlaying ? (
          <Pause className="h-4 w-4 text-blue-600" />
        ) : (
          <Play className="h-4 w-4 text-blue-600" />
        )}
      </Button>

      {audioBlob && (
        <audio
          ref={audioRef}
          src={audioBlob}
          onEnded={handleAudioEnd}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          className="hidden"
        />
      )}

      <span className="text-xs text-gray-600">Audio Feedback</span>
    </div>
  );
}
