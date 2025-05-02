"use client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Save, Edit } from "lucide-react";
import { views } from "@/constants/global";

export default function FocusedView({
  plan,
  changeView,
}: {
  plan?: any;
  changeView: (viewName: string, plan?: any) => void;
}) {
  // Données par défaut qui correspondent exactement à l'image
  const defaultPlan = {
    id: 1,
    title: "DESIGN PLAN",
    teacher: "Mr. Messavussu",
    subject: "MATH",
    grade: "Grade 6",
    numberOfStudents: 32,
    standards: ["8.RP.2", "6.EE.7"],
    objectives: {
      aim: "",
      hook: ""
    },
    hits: {
      bloomsTaxonomy: "5 Minutes of Glory (5 minutes) Review (5 minutes), Mini Lesson (15 Minutes)",
      teacherAction: ""
    },
    transitions: [
      "2nd transition",
      "3rd Transition"
    ]
  };

  const currentPlan = plan || defaultPlan;

  return (
    <section className="flex flex-col gap-6 w-full">
      <div className="flex justify-between items-center">
        <Button variant="ghost" onClick={() => changeView(views.GENERAL_VIEW)}>
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to Plans
        </Button>
        <div className="flex gap-2">
          <Button variant="outline">
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <Button>
            <Save className="mr-2 h-4 w-4" />
            Save
          </Button>
        </div>
      </div>

      <Card className="p-6">
        <div className="space-y-6">
          {/* En-tête */}
          <div className="border-b pb-4">
            <h1 className="text-2xl font-bold">{currentPlan.title}</h1>
            <div className="flex justify-between mt-2">
              <div>
                <p><strong>Teacher:</strong> {currentPlan.teacher}</p>
                <p><strong>SUBJECT:</strong> <strong>{currentPlan.subject}</strong></p>
              </div>
              <div>
                <p><strong>{currentPlan.grade}</strong> # of Students: {currentPlan.numberOfStudents}</p>
              </div>
            </div>
          </div>

          {/* Standards */}
          <div>
            <h2 className="text-lg font-semibold mb-2">Standards Addressed:</h2>
            <ul className="list-disc pl-5 space-y-1">
              {currentPlan.standards.map((standard: string, index: number) => (
                <li key={index}>{standard}</li>
              ))}
            </ul>
          </div>

          <div className="border-t pt-4">
            <h2 className="text-lg font-semibold mb-2">Overview:</h2>
            <div>
              <h3 className="font-medium mb-2">Objectives:</h3>
              <div className="space-y-2">
                <div className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  <span>Aim: {currentPlan.objectives.aim}</span>
                </div>
                <div className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  <span>Hook: {currentPlan.objectives.hook}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t pt-4">
            <h2 className="text-lg font-semibold mb-2">H.I.T.S. Employed:</h2>
            <div>
              <h3 className="font-medium mb-2">Bloom's Taxonomy:</h3>
              <div className="flex items-center">
                <input type="checkbox" checked className="mr-2" />
                <span>{currentPlan.hits.bloomsTaxonomy} :</span>
              </div>
              <p className="mt-1">- T: {currentPlan.hits.teacherAction}</p>
            </div>
          </div>

          <div className="border-t pt-4">
            <h2 className="text-lg font-semibold mb-2">1st Transition:</h2>
            <div className="space-y-2">
              {currentPlan.transitions.map((transition: string, index: number) => (
                <div key={index} className="flex items-center">
                  <input type="checkbox" checked className="mr-2" />
                  <span>{transition}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t pt-4">
            <h2 className="text-lg font-semibold mb-2">Closing:</h2>
            <div className="h-20 border rounded"></div>
          </div>
        </div>
      </Card>
    </section>
  );
}