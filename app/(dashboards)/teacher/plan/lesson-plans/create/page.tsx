import { LessonPlanForm } from '@/components/plan/lesson-plan-form';
import type { UnitPlan } from '@/lib/types';

export default function CreateLessonPlanPage() {
  // Mock data complète qui correspond à l'interface UnitPlan
  const mockUnitPlans: UnitPlan[] = [
    {
      id: 'unit1',
      title: 'Algebra Basics',
      course: 1,
      course_name: 'Math 7th Grade',
      subject_name: 'Math',
      grade: '7th Grade',
      duration_weeks: 4,
      essential_questions: 'How can we use algebraic expressions to solve real-world problems?',
      standards: 'NY-NGLS.MATH.CONTENT.7.EE.A.1',
      learning_objectives: 'Students will be able to write and evaluate algebraic expressions.',
      assessments_formative: 'Exit tickets, class participation',
      assessments_summative: 'Unit test, project',
      activities: 'Group work, problem-solving sessions',
      materials: 'Textbooks, calculators, worksheets',
      pacing_calendar: 'Week 1: Introduction, Week 2: Expressions, Week 3: Equations, Week 4: Review',
      created_by: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      subject: 'Math',
      gradeLevel: '7th Grade'
    },
    {
      id: 'unit2',
      title: 'Narrative Writing',
      course: 2,
      course_name: 'ELA 6th Grade',
      subject_name: 'ELA',
      grade: '6th Grade',
      duration_weeks: 3,
      essential_questions: 'How can we use storytelling to express our experiences?',
      standards: 'NY-NGLS.ELA-LITERACY.W.6.3',
      learning_objectives: 'Students will be able to write a narrative with clear structure.',
      assessments_formative: 'Writing workshops, peer reviews',
      assessments_summative: 'Final narrative essay',
      activities: 'Brainstorming, drafting, revising',
      materials: 'Writing journals, rubrics, examples',
      pacing_calendar: 'Week 1: Planning, Week 2: Drafting, Week 3: Revising',
      created_by: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      subject: 'ELA',
      gradeLevel: '6th Grade'
    },
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