"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, ClipboardCheck, BookOpenText, Calculator, MoreVertical, Pencil, Copy, Trash2, Search, Filter } from 'lucide-react';
import { useState, useEffect } from 'react';
import type { LessonPlan, UnitPlan } from '@/lib/types';
import { format } from 'date-fns';
import PageTitleH1 from '@/components/ui/page-title-h1';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { LessonPlanForm } from '@/components/plan/lesson-plan-form';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SUBJECTS, GRADE_LEVELS } from "@/lib/types";
import { Badge } from "@/components/ui/badge";

// Mock data amélioré
const mockLessonPlans: LessonPlan[] = [
  {
    id: '1',
    title: 'Complementary Angles Practice',
    date: new Date().toISOString().split('T')[0],
    subject: 'Math',
    gradeLevel: '7th Grade',
    unitPlanId: 'unit1',
    durationMinutes: 45,
    objectives: 'SWBAT solve problems involving complementary angles and apply angle relationships in real-world contexts.',
    standards: 'NY-NGLS.MATH.CONTENT.7.G.B.5',
    procedures: '1. Review definition of complementary angles. 2. Guided examples on whiteboard. 3. Independent practice worksheet. 4. Exit ticket assessment.',
    materials: 'Worksheet, protractors, whiteboard, markers, geometric shapes',
    differentiation: 'Scaffolded worksheets for struggling learners, challenge problems for advanced students',
    assessmentFormative: 'Collect and review worksheet, exit ticket with 3 problems',
    homework: 'Textbook problems p. 45-46',
    notes: 'Focus on real-world applications of angles',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    title: 'Introduction to Figurative Language',
    date: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0],
    subject: 'ELA',
    gradeLevel: '6th Grade',
    unitPlanId: 'unit2',
    durationMinutes: 50,
    objectives: 'SWBAT identify examples of similes and metaphors in text and create their own figurative language examples.',
    standards: 'NY-NGLS.ELA-LITERACY.RL.6.4',
    procedures: '1. Define simile and metaphor with examples. 2. Group activity: identify examples in short story. 3. Create original examples. 4. Share and discuss.',
    materials: 'Short story handout, chart paper, markers, figurative language anchor chart',
    assessmentFormative: 'Exit slip: write one simile and one metaphor',
    homework: 'Find 3 examples of figurative language in a book you are reading',
    notes: 'Use visual aids to support ELL students',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const mockUnitPlans: UnitPlan[] = [
  {
    id: 'unit1',
    title: 'Geometry and Angle Relationships',
    subject: 'Math',
    gradeLevel: '7th Grade',
    durationWeeks: 3,
    essentialQuestions: 'How do angle relationships help us solve real-world problems?',
    standards: 'NY-NGLS.MATH.CONTENT.7.G.B.5',
    learningObjectives: 'Understand and apply angle relationships',
    assessmentsFormative: 'Worksheets, exit tickets',
    assessmentsSummative: 'Unit test, project',
    activities: 'Hands-on activities, group work',
    materials: 'Protractors, worksheets',
    pacingCalendar: 'Week 1: Basic angles, Week 2: Angle relationships, Week 3: Applications',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'unit2',
    title: 'Literary Analysis and Figurative Language',
    subject: 'ELA',
    gradeLevel: '6th Grade',
    durationWeeks: 2,
    essentialQuestions: 'How does figurative language enhance storytelling?',
    standards: 'NY-NGLS.ELA-LITERACY.RL.6.4',
    learningObjectives: 'Analyze and create figurative language',
    assessmentsFormative: 'Reading responses, discussions',
    assessmentsSummative: 'Literary essay',
    activities: 'Close reading, creative writing',
    materials: 'Texts, writing materials',
    pacingCalendar: 'Week 1: Identification, Week 2: Creation',
    createdAt: new Date(),
    updatedAt: new Date(),
  }
];

export default function LessonPlansPage() {
  const [lessonPlans, setLessonPlans] = useState<LessonPlan[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [currentPlan, setCurrentPlan] = useState<LessonPlan | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [subjectFilter, setSubjectFilter] = useState<string>("all");
  const [gradeFilter, setGradeFilter] = useState<string>("all");

  useEffect(() => {
    const timer = setTimeout(() => {
      setLessonPlans(mockLessonPlans);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleSuccess = (plan: LessonPlan) => {
    if (editingId) {
      setLessonPlans(prev => prev.map(p => p.id === editingId ? plan : p));
    } else {
      setLessonPlans(prev => [...prev, { ...plan, id: `lesson-${Date.now()}` }]);
    }
    setIsDialogOpen(false);
    setEditingId(null);
    setCurrentPlan(null);
  };

  const handleEdit = (clickedLessonPlan: LessonPlan) => {
    setEditingId(clickedLessonPlan.id);
    setCurrentPlan(clickedLessonPlan);
    setIsDialogOpen(true);
  };

  const handleDuplicate = (clickedLessonPlan: LessonPlan) => {
    setEditingId(null);
    setCurrentPlan({
      ...clickedLessonPlan,
      id: "",
      title: `${clickedLessonPlan.title} (Copy)`,
      date: new Date().toISOString().split('T')[0]
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (planId: string) => {
    setLessonPlans(prev => prev.filter(plan => plan.id !== planId));
  };

  const getSubjectColor = (subject: string) => {
    switch (subject) {
      case "Math": return "bg-blue-100 text-blue-800";
      case "ELA": return "bg-green-100 text-green-800";
      case "Science": return "bg-purple-100 text-purple-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getUnitPlanTitle = (unitPlanId: string) => {
    const unit = mockUnitPlans.find(u => u.id === unitPlanId);
    return unit ? unit.title : "No unit linked";
  };

  // Filtrage des lesson plans
  const filteredLessonPlans = lessonPlans.filter(plan => {
    const matchesSearch = plan.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         plan.objectives.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = subjectFilter === "all" || plan.subject === subjectFilter;
    const matchesGrade = gradeFilter === "all" || plan.gradeLevel === gradeFilter;
    
    return matchesSearch && matchesSubject && matchesGrade;
  });

  return (
    <div className="w-full space-y-8">
      {/* Header */}
      <header className="bg-[#3e81d4] px-4 py-3 rounded-md">
        <div className="flex items-center gap-4">
          <PageTitleH1 title="Lesson Plans" className="text-white" />
        </div>
      </header>

      {/* Navigation et Actions */}
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
            setCurrentPlan(null);
            setEditingId(null);
            setIsDialogOpen(true);
          }}
          className="bg-[#3e81d4] hover:bg-[#2e71c4] text-white"
        >
          <PlusCircle className="mr-2 h-5 w-5" /> New Lesson Plan
        </Button>
      </div>

      {/* Filtres et Recherche */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search lesson plans..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            
            <Select value={subjectFilter} onValueChange={setSubjectFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Subjects" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Subjects</SelectItem>
                {SUBJECTS.map((subject) => (
                  <SelectItem key={subject} value={subject}>
                    {subject}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={gradeFilter} onValueChange={setGradeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Grades" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Grades</SelectItem>
                {GRADE_LEVELS.map((grade) => (
                  <SelectItem key={grade} value={grade}>
                    {grade}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button 
              variant="outline" 
              onClick={() => {
                setSearchTerm("");
                setSubjectFilter("all");
                setGradeFilter("all");
              }}
            >
              <Filter className="h-4 w-4 mr-2" />
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Dialog pour créer/modifier lesson plan */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-headline">
              {editingId ? "Edit Lesson Plan" : "Create New Lesson Plan"}
            </DialogTitle>
            <DialogDescription>
              Outline your daily instruction, from objectives to assessments.
            </DialogDescription>
          </DialogHeader>
          <LessonPlanForm 
            unitPlans={mockUnitPlans} 
            onSubmitSuccess={handleSuccess} 
            initialData={currentPlan}
            onCancel={() => {
              setIsDialogOpen(false);
              setEditingId(null);
              setCurrentPlan(null);
            }}
          />
        </DialogContent>
      </Dialog>

      {/* État vide */}
      {filteredLessonPlans.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <ClipboardCheck className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-2 text-sm font-medium text-muted-foreground">
              {searchTerm || subjectFilter !== "all" || gradeFilter !== "all" 
                ? "No matching lesson plans" 
                : "No lesson plans yet"
              }
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {searchTerm || subjectFilter !== "all" || gradeFilter !== "all"
                ? "Try adjusting your search criteria"
                : "Get started by creating a new lesson plan."
              }
            </p>
            <div className="mt-6">
              <Button 
                onClick={() => {
                  setCurrentPlan(null);
                  setIsDialogOpen(true);
                }}
                className="bg-[#3e81d4] hover:bg-[#2e71c4] text-white"
              >
                <PlusCircle className="mr-2 h-4 w-4" /> Create Lesson Plan
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Grille des Lesson Plans */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredLessonPlans.map((plan) => (
          <Card key={plan.id} className="flex flex-col hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    {plan.subject === 'Math' ?
                      <Calculator className="h-5 w-5 text-blue-500" /> :
                      <BookOpenText className="h-5 w-5 text-green-500" />
                    }
                    <CardTitle className="font-headline text-lg line-clamp-2">
                      {plan.title}
                    </CardTitle>
                  </div>
                  <CardDescription>
                    {format(new Date(plan.date), "PPP")} • {plan.durationMinutes} min
                  </CardDescription>
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
              <div className="flex flex-wrap gap-2 mt-2">
                <Badge className={getSubjectColor(plan.subject)}>
                  {plan.subject}
                </Badge>
                <Badge variant="outline">
                  {plan.gradeLevel}
                </Badge>
                {plan.unitPlanId && (
                  <Badge variant="secondary" className="text-xs">
                    Unit: {getUnitPlanTitle(plan.unitPlanId)}
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="flex-grow">
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium mb-1">Objectives:</p>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {plan.objectives}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium mb-1">Assessment:</p>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {plan.assessmentFormative}
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm" className="w-full" asChild>
                <Link href={`/teacher/plan/lesson-plans/${plan.id}`}>
                  View Details
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Statistiques */}
      {lessonPlans.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold">{lessonPlans.length}</p>
                <p className="text-sm text-muted-foreground">Total Lessons</p>
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {Math.round(lessonPlans.reduce((acc, plan) => acc + plan.durationMinutes, 0) / 60)}
                </p>
                <p className="text-sm text-muted-foreground">Total Hours</p>
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {new Set(lessonPlans.map(plan => plan.subject)).size}
                </p>
                <p className="text-sm text-muted-foreground">Subjects</p>
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {new Set(lessonPlans.map(plan => plan.gradeLevel)).size}
                </p>
                <p className="text-sm text-muted-foreground">Grade Levels</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}