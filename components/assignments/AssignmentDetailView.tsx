/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { 
  ChevronLeft, 
  Search, 
  Download, 
  FileText, 
  Clock, 
  CheckCircle, 
  XCircle,
  Mic,
  MicOff,
  Play,
 // Pause,
  Save
} from "lucide-react";
import { Assignment } from "@/types";
import { getSubmissions } from "@/services/AssignmentService";
import { saveVoiceRecording, updateStudentGrade } from "@/services/GradebooksService";
import { useRequestInfo } from "@/hooks/useRequestInfo";

interface Student {
  id: number;
  full_name: string;
  email: string;
  avatar?: string;
  submission?: {
    id: number;
    submitted_at: string;
    file: string;
    // file_name: string;
    marked: boolean;
    grade?: number;
    // feedback?: string;
    voice_note?: string;
  };
}

// interface ApiSubmissionResponse {
//   student: {
//     id: number;
//     user: {
//       id: number;
//       email: string;
//       username: string;
//       first_name: string;
//       last_name: string;
//       avatar?: string;
//     };
//     uuid: string;
//     grade: number;
//     enrolled_courses: number[];
//   };
//   has_submitted: boolean;
//   submission: {
//     id: number;
//     submitted_at: string;
//     file_url: string;
//     file_name: string;
//     grade?: number;
//     feedback?: string;
//     voice_note_url?: string;
//   } | null;
// }

interface AssignmentDetailViewProps {
  assignment: Assignment;
  onBack: () => void;
}

export default function AssignmentDetailView({ assignment, onBack }: AssignmentDetailViewProps) {
  const { tenantDomain, accessToken, refreshToken } = useRequestInfo();
  const [students, setStudents] = useState<Student[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubmission, setSelectedSubmission] = useState<any>(null);
  const [isGradingOpen, setIsGradingOpen] = useState(false);
  const [grade, setGrade] = useState("");
  const [feedback, setFeedback] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSavingGrade, setIsSavingGrade] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load submissions data from API
  const loadData = useCallback(async (skipLoadingState = false) => {
      if (!tenantDomain || !accessToken || !refreshToken || !assignment) return;
      
      if (!skipLoadingState) {
        setIsLoading(true);
      }
      setError(null);
      
      try {
        // Get submissions for this assignment (includes student data)
        const submissionsData = await getSubmissions(
          assignment.id,
          tenantDomain,
          accessToken,
          //refreshToken
        );
        
        // Log the structure to debug
        console.log('Raw API response structure:', JSON.stringify(submissionsData, null, 2));
        
        if (!submissionsData || typeof submissionsData !== 'object') {
          throw new Error('Invalid response format from API');
        }
        
        // Check if results exist before mapping and handle different possible response structures
        let results = [];
        
        if (Array.isArray(submissionsData)) {
          // If the API returns an array directly
          results = submissionsData;
        } else if (submissionsData.results && Array.isArray(submissionsData.results)) {
          // If the API returns an object with a results array
          results = submissionsData.results;
        } else if (submissionsData.data && Array.isArray(submissionsData.data)) {
          // Another common API pattern
          results = submissionsData.data;
        }
        
        console.log('Processed results:', results);
        
        let studentsWithSubmissions = [];
        
        try {
          studentsWithSubmissions = results.map((item: any) => {
            // Check if item has the expected structure
            if (!item || !item.student) {
              console.warn('Unexpected item structure:', item);
              return null;
            }
            
            const student = item.student;
            const user = student.user || {};
            
            return {
              id: student.id,
              full_name: `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'Unknown Student',
              email: user.email || '',
              avatar: user.avatar,
              submission: item.submission ? {
                id: item.submission.id,
                submitted_at: item.submission.submitted_at,
                file: item.submission.file,
                // file_name: item.submission.file_name || 'Unknown file',
                marked: item.submission.marked,
                grade: item.submission.grade,
                // feedback: item.submission.feedback,
                voice_note: item.submission.voice_notes || item.submission.voice_note
              } : undefined
            };
          }).filter(Boolean); // Remove any null entries
        } catch (err) {
          console.error('Error processing submission data:', err);
          setError('Error processing submission data. Check console for details.');
          studentsWithSubmissions = [];
        }
        
        setStudents(studentsWithSubmissions);
      } catch (err: any) {
        console.error("Error loading data:", err);
        setError(err.message || "Failed to load assignment data");
      } finally {
        if (!skipLoadingState) {
          setIsLoading(false);
        }
      }
    }, [tenantDomain, accessToken, refreshToken, assignment]);

  useEffect(() => {
    loadData();
  }, [assignment, tenantDomain, accessToken, refreshToken]);

  // Cleanup effect for audio URLs
  useEffect(() => {
    return () => {
      // Cleanup audio URL when component unmounts or audioUrl changes
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
      // Stop any playing audio
      if (currentAudio) {
        currentAudio.pause();
      }
    };
  }, [audioUrl, currentAudio]);

  const filteredStudents = students.filter(student =>
    student.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const submittedCount = students.filter(s => s.submission).length;
  const gradedCount = students.filter(s => s.submission?.grade).length;

  const handleViewSubmission = (student: Student) => {
    if (student.submission) {
      setSelectedSubmission({
        student,
        submission: student.submission
      });
      setGrade(student.submission.grade?.toString() || "");
      // setFeedback(student.submission.feedback || "");
      // Reset audio states when opening new submission
      setAudioBlob(null);
      setAudioUrl(null);
      setIsPlaying(false);
      if (currentAudio) {
        currentAudio.pause();
        setCurrentAudio(null);
      }
      setIsGradingOpen(true);
    }
  };

  const startRecording = async () => {
    try {
      // Stop any existing audio playback
      if (currentAudio) {
        currentAudio.pause();
        setCurrentAudio(null);
        setIsPlaying(false);
      }
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      const chunks: BlobPart[] = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };
      
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm;codecs=opus' });
        setAudioBlob(blob);
        // Create URL for immediate playback
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        console.log('Recording stopped, blob size:', blob.size, 'bytes');
      };

      recorder.start(1000); // Capture data every second
      setMediaRecorder(recorder);
      setIsRecording(true);
      console.log('Recording started');
    } catch (error) {
      console.error('Error starting recording:', error);
      alert('Unable to access microphone. Please check your browser permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      mediaRecorder.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
      setMediaRecorder(null);
      console.log('Recording stopped');
    }
  };

  const playAudio = (audioSource: string | Blob) => {
    try {
      // Stop any existing audio
      if (currentAudio) {
        currentAudio.pause();
        setCurrentAudio(null);
      }
      
      let audioSrc: string;
      if (audioSource instanceof Blob) {
        audioSrc = URL.createObjectURL(audioSource);
      } else {
        audioSrc = audioSource;
      }
      
      const audio = new Audio(audioSrc);
      audio.onplay = () => setIsPlaying(true);
      audio.onpause = () => setIsPlaying(false);
      audio.onended = () => {
        setIsPlaying(false);
        setCurrentAudio(null);
        if (audioSource instanceof Blob) {
          URL.revokeObjectURL(audioSrc);
        }
      };
      audio.onerror = (e) => {
        console.error('Audio playback error:', e);
        alert('Unable to play audio file');
        setIsPlaying(false);
        setCurrentAudio(null);
      };
      
      setCurrentAudio(audio);
      audio.play();
    } catch (error) {
      console.error('Error playing audio:', error);
      alert('Unable to play audio');
    }
  };

  const stopAudio = () => {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      setIsPlaying(false);
    }
  };

  const clearRecording = () => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
    setAudioBlob(null);
    setAudioUrl(null);
    if (currentAudio) {
      currentAudio.pause();
      setCurrentAudio(null);
    }
    setIsPlaying(false);
  };

  const exportGrades = () => {
    try {
      // Prepare CSV data
      const csvHeaders = ['Student Name', 'Email', 'Submission Status', 'Submitted Date', 'Grade', 'Marked'];
      
      const csvData = students.map(student => [
        student.full_name,
        student.email,
        student.submission ? 'Submitted' : 'Missing',
        student.submission ? new Date(student.submission.submitted_at).toLocaleDateString() : '-',
        student.submission?.grade ? `${student.submission.grade}%` : '-',
        student.submission?.marked ? 'Yes' : 'No'
      ]);

      // Create CSV content
      const csvContent = [
        csvHeaders.join(','),
        ...csvData.map(row => row.map(cell => `"${cell}"`).join(','))
      ].join('\n');

      // Create and download the file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      
      link.setAttribute('href', url);
      link.setAttribute('download', `${assignment.name}_grades_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      URL.revokeObjectURL(url);
      
      console.log('Grades exported successfully');
    } catch (error) {
      console.error('Error exporting grades:', error);
      alert('Failed to export grades. Please try again.');
    }
  };

  const handleSaveGrade = async () => {
    if (!selectedSubmission || !tenantDomain || !accessToken || !refreshToken) {
      alert('Missing required information to save grade');
      return;
    }

    setIsSavingGrade(true);
    
    try {
      console.log('Saving grade:', grade, 'feedback:', feedback);
      
      // If there's a new voice recording, save it first
      if (audioBlob) {
        try {
          console.log('Saving voice note for submission:', selectedSubmission.submission.id);
          
          // Convert blob to base64
          const reader = new FileReader();
          const base64Promise = new Promise<string>((resolve, reject) => {
            reader.onload = () => {
              const result = reader.result as string;
              resolve(result);
            };
            reader.onerror = reject;
          });
          
          reader.readAsDataURL(audioBlob);
          const base64Data = await base64Promise;
          
          // Save voice recording using the existing service
          const voiceResult = await saveVoiceRecording(
            tenantDomain,
            accessToken,
            selectedSubmission.submission.id,
            assignment.kind, // assessment type
            assignment.id, // assessment index
            base64Data,
            refreshToken
          );
          
          console.log('Voice note saved successfully:', voiceResult);
          
          // Update the submission data with the new voice note URL
          if (voiceResult.voice_notes_url) {
            setSelectedSubmission((prev: any) => ({
              ...prev,
              submission: {
                ...prev.submission,
                voice_note: voiceResult.voice_notes_url
              }
            }));
            
            // Update the students list as well
            setStudents(prev => prev.map(student => 
              student.id === selectedSubmission.student.id
                ? {
                    ...student,
                    submission: student.submission ? {
                      ...student.submission,
                      voice_note: voiceResult.voice_notes_url
                    } : student.submission
                  }
                : student
            ));
          }
          
          // Clear the recorded audio after successful save
          clearRecording();
          
        } catch (voiceError) {
          console.error('Error saving voice note:', voiceError);
          alert('Failed to save voice note: ' + (voiceError as Error).message);
          setIsSavingGrade(false);
          return; // Don't proceed with grade saving if voice note fails
        }
      }
      
      // Save grade and feedback
      await updateStudentGrade(
        tenantDomain,
        accessToken,
        selectedSubmission.submission.id,
        Number(grade),
        refreshToken
      );
      
      // Reload data to get the latest information from the server
      await loadData(true); // Skip loading state since we're already in saving state
      
      setIsGradingOpen(false);
      
    } catch (error) {
      console.error('Error saving grade:', error);
      alert('Failed to save grade: ' + (error as Error).message);
    } finally {
      setIsSavingGrade(false);
    }
  };
  const handleDownloadFile = (file: string) => {
    const link = document.createElement("a");
    link.href = file;
    link.download = file;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section className="flex flex-col h-full w-full bg-gradient-to-br from-green-50/30 to-blue-50/20">
      {/* Header */}
      <div className="flex justify-between items-center bg-[#79bef2] px-8 py-6 shadow-xl rounded-2xl mx-6 mt-8">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={onBack}
            className="text-white hover:bg-white/20 rounded-xl p-2"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-white font-bold text-2xl">{assignment.name}</h1>
              <p className="text-blue-100 text-sm mt-1">{assignment.course.name}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-8 space-y-6 overflow-auto">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mb-4"></div>
            <p className="text-gray-600 font-medium">Loading assignment data...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-64">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <XCircle className="w-8 h-8 text-red-600" />
            </div>
            <p className="text-red-600 font-medium text-center">{error}</p>
            <Button onClick={onBack} className="mt-4">
              Go Back
            </Button>
          </div>
        ) : (
        <>
        {/* Assignment Info */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="p-6 bg-white/80 backdrop-blur-sm shadow-lg border-0">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-xl">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">{students.length}</p>
                <p className="text-sm font-medium text-gray-600">Total Students</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-6 bg-white/80 backdrop-blur-sm shadow-lg border-0">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-xl">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">{submittedCount}</p>
                <p className="text-sm font-medium text-gray-600">Submitted</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-6 bg-white/80 backdrop-blur-sm shadow-lg border-0">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-xl">
                <FileText className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">{gradedCount}</p>
                <p className="text-sm font-medium text-gray-600">Graded</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-6 bg-white/80 backdrop-blur-sm shadow-lg border-0">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-red-100 rounded-xl">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">{students.length - submittedCount}</p>
                <p className="text-sm font-medium text-gray-600">Missing</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Search and Actions */}
        <div className="flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-10 rounded-lg border-gray-300"
            />
          </div>
          <Button 
            onClick={exportGrades}
            className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-lg"
          >
            <Download className="h-4 w-4 mr-2" />
            Export Grades
          </Button>
        </div>

        {/* Students Table */}
        <Card className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gradient-to-r from-green-50 to-blue-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Student</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Submitted</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Grade</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {filteredStudents.map((student) => {
                  const initials = student.full_name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
                  
                  return (
                    <tr key={student.id} className="hover:bg-green-50/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10 border-2 border-green-100">
                            <AvatarImage src={student.avatar || undefined} alt={student.full_name} />
                            <AvatarFallback className="bg-green-100 text-green-700">
                              {initials}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-semibold text-gray-900">{student.full_name}</div>
                            <div className="text-sm text-gray-500">{student.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge className={`${
                          student.submission 
                            ? student.submission.grade 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {student.submission 
                            ? student.submission.grade 
                              ? 'Graded' 
                              : 'Submitted'
                            : 'Missing'}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {student.submission 
                          ? new Date(student.submission.submitted_at).toLocaleDateString()
                          : '-'}
                      </td>
                      <td className="px-6 py-4">
                        {student.submission?.grade ? (
                          <span className="font-semibold text-green-600">
                            {student.submission.grade}%
                          </span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {student.submission ? (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-blue-600 hover:bg-blue-50 rounded-lg"
                            onClick={() => handleViewSubmission(student)}
                          >
                            <FileText className="h-4 w-4 mr-2" />
                            View
                          </Button>
                        ) : (
                          <span className="text-gray-400 text-sm">No submission</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
        </>
        )}
      </div>

      {/* Grading Dialog */}
      <Dialog open={isGradingOpen} onOpenChange={setIsGradingOpen}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <FileText className="h-5 w-5 text-blue-600" />
              Grade Submission - {selectedSubmission?.student.full_name}
            </DialogTitle>
          </DialogHeader>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Submission Preview */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-800">Submission</h3>
              <div className="border rounded-lg p-4 bg-gray-50 min-h-[400px] flex items-center justify-center">
                <div className="text-center">
                  <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  {/* <p className="text-gray-600 mb-2">{selectedSubmission?.submission.file}</p> */}
                  <Button variant="outline" size="sm" onClick={() => handleDownloadFile(selectedSubmission?.submission.file)}>
                    <Download className="h-4 w-4 mr-2" />
                    Download File
                  </Button>
                </div>
              </div>
            </div>

            {/* Grading Panel */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-800">Grading</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Grade (%)
                  </label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                    placeholder="Enter grade"
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Written Feedback
                  </label>
                  <Textarea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Enter your feedback..."
                    rows={4}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Voice Note
                  </label>
                  
                  {/* Show existing voice note if available */}
                  {selectedSubmission?.submission.voice_note && (
                    <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-sm text-blue-700 mb-2">Existing voice note:</p>
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => playAudio(selectedSubmission.submission.voice_note)}
                          disabled={isPlaying || isSavingGrade}
                        >
                          <Play className="h-4 w-4 mr-2" />
                          {isPlaying ? 'Playing...' : 'Play Existing'}
                        </Button>
                        {isPlaying && (
                          <Button variant="ghost" size="sm" onClick={stopAudio}>
                            <MicOff className="h-4 w-4 mr-2" />
                            Stop
                          </Button>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {/* Recording controls */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Button
                        variant={isRecording ? "destructive" : "outline"}
                        size="sm"
                        onClick={isRecording ? stopRecording : startRecording}
                        disabled={isPlaying || isSavingGrade}
                      >
                        {isRecording ? (
                          <>
                            <MicOff className="h-4 w-4 mr-2" />
                            Stop Recording
                          </>
                        ) : (
                          <>
                            <Mic className="h-4 w-4 mr-2" />
                            {audioBlob ? 'Record New' : 'Start Recording'}
                          </>
                        )}
                      </Button>
                      
                      {audioBlob && (
                        <div className="flex items-center gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => playAudio(audioBlob)}
                            disabled={isPlaying || isSavingGrade}
                          >
                            <Play className="h-4 w-4 mr-2" />
                            {isPlaying ? 'Playing...' : 'Play New'}
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={clearRecording}
                            disabled={isRecording || isPlaying || isSavingGrade}
                          >
                            <XCircle className="h-4 w-4 mr-2" />
                            Clear
                          </Button>
                        </div>
                      )}
                    </div>
                    
                    {isRecording && (
                      <div className="flex items-center gap-2 text-red-600">
                        <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></div>
                        <span className="text-sm">Recording in progress...</span>
                      </div>
                    )}
                    
                    {audioBlob && (
                      <div className="text-sm text-green-600">
                        ✓ New voice note ready to save
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsGradingOpen(false)}
              disabled={isSavingGrade}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSaveGrade} 
              className="bg-green-600 hover:bg-green-700"
              disabled={isSavingGrade}
            >
              {isSavingGrade ? (
                <>
                  <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Grade
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}