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

interface AddPollsDialogProps {
  onPollCreated?: () => void;
}

export function AddPollsDialog({ onPollCreated }: AddPollsDialogProps) {
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
  const [temporaryChoices, setTemporaryChoices] = useState<{ label: string }[]>([]);
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
      setCurrentStep(1);
      setPollTitle("");
      setDescription("");
      setCourseId(null);
      setEndDate(new Date());
      setQuestions([]);
      setNewQuestionText("");
      setNewQuestionType("single");
      setEditingQuestionIndex(null);
      setTemporaryChoices([]);
    }
  }, [open]);

  const addOption = () => {
    if (!newOptionText.trim()) return;

    // For single choice, replace existing option if one exists
    if (newQuestionType === "single") {
      setTemporaryChoices([{ label: newOptionText.trim() }]);
    } else {
      setTemporaryChoices([...temporaryChoices, { label: newOptionText.trim() }]);
    }
    setNewOptionText("");
  };

  const removeOption = (index: number) => {
    const updated = [...temporaryChoices];
    updated.splice(index, 1);
    setTemporaryChoices(updated);
  };

  const addQuestion = () => {
    console.log("addQuestion called", { newQuestionText, newQuestionType, temporaryChoices, questions: questions.length });
    
    if (!newQuestionText.trim()) {
      console.log("Question text is empty");
      toast.warning("Question text cannot be empty");
      return;
    }

    // For single choice, ensure we have at least one option
    if (newQuestionType === "single" && temporaryChoices.length === 0) {
      console.log("Single choice validation failed - no options", { temporaryChoices });
      toast.warning("Single choice questions must have at least one option");
      return;
    }

    const questionData = {
      text: newQuestionText.trim(),
      question_type: newQuestionType,
      required: true,
      choices: newQuestionType !== "text" ? [...temporaryChoices] : [],
    };

    console.log("Adding question:", questionData);

    if (editingQuestionIndex !== null) {
      const updatedQuestions = [...questions];
      updatedQuestions[editingQuestionIndex] = questionData;
      setQuestions(updatedQuestions);
      console.log("Updated question at index", editingQuestionIndex);
    } else {
      setQuestions([...questions, questionData]);
      console.log("Added new question, total questions:", questions.length + 1);
    }

    setNewQuestionText("");
    setNewQuestionType("single");
    setTemporaryChoices([]);
    setEditingQuestionIndex(null);
  };

  const editQuestion = (index: number) => {
    const question = questions[index];
    setNewQuestionText(question.text);
    setNewQuestionType(question.question_type);
    setEditingQuestionIndex(index);
    setTemporaryChoices(question.choices || []);
  };

  const cancelEdit = () => {
    setEditingQuestionIndex(null);
    setNewQuestionText("");
    setNewQuestionType("single");
    setTemporaryChoices([]);
  };

  const removeQuestion = (index: number) => {
    const updatedQuestions = [...questions];
    updatedQuestions.splice(index, 1);
    setQuestions(updatedQuestions);
    if (editingQuestionIndex === index) {
      cancelEdit();
    }
  };

  const handleSubmit = async () => {
    console.log("handleSubmit called");
    console.log("Current state:", { pollTitle, courseId, endDate, questions: questions.length, tenantDomain, accessToken });
    
    if (!tenantDomain || !accessToken) {
      console.log("Authentication error - missing tenantDomain or accessToken");
      toast.error("Authentication error. Please try again.");
      return;
    }

    if (!pollTitle.trim()) {
      console.log("Validation error - poll title is empty");
      toast.warning("Poll title is required");
      return;
    }

    if (courseId === null) {
      console.log("Validation error - courseId is null");
      toast.warning("Course ID is required");
      return;
    }

    if (!endDate) {
      console.log("Validation error - endDate is missing");
      toast.warning("End date is required");
      return;
    }

    if (questions.length === 0) {
      console.log("Validation error - no questions");
      toast.warning("Please add at least one question");
      return;
    }

    console.log("All validations passed, starting submission");
    setSubmitting(true);
    
    try {
      const pollData = {
        title: pollTitle.trim(),
        description: description.trim(),
        course: Number(courseId),
        deadline: endDate.toISOString(),
        is_anonymous: true,
        questions: questions.map(q => ({
          ...q,
          text: q.text.trim(),
          choices: q.choices?.map((c: { label: string }) => ({ label: c.label.trim() }))
        })),
      };
      
      console.log("Submitting poll data:", pollData);
      
      await createPoll(
        pollData,
        tenantDomain,
        accessToken
      );

      console.log("Poll created successfully");
      toast.success("Poll created successfully!");
      setOpen(false);
      // Trigger refresh of polls data
      onPollCreated?.();
    } catch (error) {
      console.error("Error creating poll:", error);
      toast.error("Failed to create poll. Please try again.");
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
    console.log("nextStep called, current step:", currentStep);
    if (currentStep === 1 && !validateStep1()) {
      console.log("Step 1 validation failed");
      return;
    }
    console.log("Moving to next step");
    setCurrentStep((prev) => prev + 1);
  };

  const prevStep = () => {
    setCurrentStep((prev) => prev - 1);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-[#3E81D4] to-[#5D9DF5] hover:from-[#2D71C4] hover:to-[#4C8DE5] text-white px-6 py-5 rounded-xl shadow-lg transition-all hover:shadow-xl transform hover:scale-105 duration-200 ease-in-out">
          <PlusCircle className="mr-2 h-5 w-5" strokeWidth={2} />
          <span className="text-lg font-semibold">Create New Poll</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] p-0 border-0 rounded-xl flex flex-col overflow-hidden [&>button]:text-white [&>button]:hover:text-blue-200 [&>button]:hover:bg-white/20 [&>button]:rounded-full [&>button]:p-2 [&>button]:transition-all [&>button]:duration-200">
        {/* Fixed Header */}
        <div className="bg-gradient-to-r from-[#3E81D4] to-[#5D9DF5] p-6 flex-shrink-0">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-white">
              Create New Poll
            </DialogTitle>
            <p className="text-blue-100 mt-1">
              {currentStep === 1 && "Enter basic poll details"}
              {currentStep === 2 && "Add your questions"}
              {currentStep === 3 && "Review and submit"}
            </p>
          </DialogHeader>
          
          {/* Enhanced Stepper */}
          <div className="flex justify-between items-center relative mt-6">
            <div className="absolute top-1/2 left-0 right-0 h-[3px] bg-blue-200 -z-10"></div>
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex flex-col items-center z-10">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center shadow-md transition-all duration-300 ${
                    currentStep >= step 
                      ? "bg-white border-4 border-white text-[#3E81D4]" 
                      : "bg-blue-200 text-blue-300"
                  }`}
                >
                  <span className={`text-lg font-semibold ${currentStep === step ? "scale-110" : ""}`}>
                    {step}
                  </span>
                </div>
                <span className={`text-sm mt-2 font-medium ${
                  currentStep >= step ? "text-white" : "text-blue-200"
                }`}>
                  {step === 1 ? "Details" : step === 2 ? "Questions" : "Review"}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">

          {/* Step 1: Poll Details */}
          {currentStep === 1 && (
            <div className="grid gap-6 py-2">
              <div className="grid gap-2">
                <Label htmlFor="title" className="text-gray-700 font-medium">
                  Poll Title <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="title"
                  placeholder="What's your poll about?"
                  value={pollTitle}
                  onChange={(e) => setPollTitle(e.target.value)}
                  className="py-3 px-4 rounded-lg border-gray-300 focus:border-[#3E81D4] focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="description" className="text-gray-700 font-medium">
                  Description
                </Label>
                <Textarea
                  id="description"
                  placeholder="Add a brief description (optional)"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="rounded-lg border-gray-300 focus:border-[#3E81D4] focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="courseId" className="text-gray-700 font-medium">
                  Select Course <span className="text-red-500">*</span>
                </Label>
                <Select
                  onValueChange={(value) => setCourseId(Number(value))}
                  value={courseId !== null ? courseId.toString() : undefined}
                >
                  <SelectTrigger className="w-full py-3 px-4 rounded-lg border-gray-300 focus:border-[#3E81D4] focus:ring-2 focus:ring-blue-100">
                    <SelectValue placeholder="Select a course" />
                  </SelectTrigger>
                  <SelectContent className="rounded-lg shadow-lg border-gray-200">
                    {courses.map((course) => (
                      <SelectItem
                        key={course.id}
                        value={course.id.toString()}
                        className="hover:bg-blue-200 focus:bg-blue-200 text-gray-800 hover:text-gray-900 focus:text-gray-900 cursor-pointer transition-all duration-200"
                      >
                        {course.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label className="text-gray-700 font-medium">
                  End Date <span className="text-red-500">*</span>
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal py-3 px-4 rounded-lg border-gray-300 hover:border-gray-400",
                        !endDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4 text-gray-500" />
                      {endDate ? (
                        <span className="text-gray-800">{format(endDate, "PPP")}</span>
                      ) : (
                        <span className="text-gray-500">Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 rounded-lg shadow-xl border-gray-200">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={setEndDate}
                      initialFocus
                      fromDate={new Date()}
                      className="border-0"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          )}

          {/* Step 2: Questions */}
          {currentStep === 2 && (
            <div className="flex flex-col gap-6 py-2">
              <div className="border rounded-xl p-5 bg-white shadow-sm">
                <h3 className="font-medium text-lg mb-4 text-gray-800">
                  {editingQuestionIndex !== null ? "✏️ Edit Question" : "➕ Add New Question"}
                </h3>

                <div className="grid gap-4">
                  <Input
                    placeholder="What would you like to ask?"
                    value={newQuestionText}
                    onChange={(e) => setNewQuestionText(e.target.value)}
                    className="py-3 px-4 rounded-lg border-gray-300 focus:border-[#3E81D4] focus:ring-2 focus:ring-blue-100"
                  />

                  <div className="grid gap-2">
                    <Label className="text-gray-700 font-medium">Question Type</Label>
                    <Select
                      value={newQuestionType}
                      onValueChange={(value) => {
                        setNewQuestionType(value);
                        // Reset choices when changing question type
                        setTemporaryChoices([]);
                      }}
                    >
                      <SelectTrigger className="w-full py-3 px-4 rounded-lg border-gray-300 focus:border-[#3E81D4] focus:ring-2 focus:ring-blue-100">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent className="rounded-lg shadow-lg border-gray-200">
                        <SelectItem value="single" className="hover:bg-blue-200 focus:bg-blue-200 text-gray-800 hover:text-gray-900 focus:text-gray-900 cursor-pointer transition-all duration-200">
                          Single Choice
                        </SelectItem>
                        <SelectItem value="multiple" className="hover:bg-blue-200 focus:bg-blue-200 text-gray-800 hover:text-gray-900 focus:text-gray-900 cursor-pointer transition-all duration-200">
                          Multiple Choice
                        </SelectItem>
                        <SelectItem value="text" className="hover:bg-blue-200 focus:bg-blue-200 text-gray-800 hover:text-gray-900 focus:text-gray-900 cursor-pointer transition-all duration-200">
                          Text Response
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {newQuestionType !== "text" && (
                    <div className="grid gap-2">
                      <Label className="text-gray-700 font-medium">Options</Label>
                      <div className="flex gap-2">
                        <Input
                          placeholder={newQuestionType === "single" ? "Enter the option" : "Add new option"}
                          value={newOptionText}
                          onChange={(e) => setNewOptionText(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") addOption();
                          }}
                          className="py-3 px-4 rounded-lg border-gray-300 focus:border-[#3E81D4] flex-1 focus:ring-2 focus:ring-blue-100"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={addOption}
                          disabled={!newOptionText.trim()}
                          className="h-full border-[#3E81D4] text-[#3E81D4] hover:bg-blue-200 hover:text-[#1e5bb8] hover:border-[#1e5bb8] transition-all duration-200"
                        >
                          Add
                        </Button>
                      </div>

                      <div className="mt-3 space-y-2">
                        {temporaryChoices.length === 0 ? (
                          <p className="text-sm text-gray-400">
                            {newQuestionType === "single"
                              ? "Enter the option for this single choice question"
                              : "No options yet - add at least one option"}
                          </p>
                        ) : (
                          temporaryChoices.map((choice, index) => (
                            <div key={index} className="flex items-center gap-3 group">
                              <RadioGroup>
                                {newQuestionType === "single" ? (
                                  <RadioGroupItem value={choice.label} disabled />
                                ) : (
                                  <Checkbox checked={false} disabled />
                                )}
                              </RadioGroup>
                              <Label className="flex-1">{choice.label}</Label>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 text-gray-400 opacity-0 group-hover:opacity-100 hover:text-red-500 transition-opacity"
                                onClick={() => removeOption(index)}
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button
                      onClick={addQuestion}
                      className="bg-[#3E81D4] hover:bg-[#2D71C4] text-white py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all"
                      disabled={newQuestionType === "single" && temporaryChoices.length === 0}
                    >
                      {editingQuestionIndex !== null ? "Update Question" : "Add Question"}
                    </Button>
                    {editingQuestionIndex !== null && (
                      <Button
                        variant="outline"
                        onClick={cancelEdit}
                        className="py-3 px-6 rounded-lg border-gray-300 hover:border-gray-500 hover:bg-gray-200 text-gray-700 hover:text-gray-900 transition-all duration-200"
                      >
                        Cancel
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-medium text-lg text-gray-800">
                  Your Questions ({questions.length})
                </h3>

                {questions.length === 0 ? (
                  <div className="text-center py-8 text-gray-500 bg-blue-50 rounded-xl">
                    <div className="flex flex-col items-center justify-center">
                      <svg className="w-12 h-12 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                      </svg>
                      <p className="text-gray-600">No questions added yet</p>
                      <p className="text-sm text-gray-500 mt-1">Start by adding your first question above</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {questions.map((question, qIndex) => (
                      <div key={qIndex} className="border rounded-xl p-5 bg-white shadow-sm hover:shadow-lg hover:bg-blue-100 transition-all duration-300">
                        <div className="flex justify-between items-start gap-4">
                          <div className="flex-1">
                            <div className="font-medium flex items-center gap-3">
                              <span className="text-[#3E81D4] font-semibold">{qIndex + 1}.</span>
                              {question.text}
                              <Badge variant="outline" className="text-xs ml-2 border-[#3E81D4] text-[#3E81D4]">
                                {question.question_type === "single" && "Single Choice"}
                                {question.question_type === "multiple" && "Multiple Choice"}
                                {question.question_type === "text" && "Text Response"}
                              </Badge>
                            </div>
                            {question.question_type !== "text" && (
                              <div className="mt-3 space-y-2 pl-7">
                                {question.choices.map((choice: any, cIndex: number) => (
                                  <div key={cIndex} className="flex items-center gap-3 group">
                                    <RadioGroup>
                                      {question.question_type === "single" ? (
                                        <RadioGroupItem
                                          value={choice.label}
                                          disabled
                                          className="text-[#3E81D4] border-gray-400"
                                        />
                                      ) : (
                                        <Checkbox
                                          checked={false}
                                          disabled
                                          className="text-[#3E81D4] border-gray-400"
                                        />
                                      )}
                                    </RadioGroup>
                                    <Label className="flex-1">{choice.label}</Label>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-6 w-6 text-gray-400 opacity-0 group-hover:opacity-100 hover:text-red-500 transition-opacity"
                                      onClick={() => {
                                        if (editingQuestionIndex === qIndex) {
                                          removeOption(cIndex);
                                        }
                                      }}
                                    >
                                      <Trash2 className="h-3.5 w-3.5" />
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
                              className="text-[#3E81D4] hover:bg-blue-200 hover:text-[#1e5bb8] transition-all duration-200"
                            >
                              Edit
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-500 hover:bg-red-200 hover:text-red-700 transition-all duration-200"
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
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-gray-800">Poll Summary</h3>

                <div className="grid gap-6">
                  <div className="border-b pb-4">
                    <h4 className="font-medium text-gray-600 mb-3 flex items-center gap-2">
                      <svg className="w-5 h-5 text-[#3E81D4]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      Details
                    </h4>
                    <div className="mt-2 space-y-3 pl-7">
                      <p className="flex items-start gap-2">
                        <span className="font-medium text-gray-700 min-w-[100px]">Title:</span>
                        <span className="text-gray-800">{pollTitle}</span>
                      </p>
                      {description && (
                        <p className="flex items-start gap-2">
                          <span className="font-medium text-gray-700 min-w-[100px]">Description:</span>
                          <span className="text-gray-800">{description}</span>
                        </p>
                      )}
                      <p className="flex items-start gap-2">
                        <span className="font-medium text-gray-700 min-w-[100px]">Course ID:</span>
                        <span className="text-gray-800">{courseId}</span>
                      </p>
                      <p className="flex items-start gap-2">
                        <span className="font-medium text-gray-700 min-w-[100px]">End Date:</span>
                        <span className="text-gray-800">{endDate && format(endDate, "PPPp")}</span>
                      </p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-600 mb-3 flex items-center gap-2">
                      <svg className="w-5 h-5 text-[#3E81D4]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                      </svg>
                      Questions ({questions.length})
                    </h4>
                    <div className="mt-2 space-y-4">
                      {questions.map((question, qIndex) => (
                        <div key={qIndex} className="border rounded-xl p-5 bg-white shadow-sm hover:shadow-md hover:bg-blue-100 transition-all duration-300">
                          <div className="font-medium text-gray-800 flex items-start gap-2">
                            <span className="text-[#3E81D4] font-semibold">{qIndex + 1}.</span>
                            <span>{question.text}</span>
                            <Badge variant="outline" className="ml-2 text-xs border-[#3E81D4] text-[#3E81D4]">
                              {question.question_type === "single" && "Single Choice"}
                              {question.question_type === "multiple" && "Multiple Choice"}
                              {question.question_type === "text" && "Text Response"}
                            </Badge>
                          </div>
                          {question.question_type !== "text" && (
                            <div className="mt-3 space-y-2 pl-7">
                              {question.choices.map((choice: any, cIndex: number) => (
                                <div key={cIndex} className="flex items-center gap-3">
                                  <RadioGroup>
                                    {question.question_type === "single" ? (
                                      <RadioGroupItem
                                        value={choice.label}
                                        disabled
                                        className="text-[#3E81D4] border-gray-400"
                                      />
                                    ) : (
                                      <Checkbox
                                        checked={false}
                                        disabled
                                        className="text-[#3E81D4] border-gray-400"
                                      />
                                    )}
                                  </RadioGroup>
                                  <Label className="text-gray-700">{choice.label}</Label>
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
            </div>
          )}

        </div>

        {/* Fixed Footer */}
        <div className="flex justify-between p-6 border-t bg-white flex-shrink-0">
          {currentStep > 1 ? (
            <Button
              variant="outline"
              onClick={prevStep}
              className="gap-1 py-3 px-6 rounded-lg border-gray-300 hover:border-gray-500 hover:bg-gray-200 text-gray-700 hover:text-gray-900 transition-all duration-200"
            >
              <ChevronLeft className="h-5 w-5" />
              <span className="font-medium">Previous</span>
            </Button>
          ) : (
            <div></div>
          )}

          {currentStep < 3 ? (
            <Button
              onClick={nextStep}
              className="bg-[#3E81D4] hover:bg-[#2D71C4] text-white gap-1 py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
            >
              <span className="font-medium">Next</span>
              <ChevronRight className="h-5 w-5" />
            </Button>
          ) : (
            <Button
              disabled={submitting}
              onClick={() => {
                console.log("Create Poll Now button clicked, current step:", currentStep);
                console.log("Button disabled:", submitting);
                handleSubmit();
              }}
              className="bg-gradient-to-r from-[#3E81D4] to-[#5D9DF5] hover:from-[#2D71C4] hover:to-[#4C8DE5] text-white py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
            >
              {submitting ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating Poll...
                </span>
              ) : (
                <span className="text-lg font-medium">Create Poll Now</span>
              )}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
