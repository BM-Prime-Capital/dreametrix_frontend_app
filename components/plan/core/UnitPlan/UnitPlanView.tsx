"use client";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Plus, Edit } from 'lucide-react';
import { PlanView } from "../../PlanRouter";

interface UnitPlan {
  id: string;
  title: string;
  duration: string;
  objectives: string[];
  standards: string[];
  lessons: {
    id: string;
    title: string;
    date: string;
  }[];
}

export default function UnitPlanView({
  navigateTo,
  initialData
}: {
  navigateTo: (view: PlanView, data?: any) => void;
  initialData?: any;
}) {
  const unitData: UnitPlan = initialData || {
    id: "1",
    title: "Algèbre de base",
    duration: "3 semaines",
    objectives: [
      "Comprendre les concepts algébriques de base",
      "Résoudre des équations linéaires simples"
    ],
    standards: ["CCSS.MATH.CONTENT.6.EE.A.2"],
    lessons: [
      { id: "1", title: "Introduction aux variables", date: "01/09/2023" },
      { id: "2", title: "Équations simples", date: "08/09/2023" }
    ]
  };

  return (
    <div className="max-w-4xl mx-auto py-6 px-4">
      <div className="flex justify-between items-center mb-6">
        <Button variant="ghost" onClick={() => navigateTo('scope-sequence-view')}>
          <ChevronLeft className="mr-2" /> Retour
        </Button>
        <div className="space-x-2">
          <Button onClick={() => navigateTo('unit-plan-edit', unitData)}>
            <Edit className="mr-2" /> Modifier
          </Button>
          <Button onClick={() => navigateTo('lesson-plan-edit')}>
            <Plus className="mr-2" /> Nouvelle Leçon
          </Button>
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-4">{unitData.title}</h2>
      <p className="text-gray-600 mb-6">Durée: {unitData.duration}</p>
      
      <div className="bg-white p-6 rounded-lg shadow border mb-6">
        <h3 className="font-semibold mb-2">Objectifs</h3>
        <ul className="list-disc pl-5 space-y-1">
          {unitData.objectives.map((obj, i) => (
            <li key={i}>{obj}</li>
          ))}
        </ul>
      </div>

      <div className="bg-white p-6 rounded-lg shadow border mb-6">
        <h3 className="font-semibold mb-2">Standards</h3>
        <div className="flex flex-wrap gap-2">
          {unitData.standards.map((std, i) => (
            <span key={i} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
              {std}
            </span>
          ))}
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow border">
        <h3 className="font-semibold mb-4">Leçons</h3>
        <div className="space-y-2">
          {unitData.lessons.map((lesson) => (
            <div 
              key={lesson.id} 
              className="flex justify-between items-center p-3 border rounded hover:bg-gray-50 cursor-pointer"
              onClick={() => navigateTo('lesson-plan-view', lesson)}
            >
              <div>
                <p className="font-medium">{lesson.title}</p>
                <p className="text-sm text-gray-500">{lesson.date}</p>
              </div>
              <Button variant="outline" size="sm">
                Voir
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}