import { LessonPlanForm } from '@/components/plan/lesson-plan-form';


export default function CreateLessonPlanPage() {
  // In a real app, you might fetch unit plans to link
  const mockUnitPlans = [
    { id: 'unit1', title: 'Algebra Basics (Math 7th)' },
    { id: 'unit2', title: 'Narrative Writing (ELA 6th)' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">Create New Lesson Plan</h1>
        <p className="text-muted-foreground">
          Outline your daily instruction, from objectives to assessments, with AI-powered activity suggestions.
        </p>
      </div>
      <LessonPlanForm unitPlans={mockUnitPlans} />
    </div>
  );
}
