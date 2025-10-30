"use client";

import React, { useState, useEffect } from 'react';
import Joyride, { CallBackProps, STATUS, EVENTS } from 'react-joyride';
import { useOnboarding } from '@/hooks/useOnboarding';
import { OnboardingStep, TourConfig } from '@/types/onboarding';

interface OnboardingTourProps {
  steps: OnboardingStep[];
  run?: boolean;
  onComplete?: () => void;
  onSkip?: () => void;
}

export function OnboardingTour({ 
  steps, 
  run = false, 
  onComplete, 
  onSkip 
}: OnboardingTourProps) {
  const { state, markTourComplete, skipTour, stopTour } = useOnboarding();
  const [isRunning, setIsRunning] = useState(run);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    // Use context state if available, otherwise use prop
    if (state) {
      // Only start the tour if it's supposed to run and hasn't started yet
      if (state.isTourRunning && !hasStarted) {
        const timer = setTimeout(() => {
          console.log('Starting tour, setting running state to true');
          setIsRunning(true);
          setHasStarted(true);
        }, 500);
        return () => clearTimeout(timer);
      } else if (!state.isTourRunning && hasStarted) {
        console.log('Tour stopped by context, setting running state to false');
        setIsRunning(false);
        setHasStarted(false);
      }
    } else {
      setIsRunning(run);
    }
  }, [run, state, hasStarted]);

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status, type, index, action } = data;

    console.log('Tour callback:', { status, type, index, action });

    if (type === EVENTS.TARGET_NOT_FOUND) {
      // If target is not found, continue to next step or finish tour
      console.warn(`Tour target not found for step ${index}, continuing to next step`);
      console.log('Available elements with data-tour:', document.querySelectorAll('[data-tour]'));
      
      // If this is the last step and target not found, finish the tour
      if (index === steps.length - 1) {
        stopTour();
        onComplete?.();
      }
      return;
    }

    // Handle tour completion
    if (([STATUS.FINISHED, STATUS.SKIPPED] as string[]).includes(status)) {
      console.log('Tour finished or skipped:', status);
      setIsRunning(false);
      setHasStarted(false);
      
      if (status === STATUS.FINISHED) {
        stopTour();
        onComplete?.();
      } else if (status === STATUS.SKIPPED) {
        skipTour();
        onSkip?.();
      }
    }
    // Don't handle EVENTS.STEP_AFTER - let the tour continue naturally
  };

  const tourConfig: TourConfig = {
    steps,
    continuous: true,
    showProgress: true,
    showSkipButton: true,
    styles: {
      options: {
        primaryColor: '#2563eb', // blue-600
        backgroundColor: '#ffffff',
        textColor: '#1f2937', // gray-800
        overlayColor: 'rgba(0, 0, 0, 0.4)',
        spotlightShadow: '0 0 20px rgba(37, 99, 235, 0.3)',
        beaconSize: 40,
        zIndex: 1000,
      },
    },
  };

  return (
    <Joyride
      {...tourConfig}
      callback={handleJoyrideCallback}
      run={isRunning}
      locale={{
        back: 'Back',
        close: 'Close',
        last: 'Finish',
        next: 'Next',
        skip: 'Skip Tour',
      }}
      floaterProps={{
        disableAnimation: true,
      }}
      tooltipComponent={({ tooltipProps, primaryProps, backProps, skipProps, closeProps, index, size, step, isLastStep }) => (
        <div
          {...tooltipProps}
          className="bg-white rounded-lg shadow-lg border border-gray-200 p-6 max-w-sm"
        >
          {step.title && (
            <div className="text-lg font-semibold text-gray-900 mb-2">
              {step.title}
            </div>
          )}
          <div className="text-sm text-gray-600 mb-4">
            {step.content}
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {index > 0 && (
                <button
                  {...backProps}
                  className="px-3 py-1 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Back
                </button>
              )}
              <button
                {...skipProps}
                className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700"
              >
                Skip Tour
              </button>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">
                {index + 1} of {size}
              </span>
              <button
                {...primaryProps}
                className="px-4 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                {isLastStep ? 'Finish' : 'Next'}
              </button>
            </div>
          </div>
        </div>
      )}
    />
  );
}
