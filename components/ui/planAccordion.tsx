// components/Accordion.tsx
'use client';

import {ReactNode, useState} from 'react';
import Link from 'next/link';
import { ChevronDown, ChevronUp } from 'lucide-react';

type Item = {
    label: string;
    href: string;
};

type AccordionProps = {
    title: string;
    items: Item[];
    icon: ReactNode
};

export default function PlanAccordion({ title, items, icon }: AccordionProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="min-w-[280px] border rounded-xl shadow-sm bg-white">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full px-4 py-3 flex items-center justify-between text-left font-semibold hover:bg-gray-100"
            >
                {icon}
                <p className={"text-sm"}>{title}</p>

                {isOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
            </button>

            {isOpen && (
                <ul className="px-4 py-2 space-y-2 bg-gray-50">
                    {items.map((item) => (
                        <li key={item.href}>
                            <Link
                                href={item.href}
                                className="block px-3 py-2 rounded hover:bg-blue-100 text-blue-700 font-medium transition"
                            >
                                {item.label}
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
