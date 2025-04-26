"use client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

export default function PlanGeneralView() {
  return (
    <div className="p-4 h-screen flex flex-col">
      <Button variant="ghost" className="mb-4 w-fit">
        <ChevronLeft className="mr-2 h-4 w-4" />
        Retour
      </Button>

      {/* Tableau principal - reproduction exacte du document Word */}
      <div className="flex-1 border-2 border-black rounded-none overflow-auto">
        
        {/* Ligne 1 - En-tête avec 5 colonnes */}
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
        {/* <div className="border-b border-black p-3">
          <div className="flex items-start">
            <div className="w-2/12 font-bold">Standards Addressed:</div>
            <div className="w-10/12 pl-2">
              <p className="font-bold">6.RP.2</p>
              <p className="text-sm">Understand the concept of a unit rate a/b associated with a ratio a:b with b ≠ 0, and use rate language in the context of a ratio relationship.</p>
              <p className="font-bold mt-2">6.EE.7</p>
              <p className="text-sm">Solve real-world and mathematical problems by writing and solving equations of the form x + p = q and px = q for cases in which p, q and x are all nonnegative rational numbers.</p>
            </div>
          </div>
        </div> */}

        {/* Ligne 2 - Standards */}
        <div className="border-b border-black p-3">
            <div className="font-bold">Standards Addressed:</div>
            <p className="text-sm mt-1">6.RP.2 Understand the concept of a unit rate a/b associated with a ratio a:b with b ≠ 0, and use rate language in the context of a ratio relationship.
            6.EE.7 Solve real-world and mathematical problems by writing and solving equations of the form x + p = q and px = q for cases in which p, q and x are all nonnegative rational numbers.</p>

        </div>

        {/* Ligne 3 - Overview */}
        <div className="border-b border-black p-3">
          <div className="font-bold">→Overview:</div>
          <p className="text-sm mt-1">
            This Lesson will introduce students to the concept of writing equations based on given data, the first step in a linear progression leading to fluency in manipulating equations and abstract reasoning.
          </p>
        </div>

        {/* Ligne 4 - Objectifs en 3 colonnes */}
        <div className="flex border-b border-black">
          {/* Colonne 1 - Objectives */}
          <div className="w-4/12 p-3 border-r border-black">
            <div className="flex items-center mb-2">
              <div className="bg-black text-white rounded-full h-6 w-6 flex items-center justify-center mr-2">
                1
              </div>
              <div className="font-bold">Objectives:</div>
            </div>
            <textarea 
              className="w-full h-32 p-2 border border-gray-300 rounded-none resize-none text-sm"
              value="Students will be able to:
- Write algebraic equations given a ratio table
- Write algebraic equations given a graph
- Write algebraic equations given a tape diagram"
              readOnly
            />
          </div>
          
          {/* Colonne 2 - Aim */}
          <div className="w-4/12 p-3 border-r border-black">
            <div className="flex items-center mb-2">
              <div className="bg-black text-white rounded-full h-6 w-6 flex items-center justify-center mr-2">
                2
              </div>
              <div className="font-bold">Aim:</div>
            </div>
            <textarea 
              className="w-full h-32 p-2 border border-gray-300 rounded-none resize-none text-sm"
              value="To create an algebraic equation from a ratio table, graph, or tape diagram"
              readOnly
            />
          </div>
          
          {/* Colonne 3 - Hook */}
          <div className="w-4/12 p-3">
            <div className="flex items-center mb-2">
              <div className="bg-black text-white rounded-full h-6 w-6 flex items-center justify-center mr-2">
                3
              </div>
              <div className="font-bold">Hook:</div>
            </div>
            <textarea 
              className="w-full h-32 p-2 border border-gray-300 rounded-none resize-none text-sm"
              value="Do now (3 minutes) and review (3 Minutes): T circulates - Students will have agency in their own learning by choosing which problem they would like to work on. (Bronze, Silver and Gold)."
              readOnly
            />
          </div>
        </div>

        {/* Ligne 5 - H.I.T.S. */}
        <div className="border-b border-black p-3">
          <div >H.I.T.S. Employed: Hit #8: Activating prior Knowledge</div>
        </div>

        {/* Ligne 6 - Bloom's Taxonomy */}
        <div className="border-b border-black p-3">
          <div >Bloom's Taxonomy: <span className="font-normal">(I and II) Knowledge and Application</span></div>
        </div>


        {/* Ligne 4 - Objectifs en 3 colonnes */}
        <div className="flex border-b border-black">
        {/* Colonne 1 - Objectives */}
        <div className="w-6/12 p-3 border-r border-black">
            <div className="flex items-center mb-2">
            <div className="bg-black text-white rounded-full h-6 w-6 flex items-center justify-center mr-2">
                4
            </div>
            <div className="font-bold underline">[5 Minutes of Glory (5 minutes) Review (5 minutes), Mini Lesson (15 Minutes)]</div>
            </div>
            <div className="w-11/12">
            
            <p className="text-sm mt-1">- T: "Today we will learn to create an algebraic equation from a ratio table, graph, or tape diagram."</p>
            <p className="text-sm">- T will review and model.</p>
            <p className="text-sm">- T will review an examples with the students, focusing on analysis, after the example, T will have class turn & talk (Anticipate misconceptions).</p>
            </div>
        </div>
        
        {/* Colonne 2 - Aim */}
        <div className="w-6/12 p-3 border-r border-black">
            <div className="flex items-center mb-2">
            <div className="bg-black text-white rounded-full h-6 w-6 flex items-center justify-center mr-2">
                5
            </div>
            <div className="font-bold underline">1st Transition (10 minutes): Guided Practice, Teacher Modeling with student input.</div>
            </div>
            <div className="w-11/12">
            
            <p className="text-sm mt-1">→ The class will solve 2 problems together, with the T encouraging student led solutions.  

                Make heavy use of sound Machine here  
            
            After the guided practice, T will say “Class, Practice time is golden! This is your chance to move to mastery.  We’re not average, we’re masters! And when you practice in class, you usually don’t get the answers until afterwards. In my class, I give you the answers before you even start”. T will explain the concept of “More important than what is why!” T will then instruct students to start from the bronze and check their answer after every question. 
            </p>

            </div>
        </div>
        
        </div>


        {/* Ligne 6 - Bloom's Taxonomy */}
        <div className="border-b border-black p-3">
          <div >Bloom's Taxonomy: <span className="font-normal">(II & III) Comprehension and Application  Teach-Like-a-champion Strategies: EXIT TICKET</span></div>
        </div>

        {/* Ligne 9 - 2nd Transition */}
        <div className="border-b border-black p-3">
          <div className="flex items-start">
            <div className="w-1/12">
              <div className="bg-black text-white rounded-full h-6 w-6 flex items-center justify-center mr-2">
                6
              </div>
            </div>
            <div className="w-11/12">
              <div className="font-bold underline">[2nd transition (30 minutes): Independent Practice & Huddle & HW (5 Minutes) & Muscle Memory (5 Minutes)]</div>
              <p className="text-sm mt-1">Students will work through the Bronze, Silver and Gold problem sets. T will circulate and support.</p>
            </div>
          </div>
        </div>

        {/* Ligne 10 - Closing */}
        <div className="p-3">
          <div className="flex items-start">
            <div className="w-1/12">
              <div className="bg-black text-white rounded-full h-6 w-6 flex items-center justify-center mr-2">
                7
              </div>
            </div>
            <div className="w-11/12">
              <div className="font-bold">Closing:</div>
              <p className="text-sm mt-1">T will collect exit ticket and thank class. "Some music please!" Sound Machine master will hit the melody button. All students will clap ☺</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}