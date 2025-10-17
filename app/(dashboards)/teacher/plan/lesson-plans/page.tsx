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
import { LessonPlanService, UnitPlanService } from '@/services/plan-service';
import { localStorageKey } from '@/constants/global';

export default function LessonPlansPage() {
  const [lessonPlans, setLessonPlans] = useState<LessonPlan[]>([]);
  const [unitPlans, setUnitPlans] = useState<UnitPlan[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [currentPlan, setCurrentPlan] = useState<LessonPlan | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [subjectFilter, setSubjectFilter] = useState<string>("all");
  const [gradeFilter, setGradeFilter] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);

  // Récupérer le token et les données du tenant
  const accessToken: any = typeof window !== 'undefined' ? localStorage.getItem(localStorageKey.ACCESS_TOKEN) : null;
  const tenantData: any = typeof window !== 'undefined' ? localStorage.getItem(localStorageKey.TENANT_DATA) : null;
  const { primary_domain } = tenantData ? JSON.parse(tenantData) : { primary_domain: '' };
  const tenantPrimaryDomain = `https://${primary_domain}`;

  useEffect(() => {
    const fetchData = async () => {
      if (!accessToken || !tenantPrimaryDomain) return;

      try {
        setIsLoading(true);
        const [lessonPlansData, unitPlansData] = await Promise.all([
          LessonPlanService.list(tenantPrimaryDomain, accessToken),
          UnitPlanService.list(tenantPrimaryDomain, accessToken)
        ]);
        
        setLessonPlans(lessonPlansData);
        setUnitPlans(unitPlansData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [accessToken, tenantPrimaryDomain]);

  const handleSuccess = async (plan: LessonPlan) => {
    try {
      if (editingId) {
        // Mettre à jour le lesson plan existant
        const updatedPlan = await LessonPlanService.update(
          tenantPrimaryDomain, 
          accessToken, 
          editingId, 
          plan
        );
        setLessonPlans(prev => prev.map(p => p.id === editingId ? updatedPlan : p));
      } else {
        // Créer un nouveau lesson plan
        const newPlan = await LessonPlanService.create(
          tenantPrimaryDomain, 
          accessToken, 
          plan
        );
        setLessonPlans(prev => [...prev, newPlan]);
      }
      
      setIsDialogOpen(false);
      setEditingId(null);
      setCurrentPlan(null);
    } catch (error) {
      console.error("Error saving lesson plan:", error);
      alert("Error saving lesson plan. Please try again.");
    }
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

  const handleDelete = async (planId: string) => {
    if (confirm("Are you sure you want to delete this lesson plan?")) {
      try {
        await LessonPlanService.delete(tenantPrimaryDomain, accessToken, planId);
        setLessonPlans(prev => prev.filter(plan => plan.id !== planId));
      } catch (error) {
        console.error("Error deleting lesson plan:", error);
        alert("Error deleting lesson plan. Please try again.");
      }
    }
  };

  const getSubjectColor = (subject: string) => {
    switch (subject) {
      case "Math": return "bg-blue-100 text-blue-800";
      case "ELA": return "bg-green-100 text-green-800";
      case "Science": return "bg-purple-100 text-purple-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

const getUnitPlanTitle = (unitPlanId: string | undefined) => {
  if (!unitPlanId) return "No unit linked";
  const unit = unitPlans.find(u => u.id === unitPlanId);
  return unit ? unit.title : "No unit linked";
};

  // Filtrage des lesson plans
const filteredLessonPlans = lessonPlans.filter(plan => {
  const matchesSearch = plan.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       (plan.objectives || "").toLowerCase().includes(searchTerm.toLowerCase());
  const matchesSubject = subjectFilter === "all" || plan.subject === subjectFilter;
  const matchesGrade = gradeFilter === "all" || plan.gradeLevel === gradeFilter;
  
  return matchesSearch && matchesSubject && matchesGrade;
});

  if (isLoading) {
    return (
      <div className="w-full space-y-8">
        <header className="bg-[#3e81d4] px-4 py-3 rounded-md">
          <div className="flex items-center gap-4">
            <PageTitleH1 title="Lesson Plans" className="text-white" />
          </div>
        </header>
        <div className="text-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3e81d4] mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading lesson plans...</p>
        </div>
      </div>
    );
  }

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
            unitPlans={unitPlans} 
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
        {filteredLessonPlans.map((plan) => {
  const duration = plan.durationMinutes || plan.duration_minutes || 0;
  const subject = plan.subject || plan.subject_name || "";
  const gradeLevel = plan.gradeLevel || plan.grade || "";
  const objectives = plan.objectives || "";
  const assessmentFormative = plan.assessmentFormative || plan.assessment_formative || "";
  const unitPlanId = plan.unitPlanId || plan.unit_plan;

  return (
    <Card key={plan.id} className="flex flex-col hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              {subject === 'Math' ?
                <Calculator className="h-5 w-5 text-blue-500" /> :
                <BookOpenText className="h-5 w-5 text-green-500" />
              }
              <CardTitle className="font-headline text-lg line-clamp-2">
                {plan.title}
              </CardTitle>
            </div>
            <CardDescription>
              {format(new Date(plan.date), "PPP")} • {duration} min
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
          <Badge className={getSubjectColor(subject)}>
            {subject}
          </Badge>
          <Badge variant="outline">
            {gradeLevel}
          </Badge>
          {unitPlanId && (
            <Badge variant="secondary" className="text-xs">
              Unit: {getUnitPlanTitle(unitPlanId)}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="space-y-3">
          <div>
            <p className="text-sm font-medium mb-1">Objectives:</p>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {objectives}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium mb-1">Assessment:</p>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {assessmentFormative}
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
  );
        })}
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
            {Math.round(lessonPlans.reduce((acc, plan) => 
              acc + (plan.durationMinutes || plan.duration_minutes || 0), 0) / 60)}
          </p>
          <p className="text-sm text-muted-foreground">Total Hours</p>
        </div>
        <div>
          <p className="text-2xl font-bold">
            {new Set(lessonPlans.map(plan => plan.subject || plan.subject_name || "")).size}
          </p>
          <p className="text-sm text-muted-foreground">Subjects</p>
        </div>
        <div>
          <p className="text-2xl font-bold">
            {new Set(lessonPlans.map(plan => plan.gradeLevel || plan.grade || "")).size}
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