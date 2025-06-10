"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/ui/loader";
import {
  getAssessmentWeights,
  updateAssessmentWeights,
} from "@/services/AssignmentService";
import { useRequestInfo } from "@/hooks/useRequestInfo";

interface Weights {
  test: number;
  quiz: number;
  homework: number;
  participation: number;
  other: number;
}

interface GradebookSettingsDialogProps {
  courseId: number;
  children?: React.ReactNode;
}

export function GradebookSettingsDialog({
  courseId,
  children,
}: GradebookSettingsDialogProps) {
  const { tenantDomain, accessToken, refreshToken } = useRequestInfo();
  const [open, setOpen] = useState(false);
  const [weights, setWeights] = useState<Weights>({
    test: 20,
    quiz: 20,
    homework: 20,
    participation: 20,
    other: 20,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load weights when dialog opens
  useEffect(() => {
    if (open && courseId && tenantDomain && accessToken) {
      loadAssessmentWeights();
    }
  }, [open, courseId, tenantDomain, accessToken]);

  const loadAssessmentWeights = async () => {
    setIsLoading(true);
    setError(null);

    try {
      console.log(`🔍 Loading assessment weights for course: ${courseId}`);
      const data = await getAssessmentWeights(
        courseId,
        tenantDomain,
        accessToken,
        refreshToken
      );

      console.log("📊 Assessment weights data:", data);

      // Update weights with API response
      if (data) {
        setWeights({
          test: data.test || 20,
          quiz: data.quiz || 20,
          homework: data.homework || 20,
          participation: data.participation || 20,
          other: data.other || 20,
        });
      }
    } catch (err) {
      console.error("❌ Error loading assessment weights:", err);
      setError(
        err instanceof Error ? err.message : "Failed to load assessment weights"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: keyof Weights, value: number) => {
    setWeights((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);

    try {
      console.log("💾 Saving assessment weights:", weights);

      await updateAssessmentWeights(
        courseId,
        weights,
        tenantDomain,
        accessToken,
        refreshToken
      );

      console.log("✅ Assessment weights saved successfully");
      setOpen(false);
    } catch (err) {
      console.error("❌ Error saving assessment weights:", err);
      setError(
        err instanceof Error ? err.message : "Failed to save assessment weights"
      );
    } finally {
      setIsSaving(false);
    }
  };

  const totalWeight =
    weights.test +
    weights.quiz +
    weights.homework +
    weights.participation +
    weights.other;
  const isValidTotal = totalWeight === 100;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button className="flex gap-2 items-center text-lg bg-[#6366f1] hover:bg-[#6366f1]/90 text-white rounded-xl px-5 py-4 shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02] group">
            <div className="relative flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-6 h-6 transform group-hover:rotate-45 transition-transform duration-300"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 011.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.56.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.893.149c-.425.07-.765.383-.93.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 01-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.397.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 01-.12-1.45l.527-.737c.25-.35.273-.806.108-1.204-.165-.397-.505-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.107-1.204l-.527-.738a1.125 1.125 0 01.12-1.45l.773-.773a1.125 1.125 0 011.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
            <span className="font-semibold tracking-wide">Settings</span>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] rounded-xl bg-gradient-to-br from-white to-gray-50">
        <DialogHeader className="text-center">
          <DialogTitle className="text-2xl font-bold text-[#3e81d4] flex items-center justify-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-7 h-7"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Grade Category Weights
          </DialogTitle>
          <p className="text-gray-600 text-sm mt-2">
            Define how much each assignment category contributes to the final
            grade
          </p>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center p-8">
            <Loader />
            <span className="ml-2 text-gray-600">Loading weights...</span>
          </div>
        ) : error ? (
          <div className="text-red-500 p-4 text-center bg-red-50 rounded-lg">
            <p className="font-medium">Error loading weights</p>
            <p className="text-sm mt-1">{error}</p>
            <Button
              onClick={loadAssessmentWeights}
              variant="outline"
              size="sm"
              className="mt-2"
            >
              Retry
            </Button>
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSave();
            }}
            className="space-y-6 p-2"
          >
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  Tests
                </label>
                <div className="relative">
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={weights.test}
                    onChange={(e) =>
                      handleChange("test", parseFloat(e.target.value) || 0)
                    }
                    className="text-center font-medium border-2 focus:border-blue-500 transition-colors"
                    required
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                    %
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  Quizzes
                </label>
                <div className="relative">
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={weights.quiz}
                    onChange={(e) =>
                      handleChange("quiz", parseFloat(e.target.value) || 0)
                    }
                    className="text-center font-medium border-2 focus:border-green-500 transition-colors"
                    required
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                    %
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  Homework
                </label>
                <div className="relative">
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={weights.homework}
                    onChange={(e) =>
                      handleChange("homework", parseFloat(e.target.value) || 0)
                    }
                    className="text-center font-medium border-2 focus:border-yellow-500 transition-colors"
                    required
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                    %
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  Participation
                </label>
                <div className="relative">
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={weights.participation}
                    onChange={(e) =>
                      handleChange(
                        "participation",
                        parseFloat(e.target.value) || 0
                      )
                    }
                    className="text-center font-medium border-2 focus:border-purple-500 transition-colors"
                    required
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                    %
                  </span>
                </div>
              </div>

              <div className="space-y-2 col-span-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                  Other
                </label>
                <div className="relative">
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={weights.other}
                    onChange={(e) =>
                      handleChange("other", parseFloat(e.target.value) || 0)
                    }
                    className="text-center font-medium border-2 focus:border-gray-500 transition-colors"
                    required
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                    %
                  </span>
                </div>
              </div>
            </div>

            {/* Total indicator */}
            <div
              className={`rounded-lg p-4 border-2 transition-colors ${
                isValidTotal
                  ? "bg-green-50 border-green-200"
                  : "bg-red-50 border-red-200"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-gray-700">
                  Total Weight:
                </span>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-lg font-bold ${
                      isValidTotal ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {totalWeight}%
                  </span>
                  {isValidTotal ? (
                    <svg
                      className="w-5 h-5 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-5 h-5 text-red-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  )}
                </div>
              </div>
              {!isValidTotal && (
                <p className="text-sm text-red-600 mt-1">
                  Weights must total exactly 100%
                </p>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                className="px-6 py-2"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="px-6 py-2 bg-[#3e81d4] hover:bg-[#3e81d4]/90 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!isValidTotal || isSaving}
              >
                {isSaving ? (
                  <>
                    <Loader className="w-4 h-4 mr-2" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </div>
          </form>
        )}

        {error && !isLoading && (
          <div className="text-red-500 p-3 text-center bg-red-50 rounded-lg text-sm">
            {error}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
