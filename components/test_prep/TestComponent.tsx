"use client";
import React, {FunctionComponent} from "react";
import {Button} from "@/components/ui/button";

type Props = {
    currentStep:number
    setCurrentStep:any
}
export const  TestComponent:FunctionComponent<Props> =({currentStep, setCurrentStep})=> {

    const nextStep = () => {
        setCurrentStep(currentStep + 1);
    };

    // Move to the previous step
    const prevStep = () => {
        setCurrentStep(currentStep - 1);
    };

    return(
        <div>
            <div>Test Component</div>

            <Button
                onClick={()=>nextStep()}

                className="gap-2 text-base bg-blue-500 hover:bg-blue-600">
                Plus one
            </Button>

            <Button
                onClick={()=>prevStep()}

                className="gap-2 text-base bg-blue-500 hover:bg-blue-600">
                Minus one
            </Button>
        </div>

    )

}
