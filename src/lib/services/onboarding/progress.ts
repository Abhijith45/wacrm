import type { OnboardingChecklist } from "./checklist";
import { OnboardingStageEnum } from "@/types";

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

  /**
   * Automatically maps completed checklist steps and CRM counts to the current onboarding stage.
   */
  static getActiveStage(
    checklist: OnboardingChecklist,
    conversationsCount: number = 0,
    dealsCount: number = 0
  ): OnboardingStageEnum {
    if (OnboardingProgressService.isComplete(checklist)) {
      return OnboardingStageEnum.COMPLETED;
    }
    if (checklist.firstPipelineCreated || checklist.firstAutomationCreated || conversationsCount > 0 || dealsCount > 0) {
      return OnboardingStageEnum.FIRST_ACTIVITY;
    }
    if (checklist.contactsImported) {
      return OnboardingStageEnum.CRM_INITIALIZED;
    }
    if (checklist.channelsConnected) {
      return OnboardingStageEnum.WHATSAPP_CONNECTED;
    }
    if (checklist.teamInvited) {
      return OnboardingStageEnum.TEAM_SETUP;
    }
    if (checklist.ownerLoggedIn) {
      return OnboardingStageEnum.PROFILE_SETUP;
    }
    return OnboardingStageEnum.INVITATION_SENT;
  }
}
