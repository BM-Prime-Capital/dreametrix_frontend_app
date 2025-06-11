"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertCircle,
  Eye,
  File,
  Mic,
  Pencil,
  Trash2,
  Play,
  Pause,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { RecordDialog } from "./RecordDialog";
import {
  getGradeBookFocusList,
  updateStudentGrade,
  getVoiceRecordings,
  getVoiceRecordingAudio,
} from "@/services/GradebooksService";
import { localStorageKey } from "@/constants/global";
import { Input } from "@/components/ui/input";
import { ClassData } from "../types/gradebook";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface GradebookClassTableProps {
  classData: ClassData;
  onBack: () => void;
  columnCounts?: {
    test: number;
    quiz: number;
    homework: number;
    participation: number;
    other: number;
  };
}

interface ApiStudent {
  student_name: string;
  student_id: number;
  average_grade: number;
  assessment_types: {
    test: number[];
    homework: number[];
    quiz: number[];
    participation: number[];
    other: number[];
  };
}

interface StudentGrade {
  id: string;
  name: string;
  average: number;
  assessments: {
    test: number[];
    homework: number[];
    quiz: number[];
    participation: number[];
    other: number[];
  };
}

export function GradebookClassTable({
  classData,
  onBack,
  columnCounts,
}: GradebookClassTableProps) {
  const [students, setStudents] = useState<StudentGrade[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingCell, setEditingCell] = useState<string | null>(null);
  const [voiceRecordings, setVoiceRecordings] = useState<Set<string>>(
    new Set()
  );
  const [audioUrls, setAudioUrls] = useState<Map<string, string>>(new Map());

  const accessToken: any = localStorage.getItem(localStorageKey.ACCESS_TOKEN);
  const refreshToken: any = localStorage.getItem(localStorageKey.REFRESH_TOKEN);

  const currentClassStr = localStorage.getItem(
    localStorageKey.CURRENT_SELECTED_CLASS
  );
  const currentClass = currentClassStr ? JSON.parse(currentClassStr) : null;

  console.log("currentClass", currentClass);

  const tenantData: any = localStorage.getItem(localStorageKey.TENANT_DATA);
  const { primary_domain } = JSON.parse(tenantData);
  const tenantPrimaryDomain = `https://${primary_domain}`;

  const handleRecordingSaved = (
    studentId: string,
    assessmentType: string,
    assessmentIndex: number
  ) => {
    const recordingKey = `${studentId}-${assessmentType}-${assessmentIndex}`;
    setVoiceRecordings((prev) => new Set([...prev, recordingKey]));
  };

  const hasVoiceRecording = (
    studentId: string,
    assessmentType: string,
    assessmentIndex: number
  ) => {
    const recordingKey = `${studentId}-${assessmentType}-${assessmentIndex}`;
    return voiceRecordings.has(recordingKey);
  };

  const getAudioUrl = (
    studentId: string,
    assessmentType: string,
    assessmentIndex: number
  ) => {
    const recordingKey = `${studentId}-${assessmentType}-${assessmentIndex}`;
    return audioUrls.get(recordingKey);
  };

  const handleGradeUpdate = async (
    studentId: string,
    assessmentType: string,
    assessmentIndex: number,
    newGrade: number
  ) => {
    try {
      await updateStudentGrade(
        tenantPrimaryDomain,
        accessToken,
        parseInt(studentId),
        assessmentType,
        assessmentIndex,
        newGrade,
        refreshToken
      );

      // Update local state
      setStudents((prevStudents) =>
        prevStudents.map((student) => {
          if (student.id === studentId) {
            const updatedStudent = { ...student };
            updatedStudent.assessments[
              assessmentType as keyof typeof updatedStudent.assessments
            ][assessmentIndex] = newGrade;

            // Recalculate average (simple average for now)
            const allGrades = Object.values(updatedStudent.assessments)
              .flat()
              .filter((grade) => grade !== undefined && grade !== null);
            const average =
              allGrades.length > 0
                ? allGrades.reduce((sum, grade) => sum + grade, 0) /
                  allGrades.length
                : 0;
            updatedStudent.average = average;

            return updatedStudent;
          }
          return student;
        })
      );
    } catch (error) {
      console.error("Error updating grade:", error);
      // You might want to show a toast notification here
    }
  };

  useEffect(() => {
    async function fetchStudents() {
      try {
        const response = await getGradeBookFocusList(
          tenantPrimaryDomain,
          accessToken,
          classData.id,
          refreshToken
        );

        if (!Array.isArray(response)) {
          throw new Error("Invalid API response structure: Expected array");
        }

        const apiData = response as ApiStudent[];
        console.log("API Data:", apiData);
        const formattedStudents = apiData
          .map((student) => {
            if (!student?.student_name || !student?.assessment_types) {
              console.warn("Invalid student data:", student);
              return null;
            }
            return {
              id: student.student_id?.toString() || "unknown-id",
              name: student.student_name,
              average: student.average_grade || 0,
              assessments: {
                test: student.assessment_types.test || [],
                homework: student.assessment_types.homework || [],
                quiz: student.assessment_types.quiz || [],
                participation: student.assessment_types.participation || [],
                other: student.assessment_types.other || [],
              },
            };
          })
          .filter(Boolean) as StudentGrade[];

        setStudents(formattedStudents);
        setLoading(false);
      } catch (err: any) {
        console.error("Fetch error details:", err);
        setError(err.message || "Error loading data");
        setLoading(false);
      }
    }

    async function loadExistingVoiceRecordings() {
      try {
        const response = await getVoiceRecordings(
          tenantPrimaryDomain,
          accessToken,
          classData.id,
          refreshToken
        );

        if (response.success && response.recordings) {
          const recordingKeys = response.recordings.map(
            (recording: any) =>
              `${recording.student_id}-${recording.assessment_type}-${recording.assessment_index}`
          );
          setVoiceRecordings(new Set(recordingKeys));

          // Load audio URLs for existing recordings
          const audioUrlPromises = response.recordings.map(
            async (recording: any) => {
              try {
                const audioResponse = await getVoiceRecordingAudio(
                  tenantPrimaryDomain,
                  accessToken,
                  parseInt(recording.student_id),
                  recording.assessment_type,
                  recording.assessment_index,
                  refreshToken
                );

                if (audioResponse.success && audioResponse.audioUrl) {
                  const recordingKey = `${recording.student_id}-${recording.assessment_type}-${recording.assessment_index}`;
                  return { recordingKey, audioUrl: audioResponse.audioUrl };
                }
              } catch (error) {
                console.error(
                  "Error loading audio URL for recording:",
                  recording,
                  error
                );
              }
              return null;
            }
          );

          // Wait for all audio URLs to load
          const audioResults = await Promise.all(audioUrlPromises);
          const newAudioUrls = new Map();

          audioResults.forEach((result) => {
            if (result) {
              newAudioUrls.set(result.recordingKey, result.audioUrl);
            }
          });

          setAudioUrls(newAudioUrls);
        }
      } catch (err: any) {
        console.error("Error loading voice recordings:", err);
        // Don't show error to user for voice recordings, just log it
      }
    }

    fetchStudents();
    loadExistingVoiceRecordings();
  }, [classData.id, tenantPrimaryDomain, accessToken, refreshToken]);

  if (loading)
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-12 w-full rounded-md" />
        ))}
      </div>
    );

  if (error)
    return (
      <div className="bg-red-50 p-4 rounded-md border border-red-200 text-red-600 flex items-center gap-3">
        <AlertCircle className="w-5 h-5" />
        <div>
          <p className="font-medium">Error loading data</p>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );

  // Calculate maximum column counts for dynamic rendering
  // Use provided columnCounts if available, otherwise calculate dynamically
  const getMaxLength = (assessmentType: keyof StudentGrade["assessments"]) => {
    if (columnCounts && columnCounts[assessmentType]) {
      return columnCounts[assessmentType];
    }
    if (students.length === 0) return 1;
    return Math.max(
      ...students.map((s) => s.assessments[assessmentType].length),
      1
    );
  };

  const maxTestCols = getMaxLength("test");
  const maxQuizCols = getMaxLength("quiz");
  const maxHomeworkCols = getMaxLength("homework");
  const maxParticipationCols = getMaxLength("participation");
  const maxOtherCols = getMaxLength("other");

  // Log dynamic column info for debugging
  console.log("📊 Dynamic column counts:", {
    tests: maxTestCols,
    quizzes: maxQuizCols,
    homework: maxHomeworkCols,
    participation: maxParticipationCols,
    other: maxOtherCols,
    totalStudents: students.length,
    usingProvidedCounts: !!columnCounts,
    providedCounts: columnCounts,
  });

  return (
    <TooltipProvider>
      <div className="w-full">
        <div className="rounded-lg border shadow-sm bg-white">
          <Table>
            <TableHeader className="bg-gray-50">
              <TableRow>
                <TableHead
                  rowSpan={2}
                  className="w-[120px] sticky left-0 bg-gray-50 z-20 text-center font-semibold text-gray-700 border-r border-gray-200"
                >
                  STUDENT
                </TableHead>
                <TableHead
                  rowSpan={2}
                  className="w-[90px] sticky left-[120px] bg-gray-50 z-20 text-center font-semibold text-gray-700 border-r border-gray-200"
                >
                  AVERAGE
                </TableHead>
                <TableHead
                  colSpan={maxTestCols}
                  className="text-center font-semibold text-gray-700 min-w-[100px]"
                >
                  TESTS
                </TableHead>
                <TableHead
                  colSpan={maxQuizCols}
                  className="text-center font-semibold text-gray-700 min-w-[100px]"
                >
                  QUIZZES
                </TableHead>
                <TableHead
                  colSpan={maxHomeworkCols}
                  className="text-center font-semibold text-gray-700 min-w-[100px]"
                >
                  HOMEWORK
                </TableHead>
                <TableHead
                  colSpan={maxParticipationCols}
                  className="text-center font-semibold text-gray-700 min-w-[120px]"
                >
                  PARTICIPATION
                </TableHead>
                <TableHead
                  colSpan={maxOtherCols}
                  className="text-center font-semibold text-gray-700 min-w-[100px]"
                >
                  OTHER
                </TableHead>
                <TableHead
                  rowSpan={2}
                  className="w-[150px] font-semibold text-gray-700 sticky right-0 bg-gray-50 z-20 border-l border-gray-200"
                >
                  ACTIONS
                </TableHead>
              </TableRow>
              <TableRow className="bg-gray-50">
                {/* Dynamic Test Headers */}
                {Array.from({ length: maxTestCols }, (_, i) => (
                  <TableHead
                    key={`test-header-${i}`}
                    className="text-xs font-medium text-gray-500 min-w-[80px]"
                  >
                    Test {i + 1}
                  </TableHead>
                ))}
                {/* Dynamic Quiz Headers */}
                {Array.from({ length: maxQuizCols }, (_, i) => (
                  <TableHead
                    key={`quiz-header-${i}`}
                    className="text-xs font-medium text-gray-500 min-w-[80px]"
                  >
                    Quiz {i + 1}
                  </TableHead>
                ))}
                {/* Dynamic Homework Headers */}
                {Array.from({ length: maxHomeworkCols }, (_, i) => (
                  <TableHead
                    key={`homework-header-${i}`}
                    className="text-xs font-medium text-gray-500 min-w-[80px]"
                  >
                    HW {i + 1}
                  </TableHead>
                ))}
                {/* Dynamic Participation Headers */}
                {Array.from({ length: maxParticipationCols }, (_, i) => (
                  <TableHead
                    key={`participation-header-${i}`}
                    className="text-xs font-medium text-gray-500 min-w-[90px]"
                  >
                    Part {i + 1}
                  </TableHead>
                ))}
                {/* Dynamic Other Headers */}
                {Array.from({ length: maxOtherCols }, (_, i) => (
                  <TableHead
                    key={`other-header-${i}`}
                    className="text-xs font-medium text-gray-500 min-w-[80px]"
                  >
                    Other {i + 1}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map((student) => (
                <TableRow key={student.id} className="hover:bg-gray-50/50">
                  <TableCell className="font-medium sticky left-0 bg-white z-10 w-[120px] truncate border-r border-gray-200">
                    {student.name}
                  </TableCell>

                  <TableCell className="text-center w-[90px] sticky left-[120px] bg-white z-10 border-r border-gray-200">
                    <Badge
                      variant={
                        student.average >= 70
                          ? "default"
                          : student.average >= 50
                          ? "secondary"
                          : "destructive"
                      }
                      className={
                        student.average >= 70
                          ? "bg-green-100 text-green-800"
                          : student.average >= 50
                          ? "bg-yellow-100 text-yellow-800"
                          : ""
                      }
                    >
                      {student.average.toFixed(1)}
                    </Badge>
                  </TableCell>

                  {/* Dynamic Test Cells */}
                  {Array.from({ length: maxTestCols }, (_, i) => (
                    <TableCell
                      key={`test-${i}`}
                      className="text-center min-w-[80px]"
                    >
                      <GradeCell
                        value={student.assessments.test[i]}
                        studentId={student.id}
                        assessmentType="test"
                        assessmentIndex={i}
                        cellId={`${student.id}-test-${i}`}
                        editingCell={editingCell}
                        setEditingCell={setEditingCell}
                        onGradeUpdate={handleGradeUpdate}
                        hasVoiceRecording={hasVoiceRecording(
                          student.id,
                          "test",
                          i
                        )}
                        onRecordingSaved={() =>
                          handleRecordingSaved(student.id, "test", i)
                        }
                        audioUrl={getAudioUrl(student.id, "test", i)}
                      />
                    </TableCell>
                  ))}

                  {/* Dynamic Quiz Cells */}
                  {Array.from({ length: maxQuizCols }, (_, i) => (
                    <TableCell
                      key={`quiz-${i}`}
                      className="text-center min-w-[80px]"
                    >
                      <GradeCell
                        value={student.assessments.quiz[i]}
                        studentId={student.id}
                        assessmentType="quiz"
                        assessmentIndex={i}
                        cellId={`${student.id}-quiz-${i}`}
                        editingCell={editingCell}
                        setEditingCell={setEditingCell}
                        onGradeUpdate={handleGradeUpdate}
                        hasVoiceRecording={hasVoiceRecording(
                          student.id,
                          "quiz",
                          i
                        )}
                        onRecordingSaved={() =>
                          handleRecordingSaved(student.id, "quiz", i)
                        }
                        audioUrl={getAudioUrl(student.id, "quiz", i)}
                      />
                    </TableCell>
                  ))}

                  {/* Dynamic Homework Cells */}
                  {Array.from({ length: maxHomeworkCols }, (_, i) => (
                    <TableCell
                      key={`homework-${i}`}
                      className="text-center min-w-[80px]"
                    >
                      <GradeCell
                        value={student.assessments.homework[i]}
                        studentId={student.id}
                        assessmentType="homework"
                        assessmentIndex={i}
                        cellId={`${student.id}-homework-${i}`}
                        editingCell={editingCell}
                        setEditingCell={setEditingCell}
                        onGradeUpdate={handleGradeUpdate}
                        hasVoiceRecording={hasVoiceRecording(
                          student.id,
                          "homework",
                          i
                        )}
                        onRecordingSaved={() =>
                          handleRecordingSaved(student.id, "homework", i)
                        }
                        audioUrl={getAudioUrl(student.id, "homework", i)}
                      />
                    </TableCell>
                  ))}

                  {/* Dynamic Participation Cells */}
                  {Array.from({ length: maxParticipationCols }, (_, i) => (
                    <TableCell
                      key={`participation-${i}`}
                      className="text-center min-w-[90px]"
                    >
                      <GradeCell
                        value={student.assessments.participation[i]}
                        studentId={student.id}
                        assessmentType="participation"
                        assessmentIndex={i}
                        cellId={`${student.id}-participation-${i}`}
                        editingCell={editingCell}
                        setEditingCell={setEditingCell}
                        onGradeUpdate={handleGradeUpdate}
                        hasVoiceRecording={hasVoiceRecording(
                          student.id,
                          "participation",
                          i
                        )}
                        onRecordingSaved={() =>
                          handleRecordingSaved(student.id, "participation", i)
                        }
                        audioUrl={getAudioUrl(student.id, "participation", i)}
                      />
                    </TableCell>
                  ))}

                  {/* Dynamic Other Cells */}
                  {Array.from({ length: maxOtherCols }, (_, i) => (
                    <TableCell
                      key={`other-${i}`}
                      className="text-center min-w-[80px]"
                    >
                      <GradeCell
                        value={student.assessments.other[i]}
                        studentId={student.id}
                        assessmentType="other"
                        assessmentIndex={i}
                        cellId={`${student.id}-other-${i}`}
                        editingCell={editingCell}
                        setEditingCell={setEditingCell}
                        onGradeUpdate={handleGradeUpdate}
                        hasVoiceRecording={hasVoiceRecording(
                          student.id,
                          "other",
                          i
                        )}
                        onRecordingSaved={() =>
                          handleRecordingSaved(student.id, "other", i)
                        }
                        audioUrl={getAudioUrl(student.id, "other", i)}
                      />
                    </TableCell>
                  ))}

                  <TableCell className="w-[150px] sticky right-0 bg-white z-10 border-l border-gray-200">
                    <div className="flex gap-1 justify-center">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 hover:bg-blue-50"
                          >
                            <Pencil className="h-3.5 w-3.5 text-blue-600" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Edit grades</p>
                        </TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 hover:bg-red-50"
                          >
                            <Trash2 className="h-3.5 w-3.5 text-red-600" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Delete record</p>
                        </TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 hover:bg-green-50"
                          >
                            <File className="h-3.5 w-3.5 text-green-600" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>View details</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </TooltipProvider>
  );
}

interface GradeCellProps {
  value?: number;
  studentId: string;
  assessmentType: string;
  assessmentIndex: number;
  cellId: string;
  editingCell: string | null;
  setEditingCell: (cellId: string | null) => void;
  onGradeUpdate: (
    studentId: string,
    assessmentType: string,
    assessmentIndex: number,
    newGrade: number
  ) => void;
  hasVoiceRecording: boolean;
  onRecordingSaved: () => void;
  audioUrl?: string; // Direct audio URL for inline playback
}

function GradeCell({
  value,
  studentId,
  assessmentType,
  assessmentIndex,
  cellId,
  editingCell,
  setEditingCell,
  onGradeUpdate,
  hasVoiceRecording,
  onRecordingSaved,
  audioUrl,
}: GradeCellProps) {
  const [editValue, setEditValue] = useState<string>("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(
    null
  );
  const isEditing = editingCell === cellId;

  const handleCellClick = () => {
    if (!isEditing) {
      setEditValue(value?.toString() || "");
      setEditingCell(cellId);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSave();
    } else if (e.key === "Escape") {
      handleCancel();
    }
  };

  const handleSave = () => {
    const numericValue = parseFloat(editValue);
    if (!isNaN(numericValue) && numericValue >= 0 && numericValue <= 100) {
      onGradeUpdate(studentId, assessmentType, assessmentIndex, numericValue);
      setEditingCell(null);
    } else {
      // Invalid input, reset to original value
      setEditValue(value?.toString() || "");
    }
  };

  const handleCancel = () => {
    setEditValue(value?.toString() || "");
    setEditingCell(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    // Allow only numbers and decimal points
    if (/^\d*\.?\d*$/.test(inputValue) || inputValue === "") {
      setEditValue(inputValue);
    }
  };

  const handleBlur = () => {
    // Save on blur
    handleSave();
  };

  if (isEditing) {
    return (
      <div className="flex justify-center items-center gap-1">
        <Input
          type="text"
          value={editValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          className="w-16 h-8 text-center text-sm"
          placeholder="0-100"
          autoFocus
        />
      </div>
    );
  }

  if (value === undefined || value === null) {
    return (
      <div className="flex justify-center items-center gap-1">
        <span
          className="text-gray-400 cursor-pointer hover:bg-gray-100 px-2 py-1 rounded min-w-8 text-center"
          onClick={handleCellClick}
          title="Click to edit"
        >
          -
        </span>
        <RecordDialog
          studentId={studentId}
          assessmentType={assessmentType}
          assessmentIndex={assessmentIndex}
          onRecordingSaved={onRecordingSaved}
          hasExistingRecording={hasVoiceRecording}
        >
          <Button
            variant="ghost"
            size="icon"
            className={`h-6 w-6 hover:bg-gray-100 ${
              hasVoiceRecording ? "bg-red-50 hover:bg-red-100" : ""
            }`}
            aria-label={
              hasVoiceRecording
                ? "Voice note recorded - Click to view/edit"
                : "Add voice note"
            }
            title={
              hasVoiceRecording ? "🎙️ Voice note recorded" : "Add voice note"
            }
          >
            <Mic
              className={`h-4 w-4 ${
                hasVoiceRecording
                  ? "text-red-600 animate-pulse"
                  : "text-gray-500"
              }`}
            />
          </Button>
        </RecordDialog>
      </div>
    );
  }

  const colorClass =
    value >= 70
      ? "text-green-600 font-medium"
      : value >= 50
      ? "text-yellow-600"
      : "text-red-600";

  return (
    <div className="flex justify-center items-center gap-1">
      <span
        className={`${colorClass} cursor-pointer hover:bg-gray-100 px-2 py-1 rounded min-w-8 text-center`}
        onClick={handleCellClick}
        title="Click to edit"
      >
        {value}
      </span>
      <RecordDialog
        studentId={studentId}
        assessmentType={assessmentType}
        assessmentIndex={assessmentIndex}
        onRecordingSaved={onRecordingSaved}
        hasExistingRecording={hasVoiceRecording}
      >
        <Button
          variant="ghost"
          size="icon"
          className={`h-6 w-6 hover:bg-gray-100 ${
            hasVoiceRecording ? "bg-red-50 hover:bg-red-100" : ""
          }`}
          aria-label={
            hasVoiceRecording
              ? "Voice note recorded - Click to view/edit"
              : "Add voice note"
          }
          title={
            hasVoiceRecording ? "🎙️ Voice note recorded" : "Add voice note"
          }
        >
          <Mic
            className={`h-4 w-4 ${
              hasVoiceRecording ? "text-red-600 animate-pulse" : "text-gray-500"
            } hover:text-blue-500`}
          />
        </Button>
      </RecordDialog>
    </div>
  );
}
