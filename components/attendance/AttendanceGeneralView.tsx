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

function AttendanceGeneralView({ changeView }: { changeView: Function }) {
  const { list: data, isLoading, error } = useList(getAttendanceGeneralView);
  const allClasses = JSON.parse(
    localStorage.getItem(localStorageKey.ALL_CLASSES)!
  );

  // Fonction pour formater le nom de la classe
  const formatClassName = (name: string) => {
    const parts = name.split(' - ');
    // Supprime la duplication du grade (ex: "Class 6 - Class 6 - Math" => "Class 6 - Math")
    if (parts.length >= 3 && parts[0] === parts[1]) {
      return `${parts[0]} - ${parts.slice(2).join(' - ')}`;
    }
    return name;
  };

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

      <div className="flex flex-col gap-8 bg-white p-4 rounded-md shadow-sm">
        <div className="flex flex-wrap justify-evenly gap-4">
          <StatisticItem
            title="Students"
            iconUrl={teacherImages.whole_class}
            statNumber={data?.student_sum_all_class ?? "..."}
          />
          <StatisticItem
            title="Presences"
            titleGgColor="bg-green-100"
            iconUrl={generalImages.attendance_ok}
            statNumber={data?.status_present_sum_all_class ?? "..."}
          />
          <StatisticItem
            title="Absences"
            titleGgColor="bg-red-100"
            iconUrl={generalImages.red_cross}
            statNumber={data?.status_absent_sum_all_class ?? "..."}
          />
          <StatisticItem
            title="Lates"
            titleGgColor="bg-yellow-100"
            iconUrl={generalImages.question_mark}
            statNumber={data?.status_late_sum_all_class ?? "..."}
          />
          <StatisticItem
            title="Classes"
            iconUrl={generalImages.classes}
            statNumber={data?.classes_sum ?? "..."}
          />
        </div>

        <div className="w-full overflow-auto">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader />
            </div>
          ) : error ? (
            <div className="text-center text-red-500 py-4">{error}</div>
          ) : (
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-[#3e81d4]/10">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-[#3e81d4] uppercase tracking-wider">
                      Class
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-[#3e81d4] uppercase tracking-wider">
                      Students
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-[#3e81d4] uppercase tracking-wider">
                      Presences
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-[#3e81d4] uppercase tracking-wider">
                      Absences
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-[#3e81d4] uppercase tracking-wider">
                      Lates
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200">
                  {data?.classes?.map((as: any) => (
                    <tr
                      key={as.id}
                      className="hover:bg-[#3e81d4]/5 cursor-pointer"
                      onClick={() => handleClick(as)}
                    >
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                        {formatClassName(as.name)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 text-center">
                        {as.student_sum}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 text-center">
                        {as.present_status}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 text-center">
                        {as.absent_status}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 text-center">
                        {as.late_status}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AttendanceGeneralView;