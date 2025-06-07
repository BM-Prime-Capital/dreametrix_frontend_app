"use client";

"use client";

import PageTitleH1 from "@/components/ui/page-title-h1";
import {Button} from "@/components/ui/button";
import {ChevronLeft, FileText, Plus} from "lucide-react";
import React from "react";
import {useRouter} from "next/navigation";

const UnitPlans =()=>{
    const router = useRouter();
    const [unitPlans, setUnitPlans] = React.useState([]); // This will be populated with actual lesson plans later

    return(
        <section className="flex flex-col gap-2 w-full">
            <div className="flex justify-between items-center bg-[#3e81d4] px-4 py-3 rounded-md">
                <PageTitleH1 title="Plan > Unit Plans" className="text-white"/>
            </div>
            <div className={"flex flex-col gap-8 bg-white p-4 rounded-md"}>
                <div className="flex justify-between items-center mb-2">
                    <Button variant="ghost" onClick={() => router.back()}>
                        <ChevronLeft className="mr-2"/> Back
                    </Button>
                    <div className="space-x-2">
                        <Button className={"bg-blue-500 hover:bg-blue-600"}>
                            <Plus className="mr-2b "/> New Unit Plans
                        </Button>
                    </div>
                </div>

                {unitPlans.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                        <div className="bg-blue-50 p-6 rounded-full mb-4">
                            <FileText className="h-16 w-16 text-blue-500"/>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No Unit Plans Yet</h3>
                        <p className="text-gray-500 mb-6 max-w-sm">
                            Create your first unit plan to start organizing your teaching materials and activities.
                        </p>
                        <Button
                            className="bg-blue-500 hover:bg-blue-600"
                            onClick={() => {/* Handle new lesson plan creation */
                            }}
                        >
                            <Plus className="mr-2 h-4 w-4"/> Create Your First Unit Plan
                        </Button>
                    </div>
                ) : (
                    <div>
                        {/* Lesson plans list will go here */}
                    </div>
                )}
            </div>
        </section>
    )
}
export default UnitPlans;
