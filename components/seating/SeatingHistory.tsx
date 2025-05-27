"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { teacherImages } from "@/constants/images";
import Image from "next/image";

export function SeatingHistory({
  arrangements,
  currentArrangement,
  setCurrentArrangement,
  tenantPrimaryDomain,
  accessToken,
  refreshToken,
  onReactivate,
}: {
  arrangements: any[];
  currentArrangement: any;
  setCurrentArrangement: (arrangement: any) => void;
  tenantPrimaryDomain: string;
  accessToken: string;
  refreshToken: string;
  onReactivate: () => void;
}) {
  const [showDeactivated, setShowDeactivated] = useState(false);
  const [deactivatedEvents, setDeactivatedEvents] = useState<any[]>([]);

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
      setDeactivatedEvents(data);
    } catch (error) {
      console.error("Error loading deactivated events:", error);
    }
  };

  const handleReactivate = async (eventId: number) => {
    try {
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
    }
  };

  return (
    <div className="w-full sm:w-fit min-w-[200px] flex flex-col gap-6 bg-[#dfecf1] p-4 pb-0 sm:pb-4 pl-0">
      <div className="flex justify-between items-center pl-4">
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
                  onClick={() => handleReactivate(event.id)}
                  className="text-green-500 hover:text-green-700"
                  title="Reactivate"
                >
                  <Image
                    src={teacherImages.reactivate}
                    alt="reactivate"
                    width={20}
                    height={20}
                  />
                </button>
              </div>
            ))
          ) : (
            <div className="text-muted-foreground p-2">
              No deactivated events
            </div>
          )
        ) : (
          arrangements.map((arrangement) => (
            <div
              key={arrangement.id}
              className={`text-[#55b4f1] whitespace-nowrap cursor-pointer p-2 sm:p-0 ${
                currentArrangement?.id === arrangement.id
                  ? "bg-white sm:py-2 sm:px-4 rounded-t-lg sm:rounded-r-full"
                  : "sm:pl-4"
              }`}
              onClick={() => setCurrentArrangement(arrangement)}
            >
              {arrangement.name}
            </div>
          ))
        )}
      </div>
    </div>
  );
}