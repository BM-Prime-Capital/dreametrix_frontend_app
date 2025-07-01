"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { createPoll } from "./api";
import { Textarea } from "@/components/ui/textarea";
import { useRequestInfo } from "@/hooks/useRequestInfo";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { PlusCircle, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export function AddPollsDialog() {
  const [open, setOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [pollTitle, setPollTitle] = useState("");
  const [description, setDescription] = useState("");
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());
  const [questions, setQuestions] = useState<any[]>([]);
  const [newQuestionText, setNewQuestionText] = useState("");
  const [newQuestionType, setNewQuestionType] = useState("single");
  const [newOptionText, setNewOptionText] = useState("");
  const [editingQuestionIndex, setEditingQuestionIndex] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const { tenantDomain, accessToken } = useRequestInfo();
  const [courses, setCourses] = useState<{ id: number; name: string }[]>([]);
  const [courseId, setCourseId] = useState<number | null>(null);


useEffect(() => {
  const savedCourses = localStorage.getItem("classes");
  if (savedCourses) {
    try {
      const parsed = JSON.parse(savedCourses);
      setCourses(parsed);
    } catch (error) {
      console.error("Invalid courses in localStorage");
    }
  }
}, []);



  useEffect(() => {
    if (!open) {
      // Reset form when dialog closes
      setCurrentStep(1);
      setPollTitle("");
      setDescription("");
      setCourseId(null);
      setEndDate(new Date());
      setQuestions([]);
      setNewQuestionText("");
      setNewQuestionType("single");
      setEditingQuestionIndex(null);
    }
  }, [open]);

  type Choice = {
    label: string;
  };

  type QuestionPayload = {
    text: string;
    question_type: "single" | "multiple" | "text";
    required: boolean;
    choices?: Choice[];
  };

  const addOption = (questionIndex: number) => {
    if (!newOptionText.trim()) return;
    
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].choices.push({
      label: newOptionText.trim()
    });
    setQuestions(updatedQuestions);
    setNewOptionText("");
  };

  const removeOption = (questionIndex: number, optionIndex: number) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].choices.splice(optionIndex, 1);
    setQuestions(updatedQuestions);
  };

  const addQuestion = () => {
    if (!newQuestionText.trim()) {
      toast.warning("Question text cannot be empty");
      return;
    }

    const newQuestion = {
      text: newQuestionText.trim(),
      question_type: newQuestionType,
      required: true,
      choices: newQuestionType !== "text" ? [{ label: "Option 1" }, { label: "Option 2" }] : [],
    };

    if (editingQuestionIndex !== null) {
      // Update existing question
      const updatedQuestions = [...questions];
      updatedQuestions[editingQuestionIndex] = newQuestion;
      setQuestions(updatedQuestions);
      setEditingQuestionIndex(null);
    } else {
      // Add new question
      setQuestions([...questions, newQuestion]);
    }

    setNewQuestionText("");
    setNewQuestionType("single");
  };

  const editQuestion = (index: number) => {
    const question = questions[index];
    setNewQuestionText(question.text);
    setNewQuestionType(question.question_type);
    setEditingQuestionIndex(index);
  };

  const removeQuestion = (index: number) => {
    const updatedQuestions = [...questions];
    updatedQuestions.splice(index, 1);
    setQuestions(updatedQuestions);
    if (editingQuestionIndex === index) {
      setEditingQuestionIndex(null);
      setNewQuestionText("");
      setNewQuestionType("single");
    }
  };

  const handleSubmit = async () => {
    if (!tenantDomain || !accessToken) {
      toast.error("Authentication error. Please try again.");
      return;
    }

    if (!pollTitle.trim()) {
      toast.warning("Poll title is required");
      return;
    }

    if (courseId === null) {
      toast.warning("Course ID is required");
      return;
    }

    if (!endDate) {
      toast.warning("End date is required");
      return;
    }

    if (questions.length === 0) {
      toast.warning("Please add at least one question");
      return;
    }

    setSubmitting(true);
    try {
    await createPoll(
      {
        title: pollTitle.trim(),
        description: description.trim(),
        course: Number(courseId),
        deadline: endDate.toISOString(),
        is_anonymous: true,
        questions: questions.map(q => ({
          ...q,
          text: q.text.trim(),
          choices: q.choices?.map((c: Choice) => ({ label: c.label.trim() }))
        })),

      },
      tenantDomain,
      accessToken
    );
      
      toast.success("Poll created successfully!");
      setOpen(false);
    } catch (error) {
      toast.error("Failed to create poll. Please try again.");
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  const validateStep1 = () => {
    if (!pollTitle.trim()) {
      toast.warning("Poll title is required");
      return false;
    }
    if (courseId === null) {
      toast.warning("Course ID is required");
      return false;
    }

    if (!endDate) {
      toast.warning("End date is required");
      return false;
    }
    return true;
  };

  const nextStep = () => {
    if (currentStep === 1 && !validateStep1()) return;
    setCurrentStep((prev) => prev + 1);
  };

  const prevStep = () => {
    setCurrentStep((prev) => prev - 1);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white px-6 py-5 rounded-xl shadow-lg transition-all hover:shadow-xl">
          <PlusCircle className="mr-2 h-4 w-4" />
          Create New Poll
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[750px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Create New Poll
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-6">
          {/* Stepper */}
          <div className="flex justify-between items-center relative">
            <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-gray-200 -z-10"></div>
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex flex-col items-center z-10">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${currentStep >= step ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"}`}
                >
                  {step}
                </div>
                <span className={`text-xs mt-1 ${currentStep >= step ? "font-bold text-blue-600" : "text-gray-500"}`}>
                  {step === 1 ? "Details" : step === 2 ? "Questions" : "Review"}
                </span>
              </div>
            ))}
          </div>

          {/* Step 1: Poll Details */}
          {currentStep === 1 && (
            <div className="grid gap-6 py-2">
              <div className="grid gap-2">
                <Label htmlFor="title">Poll Title *</Label>
                <Input
                  id="title"
                  placeholder="Enter poll title"
                  value={pollTitle}
                  onChange={(e) => setPollTitle(e.target.value)}
                  className="py-3"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Enter poll description (optional)"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="courseId">Select Course *</Label>
                <Select
                  onValueChange={(value) => setCourseId(Number(value))}
                  value={courseId !== null ? courseId.toString() : undefined}
                >

                  <SelectTrigger className="w-full py-3">
                    <SelectValue placeholder="Select a course" />
                  </SelectTrigger>
                  <SelectContent>
                    {courses.map((course) => (
                      <SelectItem key={course.id} value={course.id.toString()}>
                        {course.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>


              <div className="grid gap-2">
                <Label>End Date *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !endDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {endDate ? format(endDate, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={setEndDate}
                      initialFocus
                      fromDate={new Date()}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          )}

          {/* Step 2: Questions */}
          {currentStep === 2 && (
            <div className="flex flex-col gap-6 py-2">
              <div className="border rounded-lg p-4 bg-gray-50">
                <h3 className="font-medium mb-3">
                  {editingQuestionIndex !== null ? "Edit Question" : "Add New Question"}
                </h3>
                
                <div className="grid gap-3">
                  <Input
                    placeholder="Enter question text"
                    value={newQuestionText}
                    onChange={(e) => setNewQuestionText(e.target.value)}
                    className="py-3"
                  />

                  <div className="grid gap-2">
                    <Label>Question Type</Label>
                    <Select
                      value={newQuestionType}
                      onValueChange={setNewQuestionType}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="single">Single Choice</SelectItem>
                        <SelectItem value="multiple">Multiple Choice</SelectItem>
                        <SelectItem value="text">Text Response</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {newQuestionType !== "text" && (
                    <div className="grid gap-2">
                      <Label>Options</Label>
                      <div className="flex gap-2">
                        <Input
                          placeholder="Add new option"
                          value={newOptionText}
                          onChange={(e) => setNewOptionText(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && editingQuestionIndex !== null) {
                              addOption(editingQuestionIndex);
                            }
                          }}
                          className="py-3 flex-1"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            if (editingQuestionIndex !== null) {
                              addOption(editingQuestionIndex);
                            }
                          }}
                          disabled={!newOptionText.trim()}
                        >
                          Add
                        </Button>
                      </div>
                    </div>
                  )}

                  <Button
                    onClick={addQuestion}
                    className="w-fit bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    {editingQuestionIndex !== null ? "Update Question" : "Add Question"}
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-medium">Questions ({questions.length})</h3>
                
                {questions.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No questions added yet
                  </div>
                ) : (
                  <div className="space-y-3">
                    {questions.map((question, qIndex) => (
                      <div key={qIndex} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-medium flex items-center gap-2">
                              {question.text}
                              <Badge variant="outline" className="text-xs">
                                {question.question_type === "single" && "Single Choice"}
                                {question.question_type === "multiple" && "Multiple Choice"}
                                {question.question_type === "text" && "Text Response"}
                              </Badge>
                            </div>
                            {question.question_type !== "text" && (
                              <div className="mt-2 space-y-1">
                                {question.choices.map((choice: any, cIndex: number) => (
                                  <div key={cIndex} className="flex items-center gap-2">
                                    {question.question_type === "single" ? (
                                      <RadioGroupItem value={choice.label} disabled />
                                    ) : (
                                      <Checkbox checked={false} disabled />
                                    )}
                                    <Label>{choice.label}</Label>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-6 w-6 text-red-500"
                                      onClick={() => removeOption(qIndex, cIndex)}
                                    >
                                      <Trash2 className="h-3 w-3" />
                                    </Button>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => editQuestion(qIndex)}
                            >
                              Edit
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-500"
                              onClick={() => removeQuestion(qIndex)}
                            >
                              Remove
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 3: Review */}
          {currentStep === 3 && (
            <div className="flex flex-col gap-6 py-2">
              <div className="space-y-4">
                <h3 className="text-lg font-bold">Poll Summary</h3>
                
                <div className="grid gap-4">
                  <div className="border-b pb-2">
                    <h4 className="font-medium text-gray-500">Details</h4>
                    <div className="mt-2 space-y-1">
                      <p><span className="font-medium">Title:</span> {pollTitle}</p>
                      {description && <p><span className="font-medium">Description:</span> {description}</p>}
                      <p><span className="font-medium">Course ID:</span> {courseId}</p>
                      <p><span className="font-medium">End Date:</span> {endDate && format(endDate, "PPPp")}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-500">Questions ({questions.length})</h4>
                    <div className="mt-2 space-y-4">
                      {questions.map((question, qIndex) => (
                        <div key={qIndex} className="border rounded-lg p-4">
                          <div className="font-medium">
                            {qIndex + 1}. {question.text}
                            <Badge variant="outline" className="ml-2 text-xs">
                              {question.question_type === "single" && "Single Choice"}
                              {question.question_type === "multiple" && "Multiple Choice"}
                              {question.question_type === "text" && "Text Response"}
                            </Badge>
                          </div>
                          {question.question_type !== "text" && (
                            <div className="mt-2 space-y-1">
                              {question.choices.map((choice: any, cIndex: number) => (
                                <div key={cIndex} className="flex items-center gap-2">
                                  {question.question_type === "single" ? (
                                    <RadioGroupItem value={choice.label} disabled />
                                  ) : (
                                    <Checkbox checked={false} disabled />
                                  )}
                                  <Label>{choice.label}</Label>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <Button
                disabled={submitting}
                onClick={handleSubmit}
                className="bg-blue-600 hover:bg-blue-700 text-white py-5"
              >
                {submitting ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating Poll...
                  </span>
                ) : (
                  "Create Poll"
                )}
              </Button>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-4 pt-4 border-t">
            {currentStep > 1 ? (
              <Button variant="outline" onClick={prevStep} className="gap-1">
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
            ) : (
              <div></div>
            )}
            
            {currentStep < 3 ? (
              <Button onClick={nextStep} className="bg-blue-600 hover:bg-blue-700 text-white gap-1">
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            ) : (
              <div></div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}