import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Check, FileText, MessageSquare } from "lucide-react";
import { Card } from "../ui/card";
import PageTitleH2 from "../ui/page-title-h2";
import { teacherImages } from "@/constants/images";
import Image from "next/image";
import ActivityFeedItem from "../ui/activity-feed-item";
import { activityType } from "@/constants/userConstants";

export function ActivityFeed() {
  return (
    <Card className="w-full lg:w-[300px] h-fit">
      <div className="flex flex-col gap-4 p-4">
        <PageTitleH2 title="Activity" />
        <div className="space-y-4">
          <div className="text-xs text-muted-foreground">TODAY</div>
          <ActivityFeedItem
            type={activityType.DONE}
            userName="Darika Samak"
            task="Listing on Science"
            time="8:40 PM"
          />

          <ActivityFeedItem
            type={activityType.MESSAGE}
            userName="Emilee Simchenko"
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
          <div className="text-xs text-muted-foreground">YESTERDAY</div>
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
            time="6:49 PM"
          />

          <ActivityFeedItem
            type={activityType.EDIT}
            userName="Darika Samak"
            task="Listing on Science"
            time="7:32 PM"
          />

          <ActivityFeedItem
            type={activityType.MESSAGE}
            userName="Emilee Simchenko"
            task=""
            time="6:02 PM"
          />
        </div>
      </div>
    </Card>
  );
}
