import { ActivityType, activityType } from "@/components/constants/activityTypes";
import { CheckCircle, MessageSquare, Upload, Edit } from "lucide-react";

interface ActivityFeedItemProps {
  type: ActivityType;
  userName: string;
  task: string;
  time: string;
}

const iconMap = {
  [activityType.DONE]: CheckCircle,
  [activityType.MESSAGE]: MessageSquare,
  [activityType.UPLOAD]: Upload,
  [activityType.EDIT]: Edit,
};

const colorMap = {
  [activityType.DONE]: "bg-green-100 text-green-600",
  [activityType.MESSAGE]: "bg-yellow-100 text-yellow-600",
  [activityType.UPLOAD]: "bg-blue-100 text-blue-600",
  [activityType.EDIT]: "bg-purple-100 text-purple-600",
};

export default function ActivityFeedItem({ type, userName, task, time }: ActivityFeedItemProps) {
  const Icon = iconMap[type];
  
  return (
    <div className="flex gap-3">
      <div className="flex flex-col items-center">
        <div className={`p-2 rounded-full ${colorMap[type]}`}>
          <Icon className="h-4 w-4" />
        </div>
        {/* Vertical line */}
        <div className="w-px h-full bg-gray-200 my-2" />
      </div>
      <div className="flex-1">
        <p className="text-sm text-gray-600">
          <span className="font-semibold text-gray-900">{userName}</span>{" "}
          {type === activityType.DONE && "marked as done"}
          {type === activityType.MESSAGE && "sent you a message"}
          {type === activityType.UPLOAD && "uploaded"}
          {type === activityType.EDIT && "edited"}{" "}
          {task && <span className="font-semibold text-gray-900">{task}</span>}
        </p>
        <p className="text-xs text-gray-500 mt-1">{time}</p>
      </div>
    </div>
  );
}