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

      {/* Conteneur tableau */}
      <div className="flex-1 border-2 border-black rounded-none overflow-hidden">
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
      className="border-none bg-gray-100 w-full text-black px-2 rounded"
    />
  </div>
  <div className="w-1/5 p-2 border-r-2 border-white flex items-center gap-2">
    <span><strong>SUBJECT:</strong></span>
    <input 
      type="text" 
      value="MATH" 
      readOnly 
      className="border-none bg-gray-100 w-full font-bold text-black px-2 rounded"
    />
  </div>
  <div className="w-1/5 p-2 border-r-2 border-white flex items-center gap-2">
    <span><strong>Grade:</strong></span>
    <input 
      type="text" 
      value="6" 
      readOnly 
      className="border-none bg-gray-100 w-full text-black px-2 rounded"
    />
  </div>
  <div className="w-1/5 p-2 flex items-center gap-2">
    <span><strong># Students:</strong></span>
    <input 
      type="text" 
      value="32" 
      readOnly 
      className="border-none bg-gray-100 w-full text-black px-2 rounded"
    />
  </div>
</div>

        {/* Ligne 2 - Standards */}
        <div className="border-b-2 border-black h-12 p-2 flex items-center">
          <div className="flex items-center space-x-4">
            <span className="font-semibold">Standards Addressed:</span>
            <span>8.RP.2</span>
            <span>6.EE.7</span>
          </div>
        </div>

        {/* Ligne 3 - Overview */}
        <div className="border-b-2 border-black h-12 p-2 flex items-center">
          <h2 className="text-lg font-semibold">Overview:</h2>
        </div>


        {/* Ligne 4 - Objectifs en 3 colonnes numérotées avec textarea */}
        <div className="flex border-b-2 border-black min-h-[120px]">
          {/* Colonne 1 - Objectives */}
          <div className="w-1/3 p-2 border-r-2 border-black flex flex-col">
            <div className="flex items-center mb-2">
              <div className="bg-black text-white rounded-full h-6 w-6 flex items-center justify-center mr-2">
                1
              </div>
              <h3 className="font-bold">Objectives:</h3>
            </div>
            <textarea 
              className="flex-1 w-full p-1 border border-gray-300 rounded-none resize-none"
              rows={3}
            />
          </div>
          
          {/* Colonne 2 - Aim */}
          <div className="w-1/3 p-2 border-r-2 border-black flex flex-col">
            <div className="flex items-center mb-2">
              <div className="bg-black text-white rounded-full h-6 w-6 flex items-center justify-center mr-2">
                2
              </div>
              <h3 className="font-bold">Aim:</h3>
            </div>
            <textarea 
              className="flex-1 w-full p-1 border border-gray-300 rounded-none resize-none"
              rows={3}
            />
          </div>
          
          {/* Colonne 3 - Hook */}
          <div className="w-1/3 p-2 flex flex-col">
            <div className="flex items-center mb-2">
              <div className="bg-black text-white rounded-full h-6 w-6 flex items-center justify-center mr-2">
                3
              </div>
              <h3 className="font-bold">Hook:</h3>
            </div>
            <textarea 
              className="flex-1 w-full p-1 border border-gray-300 rounded-none resize-none"
              rows={3}
            />
          </div>
        </div>

        {/* Ligne 5 - H.I.T.S. */}
        <div className="border-b-2 border-black h-12 p-2 flex items-center">
          <h2 className="text-lg font-semibold">H.I.T.S. Employed:</h2>
        </div>

        {/* Ligne 6 - Bloom's Taxonomy */}
        <div className="border-b-2 border-black h-12 p-2 flex items-center">
          <h3 className="font-medium">Bloom's Taxonomy:</h3>
        </div>

        {/* Ligne 8 - Checkbox activé */}
        <div className="border-b-2 border-black h-16 p-2 flex items-center">
          <div className="flex items-center">
            <input 
              type="checkbox" 
              checked 
              readOnly 
              className="mr-2 h-5 w-5 border-2 border-black rounded-none accent-black"
            />
            <span>5 Minutes of Glory (5 minutes) Review (5 minutes), Mini Lesson (15 Minutes) :</span>
          </div>
        </div>

        {/* Ligne 9 - T: sur 2 colonnes */}
        <div className="flex border-b-2 border-black h-12">
          <div className="w-1/2 p-2 border-r-2 border-black flex items-center">
            <p>- T:</p>
          </div>
          <div className="w-1/2 p-2"></div>
        </div>

        {/* Ligne 10 - Transition */}
        <div className="border-b-2 border-black h-12 p-2 flex items-center">
          <h2 className="text-lg font-semibold">1st Transition:</h2>
        </div>

        {/* Ligne 11 - 2nd transition */}
        <div className="border-b-2 border-black h-12 p-2 flex items-center">
          <div className="flex items-center">
            <input 
              type="checkbox" 
              checked 
              readOnly 
              className="mr-2 h-5 w-5 border-2 border-black rounded-none accent-black"
            />
            <span>2nd transition</span>
          </div>
        </div>

        {/* Ligne 12 - 3rd Transition */}
        <div className="border-b-2 border-black h-12 p-2 flex items-center">
          <div className="flex items-center">
            <input 
              type="checkbox" 
              checked 
              readOnly 
              className="mr-2 h-5 w-5 border-2 border-black rounded-none accent-black"
            />
            <span>3rd Transition:</span>
          </div>
        </div>

        {/* Ligne 13 - Closing */}
        <div className="h-20 p-2 flex items-start">
          <h2 className="text-lg font-semibold">Closing:</h2>
        </div>
      </div>
    </div>
  );
}