"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Eye, File, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { RecordDialog } from "./RecordDialog";
import { getGradeBookFocusList } from "@/services/GradebooksService";
import { localStorageKey } from "@/constants/global";
import { ClassData} from "../types/gradebook";


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
  // const [students, setStudents] = useState<any[]>([]);
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

  // useEffect(() => {
  //   async function fetchStudents() {
  //     try {
  //       // const data = await getGradeBookFocusList(tenantPrimaryDomain, accessToken, currentClass.id, refreshToken);
  //       const response = await getGradeBookFocusList(
  //         tenantPrimaryDomain,
  //         accessToken,
  //         classData.id,
  //         refreshToken
  //       );

  //       console.log("STUDENTS LOADED => ", response);
  //       // setStudents(data); // adapte selon le format retourné
  //       // Transform API data to component structure

  //       // Vérification approfondie de la structure de la réponse
  //       if (!Array.isArray(response) || response.length < 2 || !Array.isArray(response[1])) {
  //         throw new Error("Invalid API response structure");
  //       }

  //       const apiData = response as ApiStudent[];
        
  //       // Transformation des données avec vérification de type
  //       const formattedStudents = apiData.map((student) => {
  //         if (!student?.student_name || !student?.assessment_types) {
  //           console.warn("Invalid student data:", student);
  //           return null;
  //         }
  //         return {
  //           id: student.student_id?.toString() || 'unknown-id',
  //           name: student.student_name,
  //           average: student.average_grade || 0,
  //           assessments: {
  //             test: student.assessment_types.test || [],
  //             homework: student.assessment_types.homework || [],
  //             quiz: student.assessment_types.quiz || [],
  //             participation: student.assessment_types.participation || [],
  //             other: student.assessment_types.other || []
  //           }
  //         };
  //       }).filter(Boolean) as StudentGrade[];

  //       setStudents(formattedStudents);
  //       setLoading(false);
  //     } catch (err: any) {
  //       setError(err.message || "Erreur de chargement.");
  //       setLoading(false);
  //     }
  //   }

  //   fetchStudents();
  // }, [tenantPrimaryDomain, accessToken, refreshToken]);



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
  
        // Correction : La réponse est directement le tableau d'étudiants
        if (!Array.isArray(response)) {
          throw new Error("Invalid API response structure: Expected array");
        }
  
        const apiData = response as ApiStudent[]; // Utiliser directement la réponse
        
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
          // response
        });
        setError(err.message || "Erreur de chargement");
        setLoading(false);
      }
    }
  
    fetchStudents();
  }, [classData.id, tenantPrimaryDomain, accessToken, refreshToken]); // Ajout de classData.id aux dépendances

  if (loading) return <div>Chargement des données...</div>;
  if (error) return <div className="text-red-500">Erreur : {error}</div>;

  return (
    <div className="w-full overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead rowSpan={2} className="text-center">STUDENT</TableHead>
            <TableHead rowSpan={2} className="text-center">AVERAGE</TableHead>
            <TableHead colSpan={2} className="text-center">EXAM</TableHead>
            <TableHead colSpan={4} className="text-center">QUIZ</TableHead>
            <TableHead colSpan={3} className="text-center">HOMEWORK</TableHead>
            <TableHead rowSpan={2}>ACTIONS</TableHead>
          </TableRow>
          <TableRow>
            <TableHead>General</TableHead>
            <TableHead>Practical</TableHead>
            <TableHead>General</TableHead>
            <TableHead>Pop Quiz</TableHead>
            <TableHead>Unit 1</TableHead>
            <TableHead>Unit 2</TableHead>
            <TableHead>Chapter 3</TableHead>
            <TableHead>General</TableHead>
            <TableHead>Project</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {students.map((class_: any) => (
            <TableRow key={class_.id}>
              <TableCell>{class_.name}</TableCell>
              <TableCell>{class_.average} <RecordDialog /></TableCell>
              <TableCell><span className="flex gap-1 justify-center">{class_.examGeneral} <RecordDialog /></span></TableCell>
              <TableCell><span className="flex gap-1 justify-center">{class_.examPractical} <RecordDialog /></span></TableCell>
              <TableCell><span className="flex gap-1 justify-center">{class_.quizGeneral} <RecordDialog /></span></TableCell>
              <TableCell><span className="flex gap-1 justify-center">{class_.quizPop} <RecordDialog /></span></TableCell>
              <TableCell><span className="flex gap-1 justify-center">{class_.quizUnit1} <RecordDialog /></span></TableCell>
              <TableCell><span className="flex gap-1 justify-center">{class_.quizUnit2} <RecordDialog /></span></TableCell>
              <TableCell><span className="flex gap-1 justify-center">{class_.homeWorkChapter} <RecordDialog /></span></TableCell>
              <TableCell><span className="flex gap-1 justify-center">{class_.homeWorkGeneral} <RecordDialog /></span></TableCell>
              <TableCell><span className="flex gap-1 justify-center">{class_.homeWorkProject} <RecordDialog /></span></TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-blue-50">
                    <Pencil className="h-4 w-4 text-[#25AAE1]" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-red-50">
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-red-50">
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
