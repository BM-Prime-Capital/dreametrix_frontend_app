import React from "react";
import PageTitleH1 from "../ui/page-title-h1";
import Image from "next/image";
import { generalImages, teacherImages } from "@/constants/images";
import StatisticItem from "../ui/StatisticItem";
import { views } from "@/constants/global";

type CharacterStat = {
  className: string;
  students: number;
  goodCharacters: number;
  badCharacters: number;
};
// TO be replaced by API data
const attendanceStatistics: CharacterStat[] = [
  {
    className: "Class 3 Math",
    students: 89,
    goodCharacters: 264,
    badCharacters: 120,
  },
  {
    className: "Class 3 Language",
    students: 64,
    goodCharacters: 189,
    badCharacters: 150,
  },

  {
    className: "Class 4 Language",
    students: 57,
    goodCharacters: 124,
    badCharacters: 20,
  },
  {
    className: "Class 5 Math",
    students: 49,
    goodCharacters: 64,
    badCharacters: 120,
  },

  {
    className: "Class 5 Language",
    students: 74,
    goodCharacters: 84,
    badCharacters: 10,
  },
  {
    className: "Class 4 Math",
    students: 89,
    goodCharacters: 123,
    badCharacters: 151,
  },
  {
    className: "Class 6 Math",
    students: 89,
    goodCharacters: 264,
    badCharacters: 120,
  },
  {
    className: "Class 6 Language",
    students: 89,
    goodCharacters: 264,
    badCharacters: 120,
  },
];

function CharacterGeneralView({ changeView }: { changeView: Function }) {
  const handleClick = (className: string) => {
    //TODO: Change Current class
    changeView(views.FOCUSED_VIEW);
  };
  return (
    <div className="flex flex-col gap-8 w-full pb-4">
      <PageTitleH1 title="CHARACTER GENERAL VIEW " />
      <div className="flex flex-col gap-8 bg-white p-4 rounded-md">
        <div className="flex flex-wrap justify-evenly gap-2">
          <StatisticItem
            title="Students"
            iconUrl={teacherImages.whole_class}
            statNumber={`${attendanceStatistics
              .flatMap((as: CharacterStat) => as.students)
              .reduce((as1: number, as2: number) => {
                return as1 + as2;
              }, 0)}`}
          />
          <StatisticItem
            title="Good Characters"
            titleGgColor="bg-green-100"
            iconUrl={teacherImages.up}
            statNumber={`${attendanceStatistics
              .flatMap((as: CharacterStat) => as.goodCharacters)
              .reduce((as1: number, as2: number) => {
                return as1 + as2;
              }, 0)}`}
          />
          <StatisticItem
            title="Bad Characters"
            titleGgColor="bg-red-100"
            iconUrl={teacherImages.down}
            statNumber={`${attendanceStatistics
              .flatMap((as: CharacterStat) => as.badCharacters)
              .reduce((as1: number, as2: number) => {
                return as1 + as2;
              }, 0)}`}
          />

          <StatisticItem
            title="Classes"
            iconUrl={generalImages.classes}
            statNumber={`${attendanceStatistics.length}`}
          />
        </div>

        <div className="w-full overflow-scroll">
          <table className="w-full" id="statisticTable">
            <thead>
              <tr>
                <th>Class</th>
                <th>Students</th>
                <th>Good Character</th>
                <th>Good Character</th>
              </tr>
            </thead>

            <tbody>
              {attendanceStatistics.map((as: CharacterStat) => (
                <tr
                  className={"cursor-pointer"}
                  onClick={() => handleClick(as.className)}
                >
                  <td>{as.className}</td>
                  <td>{as.students}</td>
                  <td>{as.goodCharacters}</td>
                  <td>{as.badCharacters}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default CharacterGeneralView;
