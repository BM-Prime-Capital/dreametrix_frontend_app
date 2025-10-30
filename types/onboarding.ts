export interface MandatoryTask {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  action: {
    type: 'navigate' | 'modal' | 'external';
    target?: string;
    label: string;
  };
  priority: 'high' | 'medium' | 'low';
}

export interface OnboardingStep {
  target: string;
  content: string;
  title?: string;
  placement?: 'top' | 'bottom' | 'left' | 'right' | 'center';
  disableBeacon?: boolean;
  hideCloseButton?: boolean;
  hideFooter?: boolean;
  spotlightClicks?: boolean;
  spotlightPadding?: number;
  styles?: {
    options?: {
      primaryColor?: string;
      backgroundColor?: string;
      textColor?: string;
      overlayColor?: string;
      spotlightShadow?: string;
      beaconSize?: number;
      zIndex?: number;
    };
  };
}

export interface OnboardingState {
  userId: string;
  role: 'school_admin' | 'teacher' | 'student' | 'parent' | 'super_admin';
  hasCompletedOnboarding: boolean;
  hasCompletedTour: boolean;
  isFirstLogin: boolean;
  isTourRunning: boolean;
  tasks: MandatoryTask[];
  completedTasks: string[];
  tourSteps: OnboardingStep[];
  lastUpdated: string;
}

export interface OnboardingContextType {
  state: OnboardingState | null;
  isLoading: boolean;
  markTaskComplete: (taskId: string) => void;
  markOnboardingComplete: () => void;
  markTourComplete: () => void;
  resetOnboarding: () => void;
  startTour: () => void;
  skipTour: () => void;
  stopTour: () => void;
  getRemainingTasks: () => MandatoryTask[];
  getCompletedTasks: () => MandatoryTask[];
  getProgressPercentage: () => number;
  isTaskCompleted: (taskId: string) => boolean;
}

export interface TourConfig {
  steps: OnboardingStep[];
  continuous: boolean;
  showProgress: boolean;
  showSkipButton: boolean;
  styles: {
    options: {
      primaryColor: string;
      backgroundColor: string;
      textColor: string;
      overlayColor: string;
      spotlightShadow: string;
      beaconSize: number;
      zIndex: number;
    };
  };
}

export type UserRole = 'school_admin' | 'teacher' | 'student' | 'parent' | 'super_admin';

export interface TaskAction {
  type: 'navigate' | 'modal' | 'external';
  target?: string;
  label: string;
}
