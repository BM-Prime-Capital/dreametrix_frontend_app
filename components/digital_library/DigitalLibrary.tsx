"use client";

import { Card } from "@/components/ui/card";
import PageTitleH1 from "@/components/ui/page-title-h1";
import { useState } from "react";
import { Button } from "../ui/button";
import { GenerateAssessmentDialog } from "./GenerateAssessmentDialog";

export default function DigitalLibrary() {
  const [isDreaMetrixBankOfQuestion, setIsDreaMetrixBankOfQuestion] =
    useState(false);

  return (
    <section className="flex flex-col gap-2 w-full p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <PageTitleH1 title="CREATED SHEET" className="text-bgPurple" />
        </div>
      </div>

      <Card className="rounded-md flex">
        <form className="flex flex-col gap-4 p-4 ">
          <div>
            <label
              onClick={() => setIsDreaMetrixBankOfQuestion(true)}
              className="flex gap-4 items-center font-bold"
            >
              DreaMetrix Bank of questions
              <input className="h-4 w-4" type="radio" name="question" />
            </label>
            {isDreaMetrixBankOfQuestion && (
              <label className="text-red-500">
                Functionality not yet available.{" "}
              </label>
            )}
          </div>

          <label
            onClick={() => setIsDreaMetrixBankOfQuestion(false)}
            className="flex gap-4 items-center font-bold"
          >
            Or Actual release Questions
            <input
              className="h-4 w-4"
              type="radio"
              name="question"
              checked={isDreaMetrixBankOfQuestion === false}
            />
          </label>

          <div className="flex gap-6 flex-wrap flex-1 ">
            <div className="flex flex-col flex-1">
              <label className="text-muted-foreground">Subject:</label>
              <select
                style={{ border: "solid 1px #eee" }}
                className="px-2 py-1 bg-white rounded-full min-w-[300px] "
                disabled={isDreaMetrixBankOfQuestion === true}
              >
                <option disabled>Select Subject</option>
                <option>Math</option>
                <option>Language</option>
              </select>
            </div>

            <div className="flex flex-col flex-1">
              <label className="text-muted-foreground">Grade:</label>
              <select
                style={{ border: "solid 1px #eee" }}
                className="px-2 py-1 bg-white rounded-full min-w-[300px] "
                disabled={isDreaMetrixBankOfQuestion === true}
              >
                <option disabled>Select Grade</option>
                <option>3</option>
                <option>4</option>
                <option>5</option>
                <option>6</option>
                <option>7</option>
                <option>8</option>
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
              >
                <option disabled>Select Domain</option>
                <option>Domain 1</option>
                <option>Domain 2</option>
                <option>Domain 3</option>
                <option>Domain 4</option>
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

          <div className="flex gap-6 flex-wrap w-full">
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
              <label className="text-muted-foreground">Class</label>
              <select
                style={{ border: "solid 1px #eee" }}
                className="px-2 py-1 bg-white rounded-full min-w-[300px] "
                disabled={isDreaMetrixBankOfQuestion === true}
              >
                <option disabled>Select a Class</option>
                <option>Class 1 - M</option>
                <option>Class 2 - M</option>
                <option>Class 1 - L</option>
                <option>Class 2 - L</option>
                <option>Class 3 - M</option>
              </select>
            </div>
          </div>

          <label className="flex gap-4 items-center font-bold">
            Generate Answer Sheets
            <input className="h-4 w-4" type="checkbox" name="question" />
          </label>

          <GenerateAssessmentDialog />
        </form>
      </Card>
    </section>
  );
}
