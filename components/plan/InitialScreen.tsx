import React, { useState } from 'react';
import { BookOpen, LayoutList, FileText, ChevronDown, ChevronUp } from 'lucide-react';

interface Unit {
  id: number;
  name: string;
  lessons: { id: number; name: string }[];
}

interface InitialScreenProps {
  changeView: (viewName: string, plan?: any) => void;
}

const units: Unit[] = [
  {
    id: 1,
    name: "Unit 1: Introduction to Algebra",
    lessons: [
      { id: 1, name: "Lesson 1: Variables and Expressions" },
      { id: 2, name: "Lesson 2: Solving Equations" },
    ],
  },
  {
    id: 2,
    name: "Unit 2: Geometry Basics",
    lessons: [
      { id: 1, name: "Lesson 1: Points, Lines, and Planes" },
      { id: 2, name: "Lesson 2: Angles and Triangles" },
    ],
  },
  // Add more units as needed
];

const InitialScreen: React.FC<InitialScreenProps> = ({ changeView }) => {
  const [expandedUnit, setExpandedUnit] = useState<number | null>(null);

  const toggleUnit = (unitId: number) => {
    setExpandedUnit(expandedUnit === unitId ? null : unitId);
  };

  const navigateToLessonPlan = (lesson: any) => {
    changeView("LESSON_PLAN_VIEW", lesson);
  };

  return (
    <div className="flex flex-col items-center p-4 bg-gray-100 min-h-screen">
      <div className="w-full max-w-4xl">
        <div className="flex justify-around w-full mb-8">
          <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow-md">
            <BookOpen className="h-12 w-12 mb-2 text-blue-500" />
            <span className="text-sm font-medium">Scope and Sequence</span>
          </div>
          <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow-md">
            <LayoutList className="h-12 w-12 mb-2 text-green-500" />
            <span className="text-sm font-medium">Unit Plans</span>
          </div>
          <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow-md">
            <FileText className="h-12 w-12 mb-2 text-purple-500" />
            <span className="text-sm font-medium">Lesson Plans</span>
          </div>
        </div>

        <div className="w-full bg-white rounded-lg shadow-md p-4">
          <h2 className="text-lg font-semibold mb-4">Units:</h2>
          <ul className="space-y-2">
            {units.map((unit) => (
              <li key={unit.id} className="mb-2 bg-gray-50 p-3 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{unit.name}</span>
                  <button onClick={() => toggleUnit(unit.id)} className="text-blue-500">
                    {expandedUnit === unit.id ? <ChevronUp /> : <ChevronDown />}
                  </button>
                </div>
                {expandedUnit === unit.id && (
                  <ul className="list-disc pl-5 mt-2 space-y-1">
                    {unit.lessons.map((lesson) => (
                      <li key={lesson.id} className="mb-1">
                        <button onClick={() => navigateToLessonPlan(lesson)} className="text-blue-500 hover:underline">
                          {lesson.name}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default InitialScreen;
