import { useState } from "react";
import {
  MessageSquare,
  User,
  Users,
  Paperclip,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { RecipientType } from "./types";

interface ComposeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  recipientType: RecipientType;
  onRecipientTypeChange: (type: RecipientType) => void;
  selectedRecipients: string[];
  onRecipientToggle: (id: string) => void;
  newMessage: string;
  onMessageChange: (value: string) => void;
  onCreateConversation: () => void;
  isCreating: boolean;
  students: Array<{ id: string; name: string; class: string }>;
  classes: Array<{ id: string; name: string }>;
  parents: Array<{ id: string; name: string; student: string }>;
  dataLoading: boolean;
  dataError: string | null;
  onRetryData: () => void;
}

export function ComposeDialog({
  open,
  onOpenChange,
  recipientType,
  onRecipientTypeChange,
  selectedRecipients,
  onRecipientToggle,
  newMessage,
  onMessageChange,
  onCreateConversation,
  isCreating,
  students,
  classes,
  parents,
  dataLoading,
  dataError,
  onRetryData,
}: ComposeDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] border-0 shadow-2xl bg-gradient-to-b from-white to-blue-50/50">
        <DialogHeader className="pb-2 border-b">
          <DialogTitle className="text-xl font-semibold text-blue-700 flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            New Message
          </DialogTitle>
        </DialogHeader>

        <div className="py-4 space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Send to:</label>
            <div className="flex gap-2">
              <Button
                variant={recipientType === "student" ? "default" : "outline"}
                size="sm"
                onClick={() => onRecipientTypeChange("student")}
              >
                <User className="h-4 w-4 mr-1" />
                Student
              </Button>
              <Button
                variant={recipientType === "class" ? "default" : "outline"}
                size="sm"
                onClick={() => onRecipientTypeChange("class")}
              >
                <Users className="h-4 w-4 mr-1" />
                Class
              </Button>
              <Button
                variant={recipientType === "parent" ? "default" : "outline"}
                size="sm"
                onClick={() => onRecipientTypeChange("parent")}
              >
                <User className="h-4 w-4 mr-1" />
                Parent
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            {recipientType === "student" && (
              <div>
                <label className="text-sm font-medium">Select Students:</label>
                <div className="mt-2 max-h-40 overflow-y-auto border rounded-md p-2">
                  {dataLoading ? (
                    <div className="text-center py-4">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto"></div>
                      <p className="text-sm text-muted-foreground mt-2">
                        Loading students...
                      </p>
                    </div>
                  ) : dataError ? (
                    <div className="text-center py-4">
                      <p className="text-sm text-red-500 mb-2">
                        Error loading students: {dataError}
                      </p>
                      <Button
                        onClick={onRetryData}
                        size="sm"
                        variant="outline"
                      >
                        Retry
                      </Button>
                    </div>
                  ) : students.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No students available
                    </p>
                  ) : (
                    students
                      .filter((student) => student && student.id && student.name)
                      .map((student) => (
                        <div
                          key={student.id}
                          className="flex items-center space-x-2 py-1"
                        >
                          <Checkbox
                            id={student.id}
                            checked={selectedRecipients.includes(student.id)}
                            onCheckedChange={() => onRecipientToggle(student.id)}
                          />
                          <label
                            htmlFor={student.id}
                            className="text-sm cursor-pointer flex-1"
                          >
                            {student.name}{" "}
                            <span className="text-muted-foreground">
                              ({student.class})
                            </span>
                          </label>
                        </div>
                      ))
                  )}
                </div>
              </div>
            )}

            {recipientType === "class" && (
              <div>
                <label className="text-sm font-medium">Select Classes:</label>
                <div className="mt-2 max-h-40 overflow-y-auto border rounded-md p-2">
                  {dataLoading ? (
                    <div className="text-center py-4">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto"></div>
                      <p className="text-sm text-muted-foreground mt-2">
                        Loading classes...
                      </p>
                    </div>
                  ) : dataError ? (
                    <div className="text-center py-4">
                      <p className="text-sm text-red-500 mb-2">
                        Error loading classes: {dataError}
                      </p>
                      <Button
                        onClick={onRetryData}
                        size="sm"
                        variant="outline"
                      >
                        Retry
                      </Button>
                    </div>
                  ) : classes.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No classes available
                    </p>
                  ) : (
                    classes
                      .filter((cls) => cls && cls.id && cls.name)
                      .map((cls) => (
                        <div
                          key={cls.id}
                          className="flex items-center space-x-2 py-1"
                        >
                          <Checkbox
                            id={cls.id}
                            checked={selectedRecipients.includes(cls.id)}
                            onCheckedChange={() => onRecipientToggle(cls.id)}
                          />
                          <label
                            htmlFor={cls.id}
                            className="text-sm cursor-pointer flex-1"
                          >
                            {cls.name}
                          </label>
                        </div>
                      ))
                  )}
                </div>
              </div>
            )}

            {recipientType === "parent" && (
              <div>
                <label className="text-sm font-medium">Select Parents:</label>
                <div className="mt-2 max-h-40 overflow-y-auto border rounded-md p-2">
                  {dataLoading ? (
                    <div className="text-center py-4">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto"></div>
                      <p className="text-sm text-muted-foreground mt-2">
                        Loading parents...
                      </p>
                    </div>
                  ) : parents.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No parents available
                    </p>
                  ) : (
                    parents.map((parent) => (
                      <div
                        key={parent?.id || Math.random()}
                        className="flex items-center space-x-2 py-1"
                      >
                        <Checkbox
                          id={parent?.id || `parent-${Math.random()}`}
                          checked={selectedRecipients.includes(parent?.id || "")}
                          onCheckedChange={() =>
                            parent?.id && onRecipientToggle(parent.id)
                          }
                        />
                        <label
                          htmlFor={parent?.id || `parent-${Math.random()}`}
                          className="text-sm cursor-pointer flex-1"
                        >
                          {parent?.name || "Unknown Parent"}{" "}
                          <span className="text-muted-foreground">
                            (Parent of {parent?.student || "Unknown Student"})
                          </span>
                        </label>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Message:</label>
            <Textarea
              placeholder="Type your message here..."
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
            onClick={onCreateConversation}
            disabled={isCreating || selectedRecipients.length === 0}
          >
            {isCreating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Creating...
              </>
            ) : (
              "Send Message"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}