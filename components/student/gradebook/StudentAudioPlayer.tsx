"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause, Volume2, Mic } from "lucide-react";
import { useRequestInfo } from "@/hooks/useRequestInfo";

interface StudentAudioPlayerProps {
  audioPath: string | null;
  className?: string;
}

export function StudentAudioPlayer({
  audioPath,
  className = "",
}: StudentAudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioBlob, setAudioBlob] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const { accessToken, tenantDomain } = useRequestInfo();

  // Load audio with authorization
  useEffect(() => {
    const loadAudio = async () => {
      if (!audioPath || !accessToken || !tenantDomain) return;

      setIsLoading(true);
      setError(null);

      try {
        // Check if it's an external URL (like test audio)
        if (audioPath.startsWith("http")) {
          setAudioBlob(audioPath);
          return;
        }

        // For internal files, fetch with authorization
        const response = await fetch(`${tenantDomain}/${audioPath}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
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
  }, [audioPath, tenantDomain, accessToken]);

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

  // Si pas de voice note
  if (!audioPath) {
    return (
      <div className="flex items-center gap-2">
        <Mic className="h-4 w-4 text-gray-400" />
        <span className="text-xs text-gray-400">No voice note</span>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 border-2 border-gray-300 border-t-[#25AAE1] rounded-full animate-spin"></div>
        <span className="text-xs text-gray-500">Loading...</span>
      </div>
    );
  }

  if (error && !audioBlob) {
    return (
      <div className="flex items-center gap-2">
        <Volume2 className="h-4 w-4 text-red-400" />
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
        className="h-8 w-8 p-0 hover:bg-[#25AAE1]/10"
        disabled={!audioBlob}
      >
        {isPlaying ? (
          <Pause className="h-4 w-4 text-[#25AAE1]" />
        ) : (
          <Play className="h-4 w-4 text-[#25AAE1]" />
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

      <span className="text-xs text-[#25AAE1] font-medium">Voice Note</span>
    </div>
  );
} 