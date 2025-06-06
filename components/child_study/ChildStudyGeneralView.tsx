/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import NoData from "../ui/no-data";
import { Loader } from "../ui/loader";
import PageTitleH1 from "../ui/page-title-h1";
import ClassSelect from "../ClassSelect";
import { Card } from "@/components/ui/card";
import { getRewardsGeneralView } from "@/services/RewardsService";
import { useRequestInfo } from "@/hooks/useRequestInfo";
import { localStorageKey } from "@/constants/global";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import AllRewardFiltersPopUp from "./AllChildStudyFiltersPopUp";

interface ChildStudyViewProps {
  changeView: (viewName: string, student?: any) => void;
}

export default function ChildStudyView({ changeView }: ChildStudyViewProps) {
  const { tenantDomain: tenantPrimaryDomain, accessToken, refreshToken } = useRequestInfo();
  //const userData = JSON.parse(localStorage.getItem(localStorageKey.USER_DATA)!);
  const currentClass = JSON.parse(
    localStorage.getItem(localStorageKey.CURRENT_SELECTED_CLASS)!
  );
  
  const [isLoading, setIsLoading] = useState(false);
  const [students, setStudents] = useState<any[]>([]);
  const [rewardsCount, ] = useState(0);
  const [, setFromDate] = useState("");
  const [, setToDate] = useState("");

  useEffect(() => {
    const loadStudents = async () => {
      setIsLoading(true);
      try {
        if (!tenantPrimaryDomain || !accessToken || !refreshToken) {
          console.error("Missing authentication credentials");
          return;
        }

        const apiData = await getRewardsGeneralView(
          tenantPrimaryDomain,
          accessToken,
          refreshToken,
          "", 
          "",
          currentClass?.id
        );

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const transformedData = apiData.classes.flatMap((classItem: any) => 
          classItem.students.map((studentItem: any) => ({
            id: studentItem.student.id,
            fullName: studentItem.student.name,
            firstName: studentItem.student.name.split(' ')[0], 
            photoUrl: studentItem.student.photo || `/default-avatar.png`,
            grade: extractGradeFromClassName(classItem.className),
            class: classItem.className,
            status: studentItem.attendance > 80 ? 'Active' : 'Needs Review',
            iep: studentItem.total < 50 ? 'Yes' : 'No',
            lastEvaluation: "2023-11-15",
            rawData: {
              ...studentItem,
              className: classItem.className
            }
          }))
        );

        setStudents(transformedData);
      } catch (error) {
        console.error("Failed to load students:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadStudents();
  }, [tenantPrimaryDomain, accessToken, refreshToken, currentClass?.id]);

  const extractGradeFromClassName = (className: string) => {
    const match = className.match(/(\d+)(th|rd|nd|st)?\s?Grade/i);
    return match ? `${match[1]}${match[2] || 'th'} Grade` : className;
  };

  const handleViewDetails = (student: any) => {
    changeView("STUDENT_DETAILS", student.rawData);
  };

  return (
    <section className="flex flex-col gap-4 w-full">
      <div className="flex justify-between items-center bg-[#3e81d4] px-4 py-3 rounded-md">
        <PageTitleH1 title="Child Study Team" className="text-white" />
        <ClassSelect className="text-white bg-[#3e81d4] hover:bg-[#3e81d4]" />
      </div>

      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-500 ml-1">
          Results found: <span className="font-bold text-primaryText">{rewardsCount}</span>
        </div>
        
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">From:</span>
            <input
              className="bg-white border rounded-md p-1 text-sm cursor-pointer"
              type="date"
              onChange={(e) => setFromDate(e.target.value)}
            />
          </label>

          <label className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">To:</span>
            <input
              className="bg-white border rounded-md p-1 text-sm cursor-pointer"
              type="date"
              onChange={(e) => setToDate(e.target.value)}
            />
          </label>
          <AllRewardFiltersPopUp />
        </div>
      </div>

      <Card className="rounded-lg shadow-sm">
        {isLoading ? (
          <div className="p-4 flex justify-center">
            <Loader />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="font-bold">Student</TableHead>
                <TableHead className="font-bold">Grade</TableHead>
                <TableHead className="font-bold">Class</TableHead>
                <TableHead className="font-bold text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.length > 0 ? (
                students.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage 
                            src={student.photoUrl} 
                            alt={`Photo of ${student.fullName}`}
                          />
                          <AvatarFallback>
                            {student.firstName?.charAt(0) || 'S'}
                          </AvatarFallback>
                        </Avatar>
                        <span>{student.fullName}</span>
                      </div>
                    </TableCell>
                    <TableCell>{student.grade}</TableCell>
                    <TableCell>{student.class}</TableCell>
                    
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 hover:bg-blue-50"
                        onClick={() => handleViewDetails(student)}
                      >
                        <Eye className="h-4 w-4 text-[#25AAE1]" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center">
                    <NoData />
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </Card>
    </section>
  );
}