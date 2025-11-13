import { OnboardingStep } from '@/types/onboarding';

export const studentTourSteps: OnboardingStep[] = [
  {
    target: 'body',
    content: 'Welcome to your Student Dashboard! This tour will help you get familiar with the key features and navigate your academic journey.',
    title: 'Welcome to Dreametrix Student Portal',
    placement: 'center',
    disableBeacon: true,
  },
  {
    target: '[data-tour="assignments-menu"]',
    content: 'View and complete your assignments here. Stay on top of your homework and track your progress.',
    title: 'Assignments',
    placement: 'right',
  },
  {
    target: '[data-tour="polls-menu"]',
    content: 'Participate in polls and surveys. Your voice matters! Share your opinions and feedback.',
    title: 'Polls',
    placement: 'right',
  },
  {
    target: '[data-tour="relationship-menu"]',
    content: 'Manage your relationships with teachers and parents. Stay connected with your support network.',
    title: 'Relationship',
    placement: 'right',
  },
  {
    target: '[data-tour="gradebook-menu"]',
    content: 'Check your grades and academic performance. Track your progress across all subjects.',
    title: 'Gradebook',
    placement: 'right',
  },
  {
    target: '[data-tour="character-menu"]',
    content: 'View your character development and achievements. See how you\'re growing as a person.',
    title: 'Character',
    placement: 'right',
  },
  {
    target: '[data-tour="attendance-menu"]',
    content: 'Check your attendance records. Stay informed about your class participation.',
    title: 'Attendance',
    placement: 'right',
  },
  {
    target: 'body',
    content: 'Excellent! You\'ve completed the student tour. You\'re now ready to explore all the features of your dashboard.',
    title: 'Tour Complete!',
    placement: 'center',
  },
];

export const studentTourConfig = {
  steps: studentTourSteps,
  continuous: true,
  showProgress: true,
  showSkipButton: true,
};

