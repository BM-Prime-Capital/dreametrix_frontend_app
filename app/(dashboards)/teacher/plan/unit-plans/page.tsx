"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, BookOpenText, Calculator, BookCopy } from 'lucide-react';
import { useState, useEffect } from 'react';
import type { UnitPlan } from '../../../../../lib/types';
import PageTitleH1 from '@/components/ui/page-title-h1';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { UnitPlanForm } from '@/components/plan/unit-plan-form';

// Mock data - replace with actual data fetching in a real app
const mockUnitPlans: UnitPlan[] = [
  {
    id: '1',
    title: 'Introduction to Fractions',
    subject: 'Math',
    gradeLevel: '4th Grade',
    standards: 'CCSS.MATH.CONTENT.4.NF.A.1, CCSS.MATH.CONTENT.4.NF.A.2',
    learningObjectives: 'SWBAT understand fraction equivalence and compare fractions.',
    assessmentsFormative: 'Exit tickets on fraction comparison.',
    assessmentsSummative: 'Unit test on fractions.',
    activities: 'Fraction bar manipulations, group problem solving.',
    materials: 'Fraction bars, worksheets, online interactive tools.',
    pacingCalendar: 'Week 1: Equivalent Fractions, Week 2: Comparing Fractions',
  },
  {
    id: '2',
    title: 'Narrative Writing Workshop',
    subject: 'ELA',
    gradeLevel: '7th Grade',
    standards: 'CCSS.ELA-LITERACY.W.7.3',
    learningObjectives: 'SWBAT write narratives to develop real or imagined experiences.',
    assessmentsFormative: 'Peer review sessions, draft check-ins.',
    assessmentsSummative: 'Final narrative essay.',
    activities: 'Brainstorming sessions, story mapping, revising and editing practice.',
    materials: 'Mentor texts, graphic organizers, writing journals.',
    pacingCalendar: 'Week 1-2: Pre-writing & Drafting, Week 3: Revising & Editing, Week 4: Publishing',
  },
];


export default function UnitPlansPage() {
  const [unitPlans, setUnitPlans] = useState<UnitPlan[]>(mockUnitPlans);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setUnitPlans(mockUnitPlans);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleSuccess = () => {
    setIsDialogOpen(false);
    // Optionally refresh the unit plans list here
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <header className="bg-[#3e81d4] px-4 py-3 rounded-md">
        <div className="flex items-center gap-4">
          <PageTitleH1 title="Unit Plans" className="text-white" />
        </div>
      </header>

      {/* Bouton Create New Unit Plan */}
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
          <PlusCircle className="mr-2 h-5 w-5" /> New Unit Plan
        </Button>
      </div>

      {/* Dialog for creating new unit plan */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent onInteractOutside={(e) => e.preventDefault()} className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-headline">Create New Unit Plan</DialogTitle>
            <DialogDescription>
              Lay the foundation for a series of lessons by defining standards, objectives, and assessments for your unit.
            </DialogDescription>
          </DialogHeader>
          <UnitPlanForm onSubmitSuccess={handleSuccess} />
        </DialogContent>
      </Dialog>


      {unitPlans.length === 0 && (
         <div className="text-center py-10">
            <BookCopy className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-2 text-sm font-medium text-muted-foreground">No unit plans yet</h3>
            <p className="mt-1 text-sm text-muted-foreground">Get started by creating a new unit plan.</p>
            <div className="mt-6">
                <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
                    <Link href="/teacher/plan/unit-plans/create">
                        <PlusCircle className="mr-2 h-4 w-4" /> Create Unit Plan
                    </Link>
                </Button>
            </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {unitPlans.map((plan) => (
          <Card key={plan.id} className="flex flex-col">
            <CardHeader>
              <CardTitle className="font-headline flex items-center gap-2">
                {plan.subject === 'Math' ?
                    <Calculator className="h-5 w-5 text-blue-500" /> :
                    <BookOpenText className="h-5 w-5 text-green-500" />
                }
                {plan.title}
              </CardTitle>
              <CardDescription>{plan.gradeLevel} - {plan.subject}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-sm text-muted-foreground line-clamp-3">
                <strong>Objectives:</strong> {plan.learningObjectives}
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm" className="w-full" asChild>
                {/* Link to view/edit page - not implemented in this iteration */}
                <Link href={`/teacher/plan/unit-plans/${plan.id}`}>View Details</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
