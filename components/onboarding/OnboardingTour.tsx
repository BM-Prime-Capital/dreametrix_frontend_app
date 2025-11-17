"use client";

import React, { useState, useEffect, useRef } from 'react';
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
  const { state, skipTour, stopTour } = useOnboarding();
  const [isRunning, setIsRunning] = useState(run);
  const [hasStarted, setHasStarted] = useState(false);
  const currentStepIndexRef = useRef<number>(-1);
  const scrollContainerRef = useRef<HTMLElement | null>(null);
  const scrollListenerRef = useRef<((event: Event) => void) | null>(null);

  const detachScrollListener = () => {
    if (scrollContainerRef.current && scrollListenerRef.current) {
      scrollContainerRef.current.removeEventListener('scroll', scrollListenerRef.current);
    }
    scrollContainerRef.current = null;
    scrollListenerRef.current = null;
  };

  const resolveTargetElement = (target?: string | HTMLElement) => {
    if (!target) return null;
    if (typeof target === 'string') {
      if (target === 'body') return null;
      return document.querySelector(target) as HTMLElement | null;
    }
    return target;
  };

  const getScrollContainer = (targetElement: HTMLElement) => {
    const scrollAreaViewport = targetElement.closest('[data-radix-scroll-area-viewport]') as HTMLElement | null;
    if (scrollAreaViewport) return scrollAreaViewport;

    let parent = targetElement.parentElement;
    while (parent && parent !== document.body) {
      const { overflowY } = window.getComputedStyle(parent);
      if (overflowY === 'auto' || overflowY === 'scroll') {
        return parent;
      }
      parent = parent.parentElement;
    }
    return null;
  };

  const isTargetWithinViewport = (targetElement: HTMLElement, container: HTMLElement | null, padding = 48) => {
    const rect = targetElement.getBoundingClientRect();
    if (!container) {
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
      return rect.top >= padding && rect.bottom <= viewportHeight - padding;
    }

    const containerRect = container.getBoundingClientRect();
    return (
      rect.top >= containerRect.top + padding &&
      rect.bottom <= containerRect.bottom - padding
    );
  };

  const scrollTargetIntoView = (
    targetElement: HTMLElement,
    container: HTMLElement | null
  ) => {
    if (isTargetWithinViewport(targetElement, container)) {
      return Promise.resolve();
    }

    if (container) {
      targetElement.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'nearest',
      });
    } else {
      const rect = targetElement.getBoundingClientRect();
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
      const centeredOffset = rect.top + window.scrollY - Math.max((viewportHeight - rect.height) / 2, 0);
      window.scrollTo({
        top: Math.max(centeredOffset, 0),
        behavior: 'smooth',
      });
    }

    return new Promise<void>((resolve) => {
      let checks = 0;
      const maxChecks = 30;

      const verifyVisibility = () => {
        if (
          isTargetWithinViewport(targetElement, container, 24) ||
          checks >= maxChecks
        ) {
          setTimeout(() => resolve(), 100);
          return;
        }

        checks += 1;
        requestAnimationFrame(verifyVisibility);
      };

      requestAnimationFrame(verifyVisibility);
    });
  };

  const waitForScrollIdle = (container: HTMLElement | Window | Document) => {
    return new Promise<void>((resolve) => {
      let timeoutId: ReturnType<typeof setTimeout> | null = null;

      const handleScroll = () => {
        if (timeoutId) clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          detach();
          resolve();
        }, 80);
      };

      const detach = () => {
        if (container instanceof Window || container instanceof Document) {
          window.removeEventListener('scroll', handleScroll, true);
        } else {
          container.removeEventListener('scroll', handleScroll);
        }
      };

      if (container instanceof Window || container instanceof Document) {
        window.addEventListener('scroll', handleScroll, true);
      } else {
        container.addEventListener('scroll', handleScroll, { passive: true });
      }

      handleScroll();
    });
  };

  const updateSpotlightForTarget = (targetElement: HTMLElement) => {
    const spotlight = document.querySelector('.react-joyride__spotlight') as HTMLElement | null;
    if (!spotlight) return;

    const rect = targetElement.getBoundingClientRect();
    spotlight.style.position = 'fixed';
    spotlight.style.left = `${rect.left}px`;
    spotlight.style.top = `${rect.top}px`;
    spotlight.style.width = `${rect.width}px`;
    spotlight.style.height = `${rect.height}px`;
    spotlight.style.boxSizing = 'border-box';
    spotlight.style.margin = '0';
    spotlight.style.padding = '0';
    spotlight.style.borderRadius = '0.5rem';
    spotlight.style.transition = 'none';
  };

  const attachScrollListenerForTarget = (targetElement: HTMLElement, container: HTMLElement | null) => {
    detachScrollListener();
    if (!container) return;

    const handler = () => {
      if (!document.body.contains(targetElement)) {
        detachScrollListener();
        return;
      }
      updateSpotlightForTarget(targetElement);
    };

    container.addEventListener('scroll', handler, { passive: true });
    scrollContainerRef.current = container;
    scrollListenerRef.current = handler;
  };

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
    return () => {
      detachScrollListener();
    };
  }, [run, state, hasStarted]);

  // Monitor spotlight position only on scroll/resize when tour is running
  useEffect(() => {
    if (!isRunning) {
      detachScrollListener();
      return;
    }

    const repositionSpotlight = () => {
      if (currentStepIndexRef.current < 0) return;
      const currentStep = steps[currentStepIndexRef.current];
      const targetElement = resolveTargetElement(currentStep?.target);
      if (!targetElement) return;
      updateSpotlightForTarget(targetElement);
    };

    // Only reposition on scroll or resize, not continuously
    window.addEventListener('scroll', repositionSpotlight, true);
    window.addEventListener('resize', repositionSpotlight);

    return () => {
      window.removeEventListener('scroll', repositionSpotlight, true);
      window.removeEventListener('resize', repositionSpotlight);
    };
  }, [isRunning, steps]);

  const resolveStepTarget = (data: CallBackProps) => {
    let targetIndex = data.index ?? 0;

    if (data.type === EVENTS.STEP_AFTER) {
      if (data.action === 'next') {
        targetIndex = Math.min(targetIndex + 1, steps.length - 1);
      } else if (data.action === 'prev') {
        targetIndex = Math.max(targetIndex - 1, 0);
      }
    }

    const stepConfig = steps[targetIndex];
    if (!stepConfig?.target || stepConfig.target === 'body') {
      return null;
    }

    return {
      targetIndex,
      target: stepConfig.target,
    };
  };

  const handleJoyrideCallback = async (data: CallBackProps) => {
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

    const shouldHandleStepChange =
      type === EVENTS.STEP_AFTER ||
      type === EVENTS.TOOLTIP ||
      type === EVENTS.STEP_BEFORE;

    if (shouldHandleStepChange) {
      const stepInfo = resolveStepTarget(data);
      if (!stepInfo) return;

      currentStepIndexRef.current = stepInfo.targetIndex;
      const targetElement = resolveTargetElement(stepInfo.target);
      if (!targetElement) return;

      const container = getScrollContainer(targetElement);
      attachScrollListenerForTarget(targetElement, container);

      await scrollTargetIntoView(targetElement, container);
      await waitForScrollIdle(container || window);

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          updateSpotlightForTarget(targetElement);
        });
      });
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
      disableScrolling={true}
      disableScrollParentFix={true}
      scrollOffset={0}
      scrollToFirstStep={true}
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
      tooltipComponent={({ tooltipProps, primaryProps, backProps, skipProps, index, size, step, isLastStep }) => (
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
