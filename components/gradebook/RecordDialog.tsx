"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState, useRef, useEffect } from "react";
import { Mic, Play, StopCircle, Check, Upload, Trash2 } from "lucide-react";
import { toast } from "sonner";

export function RecordDialog({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState("");
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        setAudioBlob(audioBlob);
        const audioUrl = URL.createObjectURL(audioBlob);
        setAudioURL(audioUrl);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (err) {
      console.error('Error starting recording:', err);
      toast.error("Failed to access microphone");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
    }
  };

  const handleSave = () => {
    if (audioBlob) {
      // Here you would typically send the audioBlob to your backend
      // For now, we'll store it in localStorage as a base64 string
      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);
      reader.onloadend = () => {
        const base64Audio = reader.result as string;
        localStorage.setItem('voiceRecording', base64Audio);
        toast.success("Voice recording saved successfully");
        setOpen(false);
      };
    }
  };

  const handleDelete = () => {
    setAudioURL("");
    setAudioBlob(null);
    audioChunksRef.current = [];
  };

  useEffect(() => {
    return () => {
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-blue-600 flex items-center gap-2">
            <Mic className="h-5 w-5" />
            Voice Recording
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-6">
          <div className="p-8 bg-gray-100 rounded-lg flex flex-col items-center justify-center gap-4">
            {isRecording ? (
              <div className="flex items-center gap-2 text-red-500">
                <StopCircle className="h-6 w-6 animate-pulse" />
                <span>Recording in progress...</span>
              </div>
            ) : audioURL ? (
              <div className="w-full flex flex-col items-center gap-2">
                <audio controls src={audioURL} className="w-full" />
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleDelete}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Recording
                </Button>
              </div>
            ) : (
              <span className="text-gray-500">No recording yet</span>
            )}
          </div>
          <div className="flex gap-3">
            <Button 
              variant={isRecording ? "destructive" : "outline"} 
              className="flex-1 gap-2"
              onClick={isRecording ? stopRecording : startRecording}
            >
              {isRecording ? (
                <>
                  <StopCircle className="h-4 w-4" />
                  Stop
                </>
              ) : (
                <>
                  <Play className="h-4 w-4" />
                  Start
                </>
              )}
            </Button>
            <Button 
              variant="outline" 
              className="flex-1 gap-2" 
              disabled={!audioURL}
              onClick={() => {
                // Implement review functionality
                toast.info("Playing recording for review");
              }}
            >
              <Check className="h-4 w-4" />
              Review
            </Button>
            <Button 
              className="flex-1 gap-2 bg-blue-600 hover:bg-blue-700" 
              disabled={!audioURL}
              onClick={handleSave}
            >
              <Upload className="h-4 w-4" />
              Save
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}