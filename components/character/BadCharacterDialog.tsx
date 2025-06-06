import React, { useState, useMemo } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { teacherImages } from "@/constants/images";
import Image from "next/image";
import PageTitleH2 from "../ui/page-title-h2";
import { localStorageKey } from "@/constants/global";
import { Character, CharacterObservationEntry } from "@/types";
import { updateCharacter } from "@/services/CharacterService";
import {
  extractTraitsFromEntries,
  createCharacterObservationEntry,
  parseDomainForDisplay,
} from "@/utils/characterUtils";
import { useRequestInfo } from "@/hooks/useRequestInfo";
import { format } from "date-fns";

const BadCharacterDialog = React.memo(
  ({
    character,
    setShouldRefreshData,
    selectedDate,
    isReadOnly = false,
  }: {
    character: Character;
    setShouldRefreshData: Function;
    selectedDate?: Date;
    isReadOnly?: boolean;
  }) => {
    const [open, setOpen] = useState(false);
    const currentClass = JSON.parse(
      localStorage.getItem(localStorageKey.CURRENT_SELECTED_CLASS)!
    );
    const characterList: {
      id: number;
      name: string;
      character_type: string;
      value_point: string;
    }[] = JSON.parse(localStorage.getItem(localStorageKey.CHARACTERS_LIST)!);
    const { tenantDomain, accessToken, refreshToken } = useRequestInfo();
    const [comment, setComment] = useState<string>(character.teacher_comment);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    // Get current traits for the character
    const currentTraits = useMemo(() => {
      return extractTraitsFromEntries(character.bad_characters);
    }, [character.bad_characters]);

    // Get current entries grouped by trait
    const currentEntries = useMemo(() => {
      if (!Array.isArray(character.bad_characters)) return {};

      const entriesMap: Record<string, CharacterObservationEntry[]> = {};
      character.bad_characters.forEach((entry) => {
        if (typeof entry === "string") {
          const trait = entry;
          if (!entriesMap[trait]) entriesMap[trait] = [];
          entriesMap[trait].push(createCharacterObservationEntry(trait));
        } else {
          const trait = entry.trait;
          if (!entriesMap[trait]) entriesMap[trait] = [];
          entriesMap[trait].push(entry);
        }
      });
      return entriesMap;
    }, [character.bad_characters]);

    // Memoize character list
    const allItems = useMemo(() => {
      return characterList
        ? characterList
            .filter((char) => char.character_type === "bad")
            .flatMap((char) => char.name)
        : [];
    }, [characterList]);

    // Initialize checked items state
    const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>(
      () => {
        const initialChecked: Record<string, boolean> = {};
        if (characterList && currentTraits.length > 0) {
          allItems.forEach((item) => {
            initialChecked[item] = currentTraits.includes(item);
          });
        }
        return initialChecked;
      }
    );

    // Track comment for individual traits
    const [traitComments, setTraitComments] = useState<Record<string, string>>(
      {}
    );

    // Derived select all state
    const selectAll = useMemo(() => {
      return Object.values(checkedItems).every(Boolean);
    }, [checkedItems]);

    const handleItemChange = (item: string) => {
      setCheckedItems((prev) => ({
        ...prev,
        [item]: !prev[item],
      }));
    };

    const handleSelectAllChange = () => {
      const newCheckedState = !selectAll;
      setCheckedItems(
        Object.fromEntries(allItems.map((item) => [item, newCheckedState]))
      );
    };

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (isReadOnly) return;

      setIsSubmitting(true);

      try {
        // Create new entries for selected traits
        const newBadEntries: CharacterObservationEntry[] = [];
        Object.keys(checkedItems).forEach((trait) => {
          if (checkedItems[trait]) {
            const entry = createCharacterObservationEntry(
              trait,
              traitComments[trait] || undefined
            );
            newBadEntries.push(entry);
          }
        });

        // Preserve existing entries and add new ones
        const existingEntries = Array.isArray(character.bad_characters)
          ? character.bad_characters.filter(
              (entry) =>
                typeof entry !== "string" ||
                !Object.keys(checkedItems).includes(entry)
            )
          : [];

        const combinedEntries = [...existingEntries, ...newBadEntries];

        const data = {
          character_id: character.character_id,
          good_statistics_character: character.good_characters,
          bad_statistics_character: combinedEntries,
          teacher_comment: comment,
          observation_date: selectedDate
            ? format(selectedDate, "yyyy-MM-dd")
            : undefined,
        };

        await updateCharacter(data, tenantDomain, accessToken, refreshToken);

        setShouldRefreshData(true);
        setOpen(false);
      } catch (error) {
        console.error("Error updating character:", error);
      } finally {
        setIsSubmitting(false);
      }
    };

    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild className="cursor-pointer">
          <span
            className={`flex justify-center items-center p-2 h-10 w-10 rounded-full cursor-pointer ${
              currentTraits.length > 0
                ? "bg-bgPinkLight2"
                : "border-2 border-bgPinkLight2"
            } ${isReadOnly ? "opacity-60" : ""}`}
          >
            <Image src={teacherImages.down} width={20} height={20} alt="down" />
          </span>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[500px] h-[90%]">
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div className="flex justify-between p-2 border-b-[1px] border-[#eee]">
              <div className="flex flex-col gap-2 justify-center">
                <PageTitleH2
                  title={`${character.student.first_name} ${character.student.last_name}`}
                />
                <span className="text-muted-foreground">
                  {currentClass.name}
                </span>
                {selectedDate && (
                  <span className="text-sm text-gray-500">
                    {format(selectedDate, "PPP")}
                  </span>
                )}
                {isReadOnly && (
                  <span className="text-sm text-amber-600 bg-amber-50 px-2 py-1 rounded">
                    Read-only mode
                  </span>
                )}
              </div>
              <div className="flex flex-col gap-2 justify-center">
                <span
                  className={`flex justify-center items-center p-2 h-10 w-10 rounded-full cursor-pointer ${
                    currentTraits.length > 0
                      ? "bg-bgPinkLight2"
                      : "border-2 border-bgPinkLight2"
                  }`}
                >
                  <Image
                    src={teacherImages.down}
                    width={20}
                    height={20}
                    alt="down"
                  />
                </span>
                <PageTitleH2 title="Character" className="text-bgPinkLight2" />
              </div>
            </div>

            {/* Current Entries Display */}
            {Object.keys(currentEntries).length > 0 && (
              <div className="bg-gray-50 p-3 rounded-md">
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Current Observations:
                </label>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {Object.entries(currentEntries).map(([trait, entries]) => {
                    const { displayText } = parseDomainForDisplay(trait);
                    return (
                      <div key={trait} className="text-sm">
                        <span className="font-medium text-red-700">
                          {displayText}
                        </span>
                        <span className="text-gray-500 ml-2">
                          ({entries.length} entries)
                        </span>
                        {entries.length > 0 &&
                          entries[entries.length - 1].comment && (
                            <div className="text-xs text-gray-600 ml-4 italic">
                              "{entries[entries.length - 1].comment}"
                            </div>
                          )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <label>
              {isReadOnly ? "Available traits:" : "Add new observations:"}
            </label>
            <div className="h-[33%] overflow-y-scroll border-[1px] border-[#eee] p-2">
              <div className="flex flex-col gap-4">
                {!isReadOnly && (
                  <label className="flex items-center space-x-2">
                    <input
                      className="hidden"
                      type="checkbox"
                      checked={selectAll}
                      onChange={handleSelectAllChange}
                    />
                    <span className="flex p-[2px] border-[2px] border-[#ff69b4] w-[20px] h-[20px] rounded-sm">
                      <span
                        className={`flex-1 rounded-xs ${
                          selectAll ? "bg-[#ff69b4]" : ""
                        }`}
                      />
                    </span>
                    <span>Select All</span>
                  </label>
                )}

                <div className="flex flex-col gap-4 flex-wrap">
                  {allItems.map((item, index) => {
                    const { displayText } = parseDomainForDisplay(item);
                    return (
                      <div key={index} className="space-y-2">
                        <label className="flex items-center space-x-2">
                          <input
                            className="hidden"
                            type="checkbox"
                            checked={checkedItems[item] || false}
                            onChange={() =>
                              !isReadOnly && handleItemChange(item)
                            }
                            disabled={isReadOnly}
                          />
                          <span
                            className={`flex p-[2px] border-[2px] border-[#ff69b4] w-[20px] h-[20px] rounded-sm ${
                              isReadOnly ? "opacity-50" : ""
                            }`}
                          >
                            <span
                              className={`flex-1 rounded-xs ${
                                checkedItems[item] ? "bg-[#ff69b4]" : ""
                              }`}
                            />
                          </span>
                          <span className={isReadOnly ? "text-gray-500" : ""}>
                            {displayText}
                          </span>
                        </label>
                        {checkedItems[item] && !isReadOnly && (
                          <input
                            type="text"
                            placeholder="Optional comment for this trait..."
                            className="ml-6 text-sm border border-gray-200 rounded px-2 py-1 w-full"
                            value={traitComments[item] || ""}
                            onChange={(e) =>
                              setTraitComments((prev) => ({
                                ...prev,
                                [item]: e.target.value,
                              }))
                            }
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <textarea
              className={`border-[1px] p-2 border-[#eee] ${
                isReadOnly ? "bg-gray-50 text-gray-500" : ""
              }`}
              rows={3}
              placeholder={
                isReadOnly ? "Teacher comment (read-only)" : "General comment"
              }
              value={comment}
              onChange={(e) => !isReadOnly && setComment(e.target.value)}
              disabled={isReadOnly}
            />

            <div className="flex justify-between gap-2">
              <button
                type="button"
                className="flex-1 rounded-full px-4 hover:bg-gray-100"
                onClick={() => setOpen(false)}
              >
                {isReadOnly ? "Close" : "Cancel"}
              </button>
              {!isReadOnly && (
                <button
                  disabled={isSubmitting}
                  type="submit"
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white rounded-full px-4"
                >
                  {isSubmitting ? "Submitting..." : "Apply"}
                </button>
              )}
            </div>
          </form>
        </DialogContent>
      </Dialog>
    );
  }
);

BadCharacterDialog.displayName = "BadCharacterDialog";

export default BadCharacterDialog;
