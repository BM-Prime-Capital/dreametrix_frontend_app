/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useMemo } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { teacherImages } from "@/constants/images";
import Image from "next/image";
import { localStorageKey } from "@/constants/global";
import { Character } from "@/types";
//import { updateCharacter } from "@/services/CharacterService";
import { extractTraitsFromEntries } from "@/utils/characterUtils";
import { useRequestInfo } from "@/hooks/useRequestInfo";
import { format } from "date-fns";
import { updateCharacter } from "@/services/CharacterService";

const BadCharacterDialog = React.memo(
  ({
    character,
    setShouldRefreshData,
    selectedDate,
    isReadOnly = false,
  }: {
    character: Character;
    setShouldRefreshData: any;
    selectedDate?: Date;
    isReadOnly?: boolean;
  }) => {
    const [open, setOpen] = useState(false);
    const currentClass = JSON.parse(
      localStorage.getItem(localStorageKey.CURRENT_SELECTED_CLASS)??'{}'
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
    }, [character.bad_characters]); // Get current entries grouped by trait
    const currentEntries = useMemo(() => {
      if (!Array.isArray(character.bad_characters)) return   [];

      const entriesMap: Record<string, number> = {};
      character.bad_characters.forEach((entry) => {
        if (typeof entry === "string") {  
          const trait = entry;
          entriesMap[trait] = (entriesMap[trait] || 0) + 1;
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
        const newBadEntries: string[] = [];
        Object.keys(checkedItems).forEach((trait) => {
          if (checkedItems[trait]) {
            newBadEntries.push(trait);
          }
        });

        // Preserve existing entries and add new ones
        const existingEntries = Array.isArray(character.bad_characters)
          ? character.bad_characters.filter(
              (entry) =>
                    typeof entry === "string" &&
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
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-hidden">
          <form className="flex flex-col h-full" onSubmit={handleSubmit}>
            {/* Enhanced Header */}
            <div className="bg-gradient-to-r from-red-500 to-pink-600 -m-6 mb-6 p-6 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">
                      {character.student.first_name} {character.student.last_name}
                    </h2>
                    <p className="text-red-100 text-sm">{currentClass.name}</p>
                    {selectedDate && (
                      <p className="text-red-100 text-xs mt-1">
                        {format(selectedDate, "PPP")}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <Image src={teacherImages.down} width={24} height={24} alt="growth" />
                  </div>
                  <span className="text-sm font-medium">Growth Areas</span>
                </div>
              </div>
              {isReadOnly && (
                <div className="mt-4 bg-amber-500/20 border border-amber-300/30 rounded-lg px-3 py-2">
                  <span className="text-sm font-medium">📖 Read-only mode</span>
                </div>
              )}
            </div>

            {/* Current Entries Display */}
            {Object.keys(currentEntries).length > 0 && (
              <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 p-4 rounded-xl">
                <div className="flex items-center gap-2 mb-3">
                  <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <label className="text-sm font-semibold text-red-800">
                    Current Growth Area Observations
                  </label>
                </div>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {Object.entries(currentEntries).map(([trait, count]) => (
                    <div key={trait} className="flex items-center justify-between bg-white/60 rounded-lg px-3 py-2">
                      <span className="font-medium text-red-700">{trait}</span>
                      <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">
                        {count} {count === 1 ? 'entry' : 'entries'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <label className="font-semibold text-gray-800">
                  {isReadOnly ? "Available Growth Areas" : "Add New Growth Area Observations"}
                </label>
              </div>
              
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                <div className="space-y-4">
                  {!isReadOnly && (
                    <label className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors">
                      <input
                        className="hidden"
                        type="checkbox"
                        checked={selectAll}
                        onChange={handleSelectAllChange}
                      />
                      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                        selectAll ? 'bg-red-500 border-red-500' : 'border-gray-300'
                      }`}>
                        {selectAll && (
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      <span className="font-medium text-gray-700">Select All Areas</span>
                    </label>
                  )}

                  <div className="max-h-64 overflow-y-auto space-y-2 pr-2">
                    {allItems.map((item, index) => (
                      <label key={index} className={`flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200 transition-all duration-200 ${
                        !isReadOnly ? 'cursor-pointer hover:bg-red-50 hover:border-red-200' : 'opacity-60'
                      } ${checkedItems[item] ? 'bg-red-50 border-red-300' : ''}`}>
                        <input
                          className="hidden"
                          type="checkbox"
                          checked={checkedItems[item] || false}
                          onChange={() => !isReadOnly && handleItemChange(item)}
                          disabled={isReadOnly}
                        />
                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                          checkedItems[item] ? 'bg-red-500 border-red-500' : 'border-gray-300'
                        }`}>
                          {checkedItems[item] && (
                            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                        <span className={`font-medium ${isReadOnly ? 'text-gray-500' : 'text-gray-700'}`}>
                          {item}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 font-semibold text-gray-800">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
                Teacher Comments
              </label>
              <textarea
                className={`w-full border border-gray-300 rounded-xl p-4 resize-none transition-colors ${
                  isReadOnly ? "bg-gray-50 text-gray-500" : "focus:border-red-400 focus:ring-2 focus:ring-red-100"
                }`}
                rows={3}
                placeholder={isReadOnly ? "Teacher comment (read-only)" : "Add your observations and comments..."}
                value={comment}
                onChange={(e) => !isReadOnly && setComment(e.target.value)}
                disabled={isReadOnly}
              />
            </div>

            <div className="flex gap-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-medium transition-colors"
                onClick={() => setOpen(false)}
              >
                {isReadOnly ? "Close" : "Cancel"}
              </button>
              {!isReadOnly && (
                <button
                  disabled={isSubmitting}
                  type="submit"
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white rounded-xl font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving...
                    </span>
                  ) : (
                    "Save Changes"
                  )}
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
