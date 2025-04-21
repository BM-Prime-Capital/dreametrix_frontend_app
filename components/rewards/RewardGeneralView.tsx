"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import NoData from "../ui/no-data";
import { Loader } from "../ui/loader";
import { AttendanceDisplay } from "../ui/AttendanceDisplay";
import PageTitleH1 from "../ui/page-title-h1";
import ClassSelect from "../ClassSelect";
import { Card } from "@/components/ui/card";
import AllRewardFiltersPopUp from "./AllRewardFiltersPopUp";

interface RewardsGeneralViewProps {
  changeView: (viewName: string, student?: any) => void;
}

const rewardsData = [
  {
    id: 1,
    student: "Thomas Niandu",
    attendance: { present: 5, absent: 3, late: 1, half_day: 0 },
    pointGained: 6,
    pointLost: 6,
    total: 4,
  },
  {
    id: 2,
    student: "Odelia BARAKAEL",
    attendance: { present: 4, absent: 1, late: 0, half_day: 3 },
    pointGained: 2,
    pointLost: 9,
    total: 3,
  },
  {
    id: 3,
    student: "Joshua Niandu",
    attendance: { present: 3, absent: 2, late: 2, half_day: 0 },
    pointGained: 4,
    pointLost: 6,
    total: 2,
  },
];

export default function RewardsGeneralView({ changeView }: RewardsGeneralViewProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [rewards, setRewards] = useState<any[]>([]);
  const [rewardsCount, setRewardsCount] = useState(0);
  const [refreshTime, setRefreshTime] = useState("");

  useEffect(() => {
    const loadRewards = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 500));
      setRewards(rewardsData);
      setRewardsCount(rewardsData.length);
      setIsLoading(false);
    };
    loadRewards();
  }, [refreshTime]);

  const handleViewDetails = (student: any) => {
    changeView("FOCUSED_VIEW", student);
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
              onChange={(e) => setRefreshTime(e.target.value)}
            />
          </label>

          <label className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">To:</span>
            <input
              className="bg-white border rounded-md p-1 text-sm cursor-pointer"
              type="date"
              onChange={(e) => setRefreshTime(e.target.value)}
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
                  <TableCell colSpan={6} className="text-center">
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