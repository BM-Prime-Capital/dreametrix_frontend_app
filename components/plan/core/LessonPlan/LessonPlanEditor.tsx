"use client";
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { ChevronLeft, Save, Plus, Trash } from 'lucide-react';
import { PlanView } from "../../PlanRouter";

export default function LessonPlanEditor({
  navigateTo,
  data
}: {
  navigateTo: (view: PlanView, data?: any) => void;
  data?: any;
}) {
  const [lessonData, setLessonData] = useState(data || {
    title: "",
    date: new Date().toISOString().split('T')[0],
    objectives: [""],
    standards: [""],
    activities: [{
      type: "",
      duration: "",
      description: ""
    }],
    materials: [""],
    assessment: ""
  });

  const handleSave = () => {
    console.log("Lesson saved:", lessonData);
    navigateTo('lesson-plan-view', lessonData);
  };

  const addObjective = () => {
    setLessonData({
      ...lessonData,
      objectives: [...lessonData.objectives, ""]
    });
  };

  const removeObjective = (index: number) => {
    const newObjectives = [...lessonData.objectives];
    newObjectives.splice(index, 1);
    setLessonData({
      ...lessonData,
      objectives: newObjectives
    });
  };

  const addActivity = () => {
    setLessonData({
      ...lessonData,
      activities: [...lessonData.activities, {
        type: "",
        duration: "",
        description: ""
      }]
    });
  };

  return (
    <div className="max-w-4xl mx-auto py-6 px-4">
      <div className="flex justify-between items-center mb-6">
        <Button variant="ghost" onClick={() => navigateTo('lesson-plan-view')}>
          <ChevronLeft className="mr-2" /> Annuler
        </Button>
        <Button onClick={handleSave}>
          <Save className="mr-2" /> Enregistrer
        </Button>
      </div>

      <h2 className="text-2xl font-bold mb-6">Éditeur de Leçon</h2>
      
      <div className="bg-white p-6 rounded-lg shadow border space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-medium mb-2">Titre de la leçon</label>
            <input
              type="text"
              value={lessonData.title}
              onChange={(e) => setLessonData({...lessonData, title: e.target.value})}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block font-medium mb-2">Date</label>
            <input
              type="date"
              value={lessonData.date}
              onChange={(e) => setLessonData({...lessonData, date: e.target.value})}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block font-medium">Objectifs</label>
            <Button variant="outline" size="sm" onClick={addObjective}>
              <Plus className="mr-2 h-4 w-4" /> Ajouter
            </Button>
          </div>
          <div className="space-y-2">
            {lessonData.objectives.map((obj: string, index: number) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="text"
                  value={obj}
                  onChange={(e) => {
                    const newObjectives = [...lessonData.objectives];
                    newObjectives[index] = e.target.value;
                    setLessonData({...lessonData, objectives: newObjectives});
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
          <input
            type="text"
            value={lessonData.standards[0] || ""}
            onChange={(e) => setLessonData({
              ...lessonData, 
              standards: [e.target.value]
            })}
            className="w-full p-2 border rounded"
            placeholder="Code standard (ex: CCSS.MATH...)"
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block font-medium">Activités</label>
            <Button variant="outline" size="sm" onClick={addActivity}>
              <Plus className="mr-2 h-4 w-4" /> Ajouter
            </Button>
          </div>
          <div className="space-y-4">
            {lessonData.activities.map((activity: any, index: number) => (
              <div key={index} className="border p-4 rounded space-y-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Type</label>
                    <input
                      type="text"
                      value={activity.type}
                      onChange={(e) => {
                        const newActivities = [...lessonData.activities];
                        newActivities[index].type = e.target.value;
                        setLessonData({...lessonData, activities: newActivities});
                      }}
                      className="w-full p-2 border rounded"
                      placeholder="Ex: Échauffement"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Durée</label>
                    <input
                      type="text"
                      value={activity.duration}
                      onChange={(e) => {
                        const newActivities = [...lessonData.activities];
                        newActivities[index].duration = e.target.value;
                        setLessonData({...lessonData, activities: newActivities});
                      }}
                      className="w-full p-2 border rounded"
                      placeholder="Ex: 15 min"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <textarea
                    value={activity.description}
                    onChange={(e) => {
                      const newActivities = [...lessonData.activities];
                      newActivities[index].description = e.target.value;
                      setLessonData({...lessonData, activities: newActivities});
                    }}
                    className="w-full p-2 border rounded"
                    rows={3}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="block font-medium mb-2">Évaluation</label>
          <textarea
            value={lessonData.assessment}
            onChange={(e) => setLessonData({...lessonData, assessment: e.target.value})}
            className="w-full p-2 border rounded"
            rows={2}
          />
        </div>
      </div>
    </div>
  );
}