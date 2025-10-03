import { teacherImages } from "@/constants/images";
import { Communication } from "@/types";
import Image from "next/image";
import { useState } from "react";

export default function ExternalComposeMsgWrapper({
  externalComposeMsg,
}: {
  externalComposeMsg: { visibleContent: any; hiddenContent: any };
}) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b">
      <button
        id="myButton"
        className="w-full flex flex-wrap justify-between items-center gap-2 p-4 text-lg font-medium bg-gray-50 hover:bg-gray-100 transition-all"
        onClick={() => setIsOpen(!isOpen)}
      >
        {externalComposeMsg.visibleContent}
      </button>
      <div
        className={`flex justify-center overflow-hidden transition-all self-center ${
          isOpen ? "max-h-fit p-2" : "max-h-0 p-0"
        }`}
      >
        {externalComposeMsg.hiddenContent}
      </div>
    </div>
  );
}
