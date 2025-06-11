/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import reactivate from "@/public/assets/images/reactivate.png";
import Image from "next/image";

export function SeatingHistory({
  arrangements,
  currentArrangement,
  setCurrentArrangement,
  tenantPrimaryDomain,
  accessToken,
  onReactivate,
  currentClass,
}: {
  arrangements: any[];
  currentArrangement: any;
  setCurrentArrangement: (arrangement: any) => void;
  tenantPrimaryDomain: string;
  accessToken: string;
  refreshToken: string;
  onReactivate: () => void;
  currentClass: string | null; 
}) {
  const [showDeactivated, setShowDeactivated] = useState(false);
  const [deactivatedEvents, setDeactivatedEvents] = useState<any[]>([]);
  const [filteredArrangements, setFilteredArrangements] = useState<any[]>([]);
  const [reactivatingId, setReactivatingId] = useState<number | null>(null);

  useEffect(() => {
    if (currentClass) {
      const filtered = arrangements.filter(arr => 
        arr.courseName.includes(currentClass)
      );
      setFilteredArrangements(filtered);
    } else {
      setFilteredArrangements(arrangements);
    }
  }, [arrangements, currentClass]);

  const loadDeactivatedEvents = async () => {
    try {
      const response = await fetch(
        `${tenantPrimaryDomain}/seatings/deactivated-events/`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to load deactivated events");
      }

      const data = await response.json();
      if (currentClass) {
        const filtered = data.filter((event: any) => 
          event.name.includes(currentClass)
        );
        setDeactivatedEvents(filtered);
      } else {
        setDeactivatedEvents(data);
      }
    } catch (error) {
      console.error("Error loading deactivated events:", error);
    }
  };

  const handleReactivate = async (eventId: number) => {
    try {
      setReactivatingId(eventId);
      const response = await fetch(
        `${tenantPrimaryDomain}/seatings/reactivate-event/${eventId}/`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
  
      if (!response.ok) {
        throw new Error("Failed to reactivate event");
      }
  
      onReactivate();
      setShowDeactivated(false);
    } catch (error) {
      console.error("Error reactivating event:", error);
    } finally {
      setReactivatingId(null);
    }
  };

  return (
    <div className="w-fit sm:w-[200px] flex flex-col gap-6 bg-[#dfecf1] p-4 pb-0 sm:pb-4 pl-0 overflow-hidden">
      <div className="flex flex-col items-center pl-4">
        <h2 className="text-lg font-semibold">HISTORY</h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            setShowDeactivated(!showDeactivated);
            if (!showDeactivated) {
              loadDeactivatedEvents();
            }
          }}
          className={`border-1 transition-colors ${
            showDeactivated 
              ? "border-green-500 bg-green-50 hover:bg-green-100 text-green-700" 
              : "border-blue-500 bg-blue-50 hover:bg-blue-100 text-blue-700"
          }`}
        >
          {showDeactivated ? "Show Active" : "Show Deactivated"}
        </Button>
      </div>
      <div className="flex sm:flex-col gap-4 pl-4 sm:pl-0 overflow-scroll">
        {showDeactivated ? (
          deactivatedEvents.length > 0 ? (
            deactivatedEvents.map((event) => (
              <div
                key={event.id}
                className={`text-[#55b4f1] whitespace-nowrap cursor-pointer p-2 sm:p-0 flex items-center gap-2`}
              >
                <span>{event.name}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleReactivate(event.id);
                  }}
                  className="text-green-500 hover:text-green-700"
                  title="Reactivate"
                  disabled={reactivatingId === event.id}
                >
                  {reactivatingId === event.id ? (
                    <span className="loading-spinner"></span> 
                  ) : (
                    <Image
                      src={reactivate}
                      alt="reactivate"
                      width={20}
                      height={20}
                    />
                  )}
                </button>
              </div>
            ))
          ) : (
            <div className="text-muted-foreground p-2">
              No deactivated events
            </div>
          )
        ) : (
          filteredArrangements.map((arrangement) => (
            <div
              key={arrangement.id}
              className={`text-[#55b4f1] whitespace-nowrap cursor-pointer p-2 sm:p-0 ${
                currentArrangement?.id === arrangement.id
                  ? "bg-white sm:py-2 sm:px-4 rounded-t-lg sm:rounded-r-full"
                  : "sm:pl-4"
              }`}
              onClick={() => setCurrentArrangement(arrangement)}
            >
              {arrangement.title}
              <div className="text-xs text-gray-500">
                {arrangement.courseName}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}