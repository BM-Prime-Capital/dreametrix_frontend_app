import React, { useState } from 'react';
import { FileText, Edit, Copy, Trash2, MoreVertical, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Activity {
    type: string;
    duration: string;
    description: string;
}

interface LessonPlan {
    id: string;
    title: string;
    date: string;
    class: string;
    standards: string;
    objectives: string[];
    activities: Activity[];
}

interface LessonPlanCardProps {
    lessonPlan: LessonPlan;
    onEdit: (id: string) => void;
    onDuplicate: (id: string) => void;
    onDelete: (id: string) => void;
}

const LessonPlanCard: React.FC<LessonPlanCardProps> = ({
                                                           lessonPlan,
                                                           onEdit,
                                                           onDuplicate,
                                                           onDelete
                                                       }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className="bg-white rounded-lg shadow-sm border p-4 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3 min-w-0">
                    <div className="bg-blue-50 p-2 rounded-lg flex-shrink-0">
                        <FileText className="h-6 w-6 text-blue-500" />
                    </div>
                    <div className="min-w-0">
                        <h3 className="font-semibold text-lg truncate">{lessonPlan.title}</h3>
                        <p className="text-sm text-gray-500 truncate">{lessonPlan.class}</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="hover:bg-gray-100"
                    >
                        {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </Button>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="hover:bg-gray-100"
                            >
                                <MoreVertical className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => onEdit(lessonPlan.id)}>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onDuplicate(lessonPlan.id)}>
                                <Copy className="h-4 w-4 mr-2" />
                                Duplicate
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => onDelete(lessonPlan.id)}
                                className="text-red-500 focus:text-red-500"
                            >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:gap-4 text-sm mb-3">
                <div className="mb-2 sm:mb-0">
                    <span className="text-gray-500">Date:</span>
                    <span className="ml-1">{new Date(lessonPlan.date).toLocaleDateString()}</span>
                </div>
                <div>
                    <span className="text-gray-500">Standards:</span>
                    <span className="ml-1">{lessonPlan.standards}</span>
                </div>
            </div>

            {isExpanded && (
                <div className="space-y-3">
                    <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-1">Objectives:</h4>
                        <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                            {lessonPlan.objectives.map((objective, index) => (
                                <li key={index} className="break-words">{objective}</li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-1">Activities:</h4>
                        <div className="space-y-2">
                            {lessonPlan.activities.map((activity, index) => (
                                <div key={index} className="text-sm bg-gray-50 p-2 rounded">
                                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
                                        <span className="font-medium">{activity.type}</span>
                                        <span className="text-gray-500 text-xs sm:text-sm">{activity.duration}</span>
                                    </div>
                                    <p className="text-gray-600 mt-1 break-words">{activity.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LessonPlanCard;
