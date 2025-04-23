"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pencil, Trash2, File } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RecordDialog } from "./RecordDialog";

interface Assessment {
  name: string;
  average: number;
}

interface AssessmentTypes {
  Test: Assessment[];
  homework: Assessment[];
  quiz: Assessment[];
  participation: Assessment[];
  other: Assessment[];
}

interface Student {
  student_name: string;
  student_id: number;
  average_grade: number;
  assessment_types: AssessmentTypes;
}

export function GradebookClassTable({ students }: { students: Student[] }) {
  // Détermine le nombre maximum d'évaluations par type pour créer les colonnes
  const getMaxAssessments = () => {
    let max = 0;
    const types: (keyof AssessmentTypes)[] = ['Test', 'homework', 'quiz', 'participation', 'other'];
    
    types.forEach(type => {
      students.forEach(student => {
        if (student.assessment_types[type]?.length > max) {
          max = student.assessment_types[type].length;
        }
      });
    });
    return max;
  };

  const maxAssessments = getMaxAssessments();

  // Crée les en-têtes dynamiquement
  const renderAssessmentHeaders = (type: keyof AssessmentTypes, displayName: string) => {
    const assessments = students[0]?.assessment_types[type] || [];
    const colSpan = assessments.length > 0 ? assessments.length : 1;

    return (
      <>
        <TableHead colSpan={colSpan} className="text-center">
          {displayName}
        </TableHead>
      </>
    );
  };

  // Crée les sous-en-têtes dynamiquement
  const renderSubHeaders = (type: keyof AssessmentTypes) => {
    const assessments = students[0]?.assessment_types[type] || [];
    
    if (assessments.length === 0) {
      return <TableHead>-</TableHead>;
    }

    return assessments.map((assessment, index) => (
      <TableHead key={`${type}-${index}`}>
        {assessment.name}
      </TableHead>
    ));
  };

  // Récupère la valeur d'une évaluation spécifique
  const getAssessmentValue = (student: Student, type: keyof AssessmentTypes, index: number) => {
    const assessments = student.assessment_types[type];
    return assessments && assessments[index] ? assessments[index].average : '-';
  };

  return (
    <div className="w-full overflow-auto">
      <Table>
        <TableHeader>
          {/* Ligne principale des en-têtes */}
          <TableRow>
            <TableHead rowSpan={2} className="text-center">STUDENT</TableHead>
            <TableHead rowSpan={2} className="text-center">AVERAGE</TableHead>
            {renderAssessmentHeaders('Test', 'TEST')}
            {renderAssessmentHeaders('homework', 'HOMEWORK')}
            {renderAssessmentHeaders('quiz', 'QUIZ')}
            {renderAssessmentHeaders('participation', 'PARTICIPATION')}
            {renderAssessmentHeaders('other', 'OTHER')}
            <TableHead rowSpan={2}>ACTIONS</TableHead>
          </TableRow>
          
          {/* Ligne des sous-en-têtes */}
          <TableRow>
            {renderSubHeaders('Test')}
            {renderSubHeaders('homework')}
            {renderSubHeaders('quiz')}
            {renderSubHeaders('participation')}
            {renderSubHeaders('other')}
          </TableRow>
        </TableHeader>
        
        <TableBody>
          {students.map((student) => (
            <TableRow key={student.student_id}>
              <TableCell>{student.student_name}</TableCell>
              <TableCell>
                {student.average_grade.toFixed(2)}% <RecordDialog />
              </TableCell>
              
              {/* Colonnes Test */}
              {student.assessment_types.Test?.map((test, index) => (
                <TableCell key={`test-${index}`}>
                  <span className="flex gap-1 justify-center">
                    {test.average} <RecordDialog />
                  </span>
                </TableCell>
              )) || <TableCell>-</TableCell>}
              
              {/* Colonnes Homework */}
              {student.assessment_types.homework?.map((hw, index) => (
                <TableCell key={`hw-${index}`}>
                  <span className="flex gap-1 justify-center">
                    {hw.average} <RecordDialog />
                  </span>
                </TableCell>
              )) || <TableCell>-</TableCell>}
              
              {/* Colonnes Quiz */}
              {student.assessment_types.quiz?.map((quiz, index) => (
                <TableCell key={`quiz-${index}`}>
                  <span className="flex gap-1 justify-center">
                    {quiz.average} <RecordDialog />
                  </span>
                </TableCell>
              )) || <TableCell>-</TableCell>}
              
              {/* Colonnes Participation */}
              {student.assessment_types.participation?.map((part, index) => (
                <TableCell key={`part-${index}`}>
                  <span className="flex gap-1 justify-center">
                    {part.average} <RecordDialog />
                  </span>
                </TableCell>
              )) || <TableCell>-</TableCell>}
              
              {/* Colonnes Other */}
              {student.assessment_types.other?.map((other, index) => (
                <TableCell key={`other-${index}`}>
                  <span className="flex gap-1 justify-center">
                    {other.average} <RecordDialog />
                  </span>
                </TableCell>
              )) || <TableCell>-</TableCell>}
              
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 hover:bg-blue-50"
                  >
                    <Pencil className="h-4 w-4 text-[#25AAE1]" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 hover:bg-red-50"
                  >
                    <File className="h-4 w-4 text-green-500" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}