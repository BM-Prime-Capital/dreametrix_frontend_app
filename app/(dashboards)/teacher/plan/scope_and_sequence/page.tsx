"use client";

import PageTitleH1 from "@/components/ui/page-title-h1";
import {Button} from "@/components/ui/button";
import {ChevronLeft} from "lucide-react";
import React from "react";
import {useRouter} from "next/navigation";

const ScopeAndSequence =()=>{
    const router = useRouter();
    return(
        <section className="flex flex-col gap-2 w-full">
            <div className="flex justify-between items-center bg-[#3e81d4] px-4 py-3 rounded-md">
                <PageTitleH1 title="Plan > Scope and Sequence" className="text-white"/>
            </div>
            <Button variant="ghost" className="w-fit" onClick={() => router.back()}>
                <ChevronLeft className="mr-2 h-4 w-4"/>
                Back
            </Button>
            <div>Scope and Sequence</div>
        </section>
    )
}
export default ScopeAndSequence;
