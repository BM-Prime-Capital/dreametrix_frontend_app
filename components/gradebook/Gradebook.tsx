"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { GradebookTable } from "./gradebook-table";
import PageTitleH1 from "@/components/ui/page-title-h1";
import { GradebookClassTable } from "./gradebook-class-table";
import ClassSelect from "../ClassSelect";
import { getGradebookList, getGradebookFocusList } from "@/services/GradebooksService";
import { localStorageKey, views } from "@/constants/global";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Gradebook() {
    const [view, setView] = useState<string>(views.GENERAL_VIEW);
    
    return (
        <>
            {view === views.GENERAL_VIEW ? (
                <GradebookGeneralView changeView={setView} />
            ) : (
                <GradebookFocusedView changeView={setView} />

            )}
        </>
    );
}

function GradebookGeneralView({ changeView }: { changeView: Function }) {
    const [gradebookData, setGradebookData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const allClasses = JSON.parse(localStorage.getItem(localStorageKey.ALL_CLASSES)!);

    const accessToken: any = localStorage.getItem(localStorageKey.ACCESS_TOKEN);
    const refreshToken: any = localStorage.getItem(localStorageKey.REFRESH_TOKEN);
    const tenantData: any = localStorage.getItem(localStorageKey.TENANT_DATA);
    const { primary_domain } = JSON.parse(tenantData);
    const tenantPrimaryDomain = `https://${primary_domain}`;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getGradebookList(tenantPrimaryDomain, accessToken, refreshToken);
                const formatted = data.map((item: any) => ({
                    id: item.class_id,
                    name: item.class_name,
                    average: item.average,
                    noOfExams: item.test,
                    noOfTests: item.quiz,
                    noOfHomeworks: item.homework,
                    noOfParticipation: item.participation,
                    noOfOther: item.other,
                }));
                setGradebookData(formatted);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleClassClick = (selectedClass: any) => {
        localStorage.setItem(
            localStorageKey.CURRENT_SELECTED_CLASS,
            JSON.stringify(allClasses.find((cl: any) => cl.id === selectedClass.id))
        );
        changeView(views.FOCUSED_VIEW);
    };

    return (
        <div className="flex flex-col gap-8 w-full pb-4">
            <PageTitleH1 title="GRADEBOOK GENERAL VIEW" className="text-[#e91e63]" />
            <div className="flex flex-col gap-8 bg-white p-4 rounded-md">
                {loading ? (
                    <p>Loading...</p>
                ) : error ? (
                    <p className="text-red-500">{error}</p>
                ) : (
                    <table className="w-full">
                        <thead>
                            <tr>
                                <th>Class</th>
                                <th>Average</th>
                                <th>Exams</th>
                                <th>Tests</th>
                                <th>Homeworks</th>
                                <th>Participation</th>
                                <th>Other</th>
                            </tr>
                        </thead>
                        <tbody>
                            {gradebookData.map((classData) => (
                                <tr 
                                    key={classData.id} 
                                    className="cursor-pointer"
                                    onClick={() => handleClassClick(classData)}
                                >
                                    <td>{classData.name}</td>
                                    <td>{classData.average}%</td>
                                    <td>{classData.noOfExams}</td>
                                    <td>{classData.noOfTests}</td>
                                    <td>{classData.noOfHomeworks}</td>
                                    <td>{classData.noOfParticipation}</td>
                                    <td>{classData.noOfOther}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}

function GradebookFocusedView({ changeView }: { changeView: Function }) {
    const [classStudents, setClassStudents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const accessToken: any = localStorage.getItem(localStorageKey.ACCESS_TOKEN);
    const refreshToken: any = localStorage.getItem(localStorageKey.REFRESH_TOKEN);
    const tenantData: any = localStorage.getItem(localStorageKey.TENANT_DATA);
    const { primary_domain } = JSON.parse(tenantData);
    const tenantPrimaryDomain = `https://${primary_domain}`;

    useEffect(() => {
        const fetchClassData = async () => {
            try {
                const currentClass = JSON.parse(
                    localStorage.getItem(localStorageKey.CURRENT_SELECTED_CLASS)!
                );
                
                const studentsData = await getGradebookFocusList(
                    tenantPrimaryDomain,
                    accessToken,
                    refreshToken,
                    currentClass.id
                );
                
                setClassStudents(studentsData);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchClassData();
    }, []);

    return (
        <section className="flex flex-col gap-2 w-full">
            <div className="flex justify-between items-center">
                <PageTitleH1 title="GRADEBOOK FOCUSED VIEW" />
                <div className="flex items-center gap-2">
                    <ClassSelect />
                </div>
            </div>
            
            <div className="flex justify-end">
                <Link
                    href={"#"}
                    className="whitespace-nowrap text-bgPurple underline"
                    onClick={() => changeView(views.GENERAL_VIEW)}
                >
                    Go to general view
                </Link>
            </div>
            
            {/* <Card className="rounded-md">
                {loading ? (
                    <p>Loading student data...</p>
                ) : error ? (
                    <p className="text-red-500">{error}</p>
                ) : (
                    <GradebookClassTable students={classStudents} />
                )}
            </Card> */}
        </section>
    );
}