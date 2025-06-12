"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
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
import { SUBJECTS, GRADE_LEVELS, type LessonPlan, type Subject } from "../../lib/types";
import { useToast } from "@/hooks/use-toast";
import { CalendarIcon, Lightbulb } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "../../lib/utils";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { ActivitySuggesterDialog } from "./activity-suggester-dialog";
import { useState } from "react";

const lessonPlanSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters." }),
  date: z.date({ required_error: "A date for the lesson is required." }),
  subject: z.enum(SUBJECTS as [string, ...string[]], { required_error: "Subject is required." }),
  gradeLevel: z.string({ required_error: "Grade level is required." }),
  objectives: z.string().min(10, { message: "Objectives must be at least 10 characters." }),
  procedures: z.string().min(10, { message: "Procedures must be at least 10 characters." }),
  materials: z.string().min(5, { message: "Materials must be at least 5 characters." }),
  differentiation: z.string().optional(),
  assessmentFormative: z.string().min(5, { message: "Formative assessment description must be at least 5 characters." }),
  unitPlanId: z.string().optional(), 
});

type LessonPlanFormValues = z.infer<typeof lessonPlanSchema>;

interface LessonPlanFormProps {
  initialData?: LessonPlan;
  unitPlans?: { id: string, title: string }[]; // For linking to a unit plan
  onSubmitSuccess?: () => void;
}

export function LessonPlanForm({ initialData, unitPlans = [], onSubmitSuccess }: LessonPlanFormProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [isActivitySuggesterOpen, setIsActivitySuggesterOpen] = useState(false);

  const form = useForm<LessonPlanFormValues>({
    resolver: zodResolver(lessonPlanSchema),
    defaultValues: initialData
      ? { ...initialData, date: new Date(initialData.date) }
      : {
        title: "",
        date: new Date(),
        subject: undefined,
        gradeLevel: undefined,
        objectives: "",
        procedures: "",
        materials: "",
        differentiation: "",
        assessmentFormative: "",
        unitPlanId: undefined,
      },
  });

  async function onSubmit(values: LessonPlanFormValues) {
    console.log("Lesson Plan submitted:", values);
    toast({
      title: initialData ? "Lesson Plan Updated!" : "Lesson Plan Created!",
      description: `The lesson plan "${values.title}" has been successfully ${initialData ? 'updated' : 'saved'}.`,
    });
    if (onSubmitSuccess) {
      onSubmitSuccess();
    } else {
       router.push('/lesson-plans');
    }
  }

  const handleSuggestedActivities = (suggestions: string[]) => {
    const currentProcedures = form.getValues("procedures");
    const newProcedures = `${currentProcedures}\n\nSuggested Activities:\n${suggestions.map(s => `- ${s}`).join("\n")}`;
    form.setValue("procedures", newProcedures);
  };

  return (
    <>
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="font-headline">{initialData ? "Edit Lesson Plan" : "Create New Lesson Plan"}</CardTitle>
        <CardDescription>Detail the specifics for a single day&#39;s instruction.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lesson Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Understanding Complementary Angles" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date</FormLabel>
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
                              format(field.value, "PPP")
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
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
               {unitPlans.length > 0 && (
                  <FormField
                    control={form.control}
                    name="unitPlanId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Link to Unit Plan (Optional)</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a unit plan" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {unitPlans.map((unit) => (
                              <SelectItem key={unit.id} value={unit.id}>
                                {unit.title}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="subject"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subject</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                    <FormLabel>Grade Level</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
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
            </div>


            <FormField
              control={form.control}
              name="objectives"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lesson Objectives ("I Can" Statements)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., I can solve equations using complementary angles."
                      {...field}
                      rows={3}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="procedures"
              render={({ field }) => (
                <FormItem>
                  <div className="flex justify-between items-center">
                    <FormLabel>Procedures &amp; Activities</FormLabel>
                    <Button type="button" variant="outline" size="sm" onClick={() => setIsActivitySuggesterOpen(true)}>
                      <Lightbulb className="mr-2 h-4 w-4" /> Suggest Activities
                    </Button>
                  </div>
                  <FormControl>
                    <Textarea
                      placeholder="Detail step-by-step lesson flow: opening, instruction, guided practice, independent practice, closing."
                      {...field}
                      rows={6}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="materials"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Materials &amp; Resources</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="List all materials: worksheets, manipulatives, technology, etc."
                      {...field}
                      rows={3}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="differentiation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Differentiation (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Strategies for supporting diverse learners (e.g., ELL, SPED, gifted)."
                      {...field}
                      rows={3}
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
                  <FormLabel>Formative Assessment</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="How will you check for understanding during/after the lesson? (e.g., Exit ticket: 3 problems on angle relationships)."
                      {...field}
                      rows={3}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end pt-4">
              <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                {initialData ? "Save Changes" : "Create Lesson Plan"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
    <ActivitySuggesterDialog
        isOpen={isActivitySuggesterOpen}
        onClose={() => setIsActivitySuggesterOpen(false)}
        subject={form.getValues("subject") as Subject | undefined}
        gradeLevel={form.getValues("gradeLevel")}
        lessonObjective={form.getValues("objectives")}
        onSuggest={handleSuggestedActivities}
      />
    </>
  );
}
