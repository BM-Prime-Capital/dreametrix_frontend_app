"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { curriculumAlignmentVerifier, type CurriculumAlignmentInput } from "@/ai/flows/curriculum-alignment-verifier";
import { Loader2,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  // ChevronRight,
  Copy,
  // ArrowLeft,
  Trash2,
  // PlusCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
// import Link from "next/link";

interface AlignmentResult {
  isAligned: boolean;
  alignmentReport: string;
}

export default function AlignmentVerifierPage() {
  const [scopeAndSequence, setScopeAndSequence] = useState<string>("");
  const [unitPlan, setUnitPlan] = useState<string>("");
  const [lessonPlan, setLessonPlan] = useState<string>("");
  const [stateStandards, setStateStandards] = useState<string>("");
  const [result, setResult] = useState<AlignmentResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!scopeAndSequence || !unitPlan || !lessonPlan || !stateStandards) {
      toast({
        title: "Missing Information",
        description: "Please fill in all document fields for verification.",
        variant: "destructive",
      });
      return;
    }
    setIsLoading(true);
    setResult(null);
    try {
      const input: CurriculumAlignmentInput = {
        scopeAndSequence,
        unitPlan,
        lessonPlan,
        stateStandards,
      };
      const verificationResult = await curriculumAlignmentVerifier(input);
      setResult(verificationResult);
      setIsDialogOpen(true);
      toast({
        title: "Alignment Check Complete!",
        description: verificationResult.isAligned
          ? "Curriculum appears to be aligned."
          : "Alignment issues found. Review the report.",
      });
    } catch (error) {
      console.error("Error verifying alignment:", error);
      toast({
        title: "Error",
        description: "Failed to verify curriculum alignment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyReport = async () => {
    try {
      await navigator.clipboard.writeText(result?.alignmentReport || "");
      toast({
        title: "Copied!",
        description: "Report copied to clipboard",
      });
    } catch (err) {
      console.log(err)
      toast({
        title: "Error",
        description: "Failed to copy report",
        variant: "destructive",
      });
    }
  };

  const clearForm = () => {
    setScopeAndSequence("");
    setUnitPlan("");
    setLessonPlan("");
    setStateStandards("");
    setResult(null);
    toast({
      title: "Form Cleared",
      description: "All fields have been reset",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 w-full">
      {/* Header Section - Full width */}
      <div className="bg-[#3e81d4] w-full px-4 py-4 shadow-sm">
        <div className="flex items-center gap-3">
          <ShieldCheck className="h-6 w-6 text-white" />
          <div className="text-left">
            <h1 className="text-xl font-bold text-white">Curriculum Alignment Verifier</h1>
            <p className="text-white/90 text-sm">
              Ensure your lesson plans are perfectly aligned with state standards using AI verification
            </p>
          </div>
        </div>
      </div>

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


      {/* Main Content - Full width */}
      <div className="w-full px-0 py-4">
        {/* Input Card - Full width */}
        <Card className="border-0 shadow-none rounded-none">
          <CardHeader className="px-4 py-3">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-lg font-medium">
                  Verify Curriculum Alignment
                </CardTitle>
                <CardDescription className="text-sm">
                  Paste your documents below to check alignment with standards
                </CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={clearForm}
                className="text-gray-600 hover:text-red-600"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clear All
              </Button>
            </div>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="px-4 py-2 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="scope-sequence" className="text-sm">
                  Scope and Sequence
                </Label>
                <Textarea
                  id="scope-sequence"
                  placeholder="Paste your full Scope and Sequence document..."
                  value={scopeAndSequence}
                  onChange={(e) => setScopeAndSequence(e.target.value)}
                  rows={6}
                  className="text-sm min-h-[120px]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="unit-plan" className="text-sm">
                  Unit Plan
                </Label>
                <Textarea
                  id="unit-plan"
                  placeholder="Paste your Unit Plan document..."
                  value={unitPlan}
                  onChange={(e) => setUnitPlan(e.target.value)}
                  rows={6}
                  className="text-sm min-h-[120px]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lesson-plan" className="text-sm">
                  Lesson Plan
                </Label>
                <Textarea
                  id="lesson-plan"
                  placeholder="Paste your Lesson Plan document..."
                  value={lessonPlan}
                  onChange={(e) => setLessonPlan(e.target.value)}
                  rows={6}
                  className="text-sm min-h-[120px]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="state-standards" className="text-sm">
                  State Standards
                </Label>
                <Textarea
                  id="state-standards"
                  placeholder="Paste the relevant State Standards..."
                  value={stateStandards}
                  onChange={(e) => setStateStandards(e.target.value)}
                  rows={6}
                  className="text-sm min-h-[120px]"
                />
              </div>
            </CardContent>

            <CardFooter className="px-4 py-3 flex gap-3">
              <Button
                type="submit"
                disabled={isLoading}
                className="flex-1 h-10 text-sm"
              >
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <ShieldCheck className="mr-2 h-4 w-4" />
                )}
                Verify Alignment
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>

      {/* Results Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-full sm:max-w-2xl text-sm">
          <DialogHeader>
            <DialogTitle className="text-lg">
              Alignment Report
            </DialogTitle>
          </DialogHeader>

          {result && (
            <div className="space-y-4">
              <Alert variant={result.isAligned ? "default" : "destructive"} className="text-sm">
                {result.isAligned ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : (
                  <XCircle className="h-4 w-4" />
                )}
                <AlertTitle>
                  {result.isAligned ? "Curriculum is Aligned" : "Alignment Issues Detected"}
                </AlertTitle>
                <AlertDescription>
                  {result.isAligned
                    ? "All documents are properly aligned."
                    : "Potential misalignments found."}
                </AlertDescription>
              </Alert>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label className="font-medium">Detailed Report:</Label>
                  <Button
                    variant="outline"
                    onClick={copyReport}
                    size="sm"
                    className="h-8 text-sm"
                  >
                    <Copy className="mr-2 h-3 w-3" />
                    Copy
                  </Button>
                </div>

                <ScrollArea className="h-[60vh] rounded-md border p-3 text-sm">
                  {result.alignmentReport}
                </ScrollArea>
              </div>

              <div className="flex justify-end pt-2 gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  size="sm"
                  className="h-8 text-sm"
                >
                  Close
                </Button>
                <Button
                  onClick={clearForm}
                  variant="outline"
                  size="sm"
                  className="h-8 text-sm text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear Form
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
