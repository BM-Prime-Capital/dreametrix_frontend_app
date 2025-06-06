"use client";
import { useState } from 'react';
import InitialScreen from './InitialScreen';
import ScopeSequenceView from './core/ScopeSequence/ScopeSequenceView';
import UnitPlanView from './core/UnitPlan/UnitPlanView';
import LessonPlanView from './core/LessonPlan/LessonPlanView';
import ScopeSequenceEditor from './core/ScopeSequence/ScopeSequenceEditor';
import UnitPlanEditor from './core/UnitPlan/UnitPlanEditor';
import LessonPlanEditor from './core/LessonPlan/LessonPlanEditor';

export type PlanView = 
  | 'initial' 
  | 'scope-sequence-view' 
  | 'scope-sequence-edit'
  | 'unit-plan-view' 
  | 'unit-plan-edit'
  | 'lesson-plan-view' 
  | 'lesson-plan-edit';

export default function PlanRouter() {
  const [currentView, setCurrentView] = useState<PlanView>('initial');
  const [selectedData, setSelectedData] = useState<any>(null);

  const navigateTo = (view: PlanView, data?: any) => {
    setCurrentView(view);
    if (data) setSelectedData(data);
  };

  return (
    <div className="plan-container bg-gray-50 min-h-screen p-4">
      {currentView === 'initial' && <InitialScreen navigateTo={navigateTo} />}
      
      {/* Scope and Sequence Views */}
      {currentView === 'scope-sequence-view' && (
        <ScopeSequenceView 
          navigateTo={navigateTo} 
          initialData={selectedData}
        />
      )}
      {currentView === 'scope-sequence-edit' && (
        <ScopeSequenceEditor 
          navigateTo={navigateTo} 
          data={selectedData}
        />
      )}
      
      {/* Unit Plan Views */}
      {currentView === 'unit-plan-view' && (
        <UnitPlanView 
          navigateTo={navigateTo} 
          initialData={selectedData}
        />
      )}
      {currentView === 'unit-plan-edit' && (
        <UnitPlanEditor 
          navigateTo={navigateTo} 
          data={selectedData}
        />
      )}
      
      {/* Lesson Plan Views */}
      {currentView === 'lesson-plan-view' && (
        <LessonPlanView 
          navigateTo={navigateTo} 
          initialData={selectedData}
        />
      )}
      {currentView === 'lesson-plan-edit' && (
        <LessonPlanEditor 
          navigateTo={navigateTo} 
          data={selectedData}
        />
      )}
    </div>
  );
}