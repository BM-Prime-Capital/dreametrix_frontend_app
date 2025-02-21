import { attendanceLabel } from "@/constants/global";
import { teacherImages } from "@/constants/images";
import Image from "next/image";
import React, { useState } from "react";
import GoodCharacterDialog from "../character/GoodCharacterDialog";
import BadCharacterDialog from "../character/BadCharacterDialog";

export default function CharacterItem() {
  const [isLiked, setIsLiked] = useState(false);
  const [isUnLiked, setIsUnLiked] = useState(false);

  return (
    <div className="flex gap-2">
      <GoodCharacterDialog
        studentName="Prince Bakenga"
        studentClassName="Class 5 - Math"
      />

      <BadCharacterDialog
        studentName="Prince Bakenga"
        studentClassName="Class 5 - Math"
      />
    </div>
  );
}
