"use client";
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { ChevronLeft, Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, List, ListOrdered, Undo2, Redo2, Paintbrush, Type, Minus, ChevronDown, Save, Edit, X } from "lucide-react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Toggle } from "@/components/ui/toggle";

export default function PlanGeneralView() {
  // États pour les contrôles d'édition
  const [fontFamily, setFontFamily] = useState('Calibri');
  const [fontSize, setFontSize] = useState('11');
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [textAlign, setTextAlign] = useState('left');
  
  // États pour le contenu éditable et les modes d'édition par section
  const [editingSection, setEditingSection] = useState(null);
  const [lessonPlan, setLessonPlan] = useState({
    teacher: "Mr. Messavussu",
    subject: "MATH",
    grade: "6",
    students: "32",
    standards: "6.RP.2 Understand the concept of a unit rate a/b associated with a ratio a:b with b ≠ 0, and use rate language in the context of a ratio relationship.\n6.EE.7 Solve real-world and mathematical problems by writing and solving equations of the form x + p = q and px = q for cases in which p, q and x are all nonnegative rational numbers.",
    overview: "This Lesson will introduce students to the concept of writing equations based on given data, the first step in a linear progression leading to fluency in manipulating equations and abstract reasoning.",
    objectives: "Students will be able to:\n- Write algebraic equations given a ratio table\n- Write algebraic equations given a graph\n- Write algebraic equations given a tape diagram",
    aim: "To create an algebraic equation from a ratio table, graph, or tape diagram",
    hook: "Do now (3 minutes) and review (3 Minutes): T circulates - Students will have agency in their own learning by choosing which problem they would like to work on. (Bronze, Silver and Gold).",
    hits: "H.I.T.S. Employed: Hit #8: Activating prior Knowledge",
    bloom1: "Bloom's Taxonomy: (I and II) Knowledge and Application",
    minutesOfGlory: "- T: \"Today we will learn to create an algebraic equation from a ratio table, graph, or tape diagram.\"\n- T will review and model.\n- T will review an examples with the students, focusing on analysis, after the example, T will have class turn & talk (Anticipate misconceptions).",
    firstTransition: "→ The class will solve 2 problems together, with the T encouraging student led solutions.\n\nMake heavy use of sound Machine here ☺\n\nAfter the guided practice, T will say \"Class, Practice time is golden! This is your chance to move to mastery. We're not average, we're masters! And when you practice in class, you usually don't get the answers until afterwards. In my class, I give you the answers before you even start\". T will explain the concept of \"More important than what is why!\" T will then instruct students to start from the bronze and check their answer after every question.",
    bloom2: "Bloom's Taxonomy: (II & III) Comprehension and Application Teach-Like-a-champion Strategies: EXIT TICKET",
    secondTransition: "Students will work through the Bronze, Silver and Gold problem sets. T will circulate and support.",
    closing: "T will collect exit ticket and thank class. \"Some music please!\" Sound Machine master will hit the melody button. All students will clap ☺"
  });

  const handleInputChange = (field, value) => {
    setLessonPlan(prev => ({ ...prev, [field]: value }));
  };

  const startEditing = (section) => {
    setEditingSection(section);
  };

  const cancelEditing = () => {
    setEditingSection(null);
  };

  const saveSection = () => {
    // Ici vous pourriez ajouter la logique pour sauvegarder dans une API
    console.log("Section saved:", editingSection, lessonPlan[editingSection]);
    setEditingSection(null);
  };

  const applyTextStyle = (content) => {
    let style = "";
    if (isBold) style += "font-bold ";
    if (isItalic) style += "italic ";
    if (isUnderline) style += "underline ";
    if (textAlign === 'center') style += "text-center ";
    if (textAlign === 'right') style += "text-right ";
    
    return style;
  };

  return (
    <div className="p-4 flex flex-col h-screen">
      {/* Barre d'outils supérieure */}
      <div className="flex justify-between items-center mb-2">
        <Button variant="ghost" className="w-fit">
          <ChevronLeft className="mr-2 h-4 w-4" />
          Retour
        </Button>
      </div>

      {/* Ruban d'outils - seulement visible quand une section est en édition */}
      {editingSection && (
        <div className="border border-gray-300 mb-2 bg-gray-50 rounded-md">
          {/* Première ligne du ruban */}
          <div className="flex border-b border-gray-300 p-1">
            {/* Menu déroulant Police */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 px-2 text-xs gap-1">
                  <Type className="h-4 w-4" />
                  <span>{fontFamily}</span>
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {['Arial', 'Calibri', 'Times New Roman', 'Verdana'].map(font => (
                  <DropdownMenuItem key={font} onClick={() => setFontFamily(font)}>
                    {font}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Menu déroulant Taille */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 px-2 text-xs gap-1">
                  <span>{fontSize}</span>
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {['8', '10', '11', '12', '14'].map(size => (
                  <DropdownMenuItem key={size} onClick={() => setFontSize(size)}>
                    {size}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Boutons de mise en forme */}
            <div className="flex border-l border-gray-300 ml-1 pl-1">
              <Toggle
                pressed={isBold}
                onPressedChange={setIsBold}
                aria-label="Toggle bold"
              >
                <Bold className="h-4 w-4" />
              </Toggle>
              <Toggle
                pressed={isItalic}
                onPressedChange={setIsItalic}
                aria-label="Toggle italic"
              >
                <Italic className="h-4 w-4" />
              </Toggle>
              <Toggle
                pressed={isUnderline}
                onPressedChange={setIsUnderline}
                aria-label="Toggle underline"
              >
                <Underline className="h-4 w-4" />
              </Toggle>
            </div>

            {/* Boutons d'alignement */}
            <div className="flex border-l border-gray-300 ml-1 pl-1">
              <Toggle
                pressed={textAlign === 'left'}
                onPressedChange={(pressed) => pressed && setTextAlign('left')}
                aria-label="Align left"
              >
                <AlignLeft className="h-4 w-4" />
              </Toggle>
              <Toggle
                pressed={textAlign === 'center'}
                onPressedChange={(pressed) => pressed && setTextAlign('center')}
                aria-label="Align center"
              >
                <AlignCenter className="h-4 w-4" />
              </Toggle>
              <Toggle
                pressed={textAlign === 'right'}
                onPressedChange={(pressed) => pressed && setTextAlign('right')}
                aria-label="Align right"
              >
                <AlignRight className="h-4 w-4" />
              </Toggle>
            </div>

            {/* Boutons de liste */}
            <div className="flex border-l border-gray-300 ml-1 pl-1">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <List className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <ListOrdered className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Deuxième ligne du ruban */}
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

      {/* Tableau principal */}
      <div className="flex-1 border-2 border-black rounded-none overflow-auto">
        {/* Ligne 1 - En-tête */}
        <div className="flex border-b-2 border-black h-16 bg-black text-white">
          <div className="w-1/5 p-2 border-r-2 border-white flex items-center">
            <h1 className="text-2xl font-bold">LESSON PLAN</h1>
          </div>
          <div className="w-1/5 p-2 border-r-2 border-white flex items-center gap-2">
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
          <div className="w-1/5 p-2 border-r-2 border-white flex items-center gap-2">
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
          <div className="w-1/5 p-2 border-r-2 border-white flex items-center gap-2">
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
          <div className="w-1/5 p-2 flex items-center gap-2">
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
              className="absolute right-8 top-24 text-white hover:text-white"
              onClick={() => startEditing('header')}
            >
              <Edit className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Ligne 2 - Standards */}
        <div className="border-b border-black p-3 relative">
          <div className="font-bold">Standards Addressed:</div>
          {editingSection === 'standards' ? (
            <textarea
              value={lessonPlan.standards}
              onChange={(e) => handleInputChange('standards', e.target.value)}
              className={`w-full mt-1 p-2 border ${applyTextStyle()}`}
              rows={4}
            />
          ) : (
            <div className={`text-sm mt-1 whitespace-pre-line ${applyTextStyle()}`}>
              {lessonPlan.standards}
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

        {/* Ligne 3 - Overview */}
        <div className="border-b border-black p-3 relative">
          <div className="font-bold">→Overview:</div>
          {editingSection === 'overview' ? (
            <textarea
              value={lessonPlan.overview}
              onChange={(e) => handleInputChange('overview', e.target.value)}
              className={`w-full mt-1 p-2 border ${applyTextStyle()}`}
              rows={3}
            />
          ) : (
            <div className={`text-sm mt-1 ${applyTextStyle()}`}>
              {lessonPlan.overview}
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

        {/* Ligne 4 - Objectifs en 3 colonnes */}
        <div className="flex border-b border-black">
          {/* Colonne 1 - Objectives */}
          <div className="w-4/12 p-3 border-r border-black relative">
            <div className="flex items-center mb-2">
              <div className="bg-black text-white rounded-full h-6 w-6 flex items-center justify-center mr-2">
                1
              </div>
              <div className="font-bold">Objectives:</div>
            </div>
            {editingSection === 'objectives' ? (
              <textarea 
                value={lessonPlan.objectives}
                onChange={(e) => handleInputChange('objectives', e.target.value)}
                className={`w-full h-32 p-2 border ${applyTextStyle()}`}
              />
            ) : (
              <div className={`text-sm whitespace-pre-line ${applyTextStyle()}`}>
                {lessonPlan.objectives}
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
          
          {/* Colonne 2 - Aim */}
          <div className="w-4/12 p-3 border-r border-black relative">
            <div className="flex items-center mb-2">
              <div className="bg-black text-white rounded-full h-6 w-6 flex items-center justify-center mr-2">
                2
              </div>
              <div className="font-bold">Aim:</div>
            </div>
            {editingSection === 'aim' ? (
              <textarea 
                value={lessonPlan.aim}
                onChange={(e) => handleInputChange('aim', e.target.value)}
                className={`w-full h-32 p-2 border ${applyTextStyle()}`}
              />
            ) : (
              <div className={`text-sm whitespace-pre-line ${applyTextStyle()}`}>
                {lessonPlan.aim}
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
          
          {/* Colonne 3 - Hook */}
          <div className="w-4/12 p-3 relative">
            <div className="flex items-center mb-2">
              <div className="bg-black text-white rounded-full h-6 w-6 flex items-center justify-center mr-2">
                3
              </div>
              <div className="font-bold">Hook:</div>
            </div>
            {editingSection === 'hook' ? (
              <textarea 
                value={lessonPlan.hook}
                onChange={(e) => handleInputChange('hook', e.target.value)}
                className={`w-full h-32 p-2 border ${applyTextStyle()}`}
              />
            ) : (
              <div className={`text-sm whitespace-pre-line ${applyTextStyle()}`}>
                {lessonPlan.hook}
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

        {/* Ligne 5 - H.I.T.S. */}
        <div className="border-b border-black p-3 relative">
          {editingSection === 'hits' ? (
            <input
              type="text"
              value={lessonPlan.hits}
              onChange={(e) => handleInputChange('hits', e.target.value)}
              className={`w-full p-1 border ${applyTextStyle()}`}
            />
          ) : (
            <div className={applyTextStyle()}>{lessonPlan.hits}</div>
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

        {/* Ligne 6 - Bloom's Taxonomy */}
        <div className="border-b border-black p-3 relative">
          {editingSection === 'bloom1' ? (
            <input
              type="text"
              value={lessonPlan.bloom1}
              onChange={(e) => handleInputChange('bloom1', e.target.value)}
              className={`w-full p-1 border ${applyTextStyle()}`}
            />
          ) : (
            <div className={applyTextStyle()}>{lessonPlan.bloom1}</div>
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

        {/* Ligne 7 - 5 Minutes of Glory */}
        <div className="flex border-b border-black">
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
                  value={lessonPlan.minutesOfGlory}
                  onChange={(e) => handleInputChange('minutesOfGlory', e.target.value)}
                  className={`w-full h-40 p-2 border ${applyTextStyle()}`}
                />
              ) : (
                <div className={`text-sm whitespace-pre-line ${applyTextStyle()}`}>
                  {lessonPlan.minutesOfGlory}
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
                  value={lessonPlan.firstTransition}
                  onChange={(e) => handleInputChange('firstTransition', e.target.value)}
                  className={`w-full h-40 p-2 border ${applyTextStyle()}`}
                />
              ) : (
                <div className={`text-sm whitespace-pre-line ${applyTextStyle()}`}>
                  {lessonPlan.firstTransition}
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

        {/* Ligne 8 - Bloom's Taxonomy 2 */}
        <div className="border-b border-black p-3 relative">
          {editingSection === 'bloom2' ? (
            <input
              type="text"
              value={lessonPlan.bloom2}
              onChange={(e) => handleInputChange('bloom2', e.target.value)}
              className={`w-full p-1 border ${applyTextStyle()}`}
            />
          ) : (
            <div className={applyTextStyle()}>{lessonPlan.bloom2}</div>
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

        {/* Ligne 9 - 2nd Transition */}
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
                  value={lessonPlan.secondTransition}
                  onChange={(e) => handleInputChange('secondTransition', e.target.value)}
                  className={`w-full mt-1 p-2 border ${applyTextStyle()}`}
                  rows={3}
                />
              ) : (
                <div className={`text-sm mt-1 whitespace-pre-line ${applyTextStyle()}`}>
                  {lessonPlan.secondTransition}
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

        {/* Ligne 10 - Closing */}
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
                  value={lessonPlan.closing}
                  onChange={(e) => handleInputChange('closing', e.target.value)}
                  className={`w-full mt-1 p-2 border ${applyTextStyle()}`}
                  rows={2}
                />
              ) : (
                <div className={`text-sm mt-1 whitespace-pre-line ${applyTextStyle()}`}>
                  {lessonPlan.closing}
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