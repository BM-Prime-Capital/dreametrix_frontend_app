"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search, Calendar, Clock, BookOpen, Filter } from "lucide-react";
import { SUBJECTS, GRADE_LEVELS } from "@/lib/types";
import { UnitPlanService } from "@/services/plan-service";
import { localStorageKey } from "@/constants/global";
import type { UnitPlan } from "@/lib/types";

export default function UnitPlansPage() {
  const [unitPlans, setUnitPlans] = useState<UnitPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [subjectFilter, setSubjectFilter] = useState<string>("");
  const [gradeFilter, setGradeFilter] = useState<string>("");

  const accessToken: any = typeof window !== 'undefined' ? localStorage.getItem(localStorageKey.ACCESS_TOKEN) : null;
  const tenantData: any = typeof window !== 'undefined' ? localStorage.getItem(localStorageKey.TENANT_DATA) : null;
  const { primary_domain } = tenantData ? JSON.parse(tenantData) : { primary_domain: '' };
  const tenantPrimaryDomain = `https://${primary_domain}`;

  // 🔹 Charger les unit plans depuis l'API
  const fetchUnitPlans = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await UnitPlanService.list(tenantPrimaryDomain, accessToken);
      setUnitPlans(data);
    } catch (err: any) {
      console.error("❌ Error loading unit plans:", err);
      setError(err.message || "Failed to load unit plans");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (accessToken && tenantPrimaryDomain) {
      fetchUnitPlans();
    }
  }, [accessToken, tenantPrimaryDomain]);

  const filteredUnitPlans = unitPlans.filter(unit => {
    const matchesSearch = unit.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         unit.learning_objectives?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = !subjectFilter || unit.subject_name === subjectFilter;
    const matchesGrade = !gradeFilter || unit.grade === gradeFilter;
    
    return matchesSearch && matchesSubject && matchesGrade;
  });

  const getSubjectColor = (subject: string) => {
    switch (subject) {
      case "Math": return "bg-blue-100 text-blue-800";
      case "ELA": return "bg-green-100 text-green-800";
      case "Science": return "bg-purple-100 text-purple-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading unit plans...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="text-center py-20">
          <BookOpen className="mx-auto h-12 w-12 text-red-500" />
          <h3 className="mt-2 text-sm font-medium text-red-600">Error loading unit plans</h3>
          <p className="mt-1 text-sm text-red-500">{error}</p>
          <Button onClick={fetchUnitPlans} className="mt-4" variant="outline">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header avec le style cohérent de Scope & Sequence */}
      <header className="bg-[#3e81d4] px-4 py-3 rounded-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-bold font-headline text-white">Unit Plans</h1>
          </div>
          <Button asChild className="bg-white/20 hover:bg-white/30 text-white border-white">
            <Link href="/teacher/plan" className="flex text-white items-center gap-2">
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
              Back to Plan
            </Link>
          </Button>
        </div>
        <p className="text-white/80 mt-2">
          Design comprehensive units with standards, assessments, and activities
        </p>
      </header>

      {/* Bouton Create New Unit Plan */}
      <div className="flex justify-end">
        <Button asChild className="bg-[#3e81d4] hover:bg-[#2e71c4] text-white">
          <Link href="/teacher/plan/unit-plans/new" className="flex text-white items-center gap-2">
            <Plus className="h-5 w-5" />
            New Unit Plan
          </Link>
        </Button>
      </div>

      {/* Filtres et recherche */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search unit plans..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            
            {/* Sujet */}
            <Select
              value={subjectFilter || "ALL"}
              onValueChange={(val) => setSubjectFilter(val === "ALL" ? "" : val)}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Subjects" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Subjects</SelectItem>
                {SUBJECTS.map((subject) => (
                  <SelectItem key={subject} value={subject}>
                    {subject}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Niveau */}
            <Select
              value={gradeFilter || "ALL"}
              onValueChange={(val) => setGradeFilter(val === "ALL" ? "" : val)}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Grades" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Grades</SelectItem>
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
                setSubjectFilter("");
                setGradeFilter("");
              }}
              className="flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Liste des Unit Plans */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUnitPlans.map((unit) => (
          <Card key={unit.id} className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <CardTitle className="text-lg line-clamp-2">{unit.title}</CardTitle>
                  <CardDescription>{unit.grade}</CardDescription>
                </div>
                <Badge className={getSubjectColor(unit.subject_name)}>
                  {unit.subject_name}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>{unit.duration_weeks} weeks</span>
                </div>
                
                <div className="text-sm">
                  <p className="font-medium mb-1">Learning Objectives:</p>
                  <p className="text-muted-foreground line-clamp-2">
                    {unit.learning_objectives || "No learning objectives provided"}
                  </p>
                </div>

                <div className="text-sm">
                  <p className="font-medium mb-1">Assessments:</p>
                  <div className="flex flex-wrap gap-1">
                    <Badge variant="outline" className="text-xs">
                      Formative
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      Summative
                    </Badge>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2 mt-4">
                <Button variant="outline" size="sm" asChild className="flex-1">
                  <Link href={`/teacher/plan/unit-plans/${unit.id}`}>
                    View Details
                  </Link>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/teacher/plan/unit-plans/${unit.id}/edit`}>
                    Edit
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* État vide */}
      {filteredUnitPlans.length === 0 && (
      <Card>
        <CardContent className="text-center py-12">
          <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">
            {searchTerm || subjectFilter || gradeFilter ? "No matching unit plans" : "No unit plans yet"}
          </h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm || subjectFilter || gradeFilter 
              ? "Try adjusting your search criteria" 
              : "Start by creating your first unit plan based on your Scope & Sequence"
            }
          </p>
          <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white">
            <Link href="/teacher/plan/unit-plans/new"  className="flex text-white items-center justify-center">
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Unit Plan
            </Link>
          </Button>
        </CardContent>
      </Card>
      )}

      {/* Statistiques */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold">{unitPlans.length}</p>
              <p className="text-sm text-muted-foreground">Total Units</p>
            </div>
            <div>
              <p className="text-2xl font-bold">
                {unitPlans.reduce((acc, unit) => acc + unit.duration_weeks, 0)}
              </p>
              <p className="text-sm text-muted-foreground">Total Weeks</p>
            </div>
            <div>
              <p className="text-2xl font-bold">
                {new Set(unitPlans.map(unit => unit.subject_name)).size}
              </p>
              <p className="text-sm text-muted-foreground">Subjects Covered</p>
            </div>
            <div>
              <p className="text-2xl font-bold">
                {new Set(unitPlans.map(unit => unit.grade)).size}
              </p>
              <p className="text-sm text-muted-foreground">Grade Levels</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}