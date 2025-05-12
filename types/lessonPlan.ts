export interface TextStyles {
  isBold: boolean;
  isItalic: boolean;
  isUnderline: boolean;
  textAlign: string;
  fontFamily: string;
  fontSize: string;
}

export interface LessonPlanContent {
  content: string;
  styles: TextStyles;
}

export interface LessonPlan {
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

export type SectionKey = Exclude<keyof LessonPlan, 'teacher' | 'subject' | 'grade' | 'students'> | 'header';