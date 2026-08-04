import { createLeadActivity } from "@/lib/leads/repository";

export class OnboardingActivityService {
  /**
   * Records a specific onboarding step milestone in the Unified Activity Timeline.
   */
  static async logOnboardingStep(
    leadId: string,
    stepName: string,
    notes: string,
    operatorId: string
  ): Promise<void> {
    try {
      // Maps step names to timeline activities
      await createLeadActivity(
        leadId,
        "note_added",
        `[Onboarding Milestone] ${stepName}: ${notes}`,
        {
          system_event: "onboarding_step_completed",
          step_name: stepName,
          notes,
        },
        operatorId
      );
    } catch (error) {
      console.error(`[OnboardingActivityService] Failed to log step "${stepName}":`, error);
      // Fail silently to prevent interrupting core business flows
    }
  }
}
