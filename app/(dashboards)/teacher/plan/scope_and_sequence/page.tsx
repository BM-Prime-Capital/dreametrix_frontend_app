"use client";

import PageTitleH1 from "@/components/ui/page-title-h1";
import {Button} from "@/components/ui/button";
import { ChevronLeft, Plus, Edit } from 'lucide-react';
import React, { useState } from "react";
import {useRouter} from "next/navigation";
import {ScopeCard, Subject} from "@/components/plan/ScopeCard";

const ScopeAndSequence = () => {
    const router = useRouter();
    const [scopeData, setScopeData] = useState<Subject[]>([
        {
            id: "1",
            name: "Mathematics",
            grades: [
                {
                    id: "1",
                    name: "6th",
                    units: [
                        { id: "1", name: "Basic algebra", duration: "3 weeks" },
                        { id: "2", name: "Geometry plan", duration: "4 weeks" }
                    ]
                }
            ]
        },         {
            id: "2",
            name: "History",
            grades: [
                {
                    id: "2",
                    name: "7th",
                    units: [
                        { id: "3", name: "Introduction", duration: "1 week" },
                        { id: "4", name: "Bing Bang Theory", duration: "2 weeks" }
                    ]
                }
            ]
        }
    ]);

    const handleUnitsReorder = (subjectId: string, gradeId: string, newUnits: any[]) => {
        setScopeData(prevData => 
            prevData.map(subject => {
                if (subject.id === subjectId) {
                    return {
                        ...subject,
                        grades: subject.grades.map(grade => {
                            if (grade.id === gradeId) {
                                return {
                                    ...grade,
                                    units: newUnits
                                };
                            }
                            return grade;
                        })
                    };
                }
                return subject;
            })
        );
    };

    return(
        <section className="flex flex-col gap-2 w-full">
            <div className="flex justify-between items-center bg-[#3e81d4] px-4 py-3 rounded-md">
                <PageTitleH1 title="Plan > Scope and Sequence" className="text-white"/>
            </div>

            <div className={"flex flex-col gap-8 bg-white p-4 rounded-md"}>
                <div className="flex justify-between items-center mb-2">
                    <Button variant="ghost" onClick={() => router.back()}>
                        <ChevronLeft className="mr-2"/> Back
                    </Button>
                    <div className="space-x-2">
                        <Button className={"bg-blue-500 hover:bg-blue-600"}>
                            <Plus className="mr-2b "/> New Scope
                        </Button>
                    </div>
                </div>

                <div className="space-y-4">
                    {scopeData.map((subject) => (
                        <ScopeCard 
                            key={subject.id} 
                            {...subject} 
                            onUnitsReorder={(gradeId, newUnits) => 
                                handleUnitsReorder(subject.id, gradeId, newUnits)
                            }
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ScopeAndSequence;
