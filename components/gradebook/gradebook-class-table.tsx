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
  layoutMode?: 'table' | 'grid' | 'compact';
  columnCounts?: {
    test: number;
    quiz: number;
    homework: number;
    participation: number;
    other: number;
  };
}

interface ApiStudent {
  student: number;
  student_name: string;
  student_email: string;
  student_average: string;
  submissions: {
    assessment: number;
    assessment_name: string;
    assessment_type: string;
    score: number;
    voice_note: string | null;
    marked: boolean;
    submission_id: number;
  }[];
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
  submissionsMap: Map<
    string,
    { submissionId: number; voiceNote: string | null }
  >; // Map assessment key to submission data
  assessmentNames: {
    test: string[];
    homework: string[];
    quiz: string[];
    participation: string[];
    other: string[];
  }; // Store actual assessment names
}

export function GradebookClassTable({
  classData,
  onBack,
  layoutMode = 'table',
  columnCounts,
}: GradebookClassTableProps) {
  const [students, setStudents] = useState<StudentGrade[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingCell, setEditingCell] = useState<string | null>(null);

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
    assessmentIndex: number,
    voiceNotesUrl?: string
  ) => {
    // Update the local state with the new voice note URL
    setStudents((prevStudents) =>
      prevStudents.map((student) => {
        if (student.id === studentId) {
          const updatedStudent = { ...student };
          const submissionKey = `${assessmentType}-${assessmentIndex}`;
          const currentSubmission =
            updatedStudent.submissionsMap.get(submissionKey);

          if (currentSubmission) {
            updatedStudent.submissionsMap.set(submissionKey, {
              ...currentSubmission,
              voiceNote: voiceNotesUrl || currentSubmission.voiceNote,
            });
          }

          return updatedStudent;
        }
        return student;
      })
    );
  };

  const hasVoiceRecording = (
    studentId: string,
    assessmentType: string,
    assessmentIndex: number
  ) => {
    const student = students.find((s) => s.id === studentId);
    if (!student) return false;

    const submissionKey = `${assessmentType}-${assessmentIndex}`;
    const submissionData = student.submissionsMap.get(submissionKey);
    return !!submissionData?.voiceNote;
  };

  const getAudioUrl = (
    studentId: string,
    assessmentType: string,
    assessmentIndex: number
  ) => {
    const student = students.find((s) => s.id === studentId);
    if (!student) return undefined;

    const submissionKey = `${assessmentType}-${assessmentIndex}`;
    const submissionData = student.submissionsMap.get(submissionKey);
    // console.log("Submission Data:", submissionData);
    return submissionData?.voiceNote || undefined;
  };

  const getSubmissionId = (
    studentId: string,
    assessmentType: string,
    assessmentIndex: number
  ) => {
    const student = students.find((s) => s.id === studentId);
    if (!student) return undefined;

    const submissionKey = `${assessmentType}-${assessmentIndex}`;
    const submissionData = student.submissionsMap.get(submissionKey);
    return submissionData?.submissionId;
  };

  const handleGradeUpdate = async (
    studentId: string,
    assessmentType: string,
    assessmentIndex: number,
    newGrade: number
  ) => {
    try {
      const submissionId = getSubmissionId(
        studentId,
        assessmentType,
        assessmentIndex
      );
      if (!submissionId) {
        console.error("❌ No submission ID found for this assessment:", {
          studentId,
          assessmentType,
          assessmentIndex,
        });
        alert(
          "Unable to update grade: No submission data found. Please refresh the page and try again."
        );
        return;
      }

      console.log("🔄 Updating grade with submission-based approach:", {
        submissionId,
        assessmentType,
        assessmentIndex,
        newGrade,
      });

      await updateStudentGrade(
        tenantPrimaryDomain,
        accessToken,
        submissionId,
        // assessmentType,
        // assessmentIndex,
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
        console.log("API Data: " + classData.id, apiData);

        const formattedStudents = apiData
          .map((student) => {
            if (!student?.student_name || !student?.submissions) {
              console.warn("Invalid student data:", student);
              return null;
            }

            // Group submissions by assessment type
            const groupedAssessments = {
              test: [] as number[],
              homework: [] as number[],
              quiz: [] as number[],
              participation: [] as number[],
              other: [] as number[],
            };

            // Store assessment names for each type
            const assessmentNames = {
              test: [] as string[],
              homework: [] as string[],
              quiz: [] as string[],
              participation: [] as string[],
              other: [] as string[],
            };

            // Create a map to store submission metadata (submission_id, voice_note)
            const submissionsMap = new Map<
              string,
              { submissionId: number; voiceNote: string | null }
            >();

            // Group assessments by type and index, and track submission metadata
            const assessmentIndexMap = {
              test: new Map<string, number>(),
              homework: new Map<string, number>(),
              quiz: new Map<string, number>(),
              participation: new Map<string, number>(),
              other: new Map<string, number>(),
            };

            student.submissions.forEach((submission) => {
              const assessmentType = submission.assessment_type.toLowerCase();
              if (groupedAssessments.hasOwnProperty(assessmentType)) {
                const typeKey =
                  assessmentType as keyof typeof groupedAssessments;

                // Get or create index for this assessment name
                let assessmentIndex = assessmentIndexMap[typeKey].get(
                  submission.assessment_name
                );
                if (assessmentIndex === undefined) {
                  assessmentIndex = groupedAssessments[typeKey].length;
                  assessmentIndexMap[typeKey].set(
                    submission.assessment_name,
                    assessmentIndex
                  );
                  groupedAssessments[typeKey].push(submission.score);
                  assessmentNames[typeKey].push(submission.assessment_name); // Store the assessment name
                } else {
                  // Update existing entry (in case of duplicates)
                  groupedAssessments[typeKey][assessmentIndex] =
                    submission.score;
                }

                // Store submission metadata
                const submissionKey = `${assessmentType}-${assessmentIndex}`;
                submissionsMap.set(submissionKey, {
                  submissionId: submission.submission_id,
                  voiceNote: submission.voice_note,
                });
              }
            });

            return {
              id: student.student.toString(),
              name: student.student_name,
              average: parseFloat(student.student_average) || 0,
              assessments: groupedAssessments,
              submissionsMap,
              assessmentNames,
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

    fetchStudents();
  }, [classData.id, tenantPrimaryDomain, accessToken, refreshToken]);

  if (loading) {
    if (layoutMode === 'grid') {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <div className="flex items-center gap-4 mb-4">
                <Skeleton className="w-12 h-12 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-5 w-12" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {[...Array(4)].map((_, j) => (
                    <Skeleton key={j} className="h-12 rounded-lg" />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      );
    }
    if (layoutMode === 'compact') {
      return (
        <div className="space-y-2">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Skeleton className="w-8 h-8 rounded-full" />
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  {[...Array(5)].map((_, j) => (
                    <Skeleton key={j} className="h-8 w-12" />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      );
    }
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-12 w-full rounded-md" />
        ))}
      </div>
    );
  }

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

  // Get unique assessment names for each type across all students
  const getAssessmentNames = (
    assessmentType: keyof StudentGrade["assessments"]
  ) => {
    const allNames = new Set<string>();
    const nameToIndexMap = new Map<string, number>();

    students.forEach((student) => {
      student.assessmentNames[assessmentType].forEach((name, index) => {
        if (!nameToIndexMap.has(name)) {
          nameToIndexMap.set(name, allNames.size);
          allNames.add(name);
        }
      });
    });

    return Array.from(allNames);
  };

  const maxTestCols = getMaxLength("test");
  const maxQuizCols = getMaxLength("quiz");
  const maxHomeworkCols = getMaxLength("homework");
  const maxParticipationCols = getMaxLength("participation");
  const maxOtherCols = getMaxLength("other");

  // Get assessment names for headers
  const testNames = getAssessmentNames("test");
  const quizNames = getAssessmentNames("quiz");
  const homeworkNames = getAssessmentNames("homework");
  const participationNames = getAssessmentNames("participation");
  const otherNames = getAssessmentNames("other");

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

  if (layoutMode === 'grid') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {students.map((student) => (
          <div key={student.id} className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold" style={{ background: '#0394fc' }}>
                {student.name.charAt(0)}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{student.name}</h3>
                <p className="text-sm text-gray-500">ID: {student.id}</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Overall Average</span>
                <span className="font-bold text-lg" style={{ color: '#0394fc' }}>{student.average.toFixed(1)}%</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-blue-50 p-2 rounded-lg text-center">
                  <p className="font-semibold text-blue-700">{student.assessments.test.filter(g => g !== undefined).length}</p>
                  <p className="text-blue-600">Tests</p>
                </div>
                <div className="bg-green-50 p-2 rounded-lg text-center">
                  <p className="font-semibold text-green-700">{student.assessments.homework.filter(g => g !== undefined).length}</p>
                  <p className="text-green-600">Homework</p>
                </div>
                <div className="bg-purple-50 p-2 rounded-lg text-center">
                  <p className="font-semibold text-purple-700">{student.assessments.quiz.filter(g => g !== undefined).length}</p>
                  <p className="text-purple-600">Quizzes</p>
                </div>
                <div className="bg-orange-50 p-2 rounded-lg text-center">
                  <p className="font-semibold text-orange-700">{student.assessments.participation.filter(g => g !== undefined).length}</p>
                  <p className="text-orange-600">Participation</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (layoutMode === 'compact') {
    return (
      <div className="space-y-2">
        {students.map((student) => (
          <div key={student.id} className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-all duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold" style={{ background: '#0394fc' }}>
                  {student.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{student.name}</h3>
                  <p className="text-xs text-gray-500">ID: {student.id}</p>
                </div>
              </div>
              <div className="flex items-center gap-6 text-sm">
                <div className="text-center">
                  <p className="font-semibold text-blue-600">{student.assessments.test.filter(g => g !== undefined).length}</p>
                  <p className="text-xs text-gray-500">Tests</p>
                </div>
                <div className="text-center">
                  <p className="font-semibold text-green-600">{student.assessments.homework.filter(g => g !== undefined).length}</p>
                  <p className="text-xs text-gray-500">HW</p>
                </div>
                <div className="text-center">
                  <p className="font-semibold text-purple-600">{student.assessments.quiz.filter(g => g !== undefined).length}</p>
                  <p className="text-xs text-gray-500">Quiz</p>
                </div>
                <div className="text-center">
                  <p className="font-semibold text-orange-600">{student.assessments.participation.filter(g => g !== undefined).length}</p>
                  <p className="text-xs text-gray-500">Part</p>
                </div>
                <div className="text-center bg-gray-50 px-3 py-1 rounded-lg">
                  <p className="font-bold text-lg text-gray-900">{student.average.toFixed(1)}%</p>
                  <p className="text-xs text-gray-500">Average</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

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
                {/* <TableHead
                  rowSpan={2}
                  className="w-[150px] font-semibold text-gray-700 sticky right-0 bg-gray-50 z-20 border-l border-gray-200"
                >
                  ACTIONS
                </TableHead> */}
              </TableRow>
              <TableRow className="bg-gray-50">
                {/* Dynamic Test Headers */}
                {Array.from({ length: maxTestCols }, (_, i) => (
                  <TableHead
                    key={`test-header-${i}`}
                    className="text-xs font-medium text-gray-500 min-w-[80px]"
                  >
                    {testNames[i] || `Test ${i + 1}`}
                  </TableHead>
                ))}
                {/* Dynamic Quiz Headers */}
                {Array.from({ length: maxQuizCols }, (_, i) => (
                  <TableHead
                    key={`quiz-header-${i}`}
                    className="text-xs font-medium text-gray-500 min-w-[80px]"
                  >
                    {quizNames[i] || `Quiz ${i + 1}`}
                  </TableHead>
                ))}
                {/* Dynamic Homework Headers */}
                {Array.from({ length: maxHomeworkCols }, (_, i) => (
                  <TableHead
                    key={`homework-header-${i}`}
                    className="text-xs font-medium text-gray-500 min-w-[80px]"
                  >
                    {homeworkNames[i] || `HW ${i + 1}`}
                  </TableHead>
                ))}
                {/* Dynamic Participation Headers */}
                {Array.from({ length: maxParticipationCols }, (_, i) => (
                  <TableHead
                    key={`participation-header-${i}`}
                    className="text-xs font-medium text-gray-500 min-w-[90px]"
                  >
                    {participationNames[i] || `Part ${i + 1}`}
                  </TableHead>
                ))}
                {/* Dynamic Other Headers */}
                {Array.from({ length: maxOtherCols }, (_, i) => (
                  <TableHead
                    key={`other-header-${i}`}
                    className="text-xs font-medium text-gray-500 min-w-[80px]"
                  >
                    {otherNames[i] || `Other ${i + 1}`}
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
                        submissionId={getSubmissionId(student.id, "test", i)}
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
                        onRecordingSaved={(voiceNotesUrl) =>
                          handleRecordingSaved(
                            student.id,
                            "test",
                            i,
                            voiceNotesUrl
                          )
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
                        submissionId={getSubmissionId(student.id, "quiz", i)}
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
                        onRecordingSaved={(voiceNotesUrl) =>
                          handleRecordingSaved(
                            student.id,
                            "quiz",
                            i,
                            voiceNotesUrl
                          )
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
                        submissionId={getSubmissionId(
                          student.id,
                          "homework",
                          i
                        )}
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
                        onRecordingSaved={(voiceNotesUrl) =>
                          handleRecordingSaved(
                            student.id,
                            "homework",
                            i,
                            voiceNotesUrl
                          )
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
                        submissionId={getSubmissionId(
                          student.id,
                          "participation",
                          i
                        )}
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
                        onRecordingSaved={(voiceNotesUrl) =>
                          handleRecordingSaved(
                            student.id,
                            "participation",
                            i,
                            voiceNotesUrl
                          )
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
                        submissionId={getSubmissionId(student.id, "other", i)}
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
                        onRecordingSaved={(voiceNotesUrl) =>
                          handleRecordingSaved(
                            student.id,
                            "other",
                            i,
                            voiceNotesUrl
                          )
                        }
                        audioUrl={getAudioUrl(student.id, "other", i)}
                      />
                    </TableCell>
                  ))}

                  {/* <TableCell className="w-[150px] sticky right-0 bg-white z-10 border-l border-gray-200">
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
                  </TableCell> */}
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
  submissionId?: number;
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
  onRecordingSaved: (voiceNotesUrl?: string) => void;
  audioUrl?: string; // Direct audio URL for inline playback
}

function GradeCell({
  value,
  studentId,
  submissionId,
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
        {submissionId ? (
          <RecordDialog
            studentId={studentId}
            submissionId={submissionId}
            assessmentType={assessmentType}
            assessmentIndex={assessmentIndex}
            onRecordingSaved={onRecordingSaved}
            hasExistingRecording={hasVoiceRecording}
            voiceUrl={audioUrl}
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
        ) : (
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 opacity-50 cursor-not-allowed"
            disabled
            title="No submission data available for voice recording"
          >
            <Mic className="h-4 w-4 text-gray-300" />
          </Button>
        )}
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
      {submissionId ? (
        <RecordDialog
          studentId={studentId}
          submissionId={submissionId}
          assessmentType={assessmentType}
          assessmentIndex={assessmentIndex}
          onRecordingSaved={onRecordingSaved}
          hasExistingRecording={hasVoiceRecording}
          voiceUrl={audioUrl}
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
              } hover:text-blue-500`}
            />
          </Button>
        </RecordDialog>
      ) : (
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 opacity-50 cursor-not-allowed"
          disabled
          title="No submission data available for voice recording"
        >
          <Mic className="h-4 w-4 text-gray-300" />
        </Button>
      )}
    </div>
  );
}
