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
import { Mic, Play, StopCircle, Check, Upload, Loader2 } from "lucide-react";
import {
  saveVoiceRecording,
  getVoiceRecordingAudio,
} from "@/services/GradebooksService";
import { localStorageKey } from "@/constants/global";

interface RecordDialogProps {
  children: React.ReactNode;
  studentId?: string;
  submissionId?: number; // Add submissionId prop for submissions
  assessmentType?: string;
  assessmentIndex?: number;
  onRecordingSaved?: (voiceNotesUrl?: string) => void; // Updated to accept voice URL
  hasExistingRecording?: boolean; // Add prop to indicate if recording exists
  voiceUrl?: string; // Add prop to pass existing voice URL
}

export function RecordDialog({
  children,
  studentId,
  submissionId, // Add submissionId parameter
  assessmentType,
  assessmentIndex,
  onRecordingSaved,
  hasExistingRecording = false,
  voiceUrl, // Add voiceUrl parameter
}: RecordDialogProps) {
  const [open, setOpen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [hasRecording, setHasRecording] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingExisting, setIsLoadingExisting] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);

  const tenantData: any = localStorage.getItem(localStorageKey.TENANT_DATA);
  const { primary_domain } = JSON.parse(tenantData);
  const tenantPrimaryDomain = `https://${primary_domain}`;
  const accessToken: any = localStorage.getItem(localStorageKey.ACCESS_TOKEN);
  const refreshToken: any = localStorage.getItem(localStorageKey.REFRESH_TOKEN);

  // Load existing recording when dialog opens
  useEffect(() => {
    console.log("useEffect triggered with conditions:", {
      open,
      hasExistingRecording,
      voiceUrl,
      studentId,
      assessmentType,
      assessmentIndex,
      hasRecording,
    });

    // If we have a direct voiceUrl, use it instead of making API call
    if (open && hasExistingRecording && voiceUrl && !hasRecording) {
      console.log("Using provided voiceUrl:", voiceUrl);
      const fullAudioUrl = voiceUrl.startsWith("http")
        ? voiceUrl
        : `${tenantPrimaryDomain}${voiceUrl}`;
      setAudioUrl(fullAudioUrl);
      setHasRecording(true);
      return;
    }

    // Otherwise, use the old API call method
    if (
      open &&
      hasExistingRecording &&
      studentId &&
      assessmentType &&
      assessmentIndex !== undefined &&
      !hasRecording &&
      !voiceUrl
    ) {
      console.log("All conditions met, loading existing recording via API...");
      loadExistingRecording();
    } else {
      console.log("Conditions not met for loading existing recording");
    }
  }, [
    open,
    hasExistingRecording,
    voiceUrl,
    studentId,
    assessmentType,
    assessmentIndex,
    hasRecording,
  ]);

  const loadExistingRecording = async () => {
    setIsLoadingExisting(true);
    try {
      console.log("Loading existing recording for:", {
        studentId,
        assessmentType,
        assessmentIndex,
      });

      const response = await getVoiceRecordingAudio(
        tenantPrimaryDomain,
        accessToken,
        parseInt(studentId!),
        assessmentType!,
        assessmentIndex!,
        refreshToken
      );

      console.log("Voice recording response:", response);

      if (response.success && response.audioUrl) {
        // Much simpler - use the URL directly!
        console.log("Setting audio URL directly:", response.audioUrl);
        setAudioUrl(response.audioUrl);
        setHasRecording(true);
      } else {
        console.error("Failed to load existing recording:", response);
      }
    } catch (error) {
      console.error("Error loading existing recording:", error);
    } finally {
      setIsLoadingExisting(false);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        setAudioBlob(blob);
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        setHasRecording(true);

        // Stop all tracks to free up microphone
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error starting recording:", error);
      alert("Unable to access microphone. Please check permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleRecordingToggle = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const saveRecording = async () => {
    if (
      !audioBlob ||
      !submissionId ||
      !assessmentType ||
      assessmentIndex === undefined
    ) {
      console.error("Missing required data for saving recording:", {
        hasAudioBlob: !!audioBlob,
        submissionId,
        assessmentType,
        assessmentIndex,
      });
      alert("Missing submission data. Please try refreshing the page.");
      return;
    }

    setIsSaving(true);
    try {
      // Convert Blob to base64 string for server action
      const base64Promise = new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(audioBlob);
      });
      const audioBase64 = await base64Promise;

      console.log("🎙️ Saving voice recording with submission-based approach:", {
        submissionId,
        assessmentType,
        assessmentIndex,
      });

      const result = await saveVoiceRecording(
        tenantPrimaryDomain,
        accessToken,
        submissionId, // Always use submissionId for submission-based system
        assessmentType,
        assessmentIndex,
        audioBase64, // Pass base64 string instead of Blob
        refreshToken
      );

      console.log("Recording saved successfully:", result);

      // Pass the voice_notes URL from the API response to the parent callback
      const voiceNotesUrl =
        result?.voice_notes_url || result?.data?.voice_notes;
      onRecordingSaved?.(voiceNotesUrl);
      setOpen(false);

      // Reset state
      setHasRecording(false);
      setAudioBlob(null);
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
        setAudioUrl(null);
      }
    } catch (error) {
      console.error("Error saving recording:", error);
      alert("Failed to save recording. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleClose = () => {
    // Clean up when dialog closes
    if (isRecording) {
      stopRecording();
    }
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
    setOpen(false);
    setHasRecording(false);
    setAudioBlob(null);
    setAudioUrl(null);
  };

  const handleDialogOpenChange = (newOpen: boolean) => {
    if (newOpen) {
      setOpen(true);
    } else {
      handleClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-blue-600 flex items-center gap-2">
            <Mic className="h-5 w-5" />
            Voice Recording
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-6">
          <div className="p-8 bg-gray-100 rounded-lg flex items-center justify-center">
            {isLoadingExisting ? (
              <div className="flex items-center gap-2 text-blue-500">
                <Loader2 className="h-6 w-6 animate-spin" />
                <span>Loading existing recording...</span>
              </div>
            ) : isRecording ? (
              <div className="flex items-center gap-2 text-red-500">
                <StopCircle className="h-6 w-6 animate-pulse" />
                <span>Recording in progress...</span>
              </div>
            ) : hasRecording ? (
              <div className="flex items-center gap-2 text-green-600">
                <Check className="h-6 w-6" />
                <span>
                  {hasExistingRecording
                    ? "Existing recording loaded"
                    : "Recording ready to save"}
                </span>
              </div>
            ) : (
              <span className="text-gray-500">No recording yet</span>
            )}
          </div>

          {hasRecording && audioUrl && (
            <div className="bg-white p-4 rounded-lg border">
              <audio
                controls
                className="w-full"
                src={audioUrl}
                onError={(e) => {
                  console.error("Audio playback error:", e);
                  console.error("Audio URL:", audioUrl);
                  console.error("Audio blob type:", audioBlob?.type);
                }}
                onLoadStart={() => console.log("Audio loading started")}
                onCanPlay={() => console.log("Audio can play")}
                onLoadedData={() => console.log("Audio data loaded")}
              />
            </div>
          )}

          <div className="flex gap-3">
            <Button
              variant={isRecording ? "destructive" : "outline"}
              className="flex-1 gap-2"
              onClick={handleRecordingToggle}
              disabled={isSaving || isLoadingExisting}
            >
              {isRecording ? (
                <>
                  <StopCircle className="h-4 w-4" />
                  Stop
                </>
              ) : (
                <>
                  <Mic className="h-4 w-4" />
                  {hasRecording ? "Record Again" : "Start Recording"}
                </>
              )}
            </Button>

            <Button
              className="flex-1 gap-2 bg-blue-600 hover:bg-blue-700"
              disabled={!hasRecording || isSaving || isLoadingExisting}
              onClick={saveRecording}
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4" />
                  {hasExistingRecording && hasRecording
                    ? "Update Recording"
                    : "Save Recording"}
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
