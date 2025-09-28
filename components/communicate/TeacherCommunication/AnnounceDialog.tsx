import { useState } from "react";
import { Megaphone, Paperclip, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AnnounceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedRecipients: string[];
  onRecipientToggle: (id: string) => void;
  newMessage: string;
  onMessageChange: (value: string) => void;
  onCreateAnnouncement: () => void;
  isCreating: boolean;
  classes: Array<{ id: string; name: string }>;
  dataLoading: boolean;
}

export function AnnounceDialog({
  open,
  onOpenChange,
  selectedRecipients,
  onRecipientToggle,
  newMessage,
  onMessageChange,
  onCreateAnnouncement,
  isCreating,
  classes,
  dataLoading,
}: AnnounceDialogProps) {
  const [audience, setAudience] = useState("all_classes");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] border-0 shadow-2xl bg-gradient-to-b from-white to-purple-50/50">
        <DialogHeader className="pb-2 border-b">
          <DialogTitle className="text-xl font-semibold text-purple-700 flex items-center gap-2">
            <Megaphone className="h-5 w-5" />
            Create Announcement
          </DialogTitle>
        </DialogHeader>

        <div className="py-4 space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Announce to:</label>
            <Select value={audience} onValueChange={setAudience}>
              <SelectTrigger>
                <SelectValue placeholder="Select audience" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all_classes">All My Classes</SelectItem>
                <SelectItem value="all_parents">All Parents</SelectItem>
                <SelectItem value="specific">Specific Classes</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Select Classes:</label>
            <div className="mt-2 max-h-40 overflow-y-auto border rounded-md p-2">
              {dataLoading ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto"></div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Loading classes...
                  </p>
                </div>
              ) : classes.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No classes available
                </p>
              ) : (
                classes.map((cls) => (
                  <div
                    key={cls?.id || Math.random()}
                    className="flex items-center space-x-2 py-1"
                  >
                    <Checkbox
                      id={`announce-${cls?.id || Math.random()}`}
                      checked={selectedRecipients.includes(cls?.id || "")}
                      onCheckedChange={() =>
                        cls?.id && onRecipientToggle(cls.id)
                      }
                    />
                    <label
                      htmlFor={`announce-${cls?.id || Math.random()}`}
                      className="text-sm cursor-pointer flex-1"
                    >
                      {cls?.name || "Unknown Class"}
                    </label>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Announcement Title:</label>
            <Input placeholder="Enter a title for your announcement" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Announcement Content:</label>
            <Textarea
              placeholder="Type your announcement here..."
              value={newMessage}
              onChange={(e) => onMessageChange(e.target.value)}
              className="min-h-[100px]"
            />
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Paperclip className="h-4 w-4 mr-1" />
              Attach File
            </Button>
            <Button variant="outline" size="sm">
              <Calendar className="h-4 w-4 mr-1" />
              Schedule
            </Button>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isCreating}
          >
            Cancel
          </Button>
          <Button
            onClick={onCreateAnnouncement}
            disabled={
              isCreating || !newMessage.trim() || selectedRecipients.length === 0
            }
          >
            {isCreating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Posting...
              </>
            ) : (
              "Post Announcement"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}