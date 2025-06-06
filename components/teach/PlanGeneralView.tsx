"use client";
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { ChevronLeft, Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, List, ListOrdered, Undo2, Redo2, Paintbrush, Type, Minus, ChevronDown, Save, Edit, X } from "lucide-react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Toggle } from "@/components/ui/toggle";

type LessonPlanField = 
  | 'teacher' | 'subject' | 'grade' | 'students' 
  | 'standards' | 'overview' | 'objectives' | 'aim' 
  | 'hook' | 'hits' | 'bloom1' | 'minutesOfGlory' 
  | 'firstTransition' | 'bloom2' | 'secondTransition' | 'closing';

type Section = LessonPlanField | 'header';

interface PlanGeneralViewProps {
    changeView: (viewName: string, plan?: any) => void;
    selectedDate: Date;
}

interface TextStyles {
    isBold: boolean;
    isItalic: boolean;
    isUnderline: boolean;
    textAlign: string;
    fontFamily: string;
    fontSize: string;
}

interface LessonPlanContent {
    content: string;
    styles: TextStyles;
}

interface LessonPlan {
    teacher: string;
    subject: string;
    grade: string;
    students: string;
    standards: LessonPlanContent;
    overview: LessonPlanContent;
    objectives: LessonPlanContent;
    aim: LessonPlanContent;
    hook: LessonPlanContent;
    hits: LessonPlanContent;
    bloom1: LessonPlanContent;
    minutesOfGlory: LessonPlanContent;
    firstTransition: LessonPlanContent;
    bloom2: LessonPlanContent;
    secondTransition: LessonPlanContent;
    closing: LessonPlanContent;
}

type SectionKey = Exclude<keyof LessonPlan, 'teacher' | 'subject' | 'grade' | 'students'> | 'header';

const initialTextStyles: TextStyles = {
    isBold: false,
    isItalic: false,
    isUnderline: false,
    textAlign: 'left',
    fontFamily: 'Calibri',
    fontSize: '11'
};

export default function PlanGeneralView({ changeView }: PlanGeneralViewProps) {
    const [editingSection, setEditingSection] = useState<SectionKey | null>(null);
    const [lessonPlan, setLessonPlan] = useState<LessonPlan>({
        teacher: "Mr. Messavussu",
        subject: "MATH",
        grade: "6",
        students: "32",
        standards: { 
            content: "6.RP.2 Understand the concept of a unit rate a/b associated with a ratio a:b with b ≠ 0, and use rate language in the context of a ratio relationship.\n6.EE.7 Solve real-world and mathematical problems by writing and solving equations of the form x + p = q and px = q for cases in which p, q and x are all nonnegative rational numbers.",
            styles: initialTextStyles
        },
        overview: {
            content: "This Lesson will introduce students to the concept of writing equations based on given data, the first step in a linear progression leading to fluency in manipulating equations and abstract reasoning.",
            styles: initialTextStyles
        },
        objectives: {
            content: "Students will be able to:\n- Write algebraic equations given a ratio table\n- Write algebraic equations given a graph\n- Write algebraic equations given a tape diagram",
            styles: initialTextStyles
        },
        aim: {
            content: "To create an algebraic equation from a ratio table, graph, or tape diagram",
            styles: initialTextStyles
        },
        hook: {
            content: "Do now (3 minutes) and review (3 Minutes): T circulates - Students will have agency in their own learning by choosing which problem they would like to work on. (Bronze, Silver and Gold).",
            styles: initialTextStyles
        },
        hits: {
            content: "H.I.T.S. Employed: Hit #8: Activating prior Knowledge",
            styles: initialTextStyles
        },
        bloom1: {
            content: "Bloom's Taxonomy: (I and II) Knowledge and Application",
            styles: initialTextStyles
        },
        minutesOfGlory: {
            content: "- T: \"Today we will learn to create an algebraic equation from a ratio table, graph, or tape diagram.\"\n- T will review and model.\n- T will review an examples with the students, focusing on analysis, after the example, T will have class turn & talk (Anticipate misconceptions).",
            styles: initialTextStyles
        },
        firstTransition: {
            content: "→ The class will solve 2 problems together, with the T encouraging student led solutions.\n\nMake heavy use of sound Machine here ☺\n\nAfter the guided practice, T will say \"Class, Practice time is golden! This is your chance to move to mastery. We're not average, we're masters! And when you practice in class, you usually don't get the answers until afterwards. In my class, I give you the answers before you even start\". T will explain the concept of \"More important than what is why!\" T will then instruct students to start from the bronze and check their answer after every question.",
            styles: initialTextStyles
        },
        bloom2: {
            content: "Bloom's Taxonomy: (II & III) Comprehension and Application Teach-Like-a-champion Strategies: EXIT TICKET",
            styles: initialTextStyles
        },
        secondTransition: {
            content: "Students will work through the Bronze, Silver and Gold problem sets. T will circulate and support.",
            styles: initialTextStyles
        },
        closing: {
            content: "T will collect exit ticket and thank class. \"Some music please!\" Sound Machine master will hit the melody button. All students will clap ☺",
            styles: initialTextStyles
        }
    });

    const handleInputChange = (field: keyof LessonPlan, value: string) => {
        if (['teacher', 'subject', 'grade', 'students'].includes(field)) {
            setLessonPlan(prev => ({ ...prev, [field]: value }));
        } else {
            setLessonPlan(prev => ({
                ...prev,
                [field]: {
                    ...prev[field as Exclude<keyof LessonPlan, 'teacher' | 'subject' | 'grade' | 'students'>],
                    content: value
                }
            }));
        }
    };

    const updateSectionStyles = (section: SectionKey, styles: Partial<TextStyles>) => {
        if (section === 'header') return;
        
        setLessonPlan(prev => ({
            ...prev,
            [section]: {
                ...prev[section as Exclude<keyof LessonPlan, 'teacher' | 'subject' | 'grade' | 'students'>],
                styles: {
                    ...prev[section as Exclude<keyof LessonPlan, 'teacher' | 'subject' | 'grade' | 'students'>].styles,
                    ...styles
                }
            }
        }));
    };

    const startEditing = (section: SectionKey) => {
        setEditingSection(section);
    };
    
    const cancelEditing = () => {
        setEditingSection(null);
    };
    
    const saveSection = () => {
        if (editingSection) {
            console.log("Section saved:", editingSection, lessonPlan[editingSection as keyof LessonPlan]);
            setEditingSection(null);
        }
    };
    
    const applyTextStyle = (section: SectionKey) => {
        if (section === 'header') return "";
        
        const styles = lessonPlan[section as Exclude<keyof LessonPlan, 'teacher' | 'subject' | 'grade' | 'students'>].styles;
        let style = "";
        if (styles.isBold) style += "font-bold ";
        if (styles.isItalic) style += "italic ";
        if (styles.isUnderline) style += "underline ";
        if (styles.textAlign === 'center') style += "text-center ";
        if (styles.textAlign === 'right') style += "text-right ";
        
        return style;
    };

    const getCurrentStyles = () => {
        if (!editingSection || editingSection === 'header') return initialTextStyles;
        return lessonPlan[editingSection].styles;
    };

    const currentStyles = getCurrentStyles();

    return (
        <div className="p-4 flex flex-col h-screen">
            {/* Top toolbar */}
            <div className="flex justify-between items-center mb-2">
                <Button variant="ghost" className="w-fit">
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    Retour
                </Button>
            </div>

            {/* Formatting toolbar - only visible when editing a section */}
            {editingSection && (
                <div className="border border-gray-300 mb-2 bg-gray-50 rounded-md">
                    {/* First row */}
                    <div className="flex border-b border-gray-300 p-1">
                        {/* Font dropdown */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 px-2 text-xs gap-1">
                                    <Type className="h-4 w-4" />
                                    <span>{currentStyles.fontFamily}</span>
                                    <ChevronDown className="h-3 w-3" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                {['Arial', 'Calibri', 'Times New Roman', 'Verdana'].map(font => (
                                    <DropdownMenuItem 
                                        key={font} 
                                        onClick={() => updateSectionStyles(editingSection, { fontFamily: font })}
                                    >
                                        {font}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>

                        {/* Size dropdown */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 px-2 text-xs gap-1">
                                    <span>{currentStyles.fontSize}</span>
                                    <ChevronDown className="h-3 w-3" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                {['8', '10', '11', '12', '14'].map(size => (
                                    <DropdownMenuItem 
                                        key={size} 
                                        onClick={() => updateSectionStyles(editingSection, { fontSize: size })}
                                    >
                                        {size}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>

                        {/* Formatting buttons */}
                        <div className="flex border-l border-gray-300 ml-1 pl-1">
                            <Toggle
                                pressed={currentStyles.isBold}
                                onPressedChange={(pressed) => updateSectionStyles(editingSection, { isBold: pressed })}
                                aria-label="Toggle bold"
                            >
                                <Bold className="h-4 w-4" />
                            </Toggle>
                            <Toggle
                                pressed={currentStyles.isItalic}
                                onPressedChange={(pressed) => updateSectionStyles(editingSection, { isItalic: pressed })}
                                aria-label="Toggle italic"
                            >
                                <Italic className="h-4 w-4" />
                            </Toggle>
                            <Toggle
                                pressed={currentStyles.isUnderline}
                                onPressedChange={(pressed) => updateSectionStyles(editingSection, { isUnderline: pressed })}
                                aria-label="Toggle underline"
                            >
                                <Underline className="h-4 w-4" />
                            </Toggle>
                        </div>

                        {/* Alignment buttons */}
                        <div className="flex border-l border-gray-300 ml-1 pl-1">
                            <Toggle
                                pressed={currentStyles.textAlign === 'left'}
                                onPressedChange={(pressed) => pressed && updateSectionStyles(editingSection, { textAlign: 'left' })}
                                aria-label="Align left"
                            >
                                <AlignLeft className="h-4 w-4" />
                            </Toggle>
                            <Toggle
                                pressed={currentStyles.textAlign === 'center'}
                                onPressedChange={(pressed) => pressed && updateSectionStyles(editingSection, { textAlign: 'center' })}
                                aria-label="Align center"
                            >
                                <AlignCenter className="h-4 w-4" />
                            </Toggle>
                            <Toggle
                                pressed={currentStyles.textAlign === 'right'}
                                onPressedChange={(pressed) => pressed && updateSectionStyles(editingSection, { textAlign: 'right' })}
                                aria-label="Align right"
                            >
                                <AlignRight className="h-4 w-4" />
                            </Toggle>
                        </div>

                        {/* List buttons */}
                        <div className="flex border-l border-gray-300 ml-1 pl-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                <List className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                <ListOrdered className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    {/* Second row */}
                    <div className="flex p-1 justify-between">
                        <div className="flex">
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                <Undo2 className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                <Redo2 className="h-4 w-4" />
                            </Button>
                            <div className="border-l border-gray-300 ml-1 pl-1 flex">
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <Paintbrush className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                        
                        <div className="flex space-x-2">
                            <Button variant="outline" onClick={cancelEditing}>
                                <X className="mr-2 h-4 w-4" />
                                Annuler
                            </Button>
                            <Button onClick={saveSection}>
                                <Save className="mr-2 h-4 w-4" />
                                Enregistrer
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Main table */}
            <div className="flex-1 border-2 border-black rounded-none overflow-auto">
                {/* Row 1 - LESSON PLAN title */}
                <div className="flex border-b-2 border-white h-16 bg-black text-white">
                    <div className="w-full p-2 flex items-center justify-center">
                        <h1 className="text-2xl font-bold">LESSON PLAN</h1>
                    </div>
                </div>

                {/* Row 2 - Header with 4 columns */}
                <div className="flex border-b-2 border-black h-16 bg-black text-white">
                    <div className="w-1/4 p-2 border-r-2 border-white flex items-center gap-2">
                        <span><strong>Teacher:</strong></span>
                        {editingSection === 'header' ? (
                            <input 
                                type="text" 
                                value={lessonPlan.teacher}
                                onChange={(e) => handleInputChange('teacher', e.target.value)}
                                className="border-none bg-white w-full text-black px-2 rounded-none"
                            />
                        ) : (
                            <div className="bg-gray-100 w-full text-black px-2 py-1">{lessonPlan.teacher}</div>
                        )}
                    </div>
                    <div className="w-1/4 p-2 border-r-2 border-white flex items-center gap-2">
                        <span><strong>SUBJECT:</strong></span>
                        {editingSection === 'header' ? (
                            <input 
                                type="text" 
                                value={lessonPlan.subject}
                                onChange={(e) => handleInputChange('subject', e.target.value)}
                                className="border-none bg-white w-full font-bold text-black px-2 rounded-none"
                            />
                        ) : (
                            <div className="bg-gray-100 w-full font-bold text-black px-2 py-1">{lessonPlan.subject}</div>
                        )}
                    </div>
                    <div className="w-1/4 p-2 border-r-2 border-white flex items-center gap-2">
                        <span><strong>Grade:</strong></span>
                        {editingSection === 'header' ? (
                            <input 
                                type="text" 
                                value={lessonPlan.grade}
                                onChange={(e) => handleInputChange('grade', e.target.value)}
                                className="border-none bg-white w-full text-black px-2 rounded-none"
                            />
                        ) : (
                            <div className="bg-gray-100 w-full text-black px-2 py-1">{lessonPlan.grade}</div>
                        )}
                    </div>
                    <div className="w-1/4 p-2 flex items-center gap-2">
                        <span><strong># Students:</strong></span>
                        {editingSection === 'header' ? (
                            <input 
                                type="text" 
                                value={lessonPlan.students}
                                onChange={(e) => handleInputChange('students', e.target.value)}
                                className="border-none bg-white w-full text-black px-2 rounded-none"
                            />
                        ) : (
                            <div className="bg-gray-100 w-full text-black px-2 py-1">{lessonPlan.students}</div>
                        )}
                    </div>
                    
                    {!editingSection && (
                        <Button 
                            variant="ghost" 
                            size="sm" 
                            className="absolute right-8 top-32 text-white hover:text-white"
                            onClick={() => startEditing('header')}
                        >
                            <Edit className="h-4 w-4" />
                        </Button>
                    )}
                </div>

                {/* Standards section */}
                <div className="border-b border-black p-3 relative">
                    <div className="font-bold">Standards Addressed:</div>
                    {editingSection === 'standards' ? (
                        <textarea
                            value={lessonPlan.standards.content}
                            onChange={(e) => handleInputChange('standards', e.target.value)}
                            className={`w-full mt-1 p-2 border ${applyTextStyle('standards')}`}
                            rows={4}
                        />
                    ) : (
                        <div className={`text-sm mt-1 whitespace-pre-line ${applyTextStyle('standards')}`}>
                            {lessonPlan.standards.content}
                        </div>
                    )}
                    
                    {!editingSection && (
                        <Button 
                            variant="ghost" 
                            size="sm" 
                            className="absolute right-2 top-2"
                            onClick={() => startEditing('standards')}
                        >
                            <Edit className="h-4 w-4" />
                        </Button>
                    )}
                </div>

                {/* Overview section */}
                <div className="border-b border-black p-3 relative">
                    <div className="font-bold">→Overview:</div>
                    {editingSection === 'overview' ? (
                        <textarea
                            value={lessonPlan.overview.content}
                            onChange={(e) => handleInputChange('overview', e.target.value)}
                            className={`w-full mt-1 p-2 border ${applyTextStyle('overview')}`}
                            rows={3}
                        />
                    ) : (
                        <div className={`text-sm mt-1 ${applyTextStyle('overview')}`}>
                            {lessonPlan.overview.content}
                        </div>
                    )}
                    
                    {!editingSection && (
                        <Button 
                            variant="ghost" 
                            size="sm" 
                            className="absolute right-2 top-2"
                            onClick={() => startEditing('overview')}
                        >
                            <Edit className="h-4 w-4" />
                        </Button>
                    )}
                </div>

                {/* Objectives, Aim, Hook in 3 columns */}
                <div className="flex border-b border-black">
                    {/* Objectives column */}
                    <div className="w-4/12 p-3 border-r border-black relative">
                        <div className="flex items-center mb-2">
                            <div className="bg-black text-white rounded-full h-6 w-6 flex items-center justify-center mr-2">
                                1
                            </div>
                            <div className="font-bold">Objectives:</div>
                        </div>
                        {editingSection === 'objectives' ? (
                            <textarea 
                                value={lessonPlan.objectives.content}
                                onChange={(e) => handleInputChange('objectives', e.target.value)}
                                className={`w-full h-32 p-2 border ${applyTextStyle('objectives')}`}
                            />
                        ) : (
                            <div className={`text-sm whitespace-pre-line ${applyTextStyle('objectives')}`}>
                                {lessonPlan.objectives.content}
                            </div>
                        )}
                        
                        {!editingSection && (
                            <Button 
                                variant="ghost" 
                                size="sm" 
                                className="absolute right-2 top-2"
                                onClick={() => startEditing('objectives')}
                            >
                                <Edit className="h-4 w-4" />
                            </Button>
                        )}
                    </div>
                    
                    {/* Aim column */}
                    <div className="w-4/12 p-3 border-r border-black relative">
                        <div className="flex items-center mb-2">
                            <div className="bg-black text-white rounded-full h-6 w-6 flex items-center justify-center mr-2">
                                2
                            </div>
                            <div className="font-bold">Aim:</div>
                        </div>
                        {editingSection === 'aim' ? (
                            <textarea 
                                value={lessonPlan.aim.content}
                                onChange={(e) => handleInputChange('aim', e.target.value)}
                                className={`w-full h-32 p-2 border ${applyTextStyle('aim')}`}
                            />
                        ) : (
                            <div className={`text-sm whitespace-pre-line ${applyTextStyle('aim')}`}>
                                {lessonPlan.aim.content}
                            </div>
                        )}
                        
                        {!editingSection && (
                            <Button 
                                variant="ghost" 
                                size="sm" 
                                className="absolute right-2 top-2"
                                onClick={() => startEditing('aim')}
                            >
                                <Edit className="h-4 w-4" />
                            </Button>
                        )}
                    </div>
                    
                    {/* Hook column */}
                    <div className="w-4/12 p-3 relative">
                        <div className="flex items-center mb-2">
                            <div className="bg-black text-white rounded-full h-6 w-6 flex items-center justify-center mr-2">
                                3
                            </div>
                            <div className="font-bold">Hook:</div>
                        </div>
                        {editingSection === 'hook' ? (
                            <textarea 
                                value={lessonPlan.hook.content}
                                onChange={(e) => handleInputChange('hook', e.target.value)}
                                className={`w-full h-32 p-2 border ${applyTextStyle('hook')}`}
                            />
                        ) : (
                            <div className={`text-sm whitespace-pre-line ${applyTextStyle('hook')}`}>
                                {lessonPlan.hook.content}
                            </div>
                        )}
                        
                        {!editingSection && (
                            <Button 
                                variant="ghost" 
                                size="sm" 
                                className="absolute right-2 top-2"
                                onClick={() => startEditing('hook')}
                            >
                                <Edit className="h-4 w-4" />
                            </Button>
                        )}
                    </div>
                </div>

                {/* H.I.T.S. section */}
                <div className="border-b border-black p-3 relative">
                    {editingSection === 'hits' ? (
                        <input
                            type="text"
                            value={lessonPlan.hits.content}
                            onChange={(e) => handleInputChange('hits', e.target.value)}
                            className={`w-full p-1 border ${applyTextStyle('hits')}`}
                        />
                    ) : (
                        <div className={applyTextStyle('hits')}>{lessonPlan.hits.content}</div>
                    )}
                    
                    {!editingSection && (
                        <Button 
                            variant="ghost" 
                            size="sm" 
                            className="absolute right-2 top-2"
                            onClick={() => startEditing('hits')}
                        >
                            <Edit className="h-4 w-4" />
                        </Button>
                    )}
                </div>

                {/* Bloom's Taxonomy 1 */}
                <div className="border-b border-black p-3 relative">
                    {editingSection === 'bloom1' ? (
                        <input
                            type="text"
                            value={lessonPlan.bloom1.content}
                            onChange={(e) => handleInputChange('bloom1', e.target.value)}
                            className={`w-full p-1 border ${applyTextStyle('bloom1')}`}
                        />
                    ) : (
                        <div className={applyTextStyle('bloom1')}>{lessonPlan.bloom1.content}</div>
                    )}
                    
                    {!editingSection && (
                        <Button 
                            variant="ghost" 
                            size="sm" 
                            className="absolute right-2 top-2"
                            onClick={() => startEditing('bloom1')}
                        >
                            <Edit className="h-4 w-4" />
                        </Button>
                    )}
                </div>

                {/* 5 Minutes of Glory and 1st Transition */}
                <div className="flex border-b border-black">
                    {/* 5 Minutes of Glory */}
                    <div className="w-6/12 p-3 border-r border-black relative">
                        <div className="flex items-center mb-2">
                            <div className="bg-black text-white rounded-full h-6 w-6 flex items-center justify-center mr-2">
                                4
                            </div>
                            <div className="font-bold underline">[5 Minutes of Glory (5 minutes) Review (5 minutes), Mini Lesson (15 Minutes)]</div>
                        </div>
                        <div className="w-11/12">
                            {editingSection === 'minutesOfGlory' ? (
                                <textarea
                                    value={lessonPlan.minutesOfGlory.content}
                                    onChange={(e) => handleInputChange('minutesOfGlory', e.target.value)}
                                    className={`w-full h-40 p-2 border ${applyTextStyle('minutesOfGlory')}`}
                                />
                            ) : (
                                <div className={`text-sm whitespace-pre-line ${applyTextStyle('minutesOfGlory')}`}>
                                    {lessonPlan.minutesOfGlory.content}
                                </div>
                            )}
                        </div>
                        
                        {!editingSection && (
                            <Button 
                                variant="ghost" 
                                size="sm" 
                                className="absolute right-2 top-2"
                                onClick={() => startEditing('minutesOfGlory')}
                            >
                                <Edit className="h-4 w-4" />
                            </Button>
                        )}
                    </div>
                    
                    {/* 1st Transition */}
                    <div className="w-6/12 p-3 relative">
                        <div className="flex items-center mb-2">
                            <div className="bg-black text-white rounded-full h-6 w-6 flex items-center justify-center mr-2">
                                5
                            </div>
                            <div className="font-bold underline">1st Transition (10 minutes): Guided Practice, Teacher Modeling with student input.</div>
                        </div>
                        <div className="w-11/12">
                            {editingSection === 'firstTransition' ? (
                                <textarea
                                    value={lessonPlan.firstTransition.content}
                                    onChange={(e) => handleInputChange('firstTransition', e.target.value)}
                                    className={`w-full h-40 p-2 border ${applyTextStyle('firstTransition')}`}
                                />
                            ) : (
                                <div className={`text-sm whitespace-pre-line ${applyTextStyle('firstTransition')}`}>
                                    {lessonPlan.firstTransition.content}
                                </div>
                            )}
                        </div>
                        
                        {!editingSection && (
                            <Button 
                                variant="ghost" 
                                size="sm" 
                                className="absolute right-2 top-2"
                                onClick={() => startEditing('firstTransition')}
                            >
                                <Edit className="h-4 w-4" />
                            </Button>
                        )}
                    </div>
                </div>

                {/* Bloom's Taxonomy 2 */}
                <div className="border-b border-black p-3 relative">
                    {editingSection === 'bloom2' ? (
                        <input
                            type="text"
                            value={lessonPlan.bloom2.content}
                            onChange={(e) => handleInputChange('bloom2', e.target.value)}
                            className={`w-full p-1 border ${applyTextStyle('bloom2')}`}
                        />
                    ) : (
                        <div className={applyTextStyle('bloom2')}>{lessonPlan.bloom2.content}</div>
                    )}
                    
                    {!editingSection && (
                        <Button 
                            variant="ghost" 
                            size="sm" 
                            className="absolute right-2 top-2"
                            onClick={() => startEditing('bloom2')}
                        >
                            <Edit className="h-4 w-4" />
                        </Button>
                    )}
                </div>

                {/* 2nd Transition */}
                <div className="border-b border-black p-3 relative">
                    <div className="flex items-start">
                        <div className="w-1/12">
                            <div className="bg-black text-white rounded-full h-6 w-6 flex items-center justify-center mr-2">
                                6
                            </div>
                        </div>
                        <div className="w-11/12">
                            <div className="font-bold underline">[2nd transition (30 minutes): Independent Practice & Huddle & HW (5 Minutes) & Muscle Memory (5 Minutes)]</div>
                            {editingSection === 'secondTransition' ? (
                                <textarea
                                    value={lessonPlan.secondTransition.content}
                                    onChange={(e) => handleInputChange('secondTransition', e.target.value)}
                                    className={`w-full mt-1 p-2 border ${applyTextStyle('secondTransition')}`}
                                    rows={3}
                                />
                            ) : (
                                <div className={`text-sm mt-1 whitespace-pre-line ${applyTextStyle('secondTransition')}`}>
                                    {lessonPlan.secondTransition.content}
                                </div>
                            )}
                        </div>
                    </div>
                    
                    {!editingSection && (
                        <Button 
                            variant="ghost" 
                            size="sm" 
                            className="absolute right-2 top-2"
                            onClick={() => startEditing('secondTransition')}
                        >
                            <Edit className="h-4 w-4" />
                        </Button>
                    )}
                </div>

                {/* Closing section */}
                <div className="p-3 relative">
                    <div className="flex items-start">
                        <div className="w-1/12">
                            <div className="bg-black text-white rounded-full h-6 w-6 flex items-center justify-center mr-2">
                                7
                            </div>
                        </div>
                        <div className="w-11/12">
                            <div className="font-bold">Closing:</div>
                            {editingSection === 'closing' ? (
                                <textarea
                                    value={lessonPlan.closing.content}
                                    onChange={(e) => handleInputChange('closing', e.target.value)}
                                    className={`w-full mt-1 p-2 border ${applyTextStyle('closing')}`}
                                    rows={2}
                                />
                            ) : (
                                <div className={`text-sm mt-1 whitespace-pre-line ${applyTextStyle('closing')}`}>
                                    {lessonPlan.closing.content}
                                </div>
                            )}
                        </div>
                    </div>
                    
                    {!editingSection && (
                        <Button 
                            variant="ghost" 
                            size="sm" 
                            className="absolute right-2 top-2"
                            onClick={() => startEditing('closing')}
                        >
                            <Edit className="h-4 w-4" />
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}