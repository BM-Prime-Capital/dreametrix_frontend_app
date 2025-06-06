"use client";

import Plan from "@/components/plan/Plan";
import React, {useState} from "react";
import {Button} from "@/components/ui/button";
import {ChevronLeft, BrickWall, ChartGantt, Calendar} from "lucide-react";

import PlanAccordion from "@/components/ui/planAccordion";
import LessonPlanForm from "@/components/plan/LessonPlanForm";
import CommingSoon from "@/components/ui/comming-soon";
import PageTitleH1 from "@/components/ui/page-title-h1";

export default function PlanHome() {

    const [isPlanTemplateOpen, setIsPlanTemplateOpen] = useState(false);
    const [lessonPlanFormSubmitted, setLessonPlanFormSubmitted] = useState(false)

    const planTemplateHandler =()=>{
        setIsPlanTemplateOpen((prevState:boolean)=>!prevState);
    }


    return (
        <section className="flex flex-col gap-2 w-full">
            <div className="flex justify-between items-center bg-[#3e81d4] px-4 py-3 rounded-md">
                <PageTitleH1 title="Plan" className="text-white"/>
            </div>

            <div>
                <div className="flex justify-between items-center mb-2">

                    {
                        isPlanTemplateOpen &&
                        <Button variant="ghost" className="w-fit" onClick={() => {
                            setIsPlanTemplateOpen(false)
                            setLessonPlanFormSubmitted(false)
                        }}>
                            <ChevronLeft className="mr-2 h-4 w-4"/>
                            Back
                        </Button>
                    }

                </div>

                {/*<div className={"w-full flex"}>*/}
                {/*    <div className="ml-auto max-w-md mt-8 py-2 space-y-2">*/}

                {/*        /!*<select*!/*/}
                {/*        /!*    className="w-full border border-gray-300 rounded py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500">*!/*/}
                {/*        /!*    <option value="">-- Select a class --</option>*!/*/}
                {/*        /!*    <option value="option1">Class One</option>*!/*/}
                {/*        /!*    <option value="option2">Class Two</option>*!/*/}
                {/*        /!*    <option value="option3">Class Three</option>*!/*/}
                {/*        /!*</select>*!/*/}
                {/*    </div>*/}
                {/*</div>*/}

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
                                    <PlanAccordion title="Scope and Sequence" link={"scope_and_sequence"}
                                                   icon={<BrickWall/>}
                                                   callback={planTemplateHandler}
                                    />
                                    <PlanAccordion title="Unit Plans" link={"unit_plans"} icon={<ChartGantt/>}
                                                   callback={planTemplateHandler}
                                    />
                                    <PlanAccordion title="Lesson Plans" link={"lesson_plans"} icon={<Calendar/>}
                                                   callback={planTemplateHandler}
                                    />
                                </div>)

                }

            </div>
        </section>

    )
}
