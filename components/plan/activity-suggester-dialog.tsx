"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { suggestActivities, type SuggestActivitiesInput } from "@/ai/flows/activity-suggestion-tool";
// Update the import path below if your types are located elsewhere, e.g. "@/types" or "../lib/types"
import { SUBJECTS, GRADE_LEVELS, type Subject } from "../../lib/types";
import { Loader2, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ActivitySuggesterDialogProps {
  isOpen: boolean;
  onClose: () => void;
  subject?: Subject;
  gradeLevel?: string;
  lessonObjective?: string;
  onSuggest: (suggestions: string[]) => void;
}

export function ActivitySuggesterDialog({
  isOpen,
  onClose,
  subject: initialSubject,
  gradeLevel: initialGradeLevel,
  lessonObjective: initialLessonObjective,
  onSuggest,
}: ActivitySuggesterDialogProps) {
  const [subject, setSubject] = useState<Subject | undefined>(initialSubject);
  const [gradeLevel, setGradeLevel] = useState<string | undefined>(initialGradeLevel);
  const [lessonObjective, setLessonObjective] = useState<string>(initialLessonObjective || "");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setSubject(initialSubject);
    setGradeLevel(initialGradeLevel);
    setLessonObjective(initialLessonObjective || "");
    setSuggestions([]); // Clear previous suggestions when dialog reopens or props change
  }, [isOpen, initialSubject, initialGradeLevel, initialLessonObjective]);

  const handleSubmit = async () => {
    if (!subject || !gradeLevel || !lessonObjective) {
      toast({
        title: "Missing Information",
        description: "Please provide subject, grade level, and lesson objective.",
        variant: "destructive",
      });
      return;
    }
    setIsLoading(true);
    setSuggestions([]);
    try {
      const input: SuggestActivitiesInput = {
        lessonObjective,
        subject,
        // The AI flow expects gradeLevel as number. We need to parse it.
        // For simplicity, let's assume gradeLevel string contains a number (e.g., "7th Grade" -> 7)
        // This is a naive parsing and should be robust in a real app.
        gradeLevel: parseInt(gradeLevel.match(/\d+/)?.toString() || "0") || 7, // Default to 7 if parsing fails
      };
      const result = await suggestActivities(input);
      setSuggestions(result.suggestedActivities);
      if (result.suggestedActivities.length === 0) {
        toast({
            title: "No Suggestions Found",
            description: "The AI couldn't find specific suggestions. Try rephrasing your objective.",
        });
      }
    } catch (error) {
      console.error("Error suggesting activities:", error);
      toast({
        title: "Error",
        description: "Failed to get activity suggestions. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddSuggestions = () => {
    if (suggestions.length > 0) {
      onSuggest(suggestions);
      toast({
        title: "Activities Added",
        description: "Suggested activities have been added to your lesson plan.",
      });
      onClose();
    }
  };


  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-headline"><Sparkles className="h-5 w-5 text-primary" />AI Activity Suggester</DialogTitle>
          <DialogDescription>
            Get AI-powered suggestions for engaging activities based on your lesson details.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="suggester-subject">Subject</Label>
              <Select value={subject} onValueChange={(value) => setSubject(value as Subject)}>
                <SelectTrigger id="suggester-subject">
                  <SelectValue placeholder="Select subject" />
                </SelectTrigger>
                <SelectContent>
                  {SUBJECTS.map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="suggester-grade">Grade Level</Label>
              <Select value={gradeLevel} onValueChange={setGradeLevel}>
                <SelectTrigger id="suggester-grade">
                  <SelectValue placeholder="Select grade" />
                </SelectTrigger>
                <SelectContent>
                  {GRADE_LEVELS.map((g) => (
                    <SelectItem key={g} value={g}>{g}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label htmlFor="suggester-objective">Lesson Objective</Label>
            <Textarea
              id="suggester-objective"
              placeholder="e.g., Students will be able to identify three types of rocks."
              value={lessonObjective}
              onChange={(e) => setLessonObjective(e.target.value)}
              rows={3}
            />
          </div>
          <Button onClick={handleSubmit} disabled={isLoading} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="mr-2 h-4 w-4" />
            )}
            Get Suggestions
          </Button>

          {suggestions.length > 0 && (
            <div className="space-y-2 pt-4">
              <h4 className="font-medium">Suggested Activities:</h4>
              <ScrollArea className="h-40 rounded-md border p-3">
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  {suggestions.map((activity, index) => (
                    <li key={index}>{activity}</li>
                  ))}
                </ul>
              </ScrollArea>
            </div>
          )}
        </div>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          {suggestions.length > 0 && (
            <Button onClick={handleAddSuggestions} className="bg-accent hover:bg-accent/90 text-accent-foreground">Add to Lesson Plan</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
