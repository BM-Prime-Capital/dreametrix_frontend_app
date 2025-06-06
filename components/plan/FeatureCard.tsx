import React from "react";
import {useRouter} from "next/navigation";

interface FeatureCardProps {
    icon: React.ReactNode;
    link:string,
    title: string;
    description: string;
    onClick?: () => void;
}

export const FeatureCard =({ icon, title, description,link, onClick }: FeatureCardProps)=>{
    const router = useRouter();
    return (
        <div
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer flex flex-col items-center text-center h-full"
            onClick={() => router.push(`/teacher/plan/${link}`)}
        >
            <div className="bg-blue-50 p-3 rounded-full mb-4 text-blue-600">
                {icon}
            </div>
            <h3 className="text-xl font-semibold mb-2">{title}</h3>
            <p className="text-gray-600 text-sm">{description}</p>
        </div>

    )
}
