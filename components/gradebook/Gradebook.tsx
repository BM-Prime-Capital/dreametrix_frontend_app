"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { GradebookTable } from "./gradebook-table";
import PageTitleH1 from "@/components/ui/page-title-h1";
import { AddGradebookItemDialog } from "./AddGradebookItemDialog";
import { GradebookClassTable } from "./gradebook-class-table";
import { Button } from "../ui/button";
import Image from "next/image";
import { generalImages } from "@/constants/images";
import ClassSelect from "../ClassSelect";
import { getGradeBookFocusList, getGradeBookList } from "@/services/GradebooksService";
import { localStorageKey } from "@/constants/global";
import { ClassData } from "../types/gradebook";

interface Student {
  student_name: string;
  student_id: number;
  average_grade: number;
  assessment_types: {
    Test: Array<{ name: string; average: number }>;
    homework: Array<{ name: string; average: number }>;
    quiz: Array<{ name: string; average: number }>;
    participation: Array<{ name: string; average: number }>;
    other: Array<{ name: string; average: number }>;
  };
}

interface ExtendedClassData extends ClassData {
  students?: Student[];
}

export default function Gradebook() {
  const [currentClass, setCurrentClass] = useState<ExtendedClassData | null>(null);
  const [gradebookData, setGradebookData] = useState<ClassData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const accessToken = localStorage.getItem(localStorageKey.ACCESS_TOKEN);
  const refreshToken = localStorage.getItem(localStorageKey.REFRESH_TOKEN);
  const tenantData = localStorage.getItem(localStorageKey.TENANT_DATA);
  const { primary_domain } = JSON.parse(tenantData || '{}');
  const tenantPrimaryDomain = `https://${primary_domain}`;

  const transformStudentData = (data: any): Student[] => {
    return data.map((student: any) => ({
      student_name: student.name || `Student ${student.id}`,
      student_id: student.id,
      average_grade: student.average || 0,
      assessment_types: {
        Test: student.tests?.map((test: any) => ({
          name: test.name || "Test",
          average: test.grade || 0
        })) || [],
        homework: student.homeworks?.map((hw: any) => ({
          name: hw.name || "Homework",
          average: hw.grade || 0
        })) || [],
        quiz: student.quizzes?.map((quiz: any) => ({
          name: quiz.name || "Quiz",
          average: quiz.grade || 0
        })) || [],
        participation: student.participations?.map((part: any) => ({
          name: part.name || "Participation",
          average: part.grade || 0
        })) || [],
        other: student.others?.map((other: any) => ({
          name: other.name || "Other",
          average: other.grade || 0
        })) || []
      }
    }));
  };

  const handleClassSelect = async (selectedClass: ClassData) => {
    try {
      setLoading(true);
      const studentData = await getGradeBookFocusList(
        tenantPrimaryDomain,
        accessToken || '',
        selectedClass.id.toString(),
        refreshToken || ''
      );
      
      const transformedStudents = transformStudentData(studentData);
      
      const updatedClass: ExtendedClassData = {
        ...selectedClass,
        students: transformedStudents
      };
      
      setCurrentClass(updatedClass);
      localStorage.setItem(localStorageKey.CURRENT_SELECTED_CLASS, JSON.stringify(updatedClass));
    } catch (err: any) {
      setError(err.message || "Failed to load class data");
    } finally {
      setLoading(false);
    }
  };

  const handleBackToList = () => {
    setCurrentClass(null);
    localStorage.removeItem(localStorageKey.CURRENT_SELECTED_CLASS);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getGradeBookList(
          tenantPrimaryDomain, 
          accessToken || '', 
          refreshToken || ''
        );

        const formatted = data.map((item: any) => ({
          id: item.class_id,
          name: item.class_name || `Class ${item.class_id}`,
          average: item.average || 0,
          noOfExams: item.test || 0,
          noOfTests: item.quiz || 0,
          noOfHomeworks: item.homework || 0,
          noOfParticipation: item.participation || 0,
          noOfOther: item.other || 0,
          totalWork: (item.homework || 0) + 
                   (item.test || 0) + 
                   (item.quiz || 0) + 
                   (item.participation || 0) + 
                   (item.other || 0),
        }));

        setGradebookData(formatted);
      } catch (err: any) {
        setError(err.message || "Failed to load gradebook data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <section className="flex flex-col gap-2 w-full">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <PageTitleH1 title="GRADEBOOK" className="text-[#e91e63]" />
          {currentClass && (
            <h1 className="text-[#e91e63] text-2xl font-bold px-2">
              : {currentClass.name}
            </h1>
          )}
        </div>
        {currentClass && <ClassSelect />}
      </div>

      <div className="flex gap-2">
        <AddGradebookItemDialog />
        {currentClass && (
          <Button className="flex gap-2 items-center text-lg bg-yellow-500 hover:bg-yellow-600 rounded-md px-2 py-4 lg:px-4 lg:py-6">
            <Image
              src={generalImages.layout}
              alt="add"
              width={100}
              height={100}
              className="w-8 h-8"
            />
            <span>Layout</span>
          </Button>
        )}
      </div>

      <Card className="rounded-md p-4">
        {loading ? (
          <p className="text-center">Chargement en cours...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : currentClass ? (
          <div className="space-y-4">
            <Button 
              variant="outline" 
              onClick={handleBackToList}
              className="mb-4"
            >
              ← Retour à la liste des classes
            </Button>
            {currentClass.students ? (
              <GradebookClassTable students={currentClass.students} />
            ) : (
              <p>No student data available</p>
            )}
          </div>
        ) : (
          <GradebookTable
            classes={gradebookData}
            onClassSelect={handleClassSelect}
          />
        )}
      </Card>
    </section>
  );
}