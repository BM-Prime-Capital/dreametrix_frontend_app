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
import { AttendanceDisplay } from "../ui/AttendanceDisplay";
import PageTitleH1 from "../ui/page-title-h1";
import ClassSelect from "../ClassSelect";
import { Card } from "@/components/ui/card";
import AllRewardFiltersPopUp from "./AllRewardFiltersPopUp";
import { getRewardsGeneralView } from "@/services/RewardsService";
import { useRequestInfo } from "@/hooks/useRequestInfo";
import { localStorageKey } from "@/constants/global";

interface RewardsGeneralViewProps {
  changeView: (viewName: string, student?: any) => void;
}

export default function RewardsGeneralView({ changeView }: RewardsGeneralViewProps) {
  const { tenantDomain: tenantPrimaryDomain, accessToken, refreshToken } = useRequestInfo();
  const userData = JSON.parse(localStorage.getItem(localStorageKey.USER_DATA)!);
  const currentClass = JSON.parse(
    localStorage.getItem(localStorageKey.CURRENT_SELECTED_CLASS)!
  );
  
  const [isLoading, setIsLoading] = useState(false);
  const [rewards, setRewards] = useState<any[]>([]);
  const [rewardsCount, setRewardsCount] = useState(0);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  useEffect(() => {
    const loadRewards = async () => {
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
          fromDate,
          toDate,
          currentClass?.id // Ajout de l'ID de la classe courante
        );

        const transformedData = apiData.classes.flatMap((classItem: any) => 
          classItem.students.map((studentItem: any) => ({
            id: studentItem.student.id,
            student: studentItem.student.name,
            class: classItem.className,
            attendance: studentItem.attendance,
            pointGained: studentItem.pointGained,
            pointLost: studentItem.pointLost,
            total: studentItem.total,
            rawData: studentItem
          }))
        );

        setRewards(transformedData);
        setRewardsCount(apiData.results);
      } catch (error) {
        console.error("Failed to load rewards:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadRewards();
  }, [tenantPrimaryDomain, accessToken, refreshToken, fromDate, toDate, currentClass?.id]);

  // In GeneralView component
  // Dans GeneralView (correct)
  const handleViewDetails = (student: any) => {
    if (!student?.rawData?.student?.id) {
      console.log("Student data being passed to FocusView:", student.rawData);
      console.error("Invalid student data structure:", student);
      return;
    }
    changeView("FOCUSED_VIEW", student.rawData); // ← Passez l'objet complet
  };

  return (
    <section className="flex flex-col gap-4 w-full">
      {/* Première ligne : Titre à gauche, filtre à droite */}
      <div className="flex justify-between items-center bg-[#A36EAD] px-4 py-3 rounded-md">
        <PageTitleH1 title="Rewards of Students" className="text-white" />
        <ClassSelect className="text-white bg-[#8a5a93] hover:bg-[#7a4d83]" />
      </div>

      {/* Deuxième ligne : "Results found" à gauche, dates à droite */}
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

      {/* Tableau */}
      <Card className="rounded-lg shadow-sm">
        {isLoading ? (
          <div className="p-4 flex justify-center">
            <Loader />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="font-bold">Students</TableHead>
                <TableHead className="font-bold text-center">Class</TableHead>
                <TableHead className="font-bold text-center">Attendance</TableHead>
                <TableHead className="font-bold text-center">Point Gained</TableHead>
                <TableHead className="font-bold text-center">Point Lost</TableHead>
                <TableHead className="font-bold text-center">Total</TableHead>
                <TableHead className="font-bold text-center">ACTIONS</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rewards.length > 0 ? (
                rewards.map((reward) => (
                  <TableRow key={reward.id}>
                    <TableCell className="font-medium">{reward.student}</TableCell>
                    <TableCell className="text-center">{reward.class}</TableCell>
                    <TableCell>
                      <AttendanceDisplay attendance={reward.attendance} />
                    </TableCell>
                    <TableCell className="text-center">{reward.pointGained}</TableCell>
                    <TableCell className="text-center">{reward.pointLost}</TableCell>
                    <TableCell className="text-center">{reward.total}</TableCell>
                    <TableCell>
                      <div className="flex gap-2 justify-center">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 hover:bg-blue-50"
                          onClick={() => handleViewDetails(reward)}
                        >
                          <Eye className="h-4 w-4 text-[#25AAE1]" />
                        </Button>
                      </div>
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