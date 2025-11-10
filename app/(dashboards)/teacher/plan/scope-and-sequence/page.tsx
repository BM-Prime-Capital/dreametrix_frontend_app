"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, GanttChartSquare, Calculator, BookOpenText, GripVertical } from 'lucide-react';
import { useState, useEffect } from 'react';
import type { ScopeAndSequence } from '@/lib/types';
import PageTitleH1 from '@/components/ui/page-title-h1';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScopeAndSequenceForm } from '@/components/plan/scope-and-sequence-form';
import { ScopeAndSequenceService } from '@/services/plan-service';
import { localStorageKey } from '@/constants/global';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

function SortableCard({ plan }: { plan: ScopeAndSequence }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: plan.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  // 🔹 Utiliser les champs de l'API (snake_case) avec fallback vers camelCase
  const academicYear = plan.academic_year || plan.academicYear || '';
  const subjectName = plan.subject_name || plan.subject || '';
  const grade = plan.grade || plan.gradeLevel || '';

  return (
    <Card ref={setNodeRef} style={style} className="flex flex-col">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing">
              <GripVertical className="h-5 w-5 text-gray-400" />
            </div>
            <CardTitle className="font-headline flex items-center gap-2">
              {subjectName === 'Math' || subjectName?.includes('Math') ?
                <Calculator className="h-5 w-5 text-blue-500" /> :
              subjectName === 'ELA' || subjectName?.includes('ELA') ?
                <BookOpenText className="h-5 w-5 text-green-500" /> :
                <GanttChartSquare className="h-5 w-5 text-primary" />
              }
              {plan.title}
            </CardTitle>
          </div>
        </div>
        <CardDescription>
          {academicYear} - {grade} {subjectName}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-muted-foreground line-clamp-3">
          <strong>Overview:</strong> {plan.overview}
        </p>
      </CardContent>
      <CardFooter>
        <Button variant="outline" size="sm" className="w-full" asChild>
          <Link href={`/teacher/plan/scope-and-sequence/${plan.id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

export default function ScopeAndSequencePage() {
  const accessToken: any = typeof window !== 'undefined' ? localStorage.getItem(localStorageKey.ACCESS_TOKEN) : null;
  const tenantData: any = typeof window !== 'undefined' ? localStorage.getItem(localStorageKey.TENANT_DATA) : null;
  const { primary_domain } = tenantData ? JSON.parse(tenantData) : { primary_domain: '' };
  const tenantPrimaryDomain = `https://${primary_domain}`;

  const [scopeAndSequences, setScopeAndSequences] = useState<ScopeAndSequence[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // 🔹 Récupérer les données réelles depuis l'API
  const fetchScopeAndSequences = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await ScopeAndSequenceService.list(tenantPrimaryDomain, accessToken);
      console.log("📋 Scope & Sequences loaded:", data);
      setScopeAndSequences(data);
    } catch (err: any) {
      console.error("Error loading scope & sequences:", err);
      setError(err.message || "Failed to load scope & sequences");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (accessToken && tenantPrimaryDomain) {
      fetchScopeAndSequences();
    }
  }, [accessToken, tenantPrimaryDomain]);

  const handleSuccess = () => {
    setIsDialogOpen(false);
    // Recharger les données après création
    fetchScopeAndSequences();
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setScopeAndSequences((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  return (
    <div className="w-full space-y-8">
      {/* Header */}
      <header className="bg-[#3e81d4] px-4 py-3 rounded-md">
        <div className="flex items-center gap-4">
          <PageTitleH1 title="Scope & Sequence" className="text-white" />
        </div>
      </header>

      {/* Bouton Create New Scope & Sequence */}
      <div className="flex justify-between items-center">
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
        <Button
          onClick={() => setIsDialogOpen(true)}
          className="bg-[#3e81d4] hover:bg-[#2e71c4] text-white"
        >
          <PlusCircle className="mr-2 h-5 w-5" /> New Scope & Sequence
        </Button>
      </div>

      {/* Dialog for creating new scope & sequence */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent onInteractOutside={(e) => e.preventDefault()} className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-headline">Create New Scope & Sequence</DialogTitle>
            <DialogDescription>
              Outline the academic year by mapping out units, standards, and pacing month by month.
            </DialogDescription>
          </DialogHeader>
          <ScopeAndSequenceForm onSubmitSuccess={handleSuccess} />
        </DialogContent>
      </Dialog>

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3e81d4] mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading scope & sequences...</p>
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <div className="text-center py-10">
          <GanttChartSquare className="mx-auto h-12 w-12 text-red-500" />
          <h3 className="mt-2 text-sm font-medium text-red-600">Error loading scope & sequences</h3>
          <p className="mt-1 text-sm text-red-500">{error}</p>
          <Button 
            onClick={fetchScopeAndSequences} 
            className="mt-4"
            variant="outline"
          >
            Try Again
          </Button>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && scopeAndSequences.length === 0 && (
        <div className="text-center py-10">
          <GanttChartSquare className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-2 text-sm font-medium text-muted-foreground">No scope & sequence plans yet</h3>
          <p className="mt-1 text-sm text-muted-foreground">Get started by creating a new scope & sequence plan.</p>
          <div className="mt-6">
            <Button 
              onClick={() => setIsDialogOpen(true)}
              className="bg-[#3e81d4] hover:bg-[#2e71c4] text-white"
            >
              <PlusCircle className="mr-2 h-4 w-4" /> Create Scope & Sequence
            </Button>
          </div>
        </div>
      )}

      {/* Data Loaded */}
      {!isLoading && !error && scopeAndSequences.length > 0 && (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={scopeAndSequences.map(plan => plan.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {scopeAndSequences.map((plan) => (
                <SortableCard key={plan.id} plan={plan} />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
}