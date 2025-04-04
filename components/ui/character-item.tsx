import React from "react";
import GoodCharacterDialog from "../character/GoodCharacterDialog";
import { Character } from "@/types";
import BadCharacterDialog from "../character/BadCharacterDialog";

export default function CharacterItem({
  character,
  setShouldRefreshData,
}: {
  character: Character;
  setShouldRefreshData: Function;
}) {
  return (
    <div className="flex gap-2">
      <GoodCharacterDialog
        character={character}
        setShouldRefreshData={setShouldRefreshData}
      />

      <BadCharacterDialog
        character={character}
        setShouldRefreshData={setShouldRefreshData}
      />
    </div>
  );
}
