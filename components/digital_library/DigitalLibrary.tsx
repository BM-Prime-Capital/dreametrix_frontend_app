"use client";

import { Card } from "@/components/ui/card";
import PageTitleH1 from "@/components/ui/page-title-h1";
import { ChangeEvent, useEffect, useState } from "react";
import { GenerateAssessmentDialog } from "./GenerateAssessmentDialog";
import MultiSelectList from "../MultiSelectionList";
import { useList } from "@/hooks/useList";
import {
  getDomains,
  getGrades,
  getQuestionsLinks,
  getStandards,
  getSubjects,
} from "@/services/DigitalLibraryService";
import { useRequestInfo } from "@/hooks/useRequestInfo";
import { getClasses } from "@/services/ClassService";
import { DigitalLibrarySheet, ISchoolClass } from "@/types";
import { localStorageKey } from "@/constants/global";
import { Button } from "../ui/button";
import { LoaderDialog } from "../ui/loader-dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Checkbox } from "../ui/checkbox";
import { Alert, AlertDescription } from "../ui/alert";

const GRADEBOOK_SHEET_INIT_STATE = {
  subject: "",
  grade: "",
  domain: "",
  questionType: "MC",
  studentsClass: [],
  noOfQuestions: "",
  generateAnswerSheet: false,
};

export default function DigitalLibrary() {
  const {
    list: initialClasses,
    isLoading: classesIsLoading,
    error: classesError,
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

  const [isLoadingFileError, setIsLoadingFileError] = useState(false);

  const [sheetDomains, setSheetDomains] = useState<string[]>([]);

  const {
    list: subjects,
    isLoading: isLoadingSubjects,
    error: errorSubjects,
  } = useList(getSubjects);

  const [grades, setGrades] = useState<string[]>([]); // Au lieu de useState<any[]>([])
  const [standards, setStandards] = useState<any[]>([]);
  const [standardsAreLoading, setStandardsAreLoading] = useState<boolean>(true);
  const [fileStream, setFileStream] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSubjectLoadAutomaticaly, setIsSubjectLoadAutomaticaly] =
    useState<boolean>(false);

  const handleSubjectSelection = async (selectedSubject: string) => {
    setDigitalLibrarySheet({
      ...digitalLibrarySheet,
      subject: selectedSubject,
      grade: "",
      domain: "",
    });
    
    try {
      const gradeData = await getGrades(
        selectedSubject,
        tenantDomain,
        accessToken,
        refreshToken
      );
      setGrades(gradeData || []); // Fallback à un tableau vide si gradeData est null/undefined
  
      const filteredClasses = initialClasses.filter(
        (cl: any) =>
          cl.subject_in_short === selectedSubject ||
          cl.subject_in_all_letter === selectedSubject
      );
      
      setAllClasses(filteredClasses);
      setCheckedClasses(filteredClasses.map((cl: any) => cl.name));
    } catch (error) {
      console.error("Error loading grades:", error);
      setGrades([]);
    }
  };

  const handleGradeSelection = async (selectedGrade: string) => {
    setDigitalLibrarySheet({
      ...digitalLibrarySheet,
      grade: selectedGrade,
      domain: "",
    });

    const domainsData = await getDomains(
      {
        subject: digitalLibrarySheet.subject,
        grade: Number.parseInt(selectedGrade),
      },
      tenantDomain,
      accessToken,
      refreshToken
    );

    setSheetDomains(domainsData);

    setAllClasses(
      initialClasses.filter(
        (cl: any) =>
          cl.grade === selectedGrade &&
          (cl.subject_in_short === digitalLibrarySheet.subject ||
            cl.subject_in_all_letter === digitalLibrarySheet.subject)
      )
    );

    setCheckedClasses(
      initialClasses
        .filter(
          (cl: any) =>
            cl.grade === selectedGrade &&
            (cl.subject_in_short === digitalLibrarySheet.subject ||
              cl.subject_in_all_letter === digitalLibrarySheet.subject)
        )
        ?.flatMap((cl: any) => cl.name)
    );
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

    const questionsLinksData = await getQuestionsLinks(
      data,
      tenantDomain,
      accessToken,
      refreshToken
    );

    console.log("questionsLinksData DT => ", questionsLinksData);

    setQuestionsLinks(questionsLinksData);
  };

  const createDigitalLibrary = async (e: any) => {
    e.preventDefault();

    if (checkedStandards.length < 1 || checkedClasses.length < 1) {
      alert(
        "You have to select a subject, a grade, a domain and at least one standard"
      );
      return;
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
      domain: digitalLibrarySheet.domain,
      standards: standards,
      kind: digitalLibrarySheet.questionType,
      selected_class: selected_class,
      generate_answer_sheet: digitalLibrarySheet.generateAnswerSheet,
      teacher_name: userData.username,
      student_id: 1,
      assignment_type: "Homework",
      number_of_questions: digitalLibrarySheet.noOfQuestions,
      links: questionsLinks?.links,
    };

    console.log("DIGITAL LIBRARY POST data => ", data);

    try {
      const url = `${tenantDomain}/digital_library/generate-pdf/`;
      let response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        setFileStream(url);

        document.getElementById("openFileModalButton")?.click(); // We open the Modal to display the Generated File
      } else {
        console.log("POST DigitalLibrary Failed => ", response);

        throw new Error("DigitalLibrary creation failed");
      }
    } catch (error) {
      setError(
        "There is a server or internet issue, please try again, if this persits, contact you admin."
      );
    }

    setIsLoading(false);
  };

  async function handleQuestionsTypeChange(e: ChangeEvent<HTMLSelectElement>) {
    setDigitalLibrarySheet({
      ...digitalLibrarySheet,
      questionType: e.target.value,
    });

    if (checkedStandards.length > 0) {
      const data = {
        subject: digitalLibrarySheet.subject,
        grade: digitalLibrarySheet.grade,
        domain: digitalLibrarySheet.domain,
        questionsType: e.target.value,
        standards: checkedStandards,
      };
      console.log("SENDING DATA => ", data);
      const questionsLinksData = await getQuestionsLinks(
        data,
        tenantDomain,
        accessToken,
        refreshToken
      );
      setQuestionsLinks(questionsLinksData);
    } else {
      setQuestionsLinks(null);
      setDigitalLibrarySheet({ ...digitalLibrarySheet, noOfQuestions: "" });
    }
  }

  async function handleStandardsChange(items: string[]) {
    setCheckedStandards(items);
    if (items.length > 0) {
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
      const currentSelectedClass = JSON.parse(loadedSelectedClass);
      setSelectedClass(currentSelectedClass);
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
    <section className="flex flex-col gap-6 w-full max-w-6xl mx-auto p-4 bg-gray-50">
      <div className="flex items-center justify-between">
        <PageTitleH1 
          title="Create Assessment Sheet" 
          className="text-primary bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg shadow-md" 
        />
      </div>

      <Card className="rounded-lg shadow-lg p-8 bg-white border border-gray-200">
        <form className="flex flex-col gap-6" onSubmit={(e) => createDigitalLibrary(e)}>
          {error && (
            <Alert variant="destructive" className="border-red-500 bg-red-50">
              <AlertDescription className="text-red-700 font-medium">
                {error}
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-4 bg-blue-50 p-4 rounded-lg border border-blue-100">
            <h3 className="text-lg font-semibold text-blue-800">Question Source</h3>
            <RadioGroup 
              defaultValue="actual" 
              className="flex gap-8"
              onValueChange={(value) => setIsDreaMetrixBankOfQuestion(value === "dreaMetrix")}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem 
                  value="dreaMetrix" 
                  id="dreaMetrix" 
                  className="text-blue-600 border-blue-400"
                />
                <Label htmlFor="dreaMetrix" className="font-medium text-blue-800">
                  DreaMetrix Bank of Questions
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem 
                  value="actual" 
                  id="actual" 
                  className="text-purple-600 border-purple-400"
                />
                <Label htmlFor="actual" className="font-medium text-purple-800">
                  Current Questions Library
                </Label>
              </div>
            </RadioGroup>
            
            {isDreaMetrixBankOfQuestion && (
              <Alert variant="default" className="mt-2 bg-blue-100 border-blue-300 text-blue-800">
                <AlertDescription>
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
                      className="hover:bg-blue-50 focus:bg-blue-50"
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
    disabled={isDreaMetrixBankOfQuestion || !digitalLibrarySheet.subject}
    value={digitalLibrarySheet.grade}
    onValueChange={async (value) => {
      // Mettre à jour l'état immédiatement
      setDigitalLibrarySheet(prev => ({...prev, grade: value}));
      // Puis appeler la fonction asynchrone
      await handleGradeSelection(value);
    }}
  >
    <SelectTrigger className="w-full bg-gray-50 border-gray-300 hover:border-blue-400">
      <SelectValue>
        {digitalLibrarySheet.grade || "Select Grade"}
      </SelectValue>
    </SelectTrigger>
    <SelectContent className="bg-white border border-gray-200 shadow-lg">
      {grades.map((grade, index) => (
        <SelectItem 
          key={index} 
          value={grade}
          className="hover:bg-blue-50 focus:bg-blue-50"
        >
          {grade}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
</div>

            <div className="space-y-2">
              <Label className="text-gray-700 font-medium">Domain</Label>
              <Select
                disabled={isDreaMetrixBankOfQuestion || !digitalLibrarySheet.grade}
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
                      className="hover:bg-blue-50 focus:bg-blue-50"
                    >
                      {domain}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-gray-700 font-medium">Question Type</Label>
              <Select
                disabled={isDreaMetrixBankOfQuestion || !digitalLibrarySheet.domain}
                value={digitalLibrarySheet.questionType}
                onValueChange={(value) => {
                  setDigitalLibrarySheet({
                    ...digitalLibrarySheet,
                    questionType: value
                  });
                }}
              >
                <SelectTrigger className="w-full bg-gray-50 border-gray-300 hover:border-blue-400">
                  <SelectValue placeholder="Select Question Type" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200 shadow-lg">
                  <SelectItem 
                    value="MC"
                    className="hover:bg-blue-50 focus:bg-blue-50"
                  >
                    Multiple Choice (MC)
                  </SelectItem>
                  <SelectItem 
                    value="OP"
                    className="hover:bg-blue-50 focus:bg-blue-50"
                  >
                    Open Response (OP)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {digitalLibrarySheet.domain && (
            <div className="space-y-2 bg-purple-50 p-4 rounded-lg border border-purple-100">
              <Label className="text-purple-800 font-medium">Specific Standards</Label>
              <MultiSelectList
                selectedItems={[]}
                allItems={standards}
                itemsLabel="Standards"
                allShouldBeSelected={true}
                itemsAreLoading={standardsAreLoading}
                withSheckbox={true}
                updateSelectedItems={(items: string[]) => handleStandardsChange(items)}
              />
            </div>
          )}

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
              updateSelectedItems={(items: string[]) => setCheckedClasses(items)}
            />
          </div>

          {questionsLinks && (
            <div className="text-sm text-blue-700 bg-blue-50 p-3 rounded-lg border border-blue-200">
              Available questions: <span className="font-bold">{questionsLinks.question_count}</span> (Max: {questionsLinks.question_count})
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
            <div className="space-y-2">
              <Label className="text-gray-700 font-medium">Number of Questions</Label>
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
              <Label htmlFor="answerSheet" className="font-medium text-green-800">
                Generate Answer Sheets
              </Label>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full md:w-auto mt-4 px-8 py-4 text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-md transition-all"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating Sheet...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                </svg>
                Generate Assessment Sheet
              </span>
            )}
          </Button>

          <GenerateAssessmentDialog fileStream={fileStream} />
        </form>
        <LoaderDialog shouldOpen={isLoading} />
      </Card>
    </section>
  );


}
