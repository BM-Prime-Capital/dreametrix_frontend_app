"use client";

import PageTitleH1 from "@/components/ui/page-title-h1";
import {Button} from "@/components/ui/button";
import { ChevronLeft, Plus, Edit } from 'lucide-react';
import React from "react";
import {useRouter} from "next/navigation";


interface Subject {
    id: string;
    name: string;
    grades: {
        id: string;
        name: string;
        units: {
            id: string;
            name: string;
            duration: string;
        }[];
    }[];
}

const ScopeAndSequence =()=>{
    const router = useRouter();
    const scopeData: Subject[] =  [
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
        }
    ];
    return(
        <section className="flex flex-col gap-2 w-full">
            <div className="flex justify-between items-center bg-[#3e81d4] px-4 py-3 rounded-md">
                <PageTitleH1 title="Plan > Scope and Sequence" className="text-white"/>
            </div>
            {/*<Button variant="ghost" className="w-fit" onClick={() => router.back()}>*/}
            {/*    <ChevronLeft className="mr-2 h-4 w-4"/>*/}
            {/*    Back*/}
            {/*</Button>*/}

            <div className={"flex flex-col gap-8 bg-white p-4 rounded-md"}>
                <div className="flex justify-between items-center mb-2">
                    <Button variant="ghost" onClick={() => router.back()}>
                        <ChevronLeft className="mr-2"/> Back
                    </Button>
                    <div className="space-x-2">
                        {/*<Button onClick={() => {*/}
                        {/*}*/}
                        {/*    // navigateTo('scope-sequence-edit', scopeData)*/}
                        {/*}*/}
                        {/*>*/}
                        {/*    <Edit className="mr-2"/> Edit*/}
                        {/*</Button>*/}
                        <Button className={"bg-blue-500 hover:bg-blue-600"}>
                            <Plus className="mr-2b "/> New Scope
                        </Button>
                    </div>
                </div>

                <div className="space-y-4">
                    {scopeData.map((subject) => (
                        <div key={subject.id} className="bg-white p-6 rounded-lg shadow border">
                            <h3 className="text-xl font-semibold mb-4">{subject.name}</h3>
                            <div className="space-y-6">
                                {subject.grades.map((grade) => (
                                    <div key={grade.id} className="border p-4 rounded">
                                        <h4 className="font-medium mb-2">Grade: {grade.name}</h4>
                                        <div className="space-y-2">
                                            {grade.units.map((unit) => (
                                                <div key={unit.id}
                                                     className="flex justify-between items-center p-2 hover:bg-gray-50 rounded">
                                                    <div>
                                                        <p className="font-medium">{unit.name}</p>
                                                        <p className="text-sm text-gray-500">{unit.duration}</p>
                                                    </div>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        // onClick={() => navigateTo('unit-plan-view', unit)}
                                                    >
                                                        See scope
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

            </div>


        </section>
    )
}
export default ScopeAndSequence;
