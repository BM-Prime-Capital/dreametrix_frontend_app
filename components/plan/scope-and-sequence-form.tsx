"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, Calendar, BookOpen } from "lucide-react";
import { GRADE_LEVELS, NY_STANDARDS, ScopeAndSequenceFormData, ScopeAndSequenceFormProps, ScopeSequenceEntry, SUBJECTS } from "@/lib/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ClassService, ScopeAndSequenceService } from "@/services/plan-service";
import { localStorageKey } from "@/constants/global";

export function ScopeAndSequenceForm({ initialData, onSubmitSuccess }: ScopeAndSequenceFormProps) {
  const accessToken: any = localStorage.getItem(localStorageKey.ACCESS_TOKEN);
  const refreshToken: any = localStorage.getItem(localStorageKey.REFRESH_TOKEN);
  const tenantData: any = localStorage.getItem(localStorageKey.TENANT_DATA);
  const { primary_domain } = JSON.parse(tenantData);
  const tenantPrimaryDomain = `https://${primary_domain}`;
  
  const [academicYear, setAcademicYear] = useState(initialData?.academicYear || "");
  const [subject, setSubject] = useState(initialData?.subject || "");
  const [gradeLevel, setGradeLevel] = useState(initialData?.gradeLevel || "");
  const [overview, setOverview] = useState(initialData?.overview || "");

  const [classes, setClasses] = useState<
    { id: number; subject: string; grade: string }[]
  >([]);
  const [isLoadingSubjects, setIsLoadingSubjects] = useState(false);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        setIsLoadingSubjects(true);
        const data = await ClassService.list(tenantPrimaryDomain, accessToken);
        setClasses(data);
      } catch (err) {
        console.error("Error loading subjects:", err);
      } finally {
        setIsLoadingSubjects(false);
      }
    };
    fetchSubjects();
  }, [tenantPrimaryDomain, accessToken]);

  const [entries, setEntries] = useState<ScopeSequenceEntry[]>(
    initialData?.entries || [
      {
        id: '1',
        month: '',
        topic: '',
        standard_code: '',
        learning_objective: '',
        essential_questions: '',
        vocabulary: '',
        resources: '',
        formative_assessments: '',
        summative_assessments: '',
        duration_weeks: 2
      }
    ]
  );

  const addEntry = () => {
    setEntries([...entries, {
      id: Date.now().toString(),
      month: '',
      topic: '',
      standard_code: '',
      learning_objective: '',
      essential_questions: '',
      vocabulary: '',
      resources: '',
      formative_assessments: '',
      summative_assessments: '',
      duration_weeks: 2
    }]);
  };

  const removeEntry = (id: string) => {
    setEntries(entries.filter(entry => entry.id !== id));
  };

  const updateEntry = (id: string, field: keyof ScopeSequenceEntry, value: string | number) => {
    setEntries(entries.map(entry => 
      entry.id === id ? { ...entry, [field]: value } : entry
    ));
  };

  const handleSubmit = async () => {
    //Trouver l'ID de la classe correspondante
    const selectedClass = classes.find(cls => 
      cls.subject === subject && cls.grade === gradeLevel
    );

    if (!selectedClass) {
      alert("Please select a valid subject and grade level combination");
      return;
    }

    //Valider que tous les champs requis sont remplis
    const hasEmptyRequiredFields = entries.some(entry => 
      !entry.standard_code?.trim() || 
      !entry.learning_objective?.trim() || 
      !entry.formative_assessments?.trim() || 
      !entry.summative_assessments?.trim()
    );

    if (hasEmptyRequiredFields) {
      alert("Please fill all required fields in all units (Standards, Learning Objectives, Formative and Summative Assessments)");
      return;
    }

    //Construire le payload avec les noms corrects (snake_case)
    const payload = {
      academic_year: academicYear,
      course: selectedClass.id,
      grade_level: gradeLevel,
      overview: overview,
      title: `${subject} - ${gradeLevel} - ${academicYear}`,
      entries: entries.map(e => ({
        month: e.month,
        topic: e.topic,
        standard_code: e.standard_code,
        learning_objective: e.learning_objective,
        essential_questions: e.essential_questions,
        vocabulary: e.vocabulary,
        resources: e.resources,
        formative_assessments: e.formative_assessments,
        summative_assessments: e.summative_assessments,
        duration_weeks: e.duration_weeks,
      })),
    };

    console.log("Sending payload:", payload);

    try {
      const result = await ScopeAndSequenceService.create(
        tenantPrimaryDomain,
        accessToken,
        payload as any
      );
      console.log("Scope & Sequence created:", result);
      if (onSubmitSuccess) onSubmitSuccess(result);
    } catch (error: any) {
      console.error("Error submitting Scope & Sequence:", error);
      alert(`Error: ${error.message || "Unknown error"}`);
    }
  };

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader className="bg-blue-50 border-b">
        <CardTitle className="font-headline flex items-center gap-2">
          <Calendar className="h-6 w-6" />
          Scope & Sequence Planner
        </CardTitle>
        <CardDescription>
          Plan your academic year with NY State Standards alignment
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        {/* En-tête du formulaire */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Academic Year */}
          <div className="space-y-2">
            <Label htmlFor="academicYear">Academic Year</Label>
            <Input 
              id="academicYear" 
              placeholder="2024-2025" 
              value={academicYear}
              onChange={(e) => setAcademicYear(e.target.value)}
            />
          </div>

          {/* Subject */}
          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Select
              value={subject}
              onValueChange={(value) => {
                setSubject(value);
                // auto-sélection du grade correspondant
                const cls = classes.find((c) => c.subject === value);
                if (cls) setGradeLevel(cls.grade);
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder={isLoadingSubjects ? "Loading subjects..." : "Select subject"} />
              </SelectTrigger>
              <SelectContent>
                {isLoadingSubjects ? (
                  <div className="p-2 text-sm text-muted-foreground">Loading subjects...</div>
                ) : (
                  [...new Set(classes.map((c) => c.grade))].map((gradeGroup) => (
                    <div key={gradeGroup}>
                      <div className="px-3 py-1 text-xs font-semibold text-muted-foreground uppercase">
                        {gradeGroup}
                      </div>
                      {classes
                        .filter((c) => c.grade === gradeGroup)
                        .map((c) => (
                          <SelectItem key={c.id} value={c.subject}>
                            {c.subject}
                          </SelectItem>
                        ))}
                    </div>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Grade Level */}
          <div className="space-y-2">
            <Label htmlFor="gradeLevel">Grade Level</Label>
            <Select
              value={gradeLevel}
              onValueChange={setGradeLevel}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select grade" />
              </SelectTrigger>
              <SelectContent>
                {[...new Set(classes.map((c) => c.grade))].map((grade) => (
                  <SelectItem key={grade} value={grade}>
                    {grade}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Overview */}
        <div className="mb-8">
          <Label htmlFor="overview">Year Overview</Label>
          <Textarea
            id="overview"
            placeholder="Describe the overall curriculum trajectory for the academic year..."
            value={overview}
            onChange={(e) => setOverview(e.target.value)}
            rows={3}
            className="mt-2"
          />
        </div>

        {/* Entrées par unité */}
        <div className="space-y-6">
          {entries.map((entry, index) => (
            <Card key={entry.id} className="border-l-4 border-l-blue-500">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    Unit {index + 1}
                  </h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeEntry(entry.id)}
                    disabled={entries.length === 1}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                  <div className="space-y-2">
                    <Label>Month/Term</Label>
                    <Input
                      value={entry.month}
                      onChange={(e) => updateEntry(entry.id, 'month', e.target.value)}
                      placeholder="September-October"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Duration (weeks)</Label>
                    <Input
                      type="number"
                      value={entry.duration_weeks}
                      onChange={(e) => updateEntry(entry.id, 'duration_weeks', parseInt(e.target.value) || 1)}
                      min="1"
                      max="12"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Unit Topic</Label>
                    <Input
                      value={entry.topic}
                      onChange={(e) => updateEntry(entry.id, 'topic', e.target.value)}
                      placeholder="Ratios and Proportional Relationships"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>NY State Standards *</Label>
                    <Select
                      value={entry.standard_code}
                      onValueChange={(value) => updateEntry(entry.id, 'standard_code', value)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select standard" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(NY_STANDARDS).map(([subjectKey, standards]) =>
                          standards.map((standard) => (
                            <SelectItem key={standard} value={standard}>
                              {standard}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Learning Objectives *</Label>
                    <Textarea
                      value={entry.learning_objective}
                      onChange={(e) => updateEntry(entry.id, 'learning_objective', e.target.value)}
                      placeholder="Students will be able to understand ratio concepts and use ratio language..."
                      rows={2}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Essential Questions</Label>
                    <Textarea
                      value={entry.essential_questions}
                      onChange={(e) => updateEntry(entry.id, 'essential_questions', e.target.value)}
                      placeholder="How can ratios help us understand relationships between quantities?"
                      rows={2}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Vocabulary</Label>
                    <Textarea
                      value={entry.vocabulary}
                      onChange={(e) => updateEntry(entry.id, 'vocabulary', e.target.value)}
                      placeholder="ratio, proportion, equivalent ratios, unit rate"
                      rows={2}
                    />
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Formative Assessments *</Label>
                      <Textarea
                        value={entry.formative_assessments}
                        onChange={(e) => updateEntry(entry.id, 'formative_assessments', e.target.value)}
                        placeholder="Exit tickets, class discussions, homework assignments"
                        rows={3}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Summative Assessments *</Label>
                      <Textarea
                        value={entry.summative_assessments}
                        onChange={(e) => updateEntry(entry.id, 'summative_assessments', e.target.value)}
                        placeholder="Unit test, project, presentation"
                        rows={3}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Resources & Materials</Label>
                    <Textarea
                      value={entry.resources}
                      onChange={(e) => updateEntry(entry.id, 'resources', e.target.value)}
                      placeholder="Textbook Chapter 1, Khan Academy Ratios Module, manipulatives"
                      rows={2}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Button type="button" onClick={addEntry} className="w-full mt-4">
          <Plus className="h-4 w-4 mr-2" />
          Add Unit
        </Button>

        <div className="flex justify-end gap-4 mt-8 pt-6 border-t">
          <Button variant="outline" type="button">
            Save Draft
          </Button>
          <Button 
            className="bg-blue-600 hover:bg-blue-700"
            onClick={handleSubmit}
            type="button"
          >
            Create Scope & Sequence
          </Button>
        </div>

        <div className="mt-4 text-sm text-muted-foreground">
          * Required fields
        </div>
      </CardContent>
    </Card>
  );
}