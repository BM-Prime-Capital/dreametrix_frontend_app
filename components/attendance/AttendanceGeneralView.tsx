import React from "react";
import PageTitleH1 from "../ui/page-title-h1";
import Image from "next/image";
import { generalImages, teacherImages } from "@/constants/images";
import StatisticItem from "../ui/StatisticItem";
import { views } from "@/constants/global";

type AttendanceStat = {
  className: string;
  students: number;
  presences: number;
  absences: number;
  lates: number;
};
// TO be replaced by API data
const attendanceStatistics: AttendanceStat[] = [
  {
    className: "Class 3 Math",
    students: 89,
    presences: 264,
    absences: 120,
    lates: 23,
  },
  {
    className: "Class 3 Language",
    students: 64,
    presences: 189,
    absences: 150,
    lates: 23,
  },

  {
    className: "Class 4 Language",
    students: 57,
    presences: 124,
    absences: 20,
    lates: 130,
  },
  {
    className: "Class 5 Math",
    students: 49,
    presences: 64,
    absences: 120,
    lates: 22,
  },

  {
    className: "Class 5 Language",
    students: 74,
    presences: 84,
    absences: 10,
    lates: 12,
  },
  {
    className: "Class 4 Math",
    students: 89,
    presences: 123,
    absences: 151,
    lates: 27,
  },
  {
    className: "Class 6 Math",
    students: 89,
    presences: 264,
    absences: 120,
    lates: 23,
  },
  {
    className: "Class 6 Language",
    students: 89,
    presences: 264,
    absences: 120,
    lates: 23,
  },
];

function AttendanceGeneralView({ changeView }: { changeView: Function }) {
  const handleClick = (className: string) => {
    //TODO: Change Current class
    changeView(views.FOCUSED_VIEW);
  };
  return (
    <div className="flex flex-col gap-8 w-full pb-4">
      <PageTitleH1 title="ATTENDANCE GENERAL VIEW " />
      <div className="flex flex-col gap-8 bg-white p-4 rounded-md">
        <div className="flex flex-wrap justify-evenly gap-2">
          <StatisticItem
            title="Students"
            iconUrl={teacherImages.whole_class}
            statNumber={`${attendanceStatistics
              .flatMap((as: AttendanceStat) => as.students)
              .reduce((as1: number, as2: number) => {
                return as1 + as2;
              }, 0)}`}
          />
          <StatisticItem
            title="Presences"
            titleGgColor="bg-green-100"
            iconUrl={generalImages.attendance_ok}
            statNumber={`${attendanceStatistics
              .flatMap((as: AttendanceStat) => as.presences)
              .reduce((as1: number, as2: number) => {
                return as1 + as2;
              }, 0)}`}
          />
          <StatisticItem
            title="Absences"
            titleGgColor="bg-red-100"
            iconUrl={generalImages.red_cross}
            statNumber={`${attendanceStatistics
              .flatMap((as: AttendanceStat) => as.absences)
              .reduce((as1: number, as2: number) => {
                return as1 + as2;
              }, 0)}`}
          />
          <StatisticItem
            title="Lates"
            titleGgColor="bg-yellow-100"
            iconUrl={generalImages.question_mark}
            statNumber={`${attendanceStatistics
              .flatMap((as: AttendanceStat) => as.lates)
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
                <th>Presences</th>
                <th>Absences</th>
                <th>Lates</th>
              </tr>
            </thead>

            <tbody>
              {attendanceStatistics.map((as: AttendanceStat, index: number) => (
                <tr
                  key={index}
                  className={`cursor-pointer`}
                  onClick={() => handleClick(as.className)}
                >
                  <td>{as.className}</td>
                  <td>{as.students}</td>
                  <td>{as.presences}</td>
                  <td>{as.absences}</td>
                  <td>{as.lates}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AttendanceGeneralView;
