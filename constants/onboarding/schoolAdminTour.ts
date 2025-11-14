import { OnboardingStep } from '@/types/onboarding';

export const schoolAdminTourSteps: OnboardingStep[] = [
  {
    target: 'body',
    content: 'Welcome to your School Admin Dashboard! This tour will help you get familiar with the key features and complete your setup.',
    title: 'Welcome to Dreametrix',
    placement: 'center',
    disableBeacon: true,
  },
  {
    target: '[data-tour="dashboard-menu"]',
    content: 'View your school dashboard with key metrics and overview of your school\'s activities.',
    title: 'Dashboard',
    placement: 'right',
  },
  {
    target: '[data-tour="students-menu"]',
    content: 'Manage all your students. Add new students, view their profiles, and track their academic progress.',
    title: 'Students',
    placement: 'right',
  },
  {
    target: '[data-tour="teachers-menu"]',
    content: 'Manage your teaching staff. Add teachers, assign them to classes, and track their performance.',
    title: 'Teachers',
    placement: 'right',
  },
  {
    target: '[data-tour="classes-menu"]',
    content: 'View and manage all classes in your school. Create new classes, assign teachers, and organize students.',
    title: 'Classes',
    placement: 'right',
  },
  {
    target: 'body',
    content: 'Great! You\'ve completed the tour. Now let\'s work on setting up your school by completing a few essential tasks.',
    title: 'Tour Complete!',
    placement: 'center',
  },
];

export const schoolAdminTourConfig = {
  steps: schoolAdminTourSteps,
  continuous: true,
  showProgress: true,
  showSkipButton: true,
};
