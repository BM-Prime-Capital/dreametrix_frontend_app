"use client";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Plus, Edit } from 'lucide-react';
import { PlanView } from "../../PlanRouter";

interface Subject {
  id: string;
  name: string;
  grades: {
    id: string;
    name: string;
    units: {
      id: string;
      name: string;
      duration: string;
    }[];
  }[];
}

export default function ScopeSequenceView({
  navigateTo,
  initialData
}: {
  navigateTo: (view: PlanView, data?: any) => void;
  initialData?: any;
}) {
  // Données simulées - À remplacer par votre API
  const scopeData: Subject[] = initialData || [
    {
      id: "1",
      name: "Mathématiques",
      grades: [
        {
          id: "1",
          name: "6ème",
          units: [
            { id: "1", name: "Algèbre de base", duration: "3 semaines" },
            { id: "2", name: "Géométrie plane", duration: "4 semaines" }
          ]
        }
      ]
    }
  ];

  return (
    <div className="max-w-6xl mx-auto py-6 px-4">
      <div className="flex justify-between items-center mb-6">
        <Button variant="ghost" onClick={() => navigateTo('initial')}>
          <ChevronLeft className="mr-2" /> Retour
        </Button>
        <div className="space-x-2">
          <Button onClick={() => navigateTo('scope-sequence-edit', scopeData)}>
            <Edit className="mr-2" /> Modifier
          </Button>
          <Button>
            <Plus className="mr-2" /> Nouveau Scope
          </Button>
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-6">Scope and Sequence</h2>
      
      <div className="space-y-8">
        {scopeData.map((subject) => (
          <div key={subject.id} className="bg-white p-6 rounded-lg shadow border">
            <h3 className="text-xl font-semibold mb-4">{subject.name}</h3>
            <div className="space-y-6">
              {subject.grades.map((grade) => (
                <div key={grade.id} className="border p-4 rounded">
                  <h4 className="font-medium mb-2">Niveau: {grade.name}</h4>
                  <div className="space-y-2">
                    {grade.units.map((unit) => (
                      <div key={unit.id} className="flex justify-between items-center p-2 hover:bg-gray-50 rounded">
                        <div>
                          <p className="font-medium">{unit.name}</p>
                          <p className="text-sm text-gray-500">{unit.duration}</p>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => navigateTo('unit-plan-view', unit)}
                        >
                          Voir unité
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}