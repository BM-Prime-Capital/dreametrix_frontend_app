
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
import { SUBJECTS, GRADE_LEVELS, type ScopeAndSequence,  } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

const scopeAndSequenceSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters." }),
  academicYear: z.string().regex(/^\d{4}-\d{4}$/, { message: "Academic year must be in YYYY-YYYY format (e.g., 2024-2025)."}),
  subject: z.enum(SUBJECTS as [string, ...string[]], { required_error: "Subject is required." }),
  gradeLevel: z.string({ required_error: "Grade level is required." }),
  overview: z.string().min(10, { message: "Overview must be at least 10 characters." }),
  standardsAndUnitsByMonth: z.string().min(20, { message: "Standards and Units by Month description must be at least 20 characters." }),
});

type ScopeAndSequenceFormValues = z.infer<typeof scopeAndSequenceSchema>;

interface ScopeAndSequenceFormProps {
  initialData?: ScopeAndSequence;
  onSubmitSuccess?: () => void;
}

export function ScopeAndSequenceForm({ initialData, onSubmitSuccess }: ScopeAndSequenceFormProps) {
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<ScopeAndSequenceFormValues>({
    resolver: zodResolver(scopeAndSequenceSchema),
    defaultValues: initialData || {
      title: "",
      academicYear: "",
      subject: undefined,
      gradeLevel: undefined,
      overview: "",
      standardsAndUnitsByMonth: "",
    },
  });

  async function onSubmit(values: ScopeAndSequenceFormValues) {
    console.log("Scope & Sequence submitted:", values);
    // In a real app, you would save this data to a backend.
    toast({
      title: initialData ? "Scope & Sequence Updated!" : "Scope & Sequence Created!",
      description: `The plan "${values.title}" has been successfully ${initialData ? 'updated' : 'saved'}.`,
    });
    if (onSubmitSuccess) {
      onSubmitSuccess();
    } else {
       router.push('/scope-and-sequence');
    }
  }

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="font-headline">{initialData ? "Edit Scope & Sequence" : "Create New Scope & Sequence"}</CardTitle>
        <CardDescription>Define the high-level academic year plan, including standards, units, and monthly breakdown.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Plan Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., 7th Grade Math Full Year Plan" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="academicYear"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Academic Year</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 2024-2025" {...field} />
                    </FormControl>
                    <FormDescription>Enter in YYYY-YYYY format.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
              name="overview"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Overview</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Provide a general description of the academic year's curriculum, goals, and trajectory."
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
              name="standardsAndUnitsByMonth"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Standards and Units by Month</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Detail the chronological listing of learning standards and units for each month. e.g., August: Unit 1 - Topic (Standard A, Standard B), September: Unit 2 - Topic (Standard C)"
                      {...field}
                      rows={8}
                    />
                  </FormControl>
                  <FormDescription>Provide a clear month-by-month breakdown of what will be taught.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end pt-4">
              <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                {initialData ? "Save Changes" : "Create Scope & Sequence"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
