"use client";

import React, { useEffect, useState, useMemo } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { teacherImages } from "@/constants/images";
import Image from "next/image";
import PageTitleH2 from "../ui/page-title-h2";
import { localStorageKey } from "@/constants/global";
import { Character } from "@/types";
import { updateCharacter } from "@/services/CharacterService";
import { useRequestInfo } from "@/hooks/useRequestInfo";

const GoodCharacterDialog = React.memo(
  ({
    character,
    setShouldRefreshData,
  }: {
    character: Character;
    setShouldRefreshData: Function;
  }) => {
    const [open, setOpen] = useState(false);
    const currentClass = JSON.parse(
      localStorage.getItem(localStorageKey.CURRENT_SELECTED_CLASS)!
    );
    const characterList: { id: number; name: string }[] = JSON.parse(
      localStorage.getItem(localStorageKey.CHARACTERS_LIST)!
    );
    const { tenantDomain, accessToken, refreshToken } = useRequestInfo();
    const [comment, setComment] = useState<string>(character.teacher_comment);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    // Memoize the allItems to prevent unnecessary recalculations
    const allItems = useMemo(() => {
      return characterList ? characterList.flatMap((char) => char.name) : [];
    }, [characterList]);

    // Initialize checkedItems state properly
    const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>(
      () => {
        const initialChecked: Record<string, boolean> = {};
        if (characterList && character.good_characters.length > 0) {
          allItems.forEach((item) => {
            initialChecked[item] = character.good_characters.includes(item);
          });
        }
        return initialChecked;
      }
    );

    // Calculate selectAll based on checkedItems
    const selectAll = useMemo(() => {
      return Object.values(checkedItems).every(Boolean);
    }, [checkedItems]);

    // Handle individual item checkbox change
    const handleItemChange = (item: string) => {
      setCheckedItems(prev => ({
        ...prev,
        [item]: !prev[item]
      }));
    };

    // Handle Select All change
    const handleSelectAllChange = () => {
      const newCheckedState = !selectAll;
      setCheckedItems(
        Object.fromEntries(allItems.map(item => [item, newCheckedState]))
      );
    };

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsSubmitting(true);
      
      try {
        const data = {
          character_id: character.character_id,
          bad_statistics_character: character.bad_characters,
          good_statistics_character: Object.keys(checkedItems).filter(
            (key) => checkedItems[key]
          ),
          teacher_comment: comment,
        };
        
        await updateCharacter(
          data,
          tenantDomain,
          accessToken,
          refreshToken
        );
        
        setShouldRefreshData(true);
        setOpen(false);
      } finally {
        setIsSubmitting(false);
      }
    };

    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild className="cursor-pointer">
          <span
            className={`flex justify-center items-center p-2 h-10 w-10 rounded-full cursor-pointer ${
              character.good_characters.length > 0
                ? "bg-bgGreenLight2"
                : "border-2 border-bgGreenLight2"
            }`}
          >
            <Image src={teacherImages.up} width={20} height={20} alt="up" />
          </span>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[400px] h-[90%]">
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div className="flex justify-between p-2 border-b-[1px] border-[#eee]">
              <div className="flex flex-col gap-2 justify-center">
                <PageTitleH2
                  title={`${character.student.first_name} ${character.student.last_name}`}
                />
                <span className="text-muted-foreground">
                  {currentClass.name}
                </span>
              </div>
              <div className="flex flex-col gap-2 justify-center">
                <span
                  className={`flex justify-center items-center p-2 h-10 w-10 rounded-full cursor-pointer ${
                    character.good_characters.length > 0
                      ? "bg-bgGreenLight2"
                      : "border-2 border-bgGreenLight2"
                  }`}
                >
                  <Image src={teacherImages.up} width={20} height={20} alt="up" />
                </span>
                <PageTitleH2 title="Character" className="text-bgGreenLight2" />
              </div>
            </div>
            
            <label>Select the options that apply:</label>
            <div className="h-[33%] overflow-y-scroll border-[1px] border-[#eee] p-2">
              <div className="flex flex-col gap-4">
                <label className="flex items-center space-x-2">
                  <input
                    className="hidden"
                    type="checkbox"
                    checked={selectAll}
                    onChange={handleSelectAllChange}
                  />
                  <span className="flex p-[2px] border-[2px] border-[#ff69b4] w-[20px] h-[20px] rounded-sm">
                    <span className={`flex-1 rounded-xs ${selectAll ? "bg-[#ff69b4]" : ""}`} />
                  </span>
                  <span>Select All</span>
                </label>

                <div className="flex flex-col gap-4 flex-wrap">
                  {allItems.map((item, index) => (
                    <label key={index} className="flex items-center space-x-2">
                      <input
                        className="hidden"
                        type="checkbox"
                        checked={checkedItems[item] || false}
                        onChange={() => handleItemChange(item)}
                      />
                      <span className="flex p-[2px] border-[2px] border-[#ff69b4] w-[20px] h-[20px] rounded-sm">
                        <span className={`flex-1 rounded-xs ${checkedItems[item] ? "bg-[#ff69b4]" : ""}`} />
                      </span>
                      <span>{item}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <textarea
              className="border-[1px] p-2 border-[#eee]"
              rows={3}
              placeholder="Comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />

            <div className="flex justify-between gap-2">
              <button
                type="button"
                className="flex-1 rounded-full px-4 hover:bg-gray-100"
                onClick={() => setOpen(false)}
              >
                Cancel
              </button>
              <button
                disabled={isSubmitting}
                type="submit"
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white rounded-full px-4"
              >
                {isSubmitting ? "Submitting..." : "Apply"}
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    );
  }
);

GoodCharacterDialog.displayName = "GoodCharacterDialog";

export default GoodCharacterDialog;