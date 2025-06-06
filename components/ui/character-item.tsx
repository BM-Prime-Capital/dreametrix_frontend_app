import React from "react";
import GoodCharacterDialog from "../character/GoodCharacterDialog";
import { Character } from "@/types";
import BadCharacterDialog from "../character/BadCharacterDialog";

export default function CharacterItem({
  character,
  setShouldRefreshData,
  selectedDate,
  isReadOnly = false,
}: {
  character: Character;
  setShouldRefreshData: Function;
  selectedDate?: Date;
  isReadOnly?: boolean;
}) {
  return (
    <div className="flex gap-2">
      <GoodCharacterDialog
        character={character}
        setShouldRefreshData={setShouldRefreshData}
        selectedDate={selectedDate}
        isReadOnly={isReadOnly}
      />

      <BadCharacterDialog
        character={character}
        setShouldRefreshData={setShouldRefreshData}
        selectedDate={selectedDate}
        isReadOnly={isReadOnly}
      />
    </div>
  );
}
