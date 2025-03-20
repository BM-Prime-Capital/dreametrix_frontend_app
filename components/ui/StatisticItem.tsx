import Image from "next/image";
import React from "react";

function StatisticItem({
  title,
  iconUrl,
  statNumber,
  className,
  titleGgColor,
}: {
  title: string;
  iconUrl: string;
  statNumber: string;
  className?: string;
  titleGgColor?: string;
}) {
  return (
    <div
      className={`flex flex-col flex-1 shadow-md rounded-md border-[1px] border-[#eee] p-2 ${className}`}
    >
      <label
        className={`font-bold opacity-70 p-2 rounded-md ${
          titleGgColor ? titleGgColor : ""
        }`}
      >
        {title}
      </label>
      <label className="flex gap-2 p-2 items-center">
        <Image
          src={iconUrl}
          alt="students"
          height={100}
          width={100}
          className="w-6 h-6"
        />
        <span className="text-muted-foreground">{statNumber}</span>
      </label>
    </div>
  );
}

export default StatisticItem;
