// import {BookOpen, LucideIcon} from "lucide-react";
// import PageTitleH1 from "@/components/ui/page-title-h1";
import {FC, ReactNode} from "react";
import PageTitleH1 from "@/components/ui/page-title-h1";


type headerTypes = {
    title: string;
    description?: string;
    icon?: ReactNode

}
export const Header:FC<headerTypes> =({title, description, icon})=>{

    return (
        <div className="flex justify-between items-center bg-[#79bef2] px-8 py-6 shadow-xl rounded-2xl mx-6 mt-8">
            <div className="flex items-center gap-4">
                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                    {icon}
                </div>
                <div>
                    <PageTitleH1 title={title} className="text-white font-bold text-2xl"/>

                    <p className="text-blue-100 text-sm mt-1">
                        {description}
                    </p>
                </div>

            </div>

        </div>
    )
}

