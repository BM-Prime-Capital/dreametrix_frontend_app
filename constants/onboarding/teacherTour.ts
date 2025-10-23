import { OnboardingStep } from '@/types/onboarding';

export const teacherTourSteps: OnboardingStep[] = [
  {
    target: 'body',
    content: 'Welcome to your Teacher Dashboard! This tour will help you get familiar with the teaching tools and complete your setup.',
    title: 'Welcome to Dreametrix Teacher Portal',
    placement: 'center',
    disableBeacon: true,
  },
  {
    target: '[data-tour="plan-section"]',
    content: 'The Plan section is where you create lesson plans, unit plans, and scope & sequence for your curriculum. This helps you organize your teaching materials.',
    title: 'Lesson Planning',
    placement: 'bottom',
  },
  {
    target: '[data-tour="teach-section"]',
    content: 'The Teach section is your active teaching workspace. Here you can conduct classes, track attendance, and manage your daily teaching activities.',
    title: 'Teaching Workspace',
    placement: 'bottom',
  },
  {
    target: '[data-tour="classes-section"]',
    content: 'Manage your classes here. Create new classes, assign students, and organize your teaching schedule.',
    title: 'Class Management',
    placement: 'bottom',
  },
  {
    target: '[data-tour="gradebook-section"]',
    content: 'Track student progress and grades in the Gradebook. You can record assessments, calculate averages, and generate progress reports.',
    title: 'Gradebook',
    placement: 'bottom',
  },
  {
    target: '[data-tour="sidebar"]',
    content: 'Use the sidebar to navigate between different teaching tools. Each section is designed to support your teaching workflow.',
    title: 'Navigation',
    placement: 'right',
  },
  {
    target: '[data-tour="profile-menu"]',
    content: 'Access your profile and settings here. Update your information, change your password, and customize your teaching preferences.',
    title: 'Profile & Settings',
    placement: 'bottom',
  },
  {
    target: 'body',
    content: 'Excellent! You\'ve completed the teacher tour. Now let\'s set up your first class to get started with teaching.',
    title: 'Tour Complete!',
    placement: 'center',
  },
];

export const teacherTourConfig = {
  steps: teacherTourSteps,
  continuous: true,
  showProgress: true,
  showSkipButton: true,
};
