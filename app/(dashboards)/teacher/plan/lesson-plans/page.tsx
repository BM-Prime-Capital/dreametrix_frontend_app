"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, ClipboardCheck, BookOpenText, Calculator, MoreVertical, Pencil, Copy, Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import type { LessonPlan } from '@/lib/types';
import { format } from 'date-fns';
import PageTitleH1 from '@/components/ui/page-title-h1';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {LessonPlanForm} from '@/components/plan/lesson-plan-form';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
// import {useRouter} from "next/navigation";
// import {undefined} from "zod";

// Mock data - replace with actual data fetching in a real app
const mockLessonPlans: LessonPlan[] = [
  {
    id: '1',
    title: 'Complementary Angles Practice',
    date: new Date().toISOString(),
    subject: 'Math',
    gradeLevel: '7th Grade',
    objectives: 'SWBAT solve problems involving complementary angles.',
    procedures: '1. Review definition. 2. Guided examples. 3. Independent practice worksheet.',
    materials: 'Worksheet, protractors, whiteboard.',
    assessmentFormative: 'Collect and review worksheet.',
  },
  {
    id: '2',
    title: 'Introduction to Figurative Language',
    date: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString(),
    subject: 'ELA',
    gradeLevel: '6th Grade',
    objectives: 'SWBAT identify examples of similes and metaphors in text.',
    procedures: '1. Define simile/metaphor. 2. Show examples. 3. Students find examples in provided short story.',
    materials: 'Short story handout, chart paper.',
    assessmentFormative: 'Students share identified examples with a partner.',
  },
];


export default function LessonPlansPage() {
  const [lessonPlans, setLessonPlans] = useState<LessonPlan[]>(mockLessonPlans);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  // const router = useRouter();
  const [editingId, setEditingId] = useState<string | null>(null);

  const [currentPlan, setCurrentPlan] = useState<LessonPlan| null>({
    assessmentFormative: "",
    date: "",
    differentiation: "",
    gradeLevel: "",
    id: "",
    materials: "",
    objectives: "",
    procedures: "",
    subject: undefined,
    title: "",
    unitPlanId: ""
  })


  useEffect(() => {
    const timer = setTimeout(() => {
      setLessonPlans(mockLessonPlans);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const mockUnitPlans = [
    { id: 'unit1', title: 'Algebra Basics (Math 7th)' },
    { id: 'unit2', title: 'Narrative Writing (ELA 6th)' },
  ];

  const handleSuccess = (plan: any) => {

    console.log("Plan at submission ===>", plan)
    // Optionally refresh data here


    const updatedLessonPlan = {
      ...plan,
      id: editingId || String(lessonPlans.length + 1),
    };

    if (editingId) {
      setLessonPlans(prev => prev.map(plan =>
          plan.id === editingId ? updatedLessonPlan : plan
      ));
    } else {
      setLessonPlans(prev => [...prev, updatedLessonPlan]);
    }
    console.log("All of them", lessonPlans)
    setIsDialogOpen(false);

  };

  const handleEdit = (clickedLessonPlan: LessonPlan) => {
    // Implement edit functionality
    const lessonPlanToEdit = mockLessonPlans.find((lessonPlan) => lessonPlan.id === clickedLessonPlan.id);
    if(lessonPlanToEdit){
      setEditingId(clickedLessonPlan.id)
      console.log('Edit plan:', clickedLessonPlan);
      setCurrentPlan(clickedLessonPlan)
      setIsDialogOpen(true)
    }

  };

  const handleDuplicate = (clickedLessonPlan: LessonPlan) => {
    // Implement duplicate functionality
    const lessonPlanToDuplicate = mockLessonPlans.find((lessonPlan) => lessonPlan.id === clickedLessonPlan.id);
    if(lessonPlanToDuplicate){
      console.log('Duplicate plan:', clickedLessonPlan);
      setCurrentPlan({...clickedLessonPlan, title:`${clickedLessonPlan.title} (Copy)`})
      setIsDialogOpen(true)
    }
  };

  const handleDelete = (planId: string) => {
    // Implement delete functionality
    setLessonPlans(prev => prev.filter(plan => plan.id !== planId));
    console.log('Delete plan:', planId);
  };



  return (
    <div className="w-full space-y-8">
      {/* Header */}
      <header className="bg-[#3e81d4] px-4 py-3 rounded-md">
        <div className="flex items-center gap-4">
          <PageTitleH1 title="Lesson Plans" className="text-white" />
        </div>
      </header>

      {/* Button Create New Lesson Plan */}
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
          onClick={() => {
            setCurrentPlan(null)
            setIsDialogOpen(true)
          }}
          className="bg-[#3e81d4] hover:bg-[#2e71c4] text-white"
        >
          <PlusCircle className="mr-2 h-5 w-5" /> New Lesson Plan
        </Button>
      </div>

      {/* Dialog for creating new lesson plan */}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogContent onInteractOutside={(e) => e.preventDefault()} className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="font-headline">Create New Lesson Plan</DialogTitle>
                  <DialogDescription>
                    Outline your daily instruction, from objectives to assessments.
                  </DialogDescription>
                </DialogHeader>
                <LessonPlanForm unitPlans={mockUnitPlans} onSubmitSuccess={(lessonPlanToSubmit)=>handleSuccess(lessonPlanToSubmit)} initialData={currentPlan} />
              </DialogContent>
      </Dialog>


       {/*Empty List component*/}
       {lessonPlans.length === 0 && (
         <div className="text-center py-10">
            <ClipboardCheck className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-2 text-sm font-medium text-muted-foreground">No lesson plans yet</h3>
            <p className="mt-1 text-sm text-muted-foreground">Get started by creating a new lesson plan.</p>
            <div className="mt-6">
                <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
                    <Link href="/teacher/plan/lesson-plans/create">
                        <PlusCircle className="mr-2 h-4 w-4" /> Create Lesson Plan
                    </Link>
                </Button>
            </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {lessonPlans.map((plan) => (
          <Card key={plan.id} className="flex flex-col">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <CardTitle className="font-headline">
                    {plan.subject === 'Math' ?
                        <Calculator className="h-5 w-5 text-blue-500" /> :
                        <BookOpenText className="h-5 w-5 text-green-500" />
                    }
                    {plan.title}
                  </CardTitle>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleEdit(plan)}>
                      <Pencil className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDuplicate(plan)}>
                      <Copy className="mr-2 h-4 w-4" />
                      Duplicate
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleDelete(plan.id)}
                      className="text-red-600"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <CardDescription>
                {format(new Date(plan.date).toISOString(), "PPP")} - {plan.gradeLevel} {plan.subject}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-sm text-muted-foreground line-clamp-3">
                <strong>Objectives:</strong> {plan.objectives}
              </p>
            </CardContent>
            <CardFooter>
               <Button variant="outline" size="sm" className="w-full" asChild>
                {/* Link to view/edit page - not implemented in this iteration */}
                <Link href={`/teacher/plan/lesson-plans/${plan.id}`}>View Details</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
