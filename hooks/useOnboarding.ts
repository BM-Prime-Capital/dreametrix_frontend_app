import { useOnboarding as useOnboardingContext } from '@/lib/OnboardingContext';

export function useOnboarding() {
  return useOnboardingContext();
}
