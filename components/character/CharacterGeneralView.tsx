import React from "react";
import PageTitleH1 from "../ui/page-title-h1";
import Image from "next/image";
import { generalImages, teacherImages } from "@/constants/images";
import StatisticItem from "../ui/StatisticItem";
import { localStorageKey, views } from "@/constants/global";
import { ISchoolClass } from "@/types";
import { useList } from "@/hooks/useList";
import { Loader } from "../ui/loader";
import { getCharacterGeneralView } from "@/services/CharacterService";

function CharacterGeneralView({ changeView }: { changeView: Function }) {
  const { list: data, isLoading, error } = useList(getCharacterGeneralView);
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
        <PageTitleH1 title="Character General View" className="text-white" />
      </div>
      <div className="flex flex-col gap-8 bg-white p-4 rounded-md">
        <div className="flex flex-wrap justify-evenly gap-2">
          <StatisticItem
            title="Students"
            iconUrl={teacherImages.whole_class}
            statNumber={`${
              data?.student_sum_all_class ? data.student_sum_all_class : "..."
            }`}
          />
          <StatisticItem
            title="Good Characters"
            titleGgColor="bg-green-100"
            iconUrl={teacherImages.up}
            statNumber={`${
              data?.good_character_sum_all_class
                ? data.good_character_sum_all_class
                : "..."
            }`}
          />
          <StatisticItem
            title="Bad Characters"
            titleGgColor="bg-red-100"
            iconUrl={teacherImages.down}
            statNumber={`${
              data?.bad_character_sum_all_class
                ? data.bad_character_sum_all_class
                : "..."
            }`}
          />

          <StatisticItem
            title="Classes"
            iconUrl={generalImages.classes}
            statNumber={`${data?.classes_sum ? data.classes_sum : "..."}`}
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
                  <th>Good Character</th>
                  <th>Bad Character</th>
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
                    <td>{as.good_character}</td>
                    <td>{as.bad_character}</td>
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

export default CharacterGeneralView;
