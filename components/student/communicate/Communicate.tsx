"use client";

import { Card } from "@/components/ui/card";
import PageTitleH1 from "@/components/ui/page-title-h1";
import { ComposeMessageDialog } from "./ComposeMessageDialog";
import { generalImages, teacherImages } from "@/constants/images";
import { ExternalCommunicationDialog } from "./ExternalCommunicationDialog";
import { useState } from "react";
import Image from "next/image";
import CommunicationItem from "./CommunicationItem";
import { Communication } from "@/types";
import { NewMessageGroupDialog } from "./NewMessageGroupDialog";

type CommunicationGroupsWrapper = {
  id: number;
  title: string;
  iconUrl: string;
  communications: Communication[];
};

const communicationGroups: CommunicationGroupsWrapper[] = [
  {
    id: 0,
    title: "INDIVIDUAL STUDENT",
    iconUrl: teacherImages.individual_student,
    communications: [
      {
        userImageUrl: `${generalImages.student}`,
        userName: "Patrick Jane",
        message: "Hi Teacher, just to know, how is health now ?",
        created: "13:15 21/02/25",
        attachedFilesUrls: [
          { name: "My file 1", url: "/" },
          { name: "My second file", url: "/" },
        ],
      },
    ],
  },
  {
    id: 1,
    title: "WHOLE CLASS",
    iconUrl: teacherImages.whole_class,
    communications: [
      {
        userImageUrl: `${generalImages.student2}`,
        userName: "Merry Jones",
        message:
          "Hi Teacher, Lorem ipsum dolor sit, amet consectetur adipisicing elit. At officia rem aperiam dicta excepturi molestias quasi repellendus ut. Tenetur, tempore!",
        created: "13:15 21/02/25",
        attachedFilesUrls: [
          { name: "My file 1", url: "/" },
          { name: "My second file", url: "/" },
        ],
      },
      {
        userImageUrl: `${generalImages.student}`,
        userName: "Clara Morgan",
        message:
          "Hello, Lorem ipsum dolor sit, amet consectetur adipisicing elit. At officia rem aperiam dicta excepturi molestias quasi repellendus ut. Tenetur, tempore!",
        created: "13:15 21/02/25",
        attachedFilesUrls: [
          { name: "My file 1", url: "/" },
          { name: "My second file", url: "/" },
        ],
      },
    ],
  },
  {
    id: 2,
    title: "INDIVIDUAL PARENT",
    iconUrl: teacherImages.individual_parent,
    communications: [
      {
        userImageUrl: `${generalImages.student2}`,
        userName: "Merry Jones",
        message:
          "Hi Teacher, Lorem ipsum dolor sit, amet consectetur adipisicing elit. At officia rem aperiam dicta excepturi molestias quasi repellendus ut. Tenetur, tempore!",
        created: "13:15 21/02/25",
        attachedFilesUrls: [
          { name: "My file 1", url: "/" },
          { name: "My second file", url: "/" },
        ],
      },
      {
        userImageUrl: `${generalImages.student}`,
        userName: "Clara Morgan",
        message:
          "Hello, Lorem ipsum dolor sit, amet consectetur adipisicing elit. At officia rem aperiam dicta excepturi molestias quasi repellendus ut. Tenetur, tempore!",
        created: "13:15 21/02/25",
        attachedFilesUrls: [
          { name: "My file 1", url: "/" },
          { name: "My second file", url: "/" },
        ],
      },
    ],
  },
  {
    id: 3,
    title: "ALL PARENTS",
    iconUrl: teacherImages.all_parents,
    communications: [
      {
        userImageUrl: `${generalImages.student2}`,
        userName: "Merry Jones",
        message:
          "Hi Teacher, Lorem ipsum dolor sit, amet consectetur adipisicing elit. At officia rem aperiam dicta excepturi molestias quasi repellendus ut. Tenetur, tempore!",
        created: "13:15 21/02/25",
        attachedFilesUrls: [
          { name: "My file 1", url: "/" },
          { name: "My second file", url: "/" },
        ],
      },
      {
        userImageUrl: `${generalImages.student}`,
        userName: "Clara Morgan",
        message:
          "Hello, Lorem ipsum dolor sit, amet consectetur adipisicing elit. At officia rem aperiam dicta excepturi molestias quasi repellendus ut. Tenetur, tempore!",
        created: "13:15 21/02/25",
        attachedFilesUrls: [
          { name: "My file 1", url: "/" },
          { name: "My second file", url: "/" },
        ],
      },
    ],
  },
  {
    id: 4,
    title: "OTHER GROUPS",
    iconUrl: teacherImages.whole_class,
    communications: [
      {
        userImageUrl: `${generalImages.student2}`,
        userName: "Merry Jones",
        message:
          "Hi Teacher, Lorem ipsum dolor sit, amet consectetur adipisicing elit. At officia rem aperiam dicta excepturi molestias quasi repellendus ut. Tenetur, tempore!",
        created: "13:15 21/02/25",
        attachedFilesUrls: [
          { name: "My file 1", url: "/" },
          { name: "My second file", url: "/" },
        ],
      },
      {
        userImageUrl: `${generalImages.student}`,
        userName: "Clara Morgan",
        message:
          "Hello, Lorem ipsum dolor sit, amet consectetur adipisicing elit. At officia rem aperiam dicta excepturi molestias quasi repellendus ut. Tenetur, tempore!",
        created: "13:15 21/02/25",
        attachedFilesUrls: [
          { name: "My file 1", url: "/" },
          { name: "My second file", url: "/" },
        ],
      },
    ],
  },
];

export default function Communicate() {
  const [currentCommunicationGroup, setCurrentCommunicationGroup] =
    useState<CommunicationGroupsWrapper>(communicationGroups[0]);

  return (
    <section className="flex flex-col gap-2 w-full">

      <div className="flex justify-between items-center bg-[#3e81d4] px-4 py-3 rounded-md">
          <PageTitleH1 title="Communicate" className="text-white" />
      </div>
      
      <div className="flex gap-4 justify-start">
        <ComposeMessageDialog />
        <ExternalCommunicationDialog />
      </div>
      <Card className="rounded-md">
        <div className="w-full flex gap-6 bg-[#dfecf1] p-4 pb-0 pl-0">
          <div className="flex gap-4 pl-4 overflow-scroll">
            {communicationGroups.map((communicationGroup, index) => (
              <label
                key={index}
                className={`text-[#55b4f1] whitespace-nowrap cursor-pointer p-2 flex flex-col items-center justify-between ${
                  currentCommunicationGroup.id === communicationGroup.id
                    ? "bg-white rounded-t-lg"
                    : ""
                }`}
                onClick={() => setCurrentCommunicationGroup(communicationGroup)}
              >
                <Image
                  src={communicationGroup.iconUrl}
                  alt="Groug icon"
                  width={20}
                  height={20}
                />{" "}
                <span>{communicationGroup.title}</span>
              </label>
            ))}
          </div>
        </div>
        <div className="p-4 overflow-scroll">
          {currentCommunicationGroup.id === communicationGroups.length - 1 ? (
            <NewMessageGroupDialog />
          ) : (
            ""
          )}

          {currentCommunicationGroup.communications.map(
            (communication, index) => (
              <CommunicationItem
                key={index}
                communicationItem={communication}
              />
            )
          )}
        </div>
      </Card>
    </section>
  );
}
