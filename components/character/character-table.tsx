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
import { Pencil, Calendar, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import CharacterItem from "../ui/character-item";
import { useEffect, useState } from "react";
//import { getAttendances } from "@/services/AttendanceService";
import { localStorageKey } from "@/constants/global";
import {
  getCharracters,
  //getCharracters,
  getCharractersList,
} from "@/services/CharacterService";
import { extractTraitsFromEntries } from "@/utils/characterUtils";
import { Loader } from "../ui/loader";
import { useList } from "@/hooks/useList";
import { Character } from "@/types";
import { CharacterDatePicker } from "./CharacterDatePicker";
import { format } from "date-fns";

export function CharacterTable({
  selectedClassId,
}: {
  selectedClassId?: string | null;
}) {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [, setPrimaryDomain] = useState<string>("");
  const [, setAccessToken] = useState<string>("");
  const [, setRefreshToken] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const { list: charractersList } = useList(getCharractersList);
  const [shouldRefreshData, setShouldRefreshData] = useState<boolean>(true);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  useEffect(() => {
    const accessToken: any = localStorage.getItem(localStorageKey.ACCESS_TOKEN);
    const refreshToken: any = localStorage.getItem(
      localStorageKey.REFRESH_TOKEN
    );
    const tenantData: any = localStorage.getItem(localStorageKey.TENANT_DATA);

    if (!tenantData || !accessToken || !refreshToken) {
      return;
    }

    const { primary_domain } = JSON.parse(tenantData);
    const domain = `https://${primary_domain}`;

    // Use prop if available, otherwise fall back to localStorage
    let currentClassId = selectedClassId;
    if (!currentClassId) {
      const selectedClassData = localStorage.getItem(
        localStorageKey.CURRENT_SELECTED_CLASS
      );
      if (selectedClassData) {
        try {
          const { id } = JSON.parse(selectedClassData);
          currentClassId = id;
        } catch (error) {
          console.error(
            "Error parsing selected class from localStorage:",
            error
          );
        }
      }
    }

    const userData = localStorage.getItem(localStorageKey.USER_DATA);
    if (!userData) {
      return;
    }

    const { owner_id } = JSON.parse(userData);

    setPrimaryDomain(domain);
    setAccessToken(accessToken);
    setRefreshToken(refreshToken);

    const loadCharacter = async () => {
      if (shouldRefreshData && currentClassId) {
        setIsLoading(true);
        try {
          const data = await getCharracters(
            {
              class_id: parseInt(currentClassId),
              teacher_id: owner_id,
              date: format(selectedDate, "yyyy-MM-dd"),
            },
            domain,
            accessToken,
            refreshToken
          );
          setCharacters(data);
        } catch (error) {
          console.error("Error loading characters:", error);
          setCharacters([]);
        } finally {
          setIsLoading(false);
          setShouldRefreshData(false);
        }
      } else if (!currentClassId) {
        // If no class is selected, clear the characters
        setCharacters([]);
        setIsLoading(false);
        setShouldRefreshData(false);
      }
    };

    loadCharacter();
  }, [shouldRefreshData, selectedDate, selectedClassId]);

  useEffect(() => {
    if (charractersList) {
      localStorage.setItem(
        localStorageKey.CHARACTERS_LIST,
        JSON.stringify(charractersList)
      );
    }
  }, [charractersList]);

  // Trigger refresh when class selection changes
  useEffect(() => {
    console.log("CharacterTable: selectedClassId changed to:", selectedClassId);
    setShouldRefreshData(true);
  }, [selectedClassId]);

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
    setShouldRefreshData(true);
  };

  const handleRefresh = () => {
    setShouldRefreshData(true);
  };

 // const isSelectedDateToday =
   // format(selectedDate, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd");
  // Remove isPastDate restriction - allow editing of past observations
 // const isPastDate = false; // Always allow editing

  console.log("NOW CHARACTERS =>", characters);

  return (
    <div className="w-full space-y-4">
      {/* Date Navigation Header */}
      <div className="flex items-center justify-between bg-white p-4 rounded-lg border shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-gray-500" />
            <h3 className="font-medium text-gray-700">
              Character Observations
            </h3>
          </div>
          <CharacterDatePicker
            selectedDate={selectedDate}
            onDateChange={handleDateChange}
            disabled={isLoading}
          />
        </div>

        <div className="flex items-center gap-2">
          {/* Removed past date indicator since editing is now always allowed */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            <RotateCcw
              className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </div>
      </div>

      {/* Character Observations Table */}
      <div className="w-full overflow-auto bg-white rounded-lg border shadow-sm">
        {isLoading ? (
          <div className="p-8 flex justify-center">
            <Loader />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>DATE</TableHead>
                <TableHead>STUDENT</TableHead>
                <TableHead>CHARACTER OBSERVATIONS</TableHead>
                <TableHead>STATISTICS</TableHead>
                {/* <TableHead>ACTIONS</TableHead> */}
              </TableRow>
            </TableHeader>
            <TableBody>
              {characters.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center py-8 text-gray-500"
                  >
                    No character observations found for{" "}
                    {format(selectedDate, "PPP")}
                    <div className="mt-2 text-sm text-gray-400">
                      Click the + button to add observations for students
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                characters.map((character) => (
                  <TableRow key={character.character_id}>
                    <TableCell>{format(selectedDate, "MM/dd/yyyy")}</TableCell>
                    <TableCell className="font-medium">
                      {`${character.student.first_name} ${character.student.last_name}`}
                    </TableCell>
                    <TableCell>
                      <CharacterItem
                        character={character}
                        setShouldRefreshData={setShouldRefreshData}
                        selectedDate={selectedDate}
                        isReadOnly={false} // Always allow editing
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-8">
                        <span className="border-b-4 border-bgGreenLight2 px-2 py-1 text-sm font-medium">
                          +
                          {
                            extractTraitsFromEntries(
                              character.good_characters || []
                            ).length
                          }
                        </span>
                        <span className="border-b-4 border-bgPinkLight2 px-2 py-1 text-sm font-medium">
                          -
                          {
                            extractTraitsFromEntries(
                              character.bad_characters || []
                            ).length
                          }
                        </span>
                      </div>
                    </TableCell>
                    {/* <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        disabled={false} // Always allow editing
                        title="Edit character observations"
                      >
                        <Pencil className="h-4 w-4 text-bgGreenLight2" />
                      </Button>
                    </TableCell> */}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
