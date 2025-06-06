'use client';

import {ReactNode, useState} from 'react';
// import Link from 'next/link';
import {useRouter} from "next/navigation";


type Item = {
    label: string;
    href: string;
};


type AccordionProps = {
    title: string;
    link:string;
    icon: ReactNode;
    callback: ()=>void
};

export default function PlanAccordion({ title, icon, link  }: AccordionProps) {
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();

    return (
        <div onClick={() => router.push(`/teacher/plan/${link}`)} className="min-w-[280px] border rounded-xl shadow-sm bg-white">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full px-4 py-3 flex items-center justify-between text-left font-semibold hover:bg-gray-100 "
            >
                {icon}

                <p className={"text-sm"}>{title}</p>
            </button>

        </div>
    );
}
