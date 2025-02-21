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

// This would typically come from your API
const characters = [
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
  return (
    <div className="w-full overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>CLASS</TableHead>
            <TableHead>DATE</TableHead>
            <TableHead>STUDENT</TableHead>
            <TableHead>CHARACTER</TableHead>
            <TableHead>STATISTICS</TableHead>
            <TableHead>EDIT</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {characters.map((character, index) => (
            <TableRow
              key={character.id}
              className={index % 2 === 0 ? "bg-sky-50/50" : ""}
            >
              <TableCell>{character.name}</TableCell>
              <TableCell>{character.date}</TableCell>
              <TableCell>{character.student}</TableCell>
              <TableCell>
                <CharacterItem />
              </TableCell>
              <TableCell>
                <div className="flex gap-8">
                  <span className="border-b-4 border-bgGreenLight2">{45}</span>
                  <span className="border-b-4 border-bgPinkLight2">{24}</span>
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
    </div>
  );
}
