// import {BookOpen, LucideIcon} from "lucide-react";
// import PageTitleH1 from "@/components/ui/page-title-h1";
import {FC, ReactNode} from "react";
import PageTitleH1 from "@/components/ui/page-title-h1";

// Predefined Dreametrix brand color variants
export type HeaderColorVariant = "primary" | "secondary" | "accent" | "light";

type headerTypes = {
    title: string;
    description?: string;
    icon?: ReactNode;
    backgroundColor?: HeaderColorVariant | string; // Can be a predefined variant or custom color (hex/Tailwind)
}

// Dreametrix brand color palette - aligned with design system
const DREAMETRIX_COLORS: Record<HeaderColorVariant, string> = {
    primary: "#25AAE1",      // Primary Blue - Main brand color
    secondary: "#D15A9D",    // Secondary Pink - Secondary brand color
    accent: "#7F569F",       // Accent Purple - Tertiary brand color
    light: "#79bef2",        // Light Blue - App primary (default fallback)
} as const;

export const Header:FC<headerTypes> =({title, description, icon, backgroundColor})=>{
    // Default background color (fallback)
    const defaultBgColor = DREAMETRIX_COLORS.light;

    let bgStyle: React.CSSProperties = {};
    let bgClass = "";

    if (!backgroundColor) {
        // No color provided - use default fallback
        bgStyle = { backgroundColor: defaultBgColor };
    } else if (backgroundColor in DREAMETRIX_COLORS) {
        // Predefined Dreametrix color variant
        const colorValue = DREAMETRIX_COLORS[backgroundColor as HeaderColorVariant];
        bgStyle = { backgroundColor: colorValue };
    } else {
        // Custom color - check if it's a hex color or Tailwind class
        const isHexColor = backgroundColor.startsWith("#");
        if (isHexColor) {
            bgStyle = { backgroundColor: backgroundColor };
        } else {
            bgClass = backgroundColor; // Tailwind class
        }
    }

    return (
        <div
            className={`flex justify-between items-center ${bgClass ? bgClass : ""} px-8 py-6 shadow-xl rounded-2xl mx-6 mt-8`}
            style={Object.keys(bgStyle).length > 0 ? bgStyle : undefined}
        >
            <div className="flex items-center gap-4">
                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                    <div className="h-6 w-6 text-white">
                        {icon}
                    </div>

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

