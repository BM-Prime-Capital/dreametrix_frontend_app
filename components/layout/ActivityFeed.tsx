import { activityType } from "@/components/constants/activityTypes"
import { Card } from "@/components/ui/card";
import ActivityFeedItem from "../ui/activity-feed-item";

export function ActivityFeed() {
  return (
    <Card className="w-full lg:w-[300px]">
      <div className="flex flex-col gap-4 p-4">
        <h2 className="text-xl font-semibold">Activity</h2>
        
        <div className="space-y-4">
          <div className="text-xs text-gray-500">TODAY</div>
          <ActivityFeedItem
            type={activityType.DONE}
            userName="Darika Samak"
            task="Listing on Science"
            time="8:40 PM"
          />
          <ActivityFeedItem
            type={activityType.MESSAGE}
            userName="Emilee Sinchenko"
            task=""
            time="7:32 PM"
          />
          <ActivityFeedItem
            type={activityType.UPLOAD}
            userName="Darika Samak"
            task="4 files on Task3 - Mathematics"
            time="6:02 PM"
          />
        </div>

        <div className="space-y-4">
          <div className="text-xs text-gray-500">YESTERDAY</div>
          <ActivityFeedItem
            type={activityType.UPLOAD}
            userName="Darika Samak"
            task="4 files on Task2 - Mathematics"
            time="6:02 PM"
          />
          <ActivityFeedItem
            type={activityType.DONE}
            userName="Darika Samak"
            task="Listing on Science"
            time="5:49 PM"
          />
          <ActivityFeedItem
            type={activityType.EDIT}
            userName="Darika Samak"
            task="Listing on Science"
            time="5:40 PM"
          />
          <ActivityFeedItem
            type={activityType.MESSAGE}
            userName="Emilee Sinchenko"
            task=""
            time="4:32 PM"
          />
        </div>
      </div>
    </Card>
  );
}