import { Card } from "@/components/ui/card";
import PageTitleH1 from "@/components/ui/page-title-h1";
import { CharacterTable } from "./character-table";
import { ReportAttendanceDialog } from "./ReportAttendanceDialog";
import { Button } from "../ui/button";
import Image from "next/image";
import { teacherImages } from "@/constants/images";
import Link from "next/link";
import CharacterFiltersPopUp from "./CharacterFiltersPopUp";
import ClassSelect from "../ClassSelect";
import { views } from "@/constants/global";
import { useState, useEffect } from "react";
import { localStorageKey } from "@/constants/global";

export default function CharacterFocusedView({
  changeView,
}: {
  changeView: Function;
}) {
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);

  // Initialize with the currently selected class from localStorage
  useEffect(() => {
    const loadedSelectedClass = localStorage.getItem(
      localStorageKey.CURRENT_SELECTED_CLASS
    );
    if (loadedSelectedClass && loadedSelectedClass !== "undefined") {
      try {
        const parsed = JSON.parse(loadedSelectedClass);
        setSelectedClassId(parsed?.id?.toString() || null);
      } catch (error) {
        console.error(
          "Failed to parse selected class from localStorage:",
          error
        );
      }
    }
  }, []);

  const handleClassChange = (classId: string | null) => {
    console.log("CharacterFocusedView: Class changed to:", classId);
    setSelectedClassId(classId);
  };

  return (
    <section className="flex flex-col h-full w-full bg-gradient-to-br from-orange-50/30 to-red-50/20">
      {/* Enhanced Header */}
      <div className="flex justify-between items-center bg-gradient-to-r from-orange-600 via-orange-700 to-red-700 px-8 py-6 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
            <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div>
            <PageTitleH1 title="Character Management" className="text-white font-bold text-2xl" />
            <p className="text-orange-100 text-sm mt-1">Track and manage student character development</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-2">
            <ClassSelect onClassChange={handleClassChange} />
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-2">
            <CharacterFiltersPopUp />
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 p-8 space-y-6">
        {/* Enhanced Action Bar */}
        <div className="flex flex-wrap gap-4 justify-between items-center bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg">
          <Button
            className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 border-gray-300 shadow-sm rounded-xl font-medium"
            onClick={() => changeView(views.GENERAL_VIEW)}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>Back to Overview</span>
          </Button>
          
          <div className="flex gap-3">
            <ReportAttendanceDialog />
            <Link
              target="_blank"
              href={"/assets/google_search.pdf"}
              className="flex gap-2 items-center bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl px-4 py-2 shadow-lg font-medium transition-all duration-300"
            >
              <Image
                src={teacherImages.print}
                alt="print"
                width={20}
                height={20}
                className="w-5 h-5"
              />
              <span>Print Report</span>
            </Link>
          </div>
        </div>

        {/* Enhanced Character Table Card */}
        <Card className="rounded-2xl shadow-xl border-0 bg-white/80 backdrop-blur-sm overflow-hidden">
          <CharacterTable
            key={selectedClassId}
            selectedClassId={selectedClassId}
          />
        </Card>
      </div>
    </section>
  );
}
