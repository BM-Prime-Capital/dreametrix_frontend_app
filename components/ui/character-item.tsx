import { attendanceLabel } from "@/constants/global";
import { teacherImages } from "@/constants/images";
import Image from "next/image";
import React, { useState } from "react";
import GoodCharacterDialog from "../character/GoodCharacterDialog";
import BadCharacterDialog from "../character/BadCharacterDialog";
import { Character } from "@/types";

export default function CharacterItem({ character }: { character: Character }) {
  const [isLiked, setIsLiked] = useState(false);
  const [isUnLiked, setIsUnLiked] = useState(false);

  return (
    <div className="flex gap-2">
      <GoodCharacterDialog character={character} />

      <BadCharacterDialog studentClassName="" studentName="" />
    </div>
  );
}
