"use client";

import { Card } from "@/components/ui/card";
import PageTitleH1 from "@/components/ui/page-title-h1";
import React from "react";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Button} from "@/components/ui/button";
import {useTestPrep} from "@/hooks/Teacher/useTestPrep";



export default function TestPrep() {

    const {
        initTestPrepData,
        isLoading,
        subjectsList,
        gradesList,
        testTypesList,
        handleInputChange,
        handleSubmit,
    } = useTestPrep();


    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const result = await handleSubmit(initTestPrepData);
            console.log("result ===>", result)

        } catch (error) {
            console.error('Registration failed:', error);
        }
    };

    return (
        <section className="flex flex-col gap-2 w-full">
            <div className="">
                <PageTitleH1 title="TEST PREPARATION" />
                <p className="pl-3">Question Simplar</p>
            </div>
            <div className="flex gap-4 justify-start">
                <form onSubmit={onSubmit} className="px-3 w-full">
                    <div className="flex justify-between items-center py-5">
                        <div>
                            <label className="flex flex-col space-y-1">
                                <span className="text-sm text-gray-600">Select question Simplar</span>
                                <Select
                                    value={initTestPrepData.subject}
                                    onValueChange={(value) => handleInputChange('subject', value)}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select a subject"/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        {subjectsList.map((subject) => (
                                            <SelectItem key={subject.value} value={subject.value}>
                                                {subject.display_name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </label>
                        </div>
                        <div>
                            {initTestPrepData.subject &&
                                <label className="flex flex-col space-y-1">
                                    <span className="text-sm text-gray-600">Select Grade</span>
                                    <Select
                                        value={initTestPrepData.grade}
                                        onValueChange={(value) => handleInputChange('grade', value)}
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select a grade"/>
                                        </SelectTrigger>
                                        <SelectContent>
                                            {gradesList.map((grade) => (
                                                <SelectItem key={grade.value} value={grade.value}>
                                                    {grade.display_name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </label>
                            }

                        </div>
                        <div>
                            {(initTestPrepData.grade && initTestPrepData.subject) &&
                            <label className="flex flex-col space-y-1">
                                <span className="text-sm text-gray-600">Select Test</span>
                                <Select
                                    value={initTestPrepData.testType}
                                    onValueChange={(value) => handleInputChange('testType', value)}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select a test"/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        {testTypesList.map((testType) => (
                                            <SelectItem key={testType.value} value={testType.value}>
                                                {testType.display_name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                            </label>
                            }
                        </div>
                    </div>
                    <div className="flex justify-center items-center">
                            <Button disabled={!initTestPrepData.subject || !initTestPrepData.grade || !initTestPrepData.testType || isLoading} className="gap-2 text-base bg-blue-500 hover:bg-blue-600">
                                Lunch test
                            </Button>
                    </div>


                </form>
            </div>
            <Card className="rounded-md">
                <div className="w-full flex gap-6 bg-[#fff] p-4 pb-0 pl-0">
                    <div className="flex gap-4 pl-4">
                        <div className="py-8" >
                            <h2 className="text-center font-bold">More about Question Simplar</h2>
                            <p className="pl-3 text-justify">
                                Lorem ipsum dolor sit amet,
                                consectetur adipiscing elit,
                                sed do eiusmod tempor incididunt ut
                                labore et dolore magna aliqua.
                                Ut enim ad minim veniam, quis
                                nostrud exercitation ullamco laboris nisi
                                ut aliquip ex ea commodo consequat.
                                Duis aute irure dolor in reprehenderit in
                                voluptate velit esse cillum dolore eu fugiat
                                nulla pariatur. Excepteur sint occaecat cupidatat
                                non proident, sunt in culpa qui officia deserunt
                                mollit anim id est laborum.
                            </p>
                        </div>

                    </div>
                </div>

            </Card>
        </section>
    );
}
