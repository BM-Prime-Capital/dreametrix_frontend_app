/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Card } from "@/components/ui/card";
import PageTitleH1 from "@/components/ui/page-title-h1";
import { useEffect, useState } from "react";
import GenerateAssessmentDialog from "./GenerateAssessmentDialog";
import MultiSelectList from "../MultiSelectionList";
import { useList } from "@/hooks/useList";
import {
  getDomains,
  getGrades,
  getQuestionsLinks,
  getStandards,
  getSubjects,
} from "@/services/DigitalLibraryService";
import {
  fetchElaStandards,
  fetchElaStrands,
  fetchElaSpecificStandards,
  fetchElaQuestionLinks,
  generateElaPdf,
} from "@/services/ElaService";
import { useRequestInfo } from "@/hooks/useRequestInfo";
import { getClasses } from "@/services/ClassService";
import { DigitalLibrarySheet, ISchoolClass } from "@/types";
import { localStorageKey } from "@/constants/global";
import { Button } from "../ui/button";
import { LoaderDialog } from "../ui/loader-dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Checkbox } from "../ui/checkbox";
import { Alert, AlertDescription } from "../ui/alert";
import { useSearchParams } from "next/navigation";

const GRADEBOOK_SHEET_INIT_STATE = {
  subject: "",
  grade: "",
  domain: "",
  questionType: "MC",
  studentsClass: [],
  noOfQuestions: "",
  generateAnswerSheet: false,
  includeAnswerKey: false,
  assignmentType: "homework",
};

export default function DigitalLibrary() {
  const {
    list: initialClasses,
    isLoading: classesIsLoading,
    //error: classesError,
  } = useList(getClasses);

  const { tenantDomain, accessToken, refreshToken } = useRequestInfo();
  const loadedSelectedClass = localStorage.getItem("selectedClass");

  const userData = JSON.parse(localStorage.getItem(localStorageKey.USER_DATA)!);
  const [questionsLinks, setQuestionsLinks] = useState<{
    links: string[];
    question_count: number;
  } | null>(null);

  const [allClasses, setAllClasses] = useState<any[]>([]);

  const [checkedClasses, setCheckedClasses] = useState<string[]>([]);
  const [checkedStandards, setCheckedStandards] = useState<string[]>([]);
  const [selectedClass, setSelectedClass] = useState<ISchoolClass | null>(null);

  const [isDreaMetrixBankOfQuestion, setIsDreaMetrixBankOfQuestion] =
    useState(false);

  const [digitalLibrarySheet, setDigitalLibrarySheet] =
    useState<DigitalLibrarySheet>(GRADEBOOK_SHEET_INIT_STATE);

  //const [isLoadingFileError, setIsLoadingFileError] = useState(false);

  const [sheetDomains, setSheetDomains] = useState<string[]>([]);

  // ELA-specific state variables
  const [isElaSubjectSelected, setIsElaSubjectSelected] = useState(false);
  const [elaStepActive, setElaStepActive] = useState(false);
  const [elaStandards, setElaStandards] = useState<string[]>([]);
  const [selectedElaStandard, setSelectedElaStandard] = useState("");
  const [elaStrands, setElaStrands] = useState<string[]>([]);
  const [selectedElaStrand, setSelectedElaStrand] = useState("");
  const [, setElaSpecificStandards] = useState<string[]>(
    []
  );
  const [isLoadingElaData, setIsLoadingElaData] = useState(false);
  const [isLoadingQuestionLinks, setIsLoadingQuestionLinks] = useState(false);

  const {
    list: subjects,
    isLoading: isLoadingSubjects,
    //error: errorSubjects,
  } = useList(getSubjects);

  const [grades, setGrades] = useState<string[]>([]); // Au lieu de useState<any[]>([])
  const [standards, setStandards] = useState<any[]>([]);
  const [standardsAreLoading, setStandardsAreLoading] = useState<boolean>(true);
  const [fileStream, setFileStream] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSubjectLoadAutomaticaly, setIsSubjectLoadAutomaticaly] =
    useState<boolean>(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Assignment context state
  const [assignmentContext, setAssignmentContext] = useState<{
    assignmentName?: string;
    courseId?: string;
    courseName?: string;
    dueDate?: string;
    assignmentType?: string;
    published?: string;
  } | null>(null);

  // Auto-population state
  const [pendingAutoPopulation, setPendingAutoPopulation] = useState<{
    extractedSubject?: string;
    extractedGrade?: string;
    extractedAssignmentType?: string;
  } | null>(null);

  // Flag to track if we're in auto-population mode
  const [isAutoPopulating, setIsAutoPopulating] = useState(false);

  // Auto-population progress state
  const [autoPopulationProgress, setAutoPopulationProgress] = useState<{
    currentStep: string;
    totalSteps: number;
    currentStepIndex: number;
  } | null>(null);

  const searchParams = useSearchParams();

  useEffect(() => {
    // Parse and set assignment context from query parameters
    const assignmentName = searchParams.get("assignmentName");
    const courseId = searchParams.get("courseId");
    const courseName = searchParams.get("courseName");
    const subject = searchParams.get("subject");
    const grade = searchParams.get("grade");
    const dueDate = searchParams.get("dueDate");
    const assignmentType = searchParams.get("assignmentType");
    const published = searchParams.get("published");

    // Set assignment type immediately and independently
    if (assignmentType) {
      console.log("🎯 Setting assignment type from URL:", assignmentType);
      setDigitalLibrarySheet((prev) => ({
        ...prev,
        assignmentType: assignmentType,
      }));
    }

    if (assignmentName || courseId) {
      setAssignmentContext({
        assignmentName: assignmentName || undefined,
        courseId: courseId || undefined,
        courseName: courseName || undefined,
        dueDate: dueDate || undefined,
        assignmentType: assignmentType || undefined,
        published: published || undefined,
      });

      // Extract subject and grade for auto-population
      let extractedSubject = subject;
      let extractedGrade = grade;

      // Parse course name for grade and subject (e.g., "Class 8 - ELA")
      if (courseName && !subject && !grade) {
        const courseNameMatch = courseName.match(/class\s+(\d+)\s*-\s*(.+)/i);
        if (courseNameMatch) {
          extractedGrade = courseNameMatch[1]; // Extract grade number
          const subjectPart = courseNameMatch[2].trim().toUpperCase();

          // Map common subject abbreviations to full names
          const subjectMapping: { [key: string]: string } = {
            ELA: "ELA",
            ENGLISH: "ELA",
            MATH: "Math",
            MATHEMATICS: "Math",
            SCIENCE: "Science",
            "SOCIAL STUDIES": "Social Studies",
            SS: "Social Studies",
            HISTORY: "Social Studies",
          };

          extractedSubject = subjectMapping[subjectPart] || subjectPart;
        }
      }

      // Store extracted values for later auto-population including assignmentType
      setPendingAutoPopulation({
        extractedSubject: extractedSubject || undefined,
        extractedGrade: extractedGrade || undefined,
        extractedAssignmentType: assignmentType || undefined,
      });
    }
  }, [searchParams]);

  // Handle auto-population when subjects are loaded
  useEffect(() => {
    if (
      pendingAutoPopulation &&
      !isLoadingSubjects &&
      subjects.length > 0 &&
      !classesIsLoading &&
      initialClasses.length > 0 &&
      !isAutoPopulating
    ) {
      const { extractedSubject, extractedAssignmentType } =
        pendingAutoPopulation;

      console.log("🚀 Starting auto-population:", {
        extractedSubject,
        extractedAssignmentType,
        classesCount: initialClasses.length,
        subjectsCount: subjects.length,
      });

      // First ensure assignmentType is set if available
      if (extractedAssignmentType) {
        console.log(
          "🎯 Re-setting assignment type before subject auto-population:",
          extractedAssignmentType
        );
        setDigitalLibrarySheet((prev) => ({
          ...prev,
          assignmentType: extractedAssignmentType,
        }));
      }

      // Auto-populate subject if it exists in subjects list
      if (extractedSubject && subjects.includes(extractedSubject)) {
        console.log("Auto-populating subject:", extractedSubject);
        setIsAutoPopulating(true);
        setAutoPopulationProgress({
          currentStep: "Setting up subject and assignment type...",
          totalSteps: 3,
          currentStepIndex: 1,
        });

        // Use setTimeout to ensure the assignmentType state update is applied first
        setTimeout(() => {
          handleSubjectSelection(extractedSubject);
        }, 0);
      } else {
        // Clear pending if subject not found
        setPendingAutoPopulation(null);
      }
    }
  }, [
    pendingAutoPopulation,
    isLoadingSubjects,
    subjects,
    isAutoPopulating,
    classesIsLoading,
    initialClasses,
  ]);

  // Handle auto-population of grade after subject selection completes
  useEffect(() => {
    if (
      isAutoPopulating &&
      pendingAutoPopulation?.extractedGrade &&
      pendingAutoPopulation?.extractedSubject &&
      grades.length > 0 &&
      !classesIsLoading &&
      initialClasses.length > 0
    ) {
      const { extractedGrade, extractedSubject } = pendingAutoPopulation;

      console.log("🔍 Auto-population grade check:", {
        extractedGrade,
        availableGrades: grades,
        directMatch: grades.includes(extractedGrade),
        classesLoaded: !classesIsLoading,
        classesCount: initialClasses.length,
      });

      // Check if the extracted grade exists in the loaded grades (direct match first)
      let matchedGrade = extractedGrade;
      if (grades.includes(extractedGrade)) {
        console.log("Direct grade match found:", extractedGrade);
      } else {
        // Try to find a fuzzy match
        const gradeNumber = extractedGrade;
        const possibleMatches = grades.filter(
          (grade) =>
            String(grade).includes(gradeNumber) ||
            grade === `Grade ${gradeNumber}` ||
            grade === `${gradeNumber}th Grade` ||
            grade === `${gradeNumber}th` ||
            String(grade)
              .toLowerCase()
              .includes(`grade ${gradeNumber.toLowerCase()}`)
        );

        console.log("🔍 Fuzzy grade matches:", possibleMatches);

        if (possibleMatches.length > 0) {
          matchedGrade = possibleMatches[0];
          console.log("Fuzzy grade match found:", matchedGrade);
        } else {
          console.log("No grade match found for:", extractedGrade);
          // Clear pending auto-population and flag
          setPendingAutoPopulation(null);
          setIsAutoPopulating(false);
          setAutoPopulationProgress(null);
          return;
        }
      }

      console.log("Auto-populating grade:", matchedGrade);

      // Update progress
      setAutoPopulationProgress({
        currentStep: "Loading grade options and filtering classes...",
        totalSteps: 3,
        currentStepIndex: 2,
      });

      // Set the grade in the state first
      setDigitalLibrarySheet((prev) => ({
        ...prev,
        grade: matchedGrade,
      }));

      // Then trigger grade selection with explicit subject and grade
      // Add a small delay to ensure classes are fully loaded
      setTimeout(() => {
        handleGradeSelectionWithSubject(matchedGrade, extractedSubject);
      }, 100);

      // Update to final step
      setTimeout(() => {
        setAutoPopulationProgress({
          currentStep: "Finalizing form setup...",
          totalSteps: 3,
          currentStepIndex: 3,
        });
      }, 800);

      // Clear pending auto-population and flag after a longer delay to ensure completion
      setTimeout(() => {
        setPendingAutoPopulation(null);
        setIsAutoPopulating(false);
        setAutoPopulationProgress(null);
        console.log("Auto-population completed successfully!");
      }, 2000);
    }
  }, [
    isAutoPopulating,
    pendingAutoPopulation,
    grades,
    classesIsLoading,
    initialClasses,
  ]);

  // Additional effect to handle classes loading completion during auto-population
  useEffect(() => {
    if (
      isAutoPopulating &&
      !classesIsLoading &&
      initialClasses.length > 0 &&
      digitalLibrarySheet.grade &&
      digitalLibrarySheet.subject &&
      allClasses.length === 0 // Classes haven't been filtered yet
    ) {
      console.log(
        "🔄 Classes just finished loading during auto-population, re-filtering..."
      );

      // Re-trigger classes filtering since classes just finished loading
      setTimeout(() => {
        handleGradeSelectionWithSubject(
          digitalLibrarySheet.grade,
          digitalLibrarySheet.subject
        );
      }, 100);
    }
  }, [
    classesIsLoading,
    initialClasses,
    isAutoPopulating,
    digitalLibrarySheet.grade,
    digitalLibrarySheet.subject,
    allClasses.length,
  ]);

  const handleSubjectSelection = async (selectedSubject: string) => {
    console.log("🔄 Subject Selection:", {
      selectedSubject,
      currentSubject: digitalLibrarySheet.subject,
      currentAssignmentType: digitalLibrarySheet.assignmentType,
    });

    // Update progress if we're in auto-population mode
    if (isAutoPopulating) {
      setAutoPopulationProgress({
        currentStep: "Loading available grades for subject...",
        totalSteps: 3,
        currentStepIndex: 2,
      });
    }

    setDigitalLibrarySheet((prev) => {
      console.log("🔍 Previous state in handleSubjectSelection:", {
        assignmentType: prev.assignmentType,
        subject: prev.subject,
      });

      const newState = {
        ...prev,
        subject: selectedSubject,
        grade: "",
        domain: "",
        // Explicitly preserve assignmentType
        assignmentType: prev.assignmentType,
      };

      console.log("New state in handleSubjectSelection:", {
        assignmentType: newState.assignmentType,
        subject: newState.subject,
      });

      return newState;
    });

    // Reset ELA-specific state for all subjects
    if (selectedSubject === "ELA") {
      setIsElaSubjectSelected(true);
      setElaStepActive(false);
      setElaStandards([]);
      setSelectedElaStandard("");
      setElaStrands([]);
      setSelectedElaStrand("");
      setElaSpecificStandards([]);
    } else {
      setIsElaSubjectSelected(false);
      setElaStepActive(false);
      setElaStandards([]);
      setSelectedElaStandard("");
      setElaStrands([]);
      setSelectedElaStrand("");
      setElaSpecificStandards([]);
    }

    // Reset general standards state when switching subjects
    setStandards([]);
    setCheckedStandards([]);
    setStandardsAreLoading(true);
    setSheetDomains([]);
    setQuestionsLinks(null);

    console.log("[COMPLETE] Reset all states for subject change");

    try {
      const gradeData = await getGrades(
        selectedSubject,
        tenantDomain,
        accessToken,
        refreshToken
      );
      setGrades(gradeData || []); // Fallback to an empty array if GradeData is null/undefined

      // Enhanced classes filtering with better handling for loading states
      console.log("📚 Starting Subject selection - Classes filtering:", {
        selectedSubject,
        initialClassesCount: initialClasses.length,
        classesIsLoading,
        isAutoPopulating,
      });

      // Wait for classes to be loaded if they're still loading during auto-population
      if (classesIsLoading && isAutoPopulating) {
        console.log(
          "⚠️ Classes still loading during auto-population, will retry after load..."
        );
        return; // The useEffect will handle re-triggering once classes are loaded
      }

      const filteredClasses = initialClasses.filter((cl: any) => {
        const subjectMatch =
          cl.subject_in_short === selectedSubject ||
          cl.subject_in_all_letter === selectedSubject;

        console.log(`🔍 Subject filtering for ${cl.name}:`, {
          subject_in_short: cl.subject_in_short,
          subject_in_all_letter: cl.subject_in_all_letter,
          selectedSubject,
          subjectMatch,
        });

        return subjectMatch;
      });

      console.log("📚 Subject selection - Classes filtering result:", {
        selectedSubject,
        initialClassesCount: initialClasses.length,
        filteredClassesCount: filteredClasses.length,
        filteredClasses: filteredClasses.map((cl: any) => ({
          name: cl.name,
          grade: cl.grade,
          subject_in_short: cl.subject_in_short,
          subject_in_all_letter: cl.subject_in_all_letter,
        })),
        isAutoPopulating,
      });

      setAllClasses(filteredClasses);
      setCheckedClasses(filteredClasses.map((cl: any) => cl.name));
    } catch (error) {
      console.error("Error loading grades:", error);
      setGrades([]);
    }
  };

  const handleGradeSelection = async (selectedGrade: string) => {
    // Guard clause to ensure we have valid parameters
    if (!selectedGrade || !digitalLibrarySheet.subject) {
      console.warn("⚠️ handleGradeSelection called with invalid parameters:", {
        selectedGrade,
        subject: digitalLibrarySheet.subject,
      });
      return;
    }

    handleGradeSelectionWithSubject(selectedGrade, digitalLibrarySheet.subject);
  };

  const handleGradeSelectionWithSubject = async (
    selectedGrade: string,
    selectedSubject: string
  ) => {
    // Guard clause to ensure we have valid parameters
    if (!selectedGrade || !selectedSubject) {
      console.warn(
        "⚠️ handleGradeSelectionWithSubject called with invalid parameters:",
        {
          selectedGrade,
          selectedSubject,
        }
      );
      return;
    }

    setDigitalLibrarySheet((prev) => {
      console.log("🔍 Previous state in handleGradeSelectionWithSubject:", {
        assignmentType: prev.assignmentType,
        grade: prev.grade,
      });

      const newState = {
        ...prev,
        grade: selectedGrade,
        domain: "",
        // Explicitly preserve assignmentType during grade selection
        assignmentType: prev.assignmentType,
      };

      console.log("New state in handleGradeSelectionWithSubject:", {
        assignmentType: newState.assignmentType,
        grade: newState.grade,
      });

      return newState;
    });

    // Reset standards-related state when changing grade
    setStandards([]);
    setCheckedStandards([]);
    setStandardsAreLoading(true);
    setQuestionsLinks(null);

    // Handle ELA-specific flow
    if (selectedSubject === "ELA") {
      // Reset ELA-specific state when changing grade
      setSelectedElaStandard("");
      setSelectedElaStrand("");
      setElaStrands([]);
      setElaSpecificStandards([]);

      setElaStepActive(true);
      setIsLoadingElaData(true);

      try {
        // Fetch ELA standards using the real API
        const elaStandardsData = await fetchElaStandards(
          selectedSubject,
          selectedGrade,
          tenantDomain,
          accessToken,
          //refreshToken
        );
        setElaStandards(elaStandardsData || []);
      } catch (error) {
        console.error("Error loading ELA standards:", error);
        setElaStandards([]);
      } finally {
        setIsLoadingElaData(false);
      }
    } else {
      // Regular flow for non-ELA subjects
      const domainsData = await getDomains(
        {
          subject: selectedSubject,
          grade: Number.parseInt(selectedGrade),
        },
        tenantDomain,
        accessToken,
        refreshToken
      );

      setSheetDomains(domainsData);
    }

    // Improved classes filtering with better debugging and error handling
    console.log("🏫 Starting Grade selection - Classes filtering:", {
      selectedGrade,
      selectedSubject,
      initialClassesCount: initialClasses.length,
      initialClassesLoading: classesIsLoading,
      isAutoPopulating,
    });

    // Wait for classes to be loaded if they're still loading
    if (classesIsLoading || initialClasses.length === 0) {
      console.log("⚠️ Classes are still loading or empty, waiting...");

      // For auto-population, wait a bit and retry
      if (isAutoPopulating) {
        setTimeout(() => {
          console.log("🔄 Retrying classes filtering for auto-population...");
          handleGradeSelectionWithSubject(selectedGrade, selectedSubject);
        }, 500);
        return;
      }
    }

    // Enhanced filtering with more detailed comparison
    const filteredClassesForGrade = initialClasses.filter((cl: any) => {
      // Safely normalize grade values for comparison with null checks
      const classGrade = cl.grade?.toString().trim();
      const normalizedSelectedGrade = selectedGrade?.toString().trim();

      // Check grade match (exact or string comparison) with null safety
      const gradeMatch =
        cl.grade === selectedGrade ||
        cl.grade?.toString() === selectedGrade ||
        (classGrade &&
          normalizedSelectedGrade &&
          classGrade === normalizedSelectedGrade) ||
        (classGrade &&
          normalizedSelectedGrade &&
          parseInt(classGrade) === parseInt(normalizedSelectedGrade));

      // Check subject match
      const subjectMatch =
        cl.subject_in_short === selectedSubject ||
        cl.subject_in_all_letter === selectedSubject;

      console.log(`🔍 Class filtering for ${cl.name}:`, {
        classGrade: cl.grade,
        classGradeString: cl.grade?.toString(),
        selectedGrade,
        normalizedSelectedGrade,
        gradeMatch,
        subject_in_short: cl.subject_in_short,
        subject_in_all_letter: cl.subject_in_all_letter,
        selectedSubject,
        subjectMatch,
        overallMatch: gradeMatch && subjectMatch,
      });

      return gradeMatch && subjectMatch;
    });

    console.log("🏫 Grade selection - Classes filtering result:", {
      selectedGrade,
      selectedSubject,
      initialClassesCount: initialClasses.length,
      filteredClassesCount: filteredClassesForGrade.length,
      filteredClasses: filteredClassesForGrade.map((cl: any) => ({
        name: cl.name,
        grade: cl.grade,
        subject_in_short: cl.subject_in_short,
        subject_in_all_letter: cl.subject_in_all_letter,
      })),
      isAutoPopulating,
    });

    setAllClasses(filteredClassesForGrade);
    setCheckedClasses(filteredClassesForGrade.map((cl: any) => cl.name));

    // Additional verification for auto-population
    if (isAutoPopulating) {
      console.log("Auto-population classes filtering completed:", {
        totalClasses: filteredClassesForGrade.length,
        classNames: filteredClassesForGrade.map((cl: any) => cl.name),
      });
    }
  };

  const handleDomainSelection = async (selectedDomain: string) => {
    setDigitalLibrarySheet({
      ...digitalLibrarySheet,
      domain: selectedDomain,
    });

    const standardsData: string[] = await getStandards(
      {
        subject: digitalLibrarySheet.subject,
        grade: Number.parseInt(digitalLibrarySheet.grade),
        domain: selectedDomain,
      },
      tenantDomain,
      accessToken,
      refreshToken
    );
    setStandards(standardsData);
    setCheckedStandards(standardsData);
    setStandardsAreLoading(false);

    const data = {
      subject: digitalLibrarySheet.subject,
      grade: digitalLibrarySheet.grade,
      domain: selectedDomain,
      questionsType: digitalLibrarySheet.questionType,
      standards: standardsData,
    };

    setIsLoadingQuestionLinks(true);
    const questionsLinksData = await getQuestionsLinks(
      data,
      tenantDomain,
      accessToken,
      refreshToken
    );

    console.log("questionsLinksData DT => ", questionsLinksData);

    setQuestionsLinks(questionsLinksData);
    setIsLoadingQuestionLinks(false);
  };

  // ELA handler functions
  const handleElaStandardSelect = async (selectedStandard: string) => {
    setSelectedElaStandard(selectedStandard);

    // Reset strand and specific standards when standard changes
    setSelectedElaStrand("");
    setElaStrands([]);
    setElaSpecificStandards([]);

    // Fetch strands for the selected standard
    if (selectedStandard) {
      setIsLoadingElaData(true);
      try {
        const strandsData = await fetchElaStrands(
          digitalLibrarySheet.subject,
          digitalLibrarySheet.grade,
          selectedStandard,
          tenantDomain,
          accessToken,
          //refreshToken
        );
        setElaStrands(strandsData || []);
      } catch (error) {
        console.error("Error loading ELA strands:", error);
        setElaStrands([]);
      } finally {
        setIsLoadingElaData(false);
      }
    }
  };

  const handleElaStrandSelect = async (selectedStrand: string) => {
    setSelectedElaStrand(selectedStrand);

    // Once both ELA fields are selected, proceed to load specific standards and domains
    if (selectedElaStandard && selectedStrand) {
      setIsLoadingElaData(true);
      try {
        // Fetch specific standards using the real API
        const specificStandardsData = await fetchElaSpecificStandards(
          digitalLibrarySheet.subject,
          digitalLibrarySheet.grade,
          selectedElaStandard,
          selectedStrand,
          tenantDomain,
          accessToken,
          //refreshToken
        );
        setElaSpecificStandards(specificStandardsData || []);

        // Set the specific standards for the MultiSelectList
        setStandards(specificStandardsData || []);
        setCheckedStandards(specificStandardsData || []);
        setStandardsAreLoading(false);

        // Automatically fetch question links with default question type
        if (
          isElaSubjectSelected &&
          specificStandardsData &&
          specificStandardsData.length > 0
        ) {
          console.log(
            "Auto-fetching ELA question links with default question type:",
            digitalLibrarySheet.questionType
          );
          setIsLoadingQuestionLinks(true);
          const formattedStandards =
            specificStandardsData.length > 1
              ? specificStandardsData.join(",")
              : specificStandardsData[0];
          const questionsLinksData = await fetchElaQuestionLinks(
            digitalLibrarySheet.subject,
            digitalLibrarySheet.grade,
            selectedElaStandard,
            selectedStrand,
            formattedStandards,
            digitalLibrarySheet.questionType,
            tenantDomain,
            accessToken,
            //refreshToken
          );
          setQuestionsLinks(questionsLinksData);
          setIsLoadingQuestionLinks(false);
        }
      } catch (error) {
        console.error(
          "Error loading ELA specific standards and domains:",
          error
        );
      } finally {
        setIsLoadingElaData(false);
      }
    }
  };

  const createDigitalLibrary = async (e: any) => {
    e.preventDefault();

    // Different validation for ELA vs non-ELA subjects
    if (isElaSubjectSelected) {
      if (
        !selectedElaStandard ||
        !selectedElaStrand ||
        checkedStandards.length < 1
      ) {
        alert(
          "For ELA: You must select a subject, grade, standard, strand and at least one specific standard"
        );
        return;
      }
    } else {
      if (!digitalLibrarySheet.domain || checkedStandards.length < 1) {
        alert(
          "You have to select a subject, a grade, a domain and at least one standard"
        );
        return;
      }
    }

    if (!digitalLibrarySheet.noOfQuestions) {
      alert("Enter Number of Questions");
      return;
    } else {
      try {
        const numberOfQuestions = Number.parseInt(
          digitalLibrarySheet.noOfQuestions
        );
        if (
          numberOfQuestions < 0 ||
          (questionsLinks && numberOfQuestions > questionsLinks.question_count)
        ) {
          throw Error("Number of Questions is not a valid number.");
        }
      } catch (error) {

        console.log(error)
        alert(
          "Number of questions has to be a value from 1 to " +
            questionsLinks?.question_count
        );
        return;
      }
    }

    setIsLoading(true);

    const standards =
      checkedStandards.length > 1
        ? checkedStandards.join(",")
        : checkedStandards[0];
    const selected_class =
      checkedClasses.length > 1 ? checkedClasses.join(",") : checkedClasses[0];

    const data = {
      subject: digitalLibrarySheet.subject,
      grade: digitalLibrarySheet.grade,
      domain: isElaSubjectSelected ? "" : digitalLibrarySheet.domain, // Use empty domain for ELA subjects
      standards: standards,
      kind: digitalLibrarySheet.questionType,
      selected_class: selected_class,
      generate_answer_sheet: digitalLibrarySheet.generateAnswerSheet,
      include_answer_key: digitalLibrarySheet.includeAnswerKey,
      teacher_name: userData.full_name,
      student_id: 1,
      assignment_type: digitalLibrarySheet.assignmentType || "Homework",
      number_of_questions: digitalLibrarySheet.noOfQuestions,
      links: questionsLinks?.links,
    };

    console.log("DIGITAL LIBRARY POST data => ", data);

    try {
      let blob: Blob;

      if (isElaSubjectSelected) {
        // Use ELA-specific PDF generation API
        const elaPdfData = {
          subject: digitalLibrarySheet.subject,
          grade: digitalLibrarySheet.grade,
          standards_ela: selectedElaStandard,
          strands: selectedElaStrand,
          specifique_standards: standards,
          kind: digitalLibrarySheet.questionType,
          selected_class: selected_class,
          generate_answer_sheet: digitalLibrarySheet.generateAnswerSheet,
          include_answer_key: digitalLibrarySheet.includeAnswerKey,
          teacher_name: userData.full_name,
          student_id: [1, 2],
          assignment_type: "Exam",
          number_of_questions: Number.parseInt(
            digitalLibrarySheet.noOfQuestions
          ),
        };

        console.log("ELA PDF Generation data => ", elaPdfData);

        blob = await generateElaPdf(
          elaPdfData,
          tenantDomain,
          accessToken,
          //refreshToken
        );
      } else {
        // Use regular PDF generation API for non-ELA subjects
        const url = `${tenantDomain}/digital_library/generate-pdf/`;
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(data),
        });

        if (response.ok) {
          blob = await response.blob();
        } else {
          console.log("POST DigitalLibrary Failed => ", response);
          throw new Error("DigitalLibrary creation failed");
        }
      }

      // Handle the PDF blob for both ELA and non-ELA subjects
      const url = URL.createObjectURL(blob);
      setFileStream(url);

      setIsDialogOpen(true); // Open the dialog to display the generated file
    } catch (error) {
      console.log(error)
      setError(
        "There is a server or internet issue, please try again, if this persits, contact your admin."
      );
    }

    setIsLoading(false);
  };

  // async function handleQuestionsTypeChange(e: ChangeEvent<HTMLSelectElement>) {
  //   setDigitalLibrarySheet({
  //     ...digitalLibrarySheet,
  //     questionType: e.target.value,
  //   });

  //   if (checkedStandards.length > 0) {
  //     setIsLoadingQuestionLinks(true);
  //     if (isElaSubjectSelected) {
  //       // Use ELA-specific API for question links
  //       const formattedStandards =
  //         checkedStandards.length > 1
  //           ? checkedStandards.join(",")
  //           : checkedStandards[0];
  //       const questionsLinksData = await fetchElaQuestionLinks(
  //         digitalLibrarySheet.subject,
  //         digitalLibrarySheet.grade,
  //         selectedElaStandard,
  //         selectedElaStrand,
  //         formattedStandards,
  //         e.target.value,
  //         tenantDomain,
  //         accessToken,
  //         refreshToken
  //       );
  //       setQuestionsLinks(questionsLinksData);
  //     } else {
  //       // Use regular API for Math subjects
  //       const data = {
  //         subject: digitalLibrarySheet.subject,
  //         grade: digitalLibrarySheet.grade,
  //         domain: digitalLibrarySheet.domain,
  //         questionsType: e.target.value,
  //         standards: checkedStandards,
  //       };
  //       console.log("SENDING DATA => ", data);
  //       const questionsLinksData = await getQuestionsLinks(
  //         data,
  //         tenantDomain,
  //         accessToken,
  //         refreshToken
  //       );
  //       setQuestionsLinks(questionsLinksData);
  //     }
  //     setIsLoadingQuestionLinks(false);
  //   } else {
  //     setQuestionsLinks(null);
  //     setDigitalLibrarySheet({ ...digitalLibrarySheet, noOfQuestions: "" });
  //   }
  // }

  async function handleStandardsChange(items: string[]) {
    setCheckedStandards(items);
    if (items.length > 0) {
      setIsLoadingQuestionLinks(true);
      if (isElaSubjectSelected) {
        // Use ELA-specific API for question links
        const specificStandards = items.length > 1 ? items.join(",") : items[0];
        const questionsLinksData = await fetchElaQuestionLinks(
          digitalLibrarySheet.subject,
          digitalLibrarySheet.grade,
          selectedElaStandard,
          selectedElaStrand,
          specificStandards,
          digitalLibrarySheet.questionType,
          tenantDomain,
          accessToken,
         // refreshToken
        );
        setQuestionsLinks(questionsLinksData);
      } else {
        // Use regular API for Math subjects
        const data = {
          subject: digitalLibrarySheet.subject,
          grade: digitalLibrarySheet.grade,
          domain: digitalLibrarySheet.domain,
          questionsType: digitalLibrarySheet.questionType,
          standards: items,
        };

        const questionsLinksData = await getQuestionsLinks(
          data,
          tenantDomain,
          accessToken,
          refreshToken
        );

        setQuestionsLinks(questionsLinksData);
      }
      setIsLoadingQuestionLinks(false);
    } else {
      setQuestionsLinks(null);
    }
  }

  useEffect(() => {
    if (!classesIsLoading) {
      setAllClasses(initialClasses);
    }
  }, [classesIsLoading]);

  useEffect(() => {
    if (loadedSelectedClass) {
      if (loadedSelectedClass === "undefined") {
        localStorage.removeItem(localStorageKey.CURRENT_SELECTED_CLASS);
        return;
      }
      const parsed = JSON.parse(loadedSelectedClass);
      setSelectedClass(parsed);
    }
  }, [loadedSelectedClass]);

  useEffect(() => {
    const loadRelatedData = async () => {
      if (selectedClass) {
        await handleSubjectSelection(selectedClass.subject_in_short);
        setIsSubjectLoadAutomaticaly(true);
      }
    };
    loadRelatedData();
  }, [selectedClass]);

  useEffect(() => {
    const loadRelatedData = async () => {
      if (isSubjectLoadAutomaticaly && selectedClass) {
        await handleGradeSelection(selectedClass.grade);
      }
    };
    loadRelatedData();
  }, [isSubjectLoadAutomaticaly]);

  return (
    <section className="flex flex-col h-full w-full bg-gradient-to-br from-teal-50/30 to-cyan-50/20">
      {/* Enhanced Header */}
      <div className="flex justify-between items-center bg-[#79bef2] px-8 py-6 shadow-xl rounded-2xl mx-6 mt-8">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
            <svg
              className="h-6 w-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
          </div>
          <div>
            <PageTitleH1
              title="Digital Library"
              className="text-white font-bold text-2xl"
            />
            <p className="text-blue-100 text-sm mt-1">
              Create custom worksheets and assessments
            </p>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 mx-6 my-4 pb-8 space-y-6">
        {/* Assignment Context Banner */}
        {assignmentContext && (
          <Card className="rounded-2xl shadow-lg p-6 bg-gradient-to-r from-blue-50/80 to-purple-50/80 border border-blue-200/50 backdrop-blur-sm">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  Creating worksheet for: {assignmentContext.assignmentName}
                </h3>
                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                  {assignmentContext.courseName && (
                    <span className="bg-white/60 px-3 py-1 rounded-full font-medium">
                      Course: {assignmentContext.courseName}
                    </span>
                  )}
                  {assignmentContext.dueDate && (
                    <span className="bg-white/60 px-3 py-1 rounded-full font-medium">
                      Due:{" "}
                      {new Date(assignmentContext.dueDate).toLocaleDateString()}
                    </span>
                  )}
                  {assignmentContext.assignmentType && (
                    <span className="bg-white/60 px-3 py-1 rounded-full font-medium">
                      Type: {assignmentContext.assignmentType}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Auto-population Loading Banner */}
        <div className="mt-2">
          {isAutoPopulating && (
            <Card className="rounded-2xl shadow-lg p-6 bg-gradient-to-r from-green-50/80 to-blue-50/80 border border-green-200/50 backdrop-blur-sm">
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-green-500 to-blue-600 rounded-xl shadow-lg">
                  <svg
                    className="w-6 h-6 text-white animate-spin"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    Auto-populating form fields...
                  </h3>
                  <div className="text-sm text-gray-600">
                    {autoPopulationProgress ? (
                      <div className="space-y-3">
                        <div className="font-medium">
                          {autoPopulationProgress.currentStep}
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-green-500 to-blue-600 h-2 rounded-full transition-all duration-500"
                              style={{
                                width: `${
                                  (autoPopulationProgress.currentStepIndex /
                                    autoPopulationProgress.totalSteps) *
                                  100
                                }%`,
                              }}
                            ></div>
                          </div>
                          <span className="text-xs font-semibold bg-white/60 px-2 py-1 rounded-full">
                            {autoPopulationProgress.currentStepIndex}/
                            {autoPopulationProgress.totalSteps}
                          </span>
                        </div>
                      </div>
                    ) : (
                      "We're automatically filling out the form based on your assignment details. Please wait..."
                    )}
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Enhanced Form Card */}
        </div>
        <Card className="rounded-2xl shadow-xl border-0 bg-white/90 backdrop-blur-sm p-8">
          <form
            className="flex flex-col gap-6"
            onSubmit={(e) => createDigitalLibrary(e)}
          >
            {error && (
              <Alert variant="destructive" className="border-red-500 bg-red-50">
                <AlertDescription className="text-red-700 font-medium">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-6 bg-gradient-to-r from-blue-50/80 to-purple-50/80 p-6 rounded-2xl border border-blue-200/50 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-800">
                  Question Source
                </h3>
              </div>
              <RadioGroup
                defaultValue="actual"
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
                onValueChange={(value) =>
                  setIsDreaMetrixBankOfQuestion(value === "dreaMetrix")
                }
              >
                <div className="flex items-center space-x-3 bg-white/60 p-4 rounded-xl border border-blue-200/50">
                  <RadioGroupItem
                    value="dreaMetrix"
                    id="dreaMetrix"
                    className="text-blue-600 border-blue-400"
                  />
                  <Label
                    htmlFor="dreaMetrix"
                    className="font-semibold text-gray-800 cursor-pointer"
                  >
                    DreaMetrix Bank of Questions
                  </Label>
                </div>
                <div className="flex items-center space-x-3 bg-white/60 p-4 rounded-xl border border-purple-200/50">
                  <RadioGroupItem
                    value="actual"
                    id="actual"
                    className="text-purple-600 border-purple-400"
                  />
                  <Label
                    htmlFor="actual"
                    className="font-semibold text-gray-800 cursor-pointer"
                  >
                    Actual Released Questions
                  </Label>
                </div>
              </RadioGroup>
              {isDreaMetrixBankOfQuestion && (
                <Alert
                  variant="default"
                  className="bg-blue-100/80 border-blue-300/50 text-blue-800 rounded-xl"
                >
                  <AlertDescription className="font-medium">
                    DreaMetrix Bank of Questions functionality is coming soon.
                  </AlertDescription>
                </Alert>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-gray-700 font-medium">Subject</Label>
                <Select
                  disabled={isDreaMetrixBankOfQuestion}
                  value={digitalLibrarySheet.subject}
                  onValueChange={handleSubjectSelection}
                >
                  <SelectTrigger className="w-full bg-gray-50 border-gray-300 hover:border-blue-400">
                    <SelectValue placeholder="Select Subject" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-gray-200 shadow-lg">
                    {subjects.map((subject: string, index: number) => (
                      <SelectItem
                        key={index}
                        value={subject}
                        className="hover:bg-blue-50 focus:bg-blue-50 text-gray-800 hover:text-gray-900 focus:text-gray-900"
                      >
                        {subject}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-gray-700 font-medium">Grade</Label>
                <Select
                  disabled={
                    isDreaMetrixBankOfQuestion || !digitalLibrarySheet.subject
                  }
                  value={digitalLibrarySheet.grade}
                  onValueChange={async (value) => {
                    // Mettre à jour l'état immédiatement
                    setDigitalLibrarySheet((prev) => ({
                      ...prev,
                      grade: value,
                    }));
                    // Puis appeler la fonction asynchrone
                    await handleGradeSelection(value);
                  }}
                >
                  <SelectTrigger className="w-full bg-gray-50 border-gray-300 hover:border-blue-400">
                    <SelectValue placeholder="Select Grade">
                      {isLoadingSubjects
                        ? "Loading grades..."
                        : digitalLibrarySheet.grade || "Select Grade"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-gray-200 shadow-lg">
                    {grades.map((grade, index) => (
                      <SelectItem
                        key={index}
                        value={grade}
                        className="hover:bg-blue-50 focus:bg-blue-50 text-gray-800 hover:text-gray-900 focus:text-gray-900"
                      >
                        {grade}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {/* Assignment Type Section */}
              <div className="space-y-2 bg-orange-50 p-4 rounded-lg border border-orange-100 col-span-2">
                <Label className="text-orange-800 font-medium">
                  Assignment Type
                </Label>
                <Select
                  disabled={isDreaMetrixBankOfQuestion}
                  value={digitalLibrarySheet.assignmentType}
                  onValueChange={(value) =>
                    setDigitalLibrarySheet({
                      ...digitalLibrarySheet,
                      assignmentType: value,
                    })
                  }
                >
                  <SelectTrigger className="w-full bg-white border-orange-300 hover:border-orange-400">
                    <SelectValue placeholder="Select Assignment Type" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-gray-200 shadow-lg">
                    <SelectItem
                      value="homework"
                      className="hover:bg-orange-50 focus:bg-orange-50 text-gray-800 hover:text-gray-900 focus:text-gray-900"
                    >
                      Homework
                    </SelectItem>
                    <SelectItem
                      value="test"
                      className="hover:bg-orange-50 focus:bg-orange-50 text-gray-800 hover:text-gray-900 focus:text-gray-900"
                    >
                      Test
                    </SelectItem>
                    <SelectItem
                      value="quiz"
                      className="hover:bg-orange-50 focus:bg-orange-50 text-gray-800 hover:text-gray-900 focus:text-gray-900"
                    >
                      Quiz
                    </SelectItem>
                    <SelectItem
                      value="participation"
                      className="hover:bg-orange-50 focus:bg-orange-50 text-gray-800 hover:text-gray-900 focus:text-gray-900"
                    >
                      Participation
                    </SelectItem>
                    <SelectItem
                      value="other"
                      className="hover:bg-orange-50 focus:bg-orange-50 text-gray-800 hover:text-gray-900 focus:text-gray-900"
                    >
                      Other
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {/* ELA-specific selection section */}
              {elaStepActive && (
                <>
                  <div className="space-y-2 bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                    <Label className="text-yellow-800 font-medium">
                      Standard
                    </Label>
                    <Select
                      disabled={isLoadingElaData}
                      value={selectedElaStandard}
                      onValueChange={handleElaStandardSelect}
                    >
                      <SelectTrigger className="w-full bg-white border-yellow-300 hover:border-yellow-400">
                        <SelectValue
                          placeholder={
                            isLoadingElaData
                              ? "Loading standards..."
                              : "Select Standard"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent className="bg-white border border-gray-200 shadow-lg">
                        {elaStandards.map((standard, index) => (
                          <SelectItem
                            key={index}
                            value={standard}
                            className="hover:bg-yellow-50 focus:bg-yellow-50 text-gray-800 hover:text-gray-900 focus:text-gray-900"
                          >
                            {standard}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2 bg-orange-50 p-4 rounded-lg border border-orange-200">
                    <Label className="text-orange-800 font-medium">
                      Strand
                    </Label>
                    <Select
                      disabled={isLoadingElaData || !selectedElaStandard}
                      value={selectedElaStrand}
                      onValueChange={handleElaStrandSelect}
                    >
                      <SelectTrigger className="w-full bg-white border-orange-300 hover:border-orange-400">
                        <SelectValue
                          placeholder={
                            isLoadingElaData
                              ? "Loading..."
                              : !selectedElaStandard
                              ? "Select Standard first"
                              : "Select ELA Strand"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent className="bg-white border border-gray-200 shadow-lg">
                        {elaStrands.map((strand, index) => (
                          <SelectItem
                            key={index}
                            value={strand}
                            className="hover:bg-orange-50 focus:bg-orange-50 text-gray-800 hover:text-gray-900 focus:text-gray-900"
                          >
                            {strand}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {isLoadingElaData && (
                    <div className="md:col-span-2 text-sm text-yellow-700 bg-yellow-100 p-2 rounded">
                      Loading ELA options...
                    </div>
                  )}
                </>
              )}

              {/* Domain section - hide completely for ELA subjects, show for non-ELA subjects only */}
              {!isElaSubjectSelected && (
                <div className="space-y-2">
                  <Label className="text-gray-700 font-medium">Domain</Label>
                  <Select
                    disabled={
                      isDreaMetrixBankOfQuestion || !digitalLibrarySheet.grade
                    }
                    value={digitalLibrarySheet.domain}
                    onValueChange={handleDomainSelection}
                  >
                    <SelectTrigger className="w-full bg-gray-50 border-gray-300 hover:border-blue-400">
                      <SelectValue placeholder="Select Domain" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border border-gray-200 shadow-lg">
                      {sheetDomains.map((domain, index) => (
                        <SelectItem
                          key={index}
                          value={domain}
                          className="hover:bg-blue-50 focus:bg-blue-50 text-gray-800 hover:text-gray-900 focus:text-gray-900"
                        >
                          {domain}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Question Type section - show for non-ELA subjects (when domain is selected) or for ELA subjects (when both standard and strand are selected) */}
              {(!isElaSubjectSelected && digitalLibrarySheet.domain) ||
              (isElaSubjectSelected &&
                selectedElaStandard &&
                selectedElaStrand) ? (
                <div className="space-y-2">
                  <Label className="text-gray-700 font-medium">
                    Question Type
                  </Label>
                  <Select
                    disabled={
                      isDreaMetrixBankOfQuestion ||
                      (!isElaSubjectSelected && !digitalLibrarySheet.domain) ||
                      (isElaSubjectSelected &&
                        !(selectedElaStandard && selectedElaStrand))
                    }
                    value={digitalLibrarySheet.questionType}
                    onValueChange={async (value) => {
                      setDigitalLibrarySheet({
                        ...digitalLibrarySheet,
                        questionType: value,
                      });

                      // Update question links when question type changes
                      if (checkedStandards.length > 0) {
                        setIsLoadingQuestionLinks(true);
                        try {
                          if (isElaSubjectSelected) {
                            // Use ELA-specific API for question links
                            const specificStandards =
                              checkedStandards.length > 1
                                ? checkedStandards.join(",")
                                : checkedStandards[0];
                            const questionsLinksData =
                              await fetchElaQuestionLinks(
                                digitalLibrarySheet.subject,
                                digitalLibrarySheet.grade,
                                selectedElaStandard,
                                selectedElaStrand,
                                specificStandards,
                                value,
                                tenantDomain,
                                accessToken,
                                //refreshToken
                              );
                            setQuestionsLinks(questionsLinksData);
                          } else {
                            // Use regular API for Math subjects
                            const data = {
                              subject: digitalLibrarySheet.subject,
                              grade: digitalLibrarySheet.grade,
                              domain: digitalLibrarySheet.domain,
                              questionsType: value,
                              standards: checkedStandards,
                            };
                            const questionsLinksData = await getQuestionsLinks(
                              data,
                              tenantDomain,
                              accessToken,
                              refreshToken
                            );
                            setQuestionsLinks(questionsLinksData);
                          }
                        } catch (error) {
                          console.error(
                            "Error fetching question links:",
                            error
                          );
                          setQuestionsLinks(null);
                        } finally {
                          setIsLoadingQuestionLinks(false);
                        }
                      }
                    }}
                  >
                    <SelectTrigger className="w-full bg-gray-50 border-gray-300 hover:border-blue-400">
                      <SelectValue placeholder="Select Question Type" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border border-gray-200 shadow-lg">
                      <SelectItem
                        value="MC"
                        className="hover:bg-blue-50 focus:bg-blue-50 text-gray-800 hover:text-gray-900 focus:text-gray-900"
                      >
                        Multiple Choice (MC)
                      </SelectItem>
                      <SelectItem
                        value="OR"
                        className="hover:bg-blue-50 focus:bg-blue-50 text-gray-800 hover:text-gray-900 focus:text-gray-900"
                      >
                        Open Response (OR)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              ) : null}
            </div>

            {/* Specific Standards section - show for non-ELA subjects (when domain is selected) or for ELA subjects (when both standard and strand are selected) */}
            {(!isElaSubjectSelected && digitalLibrarySheet.domain) ||
            (isElaSubjectSelected &&
              selectedElaStandard &&
              selectedElaStrand) ? (
              <div className="space-y-2 bg-purple-50 p-4 rounded-lg border border-purple-100">
                <Label className="text-purple-800 font-medium">
                  Specific Standards
                </Label>
                <MultiSelectList
                  selectedItems={[]}
                  allItems={standards}
                  itemsLabel="Standards"
                  allShouldBeSelected={true}
                  itemsAreLoading={standardsAreLoading}
                  withSheckbox={true}
                  updateSelectedItems={(items: string[]) =>
                    handleStandardsChange(items)
                  }
                />
              </div>
            ) : null}

            <div className="space-y-2 bg-indigo-50 p-4 rounded-lg border border-indigo-100">
              <Label className="text-indigo-800 font-medium">Class(es)</Label>
              <MultiSelectList
                selectedItems={allClasses}
                allItems={allClasses?.flatMap((cl: any) => cl.name)}
                itemsLabel="Classes"
                className="border border-indigo-200 bg-white p-3 rounded-md shadow-sm"
                allShouldBeSelected={false}
                itemsAreLoading={classesIsLoading}
                withSheckbox={false}
                updateSelectedItems={(items: string[]) =>
                  setCheckedClasses(items)
                }
              />
            </div>

            {isLoadingQuestionLinks ? (
              <div className="text-sm text-blue-700 bg-blue-50 p-3 rounded-lg border border-blue-200">
                <span className="flex items-center gap-2">
                  <svg
                    className="animate-spin h-4 w-4 text-blue-600"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Loading available questions...
                </span>
              </div>
            ) : questionsLinks ? (
              <div className="text-sm text-blue-700 bg-blue-50 p-3 rounded-lg border border-blue-200">
                Available questions:{" "}
                <span className="font-bold">
                  {questionsLinks.question_count}
                </span>{" "}
                (Max: {questionsLinks.question_count})
              </div>
            ) : null}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
              <div className="space-y-2">
                <Label className="text-gray-700 font-medium">
                  Number of Questions
                </Label>
                <Input
                  disabled={isDreaMetrixBankOfQuestion || !questionsLinks}
                  type="number"
                  min={1}
                  max={questionsLinks ? questionsLinks.question_count : 1}
                  value={digitalLibrarySheet.noOfQuestions}
                  onChange={(e) =>
                    setDigitalLibrarySheet({
                      ...digitalLibrarySheet,
                      noOfQuestions: e.target.value,
                    })
                  }
                  className="bg-gray-50 border-gray-300 focus:border-blue-400"
                  placeholder={
                    questionsLinks
                      ? `Enter number (1-${questionsLinks.question_count})`
                      : "Select standards first"
                  }
                />
              </div>

              <div className="flex items-center space-x-2 h-10 bg-green-50 p-3 rounded-lg border border-green-200">
                <Checkbox
                  id="answerSheet"
                  checked={digitalLibrarySheet.generateAnswerSheet}
                  onCheckedChange={(checked) =>
                    setDigitalLibrarySheet({
                      ...digitalLibrarySheet,
                      generateAnswerSheet: Boolean(checked),
                    })
                  }
                  className="border-gray-400 data-[state=checked]:bg-green-600"
                />
                <Label
                  htmlFor="answerSheet"
                  className="font-medium text-green-800"
                >
                  Generate Answer Sheets
                </Label>
              </div>

              <div className="flex items-center space-x-2 h-10 bg-blue-50 p-3 rounded-lg border border-blue-200">
                <Checkbox
                  id="includeAnswerKey"
                  checked={digitalLibrarySheet.includeAnswerKey}
                  onCheckedChange={(checked) =>
                    setDigitalLibrarySheet({
                      ...digitalLibrarySheet,
                      includeAnswerKey: Boolean(checked),
                    })
                  }
                  className="border-gray-400 data-[state=checked]:bg-blue-600"
                />
                <Label
                  htmlFor="includeAnswerKey"
                  className="font-medium text-blue-800"
                >
                  Include Answer Key
                </Label>
              </div>
            </div>

            <div className="flex justify-center pt-6">
              <Button
                type="submit"
                className="px-12 py-4 text-lg font-semibold bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600 hover:from-teal-700 hover:via-cyan-700 hover:to-blue-700 text-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center gap-3">
                    <svg
                      className="animate-spin h-6 w-6 text-white"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Generating Worksheet...
                  </span>
                ) : (
                  <span className="flex items-center gap-3">
                    <svg
                      className="h-6 w-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                    Create Worksheet
                  </span>
                )}
              </Button>
            </div>

            <GenerateAssessmentDialog
              isOpen={isDialogOpen}
              onClose={() => setIsDialogOpen(false)}
              fileStream={fileStream}
              worksheetTitle={
                digitalLibrarySheet.subject
                  ? `${digitalLibrarySheet.subject} - Grade ${digitalLibrarySheet.grade} Worksheet`
                  : "Digital Library Worksheet"
              }
              preselectedData={{
                assignmentType:
                  digitalLibrarySheet.assignmentType || "Homework",
                subject: digitalLibrarySheet.subject,
                grade: digitalLibrarySheet.grade,
                questionType: digitalLibrarySheet.questionType,
                numberOfQuestions: digitalLibrarySheet.noOfQuestions,
                teacherName: userData?.full_name,
                assignmentName: assignmentContext?.assignmentName || undefined,
                dueDate: assignmentContext?.dueDate || undefined,
                isPublished: assignmentContext?.published === "true" || false,
                courseId: assignmentContext?.courseId || undefined,
                courseName: assignmentContext?.courseName || undefined,
              }}
            />
          </form>
          <LoaderDialog shouldOpen={isLoading} />
        </Card>
      </div>
    </section>
  );
}
