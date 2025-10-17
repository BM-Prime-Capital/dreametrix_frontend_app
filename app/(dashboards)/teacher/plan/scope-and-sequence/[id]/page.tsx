"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Calendar, BookOpen, Edit, Trash2 } from 'lucide-react';
import { ScopeAndSequenceService } from '@/services/plan-service';
import { localStorageKey } from '@/constants/global';
import type { ScopeAndSequence, ScopeSequenceEntry } from '@/lib/types';
import PageTitleH1 from '@/components/ui/page-title-h1';

export default function ScopeAndSequenceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const accessToken: any = typeof window !== 'undefined' ? localStorage.getItem(localStorageKey.ACCESS_TOKEN) : null;
  const tenantData: any = typeof window !== 'undefined' ? localStorage.getItem(localStorageKey.TENANT_DATA) : null;
  const { primary_domain } = tenantData ? JSON.parse(tenantData) : { primary_domain: '' };
  const tenantPrimaryDomain = `https://${primary_domain}`;

  const [scopeAndSequence, setScopeAndSequence] = useState<ScopeAndSequence | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchScopeAndSequence = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Note: Vous devrez peut-être ajuster la méthode get() dans votre service
        // pour accepter un string au lieu d'un number
        const data = await ScopeAndSequenceService.get(tenantPrimaryDomain, accessToken, id as any);
        console.log("📋 Scope & Sequence details:", data);
        setScopeAndSequence(data);
      } catch (err: any) {
        console.error("Error loading scope & sequence:", err);
        setError(err.message || "Failed to load scope & sequence");
      } finally {
        setIsLoading(false);
      }
    };

    if (id && accessToken && tenantPrimaryDomain) {
      fetchScopeAndSequence();
    }
  }, [id, accessToken, tenantPrimaryDomain]);

  const handleBack = () => {
    router.push('/teacher/plan/scope-and-sequence');
  };

  const handleEdit = () => {
    if (scopeAndSequence) {
      router.push(`/teacher/plan/scope-and-sequence/${scopeAndSequence.id}/edit`);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full space-y-8">
        <header className="bg-[#3e81d4] px-4 py-3 rounded-md">
          <div className="flex items-center gap-4">
            <PageTitleH1 title="Scope & Sequence Details" className="text-white" />
          </div>
        </header>
        <div className="text-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3e81d4] mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading scope & sequence details...</p>
        </div>
      </div>
    );
  }

  if (error || !scopeAndSequence) {
    return (
      <div className="w-full space-y-8">
        <header className="bg-[#3e81d4] px-4 py-3 rounded-md">
          <div className="flex items-center gap-4">
            <PageTitleH1 title="Scope & Sequence Details" className="text-white" />
          </div>
        </header>
        <div className="text-center py-20">
          <BookOpen className="mx-auto h-12 w-12 text-red-500" />
          <h3 className="mt-2 text-sm font-medium text-red-600">Error loading scope & sequence</h3>
          <p className="mt-1 text-sm text-red-500">{error || "Scope & sequence not found"}</p>
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
            <PageTitleH1 title="Scope & Sequence Details" className="text-white" />
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

      {/* Actions */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Badge variant="secondary" className="text-sm">
            {scopeAndSequence.academic_year || scopeAndSequence.academicYear}
          </Badge>
          <Badge variant="outline" className="text-sm">
            {scopeAndSequence.subject_name || scopeAndSequence.subject}
          </Badge>
          <Badge variant="outline" className="text-sm">
            {scopeAndSequence.grade || scopeAndSequence.gradeLevel}
          </Badge>
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

      {/* Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground whitespace-pre-wrap">
            {scopeAndSequence.overview || "No overview provided."}
          </p>
        </CardContent>
      </Card>

      {/* Entries/Units */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Units & Timeline
          </CardTitle>
          <CardDescription>
            Monthly breakdown of topics, standards, and assessments
          </CardDescription>
        </CardHeader>
        <CardContent>
          {scopeAndSequence.entries && scopeAndSequence.entries.length > 0 ? (
            <div className="space-y-6">
              {scopeAndSequence.entries.map((entry: ScopeSequenceEntry, index: number) => (
                <Card key={entry.id} className="border-l-4 border-l-blue-500">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="font-semibold text-lg">Unit {index + 1}: {entry.topic}</h3>
                      <div className="flex gap-2">
                        <Badge variant="outline">{entry.month}</Badge>
                        <Badge variant="secondary">{entry.duration_weeks || entry.durationWeeks} weeks</Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium text-sm text-muted-foreground">Standards</h4>
                          <p className="text-sm">{entry.standard_code || entry.standardCode || "No standards specified"}</p>
                        </div>
                        <div>
                          <h4 className="font-medium text-sm text-muted-foreground">Learning Objectives</h4>
                          <p className="text-sm whitespace-pre-wrap">
                            {entry.learning_objective || entry.learningObjective || "No learning objectives specified"}
                          </p>
                        </div>
                        <div>
                          <h4 className="font-medium text-sm text-muted-foreground">Essential Questions</h4>
                          <p className="text-sm whitespace-pre-wrap">
                            {entry.essential_questions || entry.essentialQuestions || "No essential questions specified"}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium text-sm text-muted-foreground">Formative Assessments</h4>
                          <p className="text-sm whitespace-pre-wrap">
                            {entry.formative_assessments || entry.formativeAssessments || "No formative assessments specified"}
                          </p>
                        </div>
                        <div>
                          <h4 className="font-medium text-sm text-muted-foreground">Summative Assessments</h4>
                          <p className="text-sm whitespace-pre-wrap">
                            {entry.summative_assessments || entry.summativeAssessments || "No summative assessments specified"}
                          </p>
                        </div>
                        <div>
                          <h4 className="font-medium text-sm text-muted-foreground">Resources & Materials</h4>
                          <p className="text-sm whitespace-pre-wrap">
                            {entry.resources || "No resources specified"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Calendar className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-2 text-sm font-medium text-muted-foreground">No units planned yet</h3>
              <p className="mt-1 text-sm text-muted-foreground">Add units to this scope & sequence to get started.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Metadata */}
      <Card>
        <CardHeader>
          <CardTitle>Metadata</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Created:</span>{' '}
              {new Date(scopeAndSequence.created_at).toLocaleDateString()}
            </div>
            <div>
              <span className="font-medium">Last Updated:</span>{' '}
              {new Date(scopeAndSequence.updated_at).toLocaleDateString()}
            </div>
            <div>
              <span className="font-medium">Course:</span>{' '}
              {scopeAndSequence.course_name}
            </div>
            <div>
              <span className="font-medium">Created By:</span>{' '}
              User {scopeAndSequence.created_by}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}