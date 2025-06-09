"use client";
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { ChevronLeft, Save } from 'lucide-react';
import { PlanView } from "../../PlanRouter";

export default function ScopeSequenceEditor({
  navigateTo,
  data
}: {
  navigateTo: (view: PlanView, data?: any) => void;
  data?: any;
}) {
  const [scopeData, setScopeData] = useState(data || {
    subjects: [{ name: '', grades: [{ name: '', units: [] }] }]
  });

  const handleSave = () => {
    console.log("Scope saved:", scopeData);
    navigateTo('scope-sequence-view', scopeData);
  };

  return (
    <div className="max-w-6xl mx-auto py-6 px-4">
      <div className="flex justify-between items-center mb-6">
        <Button variant="ghost" onClick={() => navigateTo('scope-sequence-view')}>
          <ChevronLeft className="mr-2" /> Annuler
        </Button>
        <Button onClick={handleSave}>
          <Save className="mr-2" /> Enregistrer
        </Button>
      </div>

      <h2 className="text-2xl font-bold mb-6">Éditeur Scope and Sequence</h2>
      
      <div className="bg-white p-6 rounded-lg shadow border">
        {/* Implémentez ici l'éditeur complet */}
        <div className="space-y-4">
          {scopeData.subjects.map((subject: any, sIndex: number) => (
            <div key={sIndex} className="border p-4 rounded">
              <h3 className="font-medium mb-2">Matière</h3>
              <input
                type="text"
                value={subject.name}
                onChange={(e) => {
                  const newSubjects = [...scopeData.subjects];
                  newSubjects[sIndex].name = e.target.value;
                  setScopeData({...scopeData, subjects: newSubjects});
                }}
                className="w-full p-2 border rounded"
                placeholder="Nom de la matière"
              />
              
              <div className="mt-4 space-y-4">
                {subject.grades.map((grade: any, gIndex: number) => (
                  <div key={gIndex} className="border p-4 rounded">
                    <h4 className="font-medium mb-2">Niveau</h4>
                    <input
                      type="text"
                      value={grade.name}
                      onChange={(e) => {
                        const newSubjects = [...scopeData.subjects];
                        newSubjects[sIndex].grades[gIndex].name = e.target.value;
                        setScopeData({...scopeData, subjects: newSubjects});
                      }}
                      className="w-full p-2 border rounded"
                      placeholder="Nom du niveau"
                    />
                    
                    <div className="mt-4 space-y-2">
                      <h5 className="font-medium">Unités</h5>
                      {grade.units.map((unit: any, uIndex: number) => (
                        <div key={uIndex} className="flex space-x-2">
                          <input
                            type="text"
                            value={unit.name}
                            onChange={(e) => {
                              const newSubjects = [...scopeData.subjects];
                              newSubjects[sIndex].grades[gIndex].units[uIndex].name = e.target.value;
                              setScopeData({...scopeData, subjects: newSubjects});
                            }}
                            className="flex-1 p-2 border rounded"
                            placeholder="Nom de l'unité"
                          />
                          <input
                            type="text"
                            value={unit.duration}
                            onChange={(e) => {
                              const newSubjects = [...scopeData.subjects];
                              newSubjects[sIndex].grades[gIndex].units[uIndex].duration = e.target.value;
                              setScopeData({...scopeData, subjects: newSubjects});
                            }}
                            className="w-32 p-2 border rounded"
                            placeholder="Durée"
                          />
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
    </div>
  );
}