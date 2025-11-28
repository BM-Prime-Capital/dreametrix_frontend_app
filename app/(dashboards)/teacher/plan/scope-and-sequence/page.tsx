// app/teacher/plan/scope-and-sequence/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search, Calendar, BookOpen, Filter, GanttChartSquare, Calculator, BookOpenText } from "lucide-react";
import { SUBJECTS } from "@/lib/types";
import { ScopeAndSequenceService, AcademicDataService } from "@/services/plan-service";
import { localStorageKey } from "@/constants/global";
import type { ScopeAndSequence } from "@/lib/types";

export default function ScopeAndSequencePage() {
  const [scopeAndSequences, setScopeAndSequences] = useState<ScopeAndSequence[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [subjectFilter, setSubjectFilter] = useState<string>("");
  const [gradeFilter, setGradeFilter] = useState<string>("");
  const [academicData, setAcademicData] = useState<{
    subjects: string[];
    gradesBySubject: { [subject: string]: number[] };
  } | null>(null);

  const accessToken: any = typeof window !== 'undefined' ? localStorage.getItem(localStorageKey.ACCESS_TOKEN) : null;
  const tenantData: any = typeof window !== 'undefined' ? localStorage.getItem(localStorageKey.TENANT_DATA) : null;
  const { primary_domain } = tenantData ? JSON.parse(tenantData) : { primary_domain: '' };
  const tenantPrimaryDomain = `https://${primary_domain}`;

  // 🔹 Charger les scope & sequences depuis l'API
  const fetchScopeAndSequences = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await ScopeAndSequenceService.list(tenantPrimaryDomain, accessToken);
      setScopeAndSequences(data);
    } catch (err: any) {
      console.error("Error loading scope & sequences:", err);
      setError(err.message || "Failed to load scope & sequences");
    } finally {
      setIsLoading(false);
    }
  };

  // 🔹 Charger les données académiques
  const fetchAcademicData = async () => {
    if (!accessToken || !tenantPrimaryDomain) return;

    try {
      const subjects = await AcademicDataService.getSubjects(tenantPrimaryDomain, accessToken);
      const gradesBySubject: { [subject: string]: number[] } = {};

      for (const subject of subjects) {
        try {
          const grades = await AcademicDataService.getGradesBySubject(tenantPrimaryDomain, accessToken, subject);
          gradesBySubject[subject] = grades;
        } catch (error) {
          console.error(`Error loading grades for ${subject}:`, error);
          gradesBySubject[subject] = [];
        }
      }

      setAcademicData({ subjects, gradesBySubject });
    } catch (error) {
      console.error("Error loading academic data:", error);
    }
  };

  useEffect(() => {
    if (accessToken && tenantPrimaryDomain) {
      fetchScopeAndSequences();
      fetchAcademicData();
    }
  }, [accessToken, tenantPrimaryDomain]);

  const filteredScopeAndSequences = scopeAndSequences.filter(scope => {
    const matchesSearch = scope.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         scope.overview?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = !subjectFilter || scope.subject_name === subjectFilter;
    const matchesGrade = !gradeFilter || scope.grade === gradeFilter;
    
    return matchesSearch && matchesSubject && matchesGrade;
  });

  const getSubjectIcon = (subjectName: string) => {
    const subject = subjectName?.toLowerCase();
    if (subject?.includes('math')) return <Calculator className="h-5 w-5 text-blue-500" />;
    if (subject?.includes('ela') || subject?.includes('english')) return <BookOpenText className="h-5 w-5 text-green-500" />;
    return <GanttChartSquare className="h-5 w-5 text-purple-500" />;
  };

  const getSubjectColor = (subject: string) => {
    switch (subject) {
      case "Math": return "bg-blue-100 text-blue-800";
      case "ELA": return "bg-green-100 text-green-800";
      case "Science": return "bg-purple-100 text-purple-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getAvailableGrades = () => {
    if (!academicData) return [];
    const allGrades = new Set<number>();
    Object.values(academicData.gradesBySubject).forEach(grades => {
      grades.forEach(grade => allGrades.add(grade));
    });
    return Array.from(allGrades).sort((a, b) => a - b);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading scope & sequences...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="text-center py-20">
          <GanttChartSquare className="mx-auto h-12 w-12 text-red-500" />
          <h3 className="mt-2 text-sm font-medium text-red-600">Error loading scope & sequences</h3>
          <p className="mt-1 text-sm text-red-500">{error}</p>
          <Button onClick={fetchScopeAndSequences} className="mt-4" variant="outline">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header avec le style cohérent */}
      <header className="bg-[#3e81d4] px-4 py-3 rounded-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-bold font-headline text-white">Scope & Sequence</h1>
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
          Plan your academic year with comprehensive curriculum mapping and standards alignment
        </p>
      </header>

      {/* Bouton Create New Scope & Sequence */}
      <div className="flex justify-end">
        <Button asChild className="bg-[#3e81d4] hover:bg-[#2e71c4] text-white">
          <Link href="/teacher/plan/scope-and-sequence/create" className="flex text-white items-center gap-2">
            <Plus className="h-5 w-5" />
            New Scope & Sequence
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
                placeholder="Search scope & sequences..."
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
                {(academicData?.subjects || SUBJECTS).map((subject) => (
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
                {getAvailableGrades().map((grade) => (
                  <SelectItem key={grade} value={grade.toString()}>
                    Grade {grade}
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

      {/* Liste des Scope & Sequences */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredScopeAndSequences.map((scope) => (
          <Card key={scope.id} className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    {getSubjectIcon(scope.subject_name)}
                    <CardTitle className="text-lg line-clamp-2">{scope.title}</CardTitle>
                  </div>
                  <CardDescription className="flex items-center gap-2">
                    <Calendar className="h-3 w-3" />
                    {scope.academic_year}
                  </CardDescription>
                </div>
                <Badge className={getSubjectColor(scope.subject_name)}>
                  {scope.subject_name}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <BookOpen className="h-4 w-4" />
                  <span>Grade {scope.grade}</span>
                </div>
                
                <div className="text-sm">
                  <p className="font-medium mb-1">Overview:</p>
                  <p className="text-muted-foreground line-clamp-3">
                    {scope.overview || "No overview provided"}
                  </p>
                </div>

                <div className="text-sm">
                  <p className="font-medium mb-1">Curriculum Units:</p>
                  <div className="flex flex-wrap gap-1">
                    <Badge variant="outline" className="text-xs">
                      {scope.entries?.length || 0} Units
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      Standards Aligned
                    </Badge>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2 mt-4">
                <Button variant="outline" size="sm" asChild className="flex-1">
                  <Link href={`/teacher/plan/scope-and-sequence/${scope.id}`}>
                    View Details
                  </Link>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/teacher/plan/scope-and-sequence/${scope.id}/edit`}>
                    Edit
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* État vide */}
      {filteredScopeAndSequences.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <GanttChartSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              {searchTerm || subjectFilter || gradeFilter ? "No matching scope & sequences" : "No scope & sequences yet"}
            </h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm || subjectFilter || gradeFilter 
                ? "Try adjusting your search criteria" 
                : "Start by creating your first scope & sequence to plan your academic year"
              }
            </p>
            <Button asChild className="bg-[#3e81d4] hover:bg-[#2e71c4] text-white">
              <Link href="/teacher/plan/scope-and-sequence/create" className="flex text-white items-center justify-center">
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Scope & Sequence
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
              <p className="text-2xl font-bold">{scopeAndSequences.length}</p>
              <p className="text-sm text-muted-foreground">Total Plans</p>
            </div>
            <div>
              <p className="text-2xl font-bold">
                {scopeAndSequences.reduce((acc, scope) => acc + (scope.entries?.length || 0), 0)}
              </p>
              <p className="text-sm text-muted-foreground">Total Units</p>
            </div>
            <div>
              <p className="text-2xl font-bold">
                {new Set(scopeAndSequences.map(scope => scope.subject_name)).size}
              </p>
              <p className="text-sm text-muted-foreground">Subjects Covered</p>
            </div>
            <div>
              <p className="text-2xl font-bold">
                {new Set(scopeAndSequences.map(scope => scope.grade)).size}
              </p>
              <p className="text-sm text-muted-foreground">Grade Levels</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}