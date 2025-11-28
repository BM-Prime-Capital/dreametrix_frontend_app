"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, Calendar, BookOpen, Loader2 } from "lucide-react";
import { ScopeAndSequenceFormData, ScopeAndSequenceFormProps, ScopeSequenceEntry } from "@/lib/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ClassService, ScopeAndSequenceService, AcademicDataService } from "@/services/plan-service";
import { localStorageKey } from "@/constants/global";

// Type helper pour s'assurer que chaque entrée a un id
interface ScopeSequenceEntryWithId extends Omit<ScopeSequenceEntry, 'id'> {
  id: string;
}

// Options prédéfinies pour les dropdowns
const ASSESSMENT_OPTIONS = [
  "Exit tickets",
  "Class discussions",
  "Homework assignments",
  "Quizzes",
  "Observations",
  "Think-pair-share",
  "One-minute papers",
  "Concept maps",
  "Peer assessments",
  "Self-assessments",
  "KWL charts",
  "Graphic organizers"
];

const SUMMATIVE_ASSESSMENT_OPTIONS = [
  "Unit test",
  "Project",
  "Presentation",
  "Research paper",
  "Portfolio",
  "Performance task",
  "Final exam",
  "Lab report",
  "Essay",
  "Demonstration",
  "Oral examination",
  "Case study"
];

const RESOURCE_OPTIONS = [
  "Textbook",
  "Khan Academy",
  "Manipulatives",
  "Online simulations",
  "Educational videos",
  "Worksheets",
  "Graphic organizers",
  "Anchor charts",
  "Digital tools",
  "Library books",
  "Primary sources",
  "Real-world materials"
];

const MONTH_OPTIONS = [
  "September", "October", "November", "December",
  "January", "February", "March", "April",
  "May", "June", "September-October", "November-December",
  "January-February", "March-April", "May-June", "Full Year"
];

export function ScopeAndSequenceForm({ 
  initialData = undefined, 
  onSubmitSuccess, 
  academicData = null 
}: ScopeAndSequenceFormProps) {
  const accessToken: any = typeof window !== 'undefined' ? localStorage.getItem(localStorageKey.ACCESS_TOKEN) : null;
  const refreshToken: any = typeof window !== 'undefined' ? localStorage.getItem(localStorageKey.REFRESH_TOKEN) : null;
  const tenantData: any = typeof window !== 'undefined' ? localStorage.getItem(localStorageKey.TENANT_DATA) : null;
  const { primary_domain } = tenantData ? JSON.parse(tenantData) : { primary_domain: '' };
  const tenantPrimaryDomain = `https://${primary_domain}`;
  
  // Générer les années académiques (année actuelle + 4 années précédentes et suivantes)
  const currentYear = new Date().getFullYear();
  const academicYears = Array.from({ length: 9 }, (_, i) => {
    const year = currentYear - 4 + i;
    return `${year}-${year + 1}`;
  });

  const [academicYear, setAcademicYear] = useState(initialData?.academicYear || `${currentYear}-${currentYear + 1}`);
  const [subject, setSubject] = useState(initialData?.subject || "");
  const [gradeLevel, setGradeLevel] = useState(initialData?.gradeLevel || "");
  const [overview, setOverview] = useState(initialData?.overview || "");

  const [classes, setClasses] = useState<{ id: number; subject: string; grade: string }[]>([]);
  const [isLoadingSubjects, setIsLoadingSubjects] = useState(false);
  
  const [availableGrades, setAvailableGrades] = useState<number[]>([]);
  const [isLoadingGrades, setIsLoadingGrades] = useState(false);
  const [availableDomains, setAvailableDomains] = useState<string[]>([]);
  const [isLoadingDomains, setIsLoadingDomains] = useState(false);
  
  // NOUVEAU : États pour les standards
  const [selectedDomain, setSelectedDomain] = useState<string>("");
  const [availableStandards, setAvailableStandards] = useState<string[]>([]);
  const [isLoadingStandards, setIsLoadingStandards] = useState(false);

  // Fonction pour normaliser les entrées avec des IDs
  const normalizeEntries = (entries?: ScopeSequenceEntry[]): ScopeSequenceEntryWithId[] => {
    if (!entries || entries.length === 0) {
      return [
        {
          id: '1',
          month: '',
          topic: '',
          standard_code: '',
          learning_objective: '',
          essential_questions: '',
          vocabulary: '',
          resources: '',
          formative_assessments: '',
          summative_assessments: '',
          duration_weeks: 2
        }
      ];
    }

    return entries.map((entry, index) => ({
      ...entry,
      id: (entry as any).id || `entry-${Date.now()}-${index}`
    }));
  };

  const [entries, setEntries] = useState<ScopeSequenceEntryWithId[]>(
    () => normalizeEntries(initialData?.entries)
  );

  // Charger les classes (subjects et grades)
  useEffect(() => {
    const fetchClasses = async () => {
      if (!accessToken || !tenantPrimaryDomain) return;
      
      try {
        setIsLoadingSubjects(true);
        const data = await ClassService.list(tenantPrimaryDomain, accessToken);
        setClasses(data);
      } catch (err) {
        console.error("Error loading classes:", err);
      } finally {
        setIsLoadingSubjects(false);
      }
    };
    
    fetchClasses();
  }, [tenantPrimaryDomain, accessToken, academicData]);

  // Mettre à jour les grades disponibles quand le subject change
  useEffect(() => {
    const loadGradesForSubject = async () => {
      if (!subject || !accessToken || !tenantPrimaryDomain) {
        setAvailableGrades([]);
        return;
      }

      try {
        setIsLoadingGrades(true);
        console.log(`📊 Loading grades for subject: ${subject}`);
        
        const grades = await AcademicDataService.getGradesBySubject(
          tenantPrimaryDomain,
          accessToken,
          subject
        );
        
        console.log(`✅ Grades loaded for ${subject}:`, grades);
        setAvailableGrades(grades);
        
      } catch (error) {
        console.error(`❌ Error loading grades for ${subject}:`, error);
        
        if (academicData?.gradesBySubject?.[subject]) {
          console.log(`🔄 Using cached grades for ${subject}`);
          setAvailableGrades(academicData.gradesBySubject[subject]);
        } else {
          const gradesFromClasses = [...new Set(classes
            .filter(cls => cls.subject === subject)
            .map(cls => parseInt(cls.grade))
          )].sort((a, b) => a - b);
          console.log(`🔄 Using class-based grades for ${subject}:`, gradesFromClasses);
          setAvailableGrades(gradesFromClasses);
        }
      } finally {
        setIsLoadingGrades(false);
      }
      
      setGradeLevel("");
      setAvailableDomains([]);
      setSelectedDomain("");
      setAvailableStandards([]);
    };

    loadGradesForSubject();
  }, [subject, accessToken, tenantPrimaryDomain, academicData, classes]);

  // Charger les domains quand le subject et le grade changent
  useEffect(() => {
    const loadDomains = async () => {
      if (!subject || !gradeLevel || !accessToken || !tenantPrimaryDomain) {
        setAvailableDomains([]);
        setSelectedDomain("");
        setAvailableStandards([]);
        return;
      }

      try {
        setIsLoadingDomains(true);
        
        let domains: string[] = [];
        
        const cacheKey = `${subject}-${gradeLevel}`;
        if (academicData?.domainsBySubjectGrade?.[cacheKey]) {
          domains = academicData.domainsBySubjectGrade[cacheKey];
        } else {
          domains = await AcademicDataService.getDomainsBySubjectAndGrade(
            tenantPrimaryDomain,
            accessToken,
            subject,
            parseInt(gradeLevel)
          );
        }
        
        setAvailableDomains(domains);
        setSelectedDomain("");
        setAvailableStandards([]);
      } catch (error) {
        console.error(`Error loading domains for ${subject} grade ${gradeLevel}:`, error);
        setAvailableDomains([]);
        setSelectedDomain("");
        setAvailableStandards([]);
      } finally {
        setIsLoadingDomains(false);
      }
    };

    loadDomains();
  }, [subject, gradeLevel, accessToken, tenantPrimaryDomain, academicData]);

  // NOUVEAU : Charger les standards quand un domain est sélectionné
  useEffect(() => {
    const loadStandardsForDomain = async () => {
      if (!subject || !gradeLevel || !selectedDomain || !accessToken || !tenantPrimaryDomain) {
        setAvailableStandards([]);
        return;
      }

      try {
        setIsLoadingStandards(true);
        console.log(`📝 Loading standards for domain: ${selectedDomain}`);
        
        const standards = await AcademicDataService.getStandardsByDomain(
          tenantPrimaryDomain,
          accessToken,
          subject,
          parseInt(gradeLevel),
          selectedDomain
        );
        
        console.log(`✅ Standards loaded for ${selectedDomain}:`, standards);
        setAvailableStandards(standards);
        
      } catch (error) {
        console.error(`❌ Error loading standards for domain ${selectedDomain}:`, error);
        setAvailableStandards([]);
      } finally {
        setIsLoadingStandards(false);
      }
    };

    loadStandardsForDomain();
  }, [selectedDomain, subject, gradeLevel, accessToken, tenantPrimaryDomain]);

  const addEntry = () => {
    setEntries([...entries, {
      id: `entry-${Date.now()}-${entries.length}`,
      month: '',
      topic: '',
      standard_code: '',
      learning_objective: '',
      essential_questions: '',
      vocabulary: '',
      resources: '',
      formative_assessments: '',
      summative_assessments: '',
      duration_weeks: 2
    }]);
  };

  const removeEntry = (id: string) => {
    setEntries(entries.filter(entry => entry.id !== id));
  };

  const updateEntry = (id: string, field: keyof ScopeSequenceEntryWithId, value: string | number) => {
    setEntries(entries.map(entry => 
      entry.id === id ? { ...entry, [field]: value } : entry
    ));
  };

  // Obtenir les subjects disponibles
  const getAvailableSubjects = () => {
    const subjectsFromClasses = [...new Set(classes.map(cls => cls.subject))];
    
    if (academicData?.subjects && academicData.subjects.length > 0) {
      const allSubjects = [...new Set([...subjectsFromClasses, ...academicData.subjects])];
      return allSubjects.sort();
    }
    
    return subjectsFromClasses.sort();
  };

  const handleSubmit = async () => {
    if (!academicYear.trim()) {
      alert("Please enter an academic year");
      return;
    }

    if (!subject.trim()) {
      alert("Please select a subject");
      return;
    }

    if (!gradeLevel.trim()) {
      alert("Please select a grade level");
      return;
    }

    if (!overview.trim()) {
      alert("Please provide an overview");
      return;
    }

    const selectedClass = classes.find(cls => 
      cls.subject === subject && cls.grade === gradeLevel
    );

    if (!selectedClass) {
      alert("Please select a valid subject and grade level combination");
      return;
    }

    const hasEmptyRequiredFields = entries.some(entry => 
      !entry.standard_code?.trim() || 
      !entry.learning_objective?.trim() || 
      !entry.formative_assessments?.trim() || 
      !entry.summative_assessments?.trim()
    );

    if (hasEmptyRequiredFields) {
      alert("Please fill all required fields in all units (Standards, Learning Objectives, Formative and Summative Assessments)");
      return;
    }

    // Préparer le payload pour l'API (enlever les IDs pour le backend)
    const payload = {
      academic_year: academicYear,
      course: selectedClass.id,
      grade_level: gradeLevel,
      overview: overview,
      title: `${subject} - Grade ${gradeLevel} - ${academicYear}`,
      entries: entries.map(({ id, ...entry }) => entry), // Enlever l'id pour le backend
    };

    console.log("📤 Sending payload:", payload);

    try {
      const result = await ScopeAndSequenceService.create(
        tenantPrimaryDomain,
        accessToken,
        payload as any
      );
      console.log("✅ Scope & Sequence created:", result);
      if (onSubmitSuccess) onSubmitSuccess(result);
    } catch (error: any) {
      console.error("❌ Error submitting Scope & Sequence:", error);
      alert(`Error: ${error.message || "Unknown error"}`);
    }
  };

  // Dans votre composant, ajoutez ces nouveaux états
const [selectedStandard, setSelectedStandard] = useState<string>("");
const [availableStrands, setAvailableStrands] = useState<string[]>([]);
const [isLoadingStrands, setIsLoadingStrands] = useState(false);

// Effet pour charger les strands quand le standard change (pour ELA)
useEffect(() => {
  const loadStrandsForELA = async () => {
    if (subject !== 'ELA' || !gradeLevel || !selectedStandard || !accessToken || !tenantPrimaryDomain) {
      setAvailableStrands([]);
      setSelectedDomain("");
      setAvailableStandards([]);
      return;
    }

    try {
      setIsLoadingStrands(true);
      console.log(`📖 Loading strands for ELA standard: ${selectedStandard}`);
      
      const strands = await AcademicDataService.getStrandsForELA(
        tenantPrimaryDomain,
        accessToken,
        parseInt(gradeLevel),
        selectedStandard
      );
      
      console.log(`✅ Strands loaded for ${selectedStandard}:`, strands);
      setAvailableStrands(strands);
      setSelectedDomain("");
      setAvailableStandards([]);
      
    } catch (error) {
      console.error(`❌ Error loading strands for ELA standard ${selectedStandard}:`, error);
      setAvailableStrands([]);
      setSelectedDomain("");
      setAvailableStandards([]);
    } finally {
      setIsLoadingStrands(false);
    }
  };

  loadStrandsForELA();
}, [selectedStandard, subject, gradeLevel, accessToken, tenantPrimaryDomain]);

// Effet modifié pour charger les standards
useEffect(() => {
  const loadStandardsForDomain = async () => {
    if (!subject || !gradeLevel || !selectedDomain || !accessToken || !tenantPrimaryDomain) {
      setAvailableStandards([]);
      return;
    }

    try {
      setIsLoadingStandards(true);
      console.log(`📝 Loading standards for domain: ${selectedDomain}`);
      
      // Pour ELA, on passe le standard en paramètre supplémentaire
      const standards = await AcademicDataService.getStandardsByDomain(
        tenantPrimaryDomain,
        accessToken,
        subject,
        parseInt(gradeLevel),
        selectedDomain,
        subject === 'ELA' ? selectedStandard : undefined // Passer le standard seulement pour ELA
      );
      
      console.log(`✅ Standards loaded for ${selectedDomain}:`, standards);
      setAvailableStandards(standards);
      
    } catch (error) {
      console.error(`❌ Error loading standards for domain ${selectedDomain}:`, error);
      setAvailableStandards([]);
    } finally {
      setIsLoadingStandards(false);
    }
  };

  loadStandardsForDomain();
}, [selectedDomain, selectedStandard, subject, gradeLevel, accessToken, tenantPrimaryDomain]);

// Réinitialiser les états quand le subject change
useEffect(() => {
  setSelectedStandard("");
  setAvailableStrands([]);
  setSelectedDomain("");
  setAvailableStandards([]);
}, [subject]);

// Réinitialiser les états quand le grade change
useEffect(() => {
  setSelectedStandard("");
  setAvailableStrands([]);
  setSelectedDomain("");
  setAvailableStandards([]);
}, [gradeLevel]);

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader className="bg-blue-50 border-b">
        <CardTitle className="font-headline flex items-center gap-2">
          <Calendar className="h-6 w-6" />
          Scope & Sequence Planner
        </CardTitle>
        <CardDescription>
          Plan your academic year with NY State Standards alignment
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        {/* En-tête du formulaire */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Academic Year - DROPDOWN */}
          <div className="space-y-2">
            <Label htmlFor="academicYear">Academic Year *</Label>
            <Select
              value={academicYear}
              onValueChange={setAcademicYear}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select academic year" />
              </SelectTrigger>
              <SelectContent>
                {academicYears.map((year) => (
                  <SelectItem key={year} value={year}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Subject */}
          <div className="space-y-2">
            <Label htmlFor="subject">Subject *</Label>
            <Select
              value={subject}
              onValueChange={setSubject}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder={isLoadingSubjects ? "Loading subjects..." : "Select subject"} />
              </SelectTrigger>
              <SelectContent>
                {isLoadingSubjects ? (
                  <div className="p-2 text-center">
                    <Loader2 className="h-4 w-4 animate-spin mx-auto" />
                    <p className="text-xs text-muted-foreground mt-1">Loading subjects...</p>
                  </div>
                ) : (
                  getAvailableSubjects().map((subjectItem) => (
                    <SelectItem key={subjectItem} value={subjectItem}>
                      {subjectItem}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Grade Level */}
          <div className="space-y-2">
            <Label htmlFor="gradeLevel">Grade Level *</Label>
            <Select
              value={gradeLevel}
              onValueChange={setGradeLevel}
              disabled={!subject || isLoadingGrades}
            >
              <SelectTrigger className="w-full">
                <SelectValue 
                  placeholder={
                    !subject ? "Select subject first" : 
                    isLoadingGrades ? "Loading grades..." :
                    availableGrades.length === 0 ? "No grades available" : 
                    "Select grade"
                  } 
                />
              </SelectTrigger>
              <SelectContent>
                {availableGrades.map((grade) => (
                  <SelectItem key={grade} value={grade.toString()}>
                    Grade {grade}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {isLoadingGrades && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Loader2 className="h-3 w-3 animate-spin" />
                Loading available grades...
              </div>
            )}
          </div>
        </div>

        {/* Overview */}
        <div className="mb-8">
          <Label htmlFor="overview">Year Overview *</Label>
          <Textarea
            id="overview"
            placeholder="Describe the overall curriculum trajectory for the academic year..."
            value={overview}
            onChange={(e) => setOverview(e.target.value)}
            rows={3}
            className="mt-2"
          />
        </div>

        {/* Entrées par unité */}
        <div className="space-y-6">
          {entries.map((entry, index) => (
            <Card key={entry.id} className="border-l-4 border-l-blue-500">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    Unit {index + 1}
                  </h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeEntry(entry.id)}
                    disabled={entries.length === 1}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                  {/* Month/Term - DROPDOWN */}
                  <div className="space-y-2">
                    <Label>Month/Term</Label>
                    <Select
                      value={entry.month}
                      onValueChange={(value) => updateEntry(entry.id, 'month', value)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select month or term" />
                      </SelectTrigger>
                      <SelectContent>
                        {MONTH_OPTIONS.map((month) => (
                          <SelectItem key={month} value={month}>
                            {month}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Duration (weeks)</Label>
                    <Input
                      type="number"
                      value={entry.duration_weeks}
                      onChange={(e) => updateEntry(entry.id, 'duration_weeks', parseInt(e.target.value) || 1)}
                      min="1"
                      max="12"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Unit Topic</Label>
                    <Input
                      value={entry.topic}
                      onChange={(e) => updateEntry(entry.id, 'topic', e.target.value)}
                      placeholder="Ratios and Proportional Relationships"
                    />
                  </div>

                  {/* NOUVEAU : Sélection en deux étapes - Domain puis Standard */}
                
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {/* Pour ELA: Afficher Standard puis Strand */}
                    {subject === 'ELA' ? (
                      <>
                        {/* Standard Selection pour ELA */}
                        <div className="space-y-2">
                          <Label>ELA Standard *</Label>
                          <Select
                            value={selectedStandard}
                            onValueChange={setSelectedStandard}
                            disabled={!subject || !gradeLevel || isLoadingDomains}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue 
                                placeholder={
                                  !subject || !gradeLevel 
                                    ? "Select subject and grade first" 
                                    : isLoadingDomains 
                                    ? "Loading standards..." 
                                    : availableDomains.length === 0
                                    ? "No standards available"
                                    : "Select ELA standard"
                                } 
                              />
                            </SelectTrigger>
                            <SelectContent>
                              {availableDomains.map((standard) => (
                                <SelectItem key={standard} value={standard}>
                                  {standard}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {isLoadingDomains && (
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Loader2 className="h-3 w-3 animate-spin" />
                              Loading ELA standards...
                            </div>
                          )}
                        </div>

                        {/* Strand Selection pour ELA */}
                        <div className="space-y-2">
                          <Label>ELA Strand *</Label>
                          <Select
                            value={selectedDomain}
                            onValueChange={setSelectedDomain}
                            disabled={!selectedStandard || isLoadingStrands}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue 
                                placeholder={
                                  !selectedStandard 
                                    ? "Select ELA standard first" 
                                    : isLoadingStrands 
                                    ? "Loading strands..." 
                                    : availableStrands.length === 0
                                    ? "No strands available"
                                    : "Select strand"
                                } 
                              />
                            </SelectTrigger>
                            <SelectContent>
                              {availableStrands.map((strand) => (
                                <SelectItem key={strand} value={strand}>
                                  {strand}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {isLoadingStrands && (
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Loader2 className="h-3 w-3 animate-spin" />
                              Loading strands...
                            </div>
                          )}
                        </div>
                      </>
                    ) : (
                      /* Pour Math: Afficher Domain seulement */
                      <div className="space-y-2 lg:col-span-2">
                        <Label>Domain *</Label>
                        <Select
                          value={selectedDomain}
                          onValueChange={setSelectedDomain}
                          disabled={!subject || !gradeLevel || isLoadingDomains}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue 
                              placeholder={
                                !subject || !gradeLevel 
                                  ? "Select subject and grade first" 
                                  : isLoadingDomains 
                                  ? "Loading domains..." 
                                  : availableDomains.length === 0
                                  ? "No domains available"
                                  : "Select domain"
                              } 
                            />
                          </SelectTrigger>
                          <SelectContent>
                            {availableDomains.map((domain) => (
                              <SelectItem key={domain} value={domain}>
                                {domain}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {isLoadingDomains && (
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Loader2 className="h-3 w-3 animate-spin" />
                            Loading domains...
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Standard Selection (commun pour Math et ELA) */}
                  <div className="space-y-2">
                    <Label>NY State Standard *</Label>
                    <Select
                      value={entry.standard_code}
                      onValueChange={(value) => updateEntry(entry.id, 'standard_code', value)}
                      disabled={!selectedDomain || isLoadingStandards || (subject === 'ELA' && !selectedStandard)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue 
                          placeholder={
                            !selectedDomain 
                              ? (subject === 'ELA' ? "Select strand first" : "Select domain first")
                              : isLoadingStandards 
                              ? "Loading standards..." 
                              : availableStandards.length === 0
                              ? "No standards available"
                              : "Select standard"
                          } 
                        />
                      </SelectTrigger>
                      <SelectContent className="max-h-60">
                        {availableStandards.map((standard) => (
                          <SelectItem key={standard} value={standard}>
                            {standard}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {isLoadingStandards && (
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Loader2 className="h-3 w-3 animate-spin" />
                        Loading standards...
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Learning Objectives *</Label>
                    <Textarea
                      value={entry.learning_objective}
                      onChange={(e) => updateEntry(entry.id, 'learning_objective', e.target.value)}
                      placeholder="Students will be able to understand ratio concepts and use ratio language..."
                      rows={2}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Essential Questions</Label>
                    <Textarea
                      value={entry.essential_questions}
                      onChange={(e) => updateEntry(entry.id, 'essential_questions', e.target.value)}
                      placeholder="How can ratios help us understand relationships between quantities?"
                      rows={2}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Vocabulary</Label>
                    <Textarea
                      value={entry.vocabulary}
                      onChange={(e) => updateEntry(entry.id, 'vocabulary', e.target.value)}
                      placeholder="ratio, proportion, equivalent ratios, unit rate"
                      rows={2}
                    />
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {/* Formative Assessments - DROPDOWN */}
                    <div className="space-y-2">
                      <Label>Formative Assessments *</Label>
                      <Select
                        value={entry.formative_assessments}
                        onValueChange={(value) => updateEntry(entry.id, 'formative_assessments', value)}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select formative assessments" />
                        </SelectTrigger>
                        <SelectContent>
                          {ASSESSMENT_OPTIONS.map((assessment) => (
                            <SelectItem key={assessment} value={assessment}>
                              {assessment}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Summative Assessments - DROPDOWN */}
                    <div className="space-y-2">
                      <Label>Summative Assessments *</Label>
                      <Select
                        value={entry.summative_assessments}
                        onValueChange={(value) => updateEntry(entry.id, 'summative_assessments', value)}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select summative assessments" />
                        </SelectTrigger>
                        <SelectContent>
                          {SUMMATIVE_ASSESSMENT_OPTIONS.map((assessment) => (
                            <SelectItem key={assessment} value={assessment}>
                              {assessment}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Resources & Materials - DROPDOWN */}
                  <div className="space-y-2">
                    <Label>Resources & Materials</Label>
                    <Select
                      value={entry.resources}
                      onValueChange={(value) => updateEntry(entry.id, 'resources', value)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select resources and materials" />
                      </SelectTrigger>
                      <SelectContent>
                        {RESOURCE_OPTIONS.map((resource) => (
                          <SelectItem key={resource} value={resource}>
                            {resource}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Button type="button" onClick={addEntry} className="w-full mt-4">
          <Plus className="h-4 w-4 mr-2" />
          Add Unit
        </Button>

        <div className="flex justify-end gap-4 mt-8 pt-6 border-t">
          <Button variant="outline" type="button">
            Save Draft
          </Button>
          <Button 
            className="bg-blue-600 hover:bg-blue-700"
            onClick={handleSubmit}
            type="button"
            disabled={!subject || !gradeLevel || !academicYear || !overview}
          >
            Create Scope & Sequence
          </Button>
        </div>

        <div className="mt-4 text-sm text-muted-foreground">
          * Required fields
        </div>
      </CardContent>
    </Card>
  );
}