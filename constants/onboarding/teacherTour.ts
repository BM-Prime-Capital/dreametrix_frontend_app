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
    target: '[data-tour="digital-library-menu"]',
    content: 'Access the Digital Library to find educational resources, materials, and content to enhance your teaching.',
    title: 'Digital Library',
    placement: 'right',
    spotlightPadding: 0,
  },
  {
    target: '[data-tour="plan-menu"]',
    content: 'Plan your lessons and create comprehensive lesson plans. Organize your teaching schedule and curriculum.',
    title: 'Plan',
    placement: 'right',
    spotlightPadding: 0,
  },
  {
    target: '[data-tour="teach-menu"]',
    content: 'Access your teaching tools and resources. Deliver engaging lessons and manage your classroom activities.',
    title: 'Teach',
    placement: 'right',
    spotlightPadding: 0,
  },
  {
    target: '[data-tour="test-prep-menu"]',
    content: 'Prepare your students for tests and exams. Access test preparation materials and resources.',
    title: 'Test Prep',
    placement: 'right',
    spotlightPadding: 0,
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
