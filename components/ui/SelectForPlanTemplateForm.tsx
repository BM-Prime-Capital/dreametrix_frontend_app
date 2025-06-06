import {LessonPlanDuration} from "@/utils/global";
import {FC} from "react";

type props ={
    fieldKey: string
    value:string
    callbackFn:(fieldKey:any, value:any) => void
}

const SelectForPlanTemplateForm : FC<props> = ({fieldKey, value, callbackFn}) => {
    return (
        <select
            className="w-full border border-gray-300 rounded px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={value}
            onChange={(e) => {
                callbackFn(`${fieldKey}`, e.target.value)
            }}
        >

            {
                LessonPlanDuration.map((duration, index:number) => <option key={index} value={duration.value}>{duration.title}</option>
                )
            }
        </select>
    )
}

export default SelectForPlanTemplateForm
