"use client";

import { useState, useEffect } from "react";
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
  Pause,
  Save
} from "lucide-react";
import { Assignment } from "@/types";

interface Student {
  id: number;
  full_name: string;
  email: string;
  avatar?: string;
  submission?: {
    id: number;
    submitted_at: string;
    file_url: string;
    file_name: string;
    grade?: number;
    feedback?: string;
    voice_note_url?: string;
  };
}

interface AssignmentDetailViewProps {
  assignment: Assignment;
  onBack: () => void;
}

export default function AssignmentDetailView({ assignment, onBack }: AssignmentDetailViewProps) {
  const [students, setStudents] = useState<Student[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubmission, setSelectedSubmission] = useState<any>(null);
  const [isGradingOpen, setIsGradingOpen] = useState(false);
  const [grade, setGrade] = useState("");
  const [feedback, setFeedback] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);

  // Mock data - replace with actual API call
  useEffect(() => {
    const mockStudents: Student[] = [
      {
        id: 1,
        full_name: "Alice Johnson",
        email: "alice@school.edu",
        submission: {
          id: 1,
          submitted_at: "2024-01-15T10:30:00Z",
          file_url: "/mock-submission.pdf",
          file_name: "assignment_alice.pdf",
          grade: 85,
          feedback: "Good work overall!"
        }
      },
      {
        id: 2,
        full_name: "Bob Smith",
        email: "bob@school.edu",
        submission: {
          id: 2,
          submitted_at: "2024-01-14T14:20:00Z",
          file_url: "/mock-submission2.pdf",
          file_name: "assignment_bob.pdf"
        }
      },
      {
        id: 3,
        full_name: "Carol Davis",
        email: "carol@school.edu"
      },
      {
        id: 4,
        full_name: "David Wilson",
        email: "david@school.edu",
        submission: {
          id: 4,
          submitted_at: "2024-01-16T09:15:00Z",
          file_url: "/mock-submission3.pdf",
          file_name: "assignment_david.pdf",
          grade: 92
        }
      }
    ];
    setStudents(mockStudents);
  }, []);

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
      setFeedback(student.submission.feedback || "");
      setIsGradingOpen(true);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks: BlobPart[] = [];

      recorder.ondataavailable = (e) => chunks.push(e.data);
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/wav' });
        setAudioBlob(blob);
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      mediaRecorder.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
    }
  };

  const handleSaveGrade = () => {
    // Save grade and feedback logic here
    console.log('Saving grade:', grade, 'feedback:', feedback);
    setIsGradingOpen(false);
  };

  return (
    <section className="flex flex-col h-full w-full bg-gradient-to-br from-green-50/30 to-blue-50/20">
      {/* Header */}
      <div className="flex items-center justify-between bg-gradient-to-r from-green-600 via-green-700 to-blue-700 px-8 py-6 shadow-xl">
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
              <p className="text-green-100 text-sm mt-1">{assignment.course.name}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-8 space-y-6 overflow-auto">
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
          <Button className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-lg">
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
                            <AvatarImage src={student.avatar} alt={student.full_name} />
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
                  <p className="text-gray-600 mb-2">{selectedSubmission?.submission.file_name}</p>
                  <Button variant="outline" size="sm">
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
                  <div className="flex items-center gap-2">
                    <Button
                      variant={isRecording ? "destructive" : "outline"}
                      size="sm"
                      onClick={isRecording ? stopRecording : startRecording}
                    >
                      {isRecording ? (
                        <>
                          <MicOff className="h-4 w-4 mr-2" />
                          Stop Recording
                        </>
                      ) : (
                        <>
                          <Mic className="h-4 w-4 mr-2" />
                          Start Recording
                        </>
                      )}
                    </Button>
                    {audioBlob && (
                      <Button variant="ghost" size="sm">
                        <Play className="h-4 w-4 mr-2" />
                        Play
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsGradingOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveGrade} className="bg-green-600 hover:bg-green-700">
              <Save className="h-4 w-4 mr-2" />
              Save Grade
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}