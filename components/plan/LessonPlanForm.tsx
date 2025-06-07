import {FC, useEffect, useRef, useState} from "react";
import {Button} from "@/components/ui/button";
// import {Edit} from "lucide-react";
import {LessonPlan, LessonPlanForForm} from "@/types/lessonPlan";
import SelectForPlanTemplateForm from "@/components/ui/SelectForPlanTemplateForm";
import {localStorageKey} from "@/constants/global";

type props={
    callback?:(state:boolean)=>void
}

type Item = {
    label: string;
    value: string;
    checked: boolean;
};

const LessonPlanForm : FC<props> =()=>{
    // const items = ['6.PR.1', '6.PR.2', '6.PR.3', '6.PR.4', '6.PR.5', '6.PR.6'];
    const userData = JSON.parse(localStorage.getItem(localStorageKey.USER_DATA)!);

    const initialItems = [
        { label: '6.PR.1', value: '6.PR.1', checked: false },
        { label: '6.PR.2', value: '6.PR.2', checked: false },
        { label: '6.PR.3', value: '6.PR.3', checked: false },
        { label: '6.PR.4', value: '6.PR.4', checked: false },
        { label: '6.PR.5', value: '6.PR.5', checked: false },
        { label: '6.PR.6', value: '6.PR.6', checked: false },
    ];

    const [items, setItems] = useState<Item[]>(initialItems);

    const handleChange = (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
        const updated = [...items];
        updated[index].checked = e.target.checked;
        setItems(updated);
    };

    // const selectedValues = items.filter(item => item.checked).map(item => item.value);
    const [lessonPlan, setLessonPlan] = useState<LessonPlanForForm>({
        teacher: userData.full_name,
        subject: "MATH",
        grade: "6",
        students: "32",
        standards: {
            content: [],

        },
        overview: {
            content: "",

        },
        objectives: {
            content: "",

        },
        aim: {
            content: "",

        },
        hook: {
            content: "",

        },
        minutesOfGlory: {
            content: "",

        }, minutesOfReview: {
            content: "",

        }, minutesOfLessons: {
            content: "",

        },
        firstTransitionMinutes: {
            content: "",

        },secondTransitionMinutes: {
            content: "",

        },thirdTransitionMinutes: {
            content: "",

        },
        closing: {
            content: "",
        }
    });


    const [checkedItems, setCheckedItems] = useState<boolean[]>(new Array(items.length).fill(false));


    const handleInputChange = (field: keyof LessonPlanForForm, value: string) => {
        // if(field === "standards"){
        //     setLessonPlan(prev => ({ ...prev, standards: value.split(',') }));
        //
        // }
        if (['teacher', 'subject', 'grade', 'students'].includes(field)) {
            setLessonPlan(prev => ({ ...prev, [field]: value }));
        } else {
            setLessonPlan(prev => ({
                ...prev,
                [field]: {
                    ...prev[field as Exclude<keyof LessonPlanForForm, 'teacher' | 'subject' | 'grade' | 'students'>],
                    content: value
                }
            }));
        }
    };


    // const handleSelectAllChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     const { checked } = e.target;
    //     setCheckedItems(new Array(items.length).fill(checked));
    //
    // };

    // const handleItemChange = (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
    //     const updated = [...checkedItems];
    //     updated[index] = e.target.checked;
    //     setCheckedItems(updated);
    // };

    const allChecked = items.every(item => item.checked);
    const selectedValues = items.filter(item => item.checked).map(item => item.value);

    const selectAllRef = useRef<HTMLInputElement>(null);



    const handleItemChange = (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
        const updated = [...items];
        updated[index].checked = e.target.checked;
        setItems(updated);
    };

    // Toggle all checkboxes
    const handleSelectAllChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const updated = items.map(item => ({ ...item, checked: e.target.checked }));
        setItems(updated);
    };

    return(
        <div className="min-w-[880px] mx-0">
            <form onSubmit={(e)=>{
                e.preventDefault()
                console.log("Form Submitted ===>", {...lessonPlan, standards:{content:[selectedValues.join(', ')]}} )

            }}>
                <div className="w-full mt-2 p-6  space-y-4">
                    <h5 className="font-semibold">Standard Addressed:</h5>
                    <div className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            ref={selectAllRef}
                            checked={allChecked}
                            onChange={handleSelectAllChange}
                            className="w-4 h-4"
                        />
                        <label>Select All</label>
                    </div>

                    <div className="flex items-center space-x-4">
                        {items.map((item, index) => (
                            <div key={index} className="flex items-center space-x-2">
                                <input
                                    type="checkbox"

                                    checked={item.checked}
                                    onChange={handleItemChange(index)}
                                    className="w-4 h-4"
                                />
                                <label>{item.label}</label>
                            </div>
                        ))}
                    </div>

                    <div className="pt-4 text-sm text-gray-700">
                        <strong>Selected:</strong>{' '}
                        {selectedValues.length > 0 ? selectedValues.join(', ') : 'None'}
                    </div>

                    <div>
                        <h4 className={"py-2"}>Overview</h4>
                        <input
                            type="text"
                            value={lessonPlan.overview.content}
                            onChange={(e) => {
                                handleInputChange('overview', e.target.value)
                            }}
                            className={`w-full p-1 border `}
                        />
                    </div>


                    <div className="flex gap-3">
                        {/* Objectives column */}
                        <div className="w-4/12 p-1 relative">
                            <div className="flex items-center mb-2">
                                <h4 className="font-bold">1. Objectives:</h4>
                            </div>

                            <textarea
                                value={lessonPlan.objectives.content}
                                onChange={(e) => {
                                    handleInputChange('objectives', e.target.value)
                                }}
                                className={`w-full h-32 p-2 border`}
                            />


                        </div>

                        {/* Aim column */}
                        <div className="w-4/12 p-1 relative">
                            <div className="flex items-center mb-2">

                                <h4 className="font-bold">2. Aim:</h4>
                            </div>

                            <textarea
                                value={lessonPlan.aim.content}
                                onChange={(e) => {
                                    handleInputChange('aim', e.target.value)
                                }}
                                className={`w-full h-32 p-2 border`}
                            />

                        </div>

                        {/* Hook column */}
                        <div className="w-4/12 p-1 relative">
                            <div className="flex items-center mb-2">
                                <h4 className="font-bold">3. Hook:</h4>
                            </div>

                            <textarea
                                value={lessonPlan.hook.content}
                                onChange={(e) => {
                                    handleInputChange('hook', e.target.value)
                                }}
                                className={`w-full h-32 p-2 border`}
                            />


                        </div>
                    </div>

                    <div className="flex items-start mb-2">
                        <h4 className="font-bold">4.</h4>
                        <div className="w-full max-w-md mx-auto px-2 space-y-4">
                            <p className="font-semibold text-gray-800">Minutes of glory:</p>
                            <SelectForPlanTemplateForm
                                callbackFn={handleInputChange}
                                value={lessonPlan.minutesOfGlory.content}
                                fieldKey={"minutesOfGlory"}
                            />
                        </div>

                        <div className="w-full max-w-md mx-auto px-2 space-y-4">
                            <p className="font-semibold text-gray-800">Minutes of review:</p>
                            <SelectForPlanTemplateForm
                                callbackFn={handleInputChange}
                                value={lessonPlan.minutesOfReview.content}
                                fieldKey={"minutesOfReview"}
                            />

                        </div>

                        <div className="w-full max-w-md mx-auto px-2  space-y-4">
                            <p className=" font-semibold text-gray-800">Minutes of lessons:</p>
                            <SelectForPlanTemplateForm
                                callbackFn={handleInputChange}
                                value={lessonPlan.minutesOfLessons.content}
                                fieldKey={"minutesOfLessons"}
                            />
                        </div>

                    </div>


                    <div className="flex items-start mb-2">
                        <div className="font-bold">5.</div>
                        <div className="w-full max-w-md mx-auto px-2 space-y-4">
                            <p className="font-semibold text-gray-800">1st Transition Minutes:</p>
                            <SelectForPlanTemplateForm
                                callbackFn={handleInputChange}
                                value={lessonPlan.firstTransitionMinutes.content}
                                fieldKey={"firstTransitionMinutes"}
                            />
                        </div>

                        <div className="w-full max-w-md mx-auto px-2 space-y-4">
                            <p className="font-semibold text-gray-800">6. 2nd Transition Minutes:</p>
                            <SelectForPlanTemplateForm
                                callbackFn={handleInputChange}
                                value={lessonPlan.secondTransitionMinutes.content}
                                fieldKey={"secondTransitionMinutes"}
                            />

                        </div>

                        <div className="w-full max-w-md mx-auto px-2  space-y-4">
                            <p className=" font-semibold text-gray-800">7. 3rd Transition Minutes:</p>

                            <SelectForPlanTemplateForm
                                callbackFn={handleInputChange}
                                value={lessonPlan.thirdTransitionMinutes.content}
                                fieldKey={"thirdTransitionMinutes"}
                            />

                        </div>

                    </div>


                    <div className={"pb-6"}>
                        <h4 className={"py-2 font-semibold"}>8. Closing</h4>
                        <input
                            type="text"
                            value={lessonPlan.closing.content}
                            onChange={(e) => {
                                handleInputChange('closing', e.target.value)
                            }}
                            className={`w-full p-1 border`}
                        />
                    </div>


                    <Button
                        type="submit"
                        // onClick={(e) => {
                        //     e.preventDefault()
                        //     console.log("Working!!")
                        //
                        //     callback(true)
                        //
                        // }}
                        className="w-full md:w-auto mt-4 px-8 py-4 text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-md transition-all"
                        // disabled={isLoading}
                    >

                        <span className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd"
                        d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                        clipRule="evenodd"/>
                </svg>
                Generate template
              </span>

                    </Button>


                </div>
            </form>

        </div>
    )
}

export default LessonPlanForm
