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
import { useEffect } from "react"; // ← IMPORT AJOUTÉ

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
  setSelectedRecipients: (ids: string[]) => void;
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
  setSelectedRecipients,
}: ComposeDialogProps) {

  // 🔍 DEBUG AJOUTÉ - Mapping des étudiants
  useEffect(() => {
    if (open && students.length > 0) {
      console.log("🔍 DEBUG ComposeDialog - Students mapping:", {
        students: students?.map(s => ({ 
          id: s.id, 
          name: s.name,
          displayId: `student-${s.id}`,
          class: s.class
        })),
        selectedRecipients,
        mappedStudents: selectedRecipients.map(id => {
          if (id.startsWith('student-')) {
            const studentId = id.replace('student-', '');
            const student = students?.find(s => s.id === studentId);
            return student ? { id: studentId, name: student.name } : { id: studentId, name: 'NOT FOUND' };
          }
          return null;
        }).filter(Boolean)
      });

      // Chercher spécifiquement Angella Mbumba
      const angella = students.find(s => 
        s.name.toLowerCase().includes('angella') || 
        s.name.toLowerCase().includes('mbumba')
      );
      console.log("🎯 Angella Mbumba search result:", angella);
    }
  }, [open, students, selectedRecipients]);

  // 🔍 DEBUG AJOUTÉ - Données brutes
  useEffect(() => {
    if (open) {
      console.log("📊 DEBUG ComposeDialog - Raw data:", {
        studentsCount: students?.length,
        classesCount: classes?.length,
        parentsCount: parents?.length,
        dataLoading,
        dataError,
        recipientType,
        selectedRecipientsCount: selectedRecipients.length
      });
    }
  }, [open, students, classes, parents, dataLoading, dataError, recipientType, selectedRecipients]);

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
          {/* Choix du type */}
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

          {/* Sélection des destinataires */}
          <div className="space-y-2">
            {/* Students */}
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
                    students.map((student) => (
                      <div key={student.id} className="flex items-center space-x-2 py-1">
                        <Checkbox
                          id={`student-${student.id}`}
                          checked={selectedRecipients.includes(`student-${student.id}`)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedRecipients([...selectedRecipients, `student-${student.id}`]);
                            } else {
                              setSelectedRecipients(
                                selectedRecipients.filter((id) => id !== `student-${student.id}`)
                              );
                            }
                          }}
                        />
                        <label
                          htmlFor={`student-${student.id}`}
                          className="text-sm cursor-pointer flex-1"
                        >
                          {student.name}{" "}
                          <span className="text-muted-foreground">({student.class})</span>
                        </label>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Classes */}
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
                    classes.map((cls) => (
                      <div key={cls.id} className="flex items-center space-x-2 py-1">
                        <Checkbox
                          id={`class-${cls.id}`}
                          checked={selectedRecipients.includes(`class-${cls.id}`)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              // Ajouter la classe
                              const classId = `class-${cls.id}`;
                              // Ajouter les étudiants de cette classe
                              const classStudents = students
                                .filter((s) => s.class === cls.name)
                                .map((s) => `student-${s.id}`);

                              setSelectedRecipients([
                                ...new Set([...selectedRecipients, classId, ...classStudents]),
                              ]);
                            } else {
                              // Retirer la classe + ses étudiants
                              const classId = `class-${cls.id}`;
                              const classStudents = students
                                .filter((s) => s.class === cls.name)
                                .map((s) => `student-${s.id}`);

                              setSelectedRecipients(
                                selectedRecipients.filter(
                                  (id) => id !== classId && !classStudents.includes(id)
                                )
                              );
                            }
                          }}
                        />
                        <label
                          htmlFor={`class-${cls.id}`}
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
                  {parents.map((parent) => (
                    <div key={parent.id} className="flex items-center space-x-2 py-1">
                      <Checkbox
                        id={parent.id}
                        checked={selectedRecipients.includes(parent.id)}
                        onCheckedChange={() => onRecipientToggle(parent.id)}
                      />
                      <label htmlFor={parent.id} className="text-sm cursor-pointer flex-1">
                        {parent.name}{" "}
                        {/* <span className="text-muted-foreground">(Parent of {parent.student})</span> */}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Zone Message */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Message:</label>
            <Textarea
              placeholder="Type your message here..."
              value={newMessage}
              onChange={(e) => onMessageChange(e.target.value)}
              className="min-h-[100px]"
            />
          </div>

          {/* Attach + Schedule */}
          {/* <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Paperclip className="h-4 w-4 mr-1" />
              Attach File
            </Button>
            <Button variant="outline" size="sm">
              <Calendar className="h-4 w-4 mr-1" />
              Schedule
            </Button>
          </div> */}
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
            {isCreating ? "Creating..." : "Send Message"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}