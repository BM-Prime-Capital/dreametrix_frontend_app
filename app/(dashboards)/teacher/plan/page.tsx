"use client";

import Plan from "@/components/plan/Plan";
import React from "react";
import {Button} from "@/components/ui/button";
import {ChevronDown, ChevronLeft, BrickWall, ChartGantt, Calendar} from "lucide-react";
import {   } from "@radix-ui/react-accordion";

import PlanAccordion from "@/components/ui/planAccordion";


export default function ReportsPage() {

    const unitsList = [
        { label: 'Unit one', href: '/page1' },
        { label: 'Unit Two', href: '/page2' },
        { label: 'Unit Three', href: '/page3' },
    ];

  return (
      <div>
        <div className="flex justify-between items-center mb-2">
          <Button variant="ghost" className="w-fit">
            <ChevronLeft className="mr-2 h-4 w-4"/>
            Retour
          </Button>
        </div>

          <div className="w-full flex justify-between gap-2 items-start mb-5">
              <PlanAccordion title="Scope and Sequence" icon={<BrickWall />} items={unitsList} />
              <PlanAccordion title="Unit Plans" icon={<ChartGantt />} items={unitsList} />
              <PlanAccordion title="Lesson Plans" icon={<Calendar />} items={unitsList} />
          </div>

        {/*<Plan/>;*/}
      </div>
  )
}
