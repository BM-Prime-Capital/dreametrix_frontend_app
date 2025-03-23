"use client";

import { Card } from "@/components/ui/card";
import PageTitleH1 from "@/components/ui/page-title-h1";
import { useEffect, useState } from "react";
import { GenerateAssessmentDialog } from "./GenerateAssessmentDialog";
import MultiSelectList from "../MultiSelectionList";
import { useList } from "@/hooks/useList";
import {
  createDigitalLibrarySheet,
  getDomains,
  getGrades,
  getStandards,
  getSubjects,
} from "@/services/DigitalLibraryService";
import { useRequestInfo } from "@/hooks/useRequestInfo";
import { getClasses } from "@/services/ClassService";
import { DigitalLibrarySheet } from "@/types";
import { allSheetDomains } from "@/constants/global";

const GRADEBOOK_SHEET_INIT_STATE = {
  subject: "",
  grade: "",
  domain: "",
  questionType: "MC",
  specificStandards: [],
  studentsClass: [],
};

export default function DigitalLibrary() {
  const {
    list: initialClasses,
    isLoading: classesIsLoading,
    error: classesError,
  } = useList(getClasses);

  const [allClasses, setAllClasses] = useState<any[]>([]);

  const [checkedClasses, setCheckedClasses] = useState<string[]>([]);
  const [checkedStandards, setCheckedStandards] = useState<string[]>([]);

  const [isDreaMetrixBankOfQuestion, setIsDreaMetrixBankOfQuestion] =
    useState(false);

  const [digitalLibrarySheet, setDigitalLibrarySheet] =
    useState<DigitalLibrarySheet>(GRADEBOOK_SHEET_INIT_STATE);

  const [isLoadinfFileError, setIsLoadinfFileError] = useState(false);

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

  const { tenantDomain, accessToken, refreshToken } = useRequestInfo();

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

    const standardsData = await getStandards(
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
  };

  const createDigitalLibrary = async () => {
    if (checkedStandards.length < 1 || checkedClasses.length < 1) {
      alert("You have to select at least one Standard and one Class");
      return;
    }

    if (checkedClasses.length > 1) {
      alert("You have to select only one Class for now.");
      return;
    }

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
      generate_answer_sheet: true,
      teacher_name: "Mr. Smith",
      student_id: 1,
      assignment_type: "Homework",
    };

    console.log("SENDING createDigitalLibrary data => ", data);
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

        console.log("POST DigitalLibrary data OK => ", url);
      } else {
        console.log("POST DigitalLibrary Failed => ", response);

        throw new Error("DigitalLibrary creation failed");
      }
    } catch (error) {
      setIsLoadinfFileError(true);
    }
  };

  useEffect(() => {
    if (!classesIsLoading) {
      setAllClasses(initialClasses);
      //  setCheckedClasses(initialClasses.flatMap((cl: any) => cl.name)); // TODO uncomment when The POST API will support multiple classe selection and DO the same when filtering classes
    }
  }, [classesIsLoading]);

  return (
    <section className="flex flex-col gap-2 w-full">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <PageTitleH1 title="CREATED SHEET" className="text-bgPurple" />
        </div>
      </div>

      <Card className="rounded-md flex">
        <form className="flex flex-col gap-4 p-4 w-full">
          <div className="flex flex-wrap gap-2">
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
                onChange={(e) =>
                  setDigitalLibrarySheet({
                    ...digitalLibrarySheet,
                    questionType: e.target.value,
                  })
                }
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
                  selectedItems={digitalLibrarySheet.specificStandards}
                  allItems={standards}
                  itemsLabel="Standards"
                  allShouldBeSelected={true}
                  itemsAreLoading={standardsAreLoading}
                  withSheckbox={true}
                  updateSelectedItems={(items: string[]) =>
                    setCheckedStandards(items)
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

          <div className="flex gap-6 flex-wrap items-center w-full">
            <div className="flex flex-col flex-1">
              <label className="text-muted-foreground whitespace-nowrap">
                Number of Questions(1-13):
              </label>
              <input
                style={{ border: "solid 1px #eee" }}
                className="px-2 py-1 bg-white rounded-full min-w-[300px] "
                disabled={isDreaMetrixBankOfQuestion === true}
                type="number"
                min={1}
                max={13}
              />
            </div>
            <div className="flex flex-col flex-1">
              <label className="flex gap-4 items-center font-bold">
                Generate Answer Sheets
                <input
                  className="h-4 min-w-4"
                  type="checkbox"
                  name="question"
                />
              </label>
            </div>
          </div>

          <GenerateAssessmentDialog
            fileStream={fileStream}
            handleFileGeneration={() => createDigitalLibrary()}
            isLoadinfFileError={isLoadinfFileError}
          />
        </form>
      </Card>
    </section>
  );
}
