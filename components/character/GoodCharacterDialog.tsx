"use client";

import React, { useCallback, useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

import { teacherImages } from "@/constants/images";
import Image from "next/image";
import PageTitleH2 from "../ui/page-title-h2";
import { localStorageKey, studentClassCharacters } from "@/constants/global";
import { Character } from "@/types";
import MultiSelectList from "../MultiSelectionList";

const GoodCharacterDialog = React.memo(
  ({ character }: { character: Character }) => {
    const [open, setOpen] = useState(false);
    const currentClass = JSON.parse(
      localStorage.getItem(localStorageKey.CURRENT_SELECTED_CLASS)!
    );
    const characterList: { id: number; name: string }[] = JSON.parse(
      localStorage.getItem(localStorageKey.CHARACTERS_LIST)!
    );
    const [isSelected, setIsSelected] = useState(false);
    const [selectedCharacters, setSelectedCharacters] = useState<string[]>([]); // this gonna be initialized by a prop
    const [comment, setComment] = useState<string>("");

    /*     const handleClick = (clickedCharacter: string) => {
      const foundCharacter = selectedCharacters.find(
        (character) => character === clickedCharacter
      );
      if (foundCharacter) {
        const newCharacters = selectedCharacters.filter(
          (character) => character !== clickedCharacter
        );

        setSelectedCharacters(newCharacters);
      } else {
        setSelectedCharacters([...selectedCharacters, clickedCharacter]);
      }
    }; */

    const handleSubmit = async (e: any) => {
      e.preventDefault();
      // TODO: handle submission

      const data = {
        character_id: 7,
        bad_statistics_character: ["lazy", "disorganized"],
        good_statistics_character: ["creative", "helpful"],
        teacher_comment: comment,
      };

      setOpen(false);
    };

    const handleSelectedCharacters = useCallback(
      (items: string[]) => {
        if (characterList.length > 0) {
          setSelectedCharacters(items);
        }
      },
      [characterList]
    );

    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild className="cursor-pointer">
          <span
            className={`flex justify-center items-center p-2 h-10 w-10 rounded-full cursor-pointer ${
              isSelected ? "bg-bgGreenLight2" : "border-2 border-bgGreenLight2"
            }`}
            onClick={() => setIsSelected(!isSelected)}
          >
            <Image src={teacherImages.up} width={20} height={20} alt="up" />
          </span>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[400px] h-[90%]">
          <form
            className="flex flex-col gap-4 "
            onSubmit={(e) => handleSubmit(e)}
          >
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
                    isSelected
                      ? "bg-bgGreenLight2"
                      : "border-2 border-bgGreenLight2"
                  }`}
                >
                  <Image
                    src={teacherImages.up}
                    width={20}
                    height={20}
                    alt="up"
                  />
                </span>
                <PageTitleH2 title="Character" className="text-bgGreenLight2" />
              </div>
            </div>
            <label>Select the options that apply:</label>
            <div className="h-[33%] overflow-y-scroll border-[1px] border-[#eee] p-2">
              <MultiSelectList
                allItems={characterList.flatMap((char) => char.name)}
                allShouldBeSelected={false}
                itemsAreLoading={false}
                selectedItems={[]}
                updateSelectedItems={handleSelectedCharacters}
                withSheckbox={true}
                alignment="col"
              />

              {/* {characterList?.map(
                (character: {
                  id: number;
                  name: string;
                  description: string;
                }) => (
                  <label
                    key={character.id}
                    className="flex gap-4 w-fit"
                    onClick={() => handleClick(character.name)}
                  >
                    <input type="checkbox" /> <span>{character.name}</span>
                  </label>
                )
              )} */}
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
                type="submit"
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white rounded-full px-4"
              >
                Apply
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    );
  }
);

export default GoodCharacterDialog;
