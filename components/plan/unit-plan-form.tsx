"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, BookOpen, Target, Calendar, Link as LinkIcon, X } from "lucide-react";
import { 
  GRADE_LEVELS, 
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
  const accessToken: any = typeof window !== 'undefined' ? localStorage.getItem(localStorageKey.ACCESS_TOKEN) : null;
  const tenantData: any = typeof window !== 'undefined' ? localStorage.getItem(localStorageKey.TENANT_DATA) : null;
  const { primary_domain } = tenantData ? JSON.parse(tenantData) : { primary_domain: '' };
  const tenantPrimaryDomain = `https://${primary_domain}`;

  const [classes, setClasses] = useState<{ id: number; subject: string; grade: string }[]>([]);
  const [availableScopeSequences, setAvailableScopeSequences] = useState<ScopeAndSequence[]>(scopeSequences);
  const [isLoading, setIsLoading] = useState(false);

  // Initialiser avec des valeurs par défaut appropriées
  const [formData, setFormData] = useState<UnitPlanFormData>(() => {
    const data = convertUnitPlanToFormData(initialData);
    return {
      ...data,
      subject: data.subject || undefined,
      gradeLevel: data.gradeLevel || undefined,
      scopeSequenceId: data.scopeSequenceId || undefined,
    };
  });

  const [selectedStandards, setSelectedStandards] = useState<string[]>(
    formData.standards || []
  );

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

  const updateField = (field: keyof UnitPlanFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddStandard = (standard: string) => {
    if (standard && !selectedStandards.includes(standard)) {
      const newStandards = [...selectedStandards, standard];
      setSelectedStandards(newStandards);
      updateField('standards', newStandards);
    }
  };

  const handleRemoveStandard = (standard: string) => {
    const newStandards = selectedStandards.filter(s => s !== standard);
    setSelectedStandards(newStandards);
    updateField('standards', newStandards);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.title || !formData.subject || !formData.gradeLevel) {
      alert("Please fill in all required fields");
      return;
    }

    // Trouver l'ID de la classe correspondante
    const selectedClass = classes.find(cls => 
      cls.subject === formData.subject && cls.grade === formData.gradeLevel
    );

    if (!selectedClass) {
      alert("Please select a valid subject and grade level combination");
      return;
    }

    try {
      setIsLoading(true);

      // Préparer les données pour l'API (conversion camelCase → snake_case)
      const payload = {
        title: formData.title,
        course: selectedClass.id,
        scope_sequence: formData.scopeSequenceId || null,
        duration_weeks: formData.durationWeeks,
        start_date: formData.startDate || null,
        end_date: formData.endDate || null,
        big_idea: formData.bigIdea || "",
        essential_questions: formData.essentialQuestions,
        standards: selectedStandards.join(', '),
        learning_objectives: formData.learningObjectives,
        assessments_formative: formData.assessmentsFormative,
        assessments_summative: formData.assessmentsSummative,
        activities: formData.activities,
        materials: formData.materials,
        pacing_calendar: formData.pacingCalendar,
        differentiation_strategies: formData.differentiationStrategies || "",
      };

      console.log("Sending unit plan payload:", payload);

      let result;
      if (initialData?.id) {
        // Mise à jour
        result = await UnitPlanService.update(
          tenantPrimaryDomain,
          accessToken,
          initialData.id,
          payload as any
        );
      } else {
        // Création
        result = await UnitPlanService.create(
          tenantPrimaryDomain,
          accessToken,
          payload as any
        );
      }

      console.log("Unit Plan saved:", result);
      
      if (onSubmitSuccess) {
        onSubmitSuccess(result);
      } else {
        // Redirection par défaut
        router.push('/teacher/plan/unit-plans');
      }
    } catch (error: any) {
      console.error("Error saving unit plan:", error);
      alert(`Error: ${error.message || "Unknown error"}`);
    } finally {
      setIsLoading(false);
    }
  };

  const selectedScopeSequence = availableScopeSequences.find(s => s.id === formData.scopeSequenceId);

  // Filtrer les standards par sujet sélectionné
  const filteredStandards = formData.subject
    ? (NY_STANDARDS[formData.subject as keyof typeof NY_STANDARDS] || []).filter(standard => standard.trim() !== "")
    : Object.values(NY_STANDARDS).flat().filter(standard => standard.trim() !== "");

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
                      {grade}
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

          {/* Section 2: Standards et Objectifs */}
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
                <Label htmlFor="essentialQuestions">Essential Questions</Label>
                <Textarea
                  id="essentialQuestions"
                  value={formData.essentialQuestions || ''}
                  onChange={(e) => updateField('essentialQuestions', e.target.value)}
                  placeholder="How can we use algebra to solve real-world problems? What patterns can we find in mathematical relationships?"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="learningObjectives">Learning Objectives *</Label>
                <Textarea
                  id="learningObjectives"
                  value={formData.learningObjectives || ''}
                  onChange={(e) => updateField('learningObjectives', e.target.value)}
                  placeholder="Students will be able to solve linear equations, graph functions, and apply algebraic concepts to real-world problems..."
                  rows={4}
                  required
                />
              </div>
            </div>
          </section>

          {/* Section 3: Activités et Ressources */}
          <section>
            <h3 className="text-lg font-semibold mb-4">Activities & Resources</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="activities">Key Activities & Strategies *</Label>
                <Textarea
                  id="activities"
                  value={formData.activities || ''}
                  onChange={(e) => updateField('activities', e.target.value)}
                  placeholder="Direct instruction on solving equations, collaborative problem-solving activities, real-world application projects, technology integration with graphing calculators..."
                  rows={5}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="materials">Materials & Resources *</Label>
                <Textarea
                  id="materials"
                  value={formData.materials || ''}
                  onChange={(e) => updateField('materials', e.target.value)}
                  placeholder="Textbook Chapter 3, worksheets, graphing calculators, online algebra tools, manipulatives for visual learners..."
                  rows={4}
                  required
                />
              </div>
            </div>
          </section>

          {/* Section 4: Évaluations */}
          <section>
            <h3 className="text-lg font-semibold mb-4">Assessments</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="formativeAssessments">Formative Assessments</Label>
                <Textarea
                  id="formativeAssessments"
                  value={formData.assessmentsFormative || ''}
                  onChange={(e) => updateField('assessmentsFormative', e.target.value)}
                  placeholder="Exit tickets, class discussions, homework assignments, quick checks for understanding..."
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="summativeAssessments">Summative Assessments</Label>
                <Textarea
                  id="summativeAssessments"
                  value={formData.assessmentsSummative || ''}
                  onChange={(e) => updateField('assessmentsSummative', e.target.value)}
                  placeholder="Unit test, final project, presentation, portfolio assessment..."
                  rows={4}
                />
              </div>
            </div>
          </section>

          {/* Section 5: Calendrier et Différenciation */}
          <section>
            <h3 className="text-lg font-semibold mb-4">Pacing & Differentiation</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="pacingCalendar">Pacing Calendar</Label>
                <Textarea
                  id="pacingCalendar"
                  value={formData.pacingCalendar || ''}
                  onChange={(e) => updateField('pacingCalendar', e.target.value)}
                  placeholder="Week 1: Introduction to variables and expressions, Week 2: Solving one-step equations, Week 3: Graphing linear equations, Week 4: Real-world applications and review..."
                  rows={4}
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