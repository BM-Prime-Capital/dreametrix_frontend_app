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
  const { markTourComplete, skipTour } = useOnboarding();
  const [isRunning, setIsRunning] = useState(run);

  useEffect(() => {
    setIsRunning(run);
  }, [run]);

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status, type } = data;

    if (([EVENTS.STEP_AFTER, EVENTS.TARGET_NOT_FOUND] as string[]).includes(type)) {
      // Update state to re-render our component
      setIsRunning(false);
    } else if (([STATUS.FINISHED, STATUS.SKIPPED] as string[]).includes(status)) {
      // Need to set our running state to false, so we can restart if we click start again.
      setIsRunning(false);
      
      if (status === STATUS.FINISHED) {
        markTourComplete();
        onComplete?.();
      } else if (status === STATUS.SKIPPED) {
        skipTour();
        onSkip?.();
      }
    }
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
        arrowColor: '#2563eb',
        width: 400,
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
      tooltipComponent={({ tooltipProps, primaryProps, backProps, skipProps, closeProps, index, size, step, isLastStep, tooltip }) => (
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
