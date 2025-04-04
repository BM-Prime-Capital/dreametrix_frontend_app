"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import CharacterItem from "../ui/character-item";
import { useEffect, useState } from "react";
import { getAttendances } from "@/services/AttendanceService";
import { localStorageKey } from "@/constants/global";
import {
  getCharracters,
  getCharractersList,
} from "@/services/CharacterService";
import { getFormatedDate } from "@/utils/global";
import { Loader } from "../ui/loader";
import { useList } from "@/hooks/useList";
import { Character } from "@/types";

// This would typically come from your API
const charactersMock = [
  {
    id: 1,
    name: "Class 4 - Math",
    date: "03/04",
    student: "Sarah Boorn",
  },
  {
    id: 2,
    name: "Class 5 - Math",
    date: "08/03",
    student: "Jason Malcom",
  },
  {
    id: 3,
    name: "Class 3 - Science",
    date: "01/02",
    student: "Sarah Tante",
  },
];

export function CharacterTable() {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [primaryDomain, setPrimaryDomain] = useState<string>("");
  const [accessToken, setAccessToken] = useState<string>("");
  const [refreshToken, setRefreshToken] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const { list: charractersList } = useList(getCharractersList);

  useEffect(() => {
    const accessToken: any = localStorage.getItem(localStorageKey.ACCESS_TOKEN);
    const refreshToken: any = localStorage.getItem(
      localStorageKey.REFRESH_TOKEN
    );
    const tenantData: any = localStorage.getItem(localStorageKey.TENANT_DATA);

    const { primary_domain } = JSON.parse(tenantData);
    const domain = `https://${primary_domain}`;

    const { id: currentClassId } = JSON.parse(
      localStorage.getItem(localStorageKey.CURRENT_SELECTED_CLASS)!
    );

    const { owner_id } = JSON.parse(
      localStorage.getItem(localStorageKey.USER_DATA)!
    );

    setPrimaryDomain(domain);
    setAccessToken(accessToken);
    setRefreshToken(refreshToken);

    const loadCharacter = async () => {
      setIsLoading(true);
      const data = await getCharracters(
        { class_id: currentClassId, teacher_id: owner_id },
        domain,
        accessToken,
        refreshToken
      );
      console.log("getCharracters DATA => ", data);
      setCharacters(data);
      setIsLoading(false);
    };

    loadCharacter();
  }, []);

  useEffect(() => {
    if (charractersList) {
      localStorage.setItem(
        localStorageKey.CHARACTERS_LIST,
        JSON.stringify(charractersList)
      );
    }
  }, [charractersList]);

  return (
    <div className="w-full overflow-auto">
      {isLoading ? (
        <Loader />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>DATE</TableHead>
              <TableHead>STUDENT</TableHead>
              <TableHead>CHARACTER</TableHead>
              <TableHead>STATISTICS</TableHead>
              <TableHead>EDIT</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {characters.map((character, index) => (
              <TableRow key={character.character_id}>
                <TableCell>
                  {getFormatedDate(new Date(character.update_at))}
                </TableCell>
                <TableCell>{`${character.student.first_name} ${character.student.last_name}`}</TableCell>
                <TableCell>
                  <CharacterItem character={character} />
                </TableCell>
                <TableCell>
                  <div className="flex gap-8">
                    <span className="border-b-4 border-bgGreenLight2">
                      {character.good_characters.length}
                    </span>
                    <span className="border-b-4 border-bgPinkLight2">
                      {character.bad_characters.length}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Pencil className="h-4 w-4 text-bgGreenLight2" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
