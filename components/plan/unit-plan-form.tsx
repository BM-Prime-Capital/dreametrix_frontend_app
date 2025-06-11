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
import { SUBJECTS, GRADE_LEVELS, type UnitPlan } from "../../lib/types";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation"; // Corrected import

const unitPlanSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters." }),
  subject: z.enum(SUBJECTS as [string, ...string[]], { required_error: "Subject is required." }),
  gradeLevel: z.string({ required_error: "Grade level is required." }),
  standards: z.string().min(10, { message: "Standards must be at least 10 characters." }),
  learningObjectives: z.string().min(10, { message: "Learning objectives must be at least 10 characters." }),
  assessmentsFormative: z.string().optional(),
  assessmentsSummative: z.string().optional(),
  activities: z.string().min(10, { message: "Activities must be at least 10 characters." }),
  materials: z.string().min(10, { message: "Materials must be at least 10 characters." }),
  pacingCalendar: z.string().optional(),
});

type UnitPlanFormValues = z.infer<typeof unitPlanSchema>;

interface UnitPlanFormProps {
  initialData?: UnitPlan;
  onSubmitSuccess?: () => void;
}

export function UnitPlanForm({ initialData, onSubmitSuccess }: UnitPlanFormProps) {
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<UnitPlanFormValues>({
    resolver: zodResolver(unitPlanSchema),
    defaultValues: initialData || {
      title: "",
      subject: undefined,
      gradeLevel: undefined,
      standards: "",
      learningObjectives: "",
      assessmentsFormative: "",
      assessmentsSummative: "",
      activities: "",
      materials: "",
      pacingCalendar: "",
    },
  });

  async function onSubmit(values: UnitPlanFormValues) {
    // Here you would typically send data to a server
    console.log("Unit Plan submitted:", values);
    toast({
      title: initialData ? "Unit Plan Updated!" : "Unit Plan Created!",
      description: `The unit plan "${values.title}" has been successfully ${initialData ? 'updated' : 'saved'}.`,
      variant: "default",
    });
    if (onSubmitSuccess) {
      onSubmitSuccess();
    } else {
      router.push('/unit-plans'); // Navigate to unit plans list after creation
    }
  }

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="font-headline">{initialData ? "Edit Unit Plan" : "Create New Unit Plan"}</CardTitle>
        <CardDescription>Fill in the details for your unit plan.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Unit Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Introduction to Algebra" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
              name="standards"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Learning Standards</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="List relevant state or national standards (e.g., CCSS.MATH.CONTENT.7.G.A.1)"
                      {...field}
                      rows={3}
                    />
                  </FormControl>
                  <FormDescription>Enter each standard on a new line or separate by commas.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="learningObjectives"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Learning Objectives</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., Students will be able to (SWBAT) identify different types of angles."
                      {...field}
                      rows={3}
                    />
                  </FormControl>
                  <FormDescription>Clearly define what students should know or be able to do after this unit.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="activities"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Key Activities &amp; Strategies</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe main instructional activities, projects, and teaching strategies."
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
              name="materials"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Materials &amp; Resources</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="List all necessary materials, textbooks, software, online resources, etc."
                      {...field}
                      rows={3}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <h3 className="text-lg font-medium pt-2 font-headline">Assessments</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                control={form.control}
                name="assessmentsFormative"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Formative Assessments</FormLabel>
                    <FormControl>
                        <Textarea
                        placeholder="e.g., Exit tickets, class discussions, quick checks"
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
                name="assessmentsSummative"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Summative Assessments</FormLabel>
                    <FormControl>
                        <Textarea
                        placeholder="e.g., Unit test, final project, presentation"
                        {...field}
                        rows={3}
                        />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>
            
            <FormField
              control={form.control}
              name="pacingCalendar"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pacing Calendar Overview</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Outline the progression of lessons/topics over the unit's duration. e.g., Week 1: Topic A, Week 2: Topic B &amp; Project Start..."
                      {...field}
                      rows={3}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end pt-4">
              <Button type="submit" className="bg-blue-500 hover:bg-primary/90 text-primary-foreground">
                {initialData ? "Save Changes" : "Create Unit Plan"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
