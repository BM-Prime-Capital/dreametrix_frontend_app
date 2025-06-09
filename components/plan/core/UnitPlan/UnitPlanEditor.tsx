"use client";
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { ChevronLeft, Save, Plus, Trash } from 'lucide-react';
import { PlanView } from "../../PlanRouter";

export default function UnitPlanEditor({
  navigateTo,
  data
}: {
  navigateTo: (view: PlanView, data?: any) => void;
  data?: any;
}) {
  const [unitData, setUnitData] = useState(data || {
    title: "",
    duration: "",
    objectives: [""],
    standards: [""],
    lessons: []
  });

  const handleSave = () => {
    console.log("Unit saved:", unitData);
    navigateTo('unit-plan-view', unitData);
  };

  const addObjective = () => {
    setUnitData({
      ...unitData,
      objectives: [...unitData.objectives, ""]
    });
  };

  const removeObjective = (index: number) => {
    const newObjectives = [...unitData.objectives];
    newObjectives.splice(index, 1);
    setUnitData({
      ...unitData,
      objectives: newObjectives
    });
  };

  return (
    <div className="max-w-4xl mx-auto py-6 px-4">
      <div className="flex justify-between items-center mb-6">
        <Button variant="ghost" onClick={() => navigateTo('unit-plan-view')}>
          <ChevronLeft className="mr-2" /> Annuler
        </Button>
        <Button onClick={handleSave}>
          <Save className="mr-2" /> Enregistrer
        </Button>
      </div>

      <h2 className="text-2xl font-bold mb-6">Éditeur d'Unité Pédagogique</h2>
      
      <div className="bg-white p-6 rounded-lg shadow border space-y-6">
        <div>
          <label className="block font-medium mb-2">Titre de l'unité</label>
          <input
            type="text"
            value={unitData.title}
            onChange={(e) => setUnitData({...unitData, title: e.target.value})}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block font-medium mb-2">Durée</label>
          <input
            type="text"
            value={unitData.duration}
            onChange={(e) => setUnitData({...unitData, duration: e.target.value})}
            className="w-full p-2 border rounded"
            placeholder="Ex: 3 semaines"
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block font-medium">Objectifs d'apprentissage</label>
            <Button variant="outline" size="sm" onClick={addObjective}>
              <Plus className="mr-2 h-4 w-4" /> Ajouter
            </Button>
          </div>
          <div className="space-y-2">
            {unitData.objectives.map((obj: string, index: number) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="text"
                  value={obj}
                  onChange={(e) => {
                    const newObjectives = [...unitData.objectives];
                    newObjectives[index] = e.target.value;
                    setUnitData({...unitData, objectives: newObjectives});
                  }}
                  className="flex-1 p-2 border rounded"
                />
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => removeObjective(index)}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="block font-medium mb-2">Standards</label>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={unitData.standards[0] || ""}
              onChange={(e) => setUnitData({
                ...unitData, 
                standards: [e.target.value]
              })}
              className="flex-1 p-2 border rounded"
              placeholder="Code standard (ex: CCSS.MATH...)"
            />
          </div>
        </div>
      </div>
    </div>
  );
}