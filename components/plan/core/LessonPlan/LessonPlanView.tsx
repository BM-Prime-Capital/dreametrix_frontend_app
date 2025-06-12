"use client";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Edit } from 'lucide-react';
import { PlanView } from "../../PlanRouter";

interface LessonActivity {
  type: string;
  duration: string;
  description: string;
}

interface LessonPlan {
  id: string;
  title: string;
  date: string;
  objectives: string[];
  standards: string[];
  activities: LessonActivity[];
  materials: string[];
  assessment: string;
}

export default function LessonPlanView({
  navigateTo,
  initialData
}: {
  navigateTo: (view: PlanView, data?: any) => void;
  initialData?: any;
}) {
  const lessonData: LessonPlan = initialData || {
    id: "1",
    title: "Introduction aux variables",
    date: "01/09/2023",
    objectives: [
      "Comprendre le concept de variable",
      "Traduire des phrases en expressions algébriques"
    ],
    standards: ["CCSS.MATH.CONTENT.6.EE.A.2"],
    activities: [
      {
        type: "Échauffement",
        duration: "10 min",
        description: "Problèmes mentaux de calcul"
      },
      {
        type: "Instruction directe",
        duration: "20 min",
        description: "Explication du concept de variable avec exemples"
      }
    ],
    materials: ["Manuel page 45", "Feuille d'exercices"],
    assessment: "Exercices de pratique en classe"
  };

  return (
    <div className="max-w-4xl mx-auto py-6 px-4">
      <div className="flex justify-between items-center mb-6">
        <Button variant="ghost" onClick={() => navigateTo('unit-plan-view')}>
          <ChevronLeft className="mr-2" /> Retour
        </Button>
        <Button onClick={() => navigateTo('lesson-plan-edit', lessonData)}>
          <Edit className="mr-2" /> Modifier
        </Button>
      </div>

      <div className="space-y-6">
        <div className="bg-white p-6 rounded-lg shadow border">
          <h2 className="text-2xl font-bold mb-2">{lessonData.title}</h2>
          <p className="text-gray-600 mb-4">Date: {lessonData.date}</p>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Objectifs</h3>
              <ul className="list-disc pl-5 space-y-1">
                {lessonData.objectives.map((obj, i) => (
                  <li key={i}>{obj}</li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Standards</h3>
              <div className="flex flex-wrap gap-2">
                {lessonData.standards.map((std, i) => (
                  <span key={i} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                    {std}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border">
          <h3 className="font-semibold mb-4">Activités</h3>
          <div className="space-y-4">
            {lessonData.activities.map((activity, i) => (
              <div key={i} className="border-l-4 border-blue-500 pl-4 py-2">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">{activity.type}</p>
                    <p className="text-gray-600 text-sm">{activity.duration}</p>
                  </div>
                </div>
                <p className="mt-1">{activity.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border">
          <h3 className="font-semibold mb-2">Matériels</h3>
          <ul className="list-disc pl-5 space-y-1">
            {lessonData.materials.map((mat, i) => (
              <li key={i}>{mat}</li>
            ))}
          </ul>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border">
          <h3 className="font-semibold mb-2">Évaluation</h3>
          <p>{lessonData.assessment}</p>
        </div>
      </div>
    </div>
  );
}