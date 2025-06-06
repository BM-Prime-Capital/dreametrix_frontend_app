"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AlertCircle, Eye, File, Mic, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { RecordDialog } from "./RecordDialog";
import { getGradeBookFocusList } from "@/services/GradebooksService";
import { localStorageKey } from "@/constants/global";
import { ClassData } from "../types/gradebook";
import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";

interface GradebookClassTableProps {
  classData: ClassData;
  onBack: () => void;
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

export function GradebookClassTable({ classData, onBack }: GradebookClassTableProps) {
  const [students, setStudents] = useState<StudentGrade[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const accessToken: any = localStorage.getItem(localStorageKey.ACCESS_TOKEN);
  const refreshToken: any = localStorage.getItem(
    localStorageKey.REFRESH_TOKEN
  );

  const currentClassStr = localStorage.getItem(localStorageKey.CURRENT_SELECTED_CLASS);
  const currentClass = currentClassStr ? JSON.parse(currentClassStr) : null;
  
  console.log("currentClass", currentClass);

  const tenantData: any = localStorage.getItem(localStorageKey.TENANT_DATA);
  const { primary_domain } = JSON.parse(tenantData);
  const tenantPrimaryDomain = `https://${primary_domain}`;

  useEffect(() => {
    async function fetchStudents() {
      try {
        const response = await getGradeBookFocusList(
          tenantPrimaryDomain,
          accessToken,
          classData.id,
          refreshToken
        );

        console.log("STUDENTS LOADED => ", response);

        if (!Array.isArray(response)) {
          throw new Error("Invalid API response structure: Expected array");
        }

        const apiData = response as ApiStudent[];
        
        const formattedStudents = apiData.map((student) => {
          if (!student?.student_name || !student?.assessment_types) {
            console.warn("Invalid student data:", student);
            return null;
          }
          return {
            id: student.student_id?.toString() || 'unknown-id',
            name: student.student_name,
            average: student.average_grade || 0,
            assessments: {
              test: student.assessment_types.test || [],
              homework: student.assessment_types.homework || [],
              quiz: student.assessment_types.quiz || [],
              participation: student.assessment_types.participation || [],
              other: student.assessment_types.other || []
            }
          };
        }).filter(Boolean) as StudentGrade[];

        setStudents(formattedStudents);
        setLoading(false);
      } catch (err: any) {
        console.error("Fetch error details:", {
          error: err,
        });
        setError(err.message || "Erreur de chargement");
        setLoading(false);
      }
    }

    fetchStudents();
  }, [classData.id, tenantPrimaryDomain, accessToken, refreshToken]);

  if (loading) return (
    <div className="space-y-4">
      {[...Array(5)].map((_, i) => (
        <Skeleton key={i} className="h-12 w-full rounded-md" />
      ))}
    </div>
  );

  if (error) return (
    <div className="bg-red-50 p-4 rounded-md border border-red-200 text-red-600 flex items-center gap-3">
      <AlertCircle className="w-5 h-5" />
      <div>
        <p className="font-medium">Error loading data</p>
        <p className="text-sm">{error}</p>
      </div>
    </div>
  );

  return (
    <TooltipProvider>
      <div className="w-full">
        {/* Conteneur principal avec bordure et ombre */}
        <div className="rounded-lg border shadow-sm bg-white">
          {/* Conteneur de scroll avec padding-bottom pour la barre de défilement */}
          <div className="overflow-x-auto pb-2">
            {/* Tableau avec largeur fixe adaptée à votre contenu */}
            
            <Table>
                <TableHeader className="bg-gray-50">
                  <TableRow>
                    <TableHead rowSpan={2} className="w-[120px] sticky left-0 bg-gray-50 z-10 text-center font-semibold text-gray-700">STUDENT</TableHead>
                    <TableHead rowSpan={2} className="w-[90px] text-center font-semibold text-gray-700">AVERAGE</TableHead>
                    <TableHead colSpan={2} className="text-center font-semibold text-gray-700">EXAMS</TableHead>
                    <TableHead colSpan={4} className="text-center font-semibold text-gray-700">QUIZZES</TableHead>
                    <TableHead colSpan={3} className="text-center font-semibold text-gray-700">HOMEWORK</TableHead>
                    <TableHead rowSpan={2} className="w-[150px] font-semibold text-gray-700">ACTIONS</TableHead>
                  </TableRow>
                  <TableRow className="bg-gray-50">
                    {['General', 'Practical', 'General', 'Pop Quiz', 'Unit 1', 'Unit 2', 'Chapter 3', 'General', 'Project'].map((header, i) => (
                      <TableHead key={i} className="text-xs font-medium text-gray-500">{header}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
              <TableBody>
                            {students.map((student) => (
                              <TableRow key={student.id} className="hover:bg-gray-50/50">
                                <TableCell className="font-medium sticky left-0 bg-white z-10 w-[120px] truncate">{student.name}</TableCell>
                                
                                <TableCell className="text-center w-[90px]">
                                  <Badge 
                                    variant={
                                      student.average >= 70 ? 'default' : 
                                      student.average >= 50 ? 'secondary' : 
                                      'destructive'
                                    }
                                    className={
                                      student.average >= 70 ? 'bg-green-100 text-green-800' : 
                                      student.average >= 50 ? 'bg-yellow-100 text-yellow-800' : 
                                      ''
                                    }
                                  >
                                    {student.average.toFixed(1)}
                                  </Badge>
                                </TableCell>
              
                                {/* Exam Cells */}
                                <TableCell className="text-center">
                                  <GradeCell value={student.assessments.test[0]} />
                                </TableCell>
                                <TableCell className="text-center">
                                  <GradeCell value={student.assessments.test[1]} />
                                </TableCell>
              
                                {/* Quiz Cells */}
                                {[0, 1, 2, 3].map((i) => (
                                  <TableCell key={`quiz-${i}`} className="text-center">
                                    <GradeCell value={student.assessments.quiz[i]} />
                                  </TableCell>
                                ))}
              
                                {/* Homework Cells */}
                                <TableCell className="text-center">
                                  <GradeCell value={student.assessments.homework[0]} />
                                </TableCell>
                                <TableCell className="text-center">
                                  <GradeCell value={student.assessments.homework[1]} />
                                </TableCell>
                                <TableCell className="text-center">
                                  <GradeCell value={student.assessments.homework[2]} />
                                </TableCell>
              
                                <TableCell className="w-[150px]">
                                  <div className="flex gap-1 justify-center">
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-7 w-7 hover:bg-blue-50">
                                          <Pencil className="h-3.5 w-3.5 text-blue-600" />
                                        </Button>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p>Edit grades</p>
                                      </TooltipContent>
                                    </Tooltip>
              
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-7 w-7 hover:bg-red-50">
                                          <Trash2 className="h-3.5 w-3.5 text-red-600" />
                                        </Button>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p>Delete record</p>
                                      </TooltipContent>
                                    </Tooltip>
              
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-7 w-7 hover:bg-green-50">
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
      </div>
    </TooltipProvider>
  );
}

function GradeCell({ value }: { value?: number }) {
  if (value === undefined || value === null) {
    return (
      <div className="flex justify-center items-center gap-1">
        <span className="text-gray-400">-</span>
        <RecordDialog>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-6 w-6 hover:bg-gray-100"
            aria-label="Add voice note"
          >
            <Mic className="h-4 w-4 text-gray-500" />
          </Button>
        </RecordDialog>
      </div>
    );
  }

  const colorClass = value >= 70 
    ? 'text-green-600 font-medium' 
    : value >= 50 
      ? 'text-yellow-600' 
      : 'text-red-600';

  return (
    <div className="flex justify-center items-center gap-1">
      <span className={`${colorClass}`}>{value}</span>
      <RecordDialog>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-6 w-6 hover:bg-gray-100"
          aria-label="Add voice note"
        >
          <Mic className="h-4 w-4 text-gray-500 hover:text-blue-500" />
        </Button>
      </RecordDialog>
    </div>
  );
}