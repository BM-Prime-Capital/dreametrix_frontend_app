"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { GradebookTable } from "./gradebook-table";
import PageTitleH1 from "@/components/ui/page-title-h1";
import { AddGradebookItemDialog } from "./AddGradebookItemDialog";
import { GradebookSettingsDialog } from "./GradebookSettingsDialog";

import { GradebookClassTable } from "./gradebook-class-table";

import { Button } from "../ui/button";
import Image from "next/image";
import { generalImages } from "@/constants/images";
import ClassSelect from "../ClassSelect";
import { getGradeBookList } from "@/services/GradebooksService";
import { localStorageKey } from "@/constants/global";
import { ClassData } from "../types/gradebook";

interface GradebookTableProps {
  classes: ClassData[];
  setCurrentClass: (selectedClass: ClassData) => void;
}

export default function Gradebook() {
  const [currentClass, setCurrentClass] = useState<ClassData | null>(null);
  const [gradebookData, setGradebookData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const accessToken: any = localStorage.getItem(localStorageKey.ACCESS_TOKEN);
  const refreshToken: any = localStorage.getItem(localStorageKey.REFRESH_TOKEN);

  const tenantData: any = localStorage.getItem(localStorageKey.TENANT_DATA);

  const { primary_domain } = JSON.parse(tenantData);
  const tenantPrimaryDomain = `https://${primary_domain}`;

  const handleClassSelect = (selectedClass: ClassData) => {
    setCurrentClass(selectedClass);
    localStorage.setItem(
      localStorageKey.CURRENT_SELECTED_CLASS,
      JSON.stringify(selectedClass)
    );
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
          accessToken,
          refreshToken
        );

        console.log("GradeBookList data: ", data);

        // Mapper vers le format attendu par GradebookTable
        const formatted = data.map((item: any) => ({
          id: item.class_id,
          name: `Class ${item.class_id}`,
          average: `${item.average}%`,
          noOfExams: item.test,
          noOfTests: item.quiz,
          noOfHomeworks: item.homework,
          noOfParticipation: item.participation,
          noOfOther: item.other,
          totalWork:
            item.homework +
            item.test +
            item.quiz +
            item.participation +
            item.other,
        }));

        setGradebookData(formatted);
      } catch (err: any) {
        setError(err.message || "Erreur inconnue");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <section className="flex flex-col gap-2 w-full overflow-auto">
      <div className="flex justify-between items-center bg-[#3e81d4] px-4 py-3 rounded-md">
        <div className="flex items-center">
          <PageTitleH1 title="Gradebook" className="text-white" />
          {currentClass && (
            <h1 className="text-white text-2xl font-bold px-2">
              : {currentClass.name}
            </h1>
          )}
        </div>

        {currentClass && <ClassSelect />}
      </div>

      <div className="flex gap-2">
        <AddGradebookItemDialog />
        {currentClass && (
          <Button className="flex gap-2 items-center text-lg bg-yellow-500 hover:bg-yellow-600 rounded-md  px-2 py-4 lg:px-4 lg:py-6">
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
        {currentClass && (
          <GradebookSettingsDialog courseId={parseInt(currentClass.id)} />
        )}
      </div>

      <Card className="rounded-md">
        {loading ? (
          <div className="p-4">
            <p className="text-center">Loading...</p>
          </div>
        ) : error ? (
          <div className="p-4">
            <p className="text-center text-red-500">{error}</p>
          </div>
        ) : currentClass ? (
          // Interface de classe détaillée avec scroll horizontal géré ici
          <div className="space-y-4">
            <div className="p-4 pb-0">
              <Button
                variant="outline"
                onClick={handleBackToList}
                className="mb-4"
              >
                ← Back to class list
              </Button>
            </div>

            {/* Note d'information pour le scroll horizontal */}
            <div className="px-4 py-2 bg-blue-50 border-b border-blue-200 text-sm text-blue-700 flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
              Scroll horizontally to view all grade columns • Student name,
              average, and actions stay fixed during scroll
            </div>

            {/* Container avec scroll horizontal */}
            <div className="overflow-x-auto">
              <GradebookClassTable
                classData={currentClass}
                onBack={handleBackToList}
                columnCounts={{
                  test:
                    gradebookData.find((item) => item.id === currentClass.id)
                      ?.noOfExams || 1,
                  quiz:
                    gradebookData.find((item) => item.id === currentClass.id)
                      ?.noOfTests || 1,
                  homework:
                    gradebookData.find((item) => item.id === currentClass.id)
                      ?.noOfHomeworks || 1,
                  participation:
                    gradebookData.find((item) => item.id === currentClass.id)
                      ?.noOfParticipation || 1,
                  other:
                    gradebookData.find((item) => item.id === currentClass.id)
                      ?.noOfOther || 1,
                }}
              />
            </div>
          </div>
        ) : (
          // Interface de liste des classes avec scroll horizontal géré ici
          <div>
            {/* Note d'information pour le scroll horizontal */}
            <div className="px-4 py-2 bg-blue-50 border-b border-blue-200 text-sm text-blue-700 flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
              Scroll horizontally to view all columns • Class name column stays
              fixed during scroll
            </div>

            {/* Container avec scroll horizontal */}
            <div className="overflow-x-auto">
              <GradebookTable
                classes={gradebookData}
                onClassSelect={handleClassSelect}
              />
            </div>
          </div>
        )}
      </Card>
    </section>
  );
}
