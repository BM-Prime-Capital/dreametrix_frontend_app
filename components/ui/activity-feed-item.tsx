import { teacherImages } from "@/constants/images";
import { activityLabel, activityType } from "@/constants/userConstants";
import Image from "next/image";
import React from "react";

export default function ActivityFeedItem({
  type,
  userName,
  task,
  time,
}: {
  type: string;
  userName: string;
  task: string;
  time: string;
}) {
  const iconPath =
    type === activityType.DONE
      ? teacherImages.done
      : type === activityType.MESSAGE
      ? teacherImages.message
      : type === activityType.EDIT
      ? teacherImages.edit
      : teacherImages.upload;

  const label =
    type === activityType.DONE
      ? activityLabel.DONE
      : type === activityType.MESSAGE
      ? activityLabel.MESSAGE
      : type === activityType.EDIT
      ? activityLabel.EDIT
      : activityLabel.UPLOAD;

  const bgColor =
    type === activityType.DONE
      ? "bg-bgGreenLight"
      : type === activityType.MESSAGE
      ? "bg-bgPinkLight"
      : type === activityType.EDIT
      ? "bg-bgPurpleLight"
      : "bg-bgBlueLight";

  return (
    <div className="flex items-start gap-2">
      <div
        className={`flex justify-center items-center h-8 w-8 shrink-0 rounded-full ${bgColor}`}
      >
        <Image
          className="h-2 w-2"
          src={iconPath}
          alt="icon"
          width={100}
          height={100}
        />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm">
          <span className="font-bold">{userName}</span>
          <span className="text-muted-foreground"> {label}</span>
          <span className="font-bold">{` ${task}`}</span>
        </p>
        <p className="text-xs text-muted-foreground">{time}</p>
      </div>
    </div>
  );
}
