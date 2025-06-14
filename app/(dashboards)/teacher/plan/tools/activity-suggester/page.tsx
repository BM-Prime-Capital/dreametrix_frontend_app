"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { suggestActivities, type SuggestActivitiesInput } from "@/ai/flows/activity-suggestion-tool";
import { SUBJECTS, GRADE_LEVELS, type Subject } from "@/lib/types";
import { Loader2, Sparkles, Lightbulb, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import PageTitleH1 from "@/components/ui/page-title-h1";

export default function ActivitySuggesterPage() {
  const [subject, setSubject] = useState<Subject | undefined>();
  const [gradeLevel, setGradeLevel] = useState<string | undefined>();
  const [lessonObjective, setLessonObjective] = useState<string>("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
        gradeLevel: parseInt(gradeLevel.match(/\d+/)?.toString() || "0") || 7,
      };
      const result = await suggestActivities(input);
      setSuggestions(result.suggestedActivities);

      if (result.suggestedActivities.length === 0) {
        toast({
          title: "No Suggestions Found",
          description: "The AI couldn't find specific suggestions. Try rephrasing your objective.",
        });
      } else {
        toast({
          title: "Suggestions Generated!",
          description: "Review the suggested activities below.",
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

  const copySuggestions = async () => {
    try {
      await navigator.clipboard.writeText(suggestions.map((s, i) => `${i + 1}. ${s}`).join("\n"));
      toast({
        title: "Copied!",
        description: "Suggestions copied to clipboard.",
      });
    } catch (err) {
      console.log(err)
      toast({
        title: "Error",
        description: "Failed to copy suggestions.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6 bg-gray-50 min-h-screen p-6">
      {/* Header Section - Conservé comme avant */}
      <header className="bg-[#3e81d4] px-6 py-4 rounded-md shadow">
        <div className="flex items-center gap-4">
          <Lightbulb className="h-8 w-8 text-white" />
          <div>
            <PageTitleH1 title="AI Activity Suggester" className="text-white" />
            <p className="text-white/90 mt-1 ml-1 max-w-2xl">
              Get creative and engaging activity ideas tailored to your lesson objectives and student grade level.
            </p>
          </div>
        </div>
      </header>

            {/* Back Button - Below header */}

      <div className="w-full px-0 py-2 bg-gray-100 border-b">
        <Button
          variant="outline"
          onClick={() => window.history.back()}
          className="flex items-center gap-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
          >
            <path d="m15 18-6-6 6-6"/>
          </svg>
          Back
        </Button>
      </div>

      {/* Main Content - Redesign */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {/* Input Card */}
        <Card className="lg:col-span-2 border-0 shadow-lg bg-white">
          <CardHeader className="border-b border-gray-100">
            <CardTitle className="font-headline text-2xl flex items-center gap-2 text-gray-800">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Sparkles className="h-6 w-6 text-blue-600" />
              </div>
              Lesson Details
            </CardTitle>
            <CardDescription className="text-gray-500">
              Provide the context for your lesson to generate relevant activity suggestions
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6 pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="suggester-subject" className="text-gray-700">Subject</Label>
                  <Select value={subject} onValueChange={(value) => setSubject(value as Subject)}>
                    <SelectTrigger id="suggester-subject" className="h-12 border-gray-300 hover:border-blue-300">
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent className="shadow-lg">
                      {SUBJECTS.map((s) => (
                        <SelectItem key={s} value={s} className="hover:bg-blue-50">{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="suggester-grade" className="text-gray-700">Grade Level</Label>
                  <Select value={gradeLevel} onValueChange={setGradeLevel}>
                    <SelectTrigger id="suggester-grade" className="h-12 border-gray-300 hover:border-blue-300">
                      <SelectValue placeholder="Select grade" />
                    </SelectTrigger>
                    <SelectContent className="shadow-lg">
                      {GRADE_LEVELS.map((g) => (
                        <SelectItem key={g} value={g} className="hover:bg-blue-50">{g}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="suggester-objective" className="text-gray-700">Lesson Objective</Label>
                <Textarea
                  id="suggester-objective"
                  placeholder="e.g., Students will be able to identify three types of rocks and their characteristics."
                  value={lessonObjective}
                  onChange={(e) => setLessonObjective(e.target.value)}
                  rows={5}
                  className="min-h-[120px] border-gray-300 hover:border-blue-300 focus:border-blue-400"
                />
              </div>
            </CardContent>
            <CardFooter className="pt-0">
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 text-lg bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 shadow-md"
              >
                {isLoading ? (
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : (
                  <Sparkles className="mr-2 h-5 w-5" />
                )}
                Generate Activity Suggestions
              </Button>
            </CardFooter>
          </form>
        </Card>

        {/* Suggestions Card */}
        {suggestions.length > 0 ? (
          <Card className="lg:col-span-1 flex flex-col h-full border-0 shadow-lg bg-white">
            <CardHeader className="border-b border-gray-100">
              <CardTitle className="font-headline text-2xl flex items-center gap-2 text-gray-800">
                <div className="p-2 bg-amber-100 rounded-lg">
                  <Lightbulb className="h-6 w-6 text-amber-600" />
                </div>
                Suggested Activities
              </CardTitle>
              <CardDescription className="text-gray-500">
                {suggestions.length} creative ideas for your lesson
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow p-0">
              <ScrollArea className="h-[400px] rounded-md">
                <ol className="space-y-4 p-6">
                  {suggestions.map((activity, index) => (
                    <li
                      key={index}
                      className="text-base pb-4 border-b border-gray-100 last:border-0 group hover:bg-blue-50/50 p-2 rounded transition-colors"
                    >
                      <div className="flex items-start">
                        <span className="font-medium text-blue-600 mr-2">{index + 1}.</span>
                        <span className="group-hover:text-blue-800 transition-colors">{activity}</span>
                      </div>
                    </li>
                  ))}
                </ol>
              </ScrollArea>
            </CardContent>
            <CardFooter>
              <Button
                variant="outline"
                onClick={copySuggestions}
                className="w-full h-12 text-lg gap-2 border-blue-200 text-blue-600 hover:bg-blue-50 hover:text-blue-700"
              >
                <Copy className="h-5 w-5" />
                Copy All Suggestions
              </Button>
            </CardFooter>
          </Card>
        ) : (
          /* Empty State */
          <Card className="lg:col-span-1 flex flex-col items-center justify-center p-8 bg-white border-0 shadow-lg">
            <div className="text-center space-y-4">
              <div className="mx-auto bg-blue-100/50 p-3 rounded-full">
                <Sparkles className="h-8 w-8 text-blue-400" />
              </div>
              <h3 className="text-xl font-headline text-gray-700">Your Suggestions Will Appear Here</h3>
              <p className="text-gray-500">
                Fill out the lesson details and click &#34;Generate&#34; to see AI-powered activity ideas.
              </p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
