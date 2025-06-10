"use client";

import PageTitleH1 from "@/components/ui/page-title-h1";
import React, { useState } from "react";
import { ChevronLeft, Plus, FileText, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
// import LessonPlanForm from "@/components/plan/LessonPlanForm";
// import LessonPlanCard from "../../../../components/plan/LessonPlanCard";

interface FormData {
  title: string;
  date: string;
  selectedClass: string;
  standards: string;
  objectives: string[];
  activities: Array<{
    type: string;
    duration: string;
    description: string;
  }>;
}

const initialFormData: FormData = {
  title: "",
  date: "",
  selectedClass: "",
  standards: "",
  objectives: [""],
  activities: [{ type: "", duration: "", description: "" }],
};

const LessonPlans = () => {
  const router = useRouter();
  const [lessonPlans, setLessonPlans] = useState([
    {
      id: "1",
      title: "Introduction to Variables",
      date: "2024-03-20",
      class: "Class 1",
      standards: "CCSS.MATH.CONTENT.6.EE.A.2",
      objectives: [
        "Understand the concept of variables",
        "Learn how to use variables in simple equations",
      ],
      activities: [
        {
          type: "Warm-up",
          duration: "10 min",
          description: "Review of basic arithmetic operations",
        },
        {
          type: "Main Activity",
          duration: "30 min",
          description: "Introduction to variables through real-world examples",
        },
      ],
    },
    {
      id: "2",
      title: "Basic Algebra",
      date: "2024-03-21",
      class: "Class 2",
      standards: "CCSS.MATH.CONTENT.6.EE.A.3",
      objectives: [
        "Learn basic algebraic expressions",
        "Practice solving simple equations",
      ],
      activities: [
        {
          type: "Introduction",
          duration: "15 min",
          description: "Overview of algebraic concepts",
        },
        {
          type: "Practice",
          duration: "25 min",
          description: "Solving basic algebraic equations",
        },
      ],
    },
  ]);

  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Reset form
  const resetForm = () => {
    setFormData(initialFormData);
    setEditingId(null);
  };

  // Load lesson plan data into form
  const loadLessonPlanData = (plan: (typeof lessonPlans)[0]) => {
    setFormData({
      title: plan.title,
      date: plan.date,
      selectedClass: plan.class,
      standards: plan.standards,
      objectives: plan.objectives,
      activities: plan.activities,
    });
    setEditingId(plan.id);
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const updatedPlan = {
      id: editingId || String(lessonPlans.length + 1),
      title: formData.title,
      date: formData.date,
      class: formData.selectedClass,
      standards: formData.standards,
      objectives: formData.objectives.filter((obj) => obj.trim() !== ""),
      activities: formData.activities.filter(
        (act) => act.type.trim() !== "" || act.description.trim() !== ""
      ),
    };

    if (editingId) {
      setLessonPlans((prev) =>
        prev.map((plan) => (plan.id === editingId ? updatedPlan : plan))
      );
    } else {
      setLessonPlans((prev) => [...prev, updatedPlan]);
    }

    setOpen(false);
    resetForm();
  };

  const handleEdit = (id: string) => {
    const planToEdit = lessonPlans.find((plan) => plan.id === id);
    if (planToEdit) {
      loadLessonPlanData(planToEdit);
      setOpen(true);
    }
  };

  const handleDuplicate = (id: string) => {
    const planToDuplicate = lessonPlans.find((plan) => plan.id === id);
    if (planToDuplicate) {
      setFormData({
        title: `${planToDuplicate.title} (Copy)`,
        date: planToDuplicate.date,
        selectedClass: planToDuplicate.class,
        standards: planToDuplicate.standards,
        objectives: [...planToDuplicate.objectives],
        activities: [...planToDuplicate.activities],
      });
      setEditingId(null);
      setOpen(true);
    }
  };

  const handleDelete = (id: string) => {
    setLessonPlans((prev) => prev.filter((plan) => plan.id !== id));
  };

  // Handlers for objectives
  const handleObjectiveChange = (idx: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      objectives: prev.objectives.map((obj, i) => (i === idx ? value : obj)),
    }));
  };

  const addObjective = () => {
    setFormData((prev) => ({
      ...prev,
      objectives: [...prev.objectives, ""],
    }));
  };

  const removeObjective = (idx: number) => {
    setFormData((prev) => ({
      ...prev,
      objectives: prev.objectives.filter((_, i) => i !== idx),
    }));
  };

  // Handlers for activities
  const handleActivityChange = (idx: number, field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      activities: prev.activities.map((act, i) =>
        i === idx ? { ...act, [field]: value } : act
      ),
    }));
  };

  const addActivity = () => {
    setFormData((prev) => ({
      ...prev,
      activities: [
        ...prev.activities,
        { type: "", duration: "", description: "" },
      ],
    }));
  };

  const removeActivity = (idx: number) => {
    setFormData((prev) => ({
      ...prev,
      activities: prev.activities.filter((_, i) => i !== idx),
    }));
  };

  return (
    <section className="flex flex-col gap-2 w-full">
      <div className="flex justify-between items-center bg-[#3e81d4] px-4 py-3 rounded-md">
        <PageTitleH1 title="Plan > Lesson Plans" className="text-white" />
      </div>

      <div className={"flex flex-col gap-8 bg-white p-4 rounded-md"}>
        <div className="flex justify-between items-center mb-2">
          <Button variant="ghost" onClick={() => router.back()}>
            <ChevronLeft className="mr-2" /> Back
          </Button>
          <div className="space-x-2">
            <Dialog
              open={open}
              onOpenChange={(isOpen) => {
                setOpen(isOpen);
                if (!isOpen) resetForm();
              }}
            >
              <DialogTrigger asChild>
                <Button className={"bg-blue-500 hover:bg-blue-600"}>
                  <Plus className="mr-2b " /> New Lesson Plans
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl w-full">
                <DialogHeader>
                  <DialogTitle>
                    {editingId ? "Edit Lesson Plan" : "Create New Lesson Plan"}
                  </DialogTitle>
                </DialogHeader>
                <form
                  onSubmit={handleSubmit}
                  className="space-y-6 max-h-[70vh] overflow-y-auto pr-2"
                >
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="block text-sm font-medium mb-1">
                        Lesson plan title
                      </label>
                      <input
                        type="text"
                        className="w-full border rounded px-3 py-2"
                        value={formData.title}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            title: e.target.value,
                          }))
                        }
                        placeholder="Introduction to variables"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-medium mb-1">
                        Date
                      </label>
                      <input
                        type="date"
                        className="w-full border rounded px-3 py-2"
                        value={formData.date}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            date: e.target.value,
                          }))
                        }
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Class
                    </label>
                    <select
                      className="w-full border rounded px-3 py-2"
                      value={formData.selectedClass}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          selectedClass: e.target.value,
                        }))
                      }
                    >
                      <option value="">Select a class...</option>
                      <option value="Class 1">Class 1</option>
                      <option value="Class 2">Class 2</option>
                      <option value="Class 3">Class 3</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Standards
                    </label>
                    <input
                      type="text"
                      className="w-full border rounded px-3 py-2"
                      value={formData.standards}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          standards: e.target.value,
                        }))
                      }
                      placeholder="CCSS.MATH.CONTENT.6.EE.A.2"
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-sm font-medium">
                        Objectives
                      </label>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={addObjective}
                      >
                        <Plus className="mr-1 h-4 w-4" /> Add
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {formData.objectives.map((obj, idx) => (
                        <div key={idx} className="flex gap-2 items-center">
                          <input
                            type="text"
                            className="flex-1 border rounded px-3 py-2"
                            value={obj}
                            onChange={(e) =>
                              handleObjectiveChange(idx, e.target.value)
                            }
                            placeholder="Trigger awareness"
                          />
                          {formData.objectives.length > 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => removeObjective(idx)}
                            >
                              <Trash2 className="h-4 w-4 text-gray-400" />
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-sm font-medium">
                        Activities
                      </label>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={addActivity}
                      >
                        <Plus className="mr-1 h-4 w-4" /> Add
                      </Button>
                    </div>
                    <div className="space-y-4">
                      {formData.activities.map((act, idx) => (
                        <div
                          key={idx}
                          className="border rounded p-3 space-y-2 relative min-h-[64px]"
                        >
                          <div className="flex gap-4">
                            <div className="flex-1">
                              <label className="block text-xs font-medium mb-1">
                                Type
                              </label>
                              <input
                                type="text"
                                className="w-full border rounded px-3 py-2"
                                value={act.type}
                                onChange={(e) =>
                                  handleActivityChange(
                                    idx,
                                    "type",
                                    e.target.value
                                  )
                                }
                                placeholder="Warming the brain up"
                              />
                            </div>
                            <div className="flex-1">
                              <label className="block text-xs font-medium mb-1">
                                Duration
                              </label>
                              <select
                                className="w-full border rounded px-3 py-2"
                                value={act.duration}
                                onChange={(e) =>
                                  handleActivityChange(
                                    idx,
                                    "duration",
                                    e.target.value
                                  )
                                }
                              >
                                <option value="">Select...</option>
                                {[...Array(12)].map((_, i) => {
                                  const val = (i + 1) * 5;
                                  return (
                                    <option key={val} value={`${val} min`}>
                                      {val} min
                                    </option>
                                  );
                                })}
                              </select>
                            </div>
                          </div>
                          <div>
                            <label className="block text-xs font-medium mb-1">
                              Description
                            </label>
                            <input
                              type="text"
                              className="w-full border rounded px-3 py-2"
                              value={act.description}
                              onChange={(e) =>
                                handleActivityChange(
                                  idx,
                                  "description",
                                  e.target.value
                                )
                              }
                              placeholder="Trouble with finding interest with this class"
                            />
                          </div>
                          {formData.activities.length > 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="absolute top-1/2 right-2 -translate-y-1/2 bg-white hover:bg-gray-100 shadow"
                              onClick={() => removeActivity(idx)}
                              aria-label="Delete activity"
                            >
                              <Trash2 className="h-4 w-4 text-gray-400" />
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-between mt-6">
                    <DialogClose asChild>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={resetForm}
                      >
                        Cancel
                      </Button>
                    </DialogClose>
                    <Button
                      type="submit"
                      className="bg-blue-500 hover:bg-blue-600 text-white flex items-center gap-2"
                    >
                      <span>
                        {editingId ? "Save Changes" : "Create Lesson Plan"}
                      </span>
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {lessonPlans.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <div className="bg-blue-50 p-6 rounded-full mb-4">
              <FileText className="h-16 w-16 text-blue-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No Lesson Plans Yet
            </h3>
            <p className="text-gray-500 mb-6 max-w-sm">
              Create your first lesson plan to start organizing your teaching
              materials and activities.
            </p>
            <Button
              className="bg-blue-500 hover:bg-blue-600"
              onClick={() => setOpen(true)}
            >
              <Plus className="mr-2 h-4 w-4" /> Create Your First Lesson Plan
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {/* {lessonPlans.map((plan) => (
                            <LessonPlanCard
                                key={plan.id}
                                lessonPlan={plan}
                                onEdit={handleEdit}
                                onDuplicate={handleDuplicate}
                                onDelete={handleDelete}
                            />
                        ))} */}
          </div>
        )}

        {/*<LessonPlanForm />*/}
      </div>
    </section>
  );
};

export default LessonPlans;
