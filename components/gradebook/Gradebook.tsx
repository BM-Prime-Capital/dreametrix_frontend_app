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
  const refreshToken: any = localStorage.getItem(
        localStorageKey.REFRESH_TOKEN
      );

  const tenantData: any = localStorage.getItem(localStorageKey.TENANT_DATA);

  const { primary_domain } = JSON.parse(tenantData);
  const tenantPrimaryDomain = `https://${primary_domain}`;

  const handleClassSelect = (selectedClass: ClassData) => {
    setCurrentClass(selectedClass);
    localStorage.setItem(localStorageKey.CURRENT_SELECTED_CLASS, JSON.stringify(selectedClass));
  };

  const handleBackToList = () => {
    setCurrentClass(null);
    localStorage.removeItem(localStorageKey.CURRENT_SELECTED_CLASS);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getGradeBookList(tenantPrimaryDomain, accessToken, refreshToken);

        console.log("GradeBookList data: ", data)

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
      </div>

      <Card className="rounded-md p-4">
        {loading ? (
          <p className="text-center">Loading...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : currentClass ? (
          // VOICI LA PARTIE MODIFIÉE 👇
          <div className="space-y-4">
            <Button 
              variant="outline" 
              onClick={handleBackToList}
              className="mb-4"
            >
              ← Back to class list
            </Button>
            <GradebookClassTable 
              classData={currentClass}  // Ajout de la prop classData
              onBack={handleBackToList}  // Ajout de la prop onBack
            />
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
