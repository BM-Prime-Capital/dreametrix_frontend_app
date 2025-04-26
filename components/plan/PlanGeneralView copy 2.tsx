"use client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

export default function PlanGeneralView() {
  return (
    <div className="p-4 flex flex-col">
    {/* <div className="p-4 h-screen flex flex-col"> */}
      <Button variant="ghost" className="mb-4 w-fit">
        <ChevronLeft className="mr-2 h-4 w-4" />
        Retour
      </Button>

      {/* Conteneur tableau */}
      {/* <div className="flex-1 border-2 border-black rounded-none overflow-hidden"> */}
      <div className="flex-1 border-2 border-black rounded-none overflow-auto"> {/* Changement à overflow-auto */}
        {/* Ligne 1 - En-tête */}
        <div className="flex border-b-2 border-black h-16 bg-black text-white">
          <div className="w-1/5 p-2 border-r-2 border-white flex items-center">
            <h1 className="text-2xl font-bold">LESSON PLAN</h1>
          </div>
          <div className="w-1/5 p-2 border-r-2 border-white flex items-center gap-2">
            <span><strong>Teacher:</strong></span>
            <input 
              type="text" 
              value="Mr. Messavussu" 
              readOnly 
              className="border-none bg-gray-100 w-full text-black px-2 rounded-none"
            />
          </div>
          <div className="w-1/5 p-2 border-r-2 border-white flex items-center gap-2">
            <span><strong>SUBJECT:</strong></span>
            <input 
              type="text" 
              value="MATH" 
              readOnly 
              className="border-none bg-gray-100 w-full font-bold text-black px-2 rounded-none"
            />
          </div>
          <div className="w-1/5 p-2 border-r-2 border-white flex items-center gap-2">
            <span><strong>Grade:</strong></span>
            <input 
              type="text" 
              value="6" 
              readOnly 
              className="border-none bg-gray-100 w-full text-black px-2 rounded-none"
            />
          </div>
          <div className="w-1/5 p-2 flex items-center gap-2">
            <span><strong># Of Students:</strong></span>
            <input 
              type="text" 
              value="32" 
              readOnly 
              className="border-none bg-gray-100 w-full text-black px-2 rounded-none"
            />
          </div>
        </div>

        {/* Ligne 2 - Standards */}
        <div className="flex border-b-2 border-black min-h-[100px]">
          <div className="w-1/6 p-2 border-r-2 border-black flex items-start">
            <span className="font-bold">Standards Addressed:</span>
          </div>
          <div className="w-5/6 p-2">
            <p className="font-bold">6.RP.2</p>
            <p>Understand the concept of a unit rate a/b associated with a ratio a:b with b ≠ 0, and use rate language in the context of a ratio relationship.</p>
            <p className="font-bold mt-2">6.EE.7</p>
            <p>Solve real-world and mathematical problems by writing and solving equations of the form x + p = q and px = q for cases in which p, q and x are all nonnegative rational numbers.</p>
          </div>
        </div>

        {/* Ligne 3 - Overview */}
        <div className="flex border-b-2 border-black min-h-[100px]">
          <div className="w-1/6 p-2 border-r-2 border-black flex items-start">
            <span className="font-bold">→Overview:</span>
          </div>
          <div className="w-5/6 p-2">
            <p>This Lesson will introduce students to the concept of writing equation based on given data, the first step in a linear progression leading to fluency in manipulating equations and abstract reasoning.</p>
          </div>
        </div>

        {/* Ligne 4 - Objectifs en 3 colonnes */}
        <div className="flex border-b-2 border-black min-h-[150px]">
          {/* Colonne 1 - Objectives */}
          <div className="w-1/3 p-2 border-r-2 border-black flex flex-col">
            <div className="flex items-center mb-2">
              <div className="bg-black text-white rounded-full h-6 w-6 flex items-center justify-center mr-2">
                1
              </div>
              <h3 className="font-bold">Objectives:</h3>
            </div>
            <ul className="list-disc pl-5">
              <li>Write algebraic equations given a ratio table</li>
              <li>Write algebraic equations given a graph</li>
              <li>Write algebraic equations given a tape diagram</li>
            </ul>
          </div>
          
          {/* Colonne 2 - Aim */}
          <div className="w-1/3 p-2 border-r-2 border-black flex flex-col">
            <div className="flex items-center mb-2">
              <div className="bg-black text-white rounded-full h-6 w-6 flex items-center justify-center mr-2">
                2
              </div>
              <h3 className="font-bold">Aim:</h3>
            </div>
            <p>To create an algebraic equation from a ratio table, graph, or tape diagram</p>
            <div className="mt-4">
              <p className="font-bold">Do now (3 minutes)</p>
              <p>Students will choose which problem they would like to work on (Bronze, Silver and Gold).</p>
            </div>
          </div>
          
          {/* Colonne 3 - Hook */}
          <div className="w-1/3 p-2 flex flex-col">
            <div className="flex items-center mb-2">
              <div className="bg-black text-white rounded-full h-6 w-6 flex items-center justify-center mr-2">
                3
              </div>
              <h3 className="font-bold">Hook:</h3>
            </div>
            <p>What's algebra you ask? It's the language of math. We are going to start speaking it today.</p>
          </div>
        </div>

        {/* Ligne 5 - H.I.T.S. */}
        <div className="flex border-b-2 border-black min-h-[60px]">
          <div className="w-full p-2">
            <p className="font-bold">H.I.T.S. Employed: Hit #8: Activating prior Knowledge.</p>
          </div>
        </div>

        {/* Ligne 6 - Bloom's Taxonomy */}
        <div className="flex border-b-2 border-black min-h-[60px]">
          <div className="w-full p-2">
            <p className="font-bold">Bloom's Taxonomy: (I and II) Knowledge and Application.</p>
          </div>
        </div>

        {/* Ligne 7 - 5 Minutes of Glory */}
        <div className="flex border-b-2 border-black min-h-[150px]">
          <div className="w-1/6 p-2 border-r-2 border-black flex items-start">
            <div className="flex items-center">
              <div className="bg-black text-white rounded-full h-6 w-6 flex items-center justify-center mr-2">
                4
              </div>
              <span className="font-bold">5 Minutes of Glory:</span>
            </div>
          </div>
          <div className="w-5/6 p-2">
            <p>- T: "Today we will learn to create an algebraic equation from a ratio table, graph, or tape diagram."</p>
            <p>- T will review and model.</p>
            <p>- T will review examples with the students, focusing on analysis.</p>
            <p className="font-bold mt-2">Essential Question:</p>
            <p>How does abstract reasoning with algebra facilitate complex problem solving skills?</p>
          </div>
        </div>

        {/* Ligne 8 - 1st Transition */}
        <div className="flex border-b-2 border-black min-h-[60px]">
          <div className="w-1/6 p-2 border-r-2 border-black flex items-start">
            <div className="flex items-center">
              <div className="bg-black text-white rounded-full h-6 w-6 flex items-center justify-center mr-2">
                5
              </div>
              <span className="font-bold">1st Transition:</span>
            </div>
          </div>
          <div className="w-5/6 p-2">
            <p>Guided practice, Teacher will explain the concept to students.</p>
          </div>
        </div>

        {/* Ligne 9 - 2nd Transition */}
        <div className="flex border-b-2 border-black min-h-[150px]">
          <div className="w-1/6 p-2 border-r-2 border-black flex items-start">
            <div className="flex items-center">
              <div className="bg-black text-white rounded-full h-6 w-6 flex items-center justify-center mr-2">
                6
              </div>
              <span className="font-bold">2nd Transition:</span>
            </div>
          </div>
          <div className="w-5/6 p-2">
            <p>Independent Practice & Huddle & HW (5 Minutes) & Muscle Memory (5 Minutes):</p>
            <p>Students will work through the Bronze, Silver and Gold problem sets. T will circulate and support.</p>
          </div>
        </div>

        {/* Ligne 10 - Closing */}
        <div className="flex min-h-[80px]">
          <div className="w-1/6 p-2 border-r-2 border-black flex items-start">
            <div className="flex items-center">
              <div className="bg-black text-white rounded-full h-6 w-6 flex items-center justify-center mr-2">
                7
              </div>
              <span className="font-bold">Closing:</span>
            </div>
          </div>
          <div className="w-5/6 p-2">
            <p>T will collect exit ticket and thank class. "Some music please!" Sound Machine master will hit the melody button. All students will clap ☺</p>
          </div>
        </div>
      </div>
    </div>
  );
}