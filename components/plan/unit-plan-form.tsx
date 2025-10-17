"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Target, Link as LinkIcon, X } from "lucide-react";
import {
  NY_STANDARDS,
  UnitPlanFormProps,
  SUBJECTS,
  type ScopeAndSequence,
  convertUnitPlanToFormData,
  UnitPlanFormData
} from "@/lib/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ClassService, UnitPlanService, ScopeAndSequenceService } from "@/services/plan-service";
import { localStorageKey } from "@/constants/global";

export function UnitPlanForm({
  initialData,
  scopeSequences = [],
  onSubmitSuccess
}: UnitPlanFormProps) {
  const router = useRouter();
  const accessToken: any =
    typeof window !== "undefined"
      ? localStorage.getItem(localStorageKey.ACCESS_TOKEN)
      : null;
  const tenantData: any =
    typeof window !== "undefined"
      ? localStorage.getItem(localStorageKey.TENANT_DATA)
      : null;
  const { primary_domain } = tenantData ? JSON.parse(tenantData) : { primary_domain: "" };
  const tenantPrimaryDomain = `https://${primary_domain}`;

  const [classes, setClasses] = useState<{ id: number; subject: string; grade: string }[]>([]);
  const [availableScopeSequences, setAvailableScopeSequences] =
    useState<ScopeAndSequence[]>(scopeSequences);
  const [isLoading, setIsLoading] = useState(false);

const [formData, setFormData] = useState<UnitPlanFormData>(() => {
  const data = convertUnitPlanToFormData(initialData);
  return {
    ...data,
    subject: data.subject || "",
    gradeLevel: data.gradeLevel || "",
    scopeSequenceId: data.scopeSequenceId || "",
    durationWeeks: data.durationWeeks || 3,
    essentialQuestions: data.essentialQuestions || "",
    learningObjectives: data.learningObjectives || "",
    assessmentsFormative: data.assessmentsFormative || "",
    assessmentsSummative: data.assessmentsSummative || "",
    pacingCalendar: data.pacingCalendar || "",
    activities: data.activities || "",
    materials: data.materials || "",
    // Assurez-vous que tous les champs requis ont des valeurs par défaut
  };
});

  const [selectedStandards, setSelectedStandards] = useState<string[]>(formData.standards || []);

  // Charger les classes et scope sequences
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [classesData, scopeSequencesData] = await Promise.all([
          ClassService.list(tenantPrimaryDomain, accessToken),
          ScopeAndSequenceService.list(tenantPrimaryDomain, accessToken)
        ]);
        setClasses(classesData);
        setAvailableScopeSequences(scopeSequencesData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (accessToken && tenantPrimaryDomain) {
      fetchData();
    }
  }, [accessToken, tenantPrimaryDomain]);

  // Après le useEffect qui charge les classes, ajoutez:
useEffect(() => {
  console.log("📚 Classes loaded:", classes);
  console.log("📝 Current form data:", formData);
  
  if (formData.subject && formData.gradeLevel) {
    const matchingClass = classes.find(
      (cls) =>
        cls.subject.trim().toLowerCase() === formData.subject?.trim().toLowerCase() &&
        cls.grade.replace(/Class\s*/i, "").trim() ===
          formData.gradeLevel?.replace(/Class\s*/i, "").trim()
    );
    console.log("🔍 Matching class:", matchingClass);
  }
}, [classes, formData.subject, formData.gradeLevel]);

  const updateField = (field: keyof UnitPlanFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddStandard = (standard: string) => {
    if (standard && !selectedStandards.includes(standard)) {
      const newStandards = [...selectedStandards, standard];
      setSelectedStandards(newStandards);
      updateField("standards", newStandards);
    }
  };

  const handleRemoveStandard = (standard: string) => {
    const newStandards = selectedStandards.filter((s) => s !== standard);
    setSelectedStandards(newStandards);
    updateField("standards", newStandards);
  };

  //  Version corrigée du handleSubmit
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  // Validation des champs requis
  const requiredFields = [
    { key: 'title', label: 'Unit Title' },
    { key: 'subject', label: 'Subject' },
    { key: 'gradeLevel', label: 'Grade Level' },
    { key: 'durationWeeks', label: 'Duration' },
    { key: 'essentialQuestions', label: 'Essential Questions' },
    { key: 'learningObjectives', label: 'Learning Objectives' },
    { key: 'assessmentsFormative', label: 'Formative Assessments' },
    { key: 'assessmentsSummative', label: 'Summative Assessments' },
    { key: 'pacingCalendar', label: 'Pacing Calendar' },
    { key: 'activities', label: 'Activities' },
    { key: 'materials', label: 'Materials' }
  ];
  
  const missingFields = requiredFields.filter(({ key }) => {
    const value = formData[key as keyof UnitPlanFormData];
    return !value || (typeof value === 'string' && value.trim() === '');
  });

  if (missingFields.length > 0) {
    const fieldNames = missingFields.map(f => f.label).join(', ');
    alert(`Please fill in all required fields: ${fieldNames}`);
    return;
  }

  // Validation des standards
  if (selectedStandards.length === 0) {
    alert("Please add at least one NY State Standard");
    return;
  }

  // Matching des classes
  const selectedClass = classes.find((cls) => {
    const formSubject = formData.subject?.trim().toLowerCase();
    const formGrade = formData.gradeLevel?.replace(/Class\s*/i, "").trim();
    
    const classSubject = cls.subject.trim().toLowerCase();
    const classGrade = cls.grade.trim();
    
    return classSubject === formSubject && classGrade === formGrade;
  });

  if (!selectedClass?.id) {
    alert("No matching class found for this subject and grade.");
    return;
  }

  try {
    setIsLoading(true);

    //  CORRECTION: Payload direct sans transformation complexe
    const payload = {
      title: formData.title,
      course: Number(selectedClass.id),
      scope_sequence: formData.scopeSequenceId ? Number(formData.scopeSequenceId) : null,
      duration_weeks: Number(formData.durationWeeks) || 1,
      start_date: formData.startDate || null,
      end_date: formData.endDate || null,
      big_idea: formData.bigIdea || "",
      essential_questions: formData.essentialQuestions,
      standards: selectedStandards.join(", "),
      learning_objectives: formData.learningObjectives,
      assessments_formative: formData.assessmentsFormative,
      assessments_summative: formData.assessmentsSummative,
      activities: formData.activities,
      materials: formData.materials,
      pacing_calendar: formData.pacingCalendar,
      differentiation_strategies: formData.differentiationStrategies || ""
    };

    console.log("📤 [handleSubmit] Sending payload to service:", payload);

    //  CORRECTION: Appel direct sans "as any"
    const result = initialData?.id
      ? await UnitPlanService.update(tenantPrimaryDomain, accessToken, initialData.id, payload)
      : await UnitPlanService.create(tenantPrimaryDomain, accessToken, payload);

    console.log(" Unit Plan saved:", result);

    onSubmitSuccess?.(result) ?? router.push("/teacher/plan/unit-plans");
  } catch (error: any) {
    console.error("Error saving unit plan:", error);
    
    if (error.response?.data) {
      console.error("Error details:", error.response.data);
      alert(`Error: ${JSON.stringify(error.response.data)}`);
    } else {
      alert(`Error: ${error.message || "Unknown error"}`);
    }
  } finally {
    setIsLoading(false);
  }
};

// Ajoutez cet useEffect pour debugger le matching en temps réel
// Ajoutez ce useEffect pour voir l'état de formData en temps réel
useEffect(() => {
  console.log("🔄 FormData updated:", {
    title: formData.title,
    subject: formData.subject,
    gradeLevel: formData.gradeLevel,
    durationWeeks: formData.durationWeeks,
    essentialQuestions: formData.essentialQuestions,
    learningObjectives: formData.learningObjectives,
    assessmentsFormative: formData.assessmentsFormative,
    assessmentsSummative: formData.assessmentsSummative,
    pacingCalendar: formData.pacingCalendar,
    activities: formData.activities,
    materials: formData.materials
  });
}, [formData]);

  const selectedScopeSequence = availableScopeSequences.find(
    (s) => s.id === formData.scopeSequenceId
  );

  const filteredStandards = formData.subject
    ? (
        NY_STANDARDS[
          formData.subject.toUpperCase() as keyof typeof NY_STANDARDS
        ] || []
      ).filter((standard) => standard.trim() !== "")
    : Object.values(NY_STANDARDS)
        .flat()
        .filter((standard) => standard.trim() !== "");

  return (
    <form onSubmit={handleSubmit}>
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader className="bg-yellow-50 border-b">
          <CardTitle className="font-headline flex items-center gap-2">
            <BookOpen className="h-6 w-6" />
            {initialData ? "Edit Unit Plan" : "Create Unit Plan"}
          </CardTitle>
          <CardDescription>
            Design comprehensive units with detailed standards, assessments, and activities
          </CardDescription>
        </CardHeader>
        
        <CardContent className="p-6 space-y-8">
          {/* Section 1: Informations de base */}
          <section>
            <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
              <Target className="h-5 w-5" />
              Unit Overview
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
              <div className="space-y-2">
                <Label htmlFor="title">Unit Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => updateField('title', e.target.value)}
                  placeholder="Introduction to Algebra"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="scopeSequence">Link to Scope & Sequence</Label>
                <Select
                  value={formData.scopeSequenceId ? formData.scopeSequenceId.toString() : undefined}
                  onValueChange={(value) => updateField('scopeSequenceId', value ? Number(value) : undefined)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select scope & sequence" />
                  </SelectTrigger>
                  
                <SelectContent>
                  {availableScopeSequences
                    .filter(scope => scope.id != null && scope.title)
                    .map((scope) => (
                      <SelectItem key={scope.id} value={scope.id.toString()}>
                        {scope.title} - {scope.grade}
                      </SelectItem>
                  ))}
                </SelectContent>

                </Select>


                {selectedScopeSequence && (
                  <p className="text-sm text-green-600 flex items-center gap-1">
                    <LinkIcon className="h-3 w-3" />
                    Linked to: {selectedScopeSequence.title}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="subject">Subject *</Label>
                <Select
                  value={formData.subject || undefined}
                  onValueChange={(value) => updateField('subject', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {SUBJECTS.map((subject) => (
                      <SelectItem key={subject} value={subject}>
                        {subject}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

              </div>

<div className="space-y-2">
  <Label htmlFor="gradeLevel">Grade Level *</Label>
  <Select
    value={formData.gradeLevel || undefined}
    onValueChange={(value) => updateField('gradeLevel', value)}
  >
    <SelectTrigger>
      <SelectValue placeholder="Select grade" />
    </SelectTrigger>
    <SelectContent>
      {[...new Set(classes.map(c => c.grade).filter(g => g && g.trim() !== ""))].map((grade) => (
        <SelectItem key={grade} value={grade}>
          Class {grade} {/*  Affichez "Class 5", "Class 6" etc. */}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
</div>

              <div className="space-y-2">
                <Label htmlFor="duration">Duration (weeks) *</Label>
                <Input
                  type="number"
                  id="duration"
                  value={formData.durationWeeks || undefined}
                  onChange={(e) => updateField('durationWeeks', parseInt(e.target.value) || 1)}
                  min="1"
                  max="12"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  type="date"
                  id="startDate"
                  value={formData.startDate || ''}
                  onChange={(e) => updateField('startDate', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  type="date"
                  id="endDate"
                  value={formData.endDate || ''}
                  onChange={(e) => updateField('endDate', e.target.value)}
                />
              </div>
            </div>
          </section>


          <section>
            <h3 className="text-lg font-semibold mb-4">Standards & Objectives</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>NY State Standards *</Label>
                <div className="space-y-3">
                  <Select onValueChange={handleAddStandard}>
                    <SelectTrigger>
                      <SelectValue placeholder="Add standards..." />
                    </SelectTrigger>
                    <SelectContent>
                      {filteredStandards
                        .filter(s => s && s.trim() !== "")
                        .map(standard => (
                          <SelectItem key={standard} value={standard}>
                            {standard}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  
                  <div className="flex flex-wrap gap-2">
                    {selectedStandards.map(standard => (
                      <Badge key={standard} variant="secondary" className="flex items-center gap-1">
                        {standard}
                        <button
                          type="button"
                          onClick={() => handleRemoveStandard(standard)}
                          className="ml-1 hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                    {selectedStandards.length === 0 && (
                      <p className="text-sm text-muted-foreground">No standards selected</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bigIdea">Big Idea / Central Theme</Label>
                <Input
                  id="bigIdea"
                  value={formData.bigIdea || ''}
                  onChange={(e) => updateField('bigIdea', e.target.value)}
                  placeholder="Algebra as a language for describing patterns and relationships"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="essentialQuestions">
                  Essential Questions <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="essentialQuestions"
                  value={formData.essentialQuestions} //  Pas de fallback empty string
                  onChange={(e) => updateField('essentialQuestions', e.target.value)}
                  placeholder="How can we use algebra to solve real-world problems?..."
                  rows={3}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="learningObjectives">
                  Learning Objectives <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="learningObjectives"
                  value={formData.learningObjectives} //  Pas de fallback empty string
                  onChange={(e) => updateField('learningObjectives', e.target.value)}
                  placeholder="Students will be able to..."
                  rows={4}
                  required
                />
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-4">Activities & Resources</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="activities">
                  Key Activities & Strategies <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="activities"
                  value={formData.activities} //  Pas de fallback empty string
                  onChange={(e) => updateField('activities', e.target.value)}
                  placeholder="Direct instruction on solving equations, collaborative problem-solving activities, real-world application projects, technology integration with graphing calculators..."
                  rows={5}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="materials">
                  Materials & Resources <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="materials"
                  value={formData.materials} //  Pas de fallback empty string
                  onChange={(e) => updateField('materials', e.target.value)}
                  placeholder="Textbook Chapter 3, worksheets, graphing calculators, online algebra tools, manipulatives for visual learners..."
                  rows={4}
                  required
                />
              </div>
            </div>
          </section>


          <section>
            <h3 className="text-lg font-semibold mb-4">Assessments</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="formativeAssessments">
                  Formative Assessments <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="formativeAssessments"
                  value={formData.assessmentsFormative} //  Pas de fallback empty string
                  onChange={(e) => updateField('assessmentsFormative', e.target.value)}
                  placeholder="Exit tickets, class discussions, homework assignments, quick checks for understanding..."
                  rows={4}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="summativeAssessments">
                  Summative Assessments <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="summativeAssessments"
                  value={formData.assessmentsSummative} //  Pas de fallback empty string
                  onChange={(e) => updateField('assessmentsSummative', e.target.value)}
                  placeholder="Unit test, final project, presentation, portfolio assessment..."
                  rows={4}
                  required
                />
              </div>
            </div>
          </section>


          <section>
            <h3 className="text-lg font-semibold mb-4">Pacing & Differentiation</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="pacingCalendar">
                  Pacing Calendar <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="pacingCalendar"
                  value={formData.pacingCalendar} //  Pas de fallback empty string
                  onChange={(e) => updateField('pacingCalendar', e.target.value)}
                  placeholder="Week 1: Introduction to variables and expressions, Week 2: Solving one-step equations, Week 3: Graphing linear equations, Week 4: Real-world applications and review..."
                  rows={4}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="differentiation">Differentiation Strategies</Label>
                <Textarea
                  id="differentiation"
                  value={formData.differentiationStrategies || ''}
                  onChange={(e) => updateField('differentiationStrategies', e.target.value)}
                  placeholder="Scaffolded worksheets for struggling learners, extension activities for advanced students, visual aids for ELL students, modified assessments for SPED..."
                  rows={4}
                />
              </div>
            </div>
          </section>

          {/* Boutons de soumission avec style cohérent */}
          <div className="flex justify-end gap-4 pt-6 border-t">
            <Button 
              variant="outline" 
              type="button"
              onClick={() => router.back()}
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
            <Button 
              type="submit"
              className="bg-[#3e81d4] hover:bg-[#2e71c4] text-white"
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : (initialData ? "Update Unit Plan" : "Create Unit Plan")}
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
