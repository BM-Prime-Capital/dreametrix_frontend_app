import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Check, FileText, MessageSquare } from "lucide-react"

export function ActivityFeed() {
  return (
    <div className="p-4">
      <h2 className="font-semibold mb-4">Activity</h2>
      <div className="space-y-4">
        <div className="text-xs text-muted-foreground">TODAY</div>
        <div className="flex items-start gap-2">
          <Avatar className="h-8 w-8 shrink-0">
            <AvatarImage src="/placeholder.svg" />
            <AvatarFallback>DS</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm truncate">
              <span className="font-medium">Darika Samak</span> mark as done
              <span className="text-muted-foreground"> Listing on Science</span>
            </p>
            <p className="text-xs text-muted-foreground">8:40 PM</p>
          </div>
          <Check className="h-4 w-4 text-green-500 shrink-0" />
        </div>
        <div className="flex items-start gap-2">
          <Avatar className="h-8 w-8 shrink-0">
            <AvatarImage src="/placeholder.svg" />
            <AvatarFallback>ES</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm truncate">
              <span className="font-medium">Emilee Simchenko</span> sent you a message
            </p>
            <p className="text-xs text-muted-foreground">7:32 PM</p>
          </div>
          <MessageSquare className="h-4 w-4 text-blue-500 shrink-0" />
        </div>
        <div className="flex items-start gap-2">
          <Avatar className="h-8 w-8 shrink-0">
            <AvatarImage src="/placeholder.svg" />
            <AvatarFallback>DS</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm truncate">
              <span className="font-medium">Darika Samak</span> uploaded 4 files
              <span className="text-muted-foreground"> on Task2 - Mathematics</span>
            </p>
            <p className="text-xs text-muted-foreground">6:02 PM</p>
          </div>
          <FileText className="h-4 w-4 text-orange-500 shrink-0" />
        </div>
      </div>
    </div>
  )
}

