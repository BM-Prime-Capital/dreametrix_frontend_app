"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, GanttChartSquare, Calculator, BookOpenText } from 'lucide-react';
import { useState, useEffect } from 'react';
import type { ScopeAndSequence } from '../../../../../lib/types';
import PageTitleH1 from '@/components/ui/page-title-h1';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScopeAndSequenceForm } from '@/components/plan/scope-and-sequence-form';

const mockScopeAndSequences: ScopeAndSequence[] = [
  {
    id: '1',
    title: 'Grade 7 Math Full Year Plan',
    academicYear: '2024-2025',
    subject: 'Math',
    gradeLevel: '7th Grade',
    overview: 'Covers all common core standards for 7th grade math, including ratios, proportions, number system, expressions, equations, geometry, statistics and probability.',
    standardsAndUnitsByMonth: "August: Unit 1 - Ratios & Proportional Relationships (7.RP.A.1, 7.RP.A.2)\nSeptember: Unit 1 cont., Unit 2 - The Number System (7.NS.A.1)\nOctober: Unit 2 cont. (7.NS.A.2, 7.NS.A.3)\nNovember: Unit 3 - Expressions & Equations (7.EE.A.1, 7.EE.A.2)\nDecember: Unit 3 cont. (7.EE.B.3, 7.EE.B.4)\nJanuary: Unit 4 - Geometry (7.G.A.1, 7.G.A.2)\nFebruary: Unit 4 cont. (7.G.B.4, 7.G.B.6)\nMarch: Unit 5 - Statistics (7.SP.A.1, 7.SP.B.3)\nApril: Unit 6 - Probability (7.SP.C.5, 7.SP.C.7)\nMay: Review and End-of-Year Assessments",
  },
  {
    id: '2',
    title: '6th Grade ELA Yearly Overview',
    academicYear: '2024-2025',
    subject: 'ELA',
    gradeLevel: '6th Grade',
    overview: 'Focuses on developing reading comprehension, writing skills (narrative, informative, argumentative), and language conventions across various genres.',
    standardsAndUnitsByMonth: "Quarter 1: Unit - Narrative Reading & Writing (RL.6.1, W.6.3); Standards: Key Ideas and Details, Craft and Structure in literature; Writing narratives.\nQuarter 2: Unit - Informational Text & Argument (RI.6.1, W.6.1); Standards: Analyzing informational texts, Developing arguments.\nQuarter 3: Unit - Poetry & Figurative Language (RL.6.4, L.6.5); Standards: Understanding poetic structure, Interpreting figurative language.\nQuarter 4: Unit - Research & Presentation (W.6.7, SL.6.4); Standards: Conducting research projects, Presenting findings.",
  },
];


export default function ScopeAndSequencePage() {
  const [scopeAndSequences, setScopeAndSequences] = useState<ScopeAndSequence[]>(mockScopeAndSequences);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setScopeAndSequences(mockScopeAndSequences);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleSuccess = () => {
    setIsDialogOpen(false);
    // Optionally refresh the data here
  };

  return (
    <div className="space-y-8">
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

       {scopeAndSequences.length === 0 && (
         <div className="text-center py-10">
            <GanttChartSquare className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-2 text-sm font-medium text-muted-foreground">No scope & sequence plans yet</h3>
            <p className="mt-1 text-sm text-muted-foreground">Get started by creating a new scope & sequence plan.</p>
            <div className="mt-6">
                <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
                    <Link href="/teacher/plan/scope-and-sequence/create">
                        <PlusCircle className="mr-2 h-4 w-4" /> Create Scope & Sequence
                    </Link>
                </Button>
            </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {scopeAndSequences.map((plan) => (
          <Card key={plan.id} className="flex flex-col">
            <CardHeader>
              <CardTitle className="font-headline flex items-center gap-2">
                {plan.subject === 'Math' ?
                    <Calculator className="h-5 w-5 text-blue-500" /> :
                plan.subject === 'ELA' ?
                    <BookOpenText className="h-5 w-5 text-green-500" /> :
                    <GanttChartSquare className="h-5 w-5 text-primary" />
                }
                {plan.title}
              </CardTitle>
              <CardDescription>
                {plan.academicYear} - {plan.gradeLevel} {plan.subject}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-sm text-muted-foreground line-clamp-3">
                <strong>Overview:</strong> {plan.overview}
              </p>
            </CardContent>
            <CardFooter>
               <Button variant="outline" size="sm" className="w-full" asChild>
                {/* Link to view/edit page - not implemented in this iteration */}
                <Link href={`/teacher/plan/scope-and-sequence/${plan.id}`}>View Details</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
