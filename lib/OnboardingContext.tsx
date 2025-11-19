"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { OnboardingState, OnboardingContextType, MandatoryTask, UserRole } from '@/types/onboarding';
import { localStorageKey } from '@/constants/global';

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

interface OnboardingProviderProps {
  children: ReactNode;
  userId: string;
  userRole: UserRole;
}

export function OnboardingProvider({ children, userId, userRole }: OnboardingProviderProps) {
  const [state, setState] = useState<OnboardingState | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize onboarding state
  useEffect(() => {
    const initializeOnboarding = () => {
      const storageKey = `onboarding_state_${userId}`;
      const hasLoggedInBeforeKey = `has_logged_in_before_${userId}`;
      
      // Check if this is first login
      const hasLoggedInBefore = localStorage.getItem(hasLoggedInBeforeKey) === 'true';
      
      // Get existing onboarding state or create new one
      const existingState = localStorage.getItem(storageKey);
      let onboardingState: OnboardingState;

      if (existingState) {
        onboardingState = JSON.parse(existingState);
        onboardingState.isFirstLogin = false;
      } else {
        // Create new onboarding state for first-time user
        onboardingState = {
          userId,
          role: userRole,
          hasCompletedOnboarding: false,
          hasCompletedTour: false,
          isFirstLogin: !hasLoggedInBefore,
          isTourRunning: !hasLoggedInBefore, // Start tour automatically on first login
          tasks: getDefaultTasksForRole(userRole),
          completedTasks: [],
          tourSteps: [],
          lastUpdated: new Date().toISOString()
        };
      }

      setState(onboardingState);
      setIsLoading(false);
    };

    initializeOnboarding();
  }, [userId, userRole]);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    if (state) {
      const storageKey = `onboarding_state_${userId}`;
      localStorage.setItem(storageKey, JSON.stringify(state));
    }
  }, [state, userId]);

  const markTaskComplete = (taskId: string) => {
    if (!state) return;

    setState(prevState => {
      if (!prevState) return prevState;

      const updatedCompletedTasks = [...prevState.completedTasks];
      if (!updatedCompletedTasks.includes(taskId)) {
        updatedCompletedTasks.push(taskId);
      }

      const updatedTasks = prevState.tasks.map(task => 
        task.id === taskId ? { ...task, completed: true } : task
      );

      const allTasksCompleted = updatedTasks.every(task => task.completed);

      return {
        ...prevState,
        tasks: updatedTasks,
        completedTasks: updatedCompletedTasks,
        hasCompletedOnboarding: allTasksCompleted,
        lastUpdated: new Date().toISOString()
      };
    });
  };

  const markOnboardingComplete = () => {
    if (!state) return;

    setState(prevState => {
      if (!prevState) return prevState;

      return {
        ...prevState,
        hasCompletedOnboarding: true,
        lastUpdated: new Date().toISOString()
      };
    });
  };

  const markTourComplete = () => {
    if (!state) return;

    setState(prevState => {
      if (!prevState) return prevState;

      return {
        ...prevState,
        hasCompletedTour: true,
        lastUpdated: new Date().toISOString()
      };
    });
  };

  const resetOnboarding = () => {
    const storageKey = `onboarding_state_${userId}`;
    localStorage.removeItem(storageKey);
    
    // setState(prevState => {
    //   if (!prevState) return prevState;

    //   return {
    //     ...prevState,
    //     hasCompletedOnboarding: false,
    //     hasCompletedTour: false,
    //     completedTasks: [],
    //     tasks: getDefaultTasksForRole(userRole),
    //     lastUpdated: new Date().toISOString()
    //   };
    // });
    window.location.reload();

  };

  const startTour = () => {
    if (!state) return;
    
    setState(prevState => {
      if (!prevState) return prevState;
      
      return {
        ...prevState,
        isTourRunning: true,
        lastUpdated: new Date().toISOString()
      };
    });
  };

  const skipTour = () => {
    if (!state) return;
    
    setState(prevState => {
      if (!prevState) return prevState;
      
      return {
        ...prevState,
        isTourRunning: false,
        hasCompletedTour: true,
        lastUpdated: new Date().toISOString()
      };
    });
  };

  const stopTour = () => {
    if (!state) return;
    
    setState(prevState => {
      if (!prevState) return prevState;
      
      return {
        ...prevState,
        isTourRunning: false,
        lastUpdated: new Date().toISOString()
      };
    });
  };

  const getRemainingTasks = (): MandatoryTask[] => {
    if (!state) return [];
    return state.tasks.filter(task => !task.completed);
  };

  const getCompletedTasks = (): MandatoryTask[] => {
    if (!state) return [];
    return state.tasks.filter(task => task.completed);
  };

  const getProgressPercentage = (): number => {
    if (!state || state.tasks.length === 0) return 0;
    const completedCount = state.completedTasks.length;
    return Math.round((completedCount / state.tasks.length) * 100);
  };

  const isTaskCompleted = (taskId: string): boolean => {
    if (!state) return false;
    return state.completedTasks.includes(taskId);
  };

  const contextValue: OnboardingContextType = {
    state,
    isLoading,
    markTaskComplete,
    markOnboardingComplete,
    markTourComplete,
    resetOnboarding,
    startTour,
    skipTour,
    stopTour,
    getRemainingTasks,
    getCompletedTasks,
    getProgressPercentage,
    isTaskCompleted
  };

  return (
    <OnboardingContext.Provider value={contextValue}>
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
}

// Helper function to get default tasks for each role
function getDefaultTasksForRole(role: UserRole): MandatoryTask[] {
  const commonTasks: MandatoryTask[] = [
    {
      id: 'change_password',
      title: 'Change Your Password',
      description: 'Update your password for security',
      completed: false,
      action: {
        type: 'navigate',
        target: `/${role}/profile`,
        label: 'Go to Profile'
      },
      priority: 'high'
    }
  ];

  switch (role) {
    case 'school_admin':
      return [
        ...commonTasks,
        {
          id: 'school_admin_create_teacher',
          title: 'Create a Teacher',
          description: 'Add at least one teacher to your school',
          completed: false,
          action: {
            type: 'navigate',
            target: '/school_admin/teachers',
            label: 'Go to Teachers'
          },
          priority: 'high'
        },
        {
          id: 'school_admin_create_student',
          title: 'Create a Student',
          description: 'Add at least one student to your school',
          completed: false,
          action: {
            type: 'navigate',
            target: '/school_admin/students',
            label: 'Go to Students'
          },
          priority: 'high'
        }
      ];

    case 'teacher':
      return [
        ...commonTasks,
        {
          id: 'teacher_add_student',
          title: 'Add a Student',
          description: 'Create at least one student profile before setting up classes',
          completed: false,
          action: {
            type: 'navigate',
            target: '/teacher/students',
            label: 'Go to Students'
          },
          priority: 'high'
        },
        {
          id: 'teacher_create_class',
          title: 'Create a Class',
          description: 'Set up your first class for teaching',
          completed: false,
          action: {
            type: 'navigate',
            target: '/teacher/classes',
            label: 'Go to Classes'
          },
          priority: 'high'
        }
      ];

    default:
      return commonTasks;
  }
}

