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
      <PageTitleH1 title="CHARACTER GENERAL VIEW " />
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
            title="Positives"
            titleGgColor="bg-green-100"
            iconUrl={teacherImages.up}
            statNumber={`${
              data?.good_character_sum_all_class
                ? data.good_character_sum_all_class
                : "..."
            }`}
          />
          <StatisticItem
            title="Areas of Growth"
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
                  <th>Positives</th>
                  <th>Areas of Growth</th>
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
