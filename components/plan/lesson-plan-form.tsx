"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { SUBJECTS, GRADE_LEVELS, type LessonPlan, type UnitPlan, type Subject, type GradeLevel } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { CalendarIcon, Lightbulb, Clock, BookOpen } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ActivitySuggesterDialog } from "./activity-suggester-dialog";
import { useState } from "react";
import { lessonPlanSchema, type LessonPlanFormValues } from "@/lib/validations";

interface LessonPlanFormProps {
  initialData?: LessonPlan | null;
  unitPlans?: UnitPlan[];
  onSubmitSuccess?: (lessonPlan: LessonPlan) => void;
  onCancel?: () => void;
}

export function LessonPlanForm({ initialData, unitPlans = [], onSubmitSuccess, onCancel }: LessonPlanFormProps) {
  const { toast } = useToast();
  const [isActivitySuggesterOpen, setIsActivitySuggesterOpen] = useState(false);

  // Fonction pour obtenir les valeurs par défaut avec des valeurs valides
  const getDefaultValues = (): LessonPlanFormValues => {
    if (initialData) {
      return {
        id: initialData.id || "",
        title: initialData.title,
        date: initialData.date,
        subject: initialData.subject,
        gradeLevel: initialData.gradeLevel as GradeLevel, 
        unitPlanId: initialData.unitPlanId || "",
        durationMinutes: initialData.durationMinutes,
        objectives: initialData.objectives,
        standards: initialData.standards,
        procedures: initialData.procedures,
        materials: initialData.materials,
        differentiation: initialData.differentiation || "",
        assessmentFormative: initialData.assessmentFormative,
        homework: initialData.homework || "",
        notes: initialData.notes || "",
      };
    }

    // Valeurs par défaut avec des valeurs valides pour les enums
    return {
      id: "",
      title: "",
      date: format(new Date(), "yyyy-MM-dd"),
      subject: "Math" as Subject, 
      gradeLevel: "7th Grade" as GradeLevel, 
      unitPlanId: "",
      durationMinutes: 45,
      objectives: "",
      standards: "",
      procedures: "",
      materials: "",
      differentiation: "",
      assessmentFormative: "",
      homework: "",
      notes: "",
    };
  };

  const form = useForm<LessonPlanFormValues>({
    resolver: zodResolver(lessonPlanSchema),
    defaultValues: getDefaultValues(),
  });

  async function onSubmit(values: LessonPlanFormValues) {
    try {
      console.log("Lesson Plan submitted:", values);
      
      // Convertir les données du formulaire en LessonPlan
      const lessonPlanData: LessonPlan = {
        id: initialData?.id || `lesson-${Date.now()}`,
        title: values.title,
        date: values.date,
        subject: values.subject,
        gradeLevel: values.gradeLevel,
        unitPlanId: values.unitPlanId || undefined,
        durationMinutes: values.durationMinutes,
        objectives: values.objectives,
        standards: values.standards,
        procedures: values.procedures,
        materials: values.materials,
        differentiation: values.differentiation || undefined,
        assessmentFormative: values.assessmentFormative,
        homework: values.homework || undefined,
        notes: values.notes || undefined,
        createdAt: initialData?.createdAt || new Date(),
        updatedAt: new Date(),
      };

      toast({
        title: initialData ? "Lesson Plan Updated!" : "Lesson Plan Created!",
        description: `The lesson plan "${values.title}" has been successfully ${initialData ? 'updated' : 'saved'}.`,
      });

      if (onSubmitSuccess) {
        onSubmitSuccess(lessonPlanData);
      }
    } catch (error) {
      console.error("Error submitting lesson plan:", error);
      toast({
        title: "Error",
        description: "There was an error saving the lesson plan.",
        variant: "destructive",
      });
    }
  }

  const handleSuggestedActivities = (suggestions: string[]) => {
    const currentProcedures = form.getValues("procedures");
    const newProcedures = currentProcedures 
      ? `${currentProcedures}\n\nSuggested Activities:\n${suggestions.map(s => `- ${s}`).join("\n")}`
      : `Suggested Activities:\n${suggestions.map(s => `- ${s}`).join("\n")}`;
    form.setValue("procedures", newProcedures);
  };

  return (
    <>
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader className="bg-green-50 border-b">
          <CardTitle className="font-headline flex items-center gap-2">
            <BookOpen className="h-6 w-6" />
            {initialData ? "Edit Lesson Plan" : "Create New Lesson Plan"}
          </CardTitle>
          <CardDescription>
            Detail the specifics for a single day's instruction with clear objectives and procedures.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Section 1: Informations de base */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Lesson Title *</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Understanding Complementary Angles" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Date *</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(new Date(field.value), "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value ? new Date(field.value) : undefined}
                            onSelect={(date) => field.onChange(date ? format(date, "yyyy-MM-dd") : "")}
                            disabled={(date) => date < new Date("1900-01-01")}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField
                  control={form.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subject *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a subject" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {SUBJECTS.map((subject) => (
                            <SelectItem key={subject} value={subject}>
                              {subject}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="gradeLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Grade Level *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a grade level" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {GRADE_LEVELS.map((grade) => (
                            <SelectItem key={grade} value={grade}>
                              {grade}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="durationMinutes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Duration (minutes) *</FormLabel>
                      <FormControl>
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            value={field.value}
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 45)}
                            min="5"
                            max="480"
                            className="flex-1"
                          />
                          <Clock className="h-4 w-4 text-muted-foreground" />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {unitPlans.length > 0 && (
                <FormField
                  control={form.control}
                  name="unitPlanId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Link to Unit Plan (Optional)</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a unit plan" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="none">None</SelectItem>
                          {unitPlans.map((unit) => (
                            <SelectItem key={unit.id} value={unit.id}>
                              {unit.title} - {unit.gradeLevel}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {/* Section 2: Objectifs et Standards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="objectives"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Lesson Objectives ("I Can" Statements) *</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="e.g., I can solve equations using complementary angles. I can identify angle relationships in geometric figures."
                          {...field}
                          rows={4}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="standards"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Standards Alignment *</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="e.g., NY-NGLS.MATH.CONTENT.7.G.B.5 - Use facts about supplementary, complementary, vertical, and adjacent angles..."
                          {...field}
                          rows={4}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Section 3: Procédures et Activités */}
              <FormField
                control={form.control}
                name="procedures"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex justify-between items-center mb-2">
                      <FormLabel>Procedures & Activities *</FormLabel>
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setIsActivitySuggesterOpen(true)}
                      >
                        <Lightbulb className="mr-2 h-4 w-4" /> 
                        Suggest Activities
                      </Button>
                    </div>
                    <FormControl>
                      <Textarea
                        placeholder="Detail step-by-step lesson flow:
                        • Opening (5 min): Warm-up activity
                        • Direct Instruction (15 min): Model problem-solving
                        • Guided Practice (10 min): Work through examples together
                        • Independent Practice (10 min): Students work individually
                        • Closing (5 min): Exit ticket and review"
                        {...field}
                        rows={8}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Section 4: Matériaux et Évaluations */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="materials"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Materials & Resources *</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="• Worksheets on angle relationships
                          • Protractors and rulers
                          • Whiteboard and markers
                          • Digital geometry tools"
                          {...field}
                          rows={4}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="assessmentFormative"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Formative Assessment *</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="• Exit ticket with 3 angle problems
                          • Observation during guided practice
                          • Thumbs up/down check for understanding"
                          {...field}
                          rows={4}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Section 5: Différenciation et Notes */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="differentiation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Differentiation Strategies</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="• Scaffolded worksheets for struggling learners
                          • Challenge problems for advanced students
                          • Visual aids for ELL students
                          • Manipulatives for kinesthetic learners"
                          {...field}
                          rows={4}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="homework"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Homework/Extension</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="• Practice problems from textbook
                            • Real-world angle finding activity
                            • Online geometry game"
                            {...field}
                            rows={2}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Teacher Notes</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="• Remember to check for protractor skills
                            • Group struggling students together
                            • Have extension activity ready"
                            {...field}
                            rows={2}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Boutons de soumission */}
              <div className="flex justify-end gap-4 pt-6 border-t">
                {onCancel && (
                  <Button variant="outline" type="button" onClick={onCancel}>
                    Cancel
                  </Button>
                )}
                <Button 
                  type="submit" 
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  {initialData ? "Update Lesson Plan" : "Create Lesson Plan"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      <ActivitySuggesterDialog
        isOpen={isActivitySuggesterOpen}
        onClose={() => setIsActivitySuggesterOpen(false)}
        subject={form.watch("subject")}
        gradeLevel={form.watch("gradeLevel")}
        lessonObjective={form.watch("objectives")}
        onSuggest={handleSuggestedActivities}
      />
    </>
  );
}