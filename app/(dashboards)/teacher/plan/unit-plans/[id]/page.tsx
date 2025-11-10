"use client";
import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Calendar, BookOpen, Edit, Trash2, Clock, Target, Link as LinkIcon } from 'lucide-react';
import { UnitPlanService } from '@/services/plan-service';
import { localStorageKey } from '@/constants/global';
import type { UnitPlan } from '@/lib/types';
import { RichTextEditor } from '@/components/RichTextEditor';

export default function UnitPlanDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const accessToken: any = typeof window !== 'undefined' ? localStorage.getItem(localStorageKey.ACCESS_TOKEN) : null;
  const tenantData: any = typeof window !== 'undefined' ? localStorage.getItem(localStorageKey.TENANT_DATA) : null;
  const { primary_domain } = tenantData ? JSON.parse(tenantData) : { primary_domain: '' };
  const tenantPrimaryDomain = `https://${primary_domain}`;

  const [unitPlan, setUnitPlan] = useState<UnitPlan | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchUnitPlan = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await UnitPlanService.get(tenantPrimaryDomain, accessToken, id);
        setUnitPlan(data);
      } catch (err: any) {
        console.error("Error loading unit plan:", err);
        setError(err.message || "Failed to load unit plan");
      } finally {
        setIsLoading(false);
      }
    };
    if (id && accessToken && tenantPrimaryDomain) {
      fetchUnitPlan();
    }
  }, [id, accessToken, tenantPrimaryDomain]);

  // Handlers avec useCallback pour éviter les re-renders infinis
  const handleBigIdeaChange = useCallback((value: string) => {
    setUnitPlan(prev => prev ? {...prev, big_idea: value} : null);
  }, []);

  const handleEssentialQuestionsChange = useCallback((value: string) => {
    setUnitPlan(prev => prev ? {...prev, essential_questions: value} : null);
  }, []);

  const handleLearningObjectivesChange = useCallback((value: string) => {
    setUnitPlan(prev => prev ? {...prev, learning_objectives: value} : null);
  }, []);

  const handleActivitiesChange = useCallback((value: string) => {
    setUnitPlan(prev => prev ? {...prev, activities: value} : null);
  }, []);

  const handleMaterialsChange = useCallback((value: string) => {
    setUnitPlan(prev => prev ? {...prev, materials: value} : null);
  }, []);

  const handleFormativeAssessmentsChange = useCallback((value: string) => {
    setUnitPlan(prev => prev ? {...prev, assessments_formative: value} : null);
  }, []);

  const handleSummativeAssessmentsChange = useCallback((value: string) => {
    setUnitPlan(prev => prev ? {...prev, assessments_summative: value} : null);
  }, []);

  const handlePacingCalendarChange = useCallback((value: string) => {
    setUnitPlan(prev => prev ? {...prev, pacing_calendar: value} : null);
  }, []);

  const handleDifferentiationChange = useCallback((value: string) => {
    setUnitPlan(prev => prev ? {...prev, differentiation_strategies: value} : null);
  }, []);

  const handleTitleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setUnitPlan(prev => prev ? {...prev, title: e.target.value} : null);
  }, []);

  const handleBack = () => {
    router.push('/teacher/plan/unit-plans');
  };

  const handleSave = async () => {
    try {
      if (!unitPlan) return;
      await UnitPlanService.update(tenantPrimaryDomain, accessToken, unitPlan.id, unitPlan);
      setIsEditing(false);
    } catch (err: any) {
      console.error("Error saving unit plan:", err);
      setError(err.message || "Failed to save unit plan");
    }
  };

  if (isLoading) {
    return (
      <div className="w-full space-y-8">
        <header className="bg-[#3e81d4] px-4 py-3 rounded-md">
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-bold font-headline text-white">Unit Plan Details</h1>
          </div>
        </header>
        <div className="text-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3e81d4] mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading unit plan details...</p>
        </div>
      </div>
    );
  }

  if (error || !unitPlan) {
    return (
      <div className="w-full space-y-8">
        <header className="bg-[#3e81d4] px-4 py-3 rounded-md">
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-bold font-headline text-white">Unit Plan Details</h1>
          </div>
        </header>
        <div className="text-center py-20">
          <BookOpen className="mx-auto h-12 w-12 text-red-500" />
          <h3 className="mt-2 text-sm font-medium text-red-600">Error loading unit plan</h3>
          <p className="mt-1 text-sm text-red-500">{error || "Unit plan not found"}</p>
          <Button onClick={handleBack} className="mt-4" variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to List
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-8">
      {/* Header */}
      <header className="bg-[#3e81d4] px-4 py-3 rounded-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-bold font-headline text-white">Unit Plan Details</h1>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleBack}
              className="bg-white/20 hover:bg-white/30 text-white border-white"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            {!isEditing ? (
              <Button variant="outline" onClick={() => setIsEditing(true)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Button>
            ) : (
              <Button variant="outline" onClick={handleSave}>
                Save
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Actions et métadonnées */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Badge variant="secondary" className="text-sm">
            {unitPlan.subject_name}
          </Badge>
          <Badge variant="outline" className="text-sm">
            {unitPlan.grade}
          </Badge>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>{unitPlan.duration_weeks} weeks</span>
          </div>
        </div>
      </div>

      {/* Titre et description */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">
            {isEditing ? (
              <input
                type="text"
                value={unitPlan.title}
                onChange={handleTitleChange}
                className="text-2xl font-bold w-full p-2 border rounded"
              />
            ) : (
              unitPlan.title
            )}
          </CardTitle>
          {unitPlan.scope_sequence_title && (
            <CardDescription className="flex items-center gap-2">
              <LinkIcon className="h-4 w-4" />
              Linked to Scope & Sequence: {unitPlan.scope_sequence_title}
            </CardDescription>
          )}
        </CardHeader>
      </Card>

      {/* Big Idea et Essential Questions */}
      {(unitPlan.big_idea || unitPlan.essential_questions) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Central Concepts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {unitPlan.big_idea && (
              <div>
                <h4 className="font-medium mb-2">Big Idea</h4>
                {isEditing ? (
                  <RichTextEditor
                    value={unitPlan.big_idea}
                    onChange={handleBigIdeaChange}
                    placeholder="Describe the big idea..."
                  />
                ) : (
                  <div dangerouslySetInnerHTML={{ __html: unitPlan.big_idea }} />
                )}
              </div>
            )}
            {unitPlan.essential_questions && (
              <div>
                <h4 className="font-medium mb-2">Essential Questions</h4>
                {isEditing ? (
                  <RichTextEditor
                    value={unitPlan.essential_questions}
                    onChange={handleEssentialQuestionsChange}
                    placeholder="List the essential questions..."
                  />
                ) : (
                  <div dangerouslySetInnerHTML={{ __html: unitPlan.essential_questions }} />
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Standards et Objectifs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Standards */}
        <Card>
          <CardHeader>
            <CardTitle>Standards</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {unitPlan.standards ? (
                unitPlan.standards.split(', ').map((standard: string, index: number) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {standard}
                  </Badge>
                ))
              ) : (
                <p className="text-muted-foreground">No standards specified</p>
              )}
            </div>
          </CardContent>
        </Card>
        {/* Learning Objectives */}
        <Card>
          <CardHeader>
            <CardTitle>Learning Objectives</CardTitle>
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <RichTextEditor
                value={unitPlan.learning_objectives || ""}
                onChange={handleLearningObjectivesChange}
                placeholder="List the learning objectives..."
              />
            ) : (
              <div dangerouslySetInnerHTML={{ __html: unitPlan.learning_objectives || "No learning objectives specified" }} />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Activités et Ressources */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Activities */}
        <Card>
          <CardHeader>
            <CardTitle>Activities & Strategies</CardTitle>
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <RichTextEditor
                value={unitPlan.activities || ""}
                onChange={handleActivitiesChange}
                placeholder="Describe the activities and strategies..."
              />
            ) : (
              <div dangerouslySetInnerHTML={{ __html: unitPlan.activities || "No activities specified" }} />
            )}
          </CardContent>
        </Card>
        {/* Materials */}
        <Card>
          <CardHeader>
            <CardTitle>Materials & Resources</CardTitle>
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <RichTextEditor
                value={unitPlan.materials || ""}
                onChange={handleMaterialsChange}
                placeholder="List the materials and resources..."
              />
            ) : (
              <div dangerouslySetInnerHTML={{ __html: unitPlan.materials || "No materials specified" }} />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Évaluations */}
      <Card>
        <CardHeader>
          <CardTitle>Assessments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-2">Formative Assessments</h4>
              {isEditing ? (
                <RichTextEditor
                  value={unitPlan.assessments_formative || ""}
                  onChange={handleFormativeAssessmentsChange}
                  placeholder="Describe the formative assessments..."
                />
              ) : (
                <div dangerouslySetInnerHTML={{ __html: unitPlan.assessments_formative || "No formative assessments specified" }} />
              )}
            </div>
            <div>
              <h4 className="font-medium mb-2">Summative Assessments</h4>
              {isEditing ? (
                <RichTextEditor
                  value={unitPlan.assessments_summative || ""}
                  onChange={handleSummativeAssessmentsChange}
                  placeholder="Describe the summative assessments..."
                />
              ) : (
                <div dangerouslySetInnerHTML={{ __html: unitPlan.assessments_summative || "No summative assessments specified" }} />
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pacing Calendar */}
      {unitPlan.pacing_calendar && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Pacing Calendar
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <RichTextEditor
                value={unitPlan.pacing_calendar}
                onChange={handlePacingCalendarChange}
                placeholder="Describe the pacing calendar..."
              />
            ) : (
              <div dangerouslySetInnerHTML={{ __html: unitPlan.pacing_calendar }} />
            )}
          </CardContent>
        </Card>
      )}

      {/* Differentiation */}
      {unitPlan.differentiation_strategies && (
        <Card>
          <CardHeader>
            <CardTitle>Differentiation Strategies</CardTitle>
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <RichTextEditor
                value={unitPlan.differentiation_strategies}
                onChange={handleDifferentiationChange}
                placeholder="Describe the differentiation strategies..."
              />
            ) : (
              <div dangerouslySetInnerHTML={{ __html: unitPlan.differentiation_strategies }} />
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}