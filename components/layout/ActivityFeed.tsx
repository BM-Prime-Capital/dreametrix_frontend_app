import { activityType } from "@/components/constants/activityTypes";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";
import ActivityFeedItem from "../ui/activity-feed-item";

export function ActivityFeed() {
  return (
    <Card className="w-full lg:w-[320px] h-fit sticky top-4 shadow-lg border-t-4 border-blue-500">
      <div className="flex flex-col gap-4 p-5">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Bell className="h-5 w-5 text-blue-600" />
            </div>
            Recent Activity
          </h2>
          <Button
            variant="ghost"
            size="sm"
            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
          >
            View All
          </Button>
        </div>

        <div className="space-y-4">
          <div className="text-xs text-gray-500 font-medium uppercase tracking-wider bg-gray-100 px-3 py-1 rounded-full">
            Today
          </div>
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

        <div className="space-y-4 pt-2">
          <div className="text-xs text-gray-500 font-medium uppercase tracking-wider bg-gray-100 px-3 py-1 rounded-full">
            Yesterday
          </div>
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
