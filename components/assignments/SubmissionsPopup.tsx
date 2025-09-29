/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
  type VisibilityState,
  type FilterFn,
} from "@tanstack/react-table";
import {
  // X,
  Search,
  ChevronLeft,
  ChevronRight,
  Download,
  User,
  Calendar,
  FileText,
  CheckCircle,
  XCircle,
  Mic,
  Play,
  // Pause,
  // Pencil,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { getSubmissions } from "@/services/AssignmentService";
import { useRequestInfo } from "@/hooks/useRequestInfo";
import { Loader } from "@/components/ui/loader";
import { RecordDialog } from "@/components/gradebook/RecordDialog";
import {
  updateStudentGrade,
  // getVoiceRecordings,
  // getVoiceRecordingAudio,
} from "@/services/GradebooksService";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { fixS3Url, S3_CONFIG } from "@/src/config/s3";

interface Submission {
  student: {
    id: number;
    user: {
      id: number;
      username: string;
      email: string;
      first_name: string;
      last_name: string;
    };
    enrollment_date: string;
  };
  has_submitted: boolean;
  submission: {
    id: number;
    student: number;
    course: number;
    assessment: number;
    file?: string;
    grade?: number;
    submitted_at?: string;
    updated_at?: string;
    marked: boolean;
    voice_notes?: string;
  } | null;
  [key: string]: any; // For unknown fields from API
}

interface SubmissionsPopupProps {
  isOpen: boolean;
  onClose: () => void;
  assessmentId: number;
  assessmentName: string;
}

const globalFilterFn: FilterFn<Submission> = (row, columnId, filterValue) => {
  const submission = row.original;
  const searchText = filterValue.toLowerCase();

  // Search in student name and email
  const studentName =
    `${submission.student.user.first_name} ${submission.student.user.last_name}`.toLowerCase();
  const studentEmail = submission.student.user.email.toLowerCase();
  const studentId = submission.student.id.toString();

  // Search in submission status
  const status = submission.has_submitted ? "submitted" : "not submitted";

  // Search in grade if available
  const grade = submission.submission?.grade?.toString() || "";

  return (
    studentName.includes(searchText) ||
    studentEmail.includes(searchText) ||
    studentId.includes(searchText) ||
    status.includes(searchText) ||
    grade.includes(searchText)
  );
};

export function SubmissionsPopup({
  isOpen,
  onClose,
  assessmentId,
  assessmentName,
}: SubmissionsPopupProps) {
  const { tenantDomain, accessToken, refreshToken } = useRequestInfo();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [editingCell, setEditingCell] = useState<string | null>(null);

  // Handle authorized file viewing
  // const handleViewFile = async (filePath: string) => {
  //   try {
  //     const response = await fetch(`${tenantDomain}${filePath}`, {
  //       method: "GET",
  //       headers: {
  //         Authorization: `Bearer ${accessToken}`,
  //         "X-Refresh-Token": refreshToken || "",
  //       },
  //     });

  //     if (!response.ok) {
  //       throw new Error(`Failed to fetch file: ${response.status}`);
  //     }

  //     const blob = await response.blob();
  //     const blobUrl = URL.createObjectURL(blob);

  //     // Open in new tab
  //     const link = document.createElement("a");
  //     link.href = blobUrl;
  //     link.target = "_blank";
  //     link.click();

  //     // Cleanup after a delay
  //     setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
  //   } catch (error) {
  //     console.error("Error viewing file:", error);
  //     // Fallback to direct URL
  //     window.open(`${tenantDomain}${filePath}`, "_blank");
  //   }
  // };

  const handleViewFile = async (filePath: string) => {
    try {
      // Correction systématique de l'URL S3
      const s3Url = fixS3Url(filePath);

      // Si c'est une URL S3 corrigée, on l'ouvre directement
      if (s3Url.includes(`s3.${S3_CONFIG.region}.amazonaws.com`)) {
        window.open(s3Url, '_blank');
        return;
      }

      // Sinon, tentative d'accès authentifié
      const response = await fetch(`${tenantDomain}${filePath}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "X-Refresh-Token": refreshToken || "",
        },
      });

      if (!response.ok) {
        // Fallback vers l'URL S3 corrigée
        window.open(s3Url, '_blank');
        return;
      }

      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      window.open(blobUrl, '_blank');
      setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);

    } catch (error) {
      console.error("Error viewing file:", error);
      // Fallback final vers l'URL S3 corrigée
      window.open(fixS3Url(filePath), '_blank');
    }
  };

  const handleRecordingSaved = (
    studentId: string,
    assessmentType: string,
    assessmentIndex: number,
    voiceNotesUrl?: string
  ) => {
    console.log("🎙️ Voice recording saved, updating local state", {
      studentId,
      voiceNotesUrl,
    });

    if (voiceNotesUrl) {
      // Update local state with the actual voice notes URL from the API response
      setSubmissions((prevSubmissions) =>
        prevSubmissions.map((submission) => {
          if (submission.student.id.toString() === studentId) {
            const updatedSubmission = { ...submission };
            if (updatedSubmission.submission) {
              updatedSubmission.submission.voice_notes = voiceNotesUrl;
            }
            return updatedSubmission;
          }
          return submission;
        })
      );
    } else {
      // Fallback: reload submissions data to get the updated voice_notes URL
      console.log("No voice URL provided, will reload on next popup open");
    }
  };

  const hasVoiceRecording = (
    studentId: string
  ) => {
    // For submissions, check if the submission has voice_notes
    const submission = submissions.find(
      (sub) => sub.student.id.toString() === studentId
    );
    return !!submission?.submission?.voice_notes;
  };

  // const getAudioUrl = (
  //   studentId: string,
  //   assessmentType: string,
  //   assessmentIndex: number
  // ) => {
  //   // For submissions, return the voice_notes URL directly from the submission
  //   const submission = submissions.find(
  //     (sub) => sub.student.id.toString() === studentId
  //   );
  //   return submission?.submission?.voice_notes;
  // };

  const getAudioUrl = (
    studentId: string,
  ) => {
    const submission = submissions.find(
      (sub) => sub.student.id.toString() === studentId
    );

    if (!submission?.submission?.voice_notes) return null;

    return fixS3Url(submission.submission.voice_notes);
  };

  const handleGradeUpdate = async (
    studentId: string,
    assessmentType: string,
    assessmentIndex: number,
    newGrade: number
  ) => {
    try {
      // Find the submission for this student
      const targetSubmission = submissions.find(
        (submission) => submission.student.id.toString() === studentId
      );

      if (!targetSubmission?.submission?.id) {
        throw new Error("Submission not found or submission ID missing");
      }

      console.log("🔄 Updating submission grade:", {
        submissionId: targetSubmission.submission.id,
        studentId,
        newGrade,
      });

      // Use the submission ID for the API call
      await updateStudentGrade(
        tenantDomain,
        accessToken,
        targetSubmission.submission.id, // Use submission ID instead of student ID
      
        newGrade,
        refreshToken
      );

      // Update local state
      setSubmissions((prevSubmissions) =>
        prevSubmissions.map((submission) => {
          if (submission.student.id.toString() === studentId) {
            const updatedSubmission = { ...submission };
            if (updatedSubmission.submission) {
              updatedSubmission.submission.grade = newGrade;
              updatedSubmission.submission.marked = true;
            } else {
              updatedSubmission.submission = {
                id: 0,
                student: submission.student.id,
                course: 0,
                assessment: assessmentIndex,
                grade: newGrade,
                marked: true,
              };
            }
            return updatedSubmission;
          }
          return submission;
        })
      );
    } catch (error) {
      console.error("Error updating grade:", error);
      // You might want to show a toast notification here
    }
  };

  // Test the API call and log the response
  useEffect(() => {
    if (isOpen && assessmentId && tenantDomain && accessToken) {
      const fetchSubmissions = async () => {
        setIsLoading(true);
        setError(null);

        try {
          const data = await getSubmissions(
            assessmentId,
            tenantDomain,
            accessToken,
            //refreshToken
          );

          // Handle different response structures
          let submissionsArray: Submission[] = [];

          if (Array.isArray(data)) {
            submissionsArray = data;
          } else if (data?.results && Array.isArray(data.results)) {
            submissionsArray = data.results;
          } else if (data?.data && Array.isArray(data.data)) {
            submissionsArray = data.data;
          } else if (data?.submissions && Array.isArray(data.submissions)) {
            submissionsArray = data.submissions;
          } else {
            // If data is an object but not an array, wrap it
            submissionsArray = data ? [data] : [];
          }

          // // Add default positive feedback to the first submission for testing purposes
          // if (submissionsArray.length > 0) {
          //   const firstSubmission = submissionsArray[0];

          //   // Initialize submission object if it's null
          //   if (!firstSubmission.submission) {
          //     firstSubmission.submission = {
          //       id: 0, // Temporary ID for testing
          //       student: firstSubmission.student.id,
          //       course: 0, // Will be set by backend
          //       assessment: assessmentId,
          //       marked: false,
          //     };
          //     console.log("🔧 Initialized submission object for first student");
          //   }

          //   // Add positive feedback if none exists
          //   if (!firstSubmission.submission.voice_notes) {
          //     // Create a mock audio URL for testing (simulate a real file path/URL)
          //     const mockAudioUrl =
          //       "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav"; // Real audio file for testing
          //     firstSubmission.submission.voice_notes = mockAudioUrl;

          //     console.log(
          //       "✅ Added default positive feedback URL to first submission"
          //     );
          //   }

          //   // Add a good grade if none exists
          //   if (!firstSubmission.submission.grade) {
          //     firstSubmission.submission.grade = 85;
          //     firstSubmission.submission.marked = true;
          //     console.log("📝 Added default grade (85) to first submission");
          //   }
          //   firstSubmission.has_submitted = true; // Mark as submitted for testing
          //   firstSubmission.submission.submitted_at = new Date().toISOString();

          //   submissionsArray[0] = firstSubmission;
          // }
          console.log("📋 Processed submissions:", submissionsArray);
          setSubmissions(submissionsArray);
        } catch (err) {
          console.error(" Error fetching submissions:", err);
          setError(
            err instanceof Error ? err.message : "Failed to fetch submissions"
          );
        } finally {
          setIsLoading(false);
        }
      };

      fetchSubmissions();

      // Load existing voice recordings for submissions - not needed since we check voice_notes directly
      // Voice recordings are already included in the submission data
    }
  }, [isOpen, assessmentId, tenantDomain, accessToken, refreshToken]);

  // Define columns based on the actual API response structure
  const columns: ColumnDef<Submission>[] = [
    {
      id: "student",
      header: "Student",
      accessorFn: (row) =>
        `${row.student.user.first_name} ${row.student.user.last_name}`,
      cell: ({ row }) => {
        const student = row.original.student;

        return (
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-gray-500" />
            <div>
              <div className="font-medium">
                {student.user.first_name} {student.user.last_name}
              </div>
              <div className="text-xs text-gray-500">
                ID: {student.id} • {student.user.email}
              </div>
            </div>
          </div>
        );
      },
    },
    {
      id: "submitted_at",
      header: "Submitted At",
      accessorFn: (row) => row.submission?.submitted_at,
      cell: ({ row }) => {
        const submittedAt = row.original.submission?.submitted_at;
        return submittedAt ? (
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <div className="whitespace-nowrap">
              {new Date(submittedAt).toLocaleDateString()}
              <div className="text-xs text-gray-500">
                {new Date(submittedAt).toLocaleTimeString()}
              </div>
            </div>
          </div>
        ) : (
          <span className="text-gray-400">Not submitted</span>
        );
      },
    },
    {
      id: "status",
      header: "Status",
      accessorFn: (row) => row.has_submitted,
      cell: ({ row }) => {
        const hasSubmitted = row.original.has_submitted;
        //const submission = row.original.submission;

        return (
          <div className="flex items-center gap-2">
            {hasSubmitted ? (
              <CheckCircle className="h-4 w-4 text-green-500" />
            ) : (
              <XCircle className="h-4 w-4 text-gray-400" />
            )}
            <Badge
              variant={hasSubmitted ? "default" : "secondary"}
              className={
                hasSubmitted
                  ? "bg-green-100 text-green-800 border-green-200"
                  : "bg-gray-100 text-gray-600"
              }
            >
              {hasSubmitted ? "Submitted" : "Not Submitted"}
            </Badge>
          </div>
        );
      },
    },
    {
      id: "grade",
      header: "Grade",
      accessorFn: (row) => row.submission?.grade,
      cell: ({ row }) => {
        const submission = row.original;
        const hasSubmitted = submission.has_submitted;

        // Only show grade cell if student has submitted
        if (!hasSubmitted || !submission.submission) {
          return <span className="text-gray-400">Not submitted</span>;
        }

        return (
          <GradeCell
            value={submission.submission.grade}
            studentId={submission.student.id.toString()}
            submissionId={submission.submission.id} // Pass submission ID for API calls
            assessmentType="submission"
            assessmentIndex={assessmentId}
            cellId={`${submission.student.id}-submission-${assessmentId}`}
            editingCell={editingCell}
            setEditingCell={setEditingCell}
            onGradeUpdate={handleGradeUpdate}
            hasVoiceRecording={hasVoiceRecording(
              submission.student.id.toString(),
              //"submission",
             //assessmentId
            )}
            onRecordingSaved={(voiceNotesUrl) =>
              handleRecordingSaved(
                submission.student.id.toString(),
                "submission",
                assessmentId,
                voiceNotesUrl
              )
            }
            audioUrl={
              getAudioUrl(
                submission.student.id.toString(),
                // "submission",
                // assessmentId
              ) ?? undefined
            }
          />
        );
      },
    },
    // {
    //   id: "submission",
    //   header: "Submission",
    //   accessorFn: (row) => row.submission?.file,
    //   cell: ({ row }) => {
    //     const submission = row.original.submission;

    //     return (
    //       <div className="flex items-center gap-2">
    //         <FileText className="h-4 w-4 text-gray-500" />
    //         {submission?.file ? (
    //           <Button
    //             variant="link"
    //             onClick={() => handleViewFile(submission.file!)}
    //             className="p-0 h-auto text-blue-600 hover:underline"
    //           >
    //             View File
    //           </Button>
    //         ) : row.original.has_submitted ? (
    //           <span className="text-green-600">Submitted</span>
    //         ) : (
    //           <span className="text-gray-400">No submission</span>
    //         )}
    //       </div>
    //     );
    //   },
    // },

    {
      id: "submission",
      header: "Submission",
      accessorFn: (row) => row.submission?.file,
      cell: ({ row }) => {
        const submission = row.original.submission;

        return (
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-gray-500" />
            {submission?.file ? (
              <Button
                variant="link"
                onClick={() => handleViewFile(fixS3Url(submission.file!))}
                className="p-0 h-auto text-blue-600 hover:underline"
              >
                View File
              </Button>
            ) : row.original.has_submitted ? (
              <span className="text-green-600">Submitted</span>
            ) : (
              <span className="text-gray-400">No submission</span>
            )}
          </div>
        );
      },
    },


    // {
    //   id: "audio_feedback",
    //   header: "Audio Feedback",
    //   accessorFn: (row) => row.submission?.voice_notes,
    //   cell: ({ row }) => {
    //     const voiceNotes = row.original.submission?.voice_notes;
    //     const hasSubmitted = row.original.has_submitted;

    //     if (!hasSubmitted) {
    //       return <span className="text-gray-400">-</span>;
    //     }

    //     if (voiceNotes) {
    //       const fullAudioUrl = voiceNotes.startsWith("http")
    //         ? voiceNotes
    //         : `${tenantDomain}${voiceNotes}`;
    //       const isTestFeedback = voiceNotes?.includes("soundjay.com"); // Check if it's our test audio

    //       return (
    //         <div className="flex items-center gap-2">
    //           <Play className="h-4 w-4 text-green-600" />
    //           <div className="flex items-center gap-1">
    //             <audio controls className="h-8">
    //               <source src={fullAudioUrl} type="audio/wav" />
    //               <source src={fullAudioUrl} type="audio/mp3" />
    //               <source src={fullAudioUrl} type="audio/ogg" />
    //               Your browser does not support the audio element.
    //             </audio>
    //             {isTestFeedback && (
    //               <Badge
    //                 variant="outline"
    //                 className="text-xs text-blue-600 border-blue-200 ml-2"
    //               >
    //                 TEST
    //               </Badge>
    //             )}
    //           </div>
    //         </div>
    //       );
    //     }

    //     return <span className="text-gray-400">No audio feedback</span>;
    //   },
    // },

    {
      id: "audio_feedback",
      header: "Audio Feedback",
      accessorFn: (row) => row.submission?.voice_notes,
      cell: ({ row }) => {
        const voiceNotes = row.original.submission?.voice_notes;
        const hasSubmitted = row.original.has_submitted;

        if (!hasSubmitted) {
          return <span className="text-gray-400">-</span>;
        }

        if (voiceNotes) {
          const fullAudioUrl = fixS3Url(voiceNotes);
          const isTestFeedback = voiceNotes?.includes("soundjay.com");

          return (
            <div className="flex items-center gap-2">
              <Play className="h-4 w-4 text-green-600" />
              <div className="flex items-center gap-1">
                <audio controls className="h-8">
                  <source src={fullAudioUrl} type="audio/wav" />
                  <source src={fullAudioUrl} type="audio/mp3" />
                  <source src={fullAudioUrl} type="audio/ogg" />
                  Your browser does not support the audio element.
                </audio>
                {isTestFeedback && (
                  <Badge
                    variant="outline"
                    className="text-xs text-blue-600 border-blue-200 ml-2"
                  >
                    TEST
                  </Badge>
                )}
              </div>
            </div>
          );
        }

        return <span className="text-gray-400">No audio feedback</span>;
      },
    }
  ];

  const table = useReactTable({
    data: submissions,
    columns,
    filterFns: {
      global: globalFilterFn,
    },
    globalFilterFn: globalFilterFn,
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      globalFilter,
      columnVisibility,
    },
  });

  const handleExport = () => {
    if (submissions.length === 0) return;

    // Create CSV header
    const csvHeader = [
      "Student ID",
      "First Name",
      "Last Name",
      "Email",
      "Has Submitted",
      "Submitted At",
      "Grade",
      "Submission Type",
    ].join(",");

    // Create CSV rows
    const csvRows = submissions.map((submission: Submission) => {
      return [
        submission.student.id,
        `"${submission.student.user.first_name}"`,
        `"${submission.student.user.last_name}"`,
        `"${submission.student.user.email}"`,
        submission.has_submitted ? "Yes" : "No",
        submission.submission?.submitted_at
          ? `"${new Date(submission.submission.submitted_at).toLocaleString()}"`
          : "Not submitted",
        submission.submission?.grade || "Not graded",
        submission.submission?.file
          ? "File"
          : submission.has_submitted
          ? "Submitted"
          : "None",
      ].join(",");
    });

    const csvContent = [csvHeader, ...csvRows].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `submissions_${assessmentName}_${Date.now()}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <TooltipProvider>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-7xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>Submissions for: {assessmentName}</span>
              {/* <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button> */}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Header with filters */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="relative w-full md:w-auto md:flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Filter submissions..."
                  value={globalFilter ?? ""}
                  onChange={(event) => setGlobalFilter(event.target.value)}
                  className="pl-8 w-full md:w-[400px]"
                />
              </div>

              <div className="flex items-center gap-2">
                <Button
                  onClick={handleExport}
                  variant="outline"
                  disabled={submissions.length === 0}
                  className="bg-[#3e81d4]/10 text-[#3e81d4] hover:bg-[#3e81d4]/20 border-[#3e81d4]/20"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>

            {/* Content */}
            <div className="border rounded-lg overflow-hidden max-h-[60vh] overflow-y-auto">
              {isLoading ? (
                <div className="flex items-center justify-center p-8">
                  <Loader />
                </div>
              ) : error ? (
                <div className="text-red-500 p-4 text-center">
                  Error: {error}
                  <div className="mt-2 text-sm text-gray-600">
                    Check the console for detailed API response information
                  </div>
                </div>
              ) : (
                <>
                  <Table>
                    <TableHeader className="bg-[#3e81d4]/10">
                      {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                          {headerGroup.headers.map((header) => (
                            <TableHead
                              key={header.id}
                              className="px-4 py-3 text-left text-xs font-medium text-[#3e81d4] uppercase tracking-wider"
                            >
                              {header.isPlaceholder
                                ? null
                                : flexRender(
                                    header.column.columnDef.header,
                                    header.getContext()
                                  )}
                            </TableHead>
                          ))}
                        </TableRow>
                      ))}
                    </TableHeader>
                    <TableBody className="bg-white divide-y divide-gray-200">
                      {table.getRowModel().rows?.length ? (
                        table.getRowModel().rows.map((row) => (
                          <TableRow
                            key={row.id}
                            className="hover:bg-[#3e81d4]/5"
                          >
                            {row.getVisibleCells().map((cell) => (
                              <TableCell
                                key={cell.id}
                                className="px-4 py-3 text-sm text-gray-800"
                              >
                                {flexRender(
                                  cell.column.columnDef.cell,
                                  cell.getContext()
                                )}
                              </TableCell>
                            ))}
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell
                            colSpan={columns.length}
                            className="px-4 py-8 text-center text-sm text-gray-500"
                          >
                            {submissions.length === 0
                              ? "No submissions found."
                              : "No submissions match your filter."}
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>

                  {/* Pagination */}
                  {table.getPageCount() > 1 && (
                    <div className="flex items-center justify-between px-4 py-3 bg-[#3e81d4]/5">
                      <div className="text-sm text-[#3e81d4]">
                        Showing{" "}
                        <span className="font-medium">
                          {table.getRowModel().rows.length}
                        </span>{" "}
                        of{" "}
                        <span className="font-medium">
                          {submissions.length}
                        </span>{" "}
                        submissions
                      </div>

                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => table.previousPage()}
                          disabled={!table.getCanPreviousPage()}
                          className="border-[#3e81d4]/20 text-[#3e81d4]"
                        >
                          <ChevronLeft className="h-4 w-4 mr-1" />
                          Previous
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => table.nextPage()}
                          disabled={!table.getCanNextPage()}
                          className="border-[#3e81d4]/20 text-[#3e81d4]"
                        >
                          Next
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  );
}

interface GradeCellProps {
  value?: number;
  studentId: string;
  submissionId?: number; // Add submissionId prop for submissions
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
  onRecordingSaved: (voiceNotesUrl?: string) => void; // Updated to accept voice URL
  audioUrl?: string; // Direct audio URL for inline playback
}

function GradeCell({
  value,
  studentId,
  submissionId, // Add submissionId parameter
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
  // const [isPlaying, setIsPlaying] = useState(false);
  // const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(
  //   null
  // );
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
          title="Click to add grade"
        >
          -
        </span>
        <Tooltip>
          <TooltipTrigger asChild>
            <RecordDialog
              studentId={studentId}
              submissionId={submissionId}
              assessmentType={assessmentType}
              assessmentIndex={assessmentIndex}
              onRecordingSaved={onRecordingSaved}
              hasExistingRecording={hasVoiceRecording}
              voiceUrl={audioUrl} // Pass the voice URL when available
            >
              <Button
                variant="ghost"
                size="icon"
                className={`h-6 w-6 hover:bg-gray-100 ${
                  hasVoiceRecording ? "bg-red-50 hover:bg-red-100" : ""
                }`}
                aria-label={
                  hasVoiceRecording
                    ? "Voice feedback recorded - Click to view/edit"
                    : "Add voice feedback"
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
          </TooltipTrigger>
          <TooltipContent>
            <p>
              {hasVoiceRecording
                ? "🎙️ Voice feedback recorded"
                : "Add voice feedback"}
            </p>
          </TooltipContent>
        </Tooltip>
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
        title="Click to edit grade"
      >
        {value}
      </span>
      <Tooltip>
        <TooltipTrigger asChild>
          <RecordDialog
            studentId={studentId}
            submissionId={submissionId} // Pass submissionId for submissions
            assessmentType={assessmentType}
            assessmentIndex={assessmentIndex}
            onRecordingSaved={onRecordingSaved}
            hasExistingRecording={hasVoiceRecording}
            voiceUrl={audioUrl} // Pass the voice URL when available
          >
            <Button
              variant="ghost"
              size="icon"
              className={`h-6 w-6 hover:bg-gray-100 ${
                hasVoiceRecording ? "bg-red-50 hover:bg-red-100" : ""
              }`}
              aria-label={
                hasVoiceRecording
                  ? "Voice feedback recorded - Click to view/edit"
                  : "Add voice feedback"
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
        </TooltipTrigger>
        <TooltipContent>
          <p>
            {hasVoiceRecording
              ? "🎙️ Voice feedback recorded"
              : "Add voice feedback"}
          </p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
}
