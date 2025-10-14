"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Calendar, BookOpen, Edit, Trash2, Clock, Target, Link as LinkIcon } from 'lucide-react';
import { UnitPlanService } from '@/services/plan-service';
import { localStorageKey } from '@/constants/global';
import type { UnitPlan } from '@/lib/types';

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

  useEffect(() => {
    const fetchUnitPlan = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await UnitPlanService.get(tenantPrimaryDomain, accessToken, id);
        setUnitPlan(data);
      } catch (err: any) {
        console.error("❌ Error loading unit plan:", err);
        setError(err.message || "Failed to load unit plan");
      } finally {
        setIsLoading(false);
      }
    };

    if (id && accessToken && tenantPrimaryDomain) {
      fetchUnitPlan();
    }
  }, [id, accessToken, tenantPrimaryDomain]);

  const handleBack = () => {
    router.push('/teacher/plan/unit-plans');
  };

  const handleEdit = () => {
    if (unitPlan) {
      router.push(`/teacher/plan/unit-plans/${unitPlan.id}/edit`);
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
          <Button
            variant="outline"
            onClick={handleBack}
            className="bg-white/20 hover:bg-white/30 text-white border-white"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
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
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleEdit}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <Button variant="outline" className="text-red-600 hover:text-red-700 hover:bg-red-50">
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      {/* Titre et description */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{unitPlan.title}</CardTitle>
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
                <p className="text-muted-foreground">{unitPlan.big_idea}</p>
              </div>
            )}
            {unitPlan.essential_questions && (
              <div>
                <h4 className="font-medium mb-2">Essential Questions</h4>
                <p className="text-muted-foreground whitespace-pre-wrap">{unitPlan.essential_questions}</p>
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
                unitPlan.standards.split(', ').map((standard, index) => (
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
            <p className="text-muted-foreground whitespace-pre-wrap">
              {unitPlan.learning_objectives || "No learning objectives specified"}
            </p>
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
            <p className="text-muted-foreground whitespace-pre-wrap">
              {unitPlan.activities || "No activities specified"}
            </p>
          </CardContent>
        </Card>

        {/* Materials */}
        <Card>
          <CardHeader>
            <CardTitle>Materials & Resources</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground whitespace-pre-wrap">
              {unitPlan.materials || "No materials specified"}
            </p>
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
              <p className="text-muted-foreground whitespace-pre-wrap">
                {unitPlan.assessments_formative || "No formative assessments specified"}
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Summative Assessments</h4>
              <p className="text-muted-foreground whitespace-pre-wrap">
                {unitPlan.assessments_summative || "No summative assessments specified"}
              </p>
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
            <p className="text-muted-foreground whitespace-pre-wrap">{unitPlan.pacing_calendar}</p>
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
            <p className="text-muted-foreground whitespace-pre-wrap">{unitPlan.differentiation_strategies}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}