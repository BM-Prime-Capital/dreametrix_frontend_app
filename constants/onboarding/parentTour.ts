import { OnboardingStep } from '@/types/onboarding';

export const parentTourSteps: OnboardingStep[] = [
  {
    target: 'body',
    content: 'Welcome to your Parent Dashboard! This tour will help you get familiar with the key features to stay connected with your child\'s education.',
    title: 'Welcome to Dreametrix Parent Portal',
    placement: 'center',
    disableBeacon: true,
  },
  {
    target: '[data-tour="assignments-menu"]',
    content: 'View your child\'s assignments and homework. Stay informed about what they need to complete.',
    title: 'Assignments',
    placement: 'right',
  },
  {
    target: '[data-tour="gradebook-menu"]',
    content: 'Check your child\'s grades and academic performance. Track their progress across all subjects.',
    title: 'Gradebook',
    placement: 'right',
  },
  {
    target: '[data-tour="relationship-menu"]',
    content: 'Manage your relationship with teachers and stay connected with your child\'s educational support network.',
    title: 'Relationship',
    placement: 'right',
  },
  {
    target: '[data-tour="attendance-menu"]',
    content: 'Monitor your child\'s attendance records. Stay informed about their class participation.',
    title: 'Attendance',
    placement: 'right',
  },
  {
    target: '[data-tour="characters-menu"]',
    content: 'View your child\'s character development and achievements. See how they\'re growing as a person.',
    title: 'Characters',
    placement: 'right',
  },
  {
    target: 'body',
    content: 'Great! You\'ve completed the parent tour. You\'re now ready to stay connected with your child\'s education.',
    title: 'Tour Complete!',
    placement: 'center',
  },
];

export const parentTourConfig = {
  steps: parentTourSteps,
  continuous: true,
  showProgress: true,
  showSkipButton: true,
};

