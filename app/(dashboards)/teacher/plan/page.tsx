"use client";

import Plan from "@/components/plan/Plan";
import React, {useState} from "react";
import {Button} from "@/components/ui/button";
import {ChevronLeft, BrickWall, ChartGantt, Calendar} from "lucide-react";
import {   } from "@radix-ui/react-accordion";

import PlanAccordion from "@/components/ui/planAccordion";


export default function ReportsPage() {
    const [isPlanTemplateOpen, setIsPlanTemplateOpen] = useState(false);

    const planTemplateHandler =()=>{
        setIsPlanTemplateOpen((prevState:boolean)=>!prevState);
    }
    const unitsList = [
        { label: 'Unit one', href: '/page1' },
        { label: 'Unit Two', href: '/page2' },
        { label: 'Unit Three', href: '/page3' },
    ];



  return (
      <div>
        <div className="flex justify-between items-center mb-2">
          <Button variant="ghost" className="w-fit" onClick={()=>setIsPlanTemplateOpen(false)}>
            <ChevronLeft className="mr-2 h-4 w-4" />
            Retour
          </Button>
        </div>
          {
              isPlanTemplateOpen ?
                  <Plan/>
                  :
                  <div className="flex flex-col md:flex-row gap-4 items-start mb-5">
                      <PlanAccordion title="Scope and Sequence" icon={<BrickWall/>} callback={planTemplateHandler}
                                     items={unitsList}/>
                      <PlanAccordion title="Unit Plans" icon={<ChartGantt/>} callback={planTemplateHandler}
                                     items={unitsList}/>
                      <PlanAccordion title="Lesson Plans" icon={<Calendar/>} callback={planTemplateHandler}
                                     items={unitsList}/>
                  </div>

          }
          
      </div>
  )
}
