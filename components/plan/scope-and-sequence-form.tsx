"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
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
import { SUBJECTS, GRADE_LEVELS, type ScopeAndSequence } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

// Schema selon le standard NY
const scopeAndSequenceSchema = z.object({
  academicYear: z.string().regex(/^\d{4}-\d{4}$/, {
    message: "Academic year must be in YYYY-YYYY format (e.g., 2024-2025).",
  }),
  subject: z.enum(SUBJECTS as [string, ...string[]], {
    required_error: "Subject is required.",
  }),
  gradeLevel: z.string({ required_error: "Grade level is required." }),
  entries: z.array(
    z.object({
      month: z.string().min(3, { message: "Month/Term is required." }),
      topic: z.string().min(3, { message: "Topic is required." }),
      standardCode: z.string().min(3, { message: "Standard code is required." }),
      learningObjective: z.string().min(5, {
        message: "Learning objective must be meaningful.",
      }),
      resources: z.string().optional(),
      formativeAssessments: z.string().optional(),
      summativeAssessments: z.string().optional(),
    })
  ),
});

type ScopeAndSequenceFormValues = z.infer<typeof scopeAndSequenceSchema>;

interface ScopeAndSequenceFormProps {
  initialData?: ScopeAndSequence;
  onSubmitSuccess?: () => void;
}

export function ScopeAndSequenceForm({
  initialData,
  onSubmitSuccess,
}: ScopeAndSequenceFormProps) {
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<ScopeAndSequenceFormValues>({
    resolver: zodResolver(scopeAndSequenceSchema),
    defaultValues: initialData || {
      academicYear: "",
      subject: undefined,
      gradeLevel: undefined,
      entries: [
        {
          month: "",
          topic: "",
          standardCode: "",
          learningObjective: "",
          resources: "",
          formativeAssessments: "",
          summativeAssessments: "",
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "entries",
  });

  async function onSubmit(values: ScopeAndSequenceFormValues) {
    console.log("Scope & Sequence submitted:", values);
    toast({
      title: initialData ? "Scope & Sequence Updated!" : "Scope & Sequence Created!",
      description: `Plan for ${values.academicYear} successfully saved.`,
    });
    if (onSubmitSuccess) {
      onSubmitSuccess();
    } else {
      router.push("/scope-and-sequence");
    }
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="font-headline">
          {initialData ? "Edit Scope & Sequence" : "Create New Scope & Sequence"}
        </CardTitle>
        <CardDescription>
          Define the high-level academic year plan aligned with NY Standards
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Academic Year / Subject / Grade */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormField
                control={form.control}
                name="academicYear"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Academic Year</FormLabel>
                    <FormControl>
                      <Input placeholder="2025-2026" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="subject"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subject</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select subject" />
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
                          <SelectValue placeholder="Select grade" />
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

            {/* Entries by Month */}
            {fields.map((field, index) => (
              <div key={field.id} className="border rounded-md p-4 space-y-4">
                <h3 className="font-semibold text-sm">Entry {index + 1}</h3>
                <FormField
                  control={form.control}
                  name={`entries.${index}.month`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Month/Term</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., September" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`entries.${index}.topic`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Topic</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Ratios & Proportional Relationships" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`entries.${index}.standardCode`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Standard Code</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., CCSS.MATH.CONTENT.6.RP.A.1" {...field} />
                      </FormControl>
                      <FormDescription>
                        Use Common Core or NY State Standards reference.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`entries.${index}.learningObjective`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Learning Objective</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="e.g., Understand ratio concepts and use ratio language."
                          rows={2}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`entries.${index}.resources`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Resources</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="e.g., Textbook Ch.1, Khan Academy link"
                          rows={2}
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`entries.${index}.formativeAssessments`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Formative Assessments</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="e.g., Class discussions, homework set 1"
                          rows={2}
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`entries.${index}.summativeAssessments`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Summative Assessments</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="e.g., Unit Test 1, Midterm Exam"
                          rows={2}
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <div className="flex justify-end">
                  <Button type="button" variant="destructive" size="sm" onClick={() => remove(index)}>
                    Remove Entry
                  </Button>
                </div>
              </div>
            ))}

            <Button type="button" onClick={() => append({
              month: "",
              topic: "",
              standardCode: "",
              learningObjective: "",
              resources: "",
              formativeAssessments: "",
              summativeAssessments: "",
            })}>
              ➕ Add Entry
            </Button>

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
