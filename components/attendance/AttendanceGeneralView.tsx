import React, { useEffect } from "react";
import PageTitleH1 from "../ui/page-title-h1";
import Image from "next/image";
import { generalImages, teacherImages } from "@/constants/images";
import StatisticItem from "../ui/StatisticItem";
import { localStorageKey, views } from "@/constants/global";
import { useList } from "@/hooks/useList";
import { getClasses } from "@/services/ClassService";
import { ISchoolClass } from "@/types";
import { Loader } from "../ui/loader";
import { getAttendanceGeneralView } from "@/services/AttendanceService";

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
  const { list: data, isLoading, error } = useList(getAttendanceGeneralView);
  const allClasses = JSON.parse(
    localStorage.getItem(localStorageKey.ALL_CLASSES)!
  );

  const handleClick = (selectedClass: ISchoolClass) => {
    localStorage.setItem(
      localStorageKey.CURRENT_SELECTED_CLASS,
      JSON.stringify(allClasses.find((cl: any) => cl.id === selectedClass.id))
    );
    changeView(views.FOCUSED_VIEW);
  };

  return (
    <div className="flex flex-col gap-8 w-full pb-4">
      <div className="flex justify-between items-center bg-[#3e81d4] px-4 py-3 rounded-md">
          <PageTitleH1 title="Attendance General View" className="text-white" />
      </div>

      <div className="flex flex-col gap-8 bg-white p-4 rounded-md">
        <div className="flex flex-wrap justify-evenly gap-2">
          <StatisticItem
            title="Students"
            iconUrl={teacherImages.whole_class}
            statNumber={`${
              data?.student_sum_all_class ? data?.student_sum_all_class : "..."
            }`}
          />
          <StatisticItem
            title="Presences"
            titleGgColor="bg-green-100"
            iconUrl={generalImages.attendance_ok}
            statNumber={`${
              data?.status_present_sum_all_class
                ? data?.status_present_sum_all_class
                : "..."
            }`}
          />
          <StatisticItem
            title="Absences"
            titleGgColor="bg-red-100"
            iconUrl={generalImages.red_cross}
            statNumber={`${
              data?.status_absent_sum_all_class
                ? data?.status_absent_sum_all_class
                : "..."
            }`}
          />
          <StatisticItem
            title="Lates"
            titleGgColor="bg-yellow-100"
            iconUrl={generalImages.question_mark}
            statNumber={`${
              data?.status_late_sum_all_class
                ? data?.status_late_sum_all_class
                : "..."
            }`}
          />
          <StatisticItem
            title="Classes"
            iconUrl={generalImages.classes}
            statNumber={`${data?.classes_sum ? data?.classes_sum : "..."}`}
          />
        </div>

        <div className="w-full overflow-scroll">
          {isLoading ? (
            <Loader />
          ) : (
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
                {data?.classes.map((as: any, index: number) => (
                  <tr
                    key={index}
                    className={`cursor-pointer`}
                    onClick={() => handleClick(as)}
                  >
                    <td>{as.name}</td>
                    <td>{as.student_sum}</td>
                    <td>{as.present_status}</td>
                    <td>{as.absent_status}</td>
                    <td>{as.late_status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

export default AttendanceGeneralView;