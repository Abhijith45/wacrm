import type { OnboardingChecklist } from "./checklist";

export class OnboardingProgressService {
  /**
   * Calculates the onboarding completion percentage based on checklist states.
   */
  static calculateCompletionPercentage(checklist: OnboardingChecklist): number {
    const steps = Object.values(checklist);
    if (steps.length === 0) return 0;

    const completed = steps.filter((step) => step === true).length;
    return Math.round((completed / steps.length) * 100);
  }

  /**
   * Evaluates if all steps are completed.
   */
  static isComplete(checklist: OnboardingChecklist): boolean {
    return Object.values(checklist).every((step) => step === true);
  }
}
