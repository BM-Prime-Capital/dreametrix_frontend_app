/* eslint-disable @typescript-eslint/no-explicit-any */
 // eslint-disable-next-line @typescript-eslint/no-explicit-any
 
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
import { useRouter } from "next/navigation";

interface RewardsTableProps {
  refreshTime: string;
  onDataLoaded?: (count: number) => void;
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
    student: "David Niandu",
    attendance: { present: 4, absent: 1, late: 0, half_day: 1 },
    pointGained: 3,
    pointLost: 3,
    total: 2,
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

export function RewardsTable({ refreshTime, onDataLoaded }: RewardsTableProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
 
  const [rewards, setRewards] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    const loadRewards = async () => {
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 500));
      setRewards(rewardsData);
      setIsLoading(false);
      if (onDataLoaded) {
        onDataLoaded(rewardsData.length);
      }
    };
    loadRewards();
  }, [refreshTime, onDataLoaded]);

  const handleViewDetails = (studentId: number) => {
    router.push(`/rewards/${studentId}`);
  };

  return (
    <div className="w-full">
      {isLoading ? (
        <Loader />
      ) : (
        <>
          {rewards && rewards.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="font-bold">Students</TableHead>
                  <TableHead className="font-bold text-center">
                    Attendance
                  </TableHead>
                  <TableHead className="font-bold text-center">
                    Point Gained
                  </TableHead>
                  <TableHead className="font-bold text-center">
                    Point Lost
                  </TableHead>
                  <TableHead className="font-bold text-center">Total</TableHead>
                  <TableHead className="font-bold text-center">
                    ACTIONS
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rewards.map((reward) => (
                  <TableRow key={reward.id}>
                    <TableCell className="font-medium">
                      {reward.student}
                    </TableCell>
                    <TableCell>
                      <AttendanceDisplay attendance={reward.attendance} />
                    </TableCell>
                    <TableCell className="text-center">
                      {reward.pointGained}
                    </TableCell>
                    <TableCell className="text-center">
                      {reward.pointLost}
                    </TableCell>
                    <TableCell className="text-center">
                      {reward.total}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2 justify-center">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 hover:bg-blue-50"
                          onClick={() => handleViewDetails(reward.id)}
                        >
                          <Eye className="h-4 w-4 text-[#25AAE1]" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <NoData />
          )}
        </>
      )}
    </div>
  );
}
