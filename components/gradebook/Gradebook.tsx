"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { GradebookTable } from "./gradebook-table";
import PageTitleH1 from "@/components/ui/page-title-h1";
// import { AddGradebookItemDialog } from "./AddGradebookItemDialog";
import { GradebookClassTable } from "./gradebook-class-table";
import { Button } from "../ui/button";
import Image from "next/image";
import { generalImages } from "@/constants/images";
import ClassSelect from "../ClassSelect";
import { getGradebookList } from "@/services/GradebooksService";
import { localStorageKey } from "@/constants/global";

export default function Gradebook() {
    const [currentClass, setCurrentClass] = useState<any>(null);
    const [gradebookData, setGradebookData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const accessToken: any = localStorage.getItem(localStorageKey.ACCESS_TOKEN);
    const refreshToken: any = localStorage.getItem(localStorageKey.REFRESH_TOKEN);
    const tenantData: any = localStorage.getItem(localStorageKey.TENANT_DATA);

    const { primary_domain } = JSON.parse(tenantData);
    const tenantPrimaryDomain = `https://${primary_domain}`;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getGradebookList(tenantPrimaryDomain, accessToken, refreshToken);

                // Mapper vers le format attendu par GradebookTable
                const formatted = data.map((item: any) => ({
                    id: item.class_id,
                    name: `${item.class_name}`,
                    average: `${item.average}%`,
                    noOfExams: item.test,
                    noOfTests: item.quiz,
                    noOfHomeworks: item.homework,
                    noOfParticipation: item.participation,
                    noOfOther: item.other,
                    totalWork: item.homework + item.test + item.quiz + item.participation + item.other,
                }));

                setGradebookData(formatted);
            } catch (err: any) {
                setError(err.message || "Erreur inconnue");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <section className="flex flex-col gap-2 w-full">
            <div className="flex items-center justify-between">
                <div className="flex items-center">
                    <PageTitleH1 title="GRADEBOOK" className="text-[#e91e63]" />
                    {currentClass && (
                        <h1 className="text-[#e91e63] text-2xl font-bold px-2">
                            : {currentClass.name}
                        </h1>
                    )}
                </div>

                {currentClass && <ClassSelect />}
            </div>

            {/* <div className="flex gap-2">
                <AddGradebookItemDialog />
                {currentClass && (
                    <Button className="flex gap-2 items-center text-lg bg-yellow-500 hover:bg-yellow-600 rounded-md px-2 py-4 lg:px-4 lg:py-6">
                        <Image
                            src={generalImages.layout}
                            alt="add"
                            width={100}
                            height={100}
                            className="w-8 h-8"
                        />
                        <span>Layout</span>
                    </Button>
                )}
            </div> */}

            <Card className="rounded-md">
                {loading ? (
                    <p className="p-4 text-center">Chargement des classes...</p>
                ) : error ? (
                    <p className="p-4 text-center text-red-500">{error}</p>
                ) : currentClass ? (
                    <GradebookClassTable />
                ) : (
                    <GradebookTable
                        classes={gradebookData}
                        setCurrentClass={setCurrentClass}
                    />
                )}
            </Card>
        </section>
    );
}