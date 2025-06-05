"use client";

import Plan from "@/components/plan/Plan";
import React, {useState} from "react";
import {Button} from "@/components/ui/button";
import {ChevronLeft, BrickWall, ChartGantt, Calendar} from "lucide-react";

import PlanAccordion from "@/components/ui/planAccordion";
import LessonPlanForm from "@/components/plan/LessonPlanForm";
import CommingSoon from "@/components/ui/comming-soon";
import PageTitleH1 from "@/components/ui/page-title-h1";


export default function ReportsPage() {
    const [isPlanTemplateOpen, setIsPlanTemplateOpen] = useState(false);
    const [lessonPlanFormSubmitted, setLessonPlanFormSubmitted] = useState(false)

    const planTemplateHandler =()=>{
        setIsPlanTemplateOpen((prevState:boolean)=>!prevState);
    }

    const submitLessonPlanFormHandler =()=>{
        setLessonPlanFormSubmitted(true)
    }

    const unitsList = [
        { label: 'Unit one', href: '/page1' },
        { label: 'Unit Two', href: '/page2' },
        { label: 'Unit Three', href: '/page3' },
    ];


  return (
      <section className="flex flex-col gap-2 w-full">

          <div>
              <div className="flex justify-between items-center mb-2">
                  <div className="flex justify-between items-center bg-[#3e81d4] px-4 py-3 rounded-md">
                      <PageTitleH1 title="Plan" className="text-white"/>
                  </div>

                  {
                      isPlanTemplateOpen &&
                      <Button variant="ghost" className="w-fit" onClick={() => {
                          setIsPlanTemplateOpen(false)
                          setLessonPlanFormSubmitted(false)
                      }}>
                          <ChevronLeft className="mr-2 h-4 w-4"/>
                          Retour
                      </Button>
                  }

              </div>

              <div className={"w-full flex"}>
                  <div className="ml-auto max-w-md mt-8 py-2 space-y-2">

                      <select
                          className="w-full border border-gray-300 rounded py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                          <option value="">-- Select a class --</option>
                          <option value="option1">Class One</option>
                          <option value="option2">Class Two</option>
                          <option value="option3">Class Three</option>
                      </select>
                  </div>
              </div>

              <CommingSoon title="Bienvenur dans la plateforme de preparation de matiere"/>


              {
                  isPlanTemplateOpen && !lessonPlanFormSubmitted ?

                      <LessonPlanForm callback={(state: boolean) => {
                          setLessonPlanFormSubmitted(state)
                      }}/>
                      : (
                          isPlanTemplateOpen && lessonPlanFormSubmitted ?
                              <Plan/>
                              :
                              <div className="flex flex-col md:flex-row gap-4 items-start mb-5">
                                  <PlanAccordion title="Scope and Sequence" icon={<BrickWall/>}
                                                 callback={planTemplateHandler}
                                                 items={unitsList}/>
                                  <PlanAccordion title="Unit Plans" icon={<ChartGantt/>} callback={planTemplateHandler}
                                                 items={unitsList}/>
                                  <PlanAccordion title="Lesson Plans" icon={<Calendar/>} callback={planTemplateHandler}
                                                 items={unitsList}/>
                              </div>)

              }

          </div>
      </section>

  )
}
