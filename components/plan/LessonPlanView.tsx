import React, { useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import { Button } from '../../ui/Button';
import TextFormatToolbar from './TextFormatToolbar';
import HeaderSection from './HeaderSection';
import EditableSection from './EditableSection';
import { LessonPlan, SectionKey, TextStyles } from '../../types/lessonPlan';

const initialTextStyles: TextStyles = {
  isBold: false,
  isItalic: false,
  isUnderline: false,
  textAlign: 'left',
  fontFamily: 'Calibri',
  fontSize: '11'
};

const LessonPlanView: React.FC = () => {
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

  const getCurrentStyles = () => {
    if (!editingSection || editingSection === 'header') return initialTextStyles;
    return lessonPlan[editingSection].styles;
  };

  const currentStyles = getCurrentStyles();

  return (
    <div className="p-4 flex flex-col h-screen max-w-7xl mx-auto">
      {/* Top toolbar */}
      <div className="flex justify-between items-center mb-2">
        <Button variant="ghost" className="w-fit">
          <ChevronLeft className="mr-2 h-4 w-4" />
          Retour
        </Button>
      </div>

      {/* Formatting toolbar - only visible when editing a section */}
      {editingSection && (
        <TextFormatToolbar 
          currentStyles={currentStyles}
          onStyleChange={(styles) => updateSectionStyles(editingSection, styles)}
          onSave={saveSection}
          onCancel={cancelEditing}
        />
      )}

      {/* Main table */}
      <div className="flex-1 border-2 border-black rounded-none overflow-auto bg-white shadow-md">
        <HeaderSection 
          teacher={lessonPlan.teacher}
          subject={lessonPlan.subject}
          grade={lessonPlan.grade}
          students={lessonPlan.students}
          isEditing={editingSection === 'header'}
          onStartEditing={() => startEditing('header')}
          onInputChange={handleInputChange}
        />

        {/* Standards section */}
        <div className="border-b border-black p-3 relative group hover:bg-gray-50 transition-colors">
          <div className="font-bold">Standards Addressed:</div>
          <EditableSection 
            content={lessonPlan.standards.content}
            styles={lessonPlan.standards.styles}
            isEditing={editingSection === 'standards'}
            sectionKey="standards"
            onStartEditing={startEditing}
            onContentChange={(value) => handleInputChange('standards', value)}
          />
        </div>

        {/* Overview section */}
        <div className="border-b border-black p-3 relative group hover:bg-gray-50 transition-colors">
          <div className="font-bold">→Overview:</div>
          <EditableSection 
            content={lessonPlan.overview.content}
            styles={lessonPlan.overview.styles}
            isEditing={editingSection === 'overview'}
            sectionKey="overview"
            onStartEditing={startEditing}
            onContentChange={(value) => handleInputChange('overview', value)}
          />
        </div>

        {/* Objectives, Aim, Hook in 3 columns */}
        <div className="flex border-b border-black">
          {/* Objectives column */}
          <div className="w-4/12 p-3 border-r border-black relative group hover:bg-gray-50 transition-colors">
            <EditableSection 
              title="Objectives:"
              titleNumber={1}
              content={lessonPlan.objectives.content}
              styles={lessonPlan.objectives.styles}
              isEditing={editingSection === 'objectives'}
              sectionKey="objectives"
              onStartEditing={startEditing}
              onContentChange={(value) => handleInputChange('objectives', value)}
            />
          </div>
          
          {/* Aim column */}
          <div className="w-4/12 p-3 border-r border-black relative group hover:bg-gray-50 transition-colors">
            <EditableSection 
              title="Aim:"
              titleNumber={2}
              content={lessonPlan.aim.content}
              styles={lessonPlan.aim.styles}
              isEditing={editingSection === 'aim'}
              sectionKey="aim"
              onStartEditing={startEditing}
              onContentChange={(value) => handleInputChange('aim', value)}
            />
          </div>
          
          {/* Hook column */}
          <div className="w-4/12 p-3 relative group hover:bg-gray-50 transition-colors">
            <EditableSection 
              title="Hook:"
              titleNumber={3}
              content={lessonPlan.hook.content}
              styles={lessonPlan.hook.styles}
              isEditing={editingSection === 'hook'}
              sectionKey="hook"
              onStartEditing={startEditing}
              onContentChange={(value) => handleInputChange('hook', value)}
            />
          </div>
        </div>

        {/* H.I.T.S. section */}
        <div className="border-b border-black p-3 relative group hover:bg-gray-50 transition-colors">
          <EditableSection 
            content={lessonPlan.hits.content}
            styles={lessonPlan.hits.styles}
            isEditing={editingSection === 'hits'}
            sectionKey="hits"
            onStartEditing={startEditing}
            onContentChange={(value) => handleInputChange('hits', value)}
          />
        </div>

        {/* Bloom's Taxonomy 1 */}
        <div className="border-b border-black p-3 relative group hover:bg-gray-50 transition-colors">
          <EditableSection 
            content={lessonPlan.bloom1.content}
            styles={lessonPlan.bloom1.styles}
            isEditing={editingSection === 'bloom1'}
            sectionKey="bloom1"
            onStartEditing={startEditing}
            onContentChange={(value) => handleInputChange('bloom1', value)}
          />
        </div>

        {/* 5 Minutes of Glory and 1st Transition */}
        <div className="flex border-b border-black">
          {/* 5 Minutes of Glory */}
          <div className="w-6/12 p-3 border-r border-black relative group hover:bg-gray-50 transition-colors">
            <EditableSection 
              title="[5 Minutes of Glory (5 minutes) Review (5 minutes), Mini Lesson (15 Minutes)]"
              titleNumber={4}
              titleUnderline={true}
              content={lessonPlan.minutesOfGlory.content}
              styles={lessonPlan.minutesOfGlory.styles}
              isEditing={editingSection === 'minutesOfGlory'}
              sectionKey="minutesOfGlory"
              onStartEditing={startEditing}
              onContentChange={(value) => handleInputChange('minutesOfGlory', value)}
            />
          </div>
          
          {/* 1st Transition */}
          <div className="w-6/12 p-3 relative group hover:bg-gray-50 transition-colors">
            <EditableSection 
              title="1st Transition (10 minutes): Guided Practice, Teacher Modeling with student input."
              titleNumber={5}
              titleUnderline={true}
              content={lessonPlan.firstTransition.content}
              styles={lessonPlan.firstTransition.styles}
              isEditing={editingSection === 'firstTransition'}
              sectionKey="firstTransition"
              onStartEditing={startEditing}
              onContentChange={(value) => handleInputChange('firstTransition', value)}
            />
          </div>
        </div>

        {/* Bloom's Taxonomy 2 */}
        <div className="border-b border-black p-3 relative group hover:bg-gray-50 transition-colors">
          <EditableSection 
            content={lessonPlan.bloom2.content}
            styles={lessonPlan.bloom2.styles}
            isEditing={editingSection === 'bloom2'}
            sectionKey="bloom2"
            onStartEditing={startEditing}
            onContentChange={(value) => handleInputChange('bloom2', value)}
          />
        </div>

        {/* 2nd Transition */}
        <div className="border-b border-black p-3 relative group hover:bg-gray-50 transition-colors">
          <div className="flex items-start">
            <div className="w-1/12">
              <div className="bg-black text-white rounded-full h-6 w-6 flex items-center justify-center mr-2">
                6
              </div>
            </div>
            <div className="w-11/12">
              <div className="font-bold underline">[2nd transition (30 minutes): Independent Practice & Huddle & HW (5 Minutes) & Muscle Memory (5 Minutes)]</div>
              <EditableSection 
                content={lessonPlan.secondTransition.content}
                styles={lessonPlan.secondTransition.styles}
                isEditing={editingSection === 'secondTransition'}
                sectionKey="secondTransition"
                onStartEditing={startEditing}
                onContentChange={(value) => handleInputChange('secondTransition', value)}
              />
            </div>
          </div>
        </div>

        {/* Closing section */}
        <div className="p-3 relative group hover:bg-gray-50 transition-colors">
          <div className="flex items-start">
            <div className="w-1/12">
              <div className="bg-black text-white rounded-full h-6 w-6 flex items-center justify-center mr-2">
                7
              </div>
            </div>
            <div className="w-11/12">
              <div className="font-bold">Closing:</div>
              <EditableSection 
                content={lessonPlan.closing.content}
                styles={lessonPlan.closing.styles}
                isEditing={editingSection === 'closing'}
                sectionKey="closing"
                onStartEditing={startEditing}
                onContentChange={(value) => handleInputChange('closing', value)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LessonPlanView;