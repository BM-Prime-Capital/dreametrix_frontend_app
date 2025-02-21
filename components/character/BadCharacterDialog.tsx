"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

import { teacherImages } from "@/constants/images";
import Image from "next/image";
import PageTitleH2 from "../ui/page-title-h2";
import { studentClassCharacters } from "@/constants/global";

const BadCharacterDialog = React.memo(
  ({
    studentName,
    studentClassName,
  }: {
    studentName: string;
    studentClassName: string;
  }) => {
    const [open, setOpen] = useState(false);
    const [isSelected, setIsSelected] = useState(false);
    const [selectedCharacters, setSelectedCharacters] = useState<string[]>([]); // this gonna be initialized by a prop

    const handleClick = (clickedCharacter: string) => {
      const foundCharacter = selectedCharacters.find(
        (character) => character === clickedCharacter
      );
      if (foundCharacter) {
        const newCharacters = selectedCharacters.filter(
          (character) => character !== clickedCharacter
        );

        setSelectedCharacters(newCharacters);
      } else {
        console.log("New selection");
        setSelectedCharacters([...selectedCharacters, clickedCharacter]);
      }
    };

    const handleSubmit = () => {
      /* if (selectedCharacters.length > 0) {
        setIsSelected(true);
      } else {
        setIsSelected(false);
      } */
      setOpen(false);
    };

    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild className="cursor-pointer">
          <span
            className={`flex justify-center items-center p-2 h-10 w-10 rounded-full cursor-pointer ${
              isSelected ? "bg-bgPinkLight2" : "border-2 border-bgPinkLight2"
            }`}
            onClick={() => setIsSelected(!isSelected)}
          >
            <Image src={teacherImages.down} width={20} height={20} alt="down" />
          </span>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[400px] h-[90%]">
          <div className="flex flex-col gap-4">
            <div className="flex justify-between p-2 border-b-[1px] border-[#eee]">
              <div className="flex flex-col gap-2 justify-center">
                <PageTitleH2 title={studentName} />
                <span className="text-muted-foreground">
                  {studentClassName}
                </span>
              </div>
              <div className="flex flex-col gap-2 justify-center">
                <span
                  className={`flex justify-center items-center p-2 h-10 w-10 rounded-full cursor-pointer ${
                    isSelected
                      ? "bg-bgPinkLight2"
                      : "border-2 border-bgPinkLight2"
                  }`}
                >
                  <Image
                    src={teacherImages.up}
                    width={20}
                    height={20}
                    alt="up"
                  />
                </span>
                <PageTitleH2 title="Character" className="text-bgPinkLight2" />
              </div>
            </div>
            <label>Select the options that apply:</label>
            <div>
              {studentClassCharacters.map((character, index) => (
                <label
                  key={index}
                  className="flex gap-4 w-fit"
                  onClick={() => handleClick(character)}
                >
                  <input type="checkbox" /> <span>{character}</span>
                </label>
              ))}
            </div>

            <textarea
              className="border-[1px] p-2 border-[#eee]"
              rows={3}
              placeholder="Comment"
            />

            <div className="flex justify-between gap-2">
              <button
                className="flex-1 rounded-full px-4 hover:bg-gray-100"
                onClick={() => setOpen(false)}
              >
                Cancel
              </button>
              <button
                onClick={() => handleSubmit()}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white rounded-full px-4"
              >
                Apply
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }
);

export default BadCharacterDialog;
