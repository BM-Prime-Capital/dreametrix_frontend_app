"use client";

import { Card } from "@/components/ui/card";
import PageTitleH1 from "@/components/ui/page-title-h1";
import { useState } from "react";
import { GenerateAssessmentDialog } from "./GenerateAssessmentDialog";
import { GradebookSheet, SheetDomain } from "@/types";
import {
  allSheetDomains,
  classSubject,
  initialClasses,
} from "@/constants/global";
import MultiSelectList from "../MultiSelectionList";
import { useSelector } from "react-redux";

const GRADEBOOK_SHEET_INIT_STATE = {
  subject: "",
  grade: "",
  domain: "",
  questionType: "",
  specificStandards: [],
  studentsClass: [],
};

export default function DigitalLibrary() {
  /*  const info = useSelector((state: any) => state.generalInfo);
  console.log("INFO => ", info); */

  const [allClasses, setAllClasses] = useState<any[]>(initialClasses);

  const [isDreaMetrixBankOfQuestion, setIsDreaMetrixBankOfQuestion] =
    useState(false);

  const [gradebookSheet, setGradebookSheet] = useState<GradebookSheet>(
    GRADEBOOK_SHEET_INIT_STATE
  );

  const [sheetDomains, setSheetDomains] = useState<string[]>([]);
  const [sheetGrades, setSheetGrades] = useState<string[]>([]);

  const handleSubjectSelection = (selectedSubject: string) => {
    setGradebookSheet({
      ...gradebookSheet,
      subject: selectedSubject,
      grade: "",
      domain: "",
    });
    setSheetGrades(["3", "4", "5", "6", "7", "8"]); // This will probably change in the near futur, so that we can load grades according to the selected subject
    setSheetDomains([]);

    setAllClasses(
      initialClasses.filter((cl) => cl.subject === selectedSubject)
    );
  };

  const handleGradeSelection = (selectedGrade: string) => {
    setGradebookSheet({
      ...gradebookSheet,
      grade: selectedGrade,
      domain: "",
    });

    const relatedGradeDomains: string[] = [];

    for (const domain of allSheetDomains) {
      if (
        domain.subject === gradebookSheet.subject &&
        domain.grade === selectedGrade
      ) {
        relatedGradeDomains.push(domain.name);
      }
    }

    setSheetDomains(relatedGradeDomains);

    setAllClasses(
      initialClasses.filter(
        (cl) =>
          cl.grade === selectedGrade && cl.subject === gradebookSheet.subject
      )
    );
  };

  const handleDomainSelection = (selectedDomain?: SheetDomain) => {
    if (selectedDomain) {
      setGradebookSheet({
        ...gradebookSheet,
        domain: selectedDomain.name,
        specificStandards: selectedDomain.specificStandards,
      });
    }
  };

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
                value={gradebookSheet.subject}
                onChange={(e) => handleSubjectSelection(e.target.value)}
              >
                <option disabled value={""}>
                  Select Subject
                </option>
                <option value={classSubject.MATH}>Math</option>
                <option value={classSubject.LANGUAGE}>Language</option>
              </select>
            </div>

            <div className="flex flex-col flex-1">
              <label className="text-muted-foreground">Grade:</label>
              <select
                style={{ border: "solid 1px #eee" }}
                className="px-2 py-1 bg-white rounded-full min-w-[300px] "
                disabled={isDreaMetrixBankOfQuestion === true}
                value={gradebookSheet.grade}
                onChange={(e) => handleGradeSelection(e.target.value)}
              >
                <option disabled value={""}>
                  Select Grade
                </option>
                {sheetGrades.map((grade, index) => (
                  <option key={index}>{grade}</option>
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
                value={gradebookSheet.domain}
                onChange={(e) =>
                  handleDomainSelection(
                    allSheetDomains.find((domain) => {
                      if (
                        domain.grade === gradebookSheet.grade &&
                        domain.subject === gradebookSheet.subject &&
                        domain.name === e.target.value
                      ) {
                        return domain;
                      }
                    })
                  )
                }
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
              >
                <option disabled>Select Question Type</option>
                <option>Multiple Choice(MC)</option>
                <option>Open Response(OP)</option>
              </select>
            </div>
          </div>

          {gradebookSheet.domain && (
            <div className="flex gap-6 flex-wrap w-full">
              <div className="flex flex-col flex-1">
                <label className="text-muted-foreground">
                  Specific Standards
                </label>
                <MultiSelectList
                  selectedItems={gradebookSheet.specificStandards}
                  allItems={gradebookSheet.specificStandards}
                  itemsLabel="Standards"
                />
              </div>
            </div>
          )}

          <div className="flex gap-6 flex-wrap w-full">
            <div className="flex flex-col flex-1">
              <label className="text-muted-foreground">Class(es)</label>
              <MultiSelectList
                selectedItems={allClasses}
                allItems={allClasses.flatMap((cl: any) => cl.name)}
                itemsLabel="Classes"
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

          <GenerateAssessmentDialog />
        </form>
      </Card>
    </section>
  );
}
