"use client";

import Plan from "@/components/plan/Plan";
import React, {useState} from "react";
import {Button} from "@/components/ui/button";
import {
    ChevronLeft,
    BrickWall,
    ChartGantt,
    Calendar,
    CalendarX,
    Layers,
    NotebookText,
    BookOpen,
    LayoutList, FileText
} from "lucide-react";

import PlanAccordion from "@/components/ui/planAccordion";
import LessonPlanForm from "@/components/plan/LessonPlanForm";
import ComingSoon from "@/components/ui/coming-soon";
import PageTitleH1 from "@/components/ui/page-title-h1";
import {FeatureCard} from "@/components/plan/FeatureCard";

export default function PlanHome() {

    const [isPlanTemplateOpen, setIsPlanTemplateOpen] = useState(false);
    const [lessonPlanFormSubmitted, setLessonPlanFormSubmitted] = useState(false)

    const planTemplateHandler =()=>{
        setIsPlanTemplateOpen((prevState:boolean)=>!prevState);
    }

    const features = [
        {
            title: "Scope and Sequence",
            icon: <CalendarX className="w-5 h-5" />,
            description: "Annual planning by subject and level",
            link:"scope_and_sequence",
            // onClick: () => navigateTo('scope-sequence-view')
        },
        {
            title: "Unit Plans",
            icon: <Layers className="w-5 h-5" />,
            description: "Teaching modules with objectives and resources",
            link:"unit_plans",

            // onClick: () => navigateTo('unit-plan-view')
        },
        {
            title: "Lesson Plans",
            icon: <NotebookText className="w-5 h-5" />,
            description: "Detailed day-by-day lesson plans",
            link:"lesson_plans",
            // onClick: () => navigateTo('lesson-plan-view')
        }
    ];


    return (
        <section className="flex flex-col gap-2 w-full">
            <div className="flex justify-between items-center bg-[#3e81d4] px-4 py-3 rounded-md">
                <PageTitleH1 title="Plan" className="text-white"/>
            </div>

            <div className={"flex flex-col gap-8 bg-white p-4 rounded-md"}>

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


                <div className="p-4">
                    <h1 className="text-3xl font-bold">Welcome to the material preparation section</h1>
                    <p className="mt-4 text-muted-foreground">
                        These tools help to align teaching with standards
                    </p>
                </div>


                {/*<LessonPlanForm callback={(state: boolean) => {*/}
                {/*    setLessonPlanFormSubmitted(state)*/}
                {/*}}/>*/}

                <div className="max-w-4xl mx-auto py-2 px-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {features.map((feature, index) => (
                            <FeatureCard key={index} {...feature} />
                        ))}
                    </div>
                </div>


                {/*<Plan/>*/}



            </div>
        </section>

    )
}
