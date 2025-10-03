import { teacherImages } from "@/constants/images";
import { Communication } from "@/types";
import Image from "next/image";
import { useState } from "react";

export default function CommunicationItem({
  communicationItem,
}: {
  communicationItem: Communication;
}) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b">
      <button
        className="w-full flex flex-wrap justify-between items-center gap-2 p-4 text-lg font-medium bg-gray-50 hover:bg-gray-100 transition-all"
        onClick={() => setIsOpen(!isOpen)}
      >
        <label className="flex gap-4 justify-center items-center">
          <Image
            src={communicationItem.userImageUrl}
            alt="user Image"
            width={40}
            height={40}
            className="rounded-full border-2 border-white"
          />
          <span className="whitespace-nowrap">
            {communicationItem.userName}
          </span>
        </label>
        <span className="w-[10ch] sm:w-[20ch] truncate overflow-hidden whitespace-nowrap">
          {communicationItem.message}
        </span>
        <label className="flex gap-4">
          <span className="text-muted-foreground">
            {`${communicationItem.created}`}
          </span>
          <Image
            src={teacherImages.delete}
            alt="delete"
            width={20}
            height={20}
          />
          <span
            className={`transform transition-transform ${
              isOpen ? "rotate-180" : "rotate-0"
            }`}
          >
            ▼
          </span>
        </label>
      </button>
      <div
        className={`flex justify-center overflow-hidden transition-all self-center ${
          isOpen ? "max-h-fit p-4" : "max-h-0 p-0"
        }`}
      >
        <div className="flex flex-col gap-4 max-w-[70%]">
          <p className="text-gray-700">{communicationItem.message}</p>
          <span>Attached Files : </span>
          <div className="flex flex-wrap gap-4">
            <Image
              src={"/assets/images/school_class2.jpg"}
              alt="delete"
              width={200}
              height={200}
            />
            <Image
              src={"/assets/images/school_class2.jpg"}
              alt="delete"
              width={200}
              height={200}
            />
            <Image
              src={"/assets/images/school_class2.jpg"}
              alt="delete"
              width={200}
              height={200}
            />
            <Image
              src={"/assets/images/school_class2.jpg"}
              alt="delete"
              width={200}
              height={200}
            />
            <Image
              src={"/assets/images/school_class2.jpg"}
              alt="delete"
              width={200}
              height={200}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
