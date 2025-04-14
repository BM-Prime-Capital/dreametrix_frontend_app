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

  const [grades, setGrades] = useState<any[]>([]);
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
    const gradeData = await getGrades(
      selectedSubject,
      tenantDomain,
      accessToken,
      refreshToken
    );

    setGrades(gradeData);

    setAllClasses(
      initialClasses.filter(
        (cl: any) =>
          cl.subject_in_short === selectedSubject ||
          cl.subject_in_all_letter === selectedSubject
      )
    );

    setCheckedClasses(
      initialClasses
        .filter(
          (cl: any) =>
            cl.subject_in_short === selectedSubject ||
            cl.subject_in_all_letter === selectedSubject
        )
        ?.flatMap((cl: any) => cl.name)
    );
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
    <section className="flex flex-col gap-2 w-full">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <PageTitleH1 title="CREATED SHEET" className="text-bgPurple" />
        </div>
      </div>

      <Card className="rounded-md flex">
        <form
          className="flex flex-col gap-4 p-4 w-full"
          onSubmit={(e) => createDigitalLibrary(e)}
        >
          {error && <div className="p-2 text-red-500">{error}</div>}
          <div className="flex flex-col gap-2">
            <div className="flex-1">
              <label
                onClick={() => setIsDreaMetrixBankOfQuestion(true)}
                className="flex gap-4 items-center font-bold"
              >
                <input className="h-4 min-w-4" type="radio" name="question" />
                DreaMetrix Bank of questions
              </label>
              {isDreaMetrixBankOfQuestion && (
                <label className="text-red-500">
                  Functionality not yet available.{" "}
                </label>
              )}
            </div>

            <label
              onClick={() => setIsDreaMetrixBankOfQuestion(false)}
              className="flex-1 flex gap-4 items-center font-bold"
            >
              <input
                className="h-4 min-w-4"
                type="radio"
                name="question"
                checked={isDreaMetrixBankOfQuestion === false}
                onChange={() => console.log("Checked")}
              />
              Or Actual release Questions
            </label>
          </div>

          <div className="flex gap-6 flex-wrap flex-1 ">
            <div className="flex flex-col flex-1">
              <label className="text-muted-foreground">Subject:</label>
              <select
                style={{ border: "solid 1px #eee" }}
                className="px-2 py-1 bg-white rounded-full min-w-[300px] "
                disabled={isDreaMetrixBankOfQuestion === true}
                value={digitalLibrarySheet.subject}
                onChange={(e) => handleSubjectSelection(e.target.value)}
              >
                <option disabled value={""}>
                  Select Subject
                </option>
                {subjects.map((subject: string, index: number) => (
                  <option key={index} value={subject}>
                    {subject}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col flex-1">
              <label className="text-muted-foreground">Grade:</label>
              <select
                style={{ border: "solid 1px #eee" }}
                className="px-2 py-1 bg-white rounded-full min-w-[300px] "
                disabled={isDreaMetrixBankOfQuestion === true}
                value={digitalLibrarySheet.grade}
                onChange={(e) => handleGradeSelection(e.target.value)}
              >
                <option disabled value={""}>
                  Select Grade
                </option>
                {grades.map((grade, index) => (
                  <option key={index} value={grade}>
                    {grade}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex gap-6 flex-wrap w-full">
            <div className="flex flex-col flex-1">
              <label className="text-muted-foreground">Domain:</label>
              <select
                style={{ border: "solid 1px #eee" }}
                className="px-2 py-1 bg-white rounded-full min-w-[300px] "
                disabled={isDreaMetrixBankOfQuestion === true}
                value={digitalLibrarySheet.domain}
                onChange={(e) => handleDomainSelection(e.target.value)}
              >
                <option disabled value={""}>
                  Select Domain
                </option>

                {sheetDomains.map((domain, index) => (
                  <option key={index}>{domain}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col flex-1">
              <label className="text-muted-foreground">Question Type</label>
              <select
                style={{ border: "solid 1px #eee" }}
                className="px-2 py-1 bg-white rounded-full min-w-[300px] "
                disabled={isDreaMetrixBankOfQuestion === true}
                value={digitalLibrarySheet.questionType}
                onChange={(e) => handleQuestionsTypeChange(e)}
              >
                <option disabled>Select Question Type</option>
                <option value={"MC"}>Multiple Choice(MC)</option>
                <option value={"OP"}>Open Response(OP)</option>
              </select>
            </div>
          </div>

          {digitalLibrarySheet.domain && (
            <div className="flex gap-6 flex-wrap w-full">
              <div className="flex flex-col flex-1">
                <label className="text-muted-foreground">
                  Specific Standards
                </label>
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
            </div>
          )}

          <div className="flex gap-6 flex-wrap w-full">
            <div className="flex flex-col flex-1">
              <label className="text-muted-foreground">Class(es)</label>
              <MultiSelectList
                selectedItems={allClasses}
                allItems={allClasses?.flatMap((cl: any) => cl.name)}
                itemsLabel="Classes"
                className={"border-[1px] border-bgPurple p-2 rounded-md"}
                allShouldBeSelected={false}
                itemsAreLoading={classesIsLoading}
                withSheckbox={false}
                updateSelectedItems={(items: string[]) =>
                  setCheckedClasses(items)
                }
              />
            </div>
          </div>

          {questionsLinks && (
            <div className="text-muted-foreground">
              Available questions : {questionsLinks.question_count} (Max:{" "}
              {questionsLinks.question_count})
            </div>
          )}

          <div className="flex gap-6 flex-wrap items-center w-full">
            <div className="flex flex-col flex-1">
              <label className="text-muted-foreground whitespace-nowrap">
                Number of Questions:
              </label>
              <input
                style={{ border: "solid 1px #eee" }}
                className="px-2 py-1 bg-white rounded-full min-w-[300px] "
                disabled={
                  isDreaMetrixBankOfQuestion || !questionsLinks ? true : false
                }
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
                placeholder={`${
                  questionsLinks
                    ? "Enter number (1-" + questionsLinks.question_count + ")"
                    : "..."
                }`}
              />
            </div>
            <div className="flex flex-col flex-1">
              <label className="flex gap-4 items-center font-bold">
                Generate Answer Sheets
                <input
                  className="h-4 min-w-4"
                  type="checkbox"
                  name="question"
                  checked={digitalLibrarySheet.generateAnswerSheet}
                  onChange={(e) =>
                    setDigitalLibrarySheet({
                      ...digitalLibrarySheet,
                      generateAnswerSheet: e.target.checked,
                    })
                  }
                />
              </label>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 rounded-full mt-2"
            disabled={isLoading}
          >
            {isLoading ? "Generating the sheet..." : "GENERATE"}
          </Button>

          <GenerateAssessmentDialog fileStream={fileStream} />
        </form>
        <LoaderDialog shouldOpen={isLoading} />
      </Card>
    </section>
  );
}
