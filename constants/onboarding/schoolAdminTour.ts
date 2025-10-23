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
    target: '[data-tour="students-card"]',
    content: 'Here you can manage all your students. You can add new students, view their profiles, and track their academic progress.',
    title: 'Student Management',
    placement: 'bottom',
  },
  {
    target: '[data-tour="teachers-card"]',
    content: 'This section allows you to manage your teaching staff. Add teachers, assign them to classes, and track their performance.',
    title: 'Teacher Management',
    placement: 'bottom',
  },
  {
    target: '[data-tour="classes-card"]',
    content: 'View and manage all classes in your school. You can create new classes, assign teachers, and organize students.',
    title: 'Class Management',
    placement: 'bottom',
  },
  {
    target: '[data-tour="sidebar"]',
    content: 'Use the sidebar to navigate between different sections of your dashboard. Each section has specific tools and features.',
    title: 'Navigation',
    placement: 'right',
  },
  {
    target: '[data-tour="profile-menu"]',
    content: 'Access your profile settings here. You can update your information, change your password, and manage your account preferences.',
    title: 'Profile & Settings',
    placement: 'bottom',
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
