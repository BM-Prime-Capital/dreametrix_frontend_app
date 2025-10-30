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
    target: '[data-tour="sidebar"]',
    content: 'Use the sidebar to navigate between different teaching tools. Each section is designed to support your teaching workflow.',
    title: 'Navigation',
    placement: 'right',
  },
  {
    target: 'body',
    content: 'Your dashboard shows key metrics like active classes, subjects, assignments, and pending reviews. This gives you a quick overview of your teaching workload.',
    title: 'Dashboard Overview',
    placement: 'center',
  },
  {
    target: 'body',
    content: 'The AI Assistant helps you stay on top of important tasks like parent communication and upcoming exams. It provides smart insights to improve your teaching.',
    title: 'AI Assistant',
    placement: 'center',
  },
  {
    target: 'body',
    content: 'Quick Actions let you perform common tasks like creating assignments, viewing reports, and communicating with parents. Everything you need is just a click away.',
    title: 'Quick Actions',
    placement: 'center',
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
